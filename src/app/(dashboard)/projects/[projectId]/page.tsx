"use client";

import { useParams } from "next/navigation";
import TopBar from "@/components/common/layout/TopBar";
import BackButton from "@/components/common/layout/BackButton";
import ProjectWorkspace from "@/components/projects/ProjectWorkspace";
import { ROUTES } from "@/lib/constants/routes";

export default function ProjectPage() {
  const params = useParams();
  const projectId = String(params.projectId);

  return (
    <>
      <TopBar
        title="Knowledge Hub"
        actions={<BackButton href={ROUTES.projects} label="Projects" />}
      />
      <ProjectWorkspace projectId={projectId} />
    </>
  );
}
