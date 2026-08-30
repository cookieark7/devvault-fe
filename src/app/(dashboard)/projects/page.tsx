"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, FileText, RefreshCw, Upload } from "lucide-react";
import TopBar from "@/components/common/layout/TopBar";
import PageWrapper from "@/components/common/layout/PageWrapper";
import Button from "@/components/common/ui/Button";
import EmptyState from "@/components/common/ui/EmptyState";
import UploadDocModal from "@/components/projects/UploadDocModal";
import { useProjects } from "@/lib/hooks/useProjects";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

export default function ProjectsPage() {
  const { projects, isLoading, isSyncing, error, sync, refetch } = useProjects();
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <>
      <TopBar
        title="Projects"
        subtitle="Knowledge hub"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<RefreshCw size={14} className={cn(isSyncing && "animate-spin")} />}
              onClick={() => sync()}
              disabled={isSyncing}
            >
              {isSyncing ? "Syncing…" : "Sync"}
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Upload size={14} />}
              onClick={() => setUploadOpen(true)}
            >
              Upload
            </Button>
          </div>
        }
      />
      <UploadDocModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={refetch}
      />
      <PageWrapper>
        {error && <p className="mb-4 text-sm text-error">{error}</p>}

        {isLoading ? (
          <p className="text-sm text-text-tertiary">Loading…</p>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={20} style={{ color: "#14B8A6" }} />}
            title="No projects yet"
            description="Click Upload to add a markdown doc, or Sync to import existing ones."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={ROUTES.project(p.id)}
                className="rounded-lg border border-border-base p-4 transition-colors duration-100 hover:bg-bg-hover"
              >
                <div className="flex items-center gap-2">
                  <BookOpen size={16} style={{ color: "#14B8A6" }} />
                  <span className="font-medium text-text-primary">{p.name}</span>
                </div>
                {p.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{p.description}</p>
                )}
                <p className="mt-2 flex items-center gap-1 text-xs text-text-tertiary">
                  <FileText size={12} /> {p.docCount} doc{p.docCount === 1 ? "" : "s"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </PageWrapper>
    </>
  );
}
