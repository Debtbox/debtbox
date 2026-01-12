import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { socketManager } from '@/utils/socket';
import Button from '@/components/shared/Button';
import WaitingIcon from '@/components/icons/WaitingIcon';

interface WaitingForCustomerResponseProps {
  merchantId: string;
  debtId?: string;
  onCustomerResponse: (
    response: 'accepted' | 'rejected' | 'expired',
    data?: unknown,
  ) => void;
  onBack: () => void;
}

const WaitingForCustomerResponse = ({
  merchantId,
  debtId,
  onCustomerResponse,
  onBack,
}: WaitingForCustomerResponseProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    socketManager.connect(merchantId);

    const handleDebtConsentUpdate = (data: unknown) => {
      const responseData = data as {
        debtId?: string | number;
        action?: string;
      };
      if (responseData.debtId?.toString() === debtId) {
        socketManager.offDebtConsentUpdate(handleDebtConsentUpdate);
        socketManager.offDisconnect();

        if (responseData.action === 'accepted') {
          socketManager.disconnect();
          onCustomerResponse('accepted', data);
        } else if (responseData.action === 'rejected') {
          socketManager.disconnect();
          onCustomerResponse('rejected', data);
        } else if (responseData.action === 'expired') {
          socketManager.disconnect();
          onCustomerResponse('expired', data);
        }
      }
    };

    const handleDisconnect = () => {
      socketManager.offDebtConsentUpdate(handleDebtConsentUpdate);
      socketManager.offDisconnect();
      onCustomerResponse('expired');
    };

    socketManager.onDebtConsentUpdate(handleDebtConsentUpdate);
    socketManager.onDisconnect(handleDisconnect);

    return () => {
      socketManager.offDebtConsentUpdate(handleDebtConsentUpdate);
      socketManager.offDisconnect();
      socketManager.disconnect();
    };
  }, [merchantId, debtId, onCustomerResponse]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in">
        <WaitingIcon />
        <h2 className="text-2xl font-bold text-gray-800 mb-2 animate-slide-down animation-delay-100">
          {t('dashboard.waitingForCustomerResponse')}
        </h2>
        <p className="text-gray-600 animate-slide-down animation-delay-200">
          {t('dashboard.waitingForCustomerResponseMessage')}
        </p>
      </div>

      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <div className="text-sm text-gray-500 font-medium flex-1">
          {t('dashboard.step_2_of_3')}
        </div>
        <div className="flex items-center gap-2 flex-1">
          <Button
            type="button"
            text={t('common.buttons.cancel')}
            onClick={onBack}
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

export default WaitingForCustomerResponse;
