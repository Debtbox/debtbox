import { type Debt, type DebtTableData, type DebtFilters } from '../types/debt';

export const DEFAULT_TIMEZONE = 'Asia/Riyadh';
export const SUPPORTED_LOCALES = {
  en: 'en-SA',
  ar: 'ar-SA-u-ca-gregory', // Explicitly use Gregorian calendar (ميلادي) instead of Hijri (هجري)
} as const;

export type SupportedLocale = keyof typeof SUPPORTED_LOCALES;

export interface DateFormatOptions {
  includeTime?: boolean;
  locale?: SupportedLocale;
  timezone?: string;
  format?: 'short' | 'medium' | 'long' | 'full';
}

export const formatCurrency = (
  amount: number,
  locale: SupportedLocale = 'en',
): string => {
  const localeCode = SUPPORTED_LOCALES[locale];
  return new Intl.NumberFormat(localeCode, {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (
  dateString: string,
  options: DateFormatOptions = {},
): string => {
  const {
    includeTime = false,
    locale = 'en',
    timezone = DEFAULT_TIMEZONE,
    format = 'medium',
  } = options;

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      // Try parsing with different formats
      const parsedDate = new Date(dateString?.replace('T00:00:00.000Z', ''));
      if (isNaN(parsedDate.getTime())) {
        return dateString;
      }
      return formatDateWithOptions(
        parsedDate,
        includeTime,
        locale,
        timezone,
        format,
      );
    }

    return formatDateWithOptions(date, includeTime, locale, timezone, format);
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return dateString;
  }
};

const formatDateWithOptions = (
  date: Date,
  includeTime: boolean,
  locale: SupportedLocale,
  timezone: string,
  format: string,
): string => {
  const localeCode = SUPPORTED_LOCALES[locale];

  const formatOptions: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    calendar: 'gregory', // Force Gregorian calendar (ميلادي) instead of Hijri (هجري)
    year: 'numeric',
    month: format === 'short' ? 'short' : format === 'long' ? 'long' : 'short',
    day: 'numeric',
  };

  if (includeTime) {
    formatOptions.hour = '2-digit';
    formatOptions.minute = '2-digit';
    formatOptions.hour12 = locale === 'ar' ? false : true; // 24-hour for Arabic, 12-hour for English
  }

  return new Intl.DateTimeFormat(localeCode, formatOptions).format(date);
};

// Timezone-aware utility functions
export const getCurrentDateInTimezone = (
  timezone: string = DEFAULT_TIMEZONE,
): Date => {
  const now = new Date();
  return new Date(now.toLocaleDateString('en-CA', { timeZone: timezone }));
};

export const isDateInPast = (
  dateString: string,
  timezone: string = DEFAULT_TIMEZONE,
): boolean => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false;

    const today = getCurrentDateInTimezone(timezone);
    const targetDate = new Date(
      date.toLocaleDateString('en-CA', { timeZone: timezone }),
    );

    return targetDate < today;
  } catch (error) {
    console.error('Error checking if date is in past:', dateString, error);
    return false;
  }
};

export const isDateToday = (
  dateString: string,
  timezone: string = DEFAULT_TIMEZONE,
): boolean => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false;

    const today = getCurrentDateInTimezone(timezone);
    const targetDate = new Date(
      date.toLocaleDateString('en-CA', { timeZone: timezone }),
    );

    return targetDate.toDateString() === today.toDateString();
  } catch (error) {
    console.error('Error checking if date is today:', dateString, error);
    return false;
  }
};

export const getRelativeDateString = (
  dateString: string,
  locale: SupportedLocale = 'en',
  timezone: string = DEFAULT_TIMEZONE,
): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const today = getCurrentDateInTimezone(timezone);
    const targetDate = new Date(
      date.toLocaleDateString('en-CA', { timeZone: timezone }),
    );
    const daysDiff = Math.ceil(
      (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysDiff === 0) {
      return locale === 'ar' ? 'اليوم' : 'Today';
    } else if (daysDiff === 1) {
      return locale === 'ar' ? 'غداً' : 'Tomorrow';
    } else if (daysDiff === -1) {
      return locale === 'ar' ? 'أمس' : 'Yesterday';
    } else if (daysDiff > 0) {
      return locale === 'ar' ? `خلال ${daysDiff} أيام` : `In ${daysDiff} days`;
    } else {
      return locale === 'ar'
        ? `منذ ${Math.abs(daysDiff)} أيام`
        : `${Math.abs(daysDiff)} days ago`;
    }
  } catch (error) {
    console.error('Error getting relative date string:', dateString, error);
    return dateString;
  }
};

