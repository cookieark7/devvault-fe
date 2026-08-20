"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Bookmark, Terminal, Sparkles } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

const NEW_ITEM_OPTIONS = [
  { label: "+ New Snippet", icon: Code2, route: ROUTES.snippetNew },
  { label: "+ New Bookmark", icon: Bookmark, route: ROUTES.bookmarkNew },
  { label: "+ New Command", icon: Terminal, route: ROUTES.commandNew },
  { label: "+ New Prompt", icon: Sparkles, route: ROUTES.promptNew },
];

export default function KeyboardShortcuts() {
  const router = useRouter();
  const [showNewModal, setShowNewModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Show hint toast on first visit
  useEffect(() => {
    const key = "devvault-shortcut-hint";
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, "true");
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Global keyboard listener
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;

      // ⌘K → Search
      if (mod && e.key === "k") {
        e.preventDefault();
        router.push(ROUTES.search);
      }

      // ⌘N → New item modal
      if (mod && e.key === "n") {
        e.preventDefault();
        setShowNewModal((prev) => !prev);
      }

      // Escape → close modal
      if (e.key === "Escape") {
        setShowNewModal(false);
      }
    },
    [router]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {/* New item modal */}
      <AnimatePresence>
        {showNewModal && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowNewModal(false)}
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.15, ease: "easeOut" as const }}
                className="bg-bg-elevated border border-border-base rounded-md shadow-notion-menu p-2 w-60 pointer-events-auto"
              >
                {NEW_ITEM_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.route}
                      onClick={() => {
                        router.push(option.route);
                        setShowNewModal(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-text-primary hover:bg-bg-hover rounded transition-colors duration-100"
                    >
                      <Icon size={14} className="text-text-secondary" />
                      {option.label}
                    </button>
                  );
                })}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* First-load toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" as const }}
            className="fixed bottom-4 right-4 bg-bg-elevated border border-border-base rounded shadow-notion-menu px-3 py-2 text-sm text-text-primary z-50"
          >
            Press{" "}
            <kbd className="bg-bg-hover rounded px-1.5 py-0.5 text-xs font-medium">
              ⌘K
            </kbd>{" "}
            to search
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
