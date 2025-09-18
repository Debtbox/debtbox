import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import type { UserDto } from '@/types/UserDto';

export type CreatePasswordCredentialsDTO = {
  id: string;
  appActor: 'CUSTOMER' | 'MERCHANT';
  password: string;
  accessToken: string;
};

export const createPassword = (
  data: CreatePasswordCredentialsDTO,
): Promise<UserDto> => {
  const language = getLanguageFromCookie();
  return axios.post(
    '/auth/create-password',
    {
      id: data.id,
      appActor: data.appActor,
      password: data.password,
    },
    {
      headers: {
        'Accept-Language': language,
        Authorization: `Bearer ${data.accessToken}`,
      },
    },
  );
};

type UseCreatePassword = {
  config?: MutationConfig<typeof createPassword>;
  onSuccess: (data: UserDto) => void;
  onError: (error: ApiError) => void;
};

export const useCreatePassword = ({
  config,
  onError,
  onSuccess,
}: UseCreatePassword) => {
  return useMutation({
    ...config,
    mutationFn: createPassword,
    onSuccess: (data) => {
      onSuccess(data);
    },
    onError: (error: ApiError) => {
      onError(error);
    },
  });
};
