import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { useAuthFlowStore } from '@/stores/AuthFlowStore';
import { useUserStore } from '@/stores/UserStore';
import { useCreatePassword } from '../../api/createPassword';
import { toast } from 'sonner';

type FirstPasswordFormData = z.infer<
  ReturnType<typeof createFirstPasswordSchema>
>;

const createFirstPasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      password: z
        .string()
        .min(1, t('common.validation.passwordRequired'))
        .min(8, t('common.validation.passwordMinLength'))
        .regex(/[A-Z]/, t('common.validation.passwordUppercase'))
        .regex(/[a-z]/, t('common.validation.passwordLowercase'))
        .regex(/[0-9]/, t('common.validation.passwordNumber'))
        .regex(/[^A-Za-z0-9]/, t('common.validation.passwordSpecialChar')),
      confirmPassword: z
        .string()
        .min(1, t('common.validation.confirmPasswordRequired')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('common.validation.passwordMismatch'),
      path: ['confirmPassword'],
    });

const FirstPasswordForm = () => {
  const { t } = useTranslation();
  const { setActiveStep } = useAuthFlowStore();
  const { user } = useUserStore();
  const firstPasswordSchema = createFirstPasswordSchema(t);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FirstPasswordFormData>({
    resolver: zodResolver(firstPasswordSchema),
  });

  const { mutate, isPending } = useCreatePassword({
    onSuccess: () => {
      setActiveStep(2);
      toast.success(t('auth.signUp.passwordCreated'));
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'First password error');
    },
  });

  const onSubmit = async (data: FirstPasswordFormData) => {
    mutate({
      id: user?.id.toString() as string,
      accessToken: user?.accessToken as string,
      appActor: 'MERCHANT',
      password: data.password,
    });
  };
  return (
    <div className="flex flex-col w-full">
      <h1 className="text-[28px] font-bold mb-4">
        {t('auth.signUp.createPassword')}
      </h1>
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
          className="w-full p-2 bg-primary text-white rounded-lg h-12 cursor-pointer hover:bg-primary/90 transition-all duration-150 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          text={t('common.buttons.next')}
          isLoading={isSubmitting || isPending}
        />
      </form>
    </div>
  );
};

export default FirstPasswordForm;
