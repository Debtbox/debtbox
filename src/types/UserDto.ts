export type UserDto = {
  accessToken: string;
  businesses: {
    cr_number: string;
    business_name_ar: string;
    business_name_en: string;
  }[];
  commercial_register_number: string;
  dob: string;
  full_name_ar: string;
  full_name_en: string;
  id: number;
  iqama_id: string;
  national_id: string;
  nationality: string;
};
