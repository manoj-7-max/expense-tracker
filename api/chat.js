import { createClient } from '@supabase/supabase-js';
import { Groq } from 'groq-sdk';

// Initialize Supabase Client (without anon key, we'll use user's token directly later)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'dummy-key',
});

const SYSTEM_PROMPT = "You are Kaasu Kanakku AI, a friendly financial assistant. Analyze user expenses, income, savings, and budgets to provide practical money-saving advice. Keep responses short and simple. Use ₹ currency. Never give investment, loan, tax, or legal advice. If you detect overspending in a category, point it out. If a user asks about their balance or spending, use the provided context.";

export default async function handler(req, res) {
  // CORS Headers for local development, Vercel handles CORS in production mostly if configured, but good to have
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Authentication
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header provided' });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const userId = user.id;
  const userSupabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  // Handle GET (History)
  if (req.method === 'GET') {
    try {
      const { data: history, error: historyError } = await userSupabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (historyError) throw historyError;
      return res.status(200).json({ history });
    } catch (err) {
      console.error('History Fetch Error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Handle POST (Chat)
  if (req.method === 'POST') {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Fetch User Data
      const [
        { data: transactions },
        { data: budgets },
        { data: goals }
      ] = await Promise.all([
        userSupabase.from('transactions').select('*').order('date', { ascending: false }).limit(50),
        userSupabase.from('budgets').select('*').maybeSingle(),
        userSupabase.from('savings_goals').select('*')
      ]);

      // Fetch recent Chat History for context
      const { data: history } = await userSupabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      const sortedHistory = history ? history.reverse() : [];
      const formattedHistory = sortedHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Construct Context for AI
      let contextStr = `\n\n--- USER FINANCIAL CONTEXT ---\n`;
      if (budgets && budgets.monthly_limit > 0) {
        contextStr += `Monthly Budget Limit: ₹${budgets.monthly_limit}\n`;
      }
      if (goals && goals.length > 0) {
        contextStr += `Savings Goals:\n${goals.map(g => `- ${g.title}: ₹${g.saved_amount} / ₹${g.target_amount}`).join('\n')}\n`;
      }
      if (transactions && transactions.length > 0) {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const thisMonthTxns = transactions.filter(t => {
          const d = new Date(t.date);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });
        const totalIncome = thisMonthTxns.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
        const totalExpense = thisMonthTxns.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
        
        contextStr += `This Month's Total Income: ₹${totalIncome}\n`;
        contextStr += `This Month's Total Expenses: ₹${totalExpense}\n`;
        
        const categoryExpenses = thisMonthTxns.filter(t => t.type === 'expense').reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
          return acc;
        }, {});
        
        contextStr += `This Month's Expenses by Category:\n`;
        for (const [cat, amt] of Object.entries(categoryExpenses)) {
          contextStr += `- ${cat}: ₹${amt}\n`;
        }
        
        contextStr += `Recent Transactions:\n${transactions.slice(0, 10).map(t => `- ${t.date} | ${t.type.toUpperCase()} | ${t.category || 'N/A'} | ₹${t.amount} | ${t.note || ''}`).join('\n')}\n`;
      }
      contextStr += `--- END CONTEXT ---\n`;

      // Save User Message
      await userSupabase.from('chat_messages').insert({
        user_id: userId,
        role: 'user',
        content: message
      });

      // Call Groq API
      const messages = [
        { role: "system", content: SYSTEM_PROMPT + contextStr },
        ...formattedHistory,
        { role: "user", content: message }
      ];

      if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'dummy-key') {
        const dummyResponse = "I am a simulated assistant. Please set GROQ_API_KEY in your Vercel Environment Variables to get real financial advice. Here is the context I would have seen:\nIncome: ₹" + (contextStr.match(/Total Income: ₹(\d+)/)?.[1] || 0) + "\nExpenses: ₹" + (contextStr.match(/Total Expenses: ₹(\d+)/)?.[1] || 0);
        await userSupabase.from('chat_messages').insert({
          user_id: userId,
          role: 'assistant',
          content: dummyResponse
        });
        return res.status(200).json({ response: dummyResponse });
      }

      const completion = await groq.chat.completions.create({
        messages,
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 512,
      });

      const aiResponse = completion.choices[0]?.message?.content || "Sorry, I couldn't process that right now.";

      // Save AI Response
      await userSupabase.from('chat_messages').insert({
        user_id: userId,
        role: 'assistant',
        content: aiResponse
      });

      return res.status(200).json({ response: aiResponse });

    } catch (err) {
      console.error('Chat API Error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Handle unsupported methods
  return res.status(405).json({ error: 'Method not allowed' });
}
