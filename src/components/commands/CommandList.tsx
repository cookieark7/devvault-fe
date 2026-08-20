"use client";

import { useRouter } from "next/navigation";
import { Terminal } from "lucide-react";
import CommandCard from "./CommandCard";
import EmptyState from "@/components/common/ui/EmptyState";
import Button from "@/components/common/ui/Button";
import { ROUTES } from "@/lib/constants/routes";
import type { Command } from "@/lib/types";

interface CommandListProps {
  commands: Command[];
  onSelect: (id: string) => void;
  onFavorite: (id: string) => void;
  isLoading: boolean;
  groupByPlatform?: boolean;
}

const PLATFORM_ORDER = ["macos", "linux", "windows", "cross-platform"];
const PLATFORM_LABELS: Record<string, string> = {
  macos: "macOS",
  linux: "Linux",
  windows: "Windows",
  "cross-platform": "Cross-platform",
};

function ListSkeleton() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-3 border-b border-border-base animate-pulse"
        >
          <div className="w-4 h-4 bg-bg-hover rounded" />
          <div className="h-4 w-1/4 bg-bg-hover rounded" />
          <div className="flex-1" />
          <div className="h-4 w-32 bg-bg-hover rounded" />
          <div className="h-4 w-16 bg-bg-hover rounded-full" />
          <div className="h-3 w-12 bg-bg-hover rounded" />
        </div>
      ))}
    </div>
  );
}

export default function CommandList({
  commands,
  onSelect,
  onFavorite,
  isLoading,
  groupByPlatform = false,
}: CommandListProps) {
  const router = useRouter();

  if (isLoading) {
    return <ListSkeleton />;
  }

  if (commands.length === 0) {
    return (
      <EmptyState
        icon={<Terminal size={20} style={{ color: "var(--command)" }} />}
        title="No commands saved"
        description="Never forget a useful terminal command again"
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push(ROUTES.commandNew)}
          >
            Add command
          </Button>
        }
      />
    );
  }

  if (groupByPlatform) {
    const grouped: Record<string, Command[]> = {};
    for (const cmd of commands) {
      const key = cmd.platform || "cross-platform";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(cmd);
    }

    return (
      <div>
        {PLATFORM_ORDER.filter((p) => grouped[p]?.length > 0).map(
          (platform) => (
            <div key={platform}>
              <div className="text-xs font-semibold text-text-tertiary uppercase tracking-widest px-4 py-2 mt-2 bg-bg-subtle border-b border-border-base">
                {PLATFORM_LABELS[platform]}
              </div>
              {grouped[platform].map((cmd) => (
                <CommandCard
                  key={cmd.id}
                  command={cmd}
                  onClick={() => onSelect(cmd.id)}
                  onFavorite={onFavorite}
                />
              ))}
            </div>
          )
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {commands.map((cmd) => (
        <CommandCard
          key={cmd.id}
          command={cmd}
          onClick={() => onSelect(cmd.id)}
          onFavorite={onFavorite}
        />
      ))}
    </div>
  );
}
