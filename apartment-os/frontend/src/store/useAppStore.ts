import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  selectedPropertyId: string | null;
  setSelectedPropertyId: (id: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedPropertyId: null,
      setSelectedPropertyId: (id) => set({ selectedPropertyId: id }),
    }),
    {
      name: "app-storage",
    }
  )
);
