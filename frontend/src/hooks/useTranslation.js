import { useContext, useCallback } from 'react';
import { LanguageContext } from '../context/LanguageContext';

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }

  const { t: contextT, language, setLanguage } = context;

  /**
   * Enhanced t function with interpolation support
   */
  const t = useCallback((key, options) => {
    let text = contextT(key);
    
    if (options && typeof options === 'object') {
      Object.keys(options).forEach(optKey => {
        text = text.replace(`{{${optKey}}}`, options[optKey]);
      });
    }
    
    return text;
  }, [contextT]);

  return {
    t,
    i18n: {
      language,
      changeLanguage: setLanguage
    }
  };
};

export default useTranslation;

