import { axios } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import type { QueryConfig, ExtractFnReturnType } from '@/lib/react-query';
import type { NotificationsCountDto } from '@/types/NotificationDto';

export type UnreadNotificationsResponse = {
  data: NotificationsCountDto;
  message: string;
  success: boolean;
};

export const getUnreadNotificationsCount =
  (): Promise<UnreadNotificationsResponse> => {
    return axios.get('/notification/get-unread-notifications-count');
  };
type QueryFnType = typeof getUnreadNotificationsCount;
type UseGetUnreadNotificationsOptions = {
  config?: QueryConfig<QueryFnType>;
  refetchInterval?: number;
};

export const useGetUnreadNotificationsCountData = ({
  config,
  refetchInterval,
}: UseGetUnreadNotificationsOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['unread-notifications-count'],
    queryFn: () => getUnreadNotificationsCount(),
    refetchInterval: refetchInterval,
  });
};
