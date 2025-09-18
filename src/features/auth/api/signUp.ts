import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import type { UserDto } from '@/types/UserDto';

export type SignUpCredentialsDTO = {
  nationalId: string;
};

export const signUp = (data: SignUpCredentialsDTO): Promise<UserDto> => {
  const language = getLanguageFromCookie();
  return axios.post('/auth/merchant/merchant-signup', data, {
    headers: {
      'Accept-Language': language,
    },
  });
};

type UseSignUp = {
  config?: MutationConfig<typeof signUp>;
  onSuccess: (data: UserDto) => void;
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
