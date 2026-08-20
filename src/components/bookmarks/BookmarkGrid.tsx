"use client";

import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";
import BookmarkCard from "./BookmarkCard";
import EmptyState from "@/components/common/ui/EmptyState";
import Button from "@/components/common/ui/Button";
import { ROUTES } from "@/lib/constants/routes";
import type { Bookmark as BookmarkType } from "@/lib/types";

interface BookmarkGridProps {
  bookmarks: BookmarkType[];
  onBookmarkClick: (id: string) => void;
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
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-bg-hover rounded" />
            <div className="h-4 w-1/2 bg-bg-hover rounded" />
          </div>
          <div className="h-3 w-1/3 bg-bg-hover rounded mt-2" />
          <div className="h-3 w-full bg-bg-hover rounded mt-2" />
          <div className="h-3 w-3/4 bg-bg-hover rounded mt-1" />
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
          <div className="h-3 w-20 bg-bg-hover rounded" />
          <div className="h-3 w-12 bg-bg-hover rounded" />
        </div>
      ))}
    </div>
  );
}

export default function BookmarkGrid({
  bookmarks,
  onBookmarkClick,
  onFavorite,
  view,
  isLoading,
}: BookmarkGridProps) {
  const router = useRouter();

  if (isLoading) {
    return view === "grid" ? <GridSkeleton /> : <ListSkeleton />;
  }

  if (bookmarks.length === 0) {
    return (
      <EmptyState
        icon={<Bookmark size={20} style={{ color: "var(--bookmark)" }} />}
        title="No bookmarks yet"
        description="Save links you want to revisit"
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push(ROUTES.bookmarkNew)}
          >
            Add bookmark
          </Button>
        }
      />
    );
  }

  if (view === "list") {
    return (
      <div className="flex flex-col">
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onClick={() => onBookmarkClick(bookmark.id)}
            onFavorite={onFavorite}
            view="list"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          onClick={() => onBookmarkClick(bookmark.id)}
          onFavorite={onFavorite}
          view="grid"
        />
      ))}
    </div>
  );
}
