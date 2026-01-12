import Button from '@/components/shared/Button';
import DropdownFilter from '@/components/shared/DropdownFilter';
import Input from '@/components/shared/Input';
import { useTranslation } from 'react-i18next';
import type { NewBusiness } from '../utils/businessFormUtils';
import { getCityOptions, getCategoryOptions } from '../utils/businessFormUtils';

interface BusinessFormProps {
  newBusiness: NewBusiness;
  setNewBusiness: (updates: Partial<NewBusiness>) => void;
  formErrors: Record<string, string>;
  language: string;
  handleNextStep: () => void;
  handleClose: () => void;
  isEditMode?: boolean;
  isLoading?: boolean;
}

const BusinessForm = ({
  newBusiness,
  setNewBusiness,
  formErrors,
  language,
  handleNextStep,
  handleClose,
  isEditMode = false,
  isLoading = false,
}: BusinessFormProps) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="animate-fade-in">
        <h2 className="text-black text-2xl font-bold pt-8 pb-3 animate-slide-down">
          {isEditMode
            ? t('businesses.editBusiness') || 'Edit your store'
            : t('auth.signUp.addYourStore') || 'Add your store'}
        </h2>
        <p className="text-[#828282] text-sm mb-12 animate-slide-down animation-delay-100">
          {isEditMode
            ? t('businesses.editBusinessDescription') ||
              'Update your store information below.'
            : t('auth.signUp.addYourStoreDescription') ||
              'To get started, please provide the necessary details to add your store to our platform.'}
        </p>
      </div>
      <div className="flex flex-col gap-4 animate-fade-in animation-delay-200">
        <div>
          <Input
            type="text"
            id="business_name_en"
            label={t('auth.signUp.storeNameEn') || 'Store name (EN)'}
            placeholder={
              t('auth.signUp.storeNameEnPlaceholder') || 'e.g., Amana market'
            }
            value={newBusiness.business_name_en}
            onChange={(e) => {
              setNewBusiness({ business_name_en: e.target.value });
            }}
            error={formErrors.business_name_en}
          />
        </div>

        <div>
          <Input
            type="text"
            id="business_name_ar"
            label={t('auth.signUp.storeNameAr') || 'Store name (AR)'}
            placeholder={
              t('auth.signUp.storeNameArPlaceholder') || 'مثال, ماركت الامانة'
            }
            value={newBusiness.business_name_ar}
            onChange={(e) => {
              setNewBusiness({ business_name_ar: e.target.value });
            }}
            error={formErrors.business_name_ar}
          />
        </div>
        {!isEditMode && (
          <div>
            <Input
              type="text"
              id="cr_number"
              label={t('auth.signUp.storeCrNumber') || 'Store CR number'}
              placeholder={
                t('auth.signUp.storeCrNumberPlaceholder') || 'e.g., 21650.453.0.'
              }
              value={newBusiness.cr_number}
              onChange={(e) => {
                setNewBusiness({ cr_number: e.target.value });
              }}
              error={formErrors.cr_number}
            />
          </div>
        )}
        <div>
          <DropdownFilter
            options={getCityOptions(language)}
            value={newBusiness.city}
            onChange={(value) => {
              setNewBusiness({ city: value });
            }}
            placeholder={t('auth.signUp.cityPlaceholder') || 'e.g., Riyadh'}
            label={t('auth.signUp.city') || 'City'}
            error={formErrors.city}
          />
        </div>
        <div>
          <DropdownFilter
            options={getCategoryOptions(language)}
            value={newBusiness.activity}
            onChange={(value) => {
              setNewBusiness({ activity: value });
            }}
            placeholder={
              t('auth.signUp.storeTypePlaceholder') || 'e.g., Supermarket'
            }
            label={t('auth.signUp.storeType') || 'Store Type'}
            error={formErrors.activity}
          />
        </div>
      </div>
      <div className="flex gap-2 mt-auto pt-4 animate-fade-in animation-delay-300">
        <Button
          onClick={handleClose}
          className="flex-1 h-12"
          text={t('common.buttons.cancel') || 'Cancel'}
          variant="secondary"
        />
        {isEditMode ? (
          <Button
            onClick={handleNextStep}
            className="flex-1 h-12"
            variant="primary"
            text={t('common.buttons.save') || 'Save'}
            isLoading={isLoading}
          />
        ) : (
          <Button
            onClick={handleNextStep}
            className="flex-1 h-12"
            variant="primary"
            text={t('common.buttons.next') || 'Next'}
          />
        )}
      </div>
    </>
  );
};

export default BusinessForm;
