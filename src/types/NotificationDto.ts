export type NotificationDto = {
  id: string;
  type: string;
  title: string;
  body: string;
  resolvedLanguage: 'ar' | 'en' | 'ur' | 'bn';
  isRead: boolean;
  created_at: string;
  data: {
    type: string;
    debtId: number;
  };
};

export type NotificationsCountDto = {
  count: number;
};
