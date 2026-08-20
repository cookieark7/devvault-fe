"use client";

import { useRouter } from "next/navigation";
import TopBar from "@/components/common/layout/TopBar";
import PageWrapper from "@/components/common/layout/PageWrapper";
import BackButton from "@/components/common/layout/BackButton";
import CommandForm from "@/components/commands/CommandForm";
import { useCommands } from "@/lib/hooks/useCommands";
import { ROUTES } from "@/lib/constants/routes";

export default function NewCommandPage() {
  const router = useRouter();
  const { createCommand } = useCommands();

  return (
    <>
      <TopBar
        title="New Command"
        actions={<BackButton href={ROUTES.commands} />}
      />
      <PageWrapper>
        <div className="max-w-2xl">
          <h1 className="text-xl font-semibold text-text-primary mb-1">
            Save a Command
          </h1>
          <p className="text-sm text-text-secondary mb-8">
            Terminal commands, always at hand.
          </p>
          <CommandForm
            onSubmit={async (data) => {
              await createCommand(data);
              router.push(ROUTES.commands);
            }}
            onCancel={() => router.push(ROUTES.commands)}
          />
        </div>
      </PageWrapper>
    </>
  );
}
