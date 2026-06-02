import { useState } from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';
import ChatWindow from './ChatWindow.jsx';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg shadow-teal-600/30 transition-all hover:scale-105 hover:bg-teal-700 active:scale-95 dark:bg-teal-700 dark:shadow-teal-900/50 dark:hover:bg-teal-600"
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
        
        {/* Unread badge or indicator could go here */}
        {!isOpen && (
          <span className="absolute right-0 top-0 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-300 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-teal-400"></span>
          </span>
        )}
      </button>

      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
    </>
  );
}
