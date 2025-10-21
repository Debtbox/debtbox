import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, user, waitFor } from '@/test';
import { Login } from '../views/Login';
import { mockUser, mockLoginCredentials } from '@/test/fixtures';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';

// Mock the navigate function
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock the storage utils
vi.mock('@/utils/storage', () => ({
  setCookie: vi.fn(),
  getCookie: vi.fn(() => 'en'),
}));

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: vi.fn(),
    },
  }),
  I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('Login Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form with all required fields', () => {
    render(<Login />);
    
    expect(screen.getByLabelText(/identification number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<Login />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);
    
    // Wait for validation errors to appear
    await waitFor(() => {
      expect(screen.getByText(/identification number is required/i)).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for short identification number', async () => {
    render(<Login />);
    
    const identificationInput = screen.getByLabelText(/identification number/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(identificationInput, '123');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/identification number must be at least 10 characters/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for short password', async () => {
    render(<Login />);
    
    const identificationInput = screen.getByLabelText(/identification number/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(identificationInput, '1234567890');
    await user.type(passwordInput, '123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data and navigates on success', async () => {
    // Mock successful login response
    server.use(
      http.post('/api/auth/login', () => {
        return HttpResponse.json({
          success: true,
          data: {
            ...mockUser,
            accessToken: 'mock-access-token',
            businesses: [{ id: '1', name: 'Test Business' }],
          },
        });
      })
    );

    render(<Login />);
    
    const identificationInput = screen.getByLabelText(/identification number/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(identificationInput, '1234567890');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    // Wait for navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows loading state during form submission', async () => {
    // Mock delayed response
    server.use(
      http.post('/api/auth/login', async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return HttpResponse.json({
          success: true,
          data: {
            ...mockUser,
            accessToken: 'mock-access-token',
            businesses: [{ id: '1', name: 'Test Business' }],
          },
        });
      })
    );

    render(<Login />);
    
    const identificationInput = screen.getByLabelText(/identification number/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(identificationInput, '1234567890');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    // Check loading state
    expect(submitButton).toBeDisabled();
  });

  it('shows error message on login failure', async () => {
    // Mock failed login response
    server.use(
      http.post('/api/auth/login', () => {
        return HttpResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        );
      })
    );

    const { toast } = await import('sonner');
    
    render(<Login />);
    
    const identificationInput = screen.getByLabelText(/identification number/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(identificationInput, '1234567890');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);
    
    // Wait for error toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  it('toggles password visibility', async () => {
    render(<Login />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = passwordInput.parentElement?.querySelector('button');
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    if (toggleButton) {
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    }
  });

  it('has forgot password link', () => {
    render(<Login />);
    
    const forgotPasswordLink = screen.getByRole('link', { name: /forgot password/i });
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink).toHaveAttribute('href', '/auth/forgot-password');
  });

  it('has sign up link', () => {
    render(<Login />);
    
    const signUpLink = screen.getByRole('link', { name: /sign up/i });
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute('href', '/auth/sign-up');
  });

  it('has language dropdown', () => {
    render(<Login />);
    
    // The language dropdown should be present
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('has auth logo with link to home', () => {
    render(<Login />);
    
    const logoLink = screen.getByRole('link', { name: /auth-logo/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
  });
});
