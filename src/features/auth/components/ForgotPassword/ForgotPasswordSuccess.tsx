import Button from '@/components/shared/Button';
import Success from '@/components/shared/Success';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthFlowStore } from '@/stores/AuthFlowStore';
import { useUserStore } from '@/stores/UserStore';
import { clearCookie } from '@/utils/storage';
import { queryClient } from '@/lib/queryClient';

const ForgotPasswordSuccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resetFlow } = useAuthFlowStore();
  const { clearUser } = useUserStore();

  const goToLogin = () => {
    resetFlow();
    clearUser();
    clearCookie('access_token');
    queryClient.clear();
    navigate('/auth/login');
  };

  return (
    <div className="flex flex-col w-full">
      <Success
        title={t('auth.forgotPassword.successTitle')}
        description={t('auth.forgotPassword.successDescription')}
      />
      <Button
        text={t('auth.signUp.goToLogin')}
        onClick={goToLogin}
        className="mt-10 w-full p-2 bg-primary text-white rounded-lg h-12 cursor-pointer hover:bg-primary/90 transition-all duration-150 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
};

export default ForgotPasswordSuccess;
