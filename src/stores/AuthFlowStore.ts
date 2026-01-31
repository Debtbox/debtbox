import type { BusinessDto } from '@/types/BusinessDto';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type BusinessWithOptionalIds = BusinessDto & {
  city_id?: string;
  activity_id?: string;
};

interface SignUpFormData {
  nationalId?: string;
  nafathState?: string;
  nafathRedirectUrl?: string;
  password?: string;
  confirmPassword?: string;
  selectedStores?: BusinessWithOptionalIds[];
  newBusiness?: {
    business_name_en: string;
    business_name_ar: string;
    cr_number: string;
    city_id?: string;
    activity_id?: string;
    // legacy (older persisted flow)
    city?: string;
    activity?: string;
    payoutMethod: 'weekly' | 'monthly' | 'instant';
  };
  storeFormStep?: 1 | 2;
  iban?: string;
}

interface AuthFlowStore {
  activeStep: number;
  formData: SignUpFormData;
  setActiveStep: (step: number) => void;
  updateFormData: (data: Partial<SignUpFormData>) => void;
  resetFlow: () => void;
}

export const useAuthFlowStore = create<AuthFlowStore>()(
  persist(
    (set) => ({
      activeStep: 0,
      formData: {},
      setActiveStep: (step: number) => set({ activeStep: step }),
      updateFormData: (data: Partial<SignUpFormData>) =>
        set((state) => ({ formData: { ...state.formData, ...data } })),
      resetFlow: () =>
        set({
          activeStep: 0,
          formData: {},
        }),
    }),
    {
      name: 'debtbox-auth-flow',
      partialize: (state) => ({
        activeStep: state.activeStep,
        formData: state.formData,
      }),
    },
  ),
);
