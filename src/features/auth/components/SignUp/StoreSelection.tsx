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
import type { BusinessDto } from '@/types/BusinessDto';
import type { DropdownOption } from '@/components/shared/DropdownFilter';
import { CITIES, CATEGORIES } from '../../data';
import DeleteIcon from '@/components/icons/DeleteIcon';

interface StoreSelectionProps {
  showExistingStores?: boolean;
  onShowAddFormChange?: (
    showAddForm: boolean,
    isFirstBusiness: boolean,
  ) => void;
}

type BusinessWithOptionalIds = BusinessDto & {
  city_id?: string;
  activity_id?: string;
};

type LocalizedOption = {
  id: number;
  ar: string;
  en: string;
  ur?: string;
  bn?: string;
};

type NewBusinessFormState = {
  business_name_en: string;
  business_name_ar: string;
  cr_number: string;
  city_id: string;
  activity_id: string;
  payoutMethod: 'weekly' | 'monthly' | 'instant';
};

type SignUpFormDataCompat = {
  selectedStores?: BusinessWithOptionalIds[];
  newBusiness?: Partial<NewBusinessFormState> & {
    // legacy (older persisted flow)
    city?: string;
    activity?: string;
  };
  storeFormStep?: 1 | 2;
};

type AuthFlowStoreCompat = {
  setActiveStep: (step: number) => void;
  formData: SignUpFormDataCompat;
  updateFormData: (data: Partial<SignUpFormDataCompat>) => void;
};

