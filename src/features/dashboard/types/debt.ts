import type { BusinessDto, UserDto } from '@/types/UserDto';

export interface Debt {
  debtId: number;
  customerId: number;
  full_name_ar: string;
  full_name_en: string;
  amount: number;
  due_date: string;
  original_date: string;
  status: string;
  dueDateStatus: 'normal' | 'overdue' | 'in 7 days' | 'soon';
  isPending: boolean;
  isOverdue: boolean;
  title: string;
  reason: string;
}

export interface DebtResponse {
  id: number;
  business: BusinessDto;
  customer: UserDto;
  amount: number;
  due_date: string;
  status: string;
  isPending: boolean;
  title: string;
  reason: string;
}

export interface DebtTableData extends Debt {
  customerName: string;
  formattedAmount: string;
  formattedDueDate: string;
  formattedOriginalDueDate: string;
  statusColor: string;
  statusLabel: string;
  daysUntilDue: number;
}

export interface DebtFilters {
  search: string;
  status: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export type DebtWithId = Omit<Debt, 'debtId'> & { id: number };
export type DebtWithDebtId = Omit<DebtResponse, 'id'> & { debtId: number };
