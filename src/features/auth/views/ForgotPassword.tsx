import { useEffect, useState } from 'react';
import { authLogo } from '@/assets/images';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon';
import Button from '@/components/shared/Button';
import LanguageDropdown from '@/components/shared/LanguageDropdown';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ForgotPasswordForm from '../components/ForgotPassword/ForgotPasswordForm';
import FirstPasswordForm from '../components/SignUp/FirstPasswordForm';
import ForgotPasswordSuccess from '../components/ForgotPassword/ForgotPasswordSuccess';
import { useAuthFlowStore } from '@/stores/AuthFlowStore';

type ForgotPasswordStep = 0 | 1 | 2;

export const ForgotPassword = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { resetFlow } = useAuthFlowStore();
  const [step, setStep] = useState<ForgotPasswordStep>(0);

  useEffect(() => {
    resetFlow();
  }, [resetFlow]);

  const handleBack = () => {
    if (step === 0) {
      navigate('/auth/login');
    } else {
      setStep((s) => (s - 1) as ForgotPasswordStep);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full mx-auto max-w-3xl px-4">
      <div className="flex justify-between items-center w-full mb-12">
        <Link to="/">
          <img src={authLogo} alt="auth-logo" />
        </Link>
        <LanguageDropdown />
      </div>

      {step !== 2 && (
        <Button
          text={t('common.buttons.back')}
          onClick={handleBack}
          className="p-2 rounded-lg h-12 cursor-pointer flex items-center gap-2 border border-[#E6EAEE] self-start mb-10 disabled:opacity-50 disabled:cursor-not-allowed"
          icon={
            <span className={i18n.language === 'ar' ? 'rotate-180' : ''}>
              <ArrowLeftIcon />
            </span>
          }
        />
      )}

      {step === 0 && (
        <ForgotPasswordForm onNafathSuccess={() => setStep(1)} />
      )}
      {step === 1 && (
        <FirstPasswordForm onSuccess={() => setStep(2)} />
      )}
      {step === 2 && <ForgotPasswordSuccess />}
    </div>
  );
};
