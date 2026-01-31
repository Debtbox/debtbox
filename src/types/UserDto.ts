import type { BusinessDto } from '@/types/BusinessDto';

export type UserDto = {
  id: number;
  national_id: string;
  iqama_id: string;
  commercial_register_number: string;
  accessToken: string;
  full_name_ar: string;
  full_name_en: string;
  nationality: string;
  dob: string;
  businesses: BusinessDto[];
  appActor: 'CUSTOMER' | 'MERCHANT';
};
