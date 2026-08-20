"use client";

import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  return (
    <div className="lg:hidden">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={onClose}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed left-0 top-0 h-full w-[240px] bg-bg-sidebar z-50 shadow-notion-menu"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
