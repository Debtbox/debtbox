import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import {
  DueDateStatusBadge,
  StatusBadge,
} from '@/components/shared/StatusBadge';
import CalendarIcon from '@/components/icons/CalendarIcon';
import { type Debt } from '../../types/debt';
import { useTranslation } from 'react-i18next';
import { useCancelDebt } from '../../api/cancelDebt';
import { toast } from 'sonner';
import { useConsentReAttempt } from '../../api/consentReAttempt';
import { useState } from 'react';
import { useDebtConsentWaiting } from '../../hooks/useDebtConsentWaiting';
import DebtConsentWaiting from '../shared/DebtConsentWaiting';
import { useMarkDebtAsOverDue } from '../../api/markDebtAsOverDue';
import { useExtendDebtDueDate } from '../../api/extendDebtDueDate';
import { formatDate, type SupportedLocale } from '../../utils/debtUtils';
const DebtDetails = ({
  debtData,
  setIsSideoverOpen,
  refetchDebts,
}: {
  debtData: Debt;
  setIsSideoverOpen: (isOpen: boolean) => void;
  refetchDebts: () => void;
}) => {
  const { t, i18n } = useTranslation();
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showOverdueConfirmation, setShowOverdueConfirmation] = useState(false);
  const [showExtendConfirmation, setShowExtendConfirmation] = useState(false);
  const [newDueDate, setNewDueDate] = useState('');
  const [reason, setReason] = useState('');

  const { mutate: cancelDebt, isPending: isCancellingDebt } = useCancelDebt({
    onSuccess: () => {
      toast.success(t('dashboard.debtCancelledSuccessfully'));
      refetchDebts();
      setIsSideoverOpen(false);
    },
    onError: (error) => {
      toast.error(
        error.response.data.message || t('dashboard.debtCancelledFailed'),
      );
    },
  });

  const { mutate: resubmitDebt, isPending: isResubmittingDebt } =
    useConsentReAttempt({
      onSuccess: () => {
        toast.success(t('dashboard.debtUpdatedSuccessfully'));
        startWaiting();
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    });

  const {
    mutate: markDebtAsOverDueMutate,
    isPending: isMarkingDebtAsOverDueMutate,
  } = useMarkDebtAsOverDue({
    onSuccess: () => {
      toast.success(t('dashboard.debtMarkedAsOverDueSuccessfully'));
      refetchDebts();
      setIsSideoverOpen(false);
    },
    onError: (error) => {
      toast.error(
        error.response.data.message || t('dashboard.debtMarkedAsOverDueFailed'),
      );
    },
  });

  const {
    mutate: extendDebtDueDateMutate,
    isPending: isExtendingDebtDueDateMutate,
  } = useExtendDebtDueDate({
    onSuccess: () => {
      toast.success(t('dashboard.debtDueDateExtendedSuccessfully'));
      refetchDebts();
      setIsSideoverOpen(false);
    },
    onError: (error) => {
      toast.error(
        error.response.data.message || t('dashboard.debtDueDateExtendedFailed'),
      );
    },
  });
  const { isWaiting, startWaiting, stopWaiting } = useDebtConsentWaiting({
    onResponse: () => {
      refetchDebts();
      setIsSideoverOpen(false);
    },
  });

  const handleCancelClick = () => {
    setShowCancelConfirmation(true);
  };

  const handleConfirmCancel = () => {
    cancelDebt({ debtId: debtData.debtId.toString() });
    setShowCancelConfirmation(false);
  };

  const handleCancelConfirmation = () => {
    setShowCancelConfirmation(false);
  };

  const handleOverdueClick = () => {
    setShowOverdueConfirmation(true);
  };

  const handleConfirmOverdue = () => {
    markDebtAsOverDueMutate({ debtId: debtData.debtId.toString() });
    setShowOverdueConfirmation(false);
  };

  const handleCancelOverdueConfirmation = () => {
    setShowOverdueConfirmation(false);
  };

  const handleExtendClick = () => {
    setShowExtendConfirmation(true);
  };

  const handleConfirmExtend = () => {
    if (newDueDate && reason.trim()) {
      extendDebtDueDateMutate({
        debtId: debtData.debtId.toString(),
        newDueDate: newDueDate,
        reason: reason.trim(),
      });
      setShowExtendConfirmation(false);
      setNewDueDate('');
      setReason('');
    }
  };

  const handleCancelExtendConfirmation = () => {
    setShowExtendConfirmation(false);
    setNewDueDate('');
    setReason('');
  };

  // Show waiting UI when waiting for customer response
  if (isWaiting) {
    return (
      <DebtConsentWaiting onCancel={stopWaiting} showStepIndicator={false} />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="pt-6 px-1 space-y-4 flex-1">
        <div>
          <h1 className="text-lg font-bold mb-5">
            {t('dashboard.customerDebtDetails', 'Customer Debt Details')}
          </h1>
          {debtData.title && (
            <div>
              <div className="flex justify-between items-end mb-4">
                <div className="flex flex-col gap-2">
                  <div className="text-xs text-gray-500">
                    {t('dashboard.debt_title')}
                  </div>
                  <div className="text-xl font-bold">{debtData?.title}</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-2">
              <div className="text-xs text-gray-500">
                {t('dashboard.debtAmount', 'Debt Amount')}
              </div>
              <div className="text-2xl font-bold">
                {debtData?.amount.toLocaleString()}{' '}
                {t('common.fields.sar', 'SAR')}
              </div>
            </div>
            <DueDateStatusBadge
              status={
                debtData?.dueDateStatus as
                  | 'normal'
                  | 'overdue'
                  | 'in 7 days'
                  | 'soon'
              }
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-2">
              <div className="text-xs text-gray-500">
                {t('dashboard.customerFullName', 'Customer Full Name')}
              </div>
              <div className="text-xl font-bold">
                {i18n.language === 'ar'
                  ? debtData?.full_name_ar
                  : debtData?.full_name_en}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-2">
              <div className="text-xs text-gray-500">
                {t('common.buttons.status', 'Status')}
              </div>
              <div className="text-xl font-bold">
                <StatusBadge
                  status={debtData?.status as 'pending' | 'paid' | 'expired'}
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-2">
              <div className="text-xs text-gray-500">
                {t('dashboard.dueDate', 'Due Date')}
              </div>
              <div className="text-xl font-bold">
                {formatDate(debtData?.due_date, {
                  includeTime: true,
                  locale: i18n.language as SupportedLocale,
                })}
              </div>
            </div>
          </div>
        </div>
        {debtData.original_date &&
          debtData.original_date !== debtData.due_date && (
            <div>
              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-2">
                  <div className="text-xs text-gray-500">
                    {t('dashboard.originalDueDate', 'Due Date (Original)')}
                  </div>
                  <div className="text-xl font-bold">
                    {formatDate(debtData?.original_date, {
                      includeTime: true,
                      locale: i18n.language as SupportedLocale,
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Extend Due Date Form - appears under details when confirmation is shown */}
        {showExtendConfirmation && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg animate-in slide-in-from-top-4 fade-in duration-300 ease-out">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('dashboard.confirmExtendDueDate', 'Extend Due Date')}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {t(
                'dashboard.extendDueDateWarning',
                'Select a new due date for this debt',
              )}
            </p>
            <div className="space-y-4">
              <div className="animate-in slide-in-from-left-2 fade-in duration-300 delay-100">
                <Input
                  id="new-due-date"
                  type="date"
                  label={t('dashboard.newDueDate', 'New Due Date')}
                  placeholder={t('dashboard.selectDate', 'Select date')}
                  labelClassName="mb-1"
                  className="ps-10"
                  icon={<CalendarIcon />}
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                />
              </div>
              <div className="animate-in slide-in-from-left-2 fade-in duration-300 delay-200">
                <Input
                  id="reason"
                  type="text"
                  label={t('dashboard.reason', 'Reason')}
                  placeholder={t(
                    'dashboard.reasonPlaceholder',
                    'Enter reason for extension',
                  )}
                  labelClassName="mb-1"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        {debtData.isPending ? (
          <div className="flex flex-col gap-3 flex-1">
            {showCancelConfirmation ? (
              <div className="animate-in fade-in duration-300 ease-out">
                <div className="text-start animate-in slide-in-from-top-2 fade-in duration-300 delay-100 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t(
                      'dashboard.confirmCancelDebt',
                      'Are you sure you want to cancel this debt?',
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t(
                      'dashboard.cancelDebtWarning',
                      'Changing this will affect the user',
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2 animate-in slide-in-from-bottom-2 fade-in duration-300 delay-200">
                  <Button
                    type="button"
                    text={t('common.buttons.yes', 'Yes')}
                    onClick={handleConfirmCancel}
                    className="flex-1 p-2 h-12 text-red-600 border-none !bg-red-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    variant="secondary"
                    isLoading={isCancellingDebt}
                    disabled={isCancellingDebt}
                  />
                  <Button
                    type="button"
                    text={t('common.buttons.no', 'No')}
                    onClick={handleCancelConfirmation}
                    className="flex-1 p-2 h-12 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    variant="gray"
                    disabled={isCancellingDebt}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 animate-in fade-in duration-300 ease-out">
                <Button
                  type="button"
                  text={t('common.buttons.cancel', 'Cancel')}
                  onClick={handleCancelClick}
                  className="flex-1 p-2 h-12 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  variant="gray"
                  disabled={isCancellingDebt || isResubmittingDebt}
                />
                <Button
                  type="button"
                  text={t('common.buttons.resubmit', 'Resubmit')}
                  className="flex-1 p-2 h-12 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  variant="primary"
                  onClick={() => {
                    resubmitDebt({ debtId: debtData.debtId.toString() });
                  }}
                  isLoading={isResubmittingDebt}
                  disabled={isResubmittingDebt || isCancellingDebt}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3 flex-1">
            {showExtendConfirmation ? (
              <div className="flex items-center gap-2 animate-in slide-in-from-bottom-2 fade-in duration-300 ease-out">
                <Button
                  type="button"
                  text={t('common.buttons.confirm', 'Confirm')}
                  onClick={handleConfirmExtend}
                  className="flex-1 p-2 h-12 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  variant="primary"
                  isLoading={isExtendingDebtDueDateMutate}
                  disabled={
                    isExtendingDebtDueDateMutate ||
                    !newDueDate ||
                    !reason.trim()
                  }
                />
                <Button
                  type="button"
                  text={t('common.buttons.cancel', 'Cancel')}
                  onClick={handleCancelExtendConfirmation}
                  className="flex-1 p-2 h-12 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  variant="gray"
                  disabled={isExtendingDebtDueDateMutate}
                />
              </div>
            ) : showOverdueConfirmation ? (
              <div className="animate-in fade-in duration-300 ease-out">
                <div className="text-start animate-in slide-in-from-top-2 fade-in duration-300 delay-100 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t(
                      'dashboard.confirmMarkAsOverdue',
                      'Are you sure you want to mark this debt as overdue?',
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t(
                      'dashboard.markAsOverdueWarning',
                      'This action will notify the customer about the overdue status',
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2 animate-in slide-in-from-bottom-2 fade-in duration-300 delay-200">
                  <Button
                    type="button"
                    text={t('common.buttons.yes', 'Yes')}
                    onClick={handleConfirmOverdue}
                    className="flex-1 p-2 h-12 text-red-600 border-none !bg-red-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    variant="secondary"
                    isLoading={isMarkingDebtAsOverDueMutate}
                    disabled={isMarkingDebtAsOverDueMutate}
                  />
                  <Button
                    type="button"
                    text={t('common.buttons.no', 'No')}
                    onClick={handleCancelOverdueConfirmation}
                    className="flex-1 p-2 h-12 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    variant="gray"
                    disabled={isMarkingDebtAsOverDueMutate}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 animate-in fade-in duration-300 ease-out">
                <Button
                  type="button"
                  text={t('dashboard.extendDueDate', 'Extend Due Date')}
                  onClick={handleExtendClick}
                  className="flex-1 p-2 h-12 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  variant="gray"
                  disabled={
                    isMarkingDebtAsOverDueMutate || isExtendingDebtDueDateMutate
                  }
                />
                <Button
                  type="button"
                  text={t('dashboard.markAsOverdue', 'Mark as overdue')}
                  className="flex-1 p-2 h-12 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  variant="primary"
                  onClick={handleOverdueClick}
                  disabled={
                    isMarkingDebtAsOverDueMutate || isExtendingDebtDueDateMutate
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DebtDetails;
