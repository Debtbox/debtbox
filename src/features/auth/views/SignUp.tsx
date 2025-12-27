import { authLogo } from '@/assets/images';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon';
import Button from '@/components/shared/Button';
import LanguageDropdown from '@/components/shared/LanguageDropdown';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SignUpForm from '../components/SignUp/SignUpForm';
import FirstPasswordForm from '../components/SignUp/FirstPasswordForm';
import StoreSelection from '../components/SignUp/StoreSelection';
import IBANForm from '../components/SignUp/IBANForm';
import AccountAdded from '../components/SignUp/AccountAdded';
import { useTranslation } from 'react-i18next';
import { useAuthFlowStore } from '@/stores/AuthFlowStore';
import { useState } from 'react';

export const SignUp = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { activeStep, setActiveStep, resetFlow } = useAuthFlowStore();
  const [isStoreFormOpen, setIsStoreFormOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full mx-auto max-w-3xl px-4">
      <div className="flex justify-between items-center w-full mb-12">
        <Link to="/">
          <img src={authLogo} alt="auth-logo" />
        </Link>
        <LanguageDropdown />
      </div>
      {activeStep !== 4 && (
        <Button
          text={t('common.buttons.back')}
          onClick={() => {
            if (activeStep === 0) {
              resetFlow();
              navigate('/auth/login');
            } else {
              setActiveStep(activeStep - 1);
            }
          }}
          disabled={activeStep === 2 && isStoreFormOpen}
          className="p-2 rounded-lg h-12 cursor-pointer flex items-center gap-2 border border-[#E6EAEE] self-start mb-10 disabled:opacity-50 disabled:cursor-not-allowed"
          icon={
            <span className={`${i18n.language === 'ar' ? 'rotate-180' : ''}`}>
              <ArrowLeftIcon />
            </span>
          }
        />
      )}
      {activeStep === 0 && <SignUpForm />}
      {activeStep === 1 && <FirstPasswordForm />}
      {activeStep === 2 && <StoreSelection onShowAddFormChange={setIsStoreFormOpen} />}
      {activeStep === 3 && <IBANForm />}
      {activeStep === 4 && <AccountAdded />}
    </div>
  );
};
