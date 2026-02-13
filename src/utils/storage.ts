import Cookies from 'js-cookie';

const prefix = 'debtbox_';

/** Cookie options for production: secure (HTTPS only), sameSite (CSRF protection), path */
const getCookieOptions = () => ({
  path: '/',
  secure: import.meta.env.PROD,
  sameSite: 'lax' as const,
});

const getCookie = (name: string) => {
  return Cookies.get(`${prefix}${name}`);
};

const setCookie = (name: string, data: string) => {
  Cookies.set(`${prefix}${name}`, data, getCookieOptions());
};

const clearCookie = (name: string) => {
  Cookies.remove(`${prefix}${name}`, { path: '/' });
};

export { getCookie, setCookie, clearCookie };
