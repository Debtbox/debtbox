import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import type { UserDto } from '@/types/UserDto';

export type LoginCredentialsDTO = {
  nationalId: string;
  password: string;
};

export const login = (data: LoginCredentialsDTO): Promise<UserDto> => {
  const language = getLanguageFromCookie();
  return axios.post('/auth/merchant/merchant-sign-in', data, {
    headers: {
      'Accept-Language': language,
    },
  });
};

type UseLogin = {
  config?: MutationConfig<typeof login>;
  onSuccess: (data: UserDto) => void;
  onError: (error: ApiError) => void;
};

export const useLogin = ({ config, onError, onSuccess }: UseLogin) => {
  return useMutation({
    ...config,
    mutationFn: login,
    onSuccess: (data) => {
      onSuccess(data);
    },
    onError: (error: ApiError) => {
      onError(error);
    },
  });
};
