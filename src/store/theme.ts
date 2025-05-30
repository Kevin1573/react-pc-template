import { create } from "zustand";

interface ThemeStore {
  isDark: string;
  updateTheme: (isDark: string) => void;
}

export const useThemeStore = create<ThemeStore>(set => ({
  isDark: localStorage.getItem("isDark") || "light",
  updateTheme: (isDark: string) => {
    set({ isDark });
  },
}));
