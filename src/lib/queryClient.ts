import { QueryClient } from '@tanstack/react-query';
import { isDevelopment } from '@/utils/environment';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Performance optimizations
      retry: false,
      refetchOnMount: 'always', // Better UX - refetch when component mounts
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      
      // Best practices for caching
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes - cache garbage collection time (formerly cacheTime)
      
      // Error handling
      retryOnMount: false,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Background behavior
      refetchInterval: false, // Disable automatic refetching
      refetchIntervalInBackground: false,
      
      // Network behavior
      networkMode: 'online',
    },
    mutations: {
      // Mutation defaults
      retry: 1,
      retryDelay: 1000,
      
      // Network behavior
      networkMode: 'online',
      
      // Error handling
      onError: (error) => {
        if (isDevelopment()) {
          console.error('Mutation error:', error);
        }
      },
    },
  },
});
