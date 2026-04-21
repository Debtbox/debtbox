import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/lib/toast';
import { useTranslation } from 'react-i18next';
import { useUpdateIBAN } from '@/features/auth/api/updateIBAN';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { CreditCard } from 'lucide-react';

const ibanSchema = z.object({
  iban: z
    .string()
    .min(15, 'IBAN must be at least 15 characters')
    .max(34, 'IBAN must not exceed 34 characters')
    .regex(/^[A-Z]{2}[0-9A-Z]+$/, 'Invalid IBAN format (e.g. SA0380000000608010167519)'),
  password: z.string().min(1, 'Password is required'),
});

type IBANFormValues = z.infer<typeof ibanSchema>;

const SettingSection = ({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
    <div className="flex items-start gap-4 p-6 border-b border-gray-100">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
        {icon}
      </div>
      <div>
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const IBANForm = () => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<IBANFormValues>({
    resolver: zodResolver(ibanSchema),
    mode: 'onChange',
  });

  const { mutate: updateIBAN, isPending } = useUpdateIBAN({
    onSuccess: (data) => {
      toast.success(data.message || t('settings.iban.success', 'IBAN updated successfully'));
      reset();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || t('settings.iban.error', 'Failed to update IBAN'));
    },
  });

  return (
    <form onSubmit={handleSubmit((v) => updateIBAN(v))} className="space-y-4 max-w-md">
      <div className="flex flex-col gap-1">
        <Input
          id="iban"
          type="text"
          label={t('settings.iban.ibanLabel', 'New IBAN')}
          placeholder="SA0000000000000000000000"
          error={errors.iban?.message}
          {...register('iban')}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Input
          id="password"
          type="password"
          label={t('settings.iban.passwordLabel', 'Current Password')}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>
      <div className="pt-2">
        <Button
          type="submit"
          text={t('settings.iban.submit', 'Update IBAN')}
          variant="primary"
          isLoading={isPending}
          disabled={!isValid}
          className="h-11 px-6"
        />
      </div>
    </form>
  );
};

export const Settings = () => {
  const { t } = useTranslation();

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">
          {t('settings.title', 'Settings')}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {t('settings.description', 'Manage your account settings')}
        </p>
      </div>

      <div className="space-y-4 max-w-2xl">
        <SettingSection
          icon={<CreditCard className="w-5 h-5" />}
          title={t('settings.iban.title', 'Bank Account (IBAN)')}
          description={t('settings.iban.description', 'Update the IBAN linked to your merchant account. Your current password is required to confirm the change.')}
        >
          <IBANForm />
        </SettingSection>
      </div>
    </section>
  );
};
