import React, { useContext } from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <Moon size={20} className="hover:text-indigo-500 transition-colors" />
      ) : (
        <Sun size={20} className="hover:text-yellow-400 transition-colors" />
      )}
    </button>
  );
};

export default ThemeToggle;
