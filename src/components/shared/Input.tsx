import clsx from 'clsx';
import { forwardRef } from 'react';

interface InputProps {
  label?: string;
  placeholder?: string;
  type: string;
  id: string;
  className?: string;
  helperText?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, placeholder, type, id, className, helperText, error, ...props }, ref) => {
    return (
      <>
        {label && (
          <label htmlFor={id} className="text-sm text-gray-700 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          id={id}
          placeholder={placeholder}
          className={clsx(
            'w-full p-2 border rounded-lg h-12 focus:outline-none focus:ring-0 focus:border-2 focus:border-primary focus:ring-primary focus:ring-opacity-50',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300',
            className,
          )}
          {...props}
        />
        {error && (
          <span className="text-sm text-red-500 mt-1">
            {error}
          </span>
        )}
        {helperText && !error && (
          <span className="text-sm text-gray-700 mt-2 bg-[#E6EAEE40] rounded-lg p-2">
            {helperText}
          </span>
        )}
      </>
    );
  },
);

export default Input;
