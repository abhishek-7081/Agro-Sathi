import { useTranslation } from '../../hooks/useTranslation';

export default function QuickActions({ onSelect }) {
  const { t } = useTranslation();

  const actions = [
    { label: t('ai_chat.quick_actions.weather'), query: 'What is the weather forecast for my location?', icon: '🌤️' },
    { label: t('ai_chat.quick_actions.wheat_prices'), query: 'What are the latest wheat prices?', icon: '📊' },
    { label: t('ai_chat.quick_actions.pest_control'), query: 'How to control pests in tomato plants?', icon: '🐛' },
    { label: t('ai_chat.quick_actions.pm_kisan'), query: 'Tell me about PM-KISAN scheme', icon: '🎁' },
    { label: t('nav.crop_calendar'), query: 'What crops should I plant this month?', icon: '📅' },
    { label: 'Fertilizer advice', query: 'What fertilizers should I use for rice cultivation?', icon: '🌱' },
    { label: t('nav.trends'), query: 'Show me market trends for cotton', icon: '📈' },
    { label: 'Irrigation tips', query: 'Best irrigation practices for wheat', icon: '💧' },
  ];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-3xl mx-auto">
      {actions.map((action, i) => (
        <button
          key={i}
          onClick={() => onSelect(action.query)}
          className="bg-white hover:bg-primary-50 border border-slate-100 hover:border-primary-200 p-4 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-premium flex flex-col items-center gap-3 animate-fade-in-up"
          style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
        >
          <span className="text-3xl filter drop-shadow-sm">{action.icon}</span>
          <span className="text-xs font-black text-soil-dark uppercase tracking-tighter text-center leading-tight">{action.label}</span>
        </button>
      ))}
    </div>
  );
}