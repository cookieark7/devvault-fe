"use client";

import { useParams } from "next/navigation";
import TopBar from "@/components/common/layout/TopBar";
import BackButton from "@/components/common/layout/BackButton";
import ProjectWorkspace from "@/components/projects/ProjectWorkspace";
import { ROUTES } from "@/lib/constants/routes";

export default function ProjectDocPage() {
  const params = useParams();
  const projectId = String(params.projectId);
  const docId = String(params.docId);

  return (
    <>
      <TopBar
        title="Knowledge Hub"
        actions={<BackButton href={ROUTES.project(projectId)} label="Project" />}
      />
      <ProjectWorkspace projectId={projectId} docId={docId} />
    </>
  );
}
