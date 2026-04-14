import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';

export type SignUpCredentialsDTO = {
  nationalId: string;
  isForgetPassword?: boolean;
};

export type NafathSignUpData = {
  state: string;
  redirectUrl: string;
  locale: 'en' | 'ar' | 'ur' | 'bn';
  fallbackRequired?: false;
};

export type MerchantFallbackRequiredData = {
  nafathEnabled: boolean;
  fallbackRequired: true;
  code: string;
  reason: string;
  actorType: 'MERCHANT' | 'CUSTOMER';
  fallbackStartPath: string;
  fallbackVerifyPath: string;
  fallbackResendPath: string;
  isForgetPassword?: boolean;
  fallbackFlow?: string;
};

export type SignUpResponse = {
  data: NafathSignUpData | MerchantFallbackRequiredData;
  message: string;
  success: boolean;
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
      onSuccess(data as SignUpResponse);
    },
    onError: (error: ApiError) => {
      onError(error);
    },
  });
};
