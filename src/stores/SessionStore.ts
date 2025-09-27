import { create } from 'zustand';

interface SessionStore {
  isSessionExpiredModalOpen: boolean;
  showSessionExpiredModal: () => void;
  hideSessionExpiredModal: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  isSessionExpiredModalOpen: false,
  showSessionExpiredModal: () => set({ isSessionExpiredModalOpen: true }),
  hideSessionExpiredModal: () => set({ isSessionExpiredModalOpen: false }),
}));
