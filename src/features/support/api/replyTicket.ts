import { axios } from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationConfig } from '@/lib/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import type { TicketMessageDTO } from '../types';

export type ReplyTicketRequest = { id: string; body: string };

export type ReplyTicketResponse = {
  success: boolean;
  message: string;
  data: TicketMessageDTO;
};

export const replyTicket = ({ id, body }: ReplyTicketRequest): Promise<ReplyTicketResponse> =>
  axios.post(
    `/merchant/tickets/${id}/messages`,
    { body },
    { headers: { 'Accept-Language': getLanguageFromCookie() } },
  );

export const useReplyTicket = ({
  config,
}: { config?: MutationConfig<typeof replyTicket> } = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: replyTicket,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: ['support-ticket', args[1].id] });
      config?.onSuccess?.(...args);
    },
  });
};
