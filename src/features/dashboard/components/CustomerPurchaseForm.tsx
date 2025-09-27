import Input from '@/components/shared/Input';
import IdIcon from '@/components/icons/IdIcon';
import Button from '@/components/shared/Button';
import DollarIcon from '@/components/icons/DollarIcon';
import CalendarIcon from '@/components/icons/CalendarIcon';
import { useTranslation } from 'react-i18next';

const CustomerPurchaseForm = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <h3 className="text-lg font-bold my-5">{t('dashboard.customer_details')}</h3>
        <Input
          id="customer-id"
          type="text"
          label={t('dashboard.customer_id')}
          placeholder={t('dashboard.customer_id_placeholder')}
          labelClassName="mb-1!"
          className="ps-10"
          icon={<IdIcon />}
        />
        <h3 className="text-lg font-bold my-5">{t('dashboard.purchase_details')}</h3>
        <Input
          id="amount"
          type="text"
          label={t('dashboard.amount')}
          placeholder={t('dashboard.amount_placeholder')}
          labelClassName="mb-1!"
          className="ps-10"
          icon={<DollarIcon />}
        />
        <div className="mb-4" />
        <Input
          id="due-date"
          type="text"
          label={t('dashboard.due_date')}
          placeholder={t('dashboard.due_date_placeholder')}
          labelClassName="mb-1!"
          className="ps-10"
          icon={<CalendarIcon />}
        />
      </div>
      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <div className="text-sm text-gray-500 font-medium flex-1">{t('dashboard.step_1_of_3')}</div>
        <div className="flex items-center gap-2 flex-1">
          <Button
            disabled
            text={t('common.buttons.back')}
            onClick={() => {}}
            className="flex-1 p-2 h-12"
            variant="secondary"
          />
          <Button
            text={t('common.buttons.next')}
            onClick={() => {}}
            className="flex-1 p-2 h-12"
            variant="primary"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerPurchaseForm;
