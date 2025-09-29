export interface NotificationItem {
  id: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  isRead: boolean;
}

export interface NotificationItemProps {
  notification: NotificationItem;
  isSelectionMode: boolean;
  isSelected: boolean;
  isMarkingNotificationsAsRead: boolean;
  isDeletingNotifications: boolean;
  onToggleSelection: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleSelectionMode: () => void;
}

export interface SelectionHeaderProps {
  selectedCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onExitSelection: () => void;
}

export interface BulkActionsProps {
  selectedItems: Set<string>;
  isMarkingNotificationsAsRead: boolean;
  isDeletingNotifications: boolean;
  onMarkSelectedAsRead: (ids: string[]) => void;
  onDeleteSelected: () => void;
}
