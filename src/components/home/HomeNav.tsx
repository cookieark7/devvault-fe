"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ROUTES } from "@/lib/constants/routes";
import { useAuth } from "@/lib/contexts/AuthContext";

const navLink =
  "px-3 py-1.5 rounded text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors duration-100";

export default function HomeNav() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-bg-main/85 backdrop-blur-sm">
      <div className="max-w-[1100px] mx-auto px-6 h-14 flex items-center justify-between">
        {/* Brand mark — same treatment as the auth cards */}
        <Link href="/" className="flex items-center gap-2">
          <span className="w-5 h-5 bg-text-primary rounded-sm" />
          <span className="text-sm font-semibold text-text-primary">DevVault</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <a href="#capture" className={navLink}>
            Capture
          </a>
          <a href="#library" className={navLink}>
            Library
          </a>
        </nav>

        <div className={cn("flex items-center gap-2", loading && "invisible")}>
          {user ? (
            <Link
              href={ROUTES.home}
              className="inline-flex items-center h-8 px-3 text-sm font-medium rounded bg-accent text-white hover:bg-accent-hover transition-colors duration-100"
            >
              Open vault
              <ArrowRight size={14} strokeWidth={1.5} className="ml-1" />
            </Link>
          ) : (
            <>
              <Link href={ROUTES.login} className={navLink}>
                Log in
              </Link>
              <Link
                href={ROUTES.register}
                className="inline-flex items-center h-8 px-3 text-sm font-medium rounded bg-accent text-white hover:bg-accent-hover transition-colors duration-100"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
