import { http, HttpResponse } from 'msw';

// Base API URL - adjust according to your API
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const handlers = [
  // Auth endpoints
  http.post(`${API_BASE_URL}/auth/login`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
      },
    });
  }),

  http.post(`${API_BASE_URL}/auth/register`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        user: {
          id: '2',
          email: 'newuser@example.com',
          name: 'New User',
          role: 'user',
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
      },
    });
  }),

  http.post(`${API_BASE_URL}/auth/logout`, () => {
    return HttpResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  }),

  http.get(`${API_BASE_URL}/auth/me`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        avatar: null,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    });
  }),

  // Dashboard endpoints
  http.get(`${API_BASE_URL}/dashboard/stats`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        totalTransactions: 150,
        totalAmount: 50000,
        pendingTransactions: 5,
        completedTransactions: 145,
        monthlyGrowth: 12.5,
      },
    });
  }),

  http.get(`${API_BASE_URL}/dashboard/transactions`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        transactions: [
          {
            id: '1',
            amount: 1000,
            status: 'completed',
            type: 'payment',
            description: 'Test transaction',
            createdAt: '2024-01-01T00:00:00Z',
          },
          {
            id: '2',
            amount: 500,
            status: 'pending',
            type: 'refund',
            description: 'Test refund',
            createdAt: '2024-01-02T00:00:00Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      },
    });
  }),

  // Notifications endpoints
  http.get(`${API_BASE_URL}/notifications`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        notifications: [
          {
            id: '1',
            title: 'New Transaction',
            message: 'You have received a new payment',
            type: 'info',
            read: false,
            createdAt: '2024-01-01T00:00:00Z',
          },
          {
            id: '2',
            title: 'Payment Completed',
            message: 'Your payment has been processed',
            type: 'success',
            read: true,
            createdAt: '2024-01-02T00:00:00Z',
          },
        ],
        unreadCount: 1,
      },
    });
  }),

  http.patch(`${API_BASE_URL}/notifications/:id/read`, () => {
    return HttpResponse.json({
      success: true,
      message: 'Notification marked as read',
    });
  }),

  // Settings endpoints
  http.get(`${API_BASE_URL}/settings/profile`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        phone: '+1234567890',
        address: '123 Test Street',
        city: 'Test City',
        country: 'Test Country',
      },
    });
  }),

  http.put(`${API_BASE_URL}/settings/profile`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: '1',
        email: 'test@example.com',
        name: 'Updated User',
        phone: '+1234567890',
        address: '123 Test Street',
        city: 'Test City',
        country: 'Test Country',
      },
    });
  }),

  // Error handlers for testing error scenarios
  http.get(`${API_BASE_URL}/error/500`, () => {
    return new HttpResponse(null, { status: 500 });
  }),

  http.get(`${API_BASE_URL}/error/404`, () => {
    return new HttpResponse(null, { status: 404 });
  }),

  http.get(`${API_BASE_URL}/error/network`, () => {
    return HttpResponse.error();
  }),
];
