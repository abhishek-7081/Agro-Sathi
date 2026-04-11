import { Wheat } from 'lucide-react';

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-cream-50/80 backdrop-blur-xl animate-fade-in">
       <div className="flex flex-col items-center gap-6">
          <div className="relative">
             {/* Glowing rings */}
             <div className="absolute inset-0 bg-primary-400/20 rounded-full blur-2xl animate-pulse" />
             <div className="absolute inset-0 bg-primary-200/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
             
             {/* Spinning Wheat Icon */}
             <div className="relative w-24 h-24 rounded-[32px] bg-white shadow-premium-lg flex items-center justify-center border border-primary-50">
                <Wheat 
                  size={48} 
                  className="text-primary-600 animate-[spin_3s_linear_infinite]" 
                  strokeWidth={1.5}
                />
             </div>
          </div>
          
          <div className="flex flex-col items-center gap-1.5 text-center">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-800 animate-pulse">
                Agro-Sathi
             </span>
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Cultivating Insights...
             </span>
          </div>
       </div>
    </div>
  );
}
