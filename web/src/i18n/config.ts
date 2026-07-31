import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import en from '../../public/locales/en/translation.json';
import fr from '../../public/locales/fr/translation.json';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
};

const isTest = import.meta.env?.MODE === 'test';

if (isTest) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      supportedLngs: ['en', 'fr'],
      debug: false,
      resources,
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
      },
    });
} else {
  i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      supportedLngs: ['en', 'fr'],
      debug: import.meta.env?.DEV,
      resources,
      interpolation: {
        escapeValue: false,
      },
      backend: {
        loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}/translation.json`,
      },
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
      },
    });
}

export default i18n;
