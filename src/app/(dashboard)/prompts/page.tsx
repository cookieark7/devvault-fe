"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, LayoutGrid, List, Search } from "lucide-react";
import TopBar from "@/components/common/layout/TopBar";
import PageWrapper from "@/components/common/layout/PageWrapper";
import Button from "@/components/common/ui/Button";
import PromptGrid from "@/components/prompts/PromptGrid";
import TagFilter from "@/components/tags/TagFilter";
import { usePrompts } from "@/lib/hooks/usePrompts";
import { useTags } from "@/lib/hooks/useTags";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

const TOP_MODELS = [
  "All",
  "gpt-4o",
  "claude-3-5-sonnet",
  "claude-sonnet-4",
  "gemini-1.5-pro",
  "any / model-agnostic",
];

export default function PromptsPage() {
  const router = useRouter();
  const { prompts, isLoading, toggleFavorite } = usePrompts();
  const { tags } = useTags();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = prompts.filter(
    (p) =>
      (selectedModel === "All" || p.model === selectedModel) &&
      (selectedTagIds.length === 0 ||
        p.tags.some((t) => selectedTagIds.includes(t.id))) &&
      (searchQuery === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <>
      <TopBar
        title="Prompts"
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
            <div className="flex items-center border border-border-base rounded">
              <button
                onClick={() => setView("grid")}
                className={cn(
                  "p-1.5 transition-colors duration-100",
                  view === "grid"
                    ? "bg-bg-hover text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary"
                )}
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setView("list")}
                className={cn(
                  "p-1.5 transition-colors duration-100",
                  view === "list"
                    ? "bg-bg-hover text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary"
                )}
              >
                <List size={14} />
              </button>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => router.push(ROUTES.promptNew)}
            >
              New Prompt
            </Button>
          </div>
        }
      />
      <PageWrapper>
        {/* Model filter pills */}
        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
          {TOP_MODELS.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedModel(m)}
              className={cn(
                "inline-flex items-center rounded-full text-xs px-2.5 py-1 font-medium whitespace-nowrap",
                "border transition-colors duration-100",
                selectedModel === m
                  ? "bg-bg-hover text-text-primary border-border-focus"
                  : "text-text-secondary border-border-base hover:bg-bg-hover"
              )}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Tag filter */}
        {tags.length > 0 && (
          <div className="mb-4">
            <TagFilter
              tags={tags}
              selectedTagIds={selectedTagIds}
              onFilterChange={setSelectedTagIds}
            />
          </div>
        )}

        <PromptGrid
          prompts={filtered}
          view={view}
          isLoading={isLoading}
          onPromptClick={(id) => router.push(ROUTES.prompt(id))}
          onFavorite={toggleFavorite}
        />
      </PageWrapper>
    </>
  );
}
