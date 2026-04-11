// src/context/ThemeContext.jsx
import { createContext, useEffect, useMemo, useState } from 'react';

export const APP_THEMES = [
  { id: 'green', label: 'Green' },
  { id: 'sky', label: 'Light Blue' },
  { id: 'dark', label: 'Dark' },
];

const DEFAULT_THEME = 'green';

export const ThemeContext = createContext({
  theme: DEFAULT_THEME,
  setTheme: () => {},
  toggleTheme: () => {},
  themes: APP_THEMES,
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || DEFAULT_THEME);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-green', 'theme-sky', 'theme-dark', 'dark', 'light');
    root.classList.add(`theme-${theme}`);
    root.classList.add(theme === 'dark' ? 'dark' : 'light');
    root.dataset.theme = theme;
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const currentIndex = APP_THEMES.findIndex((item) => item.id === theme);
    const nextTheme = APP_THEMES[(currentIndex + 1) % APP_THEMES.length]?.id || DEFAULT_THEME;
    setTheme(nextTheme);
  };

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      themes: APP_THEMES,
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
