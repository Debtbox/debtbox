import { useEffect } from 'react';
import Button from '@/components/shared/Button';
import CheckBox from '@/components/shared/CheckBox';
import Input from '@/components/shared/Input';
import DropdownFilter from '@/components/shared/DropdownFilter';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthFlowStore } from '@/stores/AuthFlowStore';
import { useUserStore } from '@/stores/UserStore';
import { useRegisterBusinesses } from '../../api/registerBusinesses';
import { toast } from 'sonner';
import type { BusinessDto } from '@/types/UserDto';
import type { DropdownOption } from '@/components/shared/DropdownFilter';
import { CITIES, CATEGORIES } from '../../data';

interface StoreSelectionProps {
  showExistingStores?: boolean;
  onShowAddFormChange?: (showAddForm: boolean) => void;
}

const StoreSelection = ({
  showExistingStores = true,
  onShowAddFormChange,
}: StoreSelectionProps) => {
  const { t, i18n } = useTranslation();
  const { setActiveStep, formData, updateFormData } = useAuthFlowStore();
  const { user } = useUserStore();

  const [selectedStores, setSelectedStores] = useState<BusinessDto[]>(
    formData.selectedStores || [],
  );

  // Show form by default if there are no stores
  const hasExistingStores =
    showExistingStores && user?.businesses && user.businesses.length > 0;
  const hasAnyStores = hasExistingStores || selectedStores.length > 0;
  const [showAddForm, setShowAddForm] = useState(!hasAnyStores);

  const [formStep, setFormStep] = useState<1 | 2>(1);
  const [newBusiness, setNewBusiness] = useState({
    business_name_en: '',
    business_name_ar: '',
    cr_number: '',
    city: '',
    activity: '',
    payoutMethod: 'weekly' as 'weekly' | 'monthly' | 'instant',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

  useEffect(() => {
    const hasStores = hasExistingStores || selectedStores.length > 0;
    if (!hasStores) {
      setShowAddForm(true);
    }
  }, [hasExistingStores, selectedStores.length]);

  useEffect(() => {
    if (onShowAddFormChange) {
      onShowAddFormChange(showAddForm);
    }
  }, [showAddForm, onShowAddFormChange]);

  useEffect(() => {
    if (!showAddForm) {
      setFormStep(1);
    }
  }, [showAddForm]);

  const getCityOptions = (): DropdownOption[] => {
    return CITIES.map((city) => ({
      value: i18n.language === 'ar' ? city.arabic : city.english,
      label: i18n.language === 'ar' ? city.arabic : city.english,
    }));
  };

  const getCategoryOptions = (): DropdownOption[] => {
    return CATEGORIES.map((category) => ({
      value: i18n.language === 'ar' ? category.arabic : category.english,
      label: i18n.language === 'ar' ? category.arabic : category.english,
    }));
  };

  const validateFormStep1 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!newBusiness.business_name_en.trim()) {
      errors.business_name_en =
        t('auth.signUp.errors.businessNameEnRequired') ||
        'Store name (EN) is required';
    }
    if (!newBusiness.business_name_ar.trim()) {
      errors.business_name_ar =
        t('auth.signUp.errors.businessNameArRequired') ||
        'Store name (AR) is required';
    }
    if (!newBusiness.cr_number.trim()) {
      errors.cr_number =
        t('auth.signUp.errors.crNumberRequired') || 'CR number is required';
    }
    if (!newBusiness.city) {
      errors.city = t('auth.signUp.errors.cityRequired') || 'City is required';
    }
    if (!newBusiness.activity) {
      errors.activity =
        t('auth.signUp.errors.activityRequired') || 'Store type is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateFormStep1()) {
      setFormStep(2);
      setFormErrors({});
    }
  };

  const handleBackStep = () => {
    setFormStep(1);
    setFormErrors({});
  };

  const handleAddBusiness = () => {
    const existingBusiness = selectedStores.find(
      (store) => store.cr_number === newBusiness.cr_number,
    );
    if (existingBusiness) {
      toast.error(
        t('auth.signUp.errors.duplicateCrNumber') ||
          'A business with this CR number already exists',
      );
      return;
    }

    const businessToAdd: BusinessDto & {
      payoutMethod?: 'weekly' | 'monthly' | 'instant';
    } = {
      id: user?.id as number,
      cr_number: newBusiness.cr_number,
      business_name_en: newBusiness.business_name_en,
      business_name_ar: newBusiness.business_name_ar,
      activity: newBusiness.activity,
      city: newBusiness.city,
      // status: 'pending',
      payoutMethod: newBusiness.payoutMethod,
    };

    const newSelectedStores = [...selectedStores, businessToAdd];
    setSelectedStores(newSelectedStores);
    updateFormData({ selectedStores: newSelectedStores });

    setNewBusiness({
      business_name_en: '',
      business_name_ar: '',
      cr_number: '',
      city: '',
      activity: '',
      payoutMethod: 'weekly',
    });
    setFormErrors({});
    setFormStep(1);

    setShowAddForm(false);
    toast.success(
      t('auth.signUp.businessAdded') || 'Business added successfully',
    );
  };

  const handleToggleExistingStore = (business: BusinessDto) => {
    const isChecked = selectedStores.some(
      (store) => store.cr_number === business.cr_number,
    );
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

  const handleRemoveManualStore = (crNumber: string) => {
    const newSelectedStores = selectedStores.filter(
      (store) => store.cr_number !== crNumber,
    );
    setSelectedStores(newSelectedStores);
    updateFormData({ selectedStores: newSelectedStores });
  };

  const allStores = [
    ...(showExistingStores && user?.businesses ? user.businesses : []),
    ...selectedStores.filter(
      (store) =>
        !user?.businesses?.some((b) => b.cr_number === store.cr_number),
    ),
  ];

  return (
    <div className="flex flex-col w-full">
      {!showAddForm && (
        <>
          <h1 className="text-[28px] font-bold mb-2">
            {t('auth.signUp.selectStore')}
          </h1>
          <p className="text-sm text-[#828282] mb-4">
            {t('auth.signUp.selectStoreDescription')}
          </p>
          <div className="flex flex-col gap-2 w-full mb-4">
            {allStores.map((business) => {
              const isChecked = selectedStores.some(
                (store) => store.cr_number === business.cr_number,
              );
              const isManualStore = !user?.businesses?.some(
                (b) => b.cr_number === business.cr_number,
              );

              return (
                <div
                  key={business.cr_number}
                  className="flex justify-between items-center shadow-lg p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-150"
                  onClick={() => handleToggleExistingStore(business)}
                >
                  <label className="flex flex-col gap-1 flex-1">
                    <span className="font-semibold">
                      {i18n.language === 'ar'
                        ? business.business_name_ar
                        : business.business_name_en}
                    </span>
                    <span className="text-xs text-[#B0B0B0]">
                      {business.activity}
                    </span>
                    <span className="text-xs text-[#B0B0B0]">
                      {business.city}
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    {isManualStore && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveManualStore(business.cr_number);
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                        aria-label="Remove business"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                    {!isManualStore && (
                      <CheckBox
                        checked={isChecked}
                        onChange={() => handleToggleExistingStore(business)}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {showAddForm && (
        <div className="rounded-lg p-4 mb-4 bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">
            {formStep === 1
              ? t('auth.signUp.addYourStore') || 'Add your Store'
              : t('auth.signUp.payoutMethodTitle') ||
                'When do you want to receive your money?'}
          </h2>

          {/* Step Indicator - Commented out for now */}
          {/* <div className="flex items-center gap-2 mb-6">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${formStep === 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
              1
            </div>
            <div className={`flex-1 h-1 ${formStep === 2 ? 'bg-primary' : 'bg-gray-200'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${formStep === 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
              2
            </div>
          </div> */}

          {formStep === 1 ? (
            <div className="flex flex-col gap-4">
              <Input
                type="text"
                id="business_name_en"
                label={t('auth.signUp.storeNameEn') || 'Store name (EN)'}
                placeholder={
                  t('auth.signUp.storeNameEnPlaceholder') ||
                  'e.g., Amana market'
                }
                value={newBusiness.business_name_en}
                onChange={(e) =>
                  setNewBusiness({
                    ...newBusiness,
                    business_name_en: e.target.value,
                  })
                }
                error={formErrors.business_name_en}
              />
              <Input
                type="text"
                id="business_name_ar"
                label={t('auth.signUp.storeNameAr') || 'Store name (AR)'}
                placeholder={
                  t('auth.signUp.storeNameArPlaceholder') ||
                  'مثال, ماركت الامانة'
                }
                value={newBusiness.business_name_ar}
                onChange={(e) =>
                  setNewBusiness({
                    ...newBusiness,
                    business_name_ar: e.target.value,
                  })
                }
                error={formErrors.business_name_ar}
              />
              <Input
                type="text"
                id="cr_number"
                label={t('auth.signUp.storeCrNumber') || 'Store CR number'}
                placeholder={
                  t('auth.signUp.storeCrNumberPlaceholder') ||
                  'e.g., 21650.453.0.'
                }
                value={newBusiness.cr_number}
                onChange={(e) =>
                  setNewBusiness({
                    ...newBusiness,
                    cr_number: e.target.value,
                  })
                }
                error={formErrors.cr_number}
              />
              <DropdownFilter
                options={getCityOptions()}
                value={newBusiness.city}
                onChange={(value) =>
                  setNewBusiness({ ...newBusiness, city: value })
                }
                placeholder={t('auth.signUp.cityPlaceholder') || 'e.g., Riyadh'}
                label={t('auth.signUp.city') || 'City'}
                error={formErrors.city}
              />
              <DropdownFilter
                options={getCategoryOptions()}
                value={newBusiness.activity}
                onChange={(value) =>
                  setNewBusiness({ ...newBusiness, activity: value })
                }
                placeholder={
                  t('auth.signUp.storeTypePlaceholder') || 'e.g., Supermarket'
                }
                label={t('auth.signUp.storeType') || 'Store Type'}
                error={formErrors.activity}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleNextStep}
                  className="flex-1 p-2 bg-primary text-white rounded-lg h-12 cursor-pointer hover:bg-primary/90 transition-all duration-150"
                  text={t('common.buttons.next') || 'Next'}
                />
                {hasAnyStores && (
                  <Button
                    onClick={() => {
                      setShowAddForm(false);
                      setFormStep(1);
                      setNewBusiness({
                        business_name_en: '',
                        business_name_ar: '',
                        cr_number: '',
                        city: '',
                        activity: '',
                        payoutMethod: 'weekly',
                      });
                      setFormErrors({});
                    }}
                    className="flex-1 p-2 border border-gray-300 text-gray-700 rounded-lg h-12 cursor-pointer hover:bg-gray-50 transition-all duration-150"
                    text={t('common.buttons.cancel') || 'Cancel'}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-[#828282] mb-4">
                {t('auth.signUp.payoutMethodDescription') ||
                  'Pick the collection method that best fits your business needs.'}
              </p>
              <div className="flex flex-col gap-2 w-full mb-4">
                {(['weekly', 'monthly', 'instant'] as const).map((method) => {
                  const isSelected = newBusiness.payoutMethod === method;
                  const handleToggle = () => {
                    setNewBusiness({ ...newBusiness, payoutMethod: method });
                  };

                  const getMethodTitle = () => {
                    if (method === 'weekly')
                      return t('auth.signUp.payoutWeekly') || 'Weekly Payout';
                    if (method === 'monthly')
                      return t('auth.signUp.payoutMonthly') || 'Monthly Payout';
                    return t('auth.signUp.payoutInstant') || 'Instant Payout';
                  };

                  const getMethodDescription = () => {
                    if (method === 'weekly')
                      return (
                        t('auth.signUp.payoutWeeklyDescription') ||
                        'Receive your money on a weekly basis.'
                      );
                    if (method === 'monthly')
                      return (
                        t('auth.signUp.payoutMonthlyDescription') ||
                        'Receive your money on a monthly basis.'
                      );
                    return (
                      t('auth.signUp.payoutInstantDescription') ||
                      'Receive your money immediately once the customer completes the payment. Please note that additional bank and payment processing fees apply and will be deducted automatically.'
                    );
                  };

                  return (
                    <div
                      key={method}
                      className="flex justify-between items-start shadow-lg p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-150"
                      onClick={handleToggle}
                    >
                      <label className="flex flex-col gap-1 flex-1 cursor-pointer">
                        <span className="font-semibold">
                          {getMethodTitle()}
                        </span>
                        <span className="text-xs text-[#B0B0B0]">
                          {getMethodDescription()}
                        </span>
                      </label>
                      <CheckBox checked={isSelected} onChange={handleToggle} />
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleBackStep}
                  className="flex-1 p-2 border border-gray-300 text-gray-700 rounded-lg h-12 cursor-pointer hover:bg-gray-50 transition-all duration-150"
                  text={t('common.buttons.back') || 'Back'}
                />
                <Button
                  onClick={handleAddBusiness}
                  className="flex-1 p-2 bg-primary text-white rounded-lg h-12 cursor-pointer hover:bg-primary/90 transition-all duration-150"
                  text={t('common.buttons.add') || 'Add'}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {!showAddForm && (
        <Button
          onClick={() => setShowAddForm(true)}
          className="mb-4 flex justify-center items-center shadow-lg p-2 rounded-lg cursor-pointer bg-white hover:bg-gray-100 transition-all duration-150"
          text={t('common.buttons.add') || 'Add'}
        />
      )}

      {!showAddForm && (
        <Button
          disabled={selectedStores.length === 0}
          onClick={() => {
            // Get payout method from first manually added store, or default to 'weekly'
            const storeWithPayout = selectedStores.find(
              (store) =>
                'payoutMethod' in store &&
                (
                  store as BusinessDto & {
                    payoutMethod?: 'weekly' | 'monthly' | 'instant';
                  }
                ).payoutMethod,
            ) as
              | (BusinessDto & {
                  payoutMethod?: 'weekly' | 'monthly' | 'instant';
                })
              | undefined;
            const payoutMethod = storeWithPayout?.payoutMethod || 'weekly';

            registerBusinesses({
              accessToken: user?.accessToken as string,
              businesses: selectedStores.map((store) => ({
                cr_number: store.cr_number,
                business_name_en: store.business_name_en,
                business_name_ar: store.business_name_ar,
                activity: store.activity,
                city: store.city,
              })),
              payoutMethod: payoutMethod as 'weekly' | 'monthly' | 'instant',
            });
          }}
          className="w-full p-2 bg-primary text-white rounded-lg h-12 cursor-pointer hover:bg-primary/90 transition-all duration-150 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          text={t('common.buttons.next')}
          isLoading={isPending}
        />
      )}
    </div>
  );
};

export default StoreSelection;
