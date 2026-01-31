import Button from '@/components/shared/Button';
import Success from '@/components/shared/Success';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthFlowStore } from '@/stores/AuthFlowStore';
import { clearCookie } from '@/utils/storage';
import { queryClient } from '@/lib/queryClient';

const AccountAdded = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resetFlow } = useAuthFlowStore();

  return (
    <div className="flex flex-col w-full">
      <Success
        title={t('auth.signUp.accountAdded')}
        description={t('auth.signUp.accountAddedDescription')}
      />
      <Button
        text={t('auth.signUp.goToLogin')}
        onClick={() => {
          resetFlow();
          clearCookie('access_token');
          clearCookie('language');
          localStorage.clear();
          queryClient.clear();
          navigate('/auth/login');
        }}
        className="mt-10 w-full p-2 bg-primary text-white rounded-lg h-12 cursor-pointer hover:bg-primary/90 transition-all duration-150 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
};

export default AccountAdded;
