import { axios } from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationConfig } from '@/lib/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import type { TicketDTO, TicketType, TicketPriority, TicketRelatedEntityType } from '../types';

export type CreateTicketRequest = {
  subject: string;
  description: string;
  type?: TicketType;
  priority?: TicketPriority;
  relatedEntityType?: TicketRelatedEntityType;
  relatedEntityId?: string;
};

export type CreateTicketResponse = {
  success: boolean;
  message: string;
  data: TicketDTO;
};

export const createTicket = (data: CreateTicketRequest): Promise<CreateTicketResponse> =>
  axios.post('/merchant/tickets', data, {
    headers: { 'Accept-Language': getLanguageFromCookie() },
  });

export const useCreateTicket = ({
  config,
}: { config?: MutationConfig<typeof createTicket> } = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: createTicket,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      config?.onSuccess?.(...args);
    },
  });
};
