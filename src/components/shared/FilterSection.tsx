import clsx from 'clsx';
import { type ReactNode } from 'react';
import SearchInput from './SearchInput';
import DropdownFilter, { type DropdownOption } from './DropdownFilter';

export interface FilterConfig {
  search?: {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    onClear?: () => void;
    showClearButton?: boolean;
  };
  dropdowns?: Array<{
    key: string;
    options: DropdownOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
  }>;
}

interface FilterSectionProps {
  config: FilterConfig;
  className?: string;
  variant?: 'default' | 'borderless' | 'compact';
  showBorder?: boolean;
  children?: ReactNode;
  actions?: ReactNode;
}

const FilterSection = ({
  config,
  className,
  variant = 'default',
  showBorder = true,
  children,
  actions,
}: FilterSectionProps) => {
  const hasFilters = config.search || (config.dropdowns && config.dropdowns.length > 0);

  if (!hasFilters && !children && !actions) {
    return null;
  }

  const variantClasses = {
    default: 'p-0 mb-4',
    borderless: 'p-0',
    compact: 'p-4',
  };

  const borderClasses = showBorder
    ? 'border border-gray-200 rounded-2xl bg-white'
    : '';

  return (
    <div
      className={clsx(
        'w-full transition-all duration-200',
        variantClasses[variant],
        borderClasses,
        className,
      )}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Filters Container */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto lg:flex-1">
          {/* Search Input */}
          {config.search && (
            <div className="flex-1 sm:flex-none sm:w-80">
              <SearchInput
                placeholder={config.search.placeholder}
                value={config.search.value}
                onChange={(e) => config.search?.onChange(e.target.value)}
                onClear={config.search.onClear}
                showClearButton={config.search.showClearButton}
                className="w-full"
              />
            </div>
          )}

          {/* Dropdown Filters */}
          {config.dropdowns && config.dropdowns.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {config.dropdowns.map((dropdown) => (
                <div key={dropdown.key} className="min-w-[140px]">
                  <DropdownFilter
                    options={dropdown.options}
                    value={dropdown.value}
                    onChange={dropdown.onChange}
                    placeholder={dropdown.placeholder}
                    label={dropdown.label}
                    disabled={dropdown.disabled}
                    variant={variant === 'borderless' ? 'borderless' : 'default'}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Custom Children */}
          {children}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSection;
