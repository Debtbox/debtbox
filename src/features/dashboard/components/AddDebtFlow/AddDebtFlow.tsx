import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import CustomerPurchaseForm from './CustomerPurchaseForm';
import WaitingForCustomerResponse from './WaitingForCustomerResponse';
import type { AddDebtResponse } from '../../api/addDebt';
import { useUserStore } from '@/stores/UserStore';
import type { Step } from '../../types';
import SuccessIcon from '@/components/icons/SuccessIcon';
import Button from '@/components/shared/Button';
import { XCircle } from 'lucide-react';

interface DebtData {
  debtId: string;
  customerId: string;
  amount: number;
  dueDate: string;
}

const AddDebtFlow = ({
  currentStep,
  setCurrentStep,
  onClose,
}: {
  currentStep: Step;
  setCurrentStep: (step: Step) => void;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const [debtData, setDebtData] = useState<DebtData | null>(null);
  const { user } = useUserStore();
  const handleFormSuccess = (response: AddDebtResponse) => {
    const newDebtData: DebtData = {
      debtId: response.data.id.toString(),
      customerId: response.data.customer.id.toString(),
      amount: response.data.amount,
      dueDate: response.data.due_date,
    };

    setDebtData(newDebtData);
    setCurrentStep('waiting');
  };

  const handleCustomerResponse = (response: 'accepted' | 'rejected') => {
    if (response === 'accepted') {
      toast.success(t('dashboard.customerAcceptedDebt'));
      setCurrentStep('completed');
    } else {
      toast.error(t('dashboard.customerRejectedDebt'));
      setCurrentStep('rejected');
    }
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
    setDebtData(null);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'form':
        return <CustomerPurchaseForm onSuccess={handleFormSuccess} />;

      case 'waiting':
        return (
          <WaitingForCustomerResponse
            merchantId={user?.id.toString() as string}
            debtId={debtData?.debtId}
            onCustomerResponse={handleCustomerResponse}
            onBack={handleBackToForm}
          />
        );

      case 'completed':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center justify-start pt-12">
              <SuccessIcon className="mb-6" />
              <p className="text-sm text-[#474747] mb-3">
                {t('dashboard.debtAddedSuccessfully')}
              </p>
              <h3 className="text-2xl font-bold mb-3">
                {debtData?.amount.toLocaleString()}{' '}
                {t('common.fields.sar', 'SAR')}
              </h3>
              <div className="grid grid-cols-2 text-center gap-4 w-full border-b border-gray-200 border-dashed pb-4">
                <div className="text-[#707070] text-start">
                  {t('dashboard.customerId')}
                </div>
                <div className="text-xl text-end">{debtData?.customerId}</div>
                <div className="text-[#707070] text-start">
                  {t('dashboard.dueDate')}
                </div>
                <div className="text-xl  text-end">{debtData?.dueDate}</div>
                <div className="text-[#707070] text-start">
                  {t('dashboard.amount')}
                </div>
                <div className="text-xl  text-end">
                  {debtData?.amount.toLocaleString()}{' '}
                  {t('common.fields.sar', 'SAR')}
                </div>
              </div>
              <div className="grid grid-cols-2 text-center gap-4 w-full mt-4">
                <div className="text-[#707070] text-start">
                  {t('dashboard.amount')}
                </div>
                <div className="text-xl  text-end">
                  {debtData?.amount.toLocaleString()}{' '}
                  {t('common.fields.sar', 'SAR')}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border-t border-gray-200">
              <div className="text-sm text-gray-500 font-medium flex-1">
                {t('dashboard.step_3_of_3')}
              </div>
              <div className="flex items-center gap-2 flex-1">
                <Button
                  type="button"
                  text={t('common.buttons.export')}
                  onClick={() => {}}
                  className="flex-1 p-2 h-12"
                  variant="secondary"
                  disabled
                />
                <Button
                  type="button"
                  text={t('common.buttons.done')}
                  className="flex-1 p-2 h-12"
                  variant="primary"
                  onClick={() => {
                    setCurrentStep('form');
                    setDebtData(null);
                    onClose();
                  }}
                />
              </div>
            </div>
          </div>
        );

      case 'rejected':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center justify-start pt-12">
              <XCircle className="mb-6 text-red-500 size-16" />
              <p className="text-sm text-[#474747] mb-3">
                {t('dashboard.debtRejected')}
              </p>
              <h3 className="text-2xl font-bold mb-3">
                {debtData?.amount.toLocaleString()}{' '}
                {t('common.fields.sar', 'SAR')}
              </h3>
              <div className="grid grid-cols-2 text-center gap-4 w-full border-b border-gray-200 border-dashed pb-4">
                <div className="text-[#707070] text-start">
                  {t('dashboard.customerId')}
                </div>
                <div className="text-xl text-end">{debtData?.customerId}</div>
                <div className="text-[#707070] text-start">
                  {t('dashboard.dueDate')}
                </div>
                <div className="text-xl  text-end">{debtData?.dueDate}</div>
                <div className="text-[#707070] text-start">
                  {t('dashboard.amount')}
                </div>
                <div className="text-xl  text-end">
                  {debtData?.amount.toLocaleString()}{' '}
                  {t('common.fields.sar', 'SAR')}
                </div>
              </div>
              <div className="grid grid-cols-2 text-center gap-4 w-full mt-4">
                <div className="text-[#707070] text-start">
                  {t('dashboard.amount')}
                </div>
                <div className="text-xl  text-end">
                  {debtData?.amount.toLocaleString()}{' '}
                  {t('common.fields.sar', 'SAR')}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border-t border-gray-200">
              <div className="text-sm text-gray-500 font-medium flex-1">
                {t('dashboard.step_3_of_3')}
              </div>
              <div className="flex items-center gap-2 flex-1">
                <Button
                  type="button"
                  text={t('common.buttons.export')}
                  onClick={() => {}}
                  className="flex-1 p-2 h-12"
                  variant="secondary"
                  disabled
                />
                <Button
                  type="button"
                  text={t('common.buttons.done')}
                  className="flex-1 p-2 h-12"
                  variant="primary"
                  onClick={() => {
                    setCurrentStep('form');
                    setDebtData(null);
                    onClose();
                  }}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="h-full">{renderCurrentStep()}</div>;
};

export default AddDebtFlow;
