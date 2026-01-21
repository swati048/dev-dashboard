import { useToastStore } from "../store/useToastStore";

export const toast = {
  success(message, duration = 2000) {
    useToastStore.getState().addToast({ type: "success", message, duration });
  },

  error(message, duration = 2000) {
    useToastStore.getState().addToast({ type: "error", message, duration });
  },

  warning(message, duration = 2000) {
    useToastStore.getState().addToast({ type: "warning", message, duration });
  },

  message(message, duration = 2000) {
    useToastStore.getState().addToast({ type: "default", message, duration });
  },
};
