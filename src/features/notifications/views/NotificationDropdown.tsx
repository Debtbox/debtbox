import { BellIcon, Loader2Icon, TrashIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ConfirmationPopup from '../../../components/shared/ConfirmationPopup';
import { useGetNotificationsData } from '../api/getNotifications';
import { useTranslation } from 'react-i18next';
import { useMarkNotificationsAsRead } from '../api/markNotificationsAsRead';
import { useDeleteNotifications } from '../api/deleteNotifications';
import type { ApiError } from '@/types/ApiError';
import { toast } from 'sonner';
import { queryClient } from '@/lib/queryClient';
import { NotificationItem, SelectionHeader, BulkActions } from '../components';

const NotificationDropdown = ({
  unreadNotificationsCount,
}: {
  unreadNotificationsCount: number;
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    data: notifications,
    isLoading: isLoadingNotifications,
    refetch: refetchNotifications,
  } = useGetNotificationsData({ enabled: isOpen });

  const {
    mutate: markNotificationsAsRead,
    isPending: isMarkingNotificationsAsRead,
  } = useMarkNotificationsAsRead({
    onSuccess: async () => {
      await refetchNotifications();
      await queryClient.invalidateQueries({
        queryKey: ['unread-notifications-count'],
      });
    },
    onError: (err: ApiError) => {
      toast.error(err.response.data.message);
    },
  });

  const { mutate: deleteNotifications, isPending: isDeletingNotifications } =
    useDeleteNotifications({
      onSuccess: async () => {
        await refetchNotifications();
        await queryClient.invalidateQueries({
          queryKey: ['unread-notifications-count'],
        });
        setShowDeleteConfirmation(false);
        setSelectedItems(new Set());
        setIsSelectionMode(false);
      },
      onError: (err: ApiError) => {
        toast.error(err.response.data.message);
        setShowDeleteConfirmation(false);
      },
    });

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const selectAll = () => {
    if (notifications?.data) {
      setSelectedItems(new Set(notifications.data.map((n) => n.id)));
    }
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      setSelectedItems(new Set());
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const isInsideNotifications = dropdownRef.current?.contains(target);

      const isInsideActionDropdown = (target as Element)?.closest(
        '[data-action-dropdown]',
      );

      if (!isInsideNotifications && !isInsideActionDropdown) {
        setIsOpen(false);
        setIsSelectionMode(false);
        setSelectedItems(new Set());
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      refetchNotifications();
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, refetchNotifications]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors duration-200 cursor-pointer relative"
        >
          <BellIcon className="w-5 h-5 text-vlack relative" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -end-1 bg-red-500 text-white text-xs font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm">
              {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
            </span>
          )}
        </button>
        <div
          className={`fixed md:absolute end-0 mt-4 w-screen md:w-104 bg-white shadow-lg z-50 flex flex-col max-h-[calc(100vh-.25rem*20)] md:max-h-[500px] transition-all duration-300 ease-in-out transform ${
            isOpen
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
          }`}
        >
          {isLoadingNotifications ? (
            <div className="flex items-center justify-center h-full py-4">
              <Loader2Icon className="w-5 h-5 text-gray-500 animate-spin" />
            </div>
          ) : notifications?.data.length === 0 ? (
            <div className="flex items-center justify-center h-full py-4">
              <span className="text-gray-500 text-center text-sm font-medium">
                {t('notifications.noNotifications', 'No notifications')}
              </span>
            </div>
          ) : (
            <>
              {isSelectionMode && (
                <SelectionHeader
                  selectedCount={selectedItems.size}
                  onSelectAll={selectAll}
                  onClearSelection={clearSelection}
                  onExitSelection={toggleSelectionMode}
                />
              )}

              <div className="flex-1 overflow-y-auto">
                {notifications?.data.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    isSelectionMode={isSelectionMode}
                    isSelected={selectedItems.has(notification.id)}
                    isMarkingNotificationsAsRead={isMarkingNotificationsAsRead}
                    isDeletingNotifications={isDeletingNotifications}
                    onToggleSelection={toggleSelection}
                    onMarkAsRead={(id) => {
                      markNotificationsAsRead({
                        ids: [`${id}`],
                        isMarkAll: false,
                      });
                    }}
                    onDelete={(id) => {
                      deleteNotifications({
                        ids: [`${id}`],
                        isDeleteAll: false,
                      });
                    }}
                    onToggleSelectionMode={toggleSelectionMode}
                  />
                ))}
              </div>

              {isSelectionMode && (
                <BulkActions
                  selectedItems={selectedItems}
                  isMarkingNotificationsAsRead={isMarkingNotificationsAsRead}
                  isDeletingNotifications={isDeletingNotifications}
                  onMarkSelectedAsRead={(ids) => {
                    markNotificationsAsRead({
                      ids: ids.map((id) => `${id}`),
                      isMarkAll: false,
                    });
                  }}
                  onDeleteSelected={() => setShowDeleteConfirmation(true)}
                />
              )}
            </>
          )}
        </div>
      </div>

      <ConfirmationPopup
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={() => {
          deleteNotifications({
            ids: Array.from(selectedItems).map((id) => `${id}`),
            isDeleteAll: false,
          });
        }}
        title={t(
          'notifications.deleteAllConfirmTitle',
          'Delete All Selected Notifications',
        )}
        description={t(
          'notifications.deleteAllConfirmDescription',
          'Are you sure you want to delete all selected notifications? This action cannot be undone.',
        )}
        confirmText={t(
          'notifications.deleteAll',
          'Delete all selected notifications',
        )}
        cancelText={t('common.cancel', 'Cancel')}
        icon={<TrashIcon className="w-5 h-5" />}
        isLoading={isDeletingNotifications}
      />
    </div>
  );
};

export default NotificationDropdown;
