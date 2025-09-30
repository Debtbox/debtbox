import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';

type ForgotPasswordFormData = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;

// TODO: The validation will be changed when the backend is ready
const createForgotPasswordSchema = (t: (key: string) => string) =>
  z.object({
    identificationNumber: z
      .string()
      .min(1, t('common.validation.identificationNumberRequired'))
      .min(10, t('common.validation.identificationNumberMinLength'))
      .max(20, t('common.validation.identificationNumberMaxLength')),
  });

const ForgotPasswordForm = () => {
  const { t } = useTranslation();
  const forgotPasswordSchema = createForgotPasswordSchema(t);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      if (import.meta.env.VITE_ENV === 'development') {
        console.log('Form data:', data);
      }
      // TODO: Implement actual forgot password logic here
    } catch (error) {
      console.error('Forgot password error:', error);
    }
  };
  return (
    <div className="flex flex-col w-full">
      <h1 className="text-[28px] font-bold mb-4">
        {t('auth.forgotPassword.title')}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
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
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full p-2 bg-primary text-white rounded-lg h-12 cursor-pointer hover:bg-primary/90 transition-all duration-150 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          text={
            isSubmitting
              ? t('common.loading.sending')
              : t('common.buttons.next')
          }
        />
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
