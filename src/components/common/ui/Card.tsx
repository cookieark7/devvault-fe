"use client";

import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  noPadding?: boolean;
  variant?: "default" | "list-row";
}

export default function Card({
  children,
  className,
  onClick,
  noPadding = false,
  variant = "default",
}: CardProps) {
  const isInteractive = !!onClick;

  if (variant === "list-row") {
    return (
      <div
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 border-b border-border-base py-3 px-4 w-full",
          "hover:bg-bg-hover cursor-pointer transition-colors duration-100",
          className
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-bg-main border border-border-base rounded",
        !noPadding && "p-4",
        isInteractive &&
          "hover:shadow-notion-card hover:border-border-focus cursor-pointer transition-all duration-100",
        className
      )}
    >
      {children}
    </div>
  );
}
