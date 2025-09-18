import type { UserDto } from '@/types/UserDto';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SignUpFormData {
  nationalId?: string;
  password?: string;
  confirmPassword?: string;
  selectedStores?: number[];
  iban?: string;
}

interface AuthFlowStore {
  activeStep: number;
  formData: SignUpFormData;
  setActiveStep: (step: number) => void;
  updateFormData: (data: Partial<SignUpFormData>) => void;
  resetFlow: () => void;
  setAccessToken: (token: string) => void;
  accessToken: string;
  user: UserDto;
  setUser: (user: UserDto) => void;
}

export const useAuthFlowStore = create<AuthFlowStore>()(
  persist(
    (set) => ({
      activeStep: 0,
      formData: {},
      setActiveStep: (step: number) => set({ activeStep: step }),
      updateFormData: (data: Partial<SignUpFormData>) =>
        set((state) => ({ formData: { ...state.formData, ...data } })),
      setAccessToken: (token: string) => set({ accessToken: token }),
      accessToken: '',
      user: {} as UserDto,
      setUser: (user: UserDto) => set({ user }),
      resetFlow: () =>
        set({
          activeStep: 0,
          formData: {},
          accessToken: '',
          user: {} as UserDto,
        }),
    }),
    {
      name: 'debtbox-auth-flow',
      partialize: (state) => ({
        activeStep: state.activeStep,
        formData: state.formData,
        accessToken: state.accessToken,
        user: state.user,
      }),
    },
  ),
);
