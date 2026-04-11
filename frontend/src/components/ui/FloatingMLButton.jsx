import { Bot } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';

export default function FloatingMLButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  // Don't show the button if already on the prediction or chat pages
  const isHidden = ['/prediction', '/chat'].includes(location.pathname);

  if (isHidden) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
       <button
          onClick={() => navigate('/prediction')}
          className="group relative flex items-center justify-center p-4 rounded-full bg-primary-600 text-white shadow-agri-lg hover:shadow-teal-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
          aria-label={t('ml_button.label') || 'Predict Disease'}
       >
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full animate-ping" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full" />
          
          <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
          
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-soil-dark text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none after:content-[''] after:absolute after:-right-1 after:top-1/2 after:-translate-y-1/2 after:border-l-[6px] after:border-l-soil-dark after:border-y-4 after:border-y-transparent">
             {t('ml_button.tooltip') || 'AI Predictions'}
          </div>
       </button>
    </div>
  );
}
