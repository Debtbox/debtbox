export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://8.213.80.85/v0.0.1/api';

// Debug API configuration
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  isDevelopment: import.meta.env?.DEV,
  environment: import.meta.env?.MODE || 'development',
};
