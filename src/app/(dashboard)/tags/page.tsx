"use client";

import TopBar from "@/components/common/layout/TopBar";
import PageWrapper from "@/components/common/layout/PageWrapper";
import TagManagerPanel from "@/components/tags/TagManagerPanel";
import Spinner from "@/components/common/ui/Spinner";
import { useTags } from "@/lib/hooks/useTags";

export default function TagsPage() {
  const { tags, isLoading, createTag, updateTag, deleteTag } = useTags();

  return (
    <>
      <TopBar
        title="Tags"
        subtitle={`${tags.length} tag${tags.length !== 1 ? "s" : ""}`}
      />
      <PageWrapper>
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="md" />
          </div>
        ) : (
          <TagManagerPanel
            tags={tags}
            onCreateTag={createTag}
            onUpdateTag={updateTag}
            onDeleteTag={deleteTag}
          />
        )}
      </PageWrapper>
    </>
  );
}
