import { cn } from "@/lib/utils/cn";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-3 h-3",    // 12px
  md: "w-4 h-4",    // 16px
  lg: "w-5 h-5",    // 20px
};

export default function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-border-base border-t-text-secondary",
        sizeMap[size],
        className
      )}
    />
  );
}
