import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';

export type RegisterIBANCredentialsDTO = {
  iban: string;
  accessToken: string;
};

export const registerIBAN = (data: RegisterIBANCredentialsDTO) => {
  const language = getLanguageFromCookie();
  return axios.post(
    '/merchant/register-iban',
    {
      iban: data.iban,
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
  config?: MutationConfig<typeof registerIBAN>;
  onSuccess: () => void;
  onError: (error: ApiError) => void;
};

export const useRegisterIBAN = ({
  config,
  onError,
  onSuccess,
}: UseRegisterIBAN) => {
  return useMutation({
    ...config,
    mutationFn: registerIBAN,
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: ApiError) => {
      onError(error);
    },
  });
};
