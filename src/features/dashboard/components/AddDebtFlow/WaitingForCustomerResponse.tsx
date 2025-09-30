import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { socketManager } from '@/utils/socket';
import Button from '@/components/shared/Button';

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
  const [isConnected, setIsConnected] = useState(false);
  const [waitingTime, setWaitingTime] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasReceivedResponse = useRef(false);

  useEffect(() => {
    // Connect to socket
    socketManager.connect(merchantId);
    setIsConnected(socketManager.isConnected());

    // Set up 5-minute timeout
    timeoutRef.current = setTimeout(
      () => {
        if (!hasReceivedResponse.current) {
          console.log('Timeout reached, closing connection');
          socketManager.disconnect();
        }
      },
      5 * 60 * 1000,
    ); // 5 minutes

    // Set up connection status monitoring
    const checkConnection = () => {
      setIsConnected(socketManager.isConnected());
    };

    const interval = setInterval(checkConnection, 1000);

    // Listen for debt consent updates
    const handleDebtConsentUpdate = (data: unknown) => {
      console.log('Debt consent update received:', data);

      const responseData = data as {
        debtId?: string | number;
        action?: string;
      };
      if (responseData.debtId?.toString() === debtId) {
        hasReceivedResponse.current = true;

        // Clear timeout since we received a response
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Handle different action types
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

    const timer = setInterval(() => {
      setWaitingTime((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      socketManager.offDebtConsentUpdate(handleDebtConsentUpdate);
      socketManager.disconnect();
    };
  }, [merchantId, debtId, onCustomerResponse]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {t('dashboard.waitingForCustomer')}
          </h2>

          <p className="text-gray-600 mb-4">
            {t('dashboard.customerNotificationSent')}
          </p>

          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div
              className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
            ></div>
            <span>
              {isConnected
                ? t('dashboard.connected')
                : t('dashboard.connecting')}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 w-full max-w-md">
          <div className="text-center">
            <div className="text-3xl font-mono text-gray-700 mb-2">
              {formatTime(waitingTime)}
            </div>
            <p className="text-sm text-gray-600">
              {t('dashboard.waitingTime')}
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            {t('dashboard.customerInstructions')}
          </p>

          <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{t('dashboard.accept')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>{t('dashboard.reject')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <div className="text-sm text-gray-500 font-medium flex-1">
          {t('dashboard.step_2_of_3')}
        </div>
        <div className="flex items-center gap-2 flex-1">
          <Button
            type="button"
            text={t('common.buttons.back')}
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
