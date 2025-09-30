import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { socketManager } from '@/utils/socket';
import Button from '@/components/shared/Button';
import WaitingIcon from '@/components/icons/WaitingIcon';

interface WaitingForCustomerResponseProps {
  merchantId: string;
  debtId?: string;
  onCustomerResponse: (
    response: 'accepted' | 'rejected',
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

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasReceivedResponse = useRef(false);

  useEffect(() => {
    socketManager.connect(merchantId);

    timeoutRef.current = setTimeout(
      () => {
        if (!hasReceivedResponse.current) {
          console.log('Timeout reached, closing connection');
          socketManager.disconnect();
        }
      },
      5 * 60 * 1000,
    );

    const handleDebtConsentUpdate = (data: unknown) => {
      const responseData = data as {
        debtId?: string | number;
        action?: string;
      };
      if (responseData.debtId?.toString() === debtId) {
        hasReceivedResponse.current = true;

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        if (responseData.action === 'accepted') {
          socketManager.disconnect();
          onCustomerResponse('accepted', data);
        } else if (responseData.action === 'rejected') {
          socketManager.disconnect();
          onCustomerResponse('rejected', data);
        }
      }
    };

    socketManager.onDebtConsentUpdate(handleDebtConsentUpdate);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      socketManager.offDebtConsentUpdate(handleDebtConsentUpdate);
      socketManager.disconnect();
    };
  }, [merchantId, debtId, onCustomerResponse]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <WaitingIcon />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {t('dashboard.waitingForCustomerResponse')}
        </h2>
        <p className="text-gray-600">
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
