import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

export interface DueDateStatusBadgeProps {
  status: 'normal' | 'overdue' | 'almost' | 'soon';
  label?: string;
  showDot?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const DueDateStatusBadge = ({
  status,
  label,
  showDot = true,
  size = 'md',
  className,
}: DueDateStatusBadgeProps) => {
  const { t } = useTranslation();
  const statusConfig = {
    normal: {
      label: t('common.buttons.normal'),
      color: 'bg-green-100 text-green-800',
      dotColor: 'bg-green-500',
    },
    soon: {
      label: t('common.buttons.soon'),
      color: 'bg-yellow-100 text-yellow-800',
      dotColor: 'bg-yellow-500',
    },
    almost: {
      label: t('common.buttons.almost'),
      color: 'bg-orange-100 text-orange-800',
      dotColor: 'bg-orange-500',
    },
    overdue: {
      label: t('common.buttons.overdue'),
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
        className,
      )}
    >
      {showDot && (
        <span
          className={clsx(
            'rounded-full',
            config.dotColor,
            dotSizeClasses[size],
          )}
        />
      )}
      {displayLabel}
    </span>
  );
};

export const StatusBadge = ({
  status,
}: {
  status: 'pending' | 'paid' | 'expired';
}) => {
  const { t } = useTranslation();
  return (
    <span className="inline-flex items-center gap-2 rounded-full font-medium capitalize">
      {t(`dashboard.${status}`, status)}
    </span>
  );
};
