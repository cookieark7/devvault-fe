"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Code2,
  Bookmark,
  Terminal,
  Sparkles,
  Tag,
  Search,
  BookOpen,
  KeyRound,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ROUTES } from "@/lib/constants/routes";
import UserMenu from "./UserMenu";
import Logo from "@/components/common/ui/Logo";

interface NavItem {
  label: string;
  icon: LucideIcon;
  route: string;
  identityColor?: string;
  exactMatch?: boolean;
}

const sections: { header?: string; items: NavItem[] }[] = [
  {
    items: [
      {
        label: "Home",
        icon: LayoutDashboard,
        route: ROUTES.home,
        exactMatch: true,
      },
    ],
  },
  {
    header: "LIBRARY",
    items: [
      {
        label: "Snippets",
        icon: Code2,
        route: ROUTES.snippets,
        identityColor: "var(--snippet)",
      },
      {
        label: "Bookmarks",
        icon: Bookmark,
        route: ROUTES.bookmarks,
        identityColor: "var(--bookmark)",
      },
      {
        label: "Commands",
        icon: Terminal,
        route: ROUTES.commands,
        identityColor: "var(--command)",
      },
      {
        label: "Prompts",
        icon: Sparkles,
        route: ROUTES.prompts,
        identityColor: "var(--prompt)",
      },
    ],
  },
  {
    header: "KNOWLEDGE",
    items: [
      {
        label: "Projects",
        icon: BookOpen,
        route: ROUTES.projects,
        identityColor: "#14B8A6",
      },
    ],
  },
  {
    header: "ORGANIZE",
    items: [{ label: "Tags", icon: Tag, route: ROUTES.tags }],
  },
  {
    header: "FIND",
    items: [{ label: "Search", icon: Search, route: ROUTES.search }],
  },
  {
    header: "ACCOUNT",
    items: [{ label: "API Keys", icon: KeyRound, route: ROUTES.settings }],
  },
];

interface SidebarProps {
  /**
   * "desktop" pins the rail and hides it below lg. "drawer" fills the mobile
   * drawer that already supplies its own fixed 240px shell — without this the
   * shared `hidden lg:flex` made the open drawer render completely blank.
   */
  variant?: "desktop" | "drawer";
  /** Called after a nav item is chosen, so the drawer can close itself. */
  onNavigate?: () => void;
}

export default function Sidebar({ variant = "desktop", onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const isDrawer = variant === "drawer";

  const isActive = (item: NavItem) =>
    item.exactMatch ? pathname === item.route : pathname.startsWith(item.route);

  return (
    <aside
      className={cn(
        "bg-bg-sidebar flex-col border-border-base",
        isDrawer
          ? "flex h-full w-full"
          : "fixed left-0 top-0 h-screen w-[240px] border-r z-30 hidden lg:flex"
      )}
    >
      {/* Brand */}
      <div className="px-3 pt-4 pb-2">
        <div className="flex items-center">
          <Logo size={24} className="-ml-0.5" />
          <span className="text-sm font-semibold text-text-primary ml-2">
            DevVault
          </span>
        </div>
      </div>

      {/* Search shortcut */}
      <div className="px-2 pb-2">
        <Link
          href={ROUTES.search}
          onClick={onNavigate}
          className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-xs text-text-secondary hover:bg-bg-hover transition-colors duration-100 cursor-pointer"
        >
          <Search size={14} className="text-text-tertiary" />
          <span className="flex-1">Search...</span>
          {!isDrawer && (
            <kbd className="text-xs bg-bg-hover rounded px-1.5 py-0.5 text-text-tertiary">
              ⌘K
            </kbd>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-1 pb-2">
        {sections.map((section, sectionIdx) => (
          <div key={sectionIdx}>
            {section.header && (
              <div className="text-[10px] font-semibold text-text-tertiary tracking-widest uppercase px-3 py-2 mt-3">
                {section.header}
              </div>
            )}
            {section.items.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;

              return (
                <Link
                  key={item.route}
                  href={item.route}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-2 w-full rounded px-2 py-1.5 text-sm",
                    "transition-colors duration-100",
                    active
                      ? "bg-bg-hover text-text-primary font-medium"
                      : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
                  )}
                >
                  <Icon
                    size={16}
                    strokeWidth={1.5}
                    className={cn(!active && "text-text-secondary")}
                    style={
                      active && item.identityColor
                        ? { color: item.identityColor }
                        : undefined
                    }
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom user section */}
      <div className="border-t border-border-base px-2 py-2">
        <UserMenu onNavigate={onNavigate} />
      </div>
    </aside>
  );
}
