import React, { useContext } from 'react';
import { Moon, Leaf, Waves } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, setTheme, themes } = useContext(ThemeContext);

  const iconMap = {
    green: Leaf,
    sky: Waves,
    dark: Moon,
  };

  return (
    <div className="theme-toggle-shell inline-flex items-center gap-1 rounded-full border theme-border p-1.5 theme-panel">
      {themes.map((option) => {
        const Icon = iconMap[option.id] || Leaf;
        const active = option.id === theme;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setTheme(option.id)}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.18em] transition-all duration-300 ${
              active ? 'theme-toggle-active' : 'theme-toggle-inactive'
            }`}
            aria-pressed={active}
            title={option.label}
          >
            <Icon size={14} />
            <span className="hidden xl:inline">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
