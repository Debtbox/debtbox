import Cookies from 'js-cookie';

const prefix = 'debtbox_';
const secureOptions = {
  secure: true, // Only send over HTTPS
  sameSite: 'strict' as const, // CSRF protection
  httpOnly: false, // Allow JS access (needed for SPA)
  expires: 1, // 1 day expiration
};

const getCookie = (name: string) => {
  return Cookies.get(`${prefix}${name}`);
};

const setCookie = (name: string, data: string, options?: Partial<typeof secureOptions>) => {
  Cookies.set(`${prefix}${name}`, data, {
    ...secureOptions,
    ...options,
  });
};

const clearCookie = (name: string) => {
  Cookies.remove(`${prefix}${name}`, { path: '/' });
};

// Secure token storage with automatic refresh
export const setAuthToken = (token: string, refreshToken?: string) => {
  setCookie('access-token', token, { expires: 1 }); // 1 day
  if (refreshToken) {
    setCookie('refresh-token', refreshToken, { expires: 7 }); // 7 days
  }
};

export const getAuthToken = () => {
  return getCookie('access-token');
};

export const getRefreshToken = () => {
  return getCookie('refresh-token');
};

export const clearAuthTokens = () => {
  clearCookie('access-token');
  clearCookie('refresh-token');
};

// Session timeout management
export const setSessionTimeout = () => {
  const timeout = Date.now() + (30 * 60 * 1000); // 30 minutes
  setCookie('session-timeout', timeout.toString(), { expires: 1 });
};

export const getSessionTimeout = () => {
  const timeout = getCookie('session-timeout');
  return timeout ? parseInt(timeout) : null;
};

export const isSessionExpired = () => {
  const timeout = getSessionTimeout();
  return timeout ? Date.now() > timeout : true;
};

export { getCookie, setCookie, clearCookie };
