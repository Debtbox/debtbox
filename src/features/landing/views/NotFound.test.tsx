import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NotFound } from './NotFound';

// Mock Header and Footer to avoid complex dependencies
vi.mock('../components/Header', () => ({
  default: () => <header data-testid="header">Header</header>,
}));
vi.mock('../components/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

describe('NotFound', () => {
  it('renders 404 heading and go home link', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>,
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Go to Home/i })).toHaveAttribute(
      'href',
      '/',
    );
  });
});
