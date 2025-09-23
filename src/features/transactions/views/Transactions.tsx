import { useTranslation } from 'react-i18next';

export const Transactions = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-2xl font-bold">
        {t('transactions.title', 'Transactions')}
      </h1>
    </div>
  );
};
