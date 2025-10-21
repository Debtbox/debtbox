// Transaction fixtures for testing
export const mockTransaction = {
  id: '1',
  amount: 1000,
  status: 'completed',
  type: 'payment',
  description: 'Test transaction',
  reference: 'TXN-001',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  userId: '1',
};

export const mockPendingTransaction = {
  id: '2',
  amount: 500,
  status: 'pending',
  type: 'refund',
  description: 'Test refund',
  reference: 'TXN-002',
  createdAt: '2024-01-02T00:00:00Z',
  updatedAt: '2024-01-02T00:00:00Z',
  userId: '1',
};

export const mockFailedTransaction = {
  id: '3',
  amount: 750,
  status: 'failed',
  type: 'payment',
  description: 'Failed transaction',
  reference: 'TXN-003',
  createdAt: '2024-01-03T00:00:00Z',
  updatedAt: '2024-01-03T00:00:00Z',
  userId: '1',
};

export const mockTransactions = [
  mockTransaction,
  mockPendingTransaction,
  mockFailedTransaction,
  {
    id: '4',
    amount: 2000,
    status: 'completed',
    type: 'payment',
    description: 'Large payment',
    reference: 'TXN-004',
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
    userId: '1',
  },
  {
    id: '5',
    amount: 100,
    status: 'completed',
    type: 'refund',
    description: 'Small refund',
    reference: 'TXN-005',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
    userId: '1',
  },
];

export const mockTransactionStats = {
  totalTransactions: 150,
  totalAmount: 50000,
  pendingTransactions: 5,
  completedTransactions: 145,
  failedTransactions: 0,
  monthlyGrowth: 12.5,
  averageTransactionAmount: 333.33,
};

export const mockTransactionFilters = {
  status: ['completed', 'pending'],
  type: ['payment', 'refund'],
  dateRange: {
    from: '2024-01-01',
    to: '2024-01-31',
  },
  amountRange: {
    min: 0,
    max: 10000,
  },
};
