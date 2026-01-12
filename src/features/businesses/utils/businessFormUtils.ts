import { CITIES, CATEGORIES } from '@/features/auth/data';
import type { DropdownOption } from '@/components/shared/DropdownFilter';

export const getCityOptions = (language: string): DropdownOption[] => {
  return CITIES.map((city) => ({
    value: language === 'ar' ? city.arabic : city.english,
    label: language === 'ar' ? city.arabic : city.english,
  }));
};

export const getCategoryOptions = (language: string): DropdownOption[] => {
  return CATEGORIES.map((category) => ({
    value: language === 'ar' ? category.arabic : category.english,
    label: language === 'ar' ? category.arabic : category.english,
  }));
};

export interface NewBusiness {
  business_name_en: string;
  business_name_ar: string;
  cr_number: string;
  city: string;
  activity: string;
  payoutMethod: 'weekly' | 'monthly' | 'instant';
}

export const validateBusinessForm = (
  business: NewBusiness,
  t: (key: string) => string,
  isEditMode = false,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!business.business_name_en.trim()) {
    errors.business_name_en =
      t('auth.signUp.errors.businessNameEnRequired') ||
      'Store name (EN) is required';
  }
  if (!business.business_name_ar.trim()) {
    errors.business_name_ar =
      t('auth.signUp.errors.businessNameArRequired') ||
      'Store name (AR) is required';
  }
  if (!isEditMode && !business.cr_number.trim()) {
    errors.cr_number =
      t('auth.signUp.errors.crNumberRequired') || 'CR number is required';
  }
  if (!business.city) {
    errors.city = t('auth.signUp.errors.cityRequired') || 'City is required';
  }
  if (!business.activity) {
    errors.activity =
      t('auth.signUp.errors.activityRequired') || 'Store type is required';
  }

  return errors;
};
