"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Bookmark as BookmarkIcon } from "lucide-react";
import TopBar from "@/components/common/layout/TopBar";
import PageWrapper from "@/components/common/layout/PageWrapper";
import BackButton from "@/components/common/layout/BackButton";
import EmptyState from "@/components/common/ui/EmptyState";
import Button from "@/components/common/ui/Button";
import Spinner from "@/components/common/ui/Spinner";
import BookmarkForm from "@/components/bookmarks/BookmarkForm";
import { bookmarksService } from "@/lib/api";
import { useBookmarks } from "@/lib/hooks/useBookmarks";
import { ROUTES } from "@/lib/constants/routes";
import type { Bookmark } from "@/lib/types";

export default function EditBookmarkPage() {
  const params = useParams();
  const router = useRouter();
  const { updateBookmark } = useBookmarks();
  const [bookmark, setBookmark] = useState<Bookmark | null>(null);
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
          title="Edit Bookmark"
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
          title="Edit Bookmark"
          actions={<BackButton href={ROUTES.bookmarks} label="Bookmarks" />}
        />
        <PageWrapper>
          <EmptyState
            icon={<BookmarkIcon size={20} style={{ color: "var(--bookmark)" }} />}
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
        title="Edit Bookmark"
        actions={
          <BackButton
            href={ROUTES.bookmark(bookmark.id)}
            label="Back to bookmark"
          />
        }
      />
      <PageWrapper>
        <div className="max-w-2xl">
          <h1 className="text-xl font-semibold text-text-primary mb-1">
            Edit Bookmark
          </h1>
          <p className="text-sm text-text-secondary mb-8">
            Update your saved bookmark.
          </p>
          <BookmarkForm
            initialValues={bookmark}
            onSubmit={async (data) => {
              await updateBookmark(bookmark.id, data);
              router.push(ROUTES.bookmark(bookmark.id));
            }}
            onCancel={() => router.push(ROUTES.bookmark(bookmark.id))}
          />
        </div>
      </PageWrapper>
    </>
  );
}
