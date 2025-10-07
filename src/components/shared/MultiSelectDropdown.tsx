import clsx from 'clsx';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectDropdownProps {
  options: DropdownOption[];
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'borderless';
}

const MultiSelectDropdown = ({
  options,
  values,
  onChange,
  placeholder = 'Select options',
  className,
  disabled = false,
  label,
  error,
  size = 'md',
  variant = 'default',
}: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOptions = options.filter((option) =>
    values.includes(option.value),
  );

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

  const handleOptionToggle = (optionValue: string) => {
    const newValues = values.includes(optionValue)
      ? values.filter((value) => value !== optionValue)
      : [...values, optionValue];
    onChange(newValues);
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

  const getDisplayText = () => {
    if (selectedOptions.length === 0) {
      return placeholder;
    }
    if (selectedOptions.length === 1) {
      return selectedOptions[0].label;
    }
    return `${selectedOptions.length} selected`;
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
            selectedOptions.length > 0 ? 'text-gray-900' : 'text-gray-500',
          )}
        >
          {getDisplayText()}
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
                !option.disabled && handleOptionToggle(option.value)
              }
              disabled={option.disabled}
              className={clsx(
                'w-full px-4 py-3 text-left transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg',
                'hover:bg-gray-50 focus:bg-gray-50 focus:outline-none',
                values.includes(option.value)
                  ? 'bg-primary/10 text-primary font-medium'
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
              aria-selected={values.includes(option.value)}
            >
              <div className="flex items-center gap-2">
                <div
                  className={clsx(
                    'w-4 h-4 border-2 rounded flex items-center justify-center',
                    values.includes(option.value)
                      ? 'bg-primary border-primary'
                      : 'border-gray-300',
                  )}
                >
                  {values.includes(option.value) && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                {option.label}
              </div>
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

export default MultiSelectDropdown;
