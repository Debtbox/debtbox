import type { BusinessDto } from '@/types/BusinessDto';

export type UserDto = {
  accessToken: string;
  businesses: BusinessDto[];
  commercial_register_number: string;
  dob: string;
  full_name_ar: string;
  full_name_en: string;
  id: number;
  iqama_id: string;
  national_id: string;
  nationality: string;
  appActor: 'CUSTOMER' | 'MERCHANT';
};
