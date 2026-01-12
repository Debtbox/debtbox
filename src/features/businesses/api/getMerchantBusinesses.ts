import { axios } from '@/lib/axios';
import type { QueryConfig } from '@/lib/react-query';
import { useQuery } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import type { BusinessDto } from '@/types/BusinessDto';

export const getMerchantBusinesses =
  (): Promise<GetMerchantBusinessesResponse> => {
    const language = getLanguageFromCookie();
    return axios.get('/business/get-merchant-businesses', {
      headers: {
        'Accept-Language': language,
      },
    });
  };

export type GetMerchantBusinessesResponse = {
  message: string;
  success: boolean;
  data: BusinessDto[];
};

type UseGetMerchantBusinesses = {
  config?: QueryConfig<typeof getMerchantBusinesses>;
};

export const useGetMerchantBusinesses = ({
  config,
}: UseGetMerchantBusinesses) => {
  return useQuery({
    ...config,
    queryKey: ['merchant-businesses'],
    queryFn: getMerchantBusinesses,
  });
};
