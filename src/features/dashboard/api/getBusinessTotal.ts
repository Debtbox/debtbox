import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';

export type GetBusinessTotalDTO = {
  businessId: string;
};

export const getBusinessTotal = (
  data: GetBusinessTotalDTO,
): Promise<GetBusinessTotalResponse> => {
  const language = getLanguageFromCookie();
  return axios.post(
    '/merchant/get-business-dashboard',
    {
      businessId: data.businessId,
    },
    {
      headers: {
        'Accept-Language': language,
      },
    },
  );
};

export type GetBusinessTotalResponse = {
  message: string;
  success: boolean;
  data: {
    total: number;
  };
};

type UseGetBusinessTotal = {
  config?: MutationConfig<typeof getBusinessTotal>;
  onSuccess: (data: GetBusinessTotalResponse) => void;
  onError: (error: ApiError) => void;
};

export const useGetBusinessTotal = ({
  config,
  onError,
  onSuccess,
}: UseGetBusinessTotal) => {
  return useMutation({
    ...config,
    mutationFn: getBusinessTotal,
    onSuccess: (data) => {
      onSuccess(data);
    },
    onError: (error: ApiError) => {
      onError(error);
    },
  });
};
