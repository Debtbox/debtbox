import DueAmountCard from '../components/DueAmountCard';
import TotalCard from '../components/TotalCard';

export const Dashboard = () => {
  return (
    <section className="space-y-4">
      <div className="flex items-stretch justify-between gap-4 flex-wrap lg:flex-nowrap">
        <div className="flex-1">
          <DueAmountCard />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <TotalCard value="10,550,350 SAR" type="total" />
          <TotalCard value="10,550,350 SAR" type="unpaid" />
          <TotalCard value="10,550,350 SAR" type="paid" />
        </div>
      </div>
    </section>
  );
};
