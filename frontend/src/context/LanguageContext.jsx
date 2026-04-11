import { createContext, useState, useEffect, useCallback } from 'react';
import { enFlat } from '../i18n/locales/en/index';
import { fetchTranslation } from '../services/translationService';

export const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
  translate: (key) => key,
  loading: false,
});

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const [cache, setCache] = useState(() => {
    try {
      const saved = localStorage.getItem('translationCache');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('translationCache', JSON.stringify(cache));
  }, [cache]);

  const t = useCallback((key) => {
    if (!key) return '';
    
    // 1. Check pre-flattened English first
    if (enFlat[key]) {
        if (language === 'en') return enFlat[key];
        
        const cacheKey = `${language}:${key}`;
        if (cache[cacheKey]) return cache[cacheKey];
        
        // Fetch background translation for other languages
        fetchTranslation(enFlat[key], language).then(translated => {
            setCache(prev => ({ ...prev, [cacheKey]: translated }));
        });
        return enFlat[key];
    }

    // 2. Fallback to raw text or cache
    const cacheKey = `${language}:${key}`;
    if (cache[cacheKey]) return cache[cacheKey];

    if (language !== 'en') {
      fetchTranslation(key, language).then(translated => {
        setCache(prev => ({ ...prev, [cacheKey]: translated }));
      });
    }

    return key;
  }, [language, cache]);

  const translate = useCallback((text) => t(text), [t]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translate, loading: false }}>
      {children}
    </LanguageContext.Provider>
  );
};
