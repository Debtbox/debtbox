import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info } from 'lucide-react';
import { SaudiRiyal } from 'lucide-react';
import { useGetReceivables, type Receivable } from '../api/getReceivables';
import { useGetMerchantProfile } from '@/features/auth/api/getMerchantProfile';
import WalletOutIcon from '@/components/icons/WalletOutIcon';

const halalaToSAR = (halala: number) =>
  (halala / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const ReceivableRow = ({
  receivable,
  locale,
}: {
  receivable: Receivable;
  locale: string;
}) => {
  const { t } = useTranslation();
  const customerName =
    locale === 'ar'
      ? receivable.debt.customer.nameAr
      : receivable.debt.customer.nameEn;
  const debtAmount = parseFloat(receivable.debt.amount);

  return (
    <div className="flex items-start justify-between py-4 border-b border-gray-100 last:border-0 gap-4">
      <div className="min-w-0">
        <p className="text-xs text-gray-400">
          {t('receivables.customerFullName', 'Customer full name')}
        </p>
        <p className="font-semibold text-gray-900 truncate">{customerName}</p>
        {receivable.debt.title && (
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {receivable.debt.title}
          </p>
        )}
      </div>
      <div className="text-end shrink-0">
        <p className="text-xs text-gray-400">{t('receivables.debt', 'Debt')}</p>
        <p className="font-semibold text-gray-900 flex items-center gap-1 justify-end">
          <SaudiRiyal className="w-3.5 h-3.5 text-gray-900" />
          {debtAmount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <p className="text-xs text-gray-400 flex items-center gap-0.5 justify-end mt-0.5">
          {t('receivables.fee', 'Fee')} <SaudiRiyal className="w-2.5 h-2.5" />
          {halalaToSAR(receivable.amountOutstandingHalala)}
        </p>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="animate-pulse space-y-4">
    <div className="bg-red-50 rounded-2xl p-5 h-20" />
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex justify-between py-4 border-b border-gray-100"
        >
          <div className="space-y-1.5">
            <div className="h-3 w-28 bg-gray-200 rounded" />
            <div className="h-4 w-40 bg-gray-200 rounded" />
          </div>
          <div className="space-y-1.5 items-end flex flex-col">
            <div className="h-3 w-12 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const OutstandingFees = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const locale = i18n.language;

  const { data: profileData, isLoading: profileLoading } =
    useGetMerchantProfile({});
  const { data: receivablesData, isLoading: receivablesLoading } =
    useGetReceivables({
      params: { status: 'OPEN,PARTIALLY_SETTLED', limit: 100 },
    });

  const isLoading = profileLoading || receivablesLoading;
  const totalOutstandingHalala =
    profileData?.data?.outstandingReceivablesHalala ?? 0;
  const debtsCount = profileData?.data?.outstandingReceivablesDebtsCount ?? 0;
  const receivables = receivablesData?.data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{t('navigation.settings', 'Settings')}</span>
        </button>
        <span className="text-gray-300">/</span>
        <span className="font-bold text-gray-900">
          {t('receivables.outstandingFees', 'Outstanding Fees')}
        </span>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl p-6">
          <SkeletonCard />
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 space-y-4">
          {/* Summary card */}
          <div className="bg-red-50 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <WalletOutIcon />
            </div>
            <div>
              <p className="text-xs text-gray-500">
                {t('receivables.totalFees', 'Total Fees')}
              </p>
              <p className="text-2xl font-bold text-red-500 flex items-center gap-1">
                <SaudiRiyal className="w-5 h-5" />
                {halalaToSAR(totalOutstandingHalala)}
              </p>
            </div>
          </div>

          {/* Receivables list */}
          {receivables.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">
                {t(
                  'receivables.forDebtsCount',
                  'For {count} Debts paid in cash',
                  { count: debtsCount },
                )}
              </p>
              <div>
                {receivables.map((r) => (
                  <ReceivableRow key={r.id} receivable={r} locale={locale} />
                ))}
              </div>
            </div>
          )}

          {receivables.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">
              {t(
                'receivables.noOutstandingFees',
                'No outstanding fees at the moment.',
              )}
            </p>
          )}

          {/* Info note */}
          <div className="flex items-start gap-2 pt-2">
            <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500">
              {t(
                'receivables.cashPaymentNote',
                'If a customer paid you directly in cash, the platform fees will be automatically deducted from your upcoming payouts.',
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
