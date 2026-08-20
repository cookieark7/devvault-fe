"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import Spinner from "./Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover font-medium",
  secondary:
    "bg-bg-subtle text-text-primary border border-border-base hover:bg-bg-hover",
  ghost:
    "text-text-secondary hover:text-text-primary hover:bg-bg-hover bg-transparent",
  danger:
    "text-error hover:bg-error/10 bg-transparent border border-transparent hover:border-error/20",
  outline:
    "border border-border-base text-text-primary hover:bg-bg-hover",
};

const sizeClasses: Record<string, string> = {
  sm: "text-xs px-2.5 py-1.5 h-7",
  md: "text-sm px-3 py-1.5 h-8",
  lg: "text-sm px-4 py-2 h-9",
};

const gapClasses: Record<string, string> = {
  sm: "gap-1.5",
  md: "gap-2",
  lg: "gap-2",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded transition-colors duration-100",
          variantClasses[variant],
          sizeClasses[size],
          (leftIcon || rightIcon || isLoading) && gapClasses[size],
          isLoading && "pointer-events-none opacity-70",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {isLoading ? <Spinner size="sm" /> : leftIcon}
        {children}
        {rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
