import { getI18n } from 'react-i18next';
import { setCookie } from '@/utils/storage';

export const changeLanguage = (language: string) => {
  const i18n = getI18n();
  setCookie('language', language);
  void i18n.changeLanguage(language);
  document.dir = i18n.dir();
  document.documentElement.lang = i18n.language;
};
