"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, hint, leftIcon, rightIcon, className, id, ...props },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded border bg-bg-subtle",
              "px-3 py-1.5 text-sm text-text-primary",
              "placeholder:text-text-tertiary",
              "focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-accent/20",
              "transition-colors duration-100",
              error
                ? "border-error focus:ring-error/20"
                : "border-border-base",
              leftIcon && "pl-8",
              rightIcon && "pr-8",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-xs text-error">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1 text-xs text-text-tertiary">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
