"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import TopBar from "@/components/common/layout/TopBar";
import PageWrapper from "@/components/common/layout/PageWrapper";
import BackButton from "@/components/common/layout/BackButton";
import EmptyState from "@/components/common/ui/EmptyState";
import Button from "@/components/common/ui/Button";
import Spinner from "@/components/common/ui/Spinner";
import PromptForm from "@/components/prompts/PromptForm";
import { promptsService } from "@/lib/api";
import { usePrompts } from "@/lib/hooks/usePrompts";
import { ROUTES } from "@/lib/constants/routes";
import type { Prompt } from "@/lib/types";

export default function EditPromptPage() {
  const params = useParams();
  const router = useRouter();
  const { updatePrompt } = usePrompts();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await promptsService.getById(params.id as string);
        setPrompt(data);
      } catch {
        setPrompt(null);
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
          title="Edit Prompt"
          actions={<BackButton href={ROUTES.prompts} label="Prompts" />}
        />
        <PageWrapper>
          <div className="flex justify-center py-20">
            <Spinner size="md" />
          </div>
        </PageWrapper>
      </>
    );
  }

  if (!prompt) {
    return (
      <>
        <TopBar
          title="Edit Prompt"
          actions={<BackButton href={ROUTES.prompts} label="Prompts" />}
        />
        <PageWrapper>
          <EmptyState
            icon={<Sparkles size={20} style={{ color: "var(--prompt)" }} />}
            title="Prompt not found"
            description="This prompt may have been deleted or doesn't exist."
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push(ROUTES.prompts)}
              >
                Back to Prompts
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
        title="Edit Prompt"
        actions={
          <BackButton href={ROUTES.prompt(prompt.id)} label="Back to prompt" />
        }
      />
      <PageWrapper>
        <div className="max-w-2xl">
          <h1 className="text-xl font-semibold text-text-primary mb-1">
            Edit Prompt
          </h1>
          <p className="text-sm text-text-secondary mb-8">
            Update your saved prompt.
          </p>
          <PromptForm
            initialValues={prompt}
            onSubmit={async (data) => {
              await updatePrompt(prompt.id, data);
              router.push(ROUTES.prompt(prompt.id));
            }}
            onCancel={() => router.push(ROUTES.prompt(prompt.id))}
          />
        </div>
      </PageWrapper>
    </>
  );
}
