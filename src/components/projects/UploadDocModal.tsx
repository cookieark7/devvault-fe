"use client";

import { useRef, useState } from "react";
import { Upload, FileText } from "lucide-react";
import Modal from "@/components/common/ui/Modal";
import Button from "@/components/common/ui/Button";
import Input from "@/components/common/ui/Input";
import { projectsService } from "@/lib/api";

interface UploadDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Prefill the project field (e.g. when opened from a project page). */
  defaultProject?: string;
  /** Called after a successful upload so the caller can refresh. */
  onUploaded?: () => void;
}

const isMarkdown = (name: string) => /\.(md|markdown)$/i.test(name);

export default function UploadDocModal({
  isOpen,
  onClose,
  defaultProject = "",
  onUploaded,
}: UploadDocModalProps) {
  const [project, setProject] = useState(defaultProject);
  const [relPath, setRelPath] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setProject(defaultProject);
    setRelPath("");
    setContent("");
    setError(null);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!isMarkdown(file.name)) {
      setError("Only .md / .markdown files are supported.");
      return;
    }
    setError(null);
    setContent(await file.text());
    if (!relPath.trim()) setRelPath(file.name);
  };

  const handleSubmit = async () => {
    const p = project.trim();
    const path = relPath.trim().replace(/^\/+/, "");
    if (!p) return setError("Project is required.");
    if (!path) return setError("A file path (e.g. guides/deploy.md) is required.");
    if (!isMarkdown(path)) return setError("Path must end in .md or .markdown.");
    if (!content.trim()) return setError("Document content is empty.");

    setIsSubmitting(true);
    setError(null);
    try {
      await projectsService.uploadDoc({ project: p, relPath: path, content });
      onUploaded?.();
      handleClose();
    } catch (err: any) {
      setError(err?.message || "Upload failed.");
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload document">
      <div className="space-y-4">
        <p className="text-sm text-text-secondary">
          Uploads to your own knowledge hub. The file is stored securely and appears
          under the project below.
        </p>

        <Input
          label="Project"
          placeholder="getting-started"
          value={project}
          onChange={(e) => setProject(e.target.value)}
        />

        <Input
          label="Path (within the project)"
          placeholder="guides/deploy.md"
          value={relPath}
          onChange={(e) => setRelPath(e.target.value)}
          hint="Folders are created from the path, e.g. guides/deploy.md"
        />

        <div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded border border-border-base px-3 py-1.5 text-sm text-text-secondary transition-colors duration-100 hover:bg-bg-hover"
          >
            <Upload size={14} /> Choose a .md file
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".md,.markdown,text/markdown"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <span className="ml-2 text-xs text-text-tertiary">or paste/edit below</span>
        </div>

        <div>
          <label className="mb-1 flex items-center gap-1.5 text-sm text-text-secondary">
            <FileText size={14} /> Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            placeholder="# My document&#10;&#10;Markdown content…"
            className="w-full resize-y rounded border border-border-base bg-bg-subtle px-3 py-2 font-mono text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-border-focus focus:ring-2 focus:ring-accent/20"
          />
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Upload size={14} />}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Uploading…" : "Upload"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
