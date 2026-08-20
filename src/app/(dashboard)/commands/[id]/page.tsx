"use client";

import { useParams, useRouter } from "next/navigation";
import { Terminal } from "lucide-react";
import TopBar from "@/components/common/layout/TopBar";
import PageWrapper from "@/components/common/layout/PageWrapper";
import BackButton from "@/components/common/layout/BackButton";
import CopyButton from "@/components/common/ui/CopyButton";
import EmptyState from "@/components/common/ui/EmptyState";
import Button from "@/components/common/ui/Button";
import CommandDetailPanel from "@/components/commands/CommandDetailPanel";
import { useCommands } from "@/lib/hooks/useCommands";
import { ROUTES } from "@/lib/constants/routes";

export default function CommandDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { commands, deleteCommand, toggleFavorite } = useCommands();

  const command = commands.find((c) => c.id === params.id);

  if (!command) {
    return (
      <>
        <TopBar
          title="Command"
          actions={<BackButton href={ROUTES.commands} label="Commands" />}
        />
        <PageWrapper>
          <EmptyState
            icon={<Terminal size={20} style={{ color: "var(--command)" }} />}
            title="Command not found"
            description="This command may have been deleted or doesn't exist."
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push(ROUTES.commands)}
              >
                Back to Commands
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
        title={command.title}
        actions={
          <div className="flex items-center gap-2">
            <CopyButton text={command.command} label="Copy command" size="md" />
            <BackButton href={ROUTES.commands} label="Commands" />
          </div>
        }
      />
      <PageWrapper>
        <CommandDetailPanel
          command={command}
          onEdit={() => router.push(`${ROUTES.command(command.id)}/edit`)}
          onDelete={async () => {
            await deleteCommand(command.id);
            router.push(ROUTES.commands);
          }}
          onFavorite={toggleFavorite}
        />
      </PageWrapper>
    </>
  );
}
