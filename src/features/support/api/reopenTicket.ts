import { axios } from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationConfig } from '@/lib/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';

export type ReopenTicketRequest = { id: string; details: string };

export type ReopenTicketResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    code: string;
    status: string;
    closedAt: null;
    resolvedAt: null;
    lastMessageAt: string;
    updated_at: string;
  };
};

export const reopenTicket = ({
  id,
  details,
}: ReopenTicketRequest): Promise<ReopenTicketResponse> =>
  axios.post(
    `/merchant/tickets/${id}/reopen`,
    { details },
    { headers: { 'Accept-Language': getLanguageFromCookie() } },
  );

export const useReopenTicket = ({
  config,
}: { config?: MutationConfig<typeof reopenTicket> } = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: reopenTicket,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      void queryClient.invalidateQueries({ queryKey: ['support-ticket', args[1].id] });
      config?.onSuccess?.(...args);
    },
  });
};
