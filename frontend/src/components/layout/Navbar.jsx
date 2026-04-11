import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LanguageSelector from '../ui/LanguageSelector';
import ThemeToggle from '../ui/ThemeToggle';
import { Menu, X, LogOut, User, Wheat, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { useTranslation } from '../../hooks/useTranslation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: t('common.dashboard') },
    { to: '/markets', label: t('common.market_prices') },
    { to: '/schemes', label: t('common.schemes') },
    { to: '/ai-chat', label: t('common.ai_chat') },
    { to: '/market-trends', label: t('nav.trends') },
    { to: '/weather-forecast', label: t('nav.weather') },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled 
          ? 'glass shadow-premium-lg h-16' 
          : 'bg-transparent h-20'
      }`}
    >
      <div className="container mx-auto h-full px-4">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="p-2 rounded-xl bg-primary-600 shadow-agri group-hover:shadow-agri-glow transition-all duration-300">
              <Wheat size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black text-soil-dark tracking-tighter uppercase">
              {t('common.agro_sathi', 'Agro-Sathi')}
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 text-sm font-bold tracking-tight rounded-xl transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-500 hover:text-primary-600 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Action section */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
               <ThemeToggle />
               <LanguageSelector />
            </div>
            
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 p-1.5 pr-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all group">
                  <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-sm font-bold">
                    {user?.fullName?.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-slate-400 leading-none mb-0.5">{t('common.farmer', 'Farmer')}</span>
                    <span className="text-sm font-bold text-soil-dark leading-none">
                       {user?.fullName?.split(' ')[0]}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                  title={t('common.logout')}
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-bold px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all font-heading"
                >
                  {t('common.login')}
                </Link>
                <Link
                  to="/register"
                  className="btn-premium bg-primary-600 text-white text-sm"
                >
                  {t('common.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-xl text-primary-700 hover:bg-primary-50 transition-all duration-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden fixed inset-0 top-20 bg-white/95 backdrop-blur-xl transition-all duration-500 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}>
          <div className="container mx-auto px-4 py-8 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center justify-between p-5 rounded-3xl font-bold transition-all ${
                  location.pathname === link.to
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
                <ChevronDown size={18} className="-rotate-90 opacity-40" />
              </Link>
            ))}
            
            <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col gap-6">
               <div className="flex items-center justify-between px-4">
                  <span className="font-bold text-slate-400 uppercase text-xs">{t('common.settings', 'Settings')}</span>
                  <div className="flex gap-4">
                    <ThemeToggle />
                    <LanguageSelector />
                  </div>
               </div>
               {user ? (
                 <div className="flex flex-col gap-4">
                    <Link 
                      to="/profile" 
                      className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50"
                      onClick={() => setIsOpen(false)}
                    >
                       <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-black text-xl">
                          {user?.fullName?.charAt(0)}
                       </div>
                       <div>
                          <p className="font-black text-soil-dark">{user?.fullName}</p>
                          <p className="text-xs font-bold text-slate-400">{t('common.farmer_account', 'Farmer Account')}</p>
                       </div>
                    </Link>
                    <Button
                      variant="destructive"
                      onClick={handleLogout}
                      className="rounded-2xl py-6 font-bold"
                    >
                      <LogOut size={20} className="mr-2" />
                      {t('common.logout')}
                    </Button>
                 </div>
               ) : (
                 <div className="grid grid-cols-2 gap-4">
                    <Link to="/login" className="btn-premium bg-slate-100 text-slate-600 text-center" onClick={() => setIsOpen(false)}>{t('common.login')}</Link>
                    <Link to="/register" className="btn-premium bg-primary-600 text-white text-center" onClick={() => setIsOpen(false)}>{t('common.register')}</Link>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
