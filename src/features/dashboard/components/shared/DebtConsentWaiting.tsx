import { useTranslation } from 'react-i18next';
import Button from '@/components/shared/Button';
import WaitingIcon from '@/components/icons/WaitingIcon';

interface DebtConsentWaitingProps {
  onCancel: () => void;
  showStepIndicator?: boolean;
  stepText?: string;
  /** Override title translation key (e.g. for paid-in-cash flow) */
  titleKey?: string;
  /** Override message translation key (e.g. for paid-in-cash flow) */
  messageKey?: string;
}

const DebtConsentWaiting = ({
  onCancel,
  showStepIndicator = true,
  stepText,
  titleKey = 'dashboard.waitingForCustomerResponse',
  messageKey = 'dashboard.waitingForCustomerResponseMessage',
}: DebtConsentWaitingProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in">
        <WaitingIcon />
        <h2 className="text-2xl font-bold text-gray-800 mb-2 animate-slide-down animation-delay-100">
          {t(titleKey)}
        </h2>
        <p className="text-gray-600 animate-slide-down animation-delay-200">
          {t(messageKey)}
        </p>
      </div>

      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        {showStepIndicator && (
          <div className="text-sm text-gray-500 font-medium flex-1">
            {stepText || t('dashboard.step_2_of_3')}
          </div>
        )}
        <div className="flex items-center gap-2 flex-1">
          <Button
            type="button"
            text={t('common.buttons.cancel')}
            onClick={onCancel}
            className="flex-1 p-2 h-12"
            variant="secondary"
          />
          <Button
            type="button"
            disabled
            text={t('common.buttons.next')}
            className="flex-1 p-2 h-12"
            variant="primary"
          />
        </div>
      </div>
    </div>
  );
};

export default DebtConsentWaiting;
