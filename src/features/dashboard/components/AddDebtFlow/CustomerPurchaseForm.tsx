import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import Input from '@/components/shared/Input';
import IdIcon from '@/components/icons/IdIcon';
import Button from '@/components/shared/Button';
import CalendarIcon from '@/components/icons/CalendarIcon';
import ButtonLoaderIcon from '@/components/icons/ButtonLoaderIcon';
import Toggle from '@/components/shared/Toggle';
import { z } from 'zod';
import { useAddDebt, type AddDebtResponse } from '../../api/addDebt';
import { useCheckCustomerOverdue } from '../../api/checkCustomerOverduo';
import { useUserStore } from '@/stores/UserStore';
import { BadgeInfo, SaudiRiyal } from 'lucide-react';

type CustomerPurchaseFormData = z.infer<
  ReturnType<typeof createCustomerPurchaseSchema>
>;

const createCustomerPurchaseSchema = (t: (key: string) => string) =>
  z.object({
    customerId: z
      .string()
      .min(1, t('common.validation.identificationNumberRequired'))
      .length(10, t('common.validation.identificationNumberLength'))
      .regex(/^[1-3]\d{9}$/, t('common.validation.identificationNumberFormat'))
      .refine((val) => {
        const firstDigit = parseInt(val[0]);
        return [1, 2, 3].includes(firstDigit);
      }, t('common.validation.identificationNumberType')),
    amount: z
      .string()
      .min(1, t('common.validation.amountRequired'))
      .regex(/^\d+(\.\d{1,2})?$/, t('common.validation.amountFormat')),
    dueDate: z
      .string()
      .min(1, t('common.validation.dueDateRequired'))
      .regex(/^\d{4}-\d{2}-\d{2}$/, t('common.validation.dateFormat')),
    title: z.string().min(1, t('common.validation.titleRequired')),
    createWithSanad: z.boolean(),
  });

interface CustomerPurchaseFormProps {
  onSuccess?: (data: AddDebtResponse) => void;
  onError?: (error: unknown) => void;
}

