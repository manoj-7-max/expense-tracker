import { useEffect, useRef, useState } from 'react';
import { Bot, Send, User, X, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const API_URL = '/api/chat';

  useEffect(() => {
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Global event listener for toggle AI
  useEffect(() => {
    const handleToggle = () => {
      // Just focus input if it's already open
      const inputEl = document.getElementById('chat-input');
      if (inputEl) inputEl.focus();
    };
    window.addEventListener('toggle-ai-chat', handleToggle);
    return () => window.removeEventListener('toggle-ai-chat', handleToggle);
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-neon-cyan/20 bg-navy-950/95 backdrop-blur-md shadow-[0_0_30px_rgba(0,245,255,0.15)] sm:w-[400px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-navy-900/50 px-4 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon-cyan/20 text-neon-cyan shadow-[0_0_10px_rgba(0,245,255,0.3)] border border-neon-cyan/30">
            <Bot size={22} />
          </div>
          <div>
            <h3 className="font-display font-bold leading-tight tracking-wide text-white">Kaasu Kanakku AI</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-mint opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-mint"></span>
              </span>
              <p className="text-[11px] text-neon-mint font-medium tracking-wider uppercase">Online</p>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="rounded-full p-2 transition hover:bg-white/10 hover:text-rose-400">
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-transparent custom-scrollbar">
        {messages.length === 0 && !loading && (
          <div className="text-center mt-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan shadow-glow">
              <Bot size={28} />
            </div>
            <h4 className="mt-5 font-display font-bold text-white text-lg tracking-wide">Hi Karthik! 👋</h4>
            <p className="mt-2 text-sm text-slate-400 max-w-[280px] mx-auto leading-relaxed">
              I'm here to help you manage your money better.
            </p>
            <ChatSuggestions onSelect={handleSend} />
          </div>
        )}
        
        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id || i} 
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${msg.role === 'user' ? 'bg-navy-700 text-slate-300' : 'bg-neon-cyan/20 text-neon-cyan shadow-glow-sm'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-neon-cyan/20 text-white rounded-tr-none border border-neon-cyan/30 shadow-[0_0_10px_rgba(0,245,255,0.1)]' 
                : 'bg-navy-800 text-slate-200 border border-white/5 shadow-sm rounded-tl-none'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </motion.div>
        ))}
        
        {loading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neon-cyan/20 text-neon-cyan shadow-glow-sm">
              <Bot size={16} />
            </div>
            <div className="flex items-center gap-1 rounded-2xl rounded-tl-none border border-white/5 bg-navy-800 px-4 py-3 shadow-sm h-[44px]">
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="h-2 w-2 rounded-full bg-neon-cyan/80" />
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="h-2 w-2 rounded-full bg-neon-cyan/80" />
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="h-2 w-2 rounded-full bg-neon-cyan/80" />
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/30 px-3 py-2 text-sm text-rose-400">
            <AlertCircle size={16} />
            <p>{error}</p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/10 bg-navy-900/80 p-4">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-navy-950 pl-4 pr-1.5 py-1.5 focus-within:border-neon-cyan/50 focus-within:shadow-[0_0_15px_rgba(0,245,255,0.1)] transition-all"
        >
          <input
            id="chat-input"
            type="text"
            placeholder="Ask about your finances..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neon-cyan text-navy-950 transition hover:bg-white hover:shadow-glow disabled:opacity-50 disabled:hover:bg-neon-cyan"
          >
            <Send size={14} className="ml-0.5" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
