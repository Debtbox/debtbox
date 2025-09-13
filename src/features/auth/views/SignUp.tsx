import { authLogo } from '@/assets/images';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon';
import Button from '@/components/shared/Button';
import LanguageDropdown from '@/components/shared/LanguageDropdown';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SignUpForm from '../components/SignUp/SignUpForm';
import { useState } from 'react';
import FirstPasswordForm from '../components/SignUp/FirstPasswordForm';
import StoreSelection from '../components/SignUp/StoreSelection';
import IBANForm from '../components/SignUp/IBANForm';
import AccountAdded from '../components/SignUp/AccountAdded';
import { useTranslation } from 'react-i18next';

export const SignUp = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full mx-auto max-w-screen-md px-4">
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
              navigate('/auth/login');
            } else {
              setActiveStep(activeStep - 1);
            }
          }}
          className="p-2 rounded-lg h-12 cursor-pointer flex items-center gap-2 border border-[#E6EAEE] self-start mb-10"
          icon={
            <span className={`${i18n.language === 'ar' ? 'rotate-180' : ''}`}>
              <ArrowLeftIcon />
            </span>
          }
        />
      )}
      {activeStep === 0 && <SignUpForm setActiveStep={setActiveStep} />}
      {activeStep === 1 && <FirstPasswordForm setActiveStep={setActiveStep} />}
      {activeStep === 2 && <StoreSelection setActiveStep={setActiveStep} />}
      {activeStep === 3 && <IBANForm setActiveStep={setActiveStep} />}
      {activeStep === 4 && <AccountAdded />}
    </div>
  );
};
