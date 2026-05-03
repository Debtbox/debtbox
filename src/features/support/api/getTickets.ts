import { axios } from '@/lib/axios';
import type { QueryConfig } from '@/lib/react-query';
import { useQueryWithCallback } from '@/lib/hooks/useQueryWithCallback';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import type { TicketDTO, TicketStatus, TicketPriority, TicketType } from '../types';

export type GetTicketsParams = {
  page?: number;
  limit?: number;
  status?: TicketStatus[];
  priority?: TicketPriority[];
  type?: TicketType[];
  search?: string;
};

export type GetTicketsResponse = {
  success: boolean;
  message: string;
  data: { tickets: TicketDTO[]; total: number };
};

export const getTickets = (params?: GetTicketsParams): Promise<GetTicketsResponse> => {
  const query = new URLSearchParams();
  if (params?.page !== undefined) query.append('page', String(params.page));
  if (params?.limit !== undefined) query.append('limit', String(params.limit));
  if (params?.status?.length) query.append('status', params.status.join(','));
  if (params?.priority?.length) query.append('priority', params.priority.join(','));
  if (params?.type?.length) query.append('type', params.type.join(','));
  if (params?.search) query.append('search', params.search);
  const qs = query.toString();
  return axios.get(`/merchant/tickets${qs ? `?${qs}` : ''}`, {
    headers: { 'Accept-Language': getLanguageFromCookie() },
  });
};

type UseGetTickets = {
  params?: GetTicketsParams;
  config?: QueryConfig<typeof getTickets>;
  onSuccess?: (data: GetTicketsResponse) => void;
};

export const useGetTickets = ({ params, config, onSuccess }: UseGetTickets) =>
  useQueryWithCallback({
    ...config,
    queryKey: ['support-tickets', params],
    queryFn: () => getTickets(params),
    onSuccess,
  });
