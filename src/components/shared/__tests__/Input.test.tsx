import { describe, it, expect, vi } from 'vitest';
import { render, screen, user } from '@/test';
import Input from '../Input';

describe('Input Component', () => {
  it('renders with label', () => {
    render(<Input label="Email" type="email" id="email" />);
    
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'email');
  });

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter your email" type="email" id="email" />);
    
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('handles text input', async () => {
    render(<Input type="text" id="name" />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'John Doe');
    
    expect(input).toHaveValue('John Doe');
  });

  it('handles email input', async () => {
    render(<Input type="email" id="email" />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'test@example.com');
    
    expect(input).toHaveValue('test@example.com');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('shows password toggle for password type', () => {
    render(<Input type="password" id="password" />);
    
    const input = screen.getByDisplayValue('');
    expect(input).toHaveAttribute('type', 'password');
    
    // Password toggle button should be present
    const toggleButton = input.parentElement?.querySelector('button');
    expect(toggleButton).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    render(<Input type="password" id="password" />);
    
    const input = screen.getByDisplayValue('');
    const toggleButton = input.parentElement?.querySelector('button');
    
    expect(input).toHaveAttribute('type', 'password');
    
    if (toggleButton) {
      await user.click(toggleButton);
      expect(input).toHaveAttribute('type', 'text');
      
      await user.click(toggleButton);
      expect(input).toHaveAttribute('type', 'password');
    }
  });

  it('shows error message', () => {
    render(<Input type="text" id="name" error="This field is required" />);
    
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByText('This field is required')).toHaveClass('text-red-500');
  });

  it('shows helper text', () => {
    render(<Input type="text" id="name" helperText="Enter your full name" />);
    
    expect(screen.getByText('Enter your full name')).toBeInTheDocument();
    expect(screen.getByText('Enter your full name')).toHaveClass('text-gray-700');
  });

  it('does not show helper text when error is present', () => {
    render(
      <Input 
        type="text" 
        id="name" 
        error="This field is required"
        helperText="Enter your full name"
      />
    );
    
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.queryByText('Enter your full name')).not.toBeInTheDocument();
  });

  it('applies error styles when error is present', () => {
    render(<Input type="text" id="name" error="This field is required" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-500');
  });

  it('renders with icon', () => {
    const icon = <span data-testid="input-icon">🔍</span>;
    render(<Input type="text" id="search" icon={icon} />);
    
    expect(screen.getByTestId('input-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Input type="text" id="name" className="custom-input" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-input');
  });

  it('applies custom label className', () => {
    render(<Input label="Custom Label" type="text" id="name" labelClassName="custom-label" />);
    
    const label = screen.getByText('Custom Label');
    expect(label).toHaveClass('custom-label');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Input type="text" id="name" ref={ref} />);
    
    expect(ref).toHaveBeenCalled();
  });

  it('handles focus and blur events', async () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(
      <Input 
        type="text" 
        id="name" 
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    );
    
    const input = screen.getByRole('textbox');
    
    await user.click(input);
    expect(handleFocus).toHaveBeenCalled();
    
    await user.tab();
    expect(handleBlur).toHaveBeenCalled();
  });

  it('handles disabled state', () => {
    render(<Input type="text" id="name" disabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('handles required attribute', () => {
    render(<Input type="text" id="name" required />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });

  it('handles different input types', () => {
    const types = [
      { type: 'text', role: 'textbox' },
      { type: 'email', role: 'textbox' },
      { type: 'number', role: 'spinbutton' },
      { type: 'tel', role: 'textbox' },
      { type: 'url', role: 'textbox' },
    ];
    
    types.forEach(({ type, role }) => {
      const { unmount } = render(<Input type={type} id={`input-${type}`} />);
      const input = screen.getByRole(role);
      expect(input).toHaveAttribute('type', type);
      unmount();
    });
  });
});
