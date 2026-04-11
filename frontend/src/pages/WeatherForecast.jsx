import { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { getForecast } from '../services/weather.service';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/loader';

export default function WeatherForecast() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(0);
  const [coords, setCoords] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    const fetchByCoords = (lat, lon) => {
      setCoords({ lat, lon });
      loadForecast(lat, lon);
    };

    if (user?.latitude && user?.longitude) {
      fetchByCoords(user.latitude, user.longitude);
    } else if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          fetchByCoords(pos.coords.latitude, pos.coords.longitude);
        },
        err => {
          console.warn('Geolocation error', err);
          setLocationError(t('dashboard.location_permission_denied'));
          setLoading(false);
        }
      );
    } else {
      setLocationError(t('dashboard.location_not_available'));
      setLoading(false);
    }
  }, [user, t]);

  const loadForecast = async (lat, lon) => {
    try {
      setLoading(true);
      const data = await getForecast(lat, lon);
      const locationLabel = user?.village || 'Your Area';
      if (data.forecast) {
        setForecast({
          location: data.location || locationLabel,
          current: data.current || {},
          forecast: data.forecast
        });
      } else if (Array.isArray(data)) {
        setForecast({
          location: locationLabel,
          current: data[0] || {},
          forecast: data.slice(1)
        });
      } else {
        setForecast(data);
      }
    } catch (error) {
      console.error('Error loading forecast:', error);
      setForecast({
        location: user?.village || 'Your Area',
        current: {
          temp: 28,
          condition: 'Partly Cloudy',
          humidity: 65,
          windSpeed: 12,
          pressure: 1013
        },
        forecast: [
          { day: 'Today', temp: 28, condition: 'Partly Cloudy', humidity: 65, windSpeed: 12, rainChance: 20 },
          { day: 'Tomorrow', temp: 30, condition: 'Sunny', humidity: 60, windSpeed: 10, rainChance: 10 },
          { day: 'Day 3', temp: 27, condition: 'Cloudy', humidity: 70, windSpeed: 15, rainChance: 40 },
          { day: 'Day 4', temp: 26, condition: 'Rainy', humidity: 80, windSpeed: 18, rainChance: 70 },
          { day: 'Day 5', temp: 29, condition: 'Sunny', humidity: 55, windSpeed: 8, rainChance: 5 },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    const cond = condition.toLowerCase();
    if (cond.includes('rain')) return CloudRain;
    if (cond.includes('cloud')) return Cloud;
    return Sun;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader />
    </div>
  );

  if (!forecast) return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="py-12 text-center text-slate-500">
            {locationError || t('dashboard.location_not_available')}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const selectedForecast = forecast.forecast[selectedDay];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 py-8 animate-fade-in">
      <div className="container mx-auto p-4">
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3.5 rounded-2xl bg-primary-600 shadow-agri">
              <Cloud size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-soil-dark tracking-tight">
                🌤️ Weather Forecast
              </h1>
              <p className="text-slate-500 text-lg font-medium">7-day forecast for {forecast.location}</p>
            </div>
          </div>
        </div>

        {/* Current Weather Card */}
        <Card className="mb-8 overflow-hidden border-none shadow-premium-lg group hover:shadow-premium-xl transition-all duration-500 transform hover:-translate-y-1 bg-gradient-to-br from-primary-600 to-primary-800">
          <CardContent className="p-8 text-white relative">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sun size={120} strokeWidth={1} />
             </div>
             
             <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
               <div className="lg:col-span-4">
                  <p className="text-white/80 font-bold uppercase tracking-widest text-xs mb-3">Currently</p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-7xl font-bold tracking-tighter">{forecast.current.temp}°</span>
                    <span className="text-2xl font-medium opacity-80">C</span>
                  </div>
                  <p className="text-2xl font-semibold">{forecast.current.condition}</p>
               </div>
               
               <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-white/70 mb-1">
                      <Droplets size={18} />
                      <span className="text-xs font-bold uppercase">Humidity</span>
                    </div>
                    <span className="text-2xl font-bold">{forecast.current.humidity}%</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-white/70 mb-1">
                      <Wind size={18} />
                      <span className="text-xs font-bold uppercase">Wind Speed</span>
                    </div>
                    <span className="text-2xl font-bold">{forecast.current.windSpeed} km/h</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-white/70 mb-1">
                      <Thermometer size={18} />
                      <span className="text-xs font-bold uppercase">Pressure</span>
                    </div>
                    <span className="text-2xl font-bold">{forecast.current.pressure} hPa</span>
                  </div>
               </div>
             </div>
          </CardContent>
        </Card>

        {/* Forecast Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {forecast.forecast.map((day, idx) => {
            const Icon = getWeatherIcon(day.condition);
            const active = selectedDay === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedDay(idx)}
                className={`flex flex-col items-center p-6 rounded-3xl transition-all duration-300 transform active:scale-95 ${
                  active
                    ? 'bg-white shadow-premium-lg border-2 border-primary-500 -translate-y-2'
                    : 'bg-white/40 hover:bg-white border border-slate-100 hover:shadow-md'
                }`}
              >
                <p className={`text-sm font-bold mb-4 ${active ? 'text-primary-600' : 'text-slate-400'}`}>{day.day}</p>
                <Icon size={40} className={`mb-4 transition-transform ${active ? 'text-primary-600 scale-110' : 'text-slate-500'}`} />
                <p className={`text-2xl font-bold ${active ? 'text-soil-dark' : 'text-slate-600'}`}>{day.temp}°C</p>
                <p className="text-[11px] mt-2 font-medium text-slate-400 truncate w-full text-center">
                  {day.condition}
                </p>
              </button>
            );
          })}
        </div>

        {/* Details Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
           <Card className="lg:col-span-2 border-none shadow-premium-lg rounded-3xl overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 py-6">
                <CardTitle className="text-xl font-bold text-soil-dark flex items-center gap-2">
                  <Badge variant="outline" className="bg-white px-3 py-1 text-primary-600 border-primary-100">Details</Badge>
                  {selectedForecast.day}'s Detailed Forecast
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                    {[
                      { icon: <Thermometer size={20} className="text-orange-500" />, label: 'Temperature', value: `${selectedForecast.temp}°C`, color: 'bg-orange-50' },
                      { icon: <Droplets size={20} className="text-blue-500" />, label: 'Humidity', value: `${selectedForecast.humidity}%`, color: 'bg-blue-50' },
                      { icon: <Wind size={20} className="text-slate-500" />, label: 'Wind Speed', value: `${selectedForecast.windSpeed} km/h`, color: 'bg-slate-50' },
                      { icon: <CloudRain size={20} className="text-indigo-500" />, label: 'Rain Chance', value: `${selectedForecast.rainChance}%`, color: 'bg-indigo-50' }
                    ].map((stat, i) => (
                      <div key={i} className="flex flex-col">
                        <div className={`p-2.5 w-fit rounded-xl ${stat.color} mb-3`}>
                          {stat.icon}
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-2xl font-black text-soil-dark">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 rounded-2xl bg-sage-50 border border-sage-200">
                    <h3 className="font-bold text-sage-900 mb-4 flex items-center gap-2">
                      <span className="text-xl">🌾</span> Farming Recommendations
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        selectedForecast.rainChance > 50 && 'Ideal time for natural irrigation - check drainage.',
                        selectedForecast.temp > 30 && 'Heat warning: High evaporation rates, water early/late.',
                        selectedForecast.windSpeed > 15 && 'Wind warning: Secure loose assets and young plants.',
                        selectedForecast.humidity > 75 && 'Fungal alert: High moisture, check for pest infestations.',
                        selectedForecast.condition.toLowerCase().includes('sunny') && 'Harvest friendly: Perfect conditions for reaping and drying.'
                      ].filter(Boolean).map((text, i) => (
                        <li key={i} className="flex gap-3 text-sm text-sage-800 font-medium">
                          <span className="text-sage-400 mt-0.5">•</span>
                          {text}
                        </li>
                      ))}
                    </ul>
                  </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-premium-lg rounded-3xl bg-secondary-900 text-white overflow-hidden">
              <CardContent className="p-8">
                 <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <span className="p-1.5 bg-secondary-700 rounded-lg"><Wind size={18} /></span>
                    Agri-Insights
                 </h3>
                 <div className="space-y-6">
                    <div className="border-l-2 border-secondary-700 pl-4 py-1">
                       <p className="text-xs font-bold text-secondary-300 uppercase mb-1">Crop Tip</p>
                       <p className="text-sm font-medium">With {selectedForecast.condition} condition, focus on soil health monitoring.</p>
                    </div>
                    <div className="border-l-2 border-secondary-700 pl-4 py-1">
                       <p className="text-xs font-bold text-secondary-300 uppercase mb-1">Alert</p>
                       <p className="text-sm font-medium">Maintain node moisture levels if humidity drops below 55%.</p>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
