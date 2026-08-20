"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  size = "md",
  children,
  footer,
}: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "bg-bg-elevated border border-border-base rounded-md shadow-notion-menu w-full pointer-events-auto",
                sizeClasses[size]
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border-base">
                <h2 className="text-base font-medium text-text-primary">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded p-1 transition-colors duration-100"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 max-h-[65vh] overflow-y-auto">{children}</div>

              {/* Footer */}
              {footer && (
                <div className="border-t border-border-base p-4 flex justify-end gap-2">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
