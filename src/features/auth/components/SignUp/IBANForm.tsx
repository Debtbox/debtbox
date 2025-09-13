import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import Input from '@/components/shared/Input';
import { z } from 'zod';
import Button from '@/components/shared/Button';
import type { Dispatch, SetStateAction } from 'react';

type IBANFormData = z.infer<ReturnType<typeof createIBANSchema>>;

// TODO: The validation will be changed when the backend is ready
const createIBANSchema = (t: (key: string) => string) =>
  z.object({
    iban: z
      .string()
      .min(1, t('common.validation.ibanRequired'))
      .min(10, t('common.validation.ibanMinLength'))
      .max(20, t('common.validation.ibanMaxLength')),
  });

const IBANForm = ({
  setActiveStep,
}: {
  setActiveStep: Dispatch<SetStateAction<number>>;
}) => {
  const { t } = useTranslation();
  const ibanSchema = createIBANSchema(t);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IBANFormData>({
    resolver: zodResolver(ibanSchema),
  });

  const onSubmit = async (data: IBANFormData) => {
    try {
      console.log('Form data:', data);
      setActiveStep(4);
      // TODO: Implement actual IBAN logic here
    } catch (error) {
      console.error('IBAN error:', error);
    }
  };
  return (
    <div className="flex flex-col w-full">
      <h1 className="text-[28px] font-bold mb-2">{t('auth.signUp.enterIBAN')}</h1>
      <p className="text-sm text-[#828282] mb-4">
        {t('auth.signUp.ibanDescription')}
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
        <div className="flex flex-col w-full mb-4">
          <Input
            {...register('iban')}
            label={t('common.fields.iban')}
            placeholder={t('common.fields.ibanPlaceholder')}
            type="text"
            id="iban"
            error={errors.iban?.message}
          />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full p-2 bg-primary text-white rounded-lg h-12 cursor-pointer hover:bg-primary/90 transition-all duration-150 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          text={isSubmitting ? t('common.loading.submitting') : t('common.buttons.submit')}
        />
      </form>
    </div>
  );
};

export default IBANForm;
