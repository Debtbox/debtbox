import Sideover from '@/components/shared/Sideover';
import DueAmountCard from '../components/DueAmountCard';
// import TotalCard from '../components/TotalCard';
import { useTranslation } from 'react-i18next';
import { AddDebtFlow } from '../components/AddDebtFlow';
import { useUrlBooleanState } from '@/utils/urlState';
import { useGetBusinessTotal } from '../api/getBusinessTotal';
import { useUserStore } from '@/stores/UserStore';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { Step } from '../types';
import DebtsTable from '../components/DebtsTable/DebtsTable';

export const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { selectedBusiness } = useUserStore();
  const [isSideoverOpen, toggleSideover] =
    useUrlBooleanState('purchase-sideover');
  const [totalDueAmount, setTotalDueAmount] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<Step>('form');

  const { mutate: getBusinessTotal } = useGetBusinessTotal({
    onSuccess: (data) => {
      setTotalDueAmount(data.data.total);
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  useEffect(() => {
    if (selectedBusiness) {
      getBusinessTotal({
        businessId: selectedBusiness?.id.toString() as string,
      });
    }
  }, [selectedBusiness, isSideoverOpen]);

  return (
    <section className="space-y-4">
      <div className="flex items-stretch justify-between gap-4 flex-wrap lg:flex-nowrap">
        <div className="flex-1">
          <DueAmountCard
            totalDueAmount={totalDueAmount.toLocaleString()}
            onAddPayment={() => toggleSideover(true)}
          />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          {/* <TotalCard value={10550350} type="total" />
          <TotalCard value={10550350} type="unpaid" />
          <TotalCard value={10550350} type="paid" /> */}
        </div>
      </div>
      <DebtsTable isSideoverOpen={isSideoverOpen} />
      <Sideover
        isOpen={isSideoverOpen}
        onClose={() => toggleSideover(false)}
        title={
          currentStep === 'form'
            ? t('dashboard.add_customer_purchase', 'Add Customer Purchase')
            : currentStep === 'waiting'
              ? t('dashboard.waiting_for_customer_response', 'Hold On')
              : currentStep === 'completed'
                ? t('dashboard.debt_approved', 'Successfully Payment')
                : t('dashboard.debt_rejected', 'Payment Failed')
        }
        direction={i18n.language === 'ar' ? 'rtl' : 'ltr'}
        className="flex flex-col h-full"
      >
        <AddDebtFlow
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          onClose={() => toggleSideover(false)}
        />
      </Sideover>
    </section>
  );
};
