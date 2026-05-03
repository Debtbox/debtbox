import type { TicketStatus, TicketPriority } from './types';

export const getStatusColor = (status: TicketStatus): string =>
  ({
    NEW: 'bg-yellow-100 text-yellow-700',
    OPEN: 'bg-blue-100 text-blue-700',
    WAITING_ON_REQUESTER: 'bg-orange-100 text-orange-700',
    WAITING_ON_INTERNAL: 'bg-purple-100 text-purple-700',
    RESOLVED: 'bg-green-100 text-green-700',
    CLOSED: 'bg-gray-100 text-gray-600',
    REOPENED: 'bg-teal-100 text-teal-700',
  })[status] ?? 'bg-gray-100 text-gray-600';

export const getPriorityColor = (priority: TicketPriority): string =>
  ({
    LOW: 'bg-gray-100 text-gray-600',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    HIGH: 'bg-orange-100 text-orange-700',
    URGENT: 'bg-red-100 text-red-700',
  })[priority] ?? 'bg-gray-100 text-gray-600';

export const isClosed = (status: TicketStatus) =>
  status === 'CLOSED' || status === 'RESOLVED';
