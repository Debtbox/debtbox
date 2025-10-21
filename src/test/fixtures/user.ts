// User fixtures for testing
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  avatar: null,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

export const mockAdminUser = {
  id: '2',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin',
  avatar: null,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

export const mockUsers = [
  mockUser,
  mockAdminUser,
  {
    id: '3',
    email: 'user2@example.com',
    name: 'User Two',
    role: 'user',
    avatar: null,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
];

export const mockAuthResponse = {
  success: true,
  data: {
    user: mockUser,
    token: 'mock-jwt-token',
    refreshToken: 'mock-refresh-token',
  },
};

export const mockLoginCredentials = {
  email: 'test@example.com',
  password: 'password123',
};

export const mockRegisterData = {
  email: 'newuser@example.com',
  password: 'password123',
  name: 'New User',
  confirmPassword: 'password123',
};
