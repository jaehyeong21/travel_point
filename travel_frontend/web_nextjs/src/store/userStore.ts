// stores/userStore.ts
import { User } from "@/types/user-type";
import { create } from "zustand";

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  updateUserImage: (userImgUrl: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUserImage: (userImgUrl) =>
    set((state) =>
      state.user ? { user: { ...state.user, userImgUrl } } : state
    ),
  clearUser: () => set({ user: null }),
}));
