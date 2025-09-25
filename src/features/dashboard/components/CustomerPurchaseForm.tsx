import Input from '@/components/shared/Input';

const CustomerPurchaseForm = () => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold mb-5">Customer Details</h3>
      <Input id="customer-id" type="text" label="Customer ID" />
    </div>
  );
};

export default CustomerPurchaseForm;
