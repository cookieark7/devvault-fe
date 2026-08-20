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
  Settings,
  BookOpen,
  KeyRound,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ROUTES } from "@/lib/constants/routes";

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

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (item: NavItem) =>
    item.exactMatch ? pathname === item.route : pathname.startsWith(item.route);

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-bg-sidebar flex-col border-r border-border-base z-30 hidden lg:flex">
      {/* Brand */}
      <div className="px-3 pt-4 pb-2">
        <div className="flex items-center">
          <div className="w-5 h-5 bg-text-primary rounded-sm" />
          <span className="text-sm font-semibold text-text-primary ml-2">
            DevVault
          </span>
        </div>
      </div>

      {/* Search shortcut */}
      <div className="px-2 pb-2">
        <Link
          href={ROUTES.search}
          className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-xs text-text-secondary hover:bg-bg-hover transition-colors duration-100 cursor-pointer"
        >
          <Search size={14} className="text-text-tertiary" />
          <span className="flex-1">Search...</span>
          <kbd className="text-xs bg-bg-hover rounded px-1.5 py-0.5 text-text-tertiary">
            ⌘K
          </kbd>
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
      <div className="border-t border-border-base px-2 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-bg-hover rounded-full text-xs font-medium text-text-secondary flex items-center justify-center">
            U
          </div>
          <span className="text-sm text-text-primary font-medium flex-1 truncate">
            User
          </span>
          <button className="text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded p-1 transition-colors duration-100">
            <Settings size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