const CustomerPurchaseForm = ({
  onSuccess,
  onError,
}: CustomerPurchaseFormProps) => {
  const { t } = useTranslation();
  const { selectedBusiness } = useUserStore();
  const customerPurchaseSchema = createCustomerPurchaseSchema(t);

  const [isOverdueCheckLoading, setIsOverdueCheckLoading] = useState(false);
  const [isOverdue, setIsOverdue] = useState(false);
  const [isOverdueCheckComplete, setIsOverdueCheckComplete] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CustomerPurchaseFormData>({
    resolver: zodResolver(customerPurchaseSchema),
    mode: 'onChange',
    defaultValues: {
      customerId: '',
      amount: '',
      dueDate: '',
      title: '',
      createWithSanad: false,
    },
  });

  const customerId = watch('customerId');
  const createWithSanad = watch('createWithSanad');

  const { mutate: addDebt, isPending } = useAddDebt({
    onSuccess: (data) => {
      toast.success(data.message);
      onSuccess?.(data);
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || t('dashboard.debtAddFailed');
      toast.error(errorMessage);
      onError?.(error);
    },
  });

  const { mutate: checkCustomerOverdue } = useCheckCustomerOverdue({
    onSuccess: (data) => {
      setIsOverdueCheckLoading(false);
      setIsOverdueCheckComplete(true);
      setIsOverdue(data.data.isOverdue);
    },
    onError: () => {
      setIsOverdueCheckLoading(false);
      setIsOverdueCheckComplete(true);
      setIsOverdue(false);
    },
  });

  useEffect(() => {
    const isValidCustomerId =
      customerId &&
      customerId.length === 10 &&
      /^[1-3]\d{9}$/.test(customerId) &&
      [1, 2, 3].includes(parseInt(customerId[0]));

    if (isValidCustomerId) {
      setIsOverdueCheckLoading(true);
      setIsOverdueCheckComplete(false);
      setIsOverdue(false);

      checkCustomerOverdue({ customerId });
    } else {
      setIsOverdueCheckLoading(false);
      setIsOverdueCheckComplete(customerId === '');
      setIsOverdue(false);
    }
  }, [customerId, checkCustomerOverdue]);

  const onSubmit = async (data: CustomerPurchaseFormData) => {
    const payload = {
      nationalId: data.customerId,
      iqamaId: data.customerId,
      businessId: selectedBusiness?.id.toString() as string,
      amount: parseFloat(data.amount),
      dueDate: data.dueDate,
      title: data.title,
      createWithSanad: data.createWithSanad,
    };
    addDebt(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
      <div className="flex-1 animate-fade-in">
        <h3 className="text-lg font-bold my-5 animate-slide-down">
          {t('dashboard.customer_details')}
        </h3>
        <div className="mb-4" />
        <div>
          <Input
            {...register('customerId')}
            id="customer-id"
            type="text"
            label={t('dashboard.customer_id')}
            placeholder={t('dashboard.customer_id_placeholder')}
            labelClassName="mb-1!"
            className="ps-10"
            icon={
              isOverdueCheckLoading ? (
                <ButtonLoaderIcon color="#6B7280" />
              ) : (
                <IdIcon />
              )
            }
            error={errors.customerId?.message}
            disabled={isOverdueCheckLoading}
          />
          {isOverdue && (
            <div className="mt-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-2">
              {t('dashboard.customer_overdue_message')}
            </div>
          )}
        </div>
        <h3 className="text-lg font-bold my-5 animate-slide-down animation-delay-100">
          {t('dashboard.purchase_details')}
        </h3>
        <Input
          {...register('title')}
          id="title"
          type="text"
          label={t('dashboard.debt_title')}
          placeholder={t('dashboard.debt_title_placeholder')}
          labelClassName="mb-1!"
          className="ps-10"
          icon={<BadgeInfo className="w-5 h-5 text-gray-500" />}
          error={errors.title?.message}
        />
        <div className="mb-4" />
        <Input
          {...register('amount')}
          id="amount"
          type="text"
          label={t('dashboard.amount')}
          placeholder={t('dashboard.amount_placeholder')}
          labelClassName="mb-1!"
          className="ps-10"
          icon={<SaudiRiyal className="text-gray-500" />}
          error={errors.amount?.message}
        />
        <div className="mb-4" />
        <Input
          {...register('dueDate')}
          id="due-date"
          type="date"
          label={t('dashboard.due_date')}
          placeholder={t('dashboard.due_date_placeholder')}
          labelClassName="mb-1!"
          className="ps-10"
          icon={<CalendarIcon />}
          error={errors.dueDate?.message}
          min={(() => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow.toISOString().split('T')[0];
          })()}
        />
        <div className="mb-4" />
        <Toggle
          id="create-with-sanad"
          checked={createWithSanad}
          onChange={(checked) => setValue('createWithSanad', checked)}
          label={t('dashboard.createWithSanad')}
          description={t('dashboard.createWithSanadDescription')}
        />
      </div>
      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <div className="text-sm text-gray-500 font-medium flex-1">
          {t('dashboard.step_1_of_3')}
        </div>
        <div className="flex items-center gap-2 flex-1">
          <Button
            type="button"
            disabled
            text={t('common.buttons.back')}
            onClick={() => {}}
            className="flex-1 p-2 h-12"
            variant="secondary"
          />
          <Button
            type="submit"
            text={t('common.buttons.next')}
            className="flex-1 p-2 h-12"
            variant="primary"
            disabled={
              !isValid ||
              isPending ||
              isOverdueCheckLoading ||
              !isOverdueCheckComplete
            }
            isLoading={isPending}
          />
        </div>
      </div>
    </form>
  );
};

export default CustomerPurchaseForm;
