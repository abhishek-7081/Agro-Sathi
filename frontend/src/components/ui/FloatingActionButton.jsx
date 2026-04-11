import React from 'react';
import { Stars } from 'lucide-react';


const FloatingActionButton = () => {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        type="button"
        className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-agri-lg hover:shadow-card-hover focus:outline-none focus:ring-4 focus:ring-primary-500/30 transition-all duration-500 transform hover:scale-110 active:scale-90 border-2 border-white/20 backdrop-blur-sm"
        title="AI Disease Prediction (Coming Soon)"
      >
        <div className="absolute inset-0 rounded-full bg-primary-400 opacity-0 group-hover:opacity-20 animate-ping duration-1000"></div>
        <div className="relative z-10">
          <Stars className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
        </div>
        
      <div className="absolute right-20 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
          <div className="bg-soil-dark border border-white/10 text-white px-4 py-2 rounded-agri shadow-2xl flex items-center gap-2 whitespace-nowrap">
            <span className="font-semibold text-sm">Predict Crop Disease</span>
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-soil-dark rotate-45 border-r border-t border-white/10"></div>
          </div>
        </div>

        
        {/* Radial Glow */}
        <div className="absolute -inset-4 bg-primary-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </button>
    </div>
  );
};

export default FloatingActionButton;
