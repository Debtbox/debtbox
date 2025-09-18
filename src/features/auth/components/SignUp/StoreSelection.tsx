import { useEffect } from 'react';
import Button from '@/components/shared/Button';
import CheckBox from '@/components/shared/CheckBox';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthFlowStore } from '@/stores/AuthFlowStore';

const StoreSelection = () => {
  const { t } = useTranslation();
  const { setActiveStep, formData, updateFormData } = useAuthFlowStore();
  // TODO: Get stores from the backend
  const stores = [
    {
      id: 1,
      name: 'Store 1',
      address: '123 Main St, Anytown, USA',
    },
    {
      id: 2,
      name: 'Store 2',
      address: '456 Main St, Anytown, USA',
    },
    {
      id: 3,
      name: 'Store 3',
      address: '789 Main St, Anytown, USA',
    },
  ];
  const [selectedStores, setSelectedStores] = useState<number[]>(
    formData.selectedStores || [],
  );

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
        {stores.map((store) => {
          const isChecked = selectedStores.includes(store.id);
          const handleToggle = () => {
            let newSelectedStores;
            if (isChecked) {
              newSelectedStores = selectedStores.filter(
                (id) => id !== store.id,
              );
            } else {
              newSelectedStores = [...selectedStores, store.id];
            }
            setSelectedStores(newSelectedStores);
            updateFormData({ selectedStores: newSelectedStores });
          };
          return (
            <div
              key={store.id}
              className="flex justify-between items-center shadow-lg p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-150"
              onClick={handleToggle}
            >
              <label className="flex flex-col gap-1">
                <span className="font-semibold">{store.name}</span>
                <span className="text-xs text-[#B0B0B0]">{store.address}</span>
              </label>
              <CheckBox checked={isChecked} onChange={handleToggle} />
            </div>
          );
        })}
      </div>
      <Button
        disabled={selectedStores.length === 0}
        onClick={() => {
          console.log('Selected stores:', selectedStores);
          setActiveStep(3);
        }}
        className="w-full p-2 bg-primary text-white rounded-lg h-12 cursor-pointer hover:bg-primary/90 transition-all duration-150 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        text={t('common.buttons.next')}
      />
    </div>
  );
};

export default StoreSelection;
