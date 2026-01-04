const rtlLanguages = ['ar', 'ur'];
export const setDocDirection = (lang: string) => {
  if (rtlLanguages.includes(lang)) {
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
  }
};
