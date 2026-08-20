"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, FileText, Folder } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ROUTES } from "@/lib/constants/routes";
import type { ProjectTreeNode } from "@/lib/types";

interface NodeProps {
  node: ProjectTreeNode;
  projectId: string;
  activeDocId?: string;
  depth: number;
}

function TreeNodeItem({ node, projectId, activeDocId, depth }: NodeProps) {
  const [open, setOpen] = useState(true);
  const pad = { paddingLeft: `${depth * 12 + 8}px` };

  if (node.type === "dir") {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={pad}
          className="flex w-full items-center gap-1.5 rounded py-1 pr-2 text-sm text-text-secondary hover:bg-bg-hover"
        >
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <Folder size={14} className="text-text-tertiary" />
          <span className="truncate">{node.name}</span>
        </button>
        {open &&
          node.children.map((child) => (
            <TreeNodeItem
              key={child.path}
              node={child}
              projectId={projectId}
              activeDocId={activeDocId}
              depth={depth + 1}
            />
          ))}
      </div>
    );
  }

  const active = node.doc.id === activeDocId;
  return (
    <Link
      href={ROUTES.projectDoc(projectId, node.doc.id)}
      style={pad}
      className={cn(
        "flex items-center gap-1.5 rounded py-1 pr-2 text-sm transition-colors duration-100",
        active
          ? "bg-bg-hover font-medium text-text-primary"
          : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
      )}
    >
      <FileText size={14} className={cn(!active && "text-text-tertiary")} />
      <span className="truncate">{node.doc.title}</span>
    </Link>
  );
}

export default function DocTree({
  nodes,
  projectId,
  activeDocId,
}: {
  nodes: ProjectTreeNode[];
  projectId: string;
  activeDocId?: string;
}) {
  if (nodes.length === 0) {
    return <p className="px-2 py-3 text-xs text-text-tertiary">No documents yet.</p>;
  }
  return (
    <div className="space-y-0.5">
      {nodes.map((node) => (
        <TreeNodeItem
          key={node.path}
          node={node}
          projectId={projectId}
          activeDocId={activeDocId}
          depth={0}
        />
      ))}
    </div>
  );
}
