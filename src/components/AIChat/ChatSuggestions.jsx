import { Sparkles } from 'lucide-react';

const suggestions = [
  "Analyze this month",
  "How can I save money?",
  "Spending insights",
  "Budget tips"
];

export default function ChatSuggestions({ onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 mt-4 justify-center">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="flex items-center gap-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 px-3 py-1.5 text-xs font-medium text-neon-cyan transition-all hover:bg-neon-cyan/20 hover:border-neon-cyan/50 hover:shadow-[0_0_10px_rgba(0,245,255,0.2)]"
        >
          <Sparkles size={12} />
          {suggestion}
        </button>
      ))}
    </div>
  );
}
