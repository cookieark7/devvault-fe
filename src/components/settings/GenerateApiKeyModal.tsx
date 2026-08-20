"use client";

import { useState } from "react";
import { AlertTriangle, KeyRound } from "lucide-react";
import Modal from "@/components/common/ui/Modal";
import Button from "@/components/common/ui/Button";
import Input from "@/components/common/ui/Input";
import CopyButton from "@/components/common/ui/CopyButton";
import type { CreateApiKeyInput, CreatedApiKey } from "@/lib/types";

interface GenerateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (input: CreateApiKeyInput) => Promise<CreatedApiKey>;
}

export default function GenerateApiKeyModal({
  isOpen,
  onClose,
  onCreate,
}: GenerateApiKeyModalProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedApiKey | null>(null);

  const reset = () => {
    setName("");
    setError(null);
    setCreated(null);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Give the key a name so you can recognize it later.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const result = await onCreate({ name: trimmed });
      setCreated(result);
    } catch (err: any) {
      setError(err.message || "Could not create the key. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Reveal phase — the plaintext key is shown exactly once ──
  if (created) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Copy your API key"
        footer={<Button onClick={handleClose}>Done</Button>}
      >
        <div className="space-y-4">
          <div className="flex items-start gap-2 rounded border border-warning/30 bg-warning/10 px-3 py-2.5">
            <AlertTriangle
              size={15}
              className="text-warning mt-0.5 flex-shrink-0"
            />
            <p className="text-sm text-text-secondary">
              This is the only time you&apos;ll see{" "}
              <span className="text-text-primary font-medium">
                {created.name}
              </span>
              . Copy it now and store it somewhere safe — you can&apos;t view it
              again.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded border border-border-base bg-bg-subtle px-3 py-2.5">
            <code className="flex-1 text-sm text-text-primary font-mono break-all">
              {created.key}
            </code>
            <CopyButton text={created.key} />
          </div>

          <p className="text-xs text-text-tertiary">
            Use it from the CLI with{" "}
            <code className="font-mono text-text-secondary">
              dv auth token &lt;key&gt;
            </code>{" "}
            or the{" "}
            <code className="font-mono text-text-secondary">DEVVAULT_TOKEN</code>{" "}
            environment variable.
          </p>
        </div>
      </Modal>
    );
  }

  // ── Form phase ──
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Generate API key"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            leftIcon={<KeyRound size={14} />}
          >
            Generate key
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <Input
          label="Key name"
          placeholder="e.g. laptop, ci-pipeline"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error ?? undefined}
          hint="A label to help you identify this key. It doesn't affect access."
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
        />
      </div>
    </Modal>
  );
}
