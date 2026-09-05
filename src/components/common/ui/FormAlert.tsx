"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type AlertVariant = "error" | "success" | "info";

interface FormAlertProps {
  /** Null/empty hides the alert (and animates it out). */
  message?: string | null;
  variant?: AlertVariant;
  className?: string;
}

const VARIANTS: Record<AlertVariant, { icon: typeof AlertCircle; wrapper: string; iconColor: string }> = {
  error: {
    icon: AlertCircle,
    wrapper: "bg-[var(--error-muted)] border-error/25 text-text-primary",
    iconColor: "var(--error)",
  },
  success: {
    icon: CheckCircle2,
    wrapper: "bg-[var(--success-muted)] border-success/25 text-text-primary",
    iconColor: "var(--success)",
  },
  info: {
    icon: Info,
    wrapper: "bg-accent-muted border-accent/25 text-text-primary",
    iconColor: "var(--accent)",
  },
};

/**
 * Inline form-level feedback. Calm fade + slide only — the design system rules
 * out bouncy motion, so an error must not shake or spring.
 */
export default function FormAlert({ message, variant = "error", className }: FormAlertProps) {
  const { icon: Icon, wrapper, iconColor } = VARIANTS[variant];

  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div
            role="alert"
            aria-live="assertive"
            className={cn(
              "mt-4 flex items-start gap-2 rounded border p-2.5 text-sm",
              wrapper,
              className
            )}
          >
            <Icon size={16} strokeWidth={1.5} className="mt-px shrink-0" style={{ color: iconColor }} />
            <span className="leading-snug">{message}</span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
