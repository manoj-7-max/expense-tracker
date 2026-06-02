import { Sparkles } from 'lucide-react';

const suggestions = [
  "How can I save money?",
  "Analyze this month",
  "Where am I overspending?",
  "Budget tips"
];

export default function ChatSuggestions({ onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-800 transition hover:bg-teal-100 dark:border-teal-900/50 dark:bg-teal-900/30 dark:text-teal-300 dark:hover:bg-teal-900/50"
        >
          <Sparkles size={12} />
          {suggestion}
        </button>
      ))}
    </div>
  );
}
