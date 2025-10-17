import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';

export type CancelDebtCredentialsDTO = {
  debtId: string;
};

export const cancelDebt = (data: CancelDebtCredentialsDTO) => {
  const language = getLanguageFromCookie();
  return axios.post(
    '/debt/cancel-debt',
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

type UseCancelDebt = {
  config?: MutationConfig<typeof cancelDebt>;
  onSuccess: () => void;
  onError: (error: ApiError) => void;
};

export const useCancelDebt = ({
  config,
  onError,
  onSuccess,
}: UseCancelDebt) => {
  return useMutation({
    ...config,
    mutationFn: cancelDebt,
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: ApiError) => {
      onError(error);
    },
  });
};
