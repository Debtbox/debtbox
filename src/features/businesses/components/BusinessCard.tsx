import OutstandingIcon from '@/components/icons/OutstandingIcon';
import OverdueIcon from '@/components/icons/OverdueIcon';
import TotalInprogressIcon from '@/components/icons/TotalInprogressIcon';
import Button from '@/components/shared/Button';
import { SaudiRiyal } from 'lucide-react';
import type { BusinessDto } from '@/types/BusinessDto';
import { useTranslation } from 'react-i18next';

interface BusinessCardProps {
  business: BusinessDto;
  onEdit?: (business: BusinessDto) => void;
  onDelete?: (business: BusinessDto) => void;
}

const BusinessCard = ({ business, onEdit, onDelete }: BusinessCardProps) => {
  const { i18n, t } = useTranslation();
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2 flex-1">
          <span className="text-[#7C7C7C] text-xs">
            {t('dashboard.businessName', 'Business Name')}
          </span>
          <h3 className="text-2xl sm:text-3xl font-semibold text-[#4A4A4A]">
            {i18n.language === 'ar'
              ? business.business_name_ar
              : business.business_name_en}
          </h3>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            text={t('businesses.edit')}
            className="h-12 w-full sm:w-40 md:w-52 border border-[#E2E2E2] rounded-lg text-[#1F1F1F] hover:bg-gray-50 transition-colors duration-200"
            onClick={() => onEdit?.(business)}
          />
          <Button
            text={t('businesses.delete')}
            className="h-12 w-full sm:w-40 md:w-52 border border-[#FF0B0B] rounded-lg text-[#FF0B0B] hover:bg-red-50 transition-colors duration-200"
            onClick={() => onDelete?.(business)}
          />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <span className="text-[#717680] text-xs">
            {t('businesses.storeCrNumber')}
          </span>
          <h3 className="text-base font-semibold text-[#414651]">
            {business.cr_number}
          </h3>
        </div>
        <div className="space-y-2">
          <span className="text-[#717680] text-xs">{t('business.city')}</span>
          <h3 className="text-base font-semibold text-[#414651]">
            {business.city}
          </h3>
        </div>
        <div className="space-y-2">
          <span className="text-[#717680] text-xs">
            {t('businesses.storeType')}
          </span>
          <h3 className="text-base font-semibold text-[#414651]">
            {business.activity}
          </h3>
        </div>
        <div className="space-y-2">
          <span className="text-[#717680] text-sm flex items-center gap-2">
            <OutstandingIcon /> {t('businesses.totalOutstanding')}
          </span>
          <h3 className="text-xl sm:text-2xl font-semibold text-[#414651] flex items-center gap-1">
            {business.totalOutstandingAmount?.toLocaleString() || 0}{' '}
            <SaudiRiyal />
          </h3>
          <span className="text-[#717680] text-xs">
            {t('businesses.activeCustomerDebts')}
          </span>
        </div>
        <div className="space-y-2">
          <span className="text-[#717680] text-sm flex items-center gap-2">
            <TotalInprogressIcon /> {t('businesses.totalPaidAmount')}
          </span>
          <h3 className="text-xl sm:text-2xl font-semibold text-[#414651] flex items-center gap-1">
            {business.totalPaidAmount?.toLocaleString() || 0} <SaudiRiyal />
          </h3>
          <span className="text-[#717680] text-xs">
            {t('businesses.activeCustomerDebts')}
          </span>
        </div>
        <div className="space-y-2">
          <span className="text-[#717680] text-sm flex items-center gap-2">
            <OverdueIcon /> {t('common.buttons.overdue')}
          </span>
          <h3 className="text-xl sm:text-2xl font-semibold text-[#414651] flex items-center gap-1">
            {business.totalOverdueAmount?.toLocaleString() || 0} <SaudiRiyal />
          </h3>
          <span className="text-[#717680] text-xs">
            {t('businesses.customersOverdue', {
              count: business.totalOverdueCustomers || 0,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