export const getDaysUntilDue = (
  dueDate: string,
  timezone: string = DEFAULT_TIMEZONE,
): number => {
  try {
    // Get current date in the specified timezone
    const now = new Date();
    const today = new Date(
      now.toLocaleDateString('en-CA', { timeZone: timezone }),
    );

    // Parse the due date
    let due = new Date(dueDate);

    if (isNaN(due.getTime())) {
      // Try parsing with different formats
      due = new Date(dueDate?.replace('T00:00:00.000Z', ''));
      if (isNaN(due.getTime())) {
        return 0; // Return 0 if date is still invalid
      }
    }

    // Convert due date to the same timezone for accurate comparison
    const dueInTimezone = new Date(
      due.toLocaleDateString('en-CA', { timeZone: timezone }),
    );

    // Calculate the difference in days
    const diffTime = dueInTimezone.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch (error) {
    console.error('Error calculating days until due:', dueDate, error);
    return 0;
  }
};

export const getStatusInfo = (dueDateStatus: string) => {
  const statusMap: Record<
    string,
    { label: string; color: string; dotColor: string }
  > = {
    normal: {
      label: 'Normal',
      color: 'bg-green-100 text-green-800',
      dotColor: 'bg-green-500',
    },
    soon: {
      label: 'Due Soon',
      color: 'bg-yellow-100 text-yellow-800',
      dotColor: 'bg-yellow-500',
    },
    almost: {
      label: 'Almost Due',
      color: 'bg-orange-100 text-orange-800',
      dotColor: 'bg-orange-500',
    },
    overdue: {
      label: 'Overdue',
      color: 'bg-red-100 text-red-800',
      dotColor: 'bg-red-500',
    },
  };

  return statusMap[dueDateStatus] || statusMap['normal'];
};

export const processDebtData = (
  debt: Debt,
  language: string = 'en',
  timezone: string = DEFAULT_TIMEZONE,
  includeTime: boolean = false,
): DebtTableData => {
  const locale = language as SupportedLocale;
  const daysUntilDue = getDaysUntilDue(debt.due_date, timezone);
  const statusInfo = getStatusInfo(debt.dueDateStatus);
  const customerName =
    language === 'ar' ? debt.full_name_ar : debt.full_name_en;

  return {
    ...debt,
    customerName,
    formattedAmount: formatCurrency(debt.amount, locale),
    formattedDueDate: formatDate(debt.due_date, {
      includeTime,
      locale,
      timezone,
      format: 'medium',
    }),
    formattedOriginalDueDate: formatDate(debt.original_date, {
      includeTime,
      locale,
      timezone,
      format: 'full',
    }),
    statusColor: statusInfo.color,
    statusLabel: statusInfo.label,
    daysUntilDue,
  };
};

export const filterDebts = (
  debts: Debt[],
  filters: DebtFilters,
  language: string = 'en',
  timezone: string = DEFAULT_TIMEZONE,
): Debt[] => {
  return debts.filter((debt) => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const customerName =
        language === 'ar' ? debt.full_name_ar : debt.full_name_en;
      const matchesSearch = customerName.toLowerCase().includes(searchTerm);

      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (debt.dueDateStatus !== filters.status) return false;
    }

    // Date range filter with timezone awareness
    if (filters.dateRange) {
      const debtDate = new Date(debt.due_date);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);

      // Convert all dates to the same timezone for accurate comparison
      const debtDateInTimezone = new Date(
        debtDate.toLocaleDateString('en-CA', { timeZone: timezone }),
      );
      const startDateInTimezone = new Date(
        startDate.toLocaleDateString('en-CA', { timeZone: timezone }),
      );
      const endDateInTimezone = new Date(
        endDate.toLocaleDateString('en-CA', { timeZone: timezone }),
      );

      if (
        debtDateInTimezone < startDateInTimezone ||
        debtDateInTimezone > endDateInTimezone
      ) {
        return false;
      }
    }

    return true;
  });
};

export const sortDebts = (
  debts: Debt[],
  sortKey: string,
  direction: 'asc' | 'desc',
): Debt[] => {
  return [...debts].sort((a, b) => {
    let aValue: string | number | boolean = a[sortKey as keyof Debt];
    let bValue: string | number | boolean = b[sortKey as keyof Debt];

    // Handle date sorting
    if (
      sortKey === 'dueDate' ||
      sortKey === 'createdAt' ||
      sortKey === 'updatedAt'
    ) {
      aValue = new Date(aValue as string).getTime();
      bValue = new Date(bValue as string).getTime();
    }

    // Handle number sorting
    if (sortKey === 'amount') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }

    // Handle string sorting
    if (typeof aValue === 'string' && typeof bValue === 'string') {
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
