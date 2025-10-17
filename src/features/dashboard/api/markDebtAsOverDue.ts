import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';

export type MarkDebtAsOverDueCredentialsDTO = {
  debtId: string;
};

export const markDebtAsOverDue = (data: MarkDebtAsOverDueCredentialsDTO) => {
  const language = getLanguageFromCookie();
  return axios.get(`/merchant/mark-customer-as-overdue/${data.debtId}`, {
    headers: {
      'Accept-Language': language,
    },
  });
};

type UseMarkDebtAsOverDue = {
  config?: MutationConfig<typeof markDebtAsOverDue>;
  onSuccess: () => void;
  onError: (error: ApiError) => void;
};

export const useMarkDebtAsOverDue = ({
  config,
  onError,
  onSuccess,
}: UseMarkDebtAsOverDue) => {
  return useMutation({
    ...config,
    mutationFn: markDebtAsOverDue,
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: ApiError) => {
      onError(error);
    },
  });
};
