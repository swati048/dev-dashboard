import { useToastStore } from "../store/useToastStore";
import { useEffect } from "react";

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  useEffect(() => {
    if (toasts.length > 0) {
      const timers = toasts.map((toast) =>
        setTimeout(() => removeToast(toast.id), toast.duration || 3000)
      );

      return () => timers.forEach((t) => clearTimeout(t));
    }
  }, [toasts, removeToast]);

  return (
    <div className="fixed bottom-6 right-6 space-y-3 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-md shadow-lg border text-sm font-medium backdrop-blur-sm bg-opacity-90 transition-all
            ${
              toast.type === "success"
                ? "bg-green-600 border-green-400 text-white"
                : toast.type === "error"
                ? "bg-red-600 border-red-400 text-white"
                : toast.type === "warning"
                ? "bg-yellow-600 border-yellow-400 text-white"
                : "bg-gray-700 border-gray-500 text-white"
            }
          `}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
