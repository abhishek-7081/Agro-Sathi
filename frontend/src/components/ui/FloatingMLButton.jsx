import { Bot } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { ROUTES } from '../../lib/routes';

export default function FloatingMLButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const translatedLabel = t('ml_button.label');
  const translatedTooltip = t('ml_button.tooltip');
  const label = translatedLabel === 'ml_button.label' ? 'Plant disease detection' : translatedLabel;
  const tooltip = translatedTooltip === 'ml_button.tooltip' ? label : translatedTooltip;
  
  const isHidden = [ROUTES.prediction].includes(location.pathname);

  if (isHidden) return null;

  return (
    <button
      type="button"
      onClick={() => navigate(ROUTES.prediction)}
      className="fab-button fab-ml group relative flex h-14 w-14 items-center justify-center rounded-2xl text-white transition-all duration-300 hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4"
      aria-label={label}
      title={tooltip}
    >
      <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent-500 animate-ping" />
      <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent-500" />
      <Bot className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
      <span className="fab-tooltip">{tooltip}</span>
    </button>
  );
}
