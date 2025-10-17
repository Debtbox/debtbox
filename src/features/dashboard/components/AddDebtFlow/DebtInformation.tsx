import { useTranslation } from 'react-i18next';
import type { DebtResponse } from '../../types/debt';
import { formatDate, type SupportedLocale } from '../../utils/debtUtils';

const DebtInformation = ({ debtData }: { debtData: DebtResponse }) => {
  const { t, i18n } = useTranslation();
  return (
    <>
      <h3 className="text-2xl font-bold mb-3">
        {debtData?.amount.toLocaleString()} {t('common.fields.sar', 'SAR')}
      </h3>
      <div className="grid grid-cols-2 text-center gap-4 w-full border-b border-gray-200 border-dashed pb-4">
        <div className="text-[#707070] text-start">
          {t('dashboard.customerName')}
        </div>
        <div className="text-xl text-end">
          {i18n.language === 'ar'
            ? debtData?.customer.full_name_ar
            : debtData?.customer.full_name_en}
        </div>
        <div className="text-[#707070] text-start">
          {t('dashboard.customerId')}
        </div>
        <div className="text-xl text-end">{debtData?.customer.national_id}</div>
        <div className="text-[#707070] text-start">
          {t('dashboard.businessName')}
        </div>
        <div className="text-xl text-end">
          {i18n.language === 'ar'
            ? debtData?.business.business_name_ar
            : debtData?.business.business_name_en}
        </div>
        <div className="text-[#707070] text-start">
          {t('dashboard.dueDate')}
        </div>
        <div className="text-xl  text-end">
          {formatDate(debtData?.due_date, {
            includeTime: true,
            locale: i18n.language as SupportedLocale,
          })}
        </div>
      </div>
      <div className="grid grid-cols-2 text-center gap-4 w-full mt-4">
        <div className="text-[#707070] text-start">{t('dashboard.amount')}</div>
        <div className="text-xl  text-end">
          {debtData?.amount.toLocaleString()} {t('common.fields.sar', 'SAR')}
        </div>
      </div>
    </>
  );
};

export default DebtInformation;
