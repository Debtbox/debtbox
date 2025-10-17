import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';

export type ExtendDebtDueDateCredentialsDTO = {
  debtId: string;
  newDueDate: string;
  reason: string;
};

export const extendDebtDueDate = (data: ExtendDebtDueDateCredentialsDTO) => {
  const language = getLanguageFromCookie();
  return axios.post(
    '/debt/extend-due-date',
    {
      debtId: data.debtId,
      newDueDate: data.newDueDate,
      reason: data.reason,
    },
    {
      headers: {
        'Accept-Language': language,
      },
    },
  );
};

type UseExtendDebtDueDate = {
  config?: MutationConfig<typeof extendDebtDueDate>;
  onSuccess: () => void;
  onError: (error: ApiError) => void;
};

export const useExtendDebtDueDate = ({
  config,
  onError,
  onSuccess,
}: UseExtendDebtDueDate) => {
  return useMutation({
    ...config,
    mutationFn: extendDebtDueDate,
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: ApiError) => {
      onError(error);
    },
  });
};
