export interface Debt {
  debtId: number;
  customerId: number;
  full_name_ar: string;
  full_name_en: string;
  amount: number;
  dueDate: string;
  status: string;
  dueDateStatus: string;
}

export interface DebtTableData extends Debt {
  customerName: string;
  formattedAmount: string;
  formattedDueDate: string;
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

export interface DebtTableData extends Debt {
  formattedAmount: string;
  formattedDueDate: string;
  statusColor: string;
  statusLabel: string;
  daysUntilDue: number;
}
