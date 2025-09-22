/**
 * Environment utility functions
 */

/**
 * Check if the application is running in development mode
 * @returns {boolean} True if in development mode
 */
export const isDevelopment = (): boolean => {
  return import.meta.env?.DEV === true;
};

/**
 * Check if the application is running in production mode
 * @returns {boolean} True if in production mode
 */
export const isProduction = (): boolean => {
  return import.meta.env?.PROD === true;
};

/**
 * Get the current environment mode
 * @returns {string} 'development' | 'production' | 'test'
 */
export const getEnvironment = (): string => {
  if (isDevelopment()) return 'development';
  if (isProduction()) return 'production';
  return 'test';
};

/**
 * Check if debug logging should be enabled
 * @returns {boolean} True if debug logging is enabled
 */
export const isDebugEnabled = (): boolean => {
  return isDevelopment() || import.meta.env?.VITE_DEBUG === 'true';
};

/**
 * Get environment variable with fallback
 * @param key - Environment variable key
 * @param fallback - Fallback value if not found
 * @returns {string} Environment variable value or fallback
 */
export const getEnvVar = (key: string, fallback: string = ''): string => {
  return import.meta.env?.[key] || fallback;
};
