"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Terminal } from "lucide-react";
import TopBar from "@/components/common/layout/TopBar";
import PageWrapper from "@/components/common/layout/PageWrapper";
import BackButton from "@/components/common/layout/BackButton";
import EmptyState from "@/components/common/ui/EmptyState";
import Button from "@/components/common/ui/Button";
import Spinner from "@/components/common/ui/Spinner";
import CommandForm from "@/components/commands/CommandForm";
import { commandsService } from "@/lib/api";
import { useCommands } from "@/lib/hooks/useCommands";
import { ROUTES } from "@/lib/constants/routes";
import type { Command } from "@/lib/types";

export default function EditCommandPage() {
  const params = useParams();
  const router = useRouter();
  const { updateCommand } = useCommands();
  const [command, setCommand] = useState<Command | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await commandsService.getById(params.id as string);
        setCommand(data);
      } catch {
        setCommand(null);
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
          title="Edit Command"
          actions={<BackButton href={ROUTES.commands} label="Commands" />}
        />
        <PageWrapper>
          <div className="flex justify-center py-20">
            <Spinner size="md" />
          </div>
        </PageWrapper>
      </>
    );
  }

  if (!command) {
    return (
      <>
        <TopBar
          title="Edit Command"
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
        title="Edit Command"
        actions={
          <BackButton
            href={ROUTES.command(command.id)}
            label="Back to command"
          />
        }
      />
      <PageWrapper>
        <div className="max-w-2xl">
          <h1 className="text-xl font-semibold text-text-primary mb-1">
            Edit Command
          </h1>
          <p className="text-sm text-text-secondary mb-8">
            Update your saved command.
          </p>
          <CommandForm
            initialValues={command}
            onSubmit={async (data) => {
              await updateCommand(command.id, data);
              router.push(ROUTES.command(command.id));
            }}
            onCancel={() => router.push(ROUTES.command(command.id))}
          />
        </div>
      </PageWrapper>
    </>
  );
}
