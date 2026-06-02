import { useEffect, useRef, useState } from 'react';
import { Bot, Send, User, X, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import ChatSuggestions from './ChatSuggestions.jsx';

export default function ChatWindow({ onClose }) {
  const { session } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  
  const token = session?.access_token;
  const API_URL = 'http://localhost:3001/api/chat'; // In production this would be relative or configurable

  useEffect(() => {
    // Fetch chat history
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_URL}/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data.history || []);
        }
      } catch (err) {
        console.error("Failed to fetch chat history", err);
      }
    };
    
    if (token) fetchHistory();
  }, [token]);

  useEffect(() => {
    // Scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (messageText) => {
    if (!messageText.trim() || loading) return;
    
    const userMsg = { role: 'user', content: messageText, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: messageText })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response');
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.response, id: Date.now() + 1 }]);
    } catch (err) {
      setError(err.message);
      // Remove the optimistic user message if we want, or just show error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-6 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:w-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-teal-600 px-4 py-3 text-white dark:border-slate-800 dark:bg-teal-900">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="font-semibold leading-tight">Kaasu Kanakku AI</h3>
            <p className="text-[10px] text-teal-100">Your Financial Advisor</p>
          </div>
        </div>
        <button onClick={onClose} className="rounded-full p-1.5 transition hover:bg-white/20">
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
        {messages.length === 0 && !loading && (
          <div className="text-center mt-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
              <Bot size={24} />
            </div>
            <h4 className="mt-4 font-medium text-slate-700 dark:text-slate-200">Hi, I'm Kaasu Kanakku AI!</h4>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              I can analyze your spending and give you money-saving advice. How can I help today?
            </p>
            <ChatSuggestions onSelect={handleSend} />
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={msg.id || i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${msg.role === 'user' ? 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300' : 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
              msg.role === 'user' 
                ? 'bg-teal-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-700 border border-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-tl-none'
            }`}>
              {/* Note: In a real app we'd use react-markdown to render the response. We keep it simple here. */}
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">
              <Bot size={16} />
            </div>
            <div className="flex items-center rounded-2xl rounded-tl-none border border-slate-100 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-800">
              <Loader2 size={16} className="animate-spin text-teal-600 dark:text-teal-400" />
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle size={16} />
            <p>{error}</p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 pl-4 pr-1.5 py-1.5 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 dark:border-slate-700 dark:bg-slate-950"
        >
          <input
            type="text"
            placeholder="Ask about your finances..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 dark:text-slate-200"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white transition hover:bg-teal-700 disabled:opacity-50 dark:bg-teal-700 dark:hover:bg-teal-600"
          >
            <Send size={14} className="ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
