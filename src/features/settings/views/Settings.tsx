import { useTranslation } from 'react-i18next';

export const Settings = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-2xl font-bold">{t('settings.title', 'Settings')}</h1>
    </div>
  );
};
