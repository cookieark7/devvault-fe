import { Code2, Bookmark, Terminal, Sparkles, BookOpen, type LucideIcon } from "lucide-react";
import { CONTENT_TYPES } from "@/lib/constants/content-types";

interface Pillar {
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  muted: string;
}

// Labels/descriptions come from the app's own content-type registry so the
// homepage can't drift from what the vault actually stores.
const PILLARS: Pillar[] = [
  { ...CONTENT_TYPES.snippet, icon: Code2, muted: "var(--snippet-muted)" },
  { ...CONTENT_TYPES.bookmark, icon: Bookmark, muted: "var(--bookmark-muted)" },
  { ...CONTENT_TYPES.command, icon: Terminal, muted: "var(--command-muted)" },
  { ...CONTENT_TYPES.prompt, icon: Sparkles, muted: "var(--prompt-muted)" },
];

function IconTile({ icon: Icon, color, muted }: Pick<Pillar, "icon" | "color" | "muted">) {
  return (
    <span
      className="w-9 h-9 rounded flex items-center justify-center shrink-0"
      style={{ backgroundColor: muted }}
    >
      <Icon size={18} strokeWidth={1.5} style={{ color }} />
    </span>
  );
}

export default function Pillars() {
  return (
    <section
      id="library"
      className="max-w-[1100px] mx-auto px-6 py-20 border-t border-border-base scroll-mt-14"
    >
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-text-primary">
          One vault. Four kinds of knowledge.
        </h2>
        <p className="mt-3 text-text-secondary leading-relaxed">
          Each type keeps its shape — code stays highlighted, commands stay
          monospaced, bookmarks keep their favicon, prompts stay ready to paste.
        </p>
      </div>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PILLARS.map((p) => (
          <div
            key={p.label}
            className="border border-border-base rounded p-4 hover:shadow-notion-card transition-shadow duration-100"
          >
            <IconTile icon={p.icon} color={p.color} muted={p.muted} />
            <div className="mt-3 font-medium text-text-primary">{p.label}</div>
            <p className="mt-1 text-sm text-text-secondary leading-relaxed">{p.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 border border-border-base rounded p-4 flex items-start gap-4 hover:shadow-notion-card transition-shadow duration-100">
        <IconTile icon={BookOpen} color="#14B8A6" muted="rgba(20, 184, 166, 0.1)" />
        <div>
          <div className="font-medium text-text-primary">Plus a knowledge hub for project docs</div>
          <p className="mt-1 text-sm text-text-secondary leading-relaxed">
            Sync a folder of markdown per project — Mermaid diagrams render
            inline, and every doc is searchable alongside your snippets.
          </p>
        </div>
      </div>
    </section>
  );
}
