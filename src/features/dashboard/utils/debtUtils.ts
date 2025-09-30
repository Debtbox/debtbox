import { type Debt, type DebtTableData, type DebtFilters } from '../types/debt';

export const formatCurrency = (amount: number, currency: string = 'SAR'): string => {
  return new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // If the date is invalid, try parsing it differently
      const parsedDate = new Date(dateString.replace('T00:00:00.000Z', ''));
      if (isNaN(parsedDate.getTime())) {
        return dateString; // Return original string if still invalid
      }
      return new Intl.DateTimeFormat('en-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(parsedDate);
    }
    return new Intl.DateTimeFormat('en-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return dateString; // Return original string if formatting fails
  }
};

export const getDaysUntilDue = (dueDate: string): number => {
  try {
    const today = new Date();
    const due = new Date(dueDate);
    
    if (isNaN(due.getTime())) {
      // If the date is invalid, try parsing it differently
      const parsedDate = new Date(dueDate.replace('T00:00:00.000Z', ''));
      if (isNaN(parsedDate.getTime())) {
        return 0; // Return 0 if date is still invalid
      }
      const diffTime = parsedDate.getTime() - today.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch (error) {
    console.error('Error calculating days until due:', dueDate, error);
    return 0;
  }
};

export const getStatusInfo = (dueDateStatus: string) => {
  const statusMap: Record<string, { label: string; color: string; dotColor: string }> = {
    'normal': {
      label: 'Normal',
      color: 'bg-green-100 text-green-800',
      dotColor: 'bg-green-500',
    },
    'soon': {
      label: 'Due Soon',
      color: 'bg-yellow-100 text-yellow-800',
      dotColor: 'bg-yellow-500',
    },
    'almost': {
      label: 'Almost Due',
      color: 'bg-orange-100 text-orange-800',
      dotColor: 'bg-orange-500',
    },
    'overdue': {
      label: 'Overdue',
      color: 'bg-red-100 text-red-800',
      dotColor: 'bg-red-500',
    },
  };

  return statusMap[dueDateStatus] || statusMap['normal'];
};

export const processDebtData = (debt: Debt, language: string = 'en'): DebtTableData => {
  const daysUntilDue = getDaysUntilDue(debt.dueDate);
  const statusInfo = getStatusInfo(debt.dueDateStatus);
  const customerName = language === 'ar' ? debt.full_name_ar : debt.full_name_en;

  return {
    ...debt,
    customerName,
    formattedAmount: formatCurrency(debt.amount),
    formattedDueDate: formatDate(debt.dueDate),
    statusColor: statusInfo.color,
    statusLabel: statusInfo.label,
    daysUntilDue,
  };
};

export const filterDebts = (debts: Debt[], filters: DebtFilters, language: string = 'en'): Debt[] => {
  return debts.filter((debt) => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const customerName = language === 'ar' ? debt.full_name_ar : debt.full_name_en;
      const matchesSearch = customerName.toLowerCase().includes(searchTerm);
      
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (debt.dueDateStatus !== filters.status) return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const debtDate = new Date(debt.dueDate);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      if (debtDate < startDate || debtDate > endDate) return false;
    }

    return true;
  });
};

export const sortDebts = (debts: Debt[], sortKey: string, direction: 'asc' | 'desc'): Debt[] => {
  return [...debts].sort((a, b) => {
    let aValue: any = a[sortKey as keyof Debt];
    let bValue: any = b[sortKey as keyof Debt];

    // Handle date sorting
    if (sortKey === 'dueDate' || sortKey === 'createdAt' || sortKey === 'updatedAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    // Handle number sorting
    if (sortKey === 'amount') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }

    // Handle string sorting
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};
