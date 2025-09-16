import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';

export type SignUpCredentialsDTO = {
  nationalId: string;
};

type SignUpResponse = {
  accessToken: string;
  businesses: {
    cr_number: string;
    business_name_ar: string;
    business_name_en: string;
  }[];
  commercial_register_number: string;
  dob: string;
  full_name_ar: string;
  full_name_en: string;
  id: number;
  iqama_id: string;
  national_id: string;
  nationality: string;
};

export const signUp = (data: SignUpCredentialsDTO): Promise<SignUpResponse> => {
  const language = getLanguageFromCookie();
  return axios.post('/auth/merchant/merchant-signup', data, {
    headers: {
      'Accept-Language': language,
    },
  });
};

type UseSignUp = {
  config?: MutationConfig<typeof signUp>;
  onSuccess: (data: SignUpResponse) => void;
  onError: (error: ApiError) => void;
};

export const useSignUp = ({ config, onError, onSuccess }: UseSignUp) => {
  return useMutation({
    ...config,
    mutationFn: signUp,
    onSuccess: (data) => {
      onSuccess(data);
    },
    onError: (error: ApiError) => {
      onError(error);
    },
  });
};
