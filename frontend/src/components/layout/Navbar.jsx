import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Menu, X, LogOut, Wheat, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageSelector from '../ui/LanguageSelector';
import ThemeToggle from '../ui/ThemeToggle';
import { Button } from '../ui/button';
import { PRIMARY_NAV_ROUTES, ROUTES } from '../../lib/routes';

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

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = useMemo(
    () =>
      PRIMARY_NAV_ROUTES.map((item) => ({
        ...item,
        label: t(item.labelKey),
      })),
    [t]
  );

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login);
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${scrolled ? 'glass border-b theme-border shadow-premium-lg' : 'bg-transparent'
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link to={ROUTES.home} className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-agri">
              <Wheat size={22} strokeWidth={2.4} />
            </div>
            <div>
              {/* <p className="text-[10px] font-black uppercase tracking-[0.28em] theme-subtle">Smart Agriculture</p> */}
              <p className="text-lg font-black uppercase tracking-[0.08em] theme-heading">Agro-Sathi</p>
            </div>
          </Link>

          <div className="hidden xl:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em] transition-all duration-300 ${isActive ? 'theme-brand-chip' : 'theme-nav-link'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden xl:flex items-center gap-1">
            <ThemeToggle />
            <LanguageSelector />

            {user ? (
              <>
                <Link to={ROUTES.profile} className="theme-panel-muted flex items-center gap-3 rounded-full px-3 py-2 transition-all">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-sm font-black text-white">
                    {user?.fullName?.charAt(0) || 'F'}
                  </div>
                  <div className="pr-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] theme-subtle">{t('common.farmer', 'Farmer')}</p>
                    <p className="text-sm font-bold theme-heading">{user?.fullName?.split(' ')[0] || 'Farmer'}</p>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full p-3 theme-subtle transition-colors hover:bg-rose-50 hover:text-rose-600"
                  title={t('common.logout')}
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to={ROUTES.login} className="rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.16em] theme-border theme-heading">
                  {t('common.login')}
                </Link>
                <Link to={ROUTES.register} className="btn-premium bg-primary-600 text-white text-xs uppercase tracking-[0.16em]">
                  {t('common.register')}
                </Link>
              </div>
            )}
          </div>


          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="xl:hidden rounded-2xl p-3 theme-panel text-primary-700"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <div
          className={`xl:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[80vh] pb-4 opacity-100' : 'max-h-0 opacity-0'
            }`}>
          <div className="theme-panel mx-auto mb-4 flex flex-col gap-3 rounded-[28px] border theme-border p-4 shadow-premium-lg">
            <div className="flex items-center justify-between gap-3">
              <ThemeToggle />
              <LanguageSelector />
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-black uppercase tracking-[0.14em] transition-all ${location.pathname === link.to ? 'theme-brand-chip' : 'theme-nav-link'
                  }`}
              >
                {link.label}
                <ChevronRight size={16} />
              </Link>
            ))}

            {user ? (
              <div className="mt-2 flex flex-col gap-3 border-t theme-border pt-3">
                <Link to={ROUTES.profile} className="theme-panel-muted rounded-2xl px-4 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] theme-subtle">{t('common.profile')}</p>
                  <p className="mt-1 text-sm font-bold theme-heading">{user?.fullName || 'Farmer'}</p>
                </Link>
                <Button variant="danger" onClick={handleLogout} className="rounded-2xl py-3">
                  <LogOut size={16} />
                  {t('common.logout')}
                </Button>
              </div>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-3 border-t theme-border pt-3">
                <Link to={ROUTES.login} className="rounded-2xl border px-4 py-3 text-center text-xs font-black uppercase tracking-[0.16em] theme-border theme-heading">
                  {t('common.login')}
                </Link>
                <Link to={ROUTES.register} className="btn-premium bg-primary-600 text-center text-white text-xs uppercase tracking-[0.16em]">
                  {t('common.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
