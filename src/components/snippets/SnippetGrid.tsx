"use client";

import { useRouter } from "next/navigation";
import { Code2 } from "lucide-react";
import SnippetCard from "./SnippetCard";
import EmptyState from "@/components/common/ui/EmptyState";
import Button from "@/components/common/ui/Button";
import { ROUTES } from "@/lib/constants/routes";
import type { Snippet } from "@/lib/types";

interface SnippetGridProps {
  snippets: Snippet[];
  onSnippetClick: (id: string) => void;
  onFavorite: (id: string) => void;
  view: "grid" | "list";
  isLoading: boolean;
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="border border-border-base rounded p-4 animate-pulse"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 bg-bg-hover rounded" />
            <div className="h-4 w-1/2 bg-bg-hover rounded" />
          </div>
          <div className="bg-bg-subtle rounded p-3 space-y-2">
            <div className="h-3 w-full bg-bg-hover rounded" />
            <div className="h-3 w-4/5 bg-bg-hover rounded" />
            <div className="h-3 w-3/5 bg-bg-hover rounded" />
          </div>
          <div className="flex gap-2 mt-3">
            <div className="h-5 w-12 bg-bg-hover rounded-full" />
            <div className="flex-1" />
            <div className="h-3 w-16 bg-bg-hover rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-3 border-b border-border-base animate-pulse"
        >
          <div className="w-4 h-4 bg-bg-hover rounded" />
          <div className="h-4 w-1/3 bg-bg-hover rounded" />
          <div className="flex-1" />
          <div className="h-4 w-16 bg-bg-hover rounded" />
          <div className="h-3 w-12 bg-bg-hover rounded" />
        </div>
      ))}
    </div>
  );
}

export default function SnippetGrid({
  snippets,
  onSnippetClick,
  onFavorite,
  view,
  isLoading,
}: SnippetGridProps) {
  const router = useRouter();

  if (isLoading) {
    return view === "grid" ? <GridSkeleton /> : <ListSkeleton />;
  }

  if (snippets.length === 0) {
    return (
      <EmptyState
        icon={<Code2 size={20} style={{ color: "var(--snippet)" }} />}
        title="No snippets yet"
        description="Save code snippets you want to reference later"
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push(ROUTES.snippetNew)}
          >
            Add snippet
          </Button>
        }
      />
    );
  }

  if (view === "list") {
    return (
      <div className="flex flex-col">
        {snippets.map((snippet) => (
          <SnippetCard
            key={snippet.id}
            snippet={snippet}
            onClick={() => onSnippetClick(snippet.id)}
            onFavorite={onFavorite}
            view="list"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {snippets.map((snippet) => (
        <SnippetCard
          key={snippet.id}
          snippet={snippet}
          onClick={() => onSnippetClick(snippet.id)}
          onFavorite={onFavorite}
          view="grid"
        />
      ))}
    </div>
  );
}
