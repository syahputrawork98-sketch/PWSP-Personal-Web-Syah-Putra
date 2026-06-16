import React, { createContext, useContext, useState } from 'react';
import { translations } from '../i18n';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    const stored = localStorage.getItem('pw_locale');
    return (stored === 'EN' || stored === 'ID') ? stored : 'EN';
  });

  const changeLanguage = (newLocale) => {
    if (newLocale === 'EN' || newLocale === 'ID') {
      setLocale(newLocale);
      localStorage.setItem('pw_locale', newLocale);
    }
  };

  const t = (path) => {
    const keys = path.split('.');
    let result = translations[locale];
    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        return path;
      }
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
