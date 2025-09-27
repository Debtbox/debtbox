import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';

export type AddDebtCredentialsDTO = {
  nationalId: string;
  iqamaId: string;
  businessId: string;
  amount: number;
  dueDate: string;
};

export const addDebt = (data: AddDebtCredentialsDTO) => {
  const language = getLanguageFromCookie();
  return axios.post(
    '/debt/add-debt',
    {
      nationalId: data.nationalId,
      iqamaId: data.iqamaId,
      businessId: data.businessId,
      amount: data.amount,
      dueDate: data.dueDate,
    },
    {
      headers: {
        'Accept-Language': language,
      },
    },
  );
};

type UseAddDebt = {
  config?: MutationConfig<typeof addDebt>;
  onSuccess: () => void;
  onError: (error: ApiError) => void;
};

export const useAddDebt = ({ config, onError, onSuccess }: UseAddDebt) => {
  return useMutation({
    ...config,
    mutationFn: addDebt,
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: ApiError) => {
      onError(error);
    },
  });
};
