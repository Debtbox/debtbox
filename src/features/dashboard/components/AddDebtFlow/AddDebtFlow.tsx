import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import CustomerPurchaseForm from './CustomerPurchaseForm';
import WaitingForCustomerResponse from './WaitingForCustomerResponse';
import type { AddDebtResponse } from '../../api/addDebt';

type Step = 'form' | 'waiting' | 'completed';

interface DebtData {
  debtId: string;
  customerId: string;
  amount: number;
  dueDate: string;
}

const AddDebtFlow = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<Step>('form');
  const [debtData, setDebtData] = useState<DebtData | null>(null);
  const [merchantId] = useState('8'); // This should come from user context or props

  const handleFormSuccess = (response: AddDebtResponse) => {
    console.log('Form submission successful:', response);

    // Extract debt data from response
    const newDebtData: DebtData = {
      debtId: response.data.id.toString(),
      customerId: response.data.customer.id.toString(),
      amount: response.data.amount,
      dueDate: response.data.due_date,
    };

    setDebtData(newDebtData);
    setCurrentStep('waiting');

    toast.success(t('dashboard.debtCreatedSuccessfully'));
  };

  const handleCustomerResponse = (
    response: 'accepted' | 'rejected',
    data?: unknown,
  ) => {
    console.log('Customer response:', response, data);

    if (response === 'accepted') {
      toast.success(t('dashboard.customerAcceptedDebt'));
      setCurrentStep('completed');
      // TODO: Navigate to step 3 or success page
    } else {
      toast.error(t('dashboard.customerRejectedDebt'));
      // TODO: Handle rejection - maybe go back to form or show rejection message
      setCurrentStep('form');
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
            merchantId={merchantId}
            debtId={debtData?.debtId}
            onCustomerResponse={handleCustomerResponse}
            onBack={handleBackToForm}
          />
        );

      case 'completed':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {t('dashboard.debtApproved')}
                </h2>
                <p className="text-gray-600">
                  {t('dashboard.debtApprovedMessage')}
                </p>
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
