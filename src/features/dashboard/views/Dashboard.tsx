import Sideover from '@/components/shared/Sideover';
import DueAmountCard from '../components/DueAmountCard';
// import TotalCard from '../components/TotalCard';
import { useTranslation } from 'react-i18next';
import { AddDebtFlow } from '../components/AddDebtFlow';
import { useUrlBooleanState } from '@/utils/urlState';
import {
  useGetBusinessTotal,
  type BusinessDashboardData,
} from '../api/getBusinessTotal';
import { useUserStore } from '@/stores/UserStore';
import { useEffect, useState } from 'react';
import { toast } from '@/lib/toast';
import type { Step } from '../types';
import DebtsTable from '../components/DebtsTable/DebtsTable';
import FeeBreakdown, {
  type FeeBreakdownItem,
} from '../components/FeeBreakdown';

export const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { selectedBusiness } = useUserStore();
  const [isSideoverOpen, toggleSideover] =
    useUrlBooleanState('purchase-sideover');
  const [dashboardData, setDashboardData] =
    useState<BusinessDashboardData | null>(null);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('form');

  const { mutate: getBusinessTotal } = useGetBusinessTotal({
    onSuccess: (data) => {
      setDashboardData(data.data);
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  useEffect(() => {
    if (selectedBusiness) {
      getBusinessTotal({
        businessId: selectedBusiness.id.toString(),
      });
    }
  }, [selectedBusiness, isSideoverOpen, getBusinessTotal]);

  const totalDueAmount =
    dashboardData?.totalDebtAmount ?? dashboardData?.total ?? 0;
  const breakdown = dashboardData?.expectedFeeBreakdown;
  const netAmount = breakdown?.expectedMerchantNetAmount ?? totalDueAmount;
  const serviceFee = breakdown?.totalDeductions;
  const breakdownItems: FeeBreakdownItem[] = breakdown
    ? [
        {
          label: t('dashboard.openDebtsTotal', 'Open Debts Total'),
          amount: totalDueAmount,
          status: 'active',
          breakdown,
        },
      ]
    : [];

  const formatAmount = (value: number) =>
    new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-SA-u-ca-gregory' : 'en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <section className="space-y-4">
      <div className="flex items-stretch justify-between gap-4 flex-wrap lg:flex-nowrap">
        <div className="flex-1 animate-fade-in">
          <DueAmountCard
            netAmount={formatAmount(netAmount)}
            pendingAmount={formatAmount(totalDueAmount)}
            serviceFee={serviceFee !== undefined ? formatAmount(serviceFee) : undefined}
            onAddPayment={() => toggleSideover(true)}
            onViewBreakdown={() => setIsBreakdownOpen(true)}
            showViewBreakdown={!!breakdown}
          />
        </div>
        <div className="md:flex-1 flex flex-col gap-4">
          {/* <TotalCard
            value={(selectedBusiness?.totalPaidAmount ?? 0) + (selectedBusiness?.totalOverdueAmount ?? 0)}
            title={t('dashboard.total', 'Total')}
            color="gray"
          />
          <TotalCard
            value={selectedBusiness?.totalOutstandingAmount ?? 0}
            title={t('dashboard.unpaid', 'Due (Unpaid)')}
            color="red"
          />
          <TotalCard
            value={selectedBusiness?.totalOverdueAmount ?? 0}
            title={t('dashboard.paid', 'Due (Paid)')}
            color="green"
          /> */}
        </div>
      </div>
      <div className="animate-fade-in animation-delay-200">
        <DebtsTable isSideoverOpen={isSideoverOpen} />
      </div>
      <Sideover
        isOpen={isSideoverOpen}
        onClose={() => toggleSideover(false)}
        title={
          currentStep === 'form'
            ? t('dashboard.add_customer_debt', 'Add Customer Purchase')
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
      <Sideover
        isOpen={isBreakdownOpen}
        onClose={() => setIsBreakdownOpen(false)}
        title={t('dashboard.totalDebtsBreakdown', 'Total Debts Breakdown')}
        direction={i18n.language === 'ar' ? 'rtl' : 'ltr'}
        className="flex flex-col h-full"
      >
        <FeeBreakdown items={breakdownItems} />
      </Sideover>
    </section>
  );
};
