"use client";

import { useState } from "react";
import { KeyRound, Plus, Trash2 } from "lucide-react";
import TopBar from "@/components/common/layout/TopBar";
import PageWrapper from "@/components/common/layout/PageWrapper";
import Button from "@/components/common/ui/Button";
import Modal from "@/components/common/ui/Modal";
import Spinner from "@/components/common/ui/Spinner";
import EmptyState from "@/components/common/ui/EmptyState";
import GenerateApiKeyModal from "@/components/settings/GenerateApiKeyModal";
import { useApiKeys } from "@/lib/hooks/useApiKeys";
import type { ApiKey } from "@/lib/types";

const formatDate = (iso: string | null): string => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function SettingsPage() {
  const { keys, isLoading, error, createKey, revokeKey } = useApiKeys();
  const [isGenerateOpen, setGenerateOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<ApiKey | null>(null);
  const [isRevoking, setRevoking] = useState(false);

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    setRevoking(true);
    try {
      await revokeKey(revokeTarget.id);
      setRevokeTarget(null);
    } finally {
      setRevoking(false);
    }
  };

  return (
    <>
      <TopBar
        title="Settings"
        subtitle="API Keys"
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => setGenerateOpen(true)}
          >
            Generate key
          </Button>
        }
      />

      <PageWrapper>
        <div className="mb-6">
          <h2 className="text-sm font-medium text-text-primary">API Keys</h2>
          <p className="text-sm text-text-secondary mt-1 max-w-xl">
            Personal access keys let the DevVault CLI and scripts authenticate
            without your password. Treat them like passwords — anyone with a key
            has full access to your vault.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="sm" />
          </div>
        ) : keys.length === 0 ? (
          <EmptyState
            icon={<KeyRound size={20} />}
            title="No API keys yet"
            description="Generate a key to use DevVault from the CLI or CI."
            action={
              <Button
                size="sm"
                leftIcon={<Plus size={14} />}
                onClick={() => setGenerateOpen(true)}
              >
                Generate key
              </Button>
            }
          />
        ) : (
          <div className="border border-border-base rounded-md divide-y divide-border-base overflow-hidden">
            {keys.map((key) => (
              <div
                key={key.id}
                className="flex items-center gap-3 px-4 py-3 bg-bg-main"
              >
                <div className="w-8 h-8 rounded bg-bg-subtle border border-border-base flex items-center justify-center text-text-secondary flex-shrink-0">
                  <KeyRound size={15} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary truncate">
                      {key.name}
                    </span>
                    <code className="text-xs font-mono text-text-tertiary bg-bg-subtle rounded px-1.5 py-0.5">
                      {key.prefix}…
                    </code>
                  </div>
                  <div className="text-xs text-text-tertiary mt-0.5">
                    Created {formatDate(key.createdAt)} ·{" "}
                    {key.lastUsedAt
                      ? `Last used ${formatDate(key.lastUsedAt)}`
                      : "Never used"}
                    {key.expiresAt ? ` · Expires ${formatDate(key.expiresAt)}` : ""}
                  </div>
                </div>

                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={<Trash2 size={14} />}
                  onClick={() => setRevokeTarget(key)}
                >
                  Revoke
                </Button>
              </div>
            ))}
          </div>
        )}
      </PageWrapper>

      <GenerateApiKeyModal
        isOpen={isGenerateOpen}
        onClose={() => setGenerateOpen(false)}
        onCreate={createKey}
      />

      <Modal
        isOpen={!!revokeTarget}
        onClose={() => (isRevoking ? undefined : setRevokeTarget(null))}
        title="Revoke API key"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setRevokeTarget(null)}
              disabled={isRevoking}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleRevoke} isLoading={isRevoking}>
              Revoke key
            </Button>
          </>
        }
      >
        <p className="text-sm text-text-secondary">
          Revoke{" "}
          <span className="text-text-primary font-medium">
            {revokeTarget?.name}
          </span>
          ? Any CLI or script using it will immediately stop working. This can&apos;t
          be undone.
        </p>
      </Modal>
    </>
  );
}
