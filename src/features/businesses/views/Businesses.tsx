import Button from '@/components/shared/Button';
import BusinessCard from '../components/BusinessCard';
import { useGetMerchantBusinesses } from '../api/getMerchantBusinesses';
import { useTranslation } from 'react-i18next';

const BusinessCardSkeleton = () => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
          <div className="h-6 sm:h-8 w-full sm:w-48 bg-gray-200 rounded"></div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="h-12 w-full sm:w-40 md:w-52 bg-gray-200 rounded-lg"></div>
          <div className="h-12 w-full sm:w-40 md:w-52 bg-gray-200 rounded-lg"></div>
          <div className="h-12 w-full sm:w-40 md:w-52 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-3 w-full sm:w-32 bg-gray-200 rounded"></div>
            <div className="h-4 sm:h-6 w-full sm:w-24 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Businesses = () => {
  const { t } = useTranslation();
  const { data: businesses, isLoading } = useGetMerchantBusinesses({
    config: {
      enabled: true,
    },
  });
  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">{t('businesses.title')}</h1>
        <Button
          text={t('businesses.addBusiness')}
          variant="primary"
          className="h-12 w-full sm:w-auto sm:min-w-52"
        />
      </div>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <BusinessCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        businesses?.data.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))
      )}
    </section>
  );
};
