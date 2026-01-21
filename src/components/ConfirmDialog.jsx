import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Modal, Button } from "./ui";
import { cn } from "../utils/cn";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default", // default, danger, success
}) {
  const variants = {
    default: {
      icon: Info,
      color: "blue",
      confirmClass: "bg-accent hover:bg-accent-hover",
    },
    danger: {
      icon: AlertTriangle,
      color: "red",
      confirmClass: "bg-red-500 hover:bg-red-600",
    },
    success: {
      icon: CheckCircle2,
      color: "green",
      confirmClass: "bg-green-500 hover:bg-green-600",
    },
  };

  const config = variants[variant];
  const Icon = config.icon;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md" hideCloseButton>
      <div className="space-y-4">
        <div
          className={cn(
            "flex items-start gap-3 p-4 rounded-lg border",
            `bg-${config.color}-500/10 border-${config.color}-500/20`
          )}
        >
          <Icon className={`text-${config.color}-500 flex-shrink-0 mt-0.5`} size={20} />
          <p className="text-sm text-primary">{message}</p>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleConfirm} className={cn("flex-1", config.confirmClass)}>
            {confirmText}
          </Button>
          <Button onClick={onClose} variant="secondary" className="flex-1">
            {cancelText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}