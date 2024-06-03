import { DestinationType } from "@/types/destination-types";
import { create } from "zustand";

interface RecommendState {
  movedPositions: DestinationType[];
  setMovedPositions: (positions: DestinationType[]) => void;
}

export const useRecommendStore = create<RecommendState>((set) => ({
  movedPositions: [],
  setMovedPositions: (positions) => set({ movedPositions: positions }),
}));
