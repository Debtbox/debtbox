import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/lib/toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useUpdateIBAN } from '@/features/auth/api/updateIBAN';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { ChevronLeft, Landmark } from 'lucide-react';

const ibanSchema = z.object({
  iban: z
    .string()
    .min(15, 'IBAN must be at least 15 characters')
    .max(34, 'IBAN must not exceed 34 characters')
    .regex(/^[A-Z]{2}[0-9A-Z]+$/, 'Invalid IBAN format (e.g. SA0380000000608010167519)'),
  password: z.string().min(1, 'Password is required'),
});

type IBANFormValues = z.infer<typeof ibanSchema>;

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
    <form onSubmit={handleSubmit((v) => updateIBAN(v))} className="space-y-4">
      <Input
        id="iban"
        type="text"
        label={t('settings.iban.ibanLabel', 'New IBAN')}
        placeholder="SA0000000000000000000000"
        error={errors.iban?.message}
        {...register('iban')}
      />
      <Input
        id="password"
        type="password"
        label={t('settings.iban.passwordLabel', 'Current Password')}
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />
      <div className="pt-1">
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
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{t('profile.settings.title', 'Settings')}</span>
        </button>
        <span className="text-gray-300">/</span>
        <span className="font-bold text-gray-900">
          {t('profile.settings.accountSettings', 'Account Settings')}
        </span>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              {t('settings.iban.title', 'Bank Account (IBAN)')}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {t('settings.iban.description', 'Update the IBAN linked to your merchant account')}
            </p>
          </div>
        </div>
        <div className="p-6 max-w-md">
          <IBANForm />
        </div>
      </div>
    </div>
  );
};
