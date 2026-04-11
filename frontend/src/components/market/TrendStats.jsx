import { DollarSign, BarChart3, TrendingUp, TrendingDown, ArrowRightLeft } from 'lucide-react';

export default function TrendStats({ trend }) {
  const isUp = trend.trend === 'up';

  const stats = [
    { 
      label: 'Current Price', 
      value: `₹${trend.latest_price}`, 
      icon: DollarSign, 
      color: 'bg-emerald-50 text-emerald-600',
      glow: 'shadow-emerald-100'
    },
    { 
      label: 'Average Price', 
      value: `₹${trend.average_price}`, 
      icon: BarChart3, 
      color: 'bg-blue-50 text-blue-600',
      glow: 'shadow-blue-100'
    },
    { 
      label: 'Price Change', 
      value: `${isUp ? '+' : ''}${trend.percentChange}%`, 
      icon: isUp ? TrendingUp : TrendingDown, 
      color: isUp ? 'bg-green-50 text-green-600' : 'bg-rose-50 text-rose-600',
      glow: isUp ? 'shadow-green-100' : 'shadow-rose-100'
    },
    { 
      label: 'Price Range', 
      value: `₹${trend.min_price} - ₹${trend.max_price}`, 
      icon: ArrowRightLeft, 
      color: 'bg-indigo-50 text-indigo-600',
      glow: 'shadow-indigo-100'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className={`p-8 rounded-[32px] bg-white border border-slate-100 shadow-premium-lg hover:shadow-premium-xl transition-all duration-500 group relative overflow-hidden`}
          style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}
        >
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.color.split(' ')[1]} tracking-tight`}>{stat.value}</p>
            </div>
            <div className={`p-4 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
              <stat.icon size={24} strokeWidth={2.5} />
            </div>
          </div>
          
          {/* Subtle background icon decoration */}
          <div className={`absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500`}>
             <stat.icon size={120} strokeWidth={1} />
          </div>
        </div>
      ))}
    </div>
  );
}
