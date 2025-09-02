import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../public/locales/en';
import ar from '../public/locales/ar';

const resources = {
  en,
  ar,
};

const i18nConfig = i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  supportedLngs: ['en', 'ar'],
});

export default i18nConfig;
