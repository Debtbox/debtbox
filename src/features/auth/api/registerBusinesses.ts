import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';

export type RegisterBusinessesCredentialsDTO = {
  businesses: {
    cr_number: string;
    business_name_en: string;
    business_name_ar: string;
    activity_id: string;
    city_id: string;
  }[];
  payoutMethod: 'weekly' | 'monthly' | 'instant';
  accessToken: string;
};

export const registerBusinesses = (data: RegisterBusinessesCredentialsDTO) => {
  const language = getLanguageFromCookie();
  return axios.post(
    '/merchant/register-businesses',
    {
      businesses: data.businesses,
      payoutMethod: data.payoutMethod,
    },
    {
      headers: {
        'Accept-Language': language,
        Authorization: `Bearer ${data.accessToken}`,
      },
    },
  );
};

type UseRegisterIBAN = {
  config?: MutationConfig<typeof registerBusinesses>;
  onSuccess: () => void;
  onError: (error: ApiError) => void;
};

export const useRegisterBusinesses = ({
  config,
  onError,
  onSuccess,
}: UseRegisterIBAN) => {
  return useMutation({
    ...config,
    mutationFn: registerBusinesses,
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: ApiError) => {
      onError(error);
    },
  });
};
