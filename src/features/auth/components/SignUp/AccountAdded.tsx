import Button from '@/components/shared/Button';
import Success from '@/components/shared/Success';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AccountAdded = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-full">
      <Success
        title={t('auth.signUp.accountAdded')}
        description={t('auth.signUp.accountAddedDescription')}
      />
      <Button
        text={t('auth.signUp.goToLogin')}
        onClick={() => {
          navigate('/auth/login');
        }}
        className="mt-10 w-full p-2 bg-primary text-white rounded-lg h-12 cursor-pointer hover:bg-primary/90 transition-all duration-150 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
};

export default AccountAdded;
