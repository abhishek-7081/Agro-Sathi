import { User, Bot } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-400`}>
      <div className={`flex items-start gap-3 max-w-[90%] sm:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-agri ring-2 ring-white dark:ring-slate-800 ${
            isUser
              ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white'
              : 'bg-white dark:bg-slate-800 border border-primary-100 dark:border-primary-800 text-primary-600'
          }`}
        >
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>
        <div
          className={`px-5 py-3.5 rounded-2xl shadow-agri transition-all duration-300 ${
            isUser
              ? 'bg-gradient-to-br from-primary-700 to-primary-600 text-white rounded-tr-none'
              : 'glass dark:bg-slate-800/80 text-soil-light dark:text-slate-200 rounded-tl-none border-primary-100/30'
          }`}
        >
          <div className="text-[15px] leading-relaxed whitespace-pre-wrap break-words font-medium">
            {message.content}
          </div>
          <div className={`text-[10px] mt-2 font-semibold tracking-wider uppercase opacity-50 ${isUser ? 'text-white/80' : 'text-primary-800 dark:text-primary-300'}`}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
}
