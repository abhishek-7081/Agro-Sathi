import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function TrendTable({ trends, selectedIdx, onSelect }) {
  return (
    <div className="bg-white rounded-[40px] shadow-premium-lg border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Commodity</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Current Price</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Average</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Price Range</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Trend</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Markets</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {trends.map((trend, idx) => {
              const isSelected = selectedIdx === idx;
              const isUp = trend.trend === 'up';
              const isDown = trend.trend === 'down';
              
              return (
                <tr 
                  key={idx} 
                  onClick={() => onSelect(idx)}
                  className={`group cursor-pointer transition-all duration-300 ${
                    isSelected ? 'bg-primary-50/50' : 'hover:bg-slate-50/80'
                  }`}
                >
                  <td className="px-8 py-6">
                     <span className={`text-sm font-black uppercase tracking-tight transition-colors ${isSelected ? 'text-primary-700' : 'text-soil-dark group-hover:text-primary-600'}`}>
                        {trend.commodity}
                     </span>
                  </td>
                  <td className="px-8 py-6">
                     <span className="text-sm font-black text-emerald-600">₹{trend.latest_price}</span>
                  </td>
                  <td className="px-8 py-6">
                     <span className="text-sm font-bold text-slate-600">₹{trend.average_price}</span>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-500">₹{trend.min_price} - ₹{trend.max_price}</span>
                        <div className="w-24 h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                           <div className="h-full bg-primary-200 rounded-full" style={{ width: '60%', marginLeft: '20%' }} />
                        </div>
                     </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      isUp ? 'bg-green-100 text-green-700' : 
                      isDown ? 'bg-rose-100 text-rose-700' : 
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {isUp ? <TrendingUp size={14} /> : isDown ? <TrendingDown size={14} /> : <Minus size={14} />}
                      {trend.trend}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                     <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-50 text-slate-400 text-xs font-black border border-slate-100">
                        {trend.markets_count}
                     </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
