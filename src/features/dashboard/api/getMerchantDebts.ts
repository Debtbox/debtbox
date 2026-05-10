import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import type { Debt } from '../types/debt';

export type GetMerchantDebtsDTO = {
  businessId: string;
  pageIndex?: number;
  pageSize?: number;
  customerName?: string;
  debtDueStatus?: ('normal' | 'overdue' | 'in 7 days' | 'soon')[];
  isFullHistory?: boolean;
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
      ...(data.debtDueStatus && { debtDueStatus: data.debtDueStatus }),
      ...(data.isFullHistory && { isFullHistory: data.isFullHistory }),
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
    data: Debt[];
    count: number;
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
