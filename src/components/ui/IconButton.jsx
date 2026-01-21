import { cn } from "../../utils/cn";

export default function IconButton({ children, className = "", title, ...props }) {
  return (
    <button
      aria-label={title}
      title={title}
      className={cn(
        "inline-flex items-center justify-center rounded-full p-2 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
