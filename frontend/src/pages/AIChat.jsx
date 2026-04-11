import { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../services/ai.service';
import ChatMessage from '../components/ai/ChatMessage';
import ChatInput from '../components/ai/ChatInput';
import QuickActions from '../components/ai/QuickActions';
import { MessageCircle, Bot, Stars } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

export default function AIChat() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const prevLengthRef = useRef(0);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      const parsed = JSON.parse(saved);
      setMessages(parsed);
      prevLengthRef.current = parsed.length;
    }
  }, []);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
    if (messages.length > prevLengthRef.current) {
      scrollToBottom();
    }
    prevLengthRef.current = messages.length;
  }, [messages]);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    const userMessage = { role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await sendMessage(text);
      const reply = response.reply || response.message || response;
      const aiMessage = {
        role: 'assistant',
        content: typeof reply === 'string' ? reply : JSON.stringify(reply),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat error:', error);
      let errorMessage = t('ai_chat.error_message');
      const errorMsg = { role: 'assistant', content: errorMessage, timestamp: new Date() };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 py-10 relative animate-fade-in overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-100/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary-200/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto p-4 relative z-10 flex flex-col h-[calc(100vh-120px)] min-h-[500px]">
        <header className="mb-4 sm:mb-8 flex items-center justify-between animate-fade-in-up">
           <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-3 sm:p-3.5 rounded-2xl bg-primary-600 shadow-premium-lg text-white">
                 <Bot className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                 <h1 className="text-2xl sm:text-3xl font-black text-soil-dark tracking-tighter uppercase leading-none mb-1">
                    {t('ai_chat.title')}
                 </h1>
                 <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest">{t('ai_chat.subtitle')}</p>
              </div>
           </div>
        </header>

        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full rounded-3xl sm:rounded-[40px] bg-white shadow-premium-xl border border-slate-100 overflow-hidden relative group">
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 scroll-smooth bg-slate-50/30">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-full py-10 sm:py-20 text-center animate-fade-in">
                <div className="p-6 sm:p-8 rounded-[30px] sm:rounded-[40px] bg-white shadow-premium-lg border border-primary-50 mb-6 sm:mb-8 relative">
                   <div className="absolute -top-3 -right-3 p-2 bg-primary-500 rounded-xl text-white shadow-lg animate-bounce duration-1000">
                      <Stars className="w-4 h-4 sm:w-5 sm:h-5" />
                   </div>
                   <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-primary-600 mb-2 mx-auto" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-soil-dark mb-4 tracking-tight max-w-xs sm:max-w-sm mx-auto">
                   {t('ai_chat.welcome_message')}
                </h3>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-8 sm:mb-10">Select a quick action to begin</p>
                <div className="w-full max-w-sm sm:max-w-3xl">
                   <QuickActions onSelect={handleSend} />
                </div>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {messages.map((msg, idx) => (
                  <div key={idx} className="animate-fade-in-up">
                    <ChatMessage message={msg} />
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start animate-fade-in pl-10 sm:pl-14">
                    <div className="flex gap-1.5 p-3 rounded-2xl bg-white shadow-sm border border-slate-100">
                       <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" />
                       <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce [animation-delay:-0.15s]" />
                       <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce [animation-delay:-0.3s]" />
                    </div>
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 sm:p-6 bg-white border-t border-slate-50 relative z-20">
            <div className="max-w-4xl mx-auto">
               <ChatInput onSend={handleSend} disabled={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
