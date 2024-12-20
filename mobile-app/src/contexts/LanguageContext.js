import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import i18n from '../i18n';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState('tr');

  useEffect(() => {
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('languagePreference');
      if (savedLanguage) {
        setLocale(savedLanguage);
        i18n.locale = savedLanguage;
      } else {
        // Get device language
        const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
        const supportedLanguage = ['tr', 'en'].includes(deviceLanguage) ? deviceLanguage : 'tr';
        setLocale(supportedLanguage);
        i18n.locale = supportedLanguage;
      }
    } catch (error) {
      console.error('Error loading language preference:', error);
    }
  };

  const changeLanguage = async (newLocale) => {
    try {
      await AsyncStorage.setItem('languagePreference', newLocale);
      setLocale(newLocale);
      i18n.locale = newLocale;
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
