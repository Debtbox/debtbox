import Button from '@/components/shared/Button';
import MaskIconBottom from './icons/MaskIconBottom';
import MaskIconTop from './icons/MaskIconTop';
import { useTranslation } from 'react-i18next';
import { SaudiRiyal } from 'lucide-react';
import { paymentLogo } from '@/assets/images';

const DueAmountCard = ({
  onAddPayment,
  totalDueAmount,
}: {
  onAddPayment: () => void;
  totalDueAmount: string;
}) => {
  const { t } = useTranslation();
  return (
    <div className="w-full h-full rounded-2xl bg-linear-to-b from-[#001DB2] to-[#0B1B6A] px-5 py-8 relative overflow-hidden">
      <MaskIconTop className="absolute top-0 left-0" />
      <MaskIconBottom className="absolute bottom-0 right-0" />
      <div className="flex items-start justify-between">
        <div className="relative z-10">
          <h6 className="text-xs text-white font-medium mb-1">
            {t('dashboard.total_due_amount', 'Total Due Amount')}
          </h6>
          <h3 className="text-2xl text-white font-extrabold mb-4 flex items-center gap-1">
            <SaudiRiyal className="text-white" /> {totalDueAmount}
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
        </div>
        <div className="relative z-10">
          <img src={paymentLogo} alt="payment" className="w-full h-full" />
        </div>
      </div>

      <Button
        onClick={onAddPayment}
        text={t('dashboard.add_debt', 'Add Payment')}
        className="bg-white text-gray-800 font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 w-full relative z-10"
      />
    </div>
  );
};

export default DueAmountCard;
