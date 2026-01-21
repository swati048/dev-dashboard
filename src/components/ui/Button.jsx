import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export default function Button({
  children,
  variant = "primary", // primary | secondary | ghost
  size = "md", // sm | md | lg
  className = "",
  as: Component = "button",
  ...props
}) {
  const base = "inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const sizes = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base",
  };
  const variants = {
    primary: "bg-[#0078d4] hover:bg-[#006ac1] text-white shadow-sm",
    secondary: "bg-[#2d2d2d] hover:bg-[#373737] text-white border",
    ghost: "bg-transparent hover:bg-white/20 text-white",
  };

  const Comp = motion[Component] || motion.button;

  return (
    <Comp
      className={cn(base, sizes[size], variants[variant], className)}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </Comp>
  );
}
