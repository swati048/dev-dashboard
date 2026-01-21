import { create } from "zustand";

export const useAppStore = create((set) => ({
  // THEME
  theme: "dark",
  setTheme: (theme) => set({ theme }),

  // MODAL SYSTEM (global)
  modal: null, // string like "settings", "profile", etc.
  openModal: (name) => set({ modal: name }),
  closeModal: () => set({ modal: null }),

  // NOTIFICATIONS
  toasts: [],
  addToast: (msg) =>
    set((state) => ({
      toasts: [...state.toasts, { id: Date.now(), msg }]
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    })),

  // USER SETTINGS
  settings: {
    focusMode: true,
  },
  updateSettings: (data) =>
    set((state) => ({ settings: { ...state.settings, ...data } })),
}));
