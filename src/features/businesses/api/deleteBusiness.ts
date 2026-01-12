import { axios } from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';

export const deleteBusiness = ({ businessId }: { businessId: string }) => {
  return axios.delete(`/business/delete-business?businessId=${businessId}`);
};

type UseDeleteBusinessOptions = {
  onSuccess: () => Promise<void>;
  onError?: (err: ApiError) => void;
  config?: MutationConfig<typeof deleteBusiness>;
};

export const useDeleteBusiness = ({
  onSuccess,
  onError,
  config,
}: UseDeleteBusinessOptions) => {
  return useMutation({
    ...config,
    mutationFn: deleteBusiness,
    onSuccess: async () => {
      await onSuccess();
    },
    onError: (err: ApiError) => {
      onError?.(err);
    },
  });
};
