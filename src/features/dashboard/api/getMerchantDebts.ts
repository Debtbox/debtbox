import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';

export type GetMerchantDebtsDTO = {
  businessId: string;
  pageIndex?: number;
  pageSize?: number;
  customerName?: string;
  debtDateStatus?: string;
};

export const getMerchantDebts = (
  data: GetMerchantDebtsDTO,
): Promise<GetMerchantDebtsResponse> => {
  const language = getLanguageFromCookie();
  return axios.post(
    '/merchant/get-merchant-debts',
    {
      businessId: data.businessId,
      ...(data.pageIndex && { pageIndex: data.pageIndex }),
      ...(data.pageSize && { pageSize: data.pageSize }),
      ...(data.customerName && { customerName: data.customerName }),
      ...(data.debtDateStatus && { debtDateStatus: data.debtDateStatus }),
    },
    {
      headers: {
        'Accept-Language': language,
      },
    },
  );
};

export type GetMerchantDebtsResponse = {
  message: string;
  success: boolean;
  data: {
    debtId: number;
    customerId: number;
    full_name_ar: string;
    full_name_en: string;
    amount: number;
    dueDate: string;
    status: string;
    dueDateStatus: string;
  };
};

type UseGetMerchantDebts = {
  config?: MutationConfig<typeof getMerchantDebts>;
  onSuccess: (data: GetMerchantDebtsResponse) => void;
  onError: (error: ApiError) => void;
};

export const useGetMerchantDebts = ({
  config,
  onError,
  onSuccess,
}: UseGetMerchantDebts) => {
  return useMutation({
    ...config,
    mutationFn: getMerchantDebts,
    onSuccess: (data) => {
      onSuccess(data);
    },
    onError: (error: ApiError) => {
      onError(error);
    },
  });
};
