"use client";

import { Menu } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useMobileMenu } from "@/lib/contexts/MobileMenuContext";

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function TopBar({ title, subtitle, actions }: TopBarProps) {
  const { openMobileMenu } = useMobileMenu();

  return (
    <header
      className={cn(
        "h-12 flex items-center px-4 border-b border-border-base bg-bg-main",
        "sticky top-0 z-20"
      )}
    >
      {/* Left */}
      <div className="flex items-center flex-1 min-w-0">
        <button
          onClick={openMobileMenu}
          className="lg:hidden mr-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded p-1 transition-colors duration-100"
        >
          <Menu size={18} />
        </button>
        <h1 className="text-sm font-medium text-text-primary truncate">
          {title}
        </h1>
        {subtitle && (
          <span className="text-text-tertiary text-sm ml-2 hidden sm:block">
            · {subtitle}
          </span>
        )}
      </div>

      {/* Right */}
      {actions && (
        <div className="flex items-center gap-2">{actions}</div>
      )}
    </header>
  );
}
