"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, LayoutGrid, List, Search } from "lucide-react";
import TopBar from "@/components/common/layout/TopBar";
import PageWrapper from "@/components/common/layout/PageWrapper";
import Button from "@/components/common/ui/Button";
import SnippetGrid from "@/components/snippets/SnippetGrid";
import TagFilter from "@/components/tags/TagFilter";
import { useSnippets } from "@/lib/hooks/useSnippets";
import { useTags } from "@/lib/hooks/useTags";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

export default function SnippetsPage() {
  const router = useRouter();
  const { snippets, isLoading, toggleFavorite } = useSnippets();
  const { tags } = useTags();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = snippets.filter(
    (s) =>
      (selectedTagIds.length === 0 ||
        (s.tags || []).some((t) => selectedTagIds.includes(t.id))) &&
      (searchQuery === "" ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <>
      <TopBar
        title="Snippets"
        subtitle={`${filtered.length} saved`}
        actions={
          <div className="flex items-center gap-2">
            {/* Search */}
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

            {/* View toggle */}
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

            {/* New button */}
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => router.push(ROUTES.snippetNew)}
            >
              New Snippet
            </Button>
          </div>
        }
      />
      <PageWrapper>
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

        <SnippetGrid
          snippets={filtered}
          view={view}
          isLoading={isLoading}
          onSnippetClick={(id) => router.push(ROUTES.snippet(id))}
          onFavorite={toggleFavorite}
        />
      </PageWrapper>
    </>
  );
}
