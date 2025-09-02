import Cookies from 'js-cookie';
const prefix = 'debtbox_';

const getCookie = (name: string) => {
  return Cookies.get(`${prefix}${name}`);
};
const setCookie = (name: string, data: string) => {
  Cookies.set(`${prefix}${name}`, data);
};
const clearCookie = (name: string) => {
  Cookies.remove(`${prefix}${name}`);
};

export { getCookie, setCookie, clearCookie };
