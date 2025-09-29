export type NotificationDto = {
  id: string;
  type: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  isRead: boolean;
  data: {
    type: string;
    debtId: number;
  };
};

export type NotificationsCountDto = {
  count: number;
};
