"use client";

import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import PromptCard from "./PromptCard";
import EmptyState from "@/components/common/ui/EmptyState";
import Button from "@/components/common/ui/Button";
import { ROUTES } from "@/lib/constants/routes";
import type { Prompt } from "@/lib/types";

interface PromptGridProps {
  prompts: Prompt[];
  onPromptClick: (id: string) => void;
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
            <div className="h-4 w-14 bg-bg-hover rounded-full ml-auto" />
          </div>
          <div className="bg-bg-subtle rounded p-3 space-y-2">
            <div className="h-3 w-full bg-bg-hover rounded" />
            <div className="h-3 w-4/5 bg-bg-hover rounded" />
            <div className="h-3 w-2/3 bg-bg-hover rounded" />
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
          <div className="h-4 w-14 bg-bg-hover rounded-full" />
          <div className="h-3 w-12 bg-bg-hover rounded" />
        </div>
      ))}
    </div>
  );
}

export default function PromptGrid({
  prompts,
  onPromptClick,
  onFavorite,
  view,
  isLoading,
}: PromptGridProps) {
  const router = useRouter();

  if (isLoading) {
    return view === "grid" ? <GridSkeleton /> : <ListSkeleton />;
  }

  if (prompts.length === 0) {
    return (
      <EmptyState
        icon={<Sparkles size={20} style={{ color: "var(--prompt)" }} />}
        title="No prompts saved"
        description="Build your library of AI prompts that actually work"
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push(ROUTES.promptNew)}
          >
            Add prompt
          </Button>
        }
      />
    );
  }

  if (view === "list") {
    return (
      <div className="flex flex-col">
        {prompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onClick={() => onPromptClick(prompt.id)}
            onFavorite={onFavorite}
            view="list"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          onClick={() => onPromptClick(prompt.id)}
          onFavorite={onFavorite}
          view="grid"
        />
      ))}
    </div>
  );
}
