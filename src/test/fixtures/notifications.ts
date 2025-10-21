// Notification fixtures for testing
export const mockNotification = {
  id: '1',
  title: 'New Transaction',
  message: 'You have received a new payment of $1000',
  type: 'info',
  read: false,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  userId: '1',
};

export const mockReadNotification = {
  id: '2',
  title: 'Payment Completed',
  message: 'Your payment has been processed successfully',
  type: 'success',
  read: true,
  createdAt: '2024-01-02T00:00:00Z',
  updatedAt: '2024-01-02T00:00:00Z',
  userId: '1',
};

export const mockErrorNotification = {
  id: '3',
  title: 'Payment Failed',
  message: 'Your payment could not be processed',
  type: 'error',
  read: false,
  createdAt: '2024-01-03T00:00:00Z',
  updatedAt: '2024-01-03T00:00:00Z',
  userId: '1',
};

export const mockWarningNotification = {
  id: '4',
  title: 'Low Balance',
  message: 'Your account balance is running low',
  type: 'warning',
  read: false,
  createdAt: '2024-01-04T00:00:00Z',
  updatedAt: '2024-01-04T00:00:00Z',
  userId: '1',
};

export const mockNotifications = [
  mockNotification,
  mockReadNotification,
  mockErrorNotification,
  mockWarningNotification,
  {
    id: '5',
    title: 'Account Updated',
    message: 'Your account information has been updated',
    type: 'info',
    read: true,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
    userId: '1',
  },
];

export const mockNotificationStats = {
  total: 5,
  unread: 3,
  read: 2,
  byType: {
    info: 2,
    success: 1,
    error: 1,
    warning: 1,
  },
};

export const mockNotificationFilters = {
  type: ['info', 'success', 'error', 'warning'],
  read: [true, false],
  dateRange: {
    from: '2024-01-01',
    to: '2024-01-31',
  },
};
