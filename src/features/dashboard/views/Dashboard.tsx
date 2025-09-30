import Sideover from '@/components/shared/Sideover';
import DueAmountCard from '../components/DueAmountCard';
import TotalCard from '../components/TotalCard';
import { useTranslation } from 'react-i18next';
import { AddDebtFlow } from '../components/AddDebtFlow';
import { useUrlBooleanState } from '@/utils/urlState';
import { useGetBusinessTotal } from '../api/getBusinessTotal';
import { useUserStore } from '@/stores/UserStore';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { selectedBusiness } = useUserStore();
  const [isSideoverOpen, toggleSideover] =
    useUrlBooleanState('purchase-sideover');
  const [totalDueAmount, setTotalDueAmount] = useState<number>(0);

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
  }, [selectedBusiness]);

  return (
    <section className="space-y-4">
      <div className="flex items-stretch justify-between gap-4 flex-wrap lg:flex-nowrap">
        <div className="flex-1">
          <DueAmountCard
            totalDueAmount={totalDueAmount.toString()}
            onAddPayment={() => toggleSideover(true)}
          />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <TotalCard value="10,550,350 SAR" type="total" />
          <TotalCard value="10,550,350 SAR" type="unpaid" />
          <TotalCard value="10,550,350 SAR" type="paid" />
        </div>
      </div>
      <Sideover
        isOpen={isSideoverOpen}
        onClose={() => toggleSideover(false)}
        title={t('dashboard.add_customer_purchase', 'Add Customer Purchase')}
        direction={i18n.language === 'ar' ? 'rtl' : 'ltr'}
        className="flex flex-col h-full"
      >
        <AddDebtFlow />
      </Sideover>
    </section>
  );
};
