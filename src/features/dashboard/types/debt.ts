import type { BusinessDto } from '@/types/BusinessDto';
import type { UserDto } from '@/types/UserDto';

export interface Debt {
  debtId: number;
  customerId: number;
  full_name_ar: string;
  full_name_en: string;
  amount: number;
  due_date: string;
  original_date: string;
  status: 'overdue' | 'pending' | 'paid' | 'cancelled' | 'active' | 'in_arrears';
  dueDateStatus: 'normal' | 'overdue' | 'in 7 days' | 'soon';
  isPending: boolean;
  isOverdue: boolean;
  title: string;
  reason: string;
  createWithSanad: boolean;
  paymentDate: string | null;
  paymentMethod: 'APPLE_PAY' | 'MADA' | 'VISA' | 'STC_PAY' | 'CASH' | null;
}

export interface DebtResponse {
  id: number;
  business: BusinessDto;
  customer: UserDto;
  amount: number;
  due_date: string;
  status: 'overdue' | 'pending' | 'paid' | 'cancelled' | 'active' | 'in_arrears';
  isPending: boolean;
  title: string;
  reason?: string;
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
