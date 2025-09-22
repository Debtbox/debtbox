import { toast } from 'sonner';
import Axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { clearAuthTokens, getAuthToken, getRefreshToken, isSessionExpired } from '@/utils/secureStorage';
import { queryClient } from './queryClient';
import { API_BASE_URL } from '@/utils/const';

function authRequestInterceptor(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  const token = getAuthToken();

  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  
  // Enhanced security headers
  config.headers.Accept = 'application/json';
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  
  // Add CSRF protection
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }

  return config;
}

export const axios = Axios.create({
  baseURL: API_BASE_URL,
  paramsSerializer: {
    indexes: null,
  },
  // Increased timeout for development
  timeout: 30000,
  // Basic headers for API communication
  headers: {
    'Content-Type': 'application/json',
  },
  // Allow more status codes for better error handling
  validateStatus: (status) => status >= 200 && status < 500,
});

// Use proper typing for interceptors
axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error details:', {
        message: error.message,
        code: error.code,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
        }
      });
      toast.error(`Network error: ${error.message}`);
      return Promise.reject(error);
    }

    const { status } = error.response;

    switch (status) {
      case 400:
        // Don't show generic toast for 400 errors - let components handle specific error messages
        break;
      case 401:
        // Check if session is expired
        if (isSessionExpired()) {
          clearAuthTokens();
          queryClient.clear();
          window.location.replace('/auth/login');
          toast.error('Session expired. Please login again.');
          localStorage.clear();
        } else {
          // Try to refresh token
          const refreshToken = getRefreshToken();
          if (refreshToken) {
            // Implement token refresh logic here
            // For now, redirect to login
            clearAuthTokens();
            queryClient.clear();
            window.location.replace('/auth/login');
            toast.error('Authentication failed. Please login again.');
          }
        }
        break;
      case 403:
        // toast.error(
        //   "Access denied. You don't have permission for this action.",
        // );
        break;
      case 404:
        // toast.error('Resource not found.');
        break;
      // break;
      case 500:
        // toast.error('Server error. Please try again later.');
        break;
      // break;
      default:
        break;
      // toast.error(`An error occurred (${status}). Please try again.`);
    }

    return Promise.reject(error);
  },
);

// Export types for use in other parts of the app
export type { AxiosError, AxiosRequestConfig, AxiosResponse };
