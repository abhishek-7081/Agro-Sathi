import React from 'react';
import { Stars } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { ROUTES } from '../../lib/routes';

const FloatingActionButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  if (location.pathname === ROUTES.chat) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => navigate(ROUTES.chat)}
      className="fab-button fab-ai group relative flex h-14 w-14 items-center justify-center rounded-2xl text-white transition-all duration-300 hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4"
      title={t('common.ai_chat') || 'Open AI Chat'}
      aria-label={t('common.ai_chat') || 'Open AI Chat'}
    >
      <Stars className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
      <span className="fab-tooltip">{t('common.ai_chat') || 'AI Chat'}</span>
    </button>
  );
};

export default FloatingActionButton;
