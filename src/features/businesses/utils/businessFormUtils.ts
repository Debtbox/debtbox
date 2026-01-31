import { CITIES, CATEGORIES } from '@/features/auth/data';
import type { DropdownOption } from '@/components/shared/DropdownFilter';

type LocalizedOption = {
  id: number;
  ar: string;
  en: string;
  ur?: string;
  bn?: string;
};

const getLocalizedLabel = (item: LocalizedOption, language: string) => {
  if (language === 'ar') return item.ar;
  if (language === 'ur' && item.ur) return item.ur;
  if (language === 'bn' && item.bn) return item.bn;
  return item.en;
};

const findIdByAnyLabel = (list: LocalizedOption[], labelOrId: string) => {
  const trimmed = labelOrId.trim();

  const asNumber = Number(trimmed);
  if (!Number.isNaN(asNumber)) {
    const byId = list.find((x) => x.id === asNumber);
    if (byId) return String(byId.id);
  }

  const match = list.find(
    (x) =>
      x.ar === trimmed ||
      x.en === trimmed ||
      (x.ur && x.ur === trimmed) ||
      (x.bn && x.bn === trimmed),
  );
  return match ? String(match.id) : '';
};

export const getCityOptions = (language: string): DropdownOption[] => {
  return (CITIES as LocalizedOption[]).map((city) => ({
    value: String(city.id),
    label: getLocalizedLabel(city, language),
  }));
};

export const getCategoryOptions = (language: string): DropdownOption[] => {
  return (CATEGORIES as LocalizedOption[]).map((category) => ({
    value: String(category.id),
    label: getLocalizedLabel(category, language),
  }));
};

export const resolveCityId = (valueOrLabel: string) => {
  if (!valueOrLabel) return '';
  return findIdByAnyLabel(CITIES as LocalizedOption[], valueOrLabel);
};

export const resolveCategoryId = (valueOrLabel: string) => {
  if (!valueOrLabel) return '';
  return findIdByAnyLabel(CATEGORIES as LocalizedOption[], valueOrLabel);
};

export const getCityLabelFromValue = (valueOrLabel: string, language: string) => {
  if (!valueOrLabel) return '';
  const id = resolveCityId(valueOrLabel);
  if (!id) return valueOrLabel;
  const match = (CITIES as LocalizedOption[]).find((c) => String(c.id) === id);
  return match ? getLocalizedLabel(match, language) : valueOrLabel;
};

export const getCategoryLabelFromValue = (
  valueOrLabel: string,
  language: string,
) => {
  if (!valueOrLabel) return '';
  const id = resolveCategoryId(valueOrLabel);
  if (!id) return valueOrLabel;
  const match = (CATEGORIES as LocalizedOption[]).find(
    (c) => String(c.id) === id,
  );
  return match ? getLocalizedLabel(match, language) : valueOrLabel;
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
