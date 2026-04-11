import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar, Sprout, Droplets, Sun, Wind, ChevronRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function CropCalendar() {
  const { t } = useTranslation();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedCrop, setSelectedCrop] = useState('all');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const crops = [
    { id: 'wheat', name: 'Wheat', season: 'Rabi', months: [10, 11, 0, 1, 2, 3] },
    { id: 'rice', name: 'Rice', season: 'Kharif', months: [5, 6, 7, 8, 9] },
    { id: 'cotton', name: 'Cotton', season: 'Kharif', months: [5, 6, 7, 8, 9, 10] },
    { id: 'sugarcane', name: 'Sugarcane', season: 'Year-round', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
    { id: 'maize', name: 'Maize', season: 'Kharif', months: [5, 6, 7, 8] },
    { id: 'pulses', name: 'Pulses', season: 'Rabi', months: [9, 10, 11, 0, 1, 2] },
  ];

  const activities = {
    wheat: {
      10: { sowing: 'Sow seeds', irrigation: 'Initial irrigation', fertilizer: 'Apply NPK' },
      11: { irrigation: 'Regular irrigation', pest: 'Monitor for pests' },
      0: { irrigation: 'Critical irrigation stage', fertilizer: 'Top dressing' },
      1: { irrigation: 'Maintain soil moisture', pest: 'Check for diseases' },
      2: { harvest: 'Harvest time', irrigation: 'Stop irrigation' },
    },
    rice: {
      5: { sowing: 'Nursery preparation', irrigation: 'Prepare paddy fields' },
      6: { transplant: 'Transplant seedlings', irrigation: 'Flood fields' },
      7: { irrigation: 'Maintain water level', fertilizer: 'Apply nitrogen' },
      8: { irrigation: 'Critical stage', pest: 'Pest control' },
      9: { harvest: 'Harvest paddy', irrigation: 'Drain fields' },
    },
  };

  const filteredCrops = selectedCrop === 'all' 
    ? crops 
    : crops.filter(c => c.id === selectedCrop);

  const currentMonthActivities = filteredCrops
    .filter(crop => crop.months.includes(selectedMonth))
    .map(crop => ({
      crop: crop.name,
      season: crop.season,
      activities: activities[crop.id]?.[selectedMonth] || { general: 'Regular maintenance' }
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-green-50 py-8 animate-fade-in">
      <div className="container mx-auto p-4">
        <div className="mb-10 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-green-600 to-green-800 shadow-agri">
              <Calendar size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-soil-dark tracking-tight">
                🌾 Crop Calendar
              </h1>
              <p className="text-slate-500 text-lg font-medium">Plan and optimize your farming cycle for {months[selectedMonth]}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Month Selector */}
          <Card className="lg:col-span-12 border-none shadow-premium-lg rounded-3xl overflow-hidden animate-fade-in">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-6 px-8">
              <CardTitle className="text-xl font-bold text-soil-dark uppercase tracking-wider text-sm">Select Farming Month</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-3 items-center justify-center">
                {months.map((month, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedMonth(idx)}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 transform active:scale-95 ${
                      selectedMonth === idx
                        ? 'bg-primary-600 text-white shadow-agri-lg -translate-y-1'
                        : 'bg-white border border-slate-200 text-slate-500 hover:border-primary-400 hover:text-primary-600'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Filters */}
          <div className="lg:col-span-4 space-y-6 animate-fade-in-up">
            <Card className="border-none shadow-premium-lg rounded-3xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">Crop Filter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button
                  onClick={() => setSelectedCrop('all')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${
                    selectedCrop === 'all'
                      ? 'bg-primary-50 text-primary-700 ring-2 ring-primary-500/20'
                      : 'hover:bg-slate-50 text-slate-500'
                  }`}
                >
                  <span>All Commodities</span>
                  <ChevronRight size={18} />
                </button>
                {crops.map(crop => (
                  <button
                    key={crop.id}
                    onClick={() => setSelectedCrop(crop.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${
                      selectedCrop === crop.id
                        ? 'bg-primary-50 text-primary-700 ring-2 ring-primary-500/20'
                        : 'hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    <span>{crop.name}</span>
                    <Badge variant="secondary" className="bg-slate-100 text-[10px]">{crop.season}</Badge>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none shadow-premium-lg rounded-3xl bg-secondary-900 text-white">
              <CardContent className="p-8">
                 <div className="flex gap-4 mb-6">
                    <Sun size={24} className="text-yellow-400" />
                    <div>
                       <p className="text-xs font-bold text-secondary-400 uppercase mb-1">Seasonal Outlook</p>
                       <p className="font-bold text-xl">{months[selectedMonth]} Forecast</p>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-secondary-800/50">
                       <span className="text-sm font-medium text-secondary-300">Avg Temp</span>
                       <span className="font-bold">26-32°C</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-secondary-800/50">
                       <span className="text-sm font-medium text-secondary-300">Avg Rainfall</span>
                       <span className="font-bold">Moderate</span>
                    </div>
                 </div>
              </CardContent>
            </Card>
          </div>

          {/* Activities List */}
          <div className="lg:col-span-8 space-y-6 animate-fade-in-up md:delay-100">
             <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-2xl font-bold text-soil-dark underline decoration-primary-500 underline-offset-8">
                  Activities for {months[selectedMonth]}
                </h2>
                <Badge className="bg-primary-100 text-primary-700 hover:bg-primary-100 border-none px-4 py-1.5 rounded-full font-bold">
                  {currentMonthActivities.length} Tasks Identified
                </Badge>
             </div>

             {currentMonthActivities.length > 0 ? (
               <div className="grid grid-cols-1 gap-6">
                 {currentMonthActivities.map((item, idx) => (
                   <Card key={idx} className="border-none shadow-premium-lg rounded-3xl overflow-hidden hover:shadow-premium-xl transition-shadow group">
                     <div className="flex flex-col md:flex-row h-full">
                        <div className="md:w-1/3 bg-gradient-to-br from-primary-600 to-primary-800 p-8 flex flex-col justify-between text-white relative">
                           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                              <Sprout size={100} strokeWidth={1} />
                           </div>
                           <div className="relative z-10">
                              <p className="text-xs font-bold uppercase tracking-widest text-primary-200 mb-2">{item.season}</p>
                              <h3 className="text-3xl font-black">{item.crop}</h3>
                           </div>
                           <div className="relative z-10 p-2 bg-white/10 rounded-xl w-fit backdrop-blur-sm border border-white/5">
                              <Droplets size={24} />
                           </div>
                        </div>
                        <div className="md:w-2/3 p-8 bg-white">
                           <div className="space-y-6">
                              {Object.entries(item.activities).map(([key, value]) => (
                                <div key={key} className="flex items-start gap-4">
                                  <div className="p-2.5 rounded-xl bg-slate-50 text-primary-600 border border-slate-100 group-hover:bg-primary-50 transition-colors">
                                     <ChevronRight size={18} />
                                  </div>
                                  <div>
                                    <p className="text-xs font-black uppercase text-slate-400 mb-1 tracking-widest">{key}</p>
                                    <p className="text-lg font-bold text-soil-dark leading-tight">{value}</p>
                                  </div>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                   </Card>
                 ))}
               </div>
             ) : (
               <Card className="border-none shadow-premium-lg rounded-3xl py-20 bg-slate-50/50">
                 <CardContent className="flex flex-col items-center justify-center text-center">
                    <div className="p-6 rounded-3xl bg-slate-100 mb-6">
                       <Dropdown size={48} className="text-slate-300" />
                    </div>
                    <p className="text-xl font-bold text-slate-400 max-w-sm">No specific activities found for this combination.</p>
                    <button onClick={() => setSelectedCrop('all')} className="mt-6 text-primary-600 font-bold hover:underline">View all crops for {months[selectedMonth]}</button>
                 </CardContent>
               </Card>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Dropdown({ size, className }) {
   return <Calendar size={size} className={className} />;
}
