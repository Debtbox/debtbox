export type BusinessDto = {
  id: number;
  cr_number: string;
  business_name_ar: string;
  business_name_en: string;
  activity: string;
  city: string;
  status?: string;
};

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
