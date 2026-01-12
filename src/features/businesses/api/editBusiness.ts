import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';

export type EditBusinessCredentialsDTO = {
  id: string;
  businessNameEn: string;
  businessNameAr: string;
  crNumber: string;
  city: string;
  activity: string;
  payoutMethod: 'weekly' | 'monthly' | 'instant';
  accessToken: string;
};

export const editBusiness = (data: EditBusinessCredentialsDTO) => {
  const language = getLanguageFromCookie();
  return axios.put(
    '/business/edit-business',
    {
      id: data.id,
      business_name_en: data.businessNameEn,
      business_name_ar: data.businessNameAr,
      city: data.city,
      activity: data.activity,
      //   crNumber: data.crNumber, // Not supported by API
      //   payoutMethod: data.payoutMethod, // Not supported by API
    },
    {
      headers: {
        'Accept-Language': language,
        Authorization: `Bearer ${data.accessToken}`,
      },
    },
  );
};

type UseEditBusiness = {
  config?: MutationConfig<typeof editBusiness>;
  onSuccess: () => void;
  onError: (error: ApiError) => void;
};

export const useEditBusiness = ({
  config,
  onError,
  onSuccess,
}: UseEditBusiness) => {
  return useMutation({
    ...config,
    mutationFn: editBusiness,
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: ApiError) => {
      onError(error);
    },
  });
};
