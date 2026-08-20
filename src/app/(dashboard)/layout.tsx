"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/common/layout/Sidebar";
import MobileDrawer from "@/components/common/layout/MobileDrawer";
import KeyboardShortcuts from "@/components/common/layout/KeyboardShortcuts";
import AuthGuard from "@/components/common/AuthGuard";
import { MobileMenuProvider } from "@/lib/contexts/MobileMenuContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <AuthGuard>
      <MobileMenuProvider value={{ openMobileMenu: () => setMobileDrawerOpen(true) }}>
        <div className="flex h-screen bg-bg-main overflow-hidden">
          <KeyboardShortcuts />
          <Sidebar />
          <MobileDrawer
            isOpen={mobileDrawerOpen}
            onClose={() => setMobileDrawerOpen(false)}
          />
          <main className="flex-1 flex flex-col min-w-0 overflow-y-auto lg:pl-[240px]">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex-1"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </MobileMenuProvider>
    </AuthGuard>
  );
}

