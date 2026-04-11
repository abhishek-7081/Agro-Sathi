import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import { Languages } from 'lucide-react';

export default function LanguageSelector() {
  const { language, setLanguage } = useContext(LanguageContext);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'mr', name: 'मराठी' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ' },
  ];

  return (
    <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200 hover:shadow-md">
      <Languages size={18} className="text-primary-600 ml-2" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-700 dark:text-gray-200 py-1 pr-8 cursor-pointer outline-none"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-white dark:bg-slate-900">
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}