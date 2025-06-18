import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Language = 'en' | 'ru';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: () => {},
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hostname === 'account.acceptancegroup.org' || window.location.hostname === 'localhost') {
        setLanguage('ru');
      } else {
        setLanguage('en');
      }
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext); 