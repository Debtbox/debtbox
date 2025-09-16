import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import Input from '@/components/shared/Input';
import { z } from 'zod';
import Button from '@/components/shared/Button';
import type { Dispatch, SetStateAction } from 'react';
import { useSignUp } from '../../api/signUp';
import { toast } from 'sonner';

type SignUpFormData = z.infer<ReturnType<typeof createSignUpSchema>>;

const createSignUpSchema = (t: (key: string) => string) =>
  z.object({
    nationalId: z
      .string()
      .min(1, t('common.validation.identificationNumberRequired'))
      .length(10, t('common.validation.identificationNumberLength'))
      .regex(/^[1-3]\d{9}$/, t('common.validation.identificationNumberFormat'))
      .refine((val) => {
        // Additional validation for Saudi NIC format
        const firstDigit = parseInt(val[0]);
        return [1, 2, 3].includes(firstDigit);
      }, t('common.validation.identificationNumberType')),
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

  const { mutate, isPending } = useSignUp({
    onSuccess: (response) => {
      console.log('Sign up successful:', response);
      toast.success(t('auth.signUp.accountAdded'));
      setActiveStep(1);
    },
    onError: (error) => {
      console.error('Sign up error:', error);
      // Extract error message from the API response
      const errorMessage =
        error?.error?.[0] || 'Sign up failed. Please try again.';
      toast.error(errorMessage);
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    mutate(data);
  };
  return (
    <div className="flex flex-col w-full">
      <h1 className="text-[28px] font-bold mb-4">{t('auth.signUp.title')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
        <div className="flex flex-col w-full mb-4">
          <Input
            {...register('nationalId')}
            label={t('common.fields.identificationNumber')}
            placeholder={t('common.fields.identificationNumberPlaceholder')}
            type="text"
            id="national-id"
            helperText={t('common.fields.identificationNumberHelper')}
            error={errors.nationalId?.message}
          />
        </div>
        <Button
          type="submit"
          className="w-full p-2 bg-primary text-white rounded-lg h-12 cursor-pointer hover:bg-primary/90 transition-all duration-150 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          text={t('common.buttons.signUp')}
          isLoading={isSubmitting || isPending}
        />
      </form>
    </div>
  );
};

export default SignUpForm;
