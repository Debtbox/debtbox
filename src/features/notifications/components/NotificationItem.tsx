import { CheckSquare2, Loader2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import DBIcon from '../../../components/icons/DBIcon';
import DotsIcon from '../../../components/icons/DotsIcon';
import ActionDropdown from '../../../components/shared/ActionDropdown';
import { CheckIcon, TrashIcon, Square } from 'lucide-react';
import type { NotificationItemProps } from './types';

const NotificationItem = ({
  notification,
  isSelectionMode,
  isSelected,
  isMarkingAsRead,
  isDeleting,
  onToggleSelection,
  onMarkAsRead,
  onDelete,
  onToggleSelectionMode,
}: NotificationItemProps) => {
  const { i18n, t } = useTranslation();

  return (
    <div
      className={clsx(
        'flex items-start gap-2 px-8 md:px-4 py-3 hover:bg-gray-100 transition-colors duration-200',
        notification.isRead && 'bg-gray-100',
        isSelectionMode && isSelected && 'bg-blue-50',
      )}
    >
      {isSelectionMode && (
        <div className="flex items-center pt-2">
          <button
            onClick={() => onToggleSelection(notification.id)}
            className="flex items-center justify-center w-5 h-5"
          >
            {isSelected ? (
              <CheckSquare2 className="w-5 h-5 text-primary" />
            ) : (
              <Square className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      )}

      <div>
        <div className="w-12 h-12 rounded-full bg-[#F6F6F6] flex items-center justify-center">
          {isMarkingAsRead || isDeleting ? (
            <Loader2Icon className="w-4 h-4 animate-spin" />
          ) : (
            <DBIcon />
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1">
        <h6 className="text-sm font-medium text-gray-600">
          {i18n.language === 'ar' ? notification.titleAr : notification.titleEn}
        </h6>
        <p className="text-xs text-gray-500">
          {i18n.language === 'ar' ? notification.bodyAr : notification.bodyEn}
        </p>
      </div>

      <div className="flex flex-col gap-1 relative">
        <span className="text-xs text-gray-500">15H</span>
        <ActionDropdown
          trigger={
            <button className="cursor-pointer">
              <DotsIcon />
            </button>
          }
          actions={[
            ...(isSelectionMode
              ? [
                  {
                    label: t('notifications.exitSelection', 'Exit Selection'),
                    onClick: onToggleSelectionMode,
                    icon: <CheckSquare2 className="w-4 h-4" />,
                  },
                ]
              : [
                  {
                    label: t('notifications.selectOptions', 'Select Options'),
                    onClick: onToggleSelectionMode,
                    icon: <CheckSquare2 className="w-4 h-4" />,
                  },
                ]),
            ...(notification.isRead
              ? []
              : [
                  {
                    label: t('notifications.markAsRead', 'Mark as read'),
                    onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onMarkAsRead(notification.id);
                    },
                    icon: <CheckIcon className="w-4 h-4" />,
                  },
                ]),
            {
              label: t('notifications.delete', 'Delete'),
              onClick: () => onDelete(notification.id),
              icon: <TrashIcon className="w-4 h-4" />,
              className: 'text-red-600 hover:text-red-700 hover:bg-red-50',
            },
          ]}
        />
      </div>
    </div>
  );
};

export default NotificationItem;
