import { cn } from "../../utils/cn";

export default function Card({ title, children, className = "" }) {
  return (
    <section
      className={cn(
        "bg-[#1e1e1e] p-6 rounded-xl border border-white/10 shadow-lg",
        className
      )}
      aria-labelledby={title ? `card-${title}` : undefined}
    >
      {title && (
        <h2
          id={`card-${title}`}
          className="text-lg font-semibold text-primary mb-4"
        >
          {title}
        </h2>
      )}

      <div className="text-primary">{children}</div>
    </section>
  );
}

