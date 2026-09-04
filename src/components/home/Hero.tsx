"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ROUTES } from "@/lib/constants/routes";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useTypewriter } from "./useTypewriter";
import HighlightWord from "./HighlightWord";

// The four content pillars, each carrying its own identity color into the pill.
const SLOT_WORDS = [
  { word: "snippet", color: "var(--snippet)", muted: "var(--snippet-muted)" },
  { word: "bookmark", color: "var(--bookmark)", muted: "var(--bookmark-muted)" },
  { word: "command", color: "var(--command)", muted: "var(--command-muted)" },
  { word: "prompt", color: "var(--prompt)", muted: "var(--prompt-muted)" },
] as const;
const WORDS = SLOT_WORDS.map((w) => w.word);

const item = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
};

/** Shared primary/secondary pair, aware of auth state. Reserves space while auth resolves — no wrong-state flash. */
export function HomeCtas({ className }: { className?: string }) {
  const { user, loading } = useAuth();
  const base =
    "inline-flex items-center justify-center h-10 px-4 text-sm font-medium rounded-md transition-colors duration-100";
  const primary = cn(base, "bg-accent text-white hover:bg-accent-hover");
  const secondary = cn(base, "bg-accent-muted text-accent hover:bg-[rgba(35,131,226,0.16)]");

  return (
    <div className={cn("flex items-center gap-3", loading && "invisible", className)}>
      {user ? (
        <>
          <Link href={ROUTES.home} className={primary}>
            Open your vault
            <ArrowRight size={16} strokeWidth={1.5} className="ml-1.5" />
          </Link>
          <Link href={ROUTES.settings} className={secondary}>
            API keys
          </Link>
        </>
      ) : (
        <>
          <Link href={ROUTES.register} className={primary}>
            Create your vault
          </Link>
          <Link href={ROUTES.login} className={secondary}>
            Sign in
          </Link>
        </>
      )}
    </div>
  );
}

export default function Hero() {
  const { text, index, phase } = useTypewriter(WORDS);
  const slot = SLOT_WORDS[index];

  return (
    <section className="max-w-[900px] mx-auto px-6 pt-20 md:pt-28 pb-16 text-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        {/*
          Fixed two-line structure: the pill's width changes per word, and
          letting the browser re-wrap would shift everything below on each
          cycle. Sizes are tuned so "[bookmark] again." fits line 2 at every
          breakpoint (≥375px).
        */}
        <motion.h1
          variants={item}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-[1.1] text-text-primary"
        >
          <span className="sr-only">
            Never lose a snippet, bookmark, command, or prompt again.
          </span>
          <span aria-hidden="true">
            Never lose a
            <br />
            <HighlightWord
              text={text}
              phase={phase}
              color={slot.color}
              muted={slot.muted}
            /> again.
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
        >
          Snippets, bookmarks, terminal commands, and AI prompts — captured from
          your terminal, browser, or Claude Code, and found again by meaning,
          not just keywords.
        </motion.p>

        <motion.div variants={item}>
          <HomeCtas className="justify-center mt-8" />
        </motion.div>

        <motion.p
          variants={item}
          className="mt-5 text-xs text-text-tertiary font-mono"
        >
          npm install -g devvault-cli
        </motion.p>
      </motion.div>
    </section>
  );
}
