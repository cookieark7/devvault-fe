"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Trash2 } from "lucide-react";
import MarkdownView from "@/components/markdown/MarkdownView";
import Button from "@/components/common/ui/Button";
import { projectsService } from "@/lib/api";
import { useDocContent, useProjectTree } from "@/lib/hooks/useProjects";
import { ROUTES } from "@/lib/constants/routes";
import DocTree from "./DocTree";

export default function ProjectWorkspace({
  projectId,
  docId,
}: {
  projectId: string;
  docId?: string;
}) {
  const router = useRouter();
  const { data, isLoading: treeLoading, error: treeError } = useProjectTree(projectId);
  const { doc, isLoading: docLoading, error: docError } = useDocContent(projectId, docId);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!docId) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await projectsService.deleteDoc(projectId, docId);
      router.push(ROUTES.project(projectId));
    } catch (err: any) {
      setDeleteError(err?.message || "Failed to delete document.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex">
      {/* Document tree (sticky under the h-12 TopBar) */}
      <aside className="hidden w-64 shrink-0 self-start sticky top-12 max-h-[calc(100vh-3rem)] overflow-y-auto border-r border-border-base p-2 md:block">
        {treeLoading && <p className="px-2 py-3 text-xs text-text-tertiary">Loading…</p>}
        {treeError && <p className="px-2 py-3 text-xs text-error">{treeError}</p>}
        {data && (
          <>
            <div className="px-2 pb-2 pt-1">
              <p className="truncate text-sm font-semibold text-text-primary">{data.project.name}</p>
              <p className="text-xs text-text-tertiary">
                {data.project.docCount} doc{data.project.docCount === 1 ? "" : "s"}
              </p>
            </div>
            <DocTree nodes={data.tree} projectId={projectId} activeDocId={docId} />
          </>
        )}
      </aside>

      {/* Content */}
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-3xl px-6 py-8 md:px-10">
          {!docId && (
            <div className="py-20 text-center text-text-tertiary">
              <BookOpen size={28} className="mx-auto mb-3 opacity-60" />
              <p className="text-sm">Select a document from the tree to start reading.</p>
            </div>
          )}
          {docId && docLoading && <p className="text-sm text-text-tertiary">Loading document…</p>}
          {docId && docError && <p className="text-sm text-error">{docError}</p>}
          {docId && doc && (
            <>
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="min-w-0 truncate font-mono text-xs text-text-tertiary">{doc.relPath}</p>
                {confirmDelete ? (
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <span className="text-xs text-text-secondary">Delete this document?</span>
                    <Button variant="danger" size="sm" onClick={handleDelete} disabled={isDeleting}>
                      {isDeleting ? "Deleting…" : "Confirm"}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setConfirmDelete(false)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={<Trash2 size={14} />}
                    onClick={() => setConfirmDelete(true)}
                    className="flex-shrink-0"
                  >
                    Delete
                  </Button>
                )}
              </div>
              {deleteError && <p className="mb-3 text-sm text-error">{deleteError}</p>}
              <MarkdownView content={doc.content} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
