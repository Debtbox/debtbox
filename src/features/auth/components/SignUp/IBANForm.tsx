import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import Input from '@/components/shared/Input';
import { z } from 'zod';
import Button from '@/components/shared/Button';
import { useAuthFlowStore } from '@/stores/AuthFlowStore';
import {
  validateIBAN,
  formatIBAN,
  getCountryName,
} from '@/utils/ibanValidation';
import { toast } from 'sonner';
import { useRegisterIBAN } from '../../api/registerIBAN';

type IBANFormData = z.infer<ReturnType<typeof createIBANSchema>>;

const createIBANSchema = (t: (key: string) => string) =>
  z.object({
    iban: z
      .string()
      .min(1, t('common.validation.ibanRequired'))
      .refine(
        (value) => {
          const validation = validateIBAN(value);
          return validation.isValid;
        },
        {
          message: t('common.validation.ibanInvalid'),
        },
      ),
  });

const IBANForm = () => {
  const { t } = useTranslation();
  const { setActiveStep, user } = useAuthFlowStore();
  const ibanSchema = createIBANSchema(t);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<IBANFormData>({
    resolver: zodResolver(ibanSchema),
  });

  const ibanValue = watch('iban');

  const { mutate, isPending } = useRegisterIBAN({
    onSuccess: () => {
      toast.success(t('auth.signUp.ibanAdded'));
      setActiveStep(4);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'IBAN error');
    },
  });

  const handleIbanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatIBAN(value);
    setValue('iban', formattedValue);
  };

  const onSubmit = async (data: IBANFormData) => {
    mutate({
      id: user.id.toString(),
      accessToken: user.accessToken,
      iban: data.iban.replace(/\s/g, ''),
    });
  };

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-[28px] font-bold mb-2">
        {t('auth.signUp.enterIBAN')}
      </h1>
      <p className="text-sm text-[#828282] mb-4">
        {t('auth.signUp.ibanDescription')}
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
        <div className="flex flex-col w-full mb-4">
          <Input
            {...register('iban')}
            onChange={handleIbanChange}
            label={t('common.fields.iban')}
            placeholder={t('common.fields.ibanPlaceholder')}
            type="text"
            id="iban"
            error={errors.iban?.message}
            helperText={
              ibanValue ? getCountryName(ibanValue.substring(0, 2)) : undefined
            }
          />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting || isPending}
          className="w-full p-2 bg-primary text-white rounded-lg h-12 cursor-pointer hover:bg-primary/90 transition-all duration-150 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          text={t('common.buttons.submit')}
          isLoading={isSubmitting || isPending}
        />
      </form>
    </div>
  );
};

export default IBANForm;
