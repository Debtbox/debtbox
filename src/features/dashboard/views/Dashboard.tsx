import { useTranslation } from 'react-i18next';

export const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {t('dashboard.title', 'Dashboard')}
      </h1>
    </div>
  );
};
