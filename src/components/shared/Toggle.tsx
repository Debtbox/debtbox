import clsx from 'clsx';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  description?: string;
}

const Toggle = ({
  checked,
  onChange,
  label,
  id,
  disabled = false,
  className,
  labelClassName,
  description,
}: ToggleProps) => {
  const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={clsx('flex flex-col', className)}>
      {label && (
        <label
          htmlFor={toggleId}
          className={clsx(
            'text-sm text-gray-700 mb-2 cursor-pointer',
            disabled && 'opacity-50 cursor-not-allowed',
            labelClassName,
          )}
        >
          {label}
        </label>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={clsx(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none',
            checked ? 'bg-[#50C879]' : 'bg-gray-300',
            disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <span
            className={clsx(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out',
              checked ? 'translate-x-6' : 'translate-x-1',
            )}
          />
        </button>
        {description && (
          <span
            className={clsx('text-sm text-gray-600', disabled && 'opacity-50')}
          >
            {description}
          </span>
        )}
      </div>
    </div>
  );
};

export default Toggle;
