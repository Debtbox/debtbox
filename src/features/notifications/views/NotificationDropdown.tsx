import { BellIcon, Loader2Icon, CheckIcon, TrashIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import DBIcon from '../../../components/icons/DBIcon';
import DotsIcon from '../../../components/icons/DotsIcon';
import ActionDropdown from '../../../components/shared/ActionDropdown';
import ConfirmationPopup from '../../../components/shared/ConfirmationPopup';
import { useGetNotificationsData } from '../api/getNotifications';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useMarkNotificationsAsRead } from '../api/markNotificationsAsRead';
import { useDeleteNotifications } from '../api/deleteNotifications';
import type { ApiError } from '@/types/ApiError';
import { toast } from 'sonner';
import { queryClient } from '@/lib/queryClient';

const NotificationDropdown = ({
  unreadNotificationsCount,
}: {
  unreadNotificationsCount: number;
}) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
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
      },
      onError: (err: ApiError) => {
        toast.error(err.response.data.message);
        setShowDeleteConfirmation(false);
      },
    });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const isInsideNotifications = dropdownRef.current?.contains(target);

      const isInsideActionDropdown = (target as Element)?.closest(
        '[data-action-dropdown]',
      );

      if (!isInsideNotifications && !isInsideActionDropdown) {
        setIsOpen(false);
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
          className={`fixed md:absolute end-0 mt-4 w-screen md:w-100 bg-white shadow-lg z-50 flex flex-col max-h-[calc(100vh-.25rem*20)] md:max-h-[500px] transition-all duration-300 ease-in-out transform ${
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
              <div className="flex-1 overflow-y-auto">
                {notifications?.data.map((notification) => (
                  <div
                    key={notification.id}
                    className={clsx(
                      'flex items-start gap-2 px-8 md:px-4 py-3 hover:bg-gray-100 transition-colors duration-200',
                      notification.isRead && 'bg-gray-100',
                    )}
                  >
                    <div>
                      <button className="w-12 h-12 rounded-full bg-[#F6F6F6] flex items-center justify-center">
                        {isMarkingNotificationsAsRead ? (
                          <Loader2Icon className="w-4 h-4 animate-spin" />
                        ) : (
                          <DBIcon />
                        )}
                      </button>
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <h6 className="text-sm font-medium text-gray-600">
                        {i18n.language === 'ar'
                          ? notification.titleAr
                          : notification.titleEn}
                      </h6>
                      <p className="text-xs text-gray-500">
                        {i18n.language === 'ar'
                          ? notification.bodyAr
                          : notification.bodyEn}
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
                          ...(notification.isRead
                            ? []
                            : [
                                {
                                  label: t(
                                    'notifications.markAsRead',
                                    'Mark as read',
                                  ),
                                  onClick: (
                                    e: React.MouseEvent<HTMLButtonElement>,
                                  ) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    markNotificationsAsRead({
                                      ids: [notification.id],
                                      isMarkAll: false,
                                    });
                                  },
                                  icon: <CheckIcon className="w-4 h-4" />,
                                },
                              ]),
                          {
                            label: t('notifications.delete', 'Delete'),
                            onClick: () => {
                              deleteNotifications({
                                ids: [notification.id],
                                isDeleteAll: false,
                              });
                            },
                            icon: <TrashIcon className="w-4 h-4" />,
                            className:
                              'text-red-600 hover:text-red-700 hover:bg-red-50',
                          },
                        ]}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 px-4 py-3 bg-white sticky bottom-0">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      markNotificationsAsRead({
                        ids: [],
                        isMarkAll: true,
                      });
                    }}
                    disabled={isMarkingNotificationsAsRead}
                    className="whitespace-nowrap flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs text-primary hover:text-primary/90 hover:bg-blue-50 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isMarkingNotificationsAsRead ? (
                      <Loader2Icon className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckIcon className="w-4 h-4" />
                    )}
                    {t('notifications.markAllAsRead', 'Mark all as read')}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirmation(true)}
                    className="whitespace-nowrap flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                  >
                    <TrashIcon className="w-4 h-4" />
                    {t('notifications.deleteAll', 'Delete all notifications')}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmationPopup
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={() => {
          deleteNotifications({
            ids: [],
            isDeleteAll: true,
          });
        }}
        title={t(
          'notifications.deleteAllConfirmTitle',
          'Delete All Notifications',
        )}
        description={t(
          'notifications.deleteAllConfirmDescription',
          'Are you sure you want to delete all notifications? This action cannot be undone.',
        )}
        confirmText={t('notifications.deleteAll', 'Delete all notifications')}
        cancelText={t('common.cancel', 'Cancel')}
        icon={<TrashIcon className="w-5 h-5" />}
        isLoading={isDeletingNotifications}
      />
    </div>
  );
};

export default NotificationDropdown;
