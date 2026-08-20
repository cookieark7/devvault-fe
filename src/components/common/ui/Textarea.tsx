"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  showCount?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      showCount = false,
      rows = 4,
      maxLength,
      value,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const currentLength = typeof value === "string" ? value.length : 0;

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
          <textarea
            ref={ref}
            id={inputId}
            rows={rows}
            maxLength={maxLength}
            value={value}
            className={cn(
              "w-full rounded border bg-bg-subtle resize-none min-h-[80px]",
              "px-3 py-1.5 text-sm text-text-primary",
              "placeholder:text-text-tertiary",
              "focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-accent/20",
              "transition-colors duration-100",
              error
                ? "border-error focus:ring-error/20"
                : "border-border-base",
              showCount && maxLength && "pb-6",
              className
            )}
            {...props}
          />

          {showCount && maxLength && (
            <span className="absolute bottom-2 right-3 text-xs text-text-tertiary">
              {currentLength} / {maxLength}
            </span>
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

Textarea.displayName = "Textarea";
export default Textarea;
