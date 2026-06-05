import { useState, useEffect } from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';
import ChatWindow from './ChatWindow.jsx';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggle-ai-chat', handleToggle);
    return () => window.removeEventListener('toggle-ai-chat', handleToggle);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-neon-cyan text-navy-950 shadow-[0_0_20px_rgba(0,245,255,0.5)] transition-all hover:scale-105 hover:bg-white active:scale-95 animate-[pulse_2s_infinite]"
        aria-label="Toggle AI Financial Advisor"
      >
        <Sparkles 
          size={24} 
          className="absolute transition-all duration-300 group-hover:scale-110 group-hover:opacity-0"
        />
        <MessageSquare 
          size={24} 
          className="absolute scale-50 opacity-0 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100" 
        />
        
        {/* Unread badge or indicator */}
        {!isOpen && (
          <span className="absolute right-0 top-0 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-white border border-neon-cyan"></span>
          </span>
        )}
      </button>

      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
    </>
  );
}
