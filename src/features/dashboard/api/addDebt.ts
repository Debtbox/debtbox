import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import type { BusinessDto } from '@/types/BusinessDto';
import type { UserDto } from '@/types/UserDto';

export type AddDebtDTO = {
  nationalId: string;
  iqamaId: string;
  businessId: string;
  amount: number;
  dueDate: string;
  title: string;
};

export const addDebt = (data: AddDebtDTO): Promise<AddDebtResponse> => {
  const language = getLanguageFromCookie();
  return axios.post(
    '/debt/add-debt',
    {
      nationalId: data.nationalId,
      iqamaId: data.iqamaId,
      businessId: data.businessId,
      amount: data.amount,
      dueDate: data.dueDate,
      title: data.title,
    },
    {
      headers: {
        'Accept-Language': language,
      },
    },
  );
};

export type AddDebtResponse = {
  message: string;
  success: boolean;
  data: {
    message: string;
    status: string;
    business: BusinessDto;
    customer: UserDto;
    amount: number;
    due_date: string;
    id: number;
    isPending: boolean;
    title: string;
  };
};

type UseAddDebt = {
  config?: MutationConfig<typeof addDebt>;
  onSuccess: (data: AddDebtResponse) => void;
  onError: (error: ApiError) => void;
};

export const useAddDebt = ({ config, onError, onSuccess }: UseAddDebt) => {
  return useMutation({
    ...config,
    mutationFn: addDebt,
    onSuccess: (data) => {
      onSuccess(data);
    },
    onError: (error: ApiError) => {
      onError(error);
    },
  });
};
