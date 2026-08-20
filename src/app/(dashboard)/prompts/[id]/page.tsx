"use client";

import { useParams, useRouter } from "next/navigation";
import { Sparkles, Copy } from "lucide-react";
import TopBar from "@/components/common/layout/TopBar";
import PageWrapper from "@/components/common/layout/PageWrapper";
import BackButton from "@/components/common/layout/BackButton";
import EmptyState from "@/components/common/ui/EmptyState";
import Button from "@/components/common/ui/Button";
import PromptDetailPanel from "@/components/prompts/PromptDetailPanel";
import { usePrompts } from "@/lib/hooks/usePrompts";
import { ROUTES } from "@/lib/constants/routes";

export default function PromptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { prompts, deletePrompt, toggleFavorite } = usePrompts();

  const prompt = prompts.find((p) => p.id === params.id);

  if (!prompt) {
    return (
      <>
        <TopBar
          title="Prompt"
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
        title={prompt.title}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Copy size={14} />}
              onClick={() => navigator.clipboard.writeText(prompt.content)}
            >
              Copy Prompt
            </Button>
            <BackButton href={ROUTES.prompts} label="Prompts" />
          </div>
        }
      />
      <PageWrapper>
        <PromptDetailPanel
          prompt={prompt}
          onEdit={() => router.push(`${ROUTES.prompt(prompt.id)}/edit`)}
          onDelete={async () => {
            await deletePrompt(prompt.id);
            router.push(ROUTES.prompts);
          }}
          onFavorite={toggleFavorite}
        />
      </PageWrapper>
    </>
  );
}
