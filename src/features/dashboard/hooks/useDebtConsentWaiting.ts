import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { socketManager } from '@/utils/socket';
import { useUserStore } from '@/stores/UserStore';

export type CustomerResponse = 'accepted' | 'rejected' | 'expired';

export type WaitingVariant = 'debt_consent' | 'cash_paid';

interface UseDebtConsentWaitingProps {
  onResponse?: (response: CustomerResponse) => void;
  onSuccess?: () => void;
}

const TOAST_KEYS: Record<
  WaitingVariant,
  Record<CustomerResponse, { type: 'success' | 'error'; key: string }>
> = {
  debt_consent: {
    accepted: { type: 'success', key: 'dashboard.customerAcceptedDebt' },
    rejected: { type: 'error', key: 'dashboard.customerRejectedDebt' },
    expired: { type: 'error', key: 'dashboard.customerExpiredDebt' },
  },
  cash_paid: {
    accepted: { type: 'success', key: 'dashboard.customerAcceptedCashPayment' },
    rejected: { type: 'error', key: 'dashboard.customerRejectedCashPayment' },
    expired: { type: 'error', key: 'dashboard.customerExpiredCashPayment' },
  },
};

export const useDebtConsentWaiting = ({
  onResponse,
  onSuccess,
}: UseDebtConsentWaitingProps = {}) => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const [isWaiting, setIsWaiting] = useState(false);
  const [waitingVariant, setWaitingVariant] =
    useState<WaitingVariant>('debt_consent');

  const handleCustomerResponse = useCallback(
    (response: CustomerResponse, variant: WaitingVariant) => {
      setIsWaiting(false);
      const { type, key } = TOAST_KEYS[variant][response];
      const message = t(key);
      if (type === 'success') {
        toast.success(message);
      } else {
        toast.error(message);
      }
      onResponse?.(response);
    },
    [t, onResponse]
  );

  const startWaiting = useCallback(
    (options?: { variant?: WaitingVariant }) => {
      setWaitingVariant(options?.variant ?? 'debt_consent');
      setIsWaiting(true);
      onSuccess?.();
    },
    [onSuccess]
  );

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
          handleCustomerResponse('accepted', waitingVariant);
        } else if (responseData.action === 'rejected') {
          socketManager.disconnect();
          handleCustomerResponse('rejected', waitingVariant);
        } else if (responseData.action === 'expired') {
          socketManager.disconnect();
          handleCustomerResponse('expired', waitingVariant);
        }
      };

      const handleDisconnect = () => {
        socketManager.offDebtConsentUpdate(handleDebtConsentUpdate);
        socketManager.offDisconnect();
        handleCustomerResponse('expired', waitingVariant);
      };

      socketManager.onDebtConsentUpdate(handleDebtConsentUpdate);
      socketManager.onDisconnect(handleDisconnect);

      return () => {
        socketManager.offDebtConsentUpdate(handleDebtConsentUpdate);
        socketManager.offDisconnect();
        socketManager.disconnect();
      };
    }
  }, [isWaiting, user?.id, handleCustomerResponse, waitingVariant]);

  return {
    isWaiting,
    startWaiting,
    stopWaiting,
    waitingVariant,
    handleCustomerResponse,
  };
};
