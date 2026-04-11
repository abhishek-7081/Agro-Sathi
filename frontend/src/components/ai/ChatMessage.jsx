import { User, Bot } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
      <div className={`flex items-start gap-3 max-w-[92%] sm:max-w-[85%] lg:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 ${
            isUser
              ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white'
              : 'bg-white dark:bg-slate-800 border border-primary-100 dark:border-primary-800 text-primary-600'
          }`}
        >
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>

        {/* Message Bubble Container */}
        <div className={`flex flex-col min-w-0 ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`px-5 py-3 rounded-2xl shadow-sm transition-all duration-300 break-words w-full overflow-hidden ${
              isUser
                ? 'bg-primary-700 text-white rounded-tr-none'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-primary-100/50 dark:border-slate-700'
            }`}
          >
            <div className="text-[15px] leading-relaxed whitespace-pre-wrap break-words [word-break:break-word] [overflow-wrap:anywhere]">
              {message.content}
            </div>
          </div>
          
          {/* Timestamp */}
          <div className="text-[11px] mt-1.5 font-medium text-slate-500 flex items-center gap-1.5 px-1">
             {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
}
