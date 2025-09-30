import clsx from 'clsx';
import { forwardRef, type InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  placeholder?: string;
  className?: string;
  onClear?: () => void;
  showClearButton?: boolean;
  icon?: React.ReactNode;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      placeholder = 'Search...',
      className,
      onClear,
      showClearButton = false,
      icon,
      value,
      ...props
    },
    ref,
  ) => {
    const hasValue = value && String(value).length > 0;

    return (
      <div className="relative">
        <input
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={value}
          className={clsx(
            'w-full p-3 border border-gray-300 rounded-lg h-12 focus:outline-none focus:ring-0 focus:border-2 focus:border-primary focus:ring-primary focus:ring-opacity-50 transition-all duration-200',
            hasValue && showClearButton ? 'pe-20' : 'pe-10',
            className,
          )}
          {...props}
        />
        
        {/* Search Icon */}
        <div className="absolute end-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {icon || <Search className="w-4 h-4 text-gray-400" />}
        </div>

        {/* Clear Button */}
        {showClearButton && hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute end-10 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
