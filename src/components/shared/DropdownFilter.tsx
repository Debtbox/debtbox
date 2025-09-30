import clsx from 'clsx';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DropdownFilterProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'borderless';
}

const DropdownFilter = ({
  options,
  value,
  onChange,
  placeholder = 'Select option',
  className,
  disabled = false,
  label,
  error,
  size = 'md',
  variant = 'default',
}: DropdownFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const sizeClasses = {
    sm: 'h-10 px-3 text-sm',
    md: 'h-12 px-4 text-sm',
    lg: 'h-14 px-4 text-base',
  };

  const variantClasses = {
    default: 'border border-gray-300 hover:border-gray-400',
    borderless: 'border-0 hover:bg-gray-50',
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={clsx(
          'flex items-center justify-between w-full rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50',
          sizeClasses[size],
          variantClasses[variant],
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '',
          disabled
            ? 'opacity-50 cursor-not-allowed bg-gray-50'
            : 'cursor-pointer',
          className,
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span
          className={clsx(
            'truncate',
            selectedOption ? 'text-gray-900' : 'text-gray-500',
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={clsx(
            'w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0',
            isOpen && 'rotate-180',
            disabled && 'opacity-50',
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                !option.disabled && handleOptionSelect(option.value)
              }
              disabled={option.disabled}
              className={clsx(
                'w-full px-4 py-3 text-left transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg',
                'hover:bg-gray-50 focus:bg-gray-50 focus:outline-none',
                value === option.value
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700',
                option.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer',
                size === 'sm'
                  ? 'text-sm'
                  : size === 'lg'
                    ? 'text-base'
                    : 'text-sm',
              )}
              role="option"
              aria-selected={value === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {error && (
        <span className="text-sm text-red-500 mt-1 block">{error}</span>
      )}
    </div>
  );
};

export default DropdownFilter;
