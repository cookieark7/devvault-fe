"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Bookmark, ExternalLink } from "lucide-react";
import TopBar from "@/components/common/layout/TopBar";
import PageWrapper from "@/components/common/layout/PageWrapper";
import BackButton from "@/components/common/layout/BackButton";
import EmptyState from "@/components/common/ui/EmptyState";
import Button from "@/components/common/ui/Button";
import Spinner from "@/components/common/ui/Spinner";
import BookmarkDetailPanel from "@/components/bookmarks/BookmarkDetailPanel";
import { bookmarksService } from "@/lib/api";
import { useBookmarks } from "@/lib/hooks/useBookmarks";
import { ROUTES } from "@/lib/constants/routes";
import type { Bookmark as BookmarkType } from "@/lib/types";

export default function BookmarkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { deleteBookmark, toggleFavorite } = useBookmarks();
  const [bookmark, setBookmark] = useState<BookmarkType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await bookmarksService.getById(params.id as string);
        setBookmark(data);
      } catch {
        setBookmark(null);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) load();
  }, [params.id]);

  if (loading) {
    return (
      <>
        <TopBar
          title="Bookmark"
          actions={<BackButton href={ROUTES.bookmarks} label="Bookmarks" />}
        />
        <PageWrapper>
          <div className="flex justify-center py-20">
            <Spinner size="md" />
          </div>
        </PageWrapper>
      </>
    );
  }

  if (!bookmark) {
    return (
      <>
        <TopBar
          title="Bookmark"
          actions={<BackButton href={ROUTES.bookmarks} label="Bookmarks" />}
        />
        <PageWrapper>
          <EmptyState
            icon={<Bookmark size={20} style={{ color: "var(--bookmark)" }} />}
            title="Bookmark not found"
            description="This bookmark may have been deleted or doesn't exist."
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push(ROUTES.bookmarks)}
              >
                Back to Bookmarks
              </Button>
            }
          />
        </PageWrapper>
      </>
    );
  }

  return (
    <>
      <TopBar
        title={bookmark.title}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<ExternalLink size={14} />}
              onClick={() => window.open(bookmark.url, "_blank")}
            >
              Open link
            </Button>
            <BackButton href={ROUTES.bookmarks} label="Bookmarks" />
          </div>
        }
      />
      <PageWrapper>
        <BookmarkDetailPanel
          bookmark={bookmark}
          onEdit={() => router.push(`${ROUTES.bookmark(bookmark.id)}/edit`)}
          onDelete={async () => {
            await deleteBookmark(bookmark.id);
            router.push(ROUTES.bookmarks);
          }}
          onFavorite={toggleFavorite}
        />
      </PageWrapper>
    </>
  );
}
