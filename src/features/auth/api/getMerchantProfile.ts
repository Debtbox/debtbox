import { axios } from '@/lib/axios';
import type { QueryConfig } from '@/lib/react-query';
import { useQueryWithCallback } from '@/lib/hooks/useQueryWithCallback';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';

export const getMerchantProfile = (): Promise<GetMerchantProfileResponse> => {
  const language = getLanguageFromCookie();
  return axios.get('/merchant/me', {
    headers: {
      'Accept-Language': language,
    },
  });
};

export type GetMerchantProfileResponse = {
  message: string;
  success: boolean;
  data: {
    email: string;
    full_name_en: string;
    full_name_ar: string;
    phone_number: string;
    iban: string;
  };
};

type UseGetMerchantProfile = {
  config?: QueryConfig<typeof getMerchantProfile>;
  onSuccess?: (data: GetMerchantProfileResponse) => void;
};

export const useGetMerchantProfile = ({
  config,
  onSuccess,
}: UseGetMerchantProfile) => {
  return useQueryWithCallback({
    ...config,
    queryKey: ['merchant-profile'],
    queryFn: getMerchantProfile,
    onSuccess,
  });
};
