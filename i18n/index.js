import i18n from "i18next";
import 'intl-pluralrules'
import { initReactI18next } from "react-i18next";
import * as Localization from 'expo-localization';

// the translations
const resources = {
  en: {
    translation: {
      "Welcome to React": "Welcome to React and react-i18next"
    }
  },
  fr: {
    translation: {
      "Welcome to React": "Bienvenue à React et react-i18next"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    // Get the device's locale with expo-localization
    lng: Localization.getLocales()[0].languageCode, // Will return the language code only (e.g., "en" from "en-US")
    fallbackLng: 'en', // Use English if the detected language is not available
    
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;