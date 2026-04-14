import type { NotificationDto } from "@/types/NotificationDto";

export interface NotificationItemProps {
  notification: NotificationDto;
  isSelectionMode: boolean;
  isSelected: boolean;
  isMarkingAsRead: boolean;
  isDeleting: boolean;
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
