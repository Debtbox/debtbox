import { axios } from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationConfig } from '@/lib/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';

export type CloseTicketRequest = { id: string };

export type CloseTicketResponse = {
  success: boolean;
  message: string;
  data: { id: string; code: string; status: string; closedAt: string; updated_at: string };
};

export const closeTicket = ({ id }: CloseTicketRequest): Promise<CloseTicketResponse> =>
  axios.post(
    `/merchant/tickets/${id}/close`,
    {},
    { headers: { 'Accept-Language': getLanguageFromCookie() } },
  );

export const useCloseTicket = ({
  config,
}: { config?: MutationConfig<typeof closeTicket> } = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: closeTicket,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      void queryClient.invalidateQueries({ queryKey: ['support-ticket', args[1].id] });
      config?.onSuccess?.(...args);
    },
  });
};
