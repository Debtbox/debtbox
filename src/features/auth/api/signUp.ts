import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';

export type SignUpCredentialsDTO = {
  nationalId: string;
  isForgetPassword?: boolean;
};

export type SignUpResponse = {
  data: { state: string; redirectUrl: string; locale: 'en' | 'ar' | '' };
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
