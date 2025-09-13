import { authLogo } from '@/assets/images';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon';
import Button from '@/components/shared/Button';
import LanguageDropdown from '@/components/shared/LanguageDropdown';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordForm from '../components/ForgotPassword/ForgotPasswordForm';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-full w-full mx-auto max-w-screen-md px-4">
      <div className="flex justify-between items-center w-full mb-12">
        <Link to="/">
          <img src={authLogo} alt="auth-logo" />
        </Link>
        <LanguageDropdown />
      </div>
      <Button
        text="Back"
        onClick={() => navigate('/auth/login')}
        className="p-2 rounded-lg h-12 cursor-pointer flex items-center gap-2 border border-[#E6EAEE] self-start mb-10"
        icon={<ArrowLeftIcon />}
      />
      <ForgotPasswordForm />
    </div>
  );
};
