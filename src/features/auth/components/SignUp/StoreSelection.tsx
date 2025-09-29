import { useEffect } from 'react';
import Button from '@/components/shared/Button';
import CheckBox from '@/components/shared/CheckBox';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthFlowStore } from '@/stores/AuthFlowStore';
import { useUserStore } from '@/stores/UserStore';
import { useRegisterBusinesses } from '../../api/registerBusinesses';
import { toast } from 'sonner';
import type { BusinessDto } from '@/types/UserDto';

const StoreSelection = () => {
  const { t, i18n } = useTranslation();
  const { setActiveStep, formData, updateFormData } = useAuthFlowStore();
  const { user } = useUserStore();

  const [selectedStores, setSelectedStores] = useState<BusinessDto[]>(
    formData.selectedStores || [],
  );
  const { mutate: registerBusinesses, isPending } = useRegisterBusinesses({
    onSuccess: () => {
      setActiveStep(3);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || 'Business registration failed',
      );
    },
  });

  useEffect(() => {
    if (formData.selectedStores) {
      setSelectedStores(formData.selectedStores);
    }
  }, [formData.selectedStores]);
  return (
    <div className="flex flex-col w-full">
      <h1 className="text-[28px] font-bold mb-2">
        {t('auth.signUp.selectStore')}
      </h1>
      <p className="text-sm text-[#828282] mb-4">
        {t('auth.signUp.selectStoreDescription')}
      </p>
      <div className="flex flex-col gap-2 w-full mb-8">
        {user?.businesses.map((business) => {
          const isChecked = selectedStores.includes(business);
          const handleToggle = () => {
            let newSelectedStores;
            if (isChecked) {
              newSelectedStores = selectedStores.filter(
                (store) => store.cr_number !== business.cr_number,
              );
            } else {
              newSelectedStores = [...selectedStores, business];
            }
            setSelectedStores(newSelectedStores);
            updateFormData({ selectedStores: newSelectedStores });
          };
          return (
            <div
              key={business.cr_number}
              className="flex justify-between items-center shadow-lg p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-150"
              onClick={handleToggle}
            >
              <label className="flex flex-col gap-1">
                <span className="font-semibold">
                  {i18n.language === 'ar'
                    ? business.business_name_ar
                    : business.business_name_en}
                </span>
                <span className="text-xs text-[#B0B0B0]">
                  {business.activity}
                </span>
                <span className="text-xs text-[#B0B0B0]">{business.city}</span>
              </label>
              <CheckBox checked={isChecked} onChange={handleToggle} />
            </div>
          );
        })}
      </div>
      <Button
        disabled={selectedStores.length === 0}
        onClick={() => {
          registerBusinesses({
            id: user?.id.toString() as string,
            accessToken: user?.accessToken as string,
            businesses: selectedStores.map((store) => ({
              cr_number: store.cr_number,
              business_name_en: store.business_name_en,
              business_name_ar: store.business_name_ar,
              activity: store.activity,
              city: store.city,
            })),
          });
        }}
        className="w-full p-2 bg-primary text-white rounded-lg h-12 cursor-pointer hover:bg-primary/90 transition-all duration-150 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        text={t('common.buttons.next')}
        isLoading={isPending}
      />
    </div>
  );
};

export default StoreSelection;
