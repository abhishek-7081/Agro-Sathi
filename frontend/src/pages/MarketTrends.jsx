import { useState, useEffect } from 'react';
import { getPriceTrends } from '../services/market.service';
import { BarChart3, TrendingUp, Stars } from 'lucide-react';
import Loader from '../components/ui/loader';
import { useTranslation } from '../hooks/useTranslation';
import TrendStats from '../components/market/TrendStats';
import TrendTable from '../components/market/TrendTable';

export default function MarketTrends() {
  const { t } = useTranslation();
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrend, setSelectedTrend] = useState(0);

  useEffect(() => {
    loadTrends();
  }, []);

  const loadTrends = async () => {
    try {
      setLoading(true);
      const data = await getPriceTrends();
      setTrends(data);
      if (data.length > 0) setSelectedTrend(0);
    } catch (error) {
      console.error('Error loading trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentTrend = trends[selectedTrend] || {};

  return (
    <div className="min-h-screen bg-transparent py-10 px-4 animate-fade-in relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in-up">
           <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-primary-600 shadow-premium-lg text-white">
                 <BarChart3 size={32} />
              </div>
              <div>
                 <h1 className="text-3xl md:text-5xl font-black text-soil-dark tracking-tighter uppercase leading-none mb-1">
                    {t('nav.trends')}
                 </h1>
                 <p className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <Stars size={14} className="text-primary-500" />
                    {t('markets.subtitle')}
                 </p>
              </div>
           </div>
           
           {trends.length > 0 && (
              <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                 <span className="text-[10px] font-black uppercase text-slate-400 px-4">Select Commodity</span>
                 <select
                    value={selectedTrend}
                    onChange={(e) => setSelectedTrend(Number(e.target.value))}
                    className="bg-slate-50 border-none rounded-xl px-6 py-2.5 font-bold text-soil-dark focus:ring-2 focus:ring-primary-500/20 text-sm appearance-none outline-none min-w-[180px]"
                 >
                    {trends.map((t, idx) => (
                      <option key={idx} value={idx}>{t.commodity}</option>
                    ))}
                 </select>
              </div>
           )}
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
             <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
             <span className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">Analyzing Market Data...</span>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Stats Section */}
            {trends.length > 0 && (
              <TrendStats trend={currentTrend} />
            )}

            {/* Analysis Table */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
               <div className="flex items-center justify-between mb-6 px-4">
                  <h2 className="text-xl font-black text-soil-dark uppercase tracking-widest flex items-center gap-3">
                     <TrendingUp size={24} className="text-primary-600" />
                     Comprehensive Price Analysis
                  </h2>
               </div>
               <TrendTable 
                  trends={trends} 
                  selectedIdx={selectedTrend} 
                  onSelect={setSelectedTrend} 
               />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
