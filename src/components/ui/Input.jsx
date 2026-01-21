import { cn } from "../../utils/cn";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({ id, label, error, type = "text", className = "", ...props }) {
  const isPassword = type === "password";
  const [show, setShow] = useState(false);

  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label htmlFor={id} className="text-sm text-gray-500 font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={inputType}
          className={cn(
            "w-full px-3 py-2 pr-10 rounded-md bg-surface border border-app text-primary placeholder-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            error && "border-rose-500"
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-accent transition-colors"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      
      {error && <div className="text-xs text-rose-400">{error}</div>}
    </div>
  );
}
