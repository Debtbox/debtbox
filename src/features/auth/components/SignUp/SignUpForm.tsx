import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import Input from '@/components/shared/Input';
import { z } from 'zod';
import Button from '@/components/shared/Button';
import type { Dispatch, SetStateAction } from 'react';

type SignUpFormData = z.infer<ReturnType<typeof createSignUpSchema>>;

// TODO: The validation will be changed when the backend is ready
const createSignUpSchema = (t: (key: string) => string) =>
  z.object({
    identificationNumber: z
      .string()
      .min(1, t('common.validation.identificationNumberRequired'))
      .min(10, t('common.validation.identificationNumberMinLength'))
      .max(20, t('common.validation.identificationNumberMaxLength')),
  });

const SignUpForm = ({
  setActiveStep,
}: {
  setActiveStep: Dispatch<SetStateAction<number>>;
}) => {
  const { t } = useTranslation();
  const signUpSchema = createSignUpSchema(t);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      console.log('Form data:', data);
      setActiveStep(1);
      // TODO: Implement actual sign up logic here
    } catch (error) {
      console.error('Sign up error:', error);
    }
  };
  return (
    <div className="flex flex-col w-full">
      <h1 className="text-[28px] font-bold mb-4">{t('auth.signUp.title')}</h1>
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
              ? t('common.loading.signingUp')
              : t('common.buttons.signUp')
          }
        />
      </form>
    </div>
  );
};

export default SignUpForm;
