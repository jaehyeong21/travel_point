import { create } from 'zustand';

interface AuthState {
  isRegister: boolean;
  toggleForm: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isRegister: false,
  toggleForm: () => set((state) => ({ isRegister: !state.isRegister })),
}));
