"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Layers } from "lucide-react";
import TopBar from "@/components/common/layout/TopBar";
import PageWrapper from "@/components/common/layout/PageWrapper";
import Button from "@/components/common/ui/Button";
import CommandList from "@/components/commands/CommandList";
import { useCommands } from "@/lib/hooks/useCommands";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

const PLATFORMS = ["All", "macOS", "Linux", "Windows", "Cross-platform"] as const;
const PLATFORM_MAP: Record<string, string> = {
  All: "",
  macOS: "macos",
  Linux: "linux",
  Windows: "windows",
  "Cross-platform": "cross-platform",
};

export default function CommandsPage() {
  const router = useRouter();
  const { commands, isLoading, toggleFavorite } = useCommands();
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [groupByPlatform, setGroupByPlatform] = useState(false);

  const platformKey = PLATFORM_MAP[selectedPlatform];

  const filtered = commands.filter(
    (c) =>
      (platformKey === "" || c.platform === platformKey) &&
      (searchQuery === "" ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.command.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <>
      <TopBar
        title="Commands"
        subtitle={`${filtered.length} saved`}
        actions={
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-bg-subtle border border-border-base rounded px-2 w-56">
              <Search size={14} className="text-text-tertiary flex-shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
                className="bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none py-1.5 w-full"
              />
            </div>
            <button
              onClick={() => setGroupByPlatform(!groupByPlatform)}
              className={cn(
                "p-1.5 rounded border border-border-base transition-colors duration-100",
                groupByPlatform
                  ? "bg-bg-hover text-text-primary"
                  : "text-text-tertiary hover:text-text-secondary"
              )}
              title="Group by platform"
            >
              <Layers size={14} />
            </button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => router.push(ROUTES.commandNew)}
            >
              New Command
            </Button>
          </div>
        }
      />
      <PageWrapper>
        {/* Platform filter pills */}
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPlatform(p)}
              className={cn(
                "inline-flex items-center rounded-full text-xs px-2.5 py-1 font-medium whitespace-nowrap",
                "border transition-colors duration-100",
                selectedPlatform === p
                  ? "bg-bg-hover text-text-primary border-border-focus"
                  : "text-text-secondary border-border-base hover:bg-bg-hover"
              )}
            >
              {p}
            </button>
          ))}
        </div>

        <CommandList
          commands={filtered}
          isLoading={isLoading}
          onSelect={(id) => router.push(ROUTES.command(id))}
          onFavorite={toggleFavorite}
          groupByPlatform={groupByPlatform}
        />
      </PageWrapper>
    </>
  );
}
