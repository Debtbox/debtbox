import { useTranslation } from 'react-i18next';

export const Clients = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-2xl font-bold">{t('clients.title', 'Clients')}</h1>
    </div>
  );
};
