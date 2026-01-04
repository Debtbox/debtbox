import { Loader2Icon, CheckIcon, TrashIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { BulkActionsProps } from './types';

const BulkActions = ({
  selectedItems,
  isMarkingNotificationsAsRead,
  isDeletingNotifications,
  onMarkSelectedAsRead,
  onDeleteSelected,
}: BulkActionsProps) => {
  const { t } = useTranslation();

  return (
    <div className="border-t border-gray-200 px-2 py-3 bg-white sticky bottom-0">
      <div className="flex gap-1">
        <button
          onClick={() => onMarkSelectedAsRead(Array.from(selectedItems))}
          disabled={isMarkingNotificationsAsRead || selectedItems.size === 0}
          className="whitespace-nowrap flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs text-primary hover:text-primary/90 hover:bg-blue-50 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isMarkingNotificationsAsRead ? (
            <Loader2Icon className="w-4 h-4 animate-spin" />
          ) : (
            <CheckIcon className="w-4 h-4" />
          )}
          {t(
            'auth.notifications.markAllSelectedAsRead',
            'Mark as read',
          )}
        </button>
        <button
          onClick={onDeleteSelected}
          disabled={isDeletingNotifications || selectedItems.size === 0}
          className="whitespace-nowrap flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <TrashIcon className="w-4 h-4" />
          {t(
            'notifications.delete',
            'Delete',
          )}
        </button>
      </div>
    </div>
  );
};

export default BulkActions;
