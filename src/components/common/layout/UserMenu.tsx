"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Settings, KeyRound } from "lucide-react";
import Dropdown from "@/components/common/ui/Dropdown";
import Spinner from "@/components/common/ui/Spinner";
import { ROUTES } from "@/lib/constants/routes";
import { useAuth } from "@/lib/contexts/AuthContext";

/** First letter of whatever name we actually have. */
const initialOf = (name: string) => (name.trim()[0] ?? "?").toUpperCase();

/**
 * Signed-in identity + account actions for the sidebar footer.
 * Opens upward because it sits at the bottom of the viewport.
 */
export default function UserMenu({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      // logout() swallows network errors and always clears local state, so the
      // user is never stranded in a signed-in-looking UI.
      await logout();
      onNavigate?.();
      router.replace(ROUTES.login);
    } finally {
      setSigningOut(false);
    }
  };

  const label = user?.displayName || user?.username || user?.email || "Account";

  if (signingOut) {
    return (
      <div className="flex items-center gap-2 px-2 py-1" aria-live="polite">
        <Spinner size="sm" />
        <span className="text-sm text-text-secondary">Signing out…</span>
      </div>
    );
  }

  return (
    <Dropdown
      align="left"
      side="top"
      trigger={
        <button
          type="button"
          aria-label="Account menu"
          className="flex w-full items-center gap-2 rounded px-2 py-1 text-left transition-colors duration-100 hover:bg-bg-hover"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bg-hover text-xs font-medium text-text-secondary">
            {initialOf(label)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-text-primary">{label}</span>
            {user?.email && (
              <span className="block truncate text-xs text-text-tertiary">{user.email}</span>
            )}
          </span>
        </button>
      }
      items={[
        {
          label: "API keys",
          icon: <KeyRound size={15} strokeWidth={1.5} />,
          onClick: () => {
            onNavigate?.();
            router.push(ROUTES.settings);
          },
        },
        {
          label: "Settings",
          icon: <Settings size={15} strokeWidth={1.5} />,
          onClick: () => {
            onNavigate?.();
            router.push(ROUTES.settings);
          },
        },
        { label: "", onClick: () => {}, isDivider: true },
        {
          label: "Log out",
          icon: <LogOut size={15} strokeWidth={1.5} />,
          danger: true,
          onClick: handleLogout,
        },
      ]}
    />
  );
}
