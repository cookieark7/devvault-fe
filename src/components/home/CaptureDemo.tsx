"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Terminal, Scissors, Search, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useTypewriter } from "./useTypewriter";

// One continuous story: the CLI saves a command, then search finds it by
// meaning — "rebuild" never appears in the saved text.
const CLI_CMD = ['dv save "docker compose up -d --build"'] as const;
const QUERY = ["how do i rebuild my containers"] as const;

const Cursor = ({ on }: { on: boolean }) => (
  <span
    className={cn(
      "inline-block w-[2px] h-[1.1em] align-[-0.2em] bg-text-primary ml-px",
      on && "dv-cursor-blink"
    )}
  />
);

function PaneHeader({
  icon: Icon,
  title,
}: {
  icon: typeof Terminal;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon size={16} strokeWidth={1.5} className="text-text-secondary" />
      <span className="text-sm font-medium text-text-primary">{title}</span>
    </div>
  );
}

function TerminalPane({ enabled }: { enabled: boolean }) {
  const { text, phase, done } = useTypewriter(CLI_CMD, { loop: false, enabled, typeMs: 62 });
  return (
    <div>
      <PaneHeader icon={Terminal} title="Terminal" />
      <div className="bg-bg-subtle border border-border-base rounded p-4 font-mono text-[13px] leading-6 min-h-[104px]">
        <div className="text-text-primary">
          <span className="text-text-tertiary mr-2">$</span>
          {text}
          <Cursor on={phase !== "typing"} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={done ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.25 }}
          className="mt-1 text-text-secondary"
        >
          <span style={{ color: "var(--command)" }}>✓</span> saved as{" "}
          <span
            className="px-1.5 rounded text-[12px]"
            style={{ color: "var(--command)", backgroundColor: "var(--command-muted)" }}
          >
            command
          </span>
          <span className="text-text-tertiary"> · docker, deploy</span>
        </motion.div>
      </div>
      <p className="mt-3 text-xs text-text-tertiary">
        Or pick from shell history — <span className="font-mono">dv save --from-history</span>
      </p>
    </div>
  );
}

function SnipPane({ enabled }: { enabled: boolean }) {
  return (
    <div>
      <PaneHeader icon={Scissors} title="Browser extension" />
      <div className="border border-border-base rounded overflow-hidden min-h-[104px]">
        <div className="flex items-center gap-2 px-3 h-7 bg-bg-subtle border-b border-border-base">
          <span className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-border-focus/60" />
            <span className="w-2 h-2 rounded-full bg-border-focus/60" />
            <span className="w-2 h-2 rounded-full bg-border-focus/60" />
          </span>
          <span className="text-[11px] text-text-tertiary font-mono truncate">
            docs.docker.com/compose/reference
          </span>
        </div>
        <div className="p-3 space-y-2 relative">
          <div className="h-2 rounded bg-bg-hover w-10/12" />
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={enabled ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.25, ease: "easeOut", delay: 0.7 }}
            className="relative border border-dashed border-accent rounded-[3px] p-2 space-y-2"
          >
            <div className="h-2 rounded bg-bg-hover w-11/12" />
            <div className="h-2 rounded bg-bg-hover w-7/12" />
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={enabled ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.2, ease: "easeOut", delay: 1.25 }}
              className="absolute -bottom-3 right-2 bg-accent text-white text-[11px] font-medium px-2 py-0.5 rounded shadow-notion-card"
            >
              Save to vault
            </motion.span>
          </motion.div>
          <div className="h-2 rounded bg-bg-hover w-5/12" />
        </div>
      </div>
      <p className="mt-3 text-xs text-text-tertiary">
        Snip any region — OCR runs on-device, no image leaves your browser.
      </p>
    </div>
  );
}

function SearchPane({ enabled }: { enabled: boolean }) {
  const { text, phase, done } = useTypewriter(QUERY, {
    loop: false,
    enabled,
    typeMs: 58,
    startDelayMs: 3300,
  });
  const row = "flex items-center gap-2.5 px-2 py-1.5 rounded text-sm";
  return (
    <div>
      <PaneHeader icon={Search} title="Search" />
      <div className="min-h-[104px]">
        <div className="flex items-center gap-2 h-9 px-3 border border-border-base rounded bg-bg-main text-sm text-text-primary">
          <Search size={14} strokeWidth={1.5} className="text-text-tertiary shrink-0" />
          <span className="truncate">
            {text}
            <Cursor on={phase !== "typing"} />
          </span>
        </div>
        <motion.div
          initial="hidden"
          animate={done ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
          className="mt-2"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 4 }, visible: { opacity: 1, y: 0 } }}
            className={row}
          >
            <Terminal size={14} strokeWidth={1.5} style={{ color: "var(--command)" }} />
            <span className="font-mono text-[13px] truncate">docker compose up -d --build</span>
            <span className="ml-auto text-xs text-text-tertiary">command</span>
          </motion.div>
          <motion.div
            variants={{ hidden: { opacity: 0, y: 4 }, visible: { opacity: 1, y: 0 } }}
            className={row}
          >
            <Bookmark size={14} strokeWidth={1.5} style={{ color: "var(--bookmark)" }} />
            <span className="truncate">Compose CLI reference</span>
            <span className="ml-auto text-xs text-text-tertiary">bookmark</span>
          </motion.div>
        </motion.div>
      </div>
      <p className="mt-3 text-xs text-text-tertiary">
        Semantic search — matches meaning, not just keywords.
      </p>
    </div>
  );
}

export default function CaptureDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const panes = [TerminalPane, SnipPane, SearchPane];

  return (
    <section id="capture" className="max-w-[1100px] mx-auto px-6 py-20 scroll-mt-14">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-text-primary">
          Capture from where you already work.
        </h2>
        <p className="mt-3 text-text-secondary leading-relaxed">
          Terminal, browser, or Claude Code — it all lands in one vault, and one
          search reaches all of it.
        </p>
      </div>

      <div ref={ref} className="mt-10 grid md:grid-cols-3 gap-4">
        {panes.map((Pane, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.25, ease: "easeOut", delay: i * 0.07 }}
            className="min-w-0 border border-border-base rounded p-5 bg-bg-main"
          >
            <Pane enabled={inView} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