const StoreSelection = ({
  showExistingStores = true,
  onShowAddFormChange,
}: StoreSelectionProps) => {
  const { t, i18n } = useTranslation();
  const { setActiveStep, formData, updateFormData } =
    useAuthFlowStore() as unknown as AuthFlowStoreCompat;
  const { user } = useUserStore();

  const [selectedStores, setSelectedStores] = useState<BusinessWithOptionalIds[]>(
    formData.selectedStores || [],
  );

  // Show form by default if there are no stores
  const hasExistingStores =
    showExistingStores && user?.businesses && user.businesses.length > 0;
  const hasAnyStores = hasExistingStores || selectedStores.length > 0;
  const [showAddForm, setShowAddForm] = useState(!hasAnyStores);

  const [formStep, setFormStep] = useState<1 | 2>(formData.storeFormStep || 1);
  const [newBusiness, setNewBusiness] = useState<NewBusinessFormState>({
    business_name_en: formData.newBusiness?.business_name_en || '',
    business_name_ar: formData.newBusiness?.business_name_ar || '',
    cr_number: formData.newBusiness?.cr_number || '',
    city_id: formData.newBusiness?.city_id || '',
    activity_id: formData.newBusiness?.activity_id || '',
    payoutMethod:
      (formData.newBusiness?.payoutMethod as
        | 'weekly'
        | 'monthly'
        | 'instant') || 'weekly',
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

  const getLocalizedLabel = (item: LocalizedOption) => {
    if (i18n.language === 'ar') return item.ar;
    if (i18n.language === 'ur' && item.ur) return item.ur;
    if (i18n.language === 'bn' && item.bn) return item.bn;
    return item.en;
  };

  const findIdByAnyLabel = (
    list: LocalizedOption[],
    labelOrId: string | undefined,
  ): string | undefined => {
    if (!labelOrId) return undefined;

    // Already an id
    const asNumber = Number(labelOrId);
    if (!Number.isNaN(asNumber)) {
      const match = list.find((x) => x.id === asNumber);
      if (match) return String(match.id);
    }

    const normalized = labelOrId.trim();
    const match = list.find(
      (x) =>
        x.ar === normalized ||
        x.en === normalized ||
        (x.ur && x.ur === normalized) ||
        (x.bn && x.bn === normalized),
    );
    return match ? String(match.id) : undefined;
  };

  const getCityLabelById = (cityId: string) => {
    const match = (CITIES as LocalizedOption[]).find(
      (c) => String(c.id) === cityId,
    );
    return match ? getLocalizedLabel(match) : '';
  };

  const getCategoryLabelById = (categoryId: string) => {
    const match = (CATEGORIES as LocalizedOption[]).find(
      (c) => String(c.id) === categoryId,
    );
    return match ? getLocalizedLabel(match) : '';
  };

  useEffect(() => {
    if (formData.selectedStores) {
      setSelectedStores(formData.selectedStores);
    }
  }, [formData.selectedStores]);

  useEffect(() => {
    if (formData.newBusiness) {
      const city_id =
        formData.newBusiness.city_id ||
        findIdByAnyLabel(CITIES as LocalizedOption[], formData.newBusiness.city) ||
        '';
      const activity_id =
        formData.newBusiness.activity_id ||
        findIdByAnyLabel(
          CATEGORIES as LocalizedOption[],
          formData.newBusiness.activity,
        ) ||
        '';

      setNewBusiness({
        business_name_en: formData.newBusiness.business_name_en || '',
        business_name_ar: formData.newBusiness.business_name_ar || '',
        cr_number: formData.newBusiness.cr_number || '',
        city_id,
        activity_id,
        payoutMethod: formData.newBusiness.payoutMethod || 'weekly',
      });
    }
    if (formData.storeFormStep) {
      setFormStep(formData.storeFormStep);
    }
  }, [formData.newBusiness, formData.storeFormStep]);

  useEffect(() => {
    const hasStores = hasExistingStores || selectedStores.length > 0;
    if (!hasStores) {
      setShowAddForm(true);
    }
  }, [hasExistingStores, selectedStores.length]);

  useEffect(() => {
    if (onShowAddFormChange) {
      const isFirstBusiness = !hasExistingStores && selectedStores.length === 0;
      onShowAddFormChange(showAddForm, isFirstBusiness);
    }
  }, [
    showAddForm,
    onShowAddFormChange,
    hasExistingStores,
    selectedStores.length,
  ]);

  useEffect(() => {
    if (!showAddForm) {
      setFormStep(1);
    }
  }, [showAddForm]);

  const getCityOptions = (): DropdownOption[] => {
    return (CITIES as LocalizedOption[]).map((city) => ({
      value: String(city.id),
      label: getLocalizedLabel(city),
    }));
  };

  const getCategoryOptions = (): DropdownOption[] => {
    return (CATEGORIES as LocalizedOption[]).map((category) => ({
      value: String(category.id),
      label: getLocalizedLabel(category),
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
    if (!newBusiness.city_id) {
      errors.city = t('auth.signUp.errors.cityRequired') || 'City is required';
    }
    if (!newBusiness.activity_id) {
      errors.activity =
        t('auth.signUp.errors.activityRequired') || 'Store type is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateFormStep1()) {
      setFormStep(2);
      updateFormData({ storeFormStep: 2, newBusiness });
      setFormErrors({});
    }
  };

  const handleBackStep = () => {
    setFormStep(1);
    updateFormData({ storeFormStep: 1 });
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
      city_id?: string;
      activity_id?: string;
    } = {
      id: user?.id as number,
      cr_number: newBusiness.cr_number,
      business_name_en: newBusiness.business_name_en,
      business_name_ar: newBusiness.business_name_ar,
      activity: getCategoryLabelById(newBusiness.activity_id),
      city: getCityLabelById(newBusiness.city_id),
      // status: 'pending',
      payoutMethod: newBusiness.payoutMethod,
      city_id: newBusiness.city_id,
      activity_id: newBusiness.activity_id,
    };

    const newSelectedStores = [...selectedStores, businessToAdd];
    setSelectedStores(newSelectedStores);
    const resetBusiness = {
      business_name_en: '',
      business_name_ar: '',
      cr_number: '',
      city_id: '',
      activity_id: '',
      payoutMethod: 'weekly' as const,
    };
    setNewBusiness(resetBusiness);
    updateFormData({
      selectedStores: newSelectedStores,
      newBusiness: resetBusiness,
      storeFormStep: 1,
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
                        aria-label="Remove business"
                        className="cursor-pointer"
                      >
                        <DeleteIcon />
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
                onChange={(e) => {
                  const updated = {
                    ...newBusiness,
                    business_name_en: e.target.value,
                  };
                  setNewBusiness(updated);
                  updateFormData({ newBusiness: updated, storeFormStep: 1 });
                }}
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
                onChange={(e) => {
                  const updated = {
                    ...newBusiness,
                    business_name_ar: e.target.value,
                  };
                  setNewBusiness(updated);
                  updateFormData({ newBusiness: updated, storeFormStep: 1 });
                }}
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
                onChange={(e) => {
                  const updated = {
                    ...newBusiness,
                    cr_number: e.target.value,
                  };
                  setNewBusiness(updated);
                  updateFormData({ newBusiness: updated, storeFormStep: 1 });
                }}
                error={formErrors.cr_number}
              />
              <DropdownFilter
                options={getCityOptions()}
                value={newBusiness.city_id}
                onChange={(value) => {
                  const updated = { ...newBusiness, city_id: value };
                  setNewBusiness(updated);
                  updateFormData({ newBusiness: updated, storeFormStep: 1 });
                }}
                placeholder={t('auth.signUp.cityPlaceholder') || 'e.g., Riyadh'}
                label={t('auth.signUp.city') || 'City'}
                error={formErrors.city}
              />
              <DropdownFilter
                options={getCategoryOptions()}
                value={newBusiness.activity_id}
                onChange={(value) => {
                  const updated = { ...newBusiness, activity_id: value };
                  setNewBusiness(updated);
                  updateFormData({ newBusiness: updated, storeFormStep: 1 });
                }}
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
                      const resetBusiness = {
                        business_name_en: '',
                        business_name_ar: '',
                        cr_number: '',
                        city_id: '',
                        activity_id: '',
                        payoutMethod: 'weekly' as const,
                      };
                      setNewBusiness(resetBusiness);
                      updateFormData({
                        newBusiness: resetBusiness,
                        storeFormStep: 1,
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
                    const updated = { ...newBusiness, payoutMethod: method };
                    setNewBusiness(updated);
                    updateFormData({ newBusiness: updated, storeFormStep: 2 });
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
                  store as BusinessWithOptionalIds & {
                    payoutMethod?: 'weekly' | 'monthly' | 'instant';
                  }
                ).payoutMethod,
            ) as
              | (BusinessWithOptionalIds & {
                  payoutMethod?: 'weekly' | 'monthly' | 'instant';
                })
              | undefined;
            const payoutMethod = storeWithPayout?.payoutMethod || 'weekly';

            const businessesPayload = selectedStores.map((store) => {
              const city_id =
                store.city_id ||
                findIdByAnyLabel(CITIES as LocalizedOption[], store.city) ||
                '';
              const activity_id =
                store.activity_id ||
                findIdByAnyLabel(CATEGORIES as LocalizedOption[], store.activity) ||
                '';

              return {
                cr_number: store.cr_number,
                business_name_en: store.business_name_en,
                business_name_ar: store.business_name_ar,
                activity_id,
                city_id,
              };
            });

            const hasMissingIds = businessesPayload.some(
              (b) => !b.city_id || !b.activity_id,
            );
            if (hasMissingIds) {
              toast.error(
                t('auth.signUp.errors.cityOrActivityMissing') ||
                  'Please make sure each store has a city and a store type selected.',
              );
              return;
            }

            registerBusinesses({
              accessToken: user?.accessToken as string,
              businesses: businessesPayload,
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
