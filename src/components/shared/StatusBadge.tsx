import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

export interface DueDateStatusBadgeProps {
  status: 'normal' | 'overdue' | 'in 7 days' | 'soon';
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
      color: 'bg-[#0E1F8014] text-[#0E1F80]',
      dotColor: 'bg-[#0E1F80]',
      dotShadowColor: 'bg-[#0E1F8047]',
    },
    soon: {
      label: t('common.buttons.soon'),
      color: 'bg-[#FEF2DC] text-[#F8AC1F]',
      dotColor: 'bg-[#F8AC1F]',
      dotShadowColor: 'bg-[#F8AC1F47]',
    },
    'in 7 days': {
      label: t('common.buttons.in7days'),
      color: 'bg-[#F0F0F0] text-[#4F5154]',
      dotColor: 'bg-[#4F5154]',
      dotShadowColor: 'bg-[#4F515447]',
    },
    overdue: {
      label: t('common.buttons.overdue'),
      color: 'bg-[#FF475714] text-[#FF4757]',
      dotColor: 'bg-[#FF4757]',
      dotShadowColor: 'bg-[#FF475763]',
    },
  };

  const config = statusConfig[status];
  const displayLabel = label || config?.label;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const dotSizeConfig = {
    sm: { dot: 'w-1.5 h-1.5', shadow: 'w-3 h-3' },
    md: { dot: 'w-2 h-2', shadow: 'w-4 h-4' },
    lg: { dot: 'w-2.5 h-2.5', shadow: 'w-5 h-5' },
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 rounded-full font-medium',
        config?.color,
        sizeClasses[size],
        className,
      )}
    >
      {showDot && (
        <span className="relative flex items-center justify-center">
          <span
            className={clsx(
              'absolute rounded-full',
              config?.dotShadowColor,
              dotSizeConfig[size].shadow,
              // visually center the shadow backing dot
              'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            )}
            aria-hidden="true"
          />
          <span
            className={clsx(
              'relative rounded-full',
              config?.dotColor,
              dotSizeConfig[size].dot,
            )}
          />
        </span>
      )}
      {displayLabel}
    </span>
  );
};

export type StatusBadgeStatus =
  | 'cancelled'
  | 'paid'
  | 'overdue'
  | 'active'
  | 'pending'
  | 'expired';

/** Due Status: canceled → in 7 days (grey), paid → green, overdue → red, active → normal (blue), pending → yellow */
export const StatusBadge = ({
  status,
  label,
  showDot = true,
  size = 'md',
  className,
}: {
  status: StatusBadgeStatus;
  label?: string;
  showDot?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) => {
  const { t } = useTranslation();
  const statusConfig: Record<
    string,
    { label: string; color: string; dotColor: string; dotShadowColor: string }
  > = {
    cancelled: {
      label: t('dashboard.cancelled'),
      color: 'bg-[#F0F0F0] text-[#4F5154]',
      dotColor: 'bg-[#4F5154]',
      dotShadowColor: 'bg-[#4F515447]',
    },
    paid: {
      label: t('dashboard.paid', 'paid'),
      color: 'bg-[#22C55E14] text-[#22C55E]',
      dotColor: 'bg-[#22C55E]',
      dotShadowColor: 'bg-[#22C55E47]',
    },
    overdue: {
      label: t('common.buttons.overdue'),
      color: 'bg-[#FF475714] text-[#FF4757]',
      dotColor: 'bg-[#FF4757]',
      dotShadowColor: 'bg-[#FF475763]',
    },
    active: {
      label: t('common.buttons.normal'),
      color: 'bg-[#0E1F8014] text-[#0E1F80]',
      dotColor: 'bg-[#0E1F80]',
      dotShadowColor: 'bg-[#0E1F8047]',
    },
    pending: {
      label: t('dashboard.pending', 'pending'),
      color: 'bg-[#FEF2DC] text-[#F8AC1F]',
      dotColor: 'bg-[#F8AC1F]',
      dotShadowColor: 'bg-[#F8AC1F47]',
    },
    expired: {
      label: t('dashboard.expired', 'expired'),
      color: 'bg-[#FF475714] text-[#FF4757]',
      dotColor: 'bg-[#FF4757]',
      dotShadowColor: 'bg-[#FF475763]',
    },
  };

  const defaultConfig = {
    label: status,
    color: 'bg-[#F0F0F0] text-[#4F5154]',
    dotColor: 'bg-[#4F5154]',
    dotShadowColor: 'bg-[#4F515447]',
  };

  const config = statusConfig[status] ?? defaultConfig;
  const displayLabel = label || config.label;

  const sizeClasses = {
    sm: 'px-2 py-1',
    md: 'px-3 py-1',
    lg: 'px-4 py-2',
  };

  const dotSizeConfig = {
    sm: { dot: 'w-1.5 h-1.5', shadow: 'w-3 h-3' },
    md: { dot: 'w-2 h-2', shadow: 'w-4 h-4' },
    lg: { dot: 'w-2.5 h-2.5', shadow: 'w-5 h-5' },
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 rounded-full font-medium leading-none capitalize',
        config.color,
        sizeClasses[size],
        className,
      )}
    >
      {showDot && (
        <span className="relative flex items-center justify-center">
          <span
            className={clsx(
              'absolute rounded-full',
              config.dotShadowColor,
              dotSizeConfig[size].shadow,
              'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            )}
            aria-hidden="true"
          />
          <span
            className={clsx(
              'relative rounded-full',
              config.dotColor,
              dotSizeConfig[size].dot,
            )}
            aria-hidden="true"
          />
        </span>
      )}
      {displayLabel}
    </span>
  );
};
