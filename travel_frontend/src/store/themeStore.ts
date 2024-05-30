import { themeCategories } from '@/types/destination-fetch-props';
import { create } from 'zustand';

export type Theme = keyof typeof themeCategories;

interface ThemeState {
  selectedTheme: Theme;
  setSelectedTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  selectedTheme: 'all',
  setSelectedTheme: (theme) => set({ selectedTheme: theme }),
}));