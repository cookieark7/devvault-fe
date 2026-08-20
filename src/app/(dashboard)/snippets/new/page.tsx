"use client";

import { useRouter } from "next/navigation";
import TopBar from "@/components/common/layout/TopBar";
import PageWrapper from "@/components/common/layout/PageWrapper";
import BackButton from "@/components/common/layout/BackButton";
import SnippetForm from "@/components/snippets/SnippetForm";
import { useSnippets } from "@/lib/hooks/useSnippets";
import { ROUTES } from "@/lib/constants/routes";

export default function NewSnippetPage() {
  const router = useRouter();
  const { createSnippet } = useSnippets();

  return (
    <>
      <TopBar
        title="New Snippet"
        actions={<BackButton href={ROUTES.snippets} />}
      />
      <PageWrapper>
        <div className="max-w-2xl">
          <h1 className="text-xl font-semibold text-text-primary mb-1">
            Save a Snippet
          </h1>
          <p className="text-sm text-text-secondary mb-8">
            Capture code you want to reuse.
          </p>
          <SnippetForm
            onSubmit={async (data) => {
              await createSnippet(data);
              router.push(ROUTES.snippets);
            }}
            onCancel={() => router.push(ROUTES.snippets)}
          />
        </div>
      </PageWrapper>
    </>
  );
}
