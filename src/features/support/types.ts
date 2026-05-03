export type TicketType = 'GENERAL' | 'DEBT' | 'PAYMENT' | 'TECHNICAL' | 'ACCOUNTING' | 'OTHER';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketStatus =
  | 'NEW'
  | 'OPEN'
  | 'WAITING_ON_REQUESTER'
  | 'WAITING_ON_INTERNAL'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REOPENED';
export type TicketRelatedEntityType =
  | 'DEBT'
  | 'PAYMENT'
  | 'MERCHANT'
  | 'CUSTOMER'
  | 'BUSINESS'
  | 'SANAD'
  | 'OTHER';

export interface TicketDTO {
  id: string;
  code: string;
  requesterType: 'MERCHANT' | 'CUSTOMER';
  subject: string;
  description: string;
  type: TicketType;
  priority: TicketPriority;
  status: TicketStatus;
  channel: string;
  relatedEntityType?: TicketRelatedEntityType;
  relatedEntityId?: string;
  lastMessageAt: string;
  resolvedAt: string | null;
  closedAt: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  hasAdminAction: boolean;
}

export interface TicketMessageDTO {
  id: string;
  senderType: 'SUPPORT' | 'REQUESTER';
  senderUserId: number | null;
  senderMerchantId: number | null;
  senderCustomerId: number | null;
  body: string;
  isInternalNote: boolean;
  created_at: string;
}
