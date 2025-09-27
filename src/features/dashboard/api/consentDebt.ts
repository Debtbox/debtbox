import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';

export type ConsentDebtCredentialsDTO = {
  debtId: string;
  notificationId: string;
  action: 'pending' | 'accepted' | 'rejected' | 'expired';
};

export const consentDebt = (data: ConsentDebtCredentialsDTO) => {
  const language = getLanguageFromCookie();
  return axios.post(
    '/debt/consent-debt',
    {
      debtId: data.debtId,
      notificationId: data.notificationId,
      action: data.action,
    },
    {
      headers: {
        'Accept-Language': language,
      },
    },
  );
};

type UseConsentDebt = {
  config?: MutationConfig<typeof consentDebt>;
  onSuccess: () => void;
  onError: (error: ApiError) => void;
};

export const useConsentDebt = ({
  config,
  onError,
  onSuccess,
}: UseConsentDebt) => {
  return useMutation({
    ...config,
    mutationFn: consentDebt,
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: ApiError) => {
      onError(error);
    },
  });
};
