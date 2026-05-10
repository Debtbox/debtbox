import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';
import type {
  ExpectedFeeBreakdown,
  GroupStatusValue,
} from '../../types/debt';

export interface FeeBreakdownItem {
  label: string;
  amount: number;
  amountHalala?: number;
  status?: GroupStatusValue;
  breakdown: ExpectedFeeBreakdown;
}

interface FeeBreakdownProps {
  items: FeeBreakdownItem[];
  notice?: string;
}

const badgeColorByStatus = (status?: GroupStatusValue): string => {
  switch (status) {
    case 'overdue':
    case 'in_arrears':
      return 'bg-red-500 text-white';
    case 'paid':
      return 'bg-emerald-500 text-white';
    case 'cancelled':
      return 'bg-gray-400 text-white';
    case 'pending':
      return 'bg-amber-500 text-white';
    case 'mixed':
      return 'bg-slate-500 text-white';
    default:
      return 'bg-gray-900 text-white';
  }
};

const formatNumber = (value: number | undefined, fractionDigits = 2): string => {
  if (value === undefined || value === null || Number.isNaN(value)) return '-';
  const fmt = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  });
  return fmt.format(value);
};

const FeeBreakdown = ({ items, notice }: FeeBreakdownProps) => {
  const { t } = useTranslation();
  const noticeText =
    notice ??
    t(
      'dashboard.expectedFeesNotice',
      'Please find below the Expected fees.',
    );

  if (items.length === 0) {
    return (
      <div className="px-1 pt-6">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700">
          <Info className="w-4 h-4 shrink-0" />
          <span>{noticeText}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-1 pt-6 space-y-6">
      <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700">
        <Info className="w-4 h-4 shrink-0" />
        <span>{noticeText}</span>
      </div>

      {items.map((item, idx) => (
        <div
          key={`${item.label}-${idx}`}
          className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 mb-1">
                {t('dashboard.debtsTotal', 'Debts Total')}
              </span>
              <span className="text-xl font-bold text-gray-900 break-all">
                {item.label}
              </span>
            </div>
            <div
              className={`rounded-md px-3 py-2 text-end shrink-0 ${badgeColorByStatus(item.status)}`}
            >
              <div className="text-[10px] uppercase tracking-wide opacity-80">
                {t('dashboard.debtsTotal', 'Debts Total')}
              </div>
              <div className="text-base font-bold">
                {formatNumber(item.amountHalala ?? item.amount * 100, 0)}
                <span className="text-xs font-medium ms-1">
                  {item.breakdown?.currency
                    ? t('dashboard.halalaSuffix', 'h')
                    : ''}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-x-4 gap-y-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">
                {t('dashboard.debtboxFees', 'Debtbox Fees')}
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {formatNumber(item.breakdown.debtboxFees)}
                <span className="text-xs text-gray-500 ms-1">
                  {item.breakdown.currency}
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">
                {t('dashboard.paymentFees', 'Payment fees')}
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {(item.breakdown.paymentServiceFees.percentageBps / 100).toFixed(2)}
                % = {formatNumber(item.breakdown.paymentServiceFees.total)}
                <span className="text-xs text-gray-500 ms-1">
                  {item.breakdown.currency}
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">
                {t('dashboard.instantPayoutFees', 'Instant payout fees')}
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {formatNumber(item.breakdown.instantPayoutFees)}
                <span className="text-xs text-gray-500 ms-1">
                  {item.breakdown.currency}
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">
                {t('dashboard.totalFees', 'Total fees')}
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {formatNumber(item.breakdown.totalDeductions)}
                <span className="text-xs text-gray-500 ms-1">
                  {item.breakdown.currency}
                </span>
              </div>
            </div>
            <div className="col-span-2">
              <div className="text-xs text-gray-500 mb-1">
                {t('dashboard.merchantNet', 'Merchant net')}
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {formatNumber(item.breakdown.expectedMerchantNetAmount)}
                <span className="text-xs text-gray-500 ms-1">
                  {item.breakdown.currency}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeeBreakdown;
