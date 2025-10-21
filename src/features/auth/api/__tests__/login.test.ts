import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { useLogin, login } from '../login';
import { mockUser, mockLoginCredentials } from '@/test/fixtures';

// Mock axios
vi.mock('@/lib/axios', () => ({
  axios: {
    post: vi.fn(),
  },
}));

// Mock language utility
vi.mock('@/utils/getLanguageFromCookies', () => ({
  getLanguageFromCookie: vi.fn(() => 'en'),
}));

describe('Login API Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => 
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  describe('login function', () => {
    it('calls axios with correct parameters', async () => {
      const { axios } = await import('@/lib/axios');
      const mockResponse = {
        data: {
          success: true,
          data: mockUser,
          message: 'Login successful',
        },
      };
      
      vi.mocked(axios.post).mockResolvedValue(mockResponse);

      const loginData = {
        nationalId: '1234567890',
        commercialRegister: '1234567890',
        iqamaId: '1234567890',
        device: {
          platform: 'web' as const,
          token: 'device-token',
        },
        password: 'password123',
      };

      await login(loginData);

      expect(axios.post).toHaveBeenCalledWith(
        '/auth/merchant/merchant-sign-in',
        loginData,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
    });

    it('returns login response data', async () => {
      const { axios } = await import('@/lib/axios');
      const mockResponse = {
        data: {
          success: true,
          data: mockUser,
          message: 'Login successful',
        },
      };
      
      vi.mocked(axios.post).mockResolvedValue(mockResponse);

      const loginData = {
        nationalId: '1234567890',
        commercialRegister: '1234567890',
        iqamaId: '1234567890',
        device: {
          platform: 'web' as const,
          token: 'device-token',
        },
        password: 'password123',
      };

      const result = await login(loginData);

      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('useLogin hook', () => {
    it('calls onSuccess with response data', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();

      // Mock successful response
      server.use(
        http.post('/api/auth/login', () => {
          return HttpResponse.json({
            success: true,
            data: mockUser,
            message: 'Login successful',
          });
        })
      );

      const { result } = renderHook(
        () => useLogin({ onSuccess, onError }),
        { wrapper }
      );

      const loginData = {
        nationalId: '1234567890',
        commercialRegister: '1234567890',
        iqamaId: '1234567890',
        device: {
          platform: 'web' as const,
          token: 'device-token',
        },
        password: 'password123',
      };

      result.current.mutate(loginData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSuccess).toHaveBeenCalledWith({
        success: true,
        data: mockUser,
        message: 'Login successful',
      });
    });

    it('calls onError with error data', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();

      // Mock error response
      server.use(
        http.post('/api/auth/login', () => {
          return HttpResponse.json(
            { success: false, message: 'Invalid credentials' },
            { status: 401 }
          );
        })
      );

      const { result } = renderHook(
        () => useLogin({ onSuccess, onError }),
        { wrapper }
      );

      const loginData = {
        nationalId: '1234567890',
        commercialRegister: '1234567890',
        iqamaId: '1234567890',
        device: {
          platform: 'web' as const,
          token: 'device-token',
        },
        password: 'wrongpassword',
      };

      result.current.mutate(loginData);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(onError).toHaveBeenCalled();
    });

    it('shows loading state during mutation', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();

      const { result } = renderHook(
        () => useLogin({ onSuccess, onError }),
        { wrapper }
      );

      expect(result.current.isPending).toBe(false);

      const loginData = {
        nationalId: '1234567890',
        commercialRegister: '1234567890',
        iqamaId: '1234567890',
        device: {
          platform: 'web' as const,
          token: 'device-token',
        },
        password: 'password123',
      };

      result.current.mutate(loginData);

      expect(result.current.isPending).toBe(true);
    });

    it('resets state after successful mutation', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();

      // Mock successful response
      server.use(
        http.post('/api/auth/login', () => {
          return HttpResponse.json({
            success: true,
            data: mockUser,
            message: 'Login successful',
          });
        })
      );

      const { result } = renderHook(
        () => useLogin({ onSuccess, onError }),
        { wrapper }
      );

      const loginData = {
        nationalId: '1234567890',
        commercialRegister: '1234567890',
        iqamaId: '1234567890',
        device: {
          platform: 'web' as const,
          token: 'device-token',
        },
        password: 'password123',
      };

      result.current.mutate(loginData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Reset the mutation
      result.current.reset();

      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isPending).toBe(false);
      expect(result.current.isError).toBe(false);
    });
  });
});
