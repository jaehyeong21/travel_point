import { ThemeType } from '@/types/categoriy-types';
import { create } from 'zustand';


interface ThemeState {
  selectedTheme: ThemeType;
  setSelectedTheme: (theme: ThemeType) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  selectedTheme: 'all',
  setSelectedTheme: (theme) => set({ selectedTheme: theme }),
}));