import { authLogo } from '@/assets/images';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import LanguageDropdown from '@/components/shared/LanguageDropdown';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;

// TODO: The validation will be changed when the backend is ready
const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    identificationNumber: z
      .string()
      .min(1, t('common.validation.identificationNumberRequired'))
      .min(10, t('common.validation.identificationNumberMinLength'))
      .max(20, t('common.validation.identificationNumberMaxLength')),
    password: z
      .string()
      .min(1, t('common.validation.passwordRequired'))
      .min(6, t('common.validation.passwordMinLength')),
  });

export const Login = () => {
  const { t } = useTranslation();
  const loginSchema = createLoginSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('Form data:', data);
      // TODO: Implement actual login logic here
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full mx-auto max-w-screen-md px-4">
      <div className="flex justify-between items-center w-full mb-12">
        <Link to="/">
          <img src={authLogo} alt="auth-logo" />
        </Link>
        <LanguageDropdown />
      </div>
      <div className="flex flex-col w-full">
        <h1 className="text-[28px] font-bold mb-4">{t('auth.login.title')}</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-full"
        >
          <div className="flex flex-col w-full mb-4">
            <Input
              {...register('identificationNumber')}
              label={t('common.fields.identificationNumber')}
              placeholder={t('common.fields.identificationNumberPlaceholder')}
              type="text"
              id="identification-number"
              helperText={t('common.fields.identificationNumberHelper')}
              error={errors.identificationNumber?.message}
            />
          </div>
          <div className="flex flex-col w-full mb-4">
            <Input
              {...register('password')}
              label={t('common.fields.password')}
              placeholder={t('common.fields.passwordPlaceholder')}
              type="password"
              id="password"
              error={errors.password?.message}
            />
          </div>

          <div className="relative z-10 flex flex-col w-full mb-8">
            <Link to="/auth/forgot-password" className="font-bold text-primary">
              {t('auth.login.forgotPassword')}
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full p-2 bg-primary text-white rounded-lg h-12 cursor-pointer hover:bg-primary/90 transition-all duration-150 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            text={
              isSubmitting
                ? t('common.loading.signingIn')
                : t('common.buttons.signIn')
            }
          />
          <p className="relative z-10 text-sm text-gray-700 text-center font-medium">
            {t('auth.login.newToDebtbox')}{' '}
            <Link className="text-primary font-bold" to="/auth/sign-up">
              {t('common.buttons.signUp')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
