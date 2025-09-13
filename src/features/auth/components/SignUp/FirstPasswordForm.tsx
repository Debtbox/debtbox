import type { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';

type FirstPasswordFormData = z.infer<
  ReturnType<typeof createFirstPasswordSchema>
>;

// TODO: The validation will be changed when the backend is ready
const createFirstPasswordSchema = (t: (key: string) => string) =>
  z.object({
    password: z
      .string()
      .min(1, t('common.validation.passwordRequired'))
      .min(6, t('common.validation.passwordMinLength')),
    confirmPassword: z
      .string()
      .min(1, t('common.validation.confirmPasswordRequired'))
      .min(6, t('common.validation.confirmPasswordMinLength')),
  });

const FirstPasswordForm = ({
  setActiveStep,
}: {
  setActiveStep: Dispatch<SetStateAction<number>>;
}) => {
  const { t } = useTranslation();
  const firstPasswordSchema = createFirstPasswordSchema(t);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FirstPasswordFormData>({
    resolver: zodResolver(firstPasswordSchema),
  });

  const onSubmit = async (data: FirstPasswordFormData) => {
    try {
      console.log('Form data:', data);
      setActiveStep(2);
    } catch (error) {
      console.error('First password error:', error);
    }
  };
  return (
    <div className="flex flex-col w-full">
      <h1 className="text-[28px] font-bold mb-4">{t('auth.signUp.createPassword')}</h1>
      <p className="text-sm text-gray-700 mb-4">
        {t('auth.signUp.passwordDescription')}
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
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
        <div className="flex flex-col w-full mb-8">
          <Input
            {...register('confirmPassword')}
            label={t('common.fields.confirmPassword')}
            placeholder={t('common.fields.confirmPasswordPlaceholder')}
            type="password"
            id="confirm-password"
            error={errors.confirmPassword?.message}
          />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full p-2 bg-primary text-white rounded-lg h-12 cursor-pointer hover:bg-primary/90 transition-all duration-150 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          text={isSubmitting ? t('common.loading.creatingPassword') : t('common.buttons.next')}
        />
      </form>
    </div>
  );
};

export default FirstPasswordForm;
