"use client";

import { useRouter } from "next/navigation";
import TopBar from "@/components/common/layout/TopBar";
import PageWrapper from "@/components/common/layout/PageWrapper";
import BackButton from "@/components/common/layout/BackButton";
import BookmarkForm from "@/components/bookmarks/BookmarkForm";
import { useBookmarks } from "@/lib/hooks/useBookmarks";
import { ROUTES } from "@/lib/constants/routes";

export default function NewBookmarkPage() {
  const router = useRouter();
  const { createBookmark } = useBookmarks();

  return (
    <>
      <TopBar
        title="New Bookmark"
        actions={<BackButton href={ROUTES.bookmarks} />}
      />
      <PageWrapper>
        <div className="max-w-2xl">
          <h1 className="text-xl font-semibold text-text-primary mb-1">
            Save a Bookmark
          </h1>
          <p className="text-sm text-text-secondary mb-8">
            Links you want to find again.
          </p>
          <BookmarkForm
            onSubmit={async (data) => {
              await createBookmark(data);
              router.push(ROUTES.bookmarks);
            }}
            onCancel={() => router.push(ROUTES.bookmarks)}
          />
        </div>
      </PageWrapper>
    </>
  );
}
