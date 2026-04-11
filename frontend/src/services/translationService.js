import api from './api';

/**
 * Fetch translation for a given text and target language from the backend.
 * Uses Sarvam AI via the backend.
 * @param {string} text - The source text to translate.
 * @param {string} targetLang - Language code (e.g., 'hi-IN', 'ta-IN').
 * @param {string} sourceLang - Source language code (default 'en-IN').
 * @returns {Promise<string>} Translated text.
 */
export async function fetchTranslation(text, targetLang, sourceLang = 'en-IN') {
  try {
    // Map short codes (en, hi) to Sarvam codes if necessary
    const langMap = {
      en: 'en-IN',
      hi: 'hi-IN',
      pa: 'pa-IN',
      ta: 'ta-IN',
    };
    
    const mappedTarget = langMap[targetLang] || targetLang;
    const mappedSource = langMap[sourceLang] || sourceLang;

    if (mappedTarget === mappedSource) return text;

    const { data } = await api.post('/ai/translate', {
      text,
      targetLang: mappedTarget,
      sourceLang: mappedSource,
    });
    
    return data.translatedText || text;
  } catch (error) {
    console.error('Translation fetch failed:', error);
    return text;
  }
}

