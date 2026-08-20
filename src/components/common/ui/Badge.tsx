import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  variant?: "default" | "success" | "error" | "warning" | "info";
  size?: "sm" | "md";
  children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  default: "bg-bg-hover text-text-secondary",
  success: "bg-success/10 text-success",
  error: "bg-error/10 text-error",
  warning: "bg-warning/10 text-warning",
  info: "bg-accent/10 text-accent",
};

const sizeClasses: Record<string, string> = {
  sm: "text-xs px-2 py-0.5",
  md: "text-xs px-2.5 py-1",
};

export default function Badge({
  variant = "default",
  size = "sm",
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variantClasses[variant],
        sizeClasses[size]
      )}
    >
      {children}
    </span>
  );
}
