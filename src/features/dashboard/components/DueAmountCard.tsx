import { useEffect, useRef, useState } from 'react';
import Button from '@/components/shared/Button';
import MaskIconBottom from './icons/MaskIconBottom';
import MaskIconTop from './icons/MaskIconTop';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Info, SaudiRiyal } from 'lucide-react';
import { whiteFullLogo } from '@/assets/images';
import { useUserStore } from '@/stores/UserStore';
import type { BusinessDto } from '@/types/BusinessDto';

interface DueAmountCardProps {
  onAddPayment: () => void;
  netAmount: string;
  pendingAmount?: string;
  serviceFee?: string;
  onViewBreakdown?: () => void;
  showViewBreakdown?: boolean;
}

const DueAmountCard = ({
  onAddPayment,
  netAmount,
  pendingAmount,
  serviceFee,
  onViewBreakdown,
  showViewBreakdown = false,
}: DueAmountCardProps) => {
  const { t, i18n } = useTranslation();
  const { user, selectedBusiness, setSelectedBusiness } = useUserStore();
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const storeRef = useRef<HTMLDivElement>(null);
  const businesses = user?.businesses ?? [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        storeRef.current &&
        !storeRef.current.contains(event.target as Node)
      ) {
        setIsStoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDisplayName = (business: BusinessDto) =>
    i18n.language === 'ar'
      ? business.business_name_ar
      : business.business_name_en;

  const storeLabel = selectedBusiness
    ? getDisplayName(selectedBusiness)
    : t('dashboard.allStores', 'All stores');

  return (
    <div className="w-full h-full rounded-2xl bg-linear-to-b from-[#001DB2] to-[#0B1B6A] px-5 py-6 relative overflow-hidden">
      <MaskIconTop className="absolute top-0 left-0" />
      <MaskIconBottom className="absolute bottom-0 right-0" />

      <div className="relative z-10 flex items-start justify-between gap-3 mb-6">
        <div className="relative" ref={storeRef}>
          <button
            type="button"
            onClick={() => businesses.length > 1 && setIsStoreOpen((o) => !o)}
            className={`flex items-center gap-2 rounded-lg border border-white/30 bg-white/5 px-4 py-2.5 text-white min-w-[200px] max-w-[260px] transition-colors ${
              businesses.length > 1
                ? 'hover:bg-white/10 cursor-pointer'
                : 'cursor-default'
            }`}
          >
            <span className="text-sm text-white/70 shrink-0">
              {t('dashboard.store', 'Store')}:
            </span>
            <span className="text-sm font-semibold text-white truncate flex-1 text-start">
              {storeLabel}
            </span>
            {businesses.length > 1 && (
              <ChevronDown
                className={`w-4 h-4 text-white/80 transition-transform ${
                  isStoreOpen ? 'rotate-180' : ''
                }`}
              />
            )}
          </button>
          {isStoreOpen && businesses.length > 1 && (
            <div className="absolute start-0 mt-2 w-72 bg-white shadow-lg rounded-lg z-20 overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                {businesses.map((business) => (
                  <button
                    key={business.cr_number}
                    type="button"
                    onClick={() => {
                      setSelectedBusiness(business);
                      setIsStoreOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-start text-sm hover:bg-gray-50 transition-colors ${
                      selectedBusiness?.cr_number === business.cr_number
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700'
                    }`}
                  >
                    <div className="truncate">{getDisplayName(business)}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {t('business.crNumber', 'CR')}: {business.cr_number}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <img
          src={whiteFullLogo}
          alt="Debtbox"
          className="h-8 md:h-10 w-auto shrink-0 opacity-95"
        />
      </div>

      <div className="relative z-10 flex items-end justify-between gap-4 flex-wrap mb-6">
        <div className="flex-1 min-w-[180px]">
          <h6 className="text-xs text-white/80 font-medium mb-2">
            {t('dashboard.dueAmount', 'Due Amount')}
          </h6>
          <h3 className="text-xl md:text-2xl text-white font-extrabold mb-2 flex items-center gap-1.5">
            <SaudiRiyal className="text-white w-5 h-5 md:w-6 md:h-6" />
            <span>{netAmount}</span>
          </h3>
          {pendingAmount && (
            <p className="text-xs text-white/80 font-medium flex items-center gap-1 flex-wrap">
              {t('dashboard.fromTotal', 'From Total')}{' '}
              <span className="text-white font-semibold inline-flex items-center gap-1">
                <SaudiRiyal className="text-white w-3 h-3" />
                {pendingAmount}
              </span>{' '}
              {t('dashboard.pendingPayments', 'pending payments')}
            </p>
          )}
        </div>

        {serviceFee && (
          <div className="flex flex-col">
            <span className="text-xs text-white/80 font-medium mb-2">
              {t('dashboard.service', 'Service')}
            </span>
            <span className="text-lg md:text-xl text-white font-extrabold flex items-center gap-1">
              <SaudiRiyal className="text-white w-4 h-4 md:w-5 md:h-5" />
              <span>{serviceFee}</span>
            </span>
          </div>
        )}

        {showViewBreakdown && onViewBreakdown && (
          <button
            type="button"
            onClick={onViewBreakdown}
            className="inline-flex items-center gap-2 text-sm text-white border border-white/40 hover:bg-white/10 transition-colors rounded-lg px-4 py-2.5"
          >
            <Info className="w-4 h-4" />
            {t('dashboard.feesBreakdown', 'Fees Breakdown')}
          </button>
        )}
      </div>

      <Button
        onClick={onAddPayment}
        text={t('dashboard.add_debt', 'Add Debt')}
        className="bg-white text-gray-800 font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 w-full relative z-10"
      />
    </div>
  );
};

export default DueAmountCard;
