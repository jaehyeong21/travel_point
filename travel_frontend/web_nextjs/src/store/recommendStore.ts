import { ThemeType } from '@/types/categoriy-types';
import { DestinationType } from '@/types/destination-types';
import { create } from 'zustand';

interface ThemeState {
  step: number;
  theme: ThemeType;
  areaName: string;
  movedPositions: DestinationType[];
  setStep: (step: number) => void;
  setTheme: (theme: ThemeType) => void;
  setAreaName: (areaName: string) => void;
  setMovedPositions: (positions: DestinationType[]) => void;
  resetState: () => void;
}

export const useRecommendStore = create<ThemeState>((set) => ({
  step: 0,
  theme: 'all',
  areaName: 'all',
  movedPositions: [],
  setStep: (step) => set({ step }),
  setTheme: (theme) => set({ theme }),
  setAreaName: (areaName) => set({ areaName }),
  setMovedPositions: (positions) => set({ movedPositions: positions }),
  resetState: () => set({ step: 0, theme: 'all', areaName: 'all', movedPositions: [] }),
}));