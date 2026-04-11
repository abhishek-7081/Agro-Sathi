// src/context/ThemeContext.jsx
import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'green';
  });

  useEffect(() => {
    // Apply theme class to html element
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'theme-green');
    
    // Add appropriate class
    if (theme === 'green') {
      root.classList.add('theme-green');
      root.classList.remove('dark');
    } else if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('theme-green');
    } else {
      root.classList.add('light');
    }
    
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'green';
      return 'light';
    });
  };

  const setSpecificTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setSpecificTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
