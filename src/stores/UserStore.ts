import type { BusinessDto } from '@/types/BusinessDto';
import type { UserDto } from '@/types/UserDto';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
  user: UserDto | null;
  accessToken: string;
  isAuthenticated: boolean;
  setUser: (user: UserDto) => void;
  setAccessToken: (token: string) => void;
  clearUser: () => void;
  updateUser: (updates: Partial<UserDto>) => void;
  selectedBusiness: BusinessDto | null;
  setSelectedBusiness: (business: BusinessDto) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: '',
      isAuthenticated: false,
      selectedBusiness: null,
      setSelectedBusiness: (business: BusinessDto) =>
        set({ selectedBusiness: business }),
      setUser: (user: UserDto) =>
        set({
          user,
          isAuthenticated: true,
          accessToken: user.accessToken,
        }),
      setAccessToken: (token: string) =>
        set({
          accessToken: token,
          isAuthenticated: !!token,
        }),
      clearUser: () =>
        set({
          user: null,
          accessToken: '',
          isAuthenticated: false,
        }),
      updateUser: (updates: Partial<UserDto>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'debtbox-user-store',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        selectedBusiness: state.selectedBusiness,
      }),
    },
  ),
);
