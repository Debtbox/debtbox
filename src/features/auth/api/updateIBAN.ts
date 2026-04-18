import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';

export type UpdateIBAN = {
  iban: string;
  password: string;
};

export type UpdateIBANResponse = {
  message: string;
  success: boolean;
};

export const updateIBAN = (data: UpdateIBAN): Promise<UpdateIBANResponse> => {
  const language = getLanguageFromCookie();
  return axios.post('/merchant/merchant-update-iban', data, {
    headers: {
      'Accept-Language': language,
    },
  });
};

type UseUpdateIBAN = {
  config?: MutationConfig<typeof updateIBAN>;
  onSuccess: (data: UpdateIBANResponse) => void;
  onError: (error: ApiError) => void;
};

export const useUpdateIBAN = ({
  config,
  onError,
  onSuccess,
}: UseUpdateIBAN) => {
  return useMutation({
    ...config,
    mutationFn: updateIBAN,
    onSuccess: (data) => {
      onSuccess(data);
    },
    onError: (error: ApiError) => {
      onError(error);
    },
  });
};
