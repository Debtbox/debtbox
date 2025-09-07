import { getCookie } from './storage';

export const getLanguageFromCookie = () => {
  return getCookie('language') || 'en';
};
