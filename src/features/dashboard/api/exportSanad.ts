import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';

export type ExportSanadCredentialsDTO = {
  debtId: string;
};

export type ExportSanadResponse = {
  message: string;
  success: boolean;
  data: {
    pdfUrl: string;
  };
};

export const exportSanad = (
  data: ExportSanadCredentialsDTO,
): Promise<ExportSanadResponse> => {
  const language = getLanguageFromCookie();
  return axios.get(`/merchant/get-debt-sanad?debtId=${data.debtId}`, {
    headers: {
      'Accept-Language': language,
    },
  });
};

type UseExportSanad = {
  config?: MutationConfig<typeof exportSanad>;
  onSuccess: (data: ExportSanadResponse) => void;
  onError: (error: ApiError) => void;
};

export const useExportSanad = ({
  config,
  onError,
  onSuccess,
}: UseExportSanad) => {
  return useMutation({
    ...config,
    mutationFn: exportSanad,
    onSuccess: (data: ExportSanadResponse) => {
      onSuccess(data);
    },
    onError: (error: ApiError) => {
      onError(error);
    },
  });
};
