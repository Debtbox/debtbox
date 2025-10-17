import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { socketManager } from '@/utils/socket';
import { useUserStore } from '@/stores/UserStore';

export type CustomerResponse = 'accepted' | 'rejected' | 'expired';

interface UseDebtConsentWaitingProps {
  onResponse?: (response: CustomerResponse) => void;
  onSuccess?: () => void;
}

export const useDebtConsentWaiting = ({
  onResponse,
  onSuccess,
}: UseDebtConsentWaitingProps = {}) => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const [isWaiting, setIsWaiting] = useState(false);

  const handleCustomerResponse = useCallback(
    (response: CustomerResponse) => {
      setIsWaiting(false);
      
      // Show appropriate toast message
      if (response === 'accepted') {
        toast.success(t('dashboard.customerAcceptedDebt'));
      } else if (response === 'expired') {
        toast.error(t('dashboard.customerExpiredDebt'));
      } else {
        toast.error(t('dashboard.customerRejectedDebt'));
      }

      // Call custom response handler
      onResponse?.(response);
    },
    [t, onResponse]
  );

  const startWaiting = useCallback(() => {
    setIsWaiting(true);
    onSuccess?.();
  }, [onSuccess]);

  const stopWaiting = useCallback(() => {
    setIsWaiting(false);
    socketManager.disconnect();
  }, []);

  // Socket connection for waiting for customer response
  useEffect(() => {
    if (isWaiting && user?.id) {
      const merchantId = user.id.toString();

      socketManager.connect(merchantId);

      const handleDebtConsentUpdate = (data: unknown) => {
        const responseData = data as {
          debtId?: string | number;
          action?: string;
        };

        if (responseData.action === 'accepted') {
          socketManager.disconnect();
          handleCustomerResponse('accepted');
        } else if (responseData.action === 'rejected') {
          socketManager.disconnect();
          handleCustomerResponse('rejected');
        } else if (responseData.action === 'expired') {
          socketManager.disconnect();
          handleCustomerResponse('expired');
        }
      };

      const handleDisconnect = () => {
        socketManager.offDebtConsentUpdate(handleDebtConsentUpdate);
        socketManager.offDisconnect();
        handleCustomerResponse('expired');
      };

      socketManager.onDebtConsentUpdate(handleDebtConsentUpdate);
      socketManager.onDisconnect(handleDisconnect);

      return () => {
        socketManager.offDebtConsentUpdate(handleDebtConsentUpdate);
        socketManager.offDisconnect();
        socketManager.disconnect();
      };
    }
  }, [isWaiting, user?.id, handleCustomerResponse]);

  return {
    isWaiting,
    startWaiting,
    stopWaiting,
    handleCustomerResponse,
  };
};
