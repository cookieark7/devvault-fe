"use client";

import { useRouter } from "next/navigation";
import TopBar from "@/components/common/layout/TopBar";
import PageWrapper from "@/components/common/layout/PageWrapper";
import BackButton from "@/components/common/layout/BackButton";
import PromptForm from "@/components/prompts/PromptForm";
import { usePrompts } from "@/lib/hooks/usePrompts";
import { ROUTES } from "@/lib/constants/routes";

export default function NewPromptPage() {
  const router = useRouter();
  const { createPrompt } = usePrompts();

  return (
    <>
      <TopBar
        title="New Prompt"
        actions={<BackButton href={ROUTES.prompts} />}
      />
      <PageWrapper>
        <div className="max-w-2xl">
          <h1 className="text-xl font-semibold text-text-primary mb-1">
            Save a Prompt
          </h1>
          <p className="text-sm text-text-secondary mb-8">
            Prompts that work, ready when you need them.
          </p>
          <PromptForm
            onSubmit={async (data) => {
              await createPrompt(data);
              router.push(ROUTES.prompts);
            }}
            onCancel={() => router.push(ROUTES.prompts)}
          />
        </div>
      </PageWrapper>
    </>
  );
}
