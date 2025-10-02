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
import { Clock, XCircle } from 'lucide-react';
import { useConsentReAttempt } from '../../api/consentReAttempt';
import type { DebtDataResponse } from '../../types/debt';
import DebtInformation from './DebtInformation';

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
  const [debtData, setDebtData] = useState<DebtDataResponse | null>(null);
  const { user } = useUserStore();

  const { mutate: consentReAttempt } = useConsentReAttempt({
    onSuccess: () => {
      toast.success(t('dashboard.debtUpdatedSuccessfully'));
      setCurrentStep('waiting');
      setDebtData(debtData);
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleFormSuccess = (response: AddDebtResponse) => {
    const newDebtData: DebtDataResponse = {
      id: response.data.id,
      business: response.data.business,
      customer: response.data.customer,
      amount: response.data.amount,
      due_date: response.data.due_date,
      status: response.data.status,
    };

    setDebtData(newDebtData);
    setCurrentStep('waiting');
  };

  const handleCustomerResponse = (
    response: 'accepted' | 'rejected' | 'expired',
  ) => {
    if (response === 'accepted') {
      toast.success(t('dashboard.customerAcceptedDebt'));
      setCurrentStep('completed');
    } else if (response === 'expired') {
      toast.error(t('dashboard.customerExpiredDebt'));
      setCurrentStep('expired');
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
            debtId={debtData?.id.toString()}
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
              <DebtInformation debtData={debtData as DebtDataResponse} />
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
              <DebtInformation debtData={debtData as DebtDataResponse} />
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

      case 'expired':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center justify-start pt-12">
              <Clock className="mb-6 text-red-500 size-16" />
              <p className="text-sm text-[#474747] mb-3">
                {t('dashboard.debtExpired')}
              </p>
              <DebtInformation debtData={debtData as DebtDataResponse} />
            </div>
            <div className="flex items-center justify-between p-4 border-t border-gray-200">
              <div className="text-sm text-gray-500 font-medium flex-1">
                {t('dashboard.step_3_of_3')}
              </div>
              <div className="flex items-center gap-2 flex-1">
                <Button
                  type="button"
                  text={t('common.buttons.cancel')}
                  onClick={() => {
                    setCurrentStep('form');
                    setDebtData(null);
                    onClose();
                  }}
                  className="flex-1 p-2 h-12"
                  variant="secondary"
                  disabled
                />
                <Button
                  type="button"
                  text={t('common.buttons.resubmit')}
                  className="flex-1 p-2 h-12"
                  variant="primary"
                  onClick={() => {
                    consentReAttempt({
                      debtId: debtData?.id.toString() as string,
                    });
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
