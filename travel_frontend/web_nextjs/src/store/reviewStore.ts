import { create } from "zustand";

interface FilterState {
  filter: "latest" | "rate-desc" | "rate-asc" | "oldest";
  setFilter: (filter: "latest" | "rate-desc" | "rate-asc" | "oldest") => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  filter: "latest",
  setFilter: (filter) => set({ filter }),
}));
