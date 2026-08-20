"use client";

import { BookOpen } from "lucide-react";
import MarkdownView from "@/components/markdown/MarkdownView";
import { useDocContent, useProjectTree } from "@/lib/hooks/useProjects";
import DocTree from "./DocTree";

export default function ProjectWorkspace({
  projectId,
  docId,
}: {
  projectId: string;
  docId?: string;
}) {
  const { data, isLoading: treeLoading, error: treeError } = useProjectTree(projectId);
  const { doc, isLoading: docLoading, error: docError } = useDocContent(projectId, docId);

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
              <p className="mb-4 font-mono text-xs text-text-tertiary">{doc.relPath}</p>
              <MarkdownView content={doc.content} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
