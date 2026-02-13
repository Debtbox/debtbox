import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Login } from './Login';

vi.mock('../api/login', () => ({
  useLogin: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

vi.mock('@/utils/deviceToken', () => ({
  getDeviceToken: () =>
    Promise.resolve({ token: 'test', p256dh: 'test', auth: 'test' }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>{children}</BrowserRouter>
  </QueryClientProvider>
);

describe('Login', () => {
  it('renders login form with required fields', () => {
    render(<Login />, { wrapper });

    expect(
      screen.getByRole('textbox', { name: /common.fields.identificationNumber/i }),
    ).toBeInTheDocument();
    expect(
      document.getElementById('password'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /common.buttons.signIn/i }),
    ).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    render(<Login />, { wrapper });

    const submitButton = screen.getByRole('button', {
      name: /common.buttons.signIn/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('common.validation.identificationNumberRequired'),
      ).toBeInTheDocument();
    });
  });
});
