import clsx from 'clsx';
import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import EyeIcon from '../icons/EyeIcon';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  type: string;
  id: string;
  className?: string;
  helperText?: string;
  error?: string;
  labelClassName?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      placeholder,
      type,
      id,
      className,
      helperText,
      error,
      labelClassName,
      icon,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === 'password';
    const inputType = isPasswordType
      ? showPassword
        ? 'text'
        : 'password'
      : type;

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <>
        {label && (
          <label
            htmlFor={id}
            className={clsx('text-sm text-gray-700 mb-2', labelClassName)}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            id={id}
            placeholder={placeholder}
            className={clsx(
              'w-full p-2 border rounded-lg h-12 focus:outline-none focus:ring-0 focus:border-2 focus:border-primary focus:ring-primary focus:ring-opacity-50',
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300',
              isPasswordType ? 'pe-10' : '',
              className,
            )}
            {...props}
          />
          {isPasswordType && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute end-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              tabIndex={-1}
            >
              <EyeIcon active={showPassword} />
            </button>
          )}
          {icon && (
            <div className="absolute start-3 top-1/2 transform -translate-y-1/2">
              {icon}
            </div>
          )}
        </div>
        {error && <span className="text-sm text-red-500 mt-1">{error}</span>}
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
