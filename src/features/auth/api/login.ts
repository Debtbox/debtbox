import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import type { UserDto } from '@/types/UserDto';

export type Device = {
  platform: 'android' | 'ios' | 'web' | 'pos';
  token: string;
  p256dh?: string;
  auth?: string;
  appVersion?: string;
  deviceModel?: string;
  osVersion?: string;
  locale?: string;
};

export type LoginCredentialsDTO = {
  nationalId: string;
  commercialRegister: string;
  iqamaId: string;
  device: Device;
  password: string;
  isForgetPassword: boolean;
};

export type LoginResponse = {
  message: string;
  success: boolean;
  data: UserDto;
};

export const login = (data: LoginCredentialsDTO): Promise<LoginResponse> => {
  const language = getLanguageFromCookie();
  return axios.post('/auth/merchant/merchant-sign-in', data, {
    headers: {
      'Accept-Language': language,
    },
  });
};

type UseLogin = {
  config?: MutationConfig<typeof login>;
  onSuccess: (data: LoginResponse) => void;
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
