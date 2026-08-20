"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
  isDivider?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
}

export default function Dropdown({
  trigger,
  items,
  align = "left",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleMouseDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isOpen]);

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute top-full mt-1 z-50 min-w-[160px]",
              "bg-bg-elevated border border-border-base rounded-md shadow-notion-menu",
              "py-1",
              align === "left" ? "left-0" : "right-0"
            )}
          >
            {items.map((item, index) => {
              if (item.isDivider) {
                return (
                  <div
                    key={index}
                    className="border-t border-border-base my-1"
                  />
                );
              }

              return (
                <button
                  key={index}
                  onClick={() => {
                    if (!item.disabled) {
                      item.onClick();
                      setIsOpen(false);
                    }
                  }}
                  disabled={item.disabled}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 text-sm w-full text-left",
                    "transition-colors duration-100",
                    item.danger
                      ? "text-error hover:bg-error/5"
                      : "text-text-primary hover:bg-bg-hover",
                    item.disabled && "opacity-40 pointer-events-none"
                  )}
                >
                  {item.icon && (
                    <span className="text-text-secondary">{item.icon}</span>
                  )}
                  {item.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
