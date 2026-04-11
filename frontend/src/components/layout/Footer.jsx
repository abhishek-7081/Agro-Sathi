import { Link } from 'react-router-dom';
import { ArrowUpRight, Wheat } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { ROUTES } from '../../lib/routes';

export default function Footer() {
  const { t } = useTranslation();

  const quickLinks = [
    { to: ROUTES.markets, label: t('common.market_prices') },
    { to: ROUTES.schemes, label: t('common.schemes') },
    { to: ROUTES.chat, label: t('common.ai_chat') },
    { to: ROUTES.weather, label: t('nav.weather') },
  ];

  return (
    <footer className="theme-footer mt-auto border-t theme-border">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-agri">
              <Wheat size={22} />
            </div>
            <div className="max-w-xl">
              <h3 className="text-lg font-black uppercase tracking-[0.18em] theme-heading">Agro-Sathi</h3>
              <p className="mt-2 text-sm leading-6 theme-subtle">{t('footer.empower_note')}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            {quickLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="theme-footer-link inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em]"
              >
                {link.label}
                <ArrowUpRight size={14} />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t theme-border pt-4 text-xs font-semibold theme-subtle md:flex-row md:items-center md:justify-between">
          <p>{t('footer.copyright')}</p>
          <p>{t('footer.built_with_love')}</p>
        </div>
      </div>
    </footer>
  );
}
