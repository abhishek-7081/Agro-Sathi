import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import {
    Store,
    Sprout,
    Bell,
    CloudSun,
    TrendingUp,
    Truck,
    DollarSign,
    MessageSquare,
    ShoppingBag
} from 'lucide-react';

export default function FeaturesBar() {
    const { t } = useTranslation();
    const location = useLocation();

    const features = [
        { to: '/markets', label: t('common.market_prices'), icon: Store },
        { to: '/schemes', label: t('common.schemes'), icon: Sprout },
        { to: '/alerts', label: t('common.alerts'), icon: Bell },
        { to: '/weather-forecast', label: t('nav.weather'), icon: CloudSun },
        { to: '/prediction', label: t('dashboard.plant_disease_detection'), icon: TrendingUp },
        { to: '/crop-market', label: t('dashboard.crop_market'), icon: ShoppingBag },
        { to: '/shipments', label: t('dashboard.shipments'), icon: Truck },
        { to: '/profit-calculator', label: t('dashboard.profit_calc'), icon: DollarSign },
        { to: '/community-forum', label: t('dashboard.forum'), icon: MessageSquare },
    ];

    return (
        <div className="bg-white/50 backdrop-blur-md border-b border-slate-100 py-3 overflow-hidden group select-none relative">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth">
                    <div className="flex items-center gap-2 whitespace-nowrap border-r border-slate-200 pr-6 mr-2">
                        <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                            {t('dashboard.features_title')}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-3 min-w-max pb-1">
                        {features.map((feature, i) => {
                            const Icon = feature.icon;
                            const isActive = location.pathname === feature.to;
                            return (
                                <Link
                                    key={feature.to}
                                    to={feature.to}
                                    className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-tighter rounded-2xl transition-all duration-300 transform active:scale-95 ${
                                        isActive
                                            ? 'bg-primary-600 text-white shadow-premium'
                                            : 'text-slate-500 hover:text-primary-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100'
                                    }`}
                                    style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
                                >
                                    <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                                    {feature.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
            {/* Fade effects for horizontal scroll */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-cream-50 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-cream-50 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
}
