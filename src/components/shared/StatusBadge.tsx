import clsx from 'clsx';

export interface StatusBadgeProps {
  status: 'normal' | 'overdue' | 'almost' | 'soon';
  label?: string;
  showDot?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatusBadge = ({
  status,
  label,
  showDot = true,
  size = 'md',
  className,
}: StatusBadgeProps) => {
  const statusConfig = {
    normal: {
      label: 'Normal',
      color: 'bg-green-100 text-green-800',
      dotColor: 'bg-green-500',
    },
    soon: {
      label: 'Due Soon',
      color: 'bg-yellow-100 text-yellow-800',
      dotColor: 'bg-yellow-500',
    },
    almost: {
      label: 'Almost Due',
      color: 'bg-orange-100 text-orange-800',
      dotColor: 'bg-orange-500',
    },
    overdue: {
      label: 'Overdue',
      color: 'bg-red-100 text-red-800',
      dotColor: 'bg-red-500',
    },
  };

  const config = statusConfig[status];
  const displayLabel = label || config.label;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 rounded-full font-medium',
        config.color,
        sizeClasses[size],
        className
      )}
    >
      {showDot && (
        <span
          className={clsx(
            'rounded-full',
            config.dotColor,
            dotSizeClasses[size]
          )}
        />
      )}
      {displayLabel}
    </span>
  );
};

export default StatusBadge;
