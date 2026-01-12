export type BusinessDto = {
  id: number;
  cr_number: string;
  business_name_ar: string;
  business_name_en: string;
  activity: string;
  city: string;
  payoutMethod: 'weekly' | 'monthly' | 'instant';
  status?: string;
  totalOverdueCustomers?: number;
  totalOverdueAmount?: number;
  totalOutstandingAmount?: number;
  totalPaidAmount?: number;
};
