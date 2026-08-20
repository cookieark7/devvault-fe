"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Code2 } from "lucide-react";
import TopBar from "@/components/common/layout/TopBar";
import PageWrapper from "@/components/common/layout/PageWrapper";
import BackButton from "@/components/common/layout/BackButton";
import EmptyState from "@/components/common/ui/EmptyState";
import Button from "@/components/common/ui/Button";
import Spinner from "@/components/common/ui/Spinner";
import SnippetForm from "@/components/snippets/SnippetForm";
import { snippetsService } from "@/lib/api";
import { useSnippets } from "@/lib/hooks/useSnippets";
import { ROUTES } from "@/lib/constants/routes";
import type { Snippet } from "@/lib/types";

export default function EditSnippetPage() {
  const params = useParams();
  const router = useRouter();
  const { updateSnippet } = useSnippets();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await snippetsService.getById(params.id as string);
        setSnippet(data);
      } catch {
        setSnippet(null);
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
          title="Edit Snippet"
          actions={<BackButton href={ROUTES.snippets} label="Snippets" />}
        />
        <PageWrapper>
          <div className="flex justify-center py-20">
            <Spinner size="md" />
          </div>
        </PageWrapper>
      </>
    );
  }

  if (!snippet) {
    return (
      <>
        <TopBar
          title="Edit Snippet"
          actions={<BackButton href={ROUTES.snippets} label="Snippets" />}
        />
        <PageWrapper>
          <EmptyState
            icon={<Code2 size={20} style={{ color: "var(--snippet)" }} />}
            title="Snippet not found"
            description="This snippet may have been deleted or doesn't exist."
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push(ROUTES.snippets)}
              >
                Back to Snippets
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
        title="Edit Snippet"
        actions={
          <BackButton
            href={ROUTES.snippet(snippet.id)}
            label="Back to snippet"
          />
        }
      />
      <PageWrapper>
        <div className="max-w-2xl">
          <h1 className="text-xl font-semibold text-text-primary mb-1">
            Edit Snippet
          </h1>
          <p className="text-sm text-text-secondary mb-8">
            Update your saved snippet.
          </p>
          <SnippetForm
            initialValues={snippet}
            onSubmit={async (data) => {
              await updateSnippet(snippet.id, data);
              router.push(ROUTES.snippet(snippet.id));
            }}
            onCancel={() => router.push(ROUTES.snippet(snippet.id))}
          />
        </div>
      </PageWrapper>
    </>
  );
}
