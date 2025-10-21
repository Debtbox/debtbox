import { describe, it, expect, vi } from 'vitest';
import { render, screen, user } from '@/test';
import Button from '../Button';

describe('Button Component', () => {
  it('renders with text', () => {
    render(<Button text="Click me" />);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button text="Click me" onClick={handleClick} />);
    
    const button = screen.getByRole('button', { name: 'Click me' });
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    render(<Button text="Click me" onClick={handleClick} disabled />);
    
    const button = screen.getByRole('button', { name: 'Click me' });
    await user.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(<Button text="Loading" isLoading />);
    
    const button = screen.getByRole('button', { name: 'Loading' });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('renders with icon', () => {
    const icon = <span data-testid="icon">🚀</span>;
    render(<Button text="With Icon" icon={icon} />);
    
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies primary variant styles', () => {
    render(<Button text="Primary" variant="primary" />);
    
    const button = screen.getByRole('button', { name: 'Primary' });
    expect(button).toHaveClass('bg-primary', 'text-white', 'rounded-lg');
  });

  it('applies secondary variant styles', () => {
    render(<Button text="Secondary" variant="secondary" />);
    
    const button = screen.getByRole('button', { name: 'Secondary' });
    expect(button).toHaveClass('bg-white', 'text-primary', 'border', 'border-primary');
  });

  it('applies gray variant styles', () => {
    render(<Button text="Gray" variant="gray" />);
    
    const button = screen.getByRole('button', { name: 'Gray' });
    expect(button).toHaveClass('bg-gray-50', 'text-gray-700', 'border', 'border-gray-300');
  });

  it('applies custom className', () => {
    render(<Button text="Custom" className="custom-class" />);
    
    const button = screen.getByRole('button', { name: 'Custom' });
    expect(button).toHaveClass('custom-class');
  });

  it('renders as submit button', () => {
    render(<Button text="Submit" type="submit" />);
    
    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('renders as reset button', () => {
    render(<Button text="Reset" type="reset" />);
    
    const button = screen.getByRole('button', { name: 'Reset' });
    expect(button).toHaveAttribute('type', 'reset');
  });

  it('is disabled when loading', () => {
    render(<Button text="Loading" isLoading />);
    
    const button = screen.getByRole('button', { name: 'Loading' });
    expect(button).toBeDisabled();
  });

  it('shows loader icon when loading', () => {
    render(<Button text="Loading" isLoading />);
    
    // The ButtonLoaderIcon should be present
    const button = screen.getByRole('button', { name: 'Loading' });
    expect(button).toHaveClass('flex', 'items-center', 'justify-center', 'gap-2');
  });
});
