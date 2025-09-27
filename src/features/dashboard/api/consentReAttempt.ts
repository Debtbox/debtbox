import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';

export type ConsentReAttemptCredentialsDTO = {
  debtId: string;
};

export const consentReAttempt = (data: ConsentReAttemptCredentialsDTO) => {
  const language = getLanguageFromCookie();
  return axios.post(
    '/debt/consent-reattempt',
    {
      debtId: data.debtId,
    },
    {
      headers: {
        'Accept-Language': language,
      },
    },
  );
};

type UseConsentReAttempt = {
  config?: MutationConfig<typeof consentReAttempt>;
  onSuccess: () => void;
  onError: (error: ApiError) => void;
};

export const useConsentReAttempt = ({
  config,
  onError,
  onSuccess,
}: UseConsentReAttempt) => {
  return useMutation({
    ...config,
    mutationFn: consentReAttempt,
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: ApiError) => {
      onError(error);
    },
  });
};
