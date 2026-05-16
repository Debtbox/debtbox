import { axios } from '@/lib/axios';
import type { QueryConfig } from '@/lib/react-query';
import { useQueryWithCallback } from '@/lib/hooks/useQueryWithCallback';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';

export type ReceivableStatus = 'OPEN' | 'PARTIALLY_SETTLED' | 'SETTLED';

export type Receivable = {
  id: string;
  amountTotalHalala: number;
  amountOutstandingHalala: number;
  status: ReceivableStatus;
  createdAt: string;
  settledAt: string | null;
  business: {
    id: number;
    nameAr: string;
    nameEn: string;
  };
  debt: {
    id: number;
    title: string;
    amount: string;
    status: string;
    dueDate: string;
    customer: {
      id: number;
      nameAr: string;
      nameEn: string;
    };
  };
};

export type GetReceivablesParams = {
  page?: number;
  limit?: number;
  status?: string;
};

export type GetReceivablesResponse = {
  success: boolean;
  message: string;
  data: {
    data: Receivable[];
    total: number;
    page: number;
    limit: number;
  };
};

export const getReceivables = (
  params?: GetReceivablesParams,
): Promise<GetReceivablesResponse> => {
  const language = getLanguageFromCookie();
  return axios.get('/merchant/receivables', {
    params,
    headers: { 'Accept-Language': language },
  });
};

type UseGetReceivables = {
  params?: GetReceivablesParams;
  config?: QueryConfig<typeof getReceivables>;
  onSuccess?: (data: GetReceivablesResponse) => void;
};

export const useGetReceivables = ({ params, config, onSuccess }: UseGetReceivables) =>
  useQueryWithCallback({
    ...config,
    queryKey: ['merchant-receivables', params],
    queryFn: () => getReceivables(params),
    onSuccess,
  });
