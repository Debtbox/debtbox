import { axios } from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';

export const markNotificationsAsRead = ({
  ids,
  isMarkAll,
}: {
  ids: string[];
  isMarkAll: boolean;
}) => {
  return axios.post(`/notification/mark-notifications-as-read`, {
    ids,
    isMarkAll,
  });
};

type UseMarkNotificationsAsReadOptions = {
  onSuccess: () => Promise<void>;
  onError?: (err: ApiError) => void;
  config?: MutationConfig<typeof markNotificationsAsRead>;
};

export const useMarkNotificationsAsRead = ({
  onSuccess,
  onError,
  config,
}: UseMarkNotificationsAsReadOptions) => {
  return useMutation({
    ...config,
    mutationFn: markNotificationsAsRead,
    onSuccess: async () => {
      await onSuccess();
    },
    onError: (err: ApiError) => {
      onError?.(err);
    },
  });
};
