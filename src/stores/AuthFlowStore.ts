import type { BusinessDto } from '@/types/UserDto';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SignUpFormData {
  nationalId?: string;
  password?: string;
  confirmPassword?: string;
  selectedStores?: BusinessDto[];
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