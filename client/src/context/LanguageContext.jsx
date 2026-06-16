import React, { createContext, useContext, useState } from 'react';
import { translations } from '../i18n';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    const stored = localStorage.getItem('pw_locale');
    return (stored === 'EN' || stored === 'ID' || stored === 'JA') ? stored : 'EN';
  });

  const changeLanguage = (newLocale) => {
    if (newLocale === 'EN' || newLocale === 'ID' || newLocale === 'JA') {
      setLocale(newLocale);
      localStorage.setItem('pw_locale', newLocale);
    }
  };

  const t = (path) => {
    const keys = path.split('.');
    
    // Attempt with active locale
    let result = translations[locale];
    let found = true;
    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        found = false;
        break;
      }
    }
    
    if (found) {
      return result;
    }
    
    // Fallback to EN if active locale did not resolve
    if (locale !== 'EN') {
      let enResult = translations['EN'];
      let enFound = true;
      for (const key of keys) {
        if (enResult && enResult[key] !== undefined) {
          enResult = enResult[key];
        } else {
          enFound = false;
          break;
        }
      }
      if (enFound) {
        return enResult;
      }
    }
    
    return path;
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
