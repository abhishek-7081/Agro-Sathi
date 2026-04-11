import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { Wheat, Mail, Shield, BookOpen, Globe } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t border-slate-100 mt-auto overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary-600 shadow-agri">
                 <Wheat className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-black text-soil-dark tracking-tighter uppercase">Agro-Sathi</h3>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed">
              {t('footer.empower_note')}
            </p>
            <div className="flex items-center gap-4">
               {[Mail, Shield, BookOpen, Globe].map((Icon, i) => (
                 <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-all border border-slate-100">
                    <Icon size={18} />
                 </a>
               ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-black text-soil-dark uppercase tracking-widest mb-6 border-l-4 border-primary-600 pl-4">{t('footer.title_quick_links')}</h4>
            <ul className="space-y-4">
              <li><Link to="/markets" className="text-slate-500 hover:text-primary-600 font-medium transition-colors">{t('common.market_prices')}</Link></li>
              <li><Link to="/schemes" className="text-slate-500 hover:text-primary-600 font-medium transition-colors">{t('common.schemes')}</Link></li>
              <li><Link to="/crop-calendar" className="text-slate-500 hover:text-primary-600 font-medium transition-colors">{t('nav.crop_calendar')}</Link></li>
              <li><Link to="/market-trends" className="text-slate-500 hover:text-primary-600 font-medium transition-colors">{t('nav.trends')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black text-soil-dark uppercase tracking-widest mb-6 border-l-4 border-primary-600 pl-4">{t('footer.title_features')}</h4>
            <ul className="space-y-4">
              <li><Link to="/ai-chat" className="text-slate-500 hover:text-primary-600 font-medium transition-colors">{t('common.ai_chat')}</Link></li>
              <li><Link to="/weather-forecast" className="text-slate-500 hover:text-primary-600 font-medium transition-colors">{t('nav.weather')}</Link></li>
              <li><Link to="/alerts" className="text-slate-500 hover:text-primary-600 font-medium transition-colors">{t('common.alerts')}</Link></li>
              <li><Link to="/profile" className="text-slate-500 hover:text-primary-600 font-medium transition-colors">{t('common.profile')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black text-soil-dark uppercase tracking-widest mb-6 border-l-4 border-primary-600 pl-4">{t('footer.title_support')}</h4>
            <ul className="space-y-4 font-medium">
              <li className="text-slate-500 hover:text-primary-600 cursor-pointer">{t('footer.help_center')}</li>
              <li className="text-slate-500 hover:text-primary-600 cursor-pointer">{t('footer.contact_us')}</li>
              <li className="text-slate-500 hover:text-primary-600 cursor-pointer">{t('footer.privacy_policy')}</li>
              <li className="text-slate-500 hover:text-primary-600 cursor-pointer">{t('footer.terms_of_service')}</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between text-sm text-slate-400 font-medium gap-4 text-center">
          <p>{t('footer.copyright')}</p>
          <div className="flex items-center gap-1">
             <span>{t('footer.built_with_love')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
