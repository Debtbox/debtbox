import { axios } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import type { QueryConfig, ExtractFnReturnType } from '@/lib/react-query';
import type { NotificationDto } from '@/types/NotificationDto';

export type NotificationsResponse = {
  data: NotificationDto[];
  message: string;
  success: boolean;
};

export const getNotifications = (): Promise<NotificationsResponse> => {
  return axios.get('/notification/get-notifications');
};
type QueryFnType = typeof getNotifications;
type UseGetNotificationsOptions = {
  config?: QueryConfig<QueryFnType>;
  refetchInterval?: number;
  enabled?: boolean;
};

export const useGetNotificationsData = ({
  config,
  refetchInterval,
  enabled,
}: UseGetNotificationsOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['notifications'],
    queryFn: () => getNotifications(),
    refetchInterval: refetchInterval,
    enabled,
  });
};
