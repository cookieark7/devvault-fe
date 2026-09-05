"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { Terminal, Scissors, Search, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useTypewriter } from "./useTypewriter";
import { useSnipCycle, type SnipPhase } from "./useSnipCycle";

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

function PaneHeader({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <span className="text-sm font-medium text-text-primary">{title}</span>
    </div>
  );
}

/* ── Terminal ─────────────────────────────────────────────────────── */

function TerminalPane({ enabled }: { enabled: boolean }) {
  // Loops: types, holds with the result, erases, retypes — so the pane still
  // demonstrates something when it is scrolled back to.
  const { text, phase } = useTypewriter(CLI_CMD, { enabled, typeMs: 62, holdMs: 2600 });
  const settled = phase === "holding";

  return (
    <div>
      <PaneHeader
        icon={<Terminal size={16} strokeWidth={1.5} className="text-text-secondary" />}
        title="Terminal"
      />
      <div className="bg-bg-subtle border border-border-base rounded p-4 font-mono text-[13px] leading-6 min-h-[104px]">
        <div className="text-text-primary">
          <span className="text-text-tertiary mr-2">$</span>
          {text}
          <Cursor on={phase !== "typing"} />
        </div>
        <motion.div
          initial={false}
          animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
          transition={{ duration: 0.2, ease: "easeOut", delay: settled ? 0.2 : 0 }}
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

/* ── Browser extension ────────────────────────────────────────────── */

const LINE_H = 18;

// Page "content" to crop out of — a plain compose file, so the selection is
// visibly landing on text rather than on abstract grey bars.
const PAGE_LINES = [
  "services:",
  "  api:",
  "    build: .",
  "    ports:",
  '      - "8080:8080"',
  "    restart: on-failure",
];

// Each pass grabs a different block, so the crop lands somewhere new.
const REGIONS = [
  { start: 1, count: 2 },
  { start: 3, count: 3 },
  { start: 0, count: 2 },
];

const isCut = (p: SnipPhase) => p === "snip" || p === "lifted";

function SnipPane({ enabled }: { enabled: boolean }) {
  const { phase, regionIndex } = useSnipCycle(REGIONS.length, enabled);
  const region = REGIONS[regionIndex];

  const visible = phase !== "idle" && phase !== "out";
  const targetHeight = region.count * LINE_H;

  return (
    <div>
      <PaneHeader
        icon={
          <motion.span
            className="inline-flex text-text-secondary"
            // The blades close exactly on the "snip" beat.
            animate={phase === "snip" ? { rotate: [0, -20, 8, 0] } : { rotate: 0 }}
            transition={{ duration: 0.38, ease: "easeOut" }}
            style={{ originX: 0.5, originY: 0.8 }}
          >
            <Scissors size={16} strokeWidth={1.5} />
          </motion.span>
        }
        title="Browser extension"
      />

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

        <div className="p-3">
          <div className="relative" style={{ height: PAGE_LINES.length * LINE_H }}>
            {PAGE_LINES.map((line) => (
              <div
                key={line}
                className="font-mono text-[11px] text-text-tertiary whitespace-pre"
                style={{ height: LINE_H, lineHeight: `${LINE_H}px` }}
              >
                {line}
              </div>
            ))}

            {/* The selection: crops in by growing from the top of the block,
                flashes as it is cut, lifts away, then crops back out. */}
            <motion.div
              className="absolute left-0 right-0 rounded-[3px] pointer-events-none"
              initial={false}
              animate={{
                top: region.start * LINE_H,
                height: visible ? targetHeight : 0,
                opacity: visible ? 1 : 0,
                y: phase === "lifted" ? -3 : 0,
                scale: phase === "lifted" ? 0.985 : 1,
                backgroundColor: isCut(phase)
                  ? "var(--accent-muted)"
                  : "rgba(35,131,226,0.04)",
              }}
              transition={{
                duration: phase === "cropping" ? 0.5 : 0.3,
                ease: "easeOut",
              }}
              style={{
                border: "1px dashed var(--accent)",
                borderStyle: isCut(phase) ? "solid" : "dashed",
              }}
            >
              <motion.span
                initial={false}
                animate={
                  phase === "lifted"
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 4 }
                }
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute -bottom-2.5 right-1 bg-accent text-white text-[11px] font-medium px-2 py-0.5 rounded shadow-notion-card"
              >
                Save to vault
              </motion.span>
            </motion.div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-text-tertiary">
        Snip any region — OCR runs on-device, no image leaves your browser.
      </p>
    </div>
  );
}

/* ── Search ───────────────────────────────────────────────────────── */

function SearchPane({ enabled }: { enabled: boolean }) {
  const { text, phase } = useTypewriter(QUERY, {
    enabled,
    typeMs: 58,
    startDelayMs: 3300,
    holdMs: 3000,
  });
  const settled = phase === "holding";
  const row = "flex items-center gap-2.5 px-2 py-1.5 rounded text-sm";

  return (
    <div>
      <PaneHeader
        icon={<Search size={16} strokeWidth={1.5} className="text-text-secondary" />}
        title="Search"
      />
      <div className="min-h-[104px]">
        <div className="flex items-center gap-2 h-9 px-3 border border-border-base rounded bg-bg-main text-sm text-text-primary">
          <Search size={14} strokeWidth={1.5} className="text-text-tertiary shrink-0" />
          <span className="truncate">
            {text}
            <Cursor on={phase !== "typing"} />
          </span>
        </div>
        <motion.div
          initial={false}
          animate={settled ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } } }}
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

/* ── Section ──────────────────────────────────────────────────────── */

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
