import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';

export type CheckCustomerOverdueDTO = {
  customerId: string;
};

export const checkCustomerOverdue = (
  data: CheckCustomerOverdueDTO,
): Promise<CheckCustomerOverdueResponse> => {
  const language = getLanguageFromCookie();
  return axios.get(`/customer/check-customer-overdue/${data.customerId}`, {
    headers: {
      'Accept-Language': language,
    },
  });
};

export type CheckCustomerOverdueResponse = {
  message: string;
  success: boolean;
  data: {
    isOverdue: boolean;
  };
};

type UseCheckCustomerOverdue = {
  config?: MutationConfig<typeof checkCustomerOverdue>;
  onSuccess: (data: CheckCustomerOverdueResponse) => void;
  onError: (error: ApiError) => void;
};

export const useCheckCustomerOverdue = ({
  config,
  onError,
  onSuccess,
}: UseCheckCustomerOverdue) => {
  return useMutation({
    ...config,
    mutationFn: checkCustomerOverdue,
    onSuccess: (data) => {
      onSuccess(data);
    },
    onError: (error: ApiError) => {
      onError(error);
    },
  });
};
