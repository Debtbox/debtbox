import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import Input from '@/components/shared/Input';
import IdIcon from '@/components/icons/IdIcon';
import Button from '@/components/shared/Button';
import DollarIcon from '@/components/icons/DollarIcon';
import CalendarIcon from '@/components/icons/CalendarIcon';
import { z } from 'zod';
import { useAddDebt, type AddDebtResponse } from '../../api/addDebt';
import { useUserStore } from '@/stores/UserStore';

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
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CustomerPurchaseFormData>({
    resolver: zodResolver(customerPurchaseSchema),
    mode: 'onChange',
    defaultValues: {
      customerId: '',
      amount: '',
      dueDate: '',
    },
  });

  const { mutate: addDebt, isPending } = useAddDebt({
    onSuccess: (data) => {
      toast.success(data.message);
      toast.success(data.data.message);
      onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Add debt error:', error);
      const errorMessage =
        error?.response?.data?.message || t('dashboard.debtAddFailed');
      toast.error(errorMessage);
      onError?.(error);
    },
  });

  const onSubmit = async (data: CustomerPurchaseFormData) => {
    const payload = {
      nationalId: data.customerId,
      iqamaId: data.customerId,
      businessId: selectedBusiness?.id.toString() as string,
      amount: parseFloat(data.amount),
      dueDate: data.dueDate,
    };
    addDebt(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
      <div className="flex-1">
        <h3 className="text-lg font-bold my-5">
          {t('dashboard.customer_details')}
        </h3>
        <div className="mb-4" />
        <Input
          {...register('customerId')}
          id="customer-id"
          type="text"
          label={t('dashboard.customer_id')}
          placeholder={t('dashboard.customer_id_placeholder')}
          labelClassName="mb-1!"
          className="ps-10"
          icon={<IdIcon />}
          error={errors.customerId?.message}
        />
        <h3 className="text-lg font-bold my-5">
          {t('dashboard.purchase_details')}
        </h3>
        <Input
          {...register('amount')}
          id="amount"
          type="text"
          label={t('dashboard.amount')}
          placeholder={t('dashboard.amount_placeholder')}
          labelClassName="mb-1!"
          className="ps-10"
          icon={<DollarIcon />}
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
            disabled={!isValid || isPending}
            isLoading={isPending}
          />
        </div>
      </div>
    </form>
  );
};

export default CustomerPurchaseForm;
