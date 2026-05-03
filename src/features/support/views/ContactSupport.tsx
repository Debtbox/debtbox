import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronRight, Plus, MessageCircle, ChevronLeft } from 'lucide-react';
import { cn } from '@/utils/cn';
import { toast } from '@/lib/toast';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import CustomPagination from '@/components/shared/CustomPagination';
import { useGetTickets } from '../api/getTickets';
import { useCreateTicket } from '../api/createTicket';
import { getStatusColor } from '../utils';
import type { TicketDTO, TicketType, TicketPriority } from '../types';
import { formatDate } from '@/utils/formatDate';

const PAGE_SIZE = 10;

const createSchema = z.object({
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum([
    'GENERAL',
    'DEBT',
    'PAYMENT',
    'TECHNICAL',
    'ACCOUNTING',
    'OTHER',
  ]),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
});
type CreateFormValues = z.infer<typeof createSchema>;

const selectClass =
  'w-full h-12 px-3 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-2 focus:border-primary bg-white';

const TicketCard = ({
  ticket,
  onClick,
}: {
  ticket: TicketDTO;
  onClick: () => void;
}) => {
  const { t, i18n } = useTranslation();
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full text-start bg-white rounded-xl border p-4 hover:shadow-md transition-all duration-200',
        ticket.hasAdminAction
          ? 'border-blue-300 bg-blue-50/30'
          : 'border-gray-200',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-gray-400">
              {ticket.code}
            </span>
            {ticket.hasAdminAction && (
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
            )}
          </div>
          <p className="text-sm font-semibold text-gray-900 truncate">
            {ticket.subject}
          </p>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {ticket.description}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span
            className={cn(
              'text-xs font-medium px-2 py-0.5 rounded-full',
              getStatusColor(ticket.status),
            )}
          >
            {t(
              `support.status.${ticket.status}`,
              ticket.status.replace(/_/g, ' '),
            )}
          </span>
          <span className="text-xs text-gray-400">
            {formatDate(i18n.language, ticket.created_at, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          {t(`support.type.${ticket.type}`, ticket.type)}
        </span>
        <ChevronRight className="w-4 h-4 text-gray-300 rtl:rotate-180" />
      </div>
    </button>
  );
};

const CreateModal = ({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const { t } = useTranslation();
  const { mutate, isPending } = useCreateTicket({
    config: {
      onSuccess: () => {
        toast.success(
          t('support.create.success', 'Ticket created successfully'),
        );
        onSuccess();
      },
      onError: (err: unknown) => {
        const msg = (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message;
        toast.error(
          msg ?? t('support.create.error', 'Failed to create ticket'),
        );
      },
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateFormValues>({
    resolver: zodResolver(createSchema),
    mode: 'onChange',
    defaultValues: { type: 'GENERAL', priority: 'MEDIUM' },
  });

  const onSubmit = (values: CreateFormValues) => mutate(values);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">
            {t('support.create.title', 'New Support Ticket')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="flex flex-col gap-1">
            <Input
              id="subject"
              type="text"
              label={t('support.create.subject', 'Subject')}
              placeholder={t(
                'support.create.subjectPlaceholder',
                'Briefly describe your issue',
              )}
              error={errors.subject?.message}
              {...register('subject')}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700 mb-1">
              {t('support.create.description', 'Description')}
            </label>
            <textarea
              rows={4}
              placeholder={t(
                'support.create.descriptionPlaceholder',
                'Describe the issue in detail...',
              )}
              className={cn(
                'w-full px-3 py-2 border rounded-lg text-sm text-gray-800 focus:outline-none focus:border-2 focus:border-primary resize-none',
                errors.description ? 'border-red-500' : 'border-gray-300',
              )}
              {...register('description')}
            />
            {errors.description && (
              <span className="text-sm text-red-500">
                {errors.description.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700 mb-1">
                {t('support.create.type', 'Type')}
              </label>
              <select className={selectClass} {...register('type')}>
                {(
                  [
                    'GENERAL',
                    'DEBT',
                    'PAYMENT',
                    'TECHNICAL',
                    'ACCOUNTING',
                    'OTHER',
                  ] as TicketType[]
                ).map((v) => (
                  <option key={v} value={v}>
                    {t(`support.type.${v}`, v)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700 mb-1">
                {t('support.create.priority', 'Priority')}
              </label>
              <select className={selectClass} {...register('priority')}>
                {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as TicketPriority[]).map(
                  (v) => (
                    <option key={v} value={v}>
                      {t(`support.priority.${v}`, v)}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              text={t('common.cancel', 'Cancel')}
              variant="gray"
              onClick={onClose}
              className="px-5 py-2.5 text-sm"
            />
            <Button
              type="submit"
              text={t('support.create.submit', 'Submit Ticket')}
              variant="primary"
              isLoading={isPending}
              disabled={!isValid}
              className="px-5 py-2.5 text-sm"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export const ContactSupport = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage] = useState(0);

  const { data, isLoading, refetch } = useGetTickets({
    params: { page, limit: PAGE_SIZE },
  });
  const tickets = data?.data.tickets ?? [];
  const total = data?.data.total ?? 0;

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 text-sm">
        <button
          type="button"
          onClick={() => navigate('/support')}
          className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{t('support.title', 'Help and support')}</span>
        </button>
        <span className="text-gray-300">/</span>
        <span className="font-bold text-gray-900">
          {t('support.contactSupport', 'Contact Support')}
        </span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {t('support.myTickets', 'My Tickets')}
        </p>
        <Button
          text={t('support.newTicket', 'New Ticket')}
          variant="primary"
          icon={<Plus className="w-4 h-4 me-1" />}
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 text-sm flex items-center gap-1"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse"
            >
              <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
              <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-full bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 flex flex-col items-center justify-center gap-3">
          <MessageCircle className="w-12 h-12 text-gray-200" />
          <p className="text-sm text-gray-400 text-center">
            {t(
              'support.noTickets',
              "You haven't opened any support tickets yet.",
            )}
          </p>
          <Button
            text={t('support.openFirst', 'Open your first ticket')}
            variant="secondary"
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 text-sm mt-1"
          />
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onClick={() => navigate(`/support/contact/${ticket.id}`)}
              />
            ))}
          </div>
          <CustomPagination
            current={page + 1}
            pageSize={PAGE_SIZE}
            total={total}
            onChange={(newPage) => setPage(newPage - 1)}
          />
        </>
      )}

      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onSuccess={() => {
            setShowCreate(false);
            setPage(0);
            void refetch();
          }}
        />
      )}
    </div>
  );
};
