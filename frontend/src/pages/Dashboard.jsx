import { useAuth } from '../context/AuthContext';
import WeatherWidget from '../components/dashboard/WeatherWidget';
import PriceSummary from '../components/dashboard/PriceSummary';
import ActiveAlerts from '../components/dashboard/ActiveAlerts';
import RecommendedSchemes from '../components/dashboard/RecommendedSchemes';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { TrendingUp, AlertCircle, Sprout, Wind, BarChart3, Calendar, Truck, DollarSign, MessageSquare } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { ROUTES } from '../lib/routes';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) {
    return (
      <div className="min-h-screen bg-cream-50 relative overflow-hidden">
        {/* Hero Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-primary-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[600px] h-[600px] bg-accent-100/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto p-4 py-24 relative z-10">
          <section className="text-center mb-20 animate-fade-in-up">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-bold uppercase tracking-widest mb-6 animate-fade-in shadow-sm">
                Agro-Sathi
                {/* {t('common.platform_name', 'Agro-Sathi Platform')} */}
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-black mb-6 text-soil-dark leading-tight tracking-tighter">
              {t('dashboard.smart_agri_title')}
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              {t('dashboard.smart_agri_subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                to="/login"
                className="btn-premium bg-primary-600 text-white shadow-premium-lg px-10 py-4 text-lg"
              >
                {t('dashboard.get_started')}
              </Link>
              <Link
                to="/register"
                className="btn-premium bg-white border-2 border-primary-100 text-primary-700 px-10 py-4 text-lg hover:border-primary-500"
              >
                {t('dashboard.sign_up')}
              </Link>
            </div>
          </section>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            {[
              { icon: TrendingUp, title: t('dashboard.feature_market_prices'), desc: t('dashboard.feature_market_desc'), color: 'from-blue-500 to-primary-600' },
              { icon: Sprout, title: t('dashboard.feature_schemes'), desc: t('dashboard.feature_schemes_desc'), color: 'from-emerald-500 to-green-600' },
              { icon: Wind, title: t('dashboard.feature_ai'), desc: t('dashboard.feature_ai_desc'), color: 'from-indigo-500 to-purple-600' },
              { icon: Truck, title: t('dashboard.feature_shipments'), desc: t('dashboard.feature_shipments_desc'), color: 'from-amber-500 to-orange-600' },
              { icon: DollarSign, title: t('dashboard.feature_calculator'), desc: t('dashboard.feature_calculator_desc'), color: 'from-teal-500 to-primary-700' },
              { icon: MessageSquare, title: t('dashboard.feature_forum'), desc: t('dashboard.feature_forum_desc'), color: 'from-slate-600 to-soil-dark' },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="agri-card p-8 group animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'both' }}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <Icon size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-soil-dark mb-3 tracking-tight group-hover:text-primary-600 transition-colors uppercase text-sm">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 py-10 relative animate-fade-in">
      <div className="container mx-auto p-4 relative z-10">
        <header className="mb-12 animate-fade-in-up">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="p-1 px-2.5 rounded-2xl bg-white border border-primary-100 shadow-agri w-fit backdrop-blur-sm">
                <h1 className="text-2xl md:text-3xl font-black text-primary-800 tracking-tight">
                  {t('dashboard.welcome_farmer', { name: user?.fullName || 'Farmer' })}
                  {/* {t('dashboard.welcome_farmer', { name: user?.fullName || 'Farmer' })} */}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                 <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200 uppercase tracking-widest shadow-sm">
                    {/* {t('dashboard.live_updates', 'Live Updates')} */}
                  Live Updates
                 </div>
              </div>
           </div>
        </header>

        {/* Quick Actions Grid */}
        <div className="mb-14">
           <div className="flex items-center justify-between mb-8 px-2">
              <h3 className="text-xl font-black text-soil-dark uppercase tracking-widest border-l-4 border-primary-600 pl-4">
                 {t('dashboard.quick_actions')}
              </h3>
           </div>
           
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-5">
              {[
                { to: ROUTES.markets, icon: BarChart3, label: t('dashboard.view_prices'), color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
                { to: ROUTES.schemes, icon: Sprout, label: t('dashboard.browse_schemes'), color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
                { to: ROUTES.chat, icon: Wind, label: t('dashboard.ask_ai'), color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' },
                { to: ROUTES.calendar, icon: Calendar, label: t('dashboard.crop_calendar'), color: 'bg-amber-50 text-amber-600 hover:bg-amber-100' },
                { to: ROUTES.shipments, icon: Truck, label: t('dashboard.track_shipments'), color: 'bg-slate-50 text-slate-600 hover:bg-slate-100' },
                { to: ROUTES.calculator, icon: DollarSign, label: t('dashboard.profit_calculator'), color: 'bg-rose-50 text-rose-600 hover:bg-rose-100' },
                { to: ROUTES.forum, icon: MessageSquare, label: t('dashboard.community_forum'), color: 'bg-teal-50 text-teal-600 hover:bg-teal-100' },
              ].map((action, i) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white border border-slate-100 hover:border-primary-400 hover:shadow-premium-lg hover:-translate-y-1.5 transition-all duration-500 text-center animate-fade-in-up h-full shadow-sm"
                  style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
                >
                  <div className={`p-4 rounded-2xl ${action.color} mb-4 transition-colors`}>
                    <action.icon size={32} strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-black text-soil-dark uppercase tracking-tighter leading-tight line-clamp-2">{action.label}</span>
                </Link>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-8 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
             <Card className="border-none shadow-premium-lg rounded-3xl overflow-hidden bg-white/95 hover:shadow-premium-xl transition-all">
                <CardHeader className="bg-slate-50 border-b border-slate-100">
                  <CardTitle className="text-base font-black text-soil-dark uppercase tracking-widest flex items-center gap-2">
                    <Wind size={18} className="text-primary-600" />
                    {t('dashboard.weather_in')} {user?.village || t('dashboard.your_area')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <WeatherWidget lat={user?.latitude} lon={user?.longitude} />
                </CardContent>
             </Card>

             <Card className="border-none shadow-premium-lg rounded-3xl overflow-hidden bg-white/95 hover:shadow-premium-xl transition-all">
                <CardHeader className="bg-slate-50 border-b border-slate-100">
                  <CardTitle className="text-base font-black text-soil-dark uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle size={18} className="text-accent" />
                    {t('dashboard.active_alerts')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ActiveAlerts />
                </CardContent>
             </Card>
          </div>

          <div className="lg:col-span-8 space-y-8 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
             <Card className="border-none shadow-premium-lg rounded-3xl overflow-hidden bg-white/95">
                <CardHeader className="bg-slate-50 border-b border-slate-100 py-6 px-8 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-black text-soil-dark uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp size={22} className="text-primary-600" />
                    {t('dashboard.today_prices')}
                  </CardTitle>
                  <Link to="/markets" className="text-primary-600 font-bold hover:underline text-sm uppercase tracking-widest">
                    {t('dashboard.view_all')}
                  </Link>
                </CardHeader>
                <CardContent className="p-8">
                  <PriceSummary state={user?.state} />
                </CardContent>
             </Card>

             <Card className="border-none shadow-premium-lg rounded-3xl overflow-hidden bg-white/95">
                <CardHeader className="bg-slate-50 border-b border-slate-100 py-6 px-8 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-black text-soil-dark uppercase tracking-widest flex items-center gap-2">
                    <Sprout size={22} className="text-primary-600" />
                    {t('dashboard.recommended_schemes')}
                  </CardTitle>
                  <Link to="/schemes" className="text-primary-600 font-bold hover:underline text-sm uppercase tracking-widest">
                    {t('dashboard.view_all')}
                  </Link>
                </CardHeader>
                <CardContent className="p-8">
                  <RecommendedSchemes state={user?.state} crops={user?.crops_grown} />
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
