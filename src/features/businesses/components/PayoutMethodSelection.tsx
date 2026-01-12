import Button from '@/components/shared/Button';
import CheckBox from '@/components/shared/CheckBox';
import { useTranslation } from 'react-i18next';
import type { NewBusiness } from '../utils/businessFormUtils';

interface PayoutMethodSelectionProps {
  payoutMethod: NewBusiness['payoutMethod'];
  onPayoutMethodChange: (method: NewBusiness['payoutMethod']) => void;
  onBack: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

const PayoutMethodSelection = ({
  payoutMethod,
  onPayoutMethodChange,
  onBack,
  onSubmit,
  isLoading = false,
}: PayoutMethodSelectionProps) => {
  const { t } = useTranslation();

  const getMethodTitle = (method: NewBusiness['payoutMethod']) => {
    if (method === 'weekly')
      return t('auth.signUp.payoutWeekly') || 'Weekly Payout';
    if (method === 'monthly')
      return t('auth.signUp.payoutMonthly') || 'Monthly Payout';
    return t('auth.signUp.payoutInstant') || 'Instant Payout';
  };

  const getMethodDescription = (method: NewBusiness['payoutMethod']) => {
    if (method === 'weekly')
      return (
        t('auth.signUp.payoutWeeklyDescription') ||
        'Receive your money on a weekly basis.'
      );
    if (method === 'monthly')
      return (
        t('auth.signUp.payoutMonthlyDescription') ||
        'Receive your money on a monthly basis.'
      );
    return (
      t('auth.signUp.payoutInstantDescription') ||
      'Receive your money immediately once the customer completes the payment. Please note that additional bank and payment processing fees apply and will be deducted automatically.'
    );
  };

  return (
    <>
      <div className="animate-fade-in">
        <h2 className="text-black text-2xl font-bold pt-8 pb-3 animate-slide-down">
          {t('auth.signUp.payoutMethodTitle') ||
            'When do you want to receive your money?'}
        </h2>
        <p className="text-[#828282] text-sm mb-12 animate-slide-down animation-delay-100">
          {t('auth.signUp.payoutMethodDescription') ||
            'Pick the collection method that best fits your business needs.'}
        </p>
      </div>
      <div className="flex flex-col gap-2 w-full mb-4 animate-fade-in animation-delay-200">
        {(['weekly', 'monthly', 'instant'] as const).map((method, index) => {
          const isSelected = payoutMethod === method;
          const handleToggle = () => {
            onPayoutMethodChange(method);
          };

          return (
            <div
              key={method}
              className={`flex justify-between items-start shadow-lg p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-primary/5 border-2 border-primary'
                  : 'bg-white border-2 border-transparent hover:bg-gray-50'
              }`}
              onClick={handleToggle}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <label className="flex flex-col gap-1 flex-1 cursor-pointer">
                <span className={`font-semibold ${
                  isSelected ? 'text-primary' : 'text-gray-900'
                }`}>
                  {getMethodTitle(method)}
                </span>
                <span className="text-xs text-[#B0B0B0]">
                  {getMethodDescription(method)}
                </span>
              </label>
              <CheckBox checked={isSelected} onChange={handleToggle} />
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 mt-auto pt-4 animate-fade-in animation-delay-300">
        <Button
          onClick={onBack}
          className="flex-1 h-12"
          text={t('common.buttons.back') || 'Back'}
          variant="secondary"
        />
        <Button
          onClick={onSubmit}
          className="flex-1 h-12"
          text={t('common.buttons.add') || 'Add'}
          isLoading={isLoading}
          variant="primary"
        />
      </div>
    </>
  );
};

export default PayoutMethodSelection;
