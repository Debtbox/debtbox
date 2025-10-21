import { http, HttpResponse } from 'msw';

// Helper function to create a delayed response
export const createDelayedResponse = <T>(data: T, delay: number = 1000) => {
  return new Promise<Response>((resolve) => {
    setTimeout(() => {
      resolve(new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      }));
    }, delay);
  });
};

// Helper function to create an error response
export const createErrorResponse = (status: number, message: string) => {
  return HttpResponse.json(
    { success: false, message },
    { status }
  );
};

// Helper function to create a success response
export const createSuccessResponse = <T>(data: T) => {
  return HttpResponse.json({
    success: true,
    data,
  });
};

// Helper function to create a paginated response
export const createPaginatedResponse = <T>(
  items: T[],
  page: number = 1,
  limit: number = 10,
  total?: number
) => {
  const totalItems = total || items.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = items.slice(startIndex, endIndex);

  return HttpResponse.json({
    success: true,
    data: {
      items: paginatedItems,
      pagination: {
        page,
        limit,
        total: totalItems,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    },
  });
};

// Helper function to create a mock user
export const createMockUser = (overrides: Partial<any> = {}) => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  avatar: null,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

// Helper function to create a mock transaction
export const createMockTransaction = (overrides: Partial<any> = {}) => ({
  id: '1',
  amount: 1000,
  status: 'completed',
  type: 'payment',
  description: 'Test transaction',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

// Helper function to create a mock notification
export const createMockNotification = (overrides: Partial<any> = {}) => ({
  id: '1',
  title: 'Test Notification',
  message: 'This is a test notification',
  type: 'info',
  read: false,
  createdAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

// Helper function to create a mock API error
export const createMockApiError = (message: string, status: number = 400) => ({
  success: false,
  message,
  status,
  timestamp: new Date().toISOString(),
});
