import type { BusinessDto } from '@/types/BusinessDto';
import type { UserDto } from '@/types/UserDto';

export interface PaymentServiceFees {
  percentageFees: number;
  constantFees: number;
  vat: number;
  total: number;
  providerFeeType: string;
  percentageBps: number;
  constantFee: number;
  cap: number | null;
}

export interface ExpectedFeeBreakdown {
  currency: string;
  debtboxFees: number;
  paymentServiceFees: PaymentServiceFees;
  instantPayoutFees: number;
  totalDeductions: number;
  expectedMerchantNetAmount: number;
}

export type DebtStatusValue =
  | 'overdue'
  | 'pending'
  | 'paid'
  | 'cancelled'
  | 'active'
  | 'in_arrears';

export type GroupStatusValue = DebtStatusValue | 'normal' | 'mixed';

export interface GroupedDebtChild {
  debtId: number;
  amount: number;
  title?: string;
  status?: DebtStatusValue;
  due_date?: string;
  expectedDebtboxFeeHalala?: number;
  expectedInstantPayoutFeeHalala?: number;
  expectedProviderFeeBaseHalala?: number;
  expectedProviderFeeVatHalala?: number;
  expectedProviderFeeTotalHalala?: number;
  expectedProviderFeeType?: string;
  expectedTotalDeductionsHalala?: number;
  expectedMerchantNetAmountHalala?: number;
  expectedFeeBreakdown?: ExpectedFeeBreakdown;
}

export interface Debt {
  debtId: number;
  customerId: number;
  full_name_ar: string;
  full_name_en: string;
  amount: number;
  due_date: string;
  original_date: string;
  status: DebtStatusValue;
  dueDateStatus: 'normal' | 'overdue' | 'in 7 days' | 'soon';
  isPending: boolean;
  isOverdue: boolean;
  title: string;
  reason: string;
  createWithSanad: boolean;
  paymentDate: string | null;
  paymentMethod: 'APPLE_PAY' | 'MADA' | 'VISA' | 'STC_PAY' | 'CASH' | null;
  oldDueDate?: string;
  newDueDate?: string | null;
  extensionRequestStatus?: string | null;
  expectedDebtboxFeeHalala?: number;
  expectedInstantPayoutFeeHalala?: number;
  expectedProviderFeeBaseHalala?: number;
  expectedProviderFeeVatHalala?: number;
  expectedProviderFeeTotalHalala?: number;
  expectedProviderFeeType?: string;
  expectedTotalDeductionsHalala?: number;
  expectedMerchantNetAmountHalala?: number;
  expectedFeeBreakdown?: ExpectedFeeBreakdown;
  groupId?: string | null;
  isGrouped?: boolean;
  debtIds?: number[];
  debtsCount?: number;
  groupAmount?: number;
  groupStatus?: GroupStatusValue;
  debts?: GroupedDebtChild[];
}

export interface DebtResponse {
  id: number;
  business: BusinessDto;
  customer: UserDto;
  amount: number;
  due_date: string;
  status: DebtStatusValue;
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
