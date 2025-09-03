import { toast } from 'sonner';
import Axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { clearCookie, getCookie } from '@/utils/storage';
import { queryClient } from './queryClient';
import { API_BASE_URL } from '@/utils/const';

function authRequestInterceptor(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  const token = getCookie('access-token');

  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  config.headers.Accept = '*/*';

  return config;
}

export const axios = Axios.create({
  baseURL: API_BASE_URL,
  paramsSerializer: {
    indexes: null,
  },
  // Add timeout for better UX
  timeout: 10000,
  // Add default headers
  headers: {
    'Content-Type': 'application/json',
  },
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
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    const { status } = error.response;

    switch (status) {
      case 400:
        toast.error('Bad request. Please check your input.');
        break;
      case 401:
        clearCookie('access-token');
        queryClient.clear();
        window.location.replace('/auth/login');
        toast.error('Session expired. Please login again.');
        break;
      case 403:
        toast.error(
          "Access denied. You don't have permission for this action.",
        );
        break;
      case 404:
        toast.error('Resource not found.');
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error(`An error occurred (${status}). Please try again.`);
    }

    return Promise.reject(error);
  },
);

// Export types for use in other parts of the app
export type { AxiosError, AxiosRequestConfig, AxiosResponse };
