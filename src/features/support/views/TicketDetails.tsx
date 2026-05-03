import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Send, RefreshCw, XCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { toast } from '@/lib/toast';
import Button from '@/components/shared/Button';
import { useGetTicket } from '../api/getTicket';
import { useReplyTicket } from '../api/replyTicket';
import { useCloseTicket } from '../api/closeTicket';
import { useReopenTicket } from '../api/reopenTicket';
import { getStatusColor, getPriorityColor, isClosed } from '../utils';
import type { TicketMessageDTO } from '../types';
import { formatDate } from '@/utils/formatDate';

const MessageBubble = ({ message }: { message: TicketMessageDTO }) => {
  const { i18n } = useTranslation();
  const isRequester = message.senderType === 'REQUESTER';
  return (
    <div className={cn('flex', isRequester ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm',
          isRequester
            ? 'bg-primary text-white rounded-br-sm'
            : 'bg-gray-100 text-gray-800 rounded-bl-sm',
        )}
      >
        <p className="leading-relaxed">{message.body}</p>
        <p
          className={cn(
            'text-xs mt-1',
            isRequester ? 'text-white/60 text-end' : 'text-gray-400',
          )}
        >
          {formatDate(i18n.language, message.created_at, {
            hour: '2-digit',
            minute: '2-digit',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
};

export const TicketDetails = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [replyText, setReplyText] = useState('');
  const [reopenText, setReopenText] = useState('');

  const { data, isLoading } = useGetTicket({ id: id! });
  const ticket = data?.data.ticket;
  const messages = data?.data.messages ?? [];

  const { mutate: reply, isPending: isReplying } = useReplyTicket({
    config: {
      onSuccess: () => setReplyText(''),
      onError: (err: unknown) => {
        const msg = (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message;
        toast.error(msg ?? t('support.reply.error', 'Failed to send reply'));
      },
    },
  });

  const { mutate: close, isPending: isClosing } = useCloseTicket({
    config: {
      onSuccess: () =>
        toast.success(t('support.close.success', 'Ticket closed')),
      onError: (err: unknown) => {
        const msg = (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message;
        toast.error(msg ?? t('support.close.error', 'Failed to close ticket'));
      },
    },
  });

  const { mutate: reopen, isPending: isReopening } = useReopenTicket({
    config: {
      onSuccess: () => {
        setReopenText('');
        toast.success(t('support.reopen.success', 'Ticket reopened'));
      },
      onError: (err: unknown) => {
        const msg = (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message;
        toast.error(
          msg ?? t('support.reopen.error', 'Failed to reopen ticket'),
        );
      },
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (isLoading || !ticket) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-5 w-40 bg-gray-200 rounded" />
        <div className="bg-white rounded-2xl p-6 space-y-3">
          <div className="h-6 w-64 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
        <div className="bg-white rounded-2xl p-6 h-64" />
      </div>
    );
  }

  const closed = isClosed(ticket.status);

  const handleReply = () => {
    if (!replyText.trim()) return;
    reply({ id: ticket.id, body: replyText.trim() });
  };

  const handleReopen = () => {
    if (!reopenText.trim()) return;
    reopen({ id: ticket.id, details: reopenText.trim() });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => navigate('/support/contact')}
          className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{t('support.contactSupport', 'Contact Support')}</span>
        </button>
        <span className="text-gray-300">/</span>
        <span className="font-bold text-gray-900 truncate max-w-xs">
          {ticket.subject}
        </span>
      </div>

      <div className="bg-white rounded-2xl p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-mono text-gray-400 mb-1">
              {ticket.code}
            </p>
            <h2 className="text-base font-bold text-gray-900">
              {ticket.subject}
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                'text-xs font-medium px-2.5 py-1 rounded-full',
                getStatusColor(ticket.status),
              )}
            >
              {t(
                `support.status.${ticket.status}`,
                ticket.status.replace(/_/g, ' '),
              )}
            </span>
            <span
              className={cn(
                'text-xs font-medium px-2.5 py-1 rounded-full',
                getPriorityColor(ticket.priority),
              )}
            >
              {t(`support.priority.${ticket.priority}`, ticket.priority)}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-3 leading-relaxed">
          {ticket.description}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          {t('support.openedOn', 'Opened on')}{' '}
          {formatDate(i18n.language, ticket.created_at, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      <div className="bg-white rounded-2xl flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">
            {t('support.conversation', 'Conversation')}
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[280px] max-h-[420px]">
          {messages.length === 0 ? (
            <p className="text-sm text-gray-400 text-center mt-8">
              {t(
                'support.noMessages',
                'No messages yet. The support team will respond shortly.',
              )}
            </p>
          ) : (
            messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-5 py-4 border-t border-gray-100">
          {closed ? (
            <div className="space-y-3">
              <p className="text-xs text-gray-500">
                {t(
                  'support.reopenHint',
                  'This ticket is closed. Provide details to reopen it.',
                )}
              </p>
              <textarea
                rows={3}
                value={reopenText}
                onChange={(e) => setReopenText(e.target.value)}
                placeholder={t(
                  'support.reopenPlaceholder',
                  'Describe why you are reopening this ticket...',
                )}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-2 focus:border-primary resize-none"
              />
              <Button
                text={t('support.reopenBtn', 'Reopen Ticket')}
                variant="secondary"
                icon={<RefreshCw className="w-4 h-4 me-1.5" />}
                onClick={handleReopen}
                isLoading={isReopening}
                disabled={!reopenText.trim()}
                className="px-4 py-2 text-sm flex items-center gap-1"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-end gap-3">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleReply();
                    }
                  }}
                  placeholder={t(
                    'support.replyPlaceholder',
                    'Type your reply...',
                  )}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-2 focus:border-primary resize-none"
                />
                <Button
                  text=""
                  icon={<Send className="w-4 h-4" />}
                  variant="primary"
                  onClick={handleReply}
                  isLoading={isReplying}
                  disabled={!replyText.trim()}
                  className="w-10 h-10 flex items-center justify-center rounded-xl p-0 shrink-0"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  text={t('support.closeTicket', 'Close Ticket')}
                  variant="gray"
                  icon={<XCircle className="w-4 h-4 me-1.5" />}
                  onClick={() => close({ id: ticket.id })}
                  isLoading={isClosing}
                  className="px-4 py-2 text-xs flex items-center gap-1"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
