import Button from '@/components/shared/Button';
import MaskIconBottom from './icons/MaskIconBottom';
import MaskIconBottomSm from './icons/MaskIconBottomSm';
import MaskIconTop from './icons/MaskIconTop';
import MaskIconTopSm from './icons/MaskIconTopSm';
import { useTranslation } from 'react-i18next';
const DueAmountCard = ({ onAddPayment }: { onAddPayment: () => void }) => {
  const { t } = useTranslation();
  return (
    <div className="w-full h-full rounded-[36px] bg-gradient-to-b from-[#9C2CF3] to-[#3A49F9] px-5 py-8 relative overflow-hidden">
      <MaskIconTop className="absolute top-0 end-0" />
      <MaskIconTopSm className="absolute top-0 end-0" />
      <MaskIconBottom className="absolute bottom-0 start-0" />
      <MaskIconBottomSm className="absolute bottom-0 start-0" />
      <h6 className="text-xs text-white font-medium mb-1">
        {t('dashboard.total_due_amount', 'Total Due Amount')}
      </h6>
      <h3 className="text-2xl text-white font-extrabold mb-4">
        10,550,350 SAR
      </h3>
      <p className="text-xs text-[#C4C4C4] font-medium mb-1 relative z-10">
        {t(
          'dashboard.track_all_pending_customer_payments',
          'Track all pending customer payments',
        )}
      </p>
      <p className="text-xs text-white font-medium mb-4 relative z-10">
        {t(
          'dashboard.payments_are_vital_for_cash_flow',
          'Payments are vital for cash flow',
        )}
      </p>

      <Button
        onClick={onAddPayment}
        text={t('dashboard.add_payment', 'Add Payment')}
        className="bg-white text-gray-800 font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors w-full relative z-10"
      />
    </div>
  );
};

export default DueAmountCard;
