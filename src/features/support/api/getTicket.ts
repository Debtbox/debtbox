import { axios } from '@/lib/axios';
import type { QueryConfig } from '@/lib/react-query';
import { useQueryWithCallback } from '@/lib/hooks/useQueryWithCallback';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import type { TicketDTO, TicketMessageDTO } from '../types';

export type GetTicketResponse = {
  success: boolean;
  message: string;
  data: {
    ticket: TicketDTO;
    messages: TicketMessageDTO[];
    attachments: unknown[];
  };
};

export const getTicket = (id: string): Promise<GetTicketResponse> =>
  axios.get(`/merchant/tickets/${id}`, {
    headers: { 'Accept-Language': getLanguageFromCookie() },
  });

type UseGetTicket = {
  id: string;
  config?: QueryConfig<typeof getTicket>;
  onSuccess?: (data: GetTicketResponse) => void;
};

export const useGetTicket = ({ id, config, onSuccess }: UseGetTicket) =>
  useQueryWithCallback({
    ...config,
    queryKey: ['support-ticket', id],
    queryFn: () => getTicket(id),
    enabled: !!id,
    onSuccess,
  });
