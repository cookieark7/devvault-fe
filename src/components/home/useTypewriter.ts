"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export type TypePhase = "idle" | "typing" | "holding" | "deleting";

interface TypewriterOptions {
  /** ms per typed character (jittered ±~20ms for a human feel) */
  typeMs?: number;
  /** ms per deleted character — backspace is faster than typing */
  deleteMs?: number;
  /** how long a finished word sits before deleting */
  holdMs?: number;
  /** pause on the empty slot between words */
  gapMs?: number;
  /** delay before the first character */
  startDelayMs?: number;
  /** cycle forever, or stop on the last word */
  loop?: boolean;
  /** gate the whole thing (e.g. until scrolled into view) */
  enabled?: boolean;
}

interface TypewriterState {
  index: number;
  len: number;
  phase: TypePhase;
}

/**
 * Drives a type → hold → delete → next-word loop with a single setTimeout chain.
 * Under prefers-reduced-motion the first word is shown fully with no timers —
 * derived at render time rather than via state, so the effect never sets state
 * synchronously. Pass `words` as a module-level constant so the effect isn't
 * re-armed on every render.
 */
export function useTypewriter(
  words: readonly string[],
  {
    typeMs = 75,
    deleteMs = 38,
    holdMs = 1700,
    gapMs = 380,
    startDelayMs = 350,
    loop = true,
    enabled = true,
  }: TypewriterOptions = {}
) {
  const reduceMotion = useReducedMotion();
  const [state, setState] = useState<TypewriterState>({
    index: 0,
    len: 0,
    phase: "idle",
  });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled || reduceMotion || words.length === 0) return;

    const word = words[state.index] ?? "";
    let delay = typeMs;
    let next: TypewriterState = state;

    switch (state.phase) {
      case "idle":
        delay = startDelayMs;
        next = { ...state, phase: "typing" };
        break;
      case "typing":
        if (state.len < word.length) {
          delay = typeMs + (Math.random() * 40 - 15);
          next = { ...state, len: state.len + 1 };
        } else {
          delay = 0;
          next = { ...state, phase: "holding" };
        }
        break;
      case "holding":
        if (!loop && state.index === words.length - 1) return;
        delay = holdMs;
        next = { ...state, phase: "deleting" };
        break;
      case "deleting":
        if (state.len > 0) {
          delay = deleteMs;
          next = { ...state, len: state.len - 1 };
        } else {
          delay = gapMs;
          next = { index: (state.index + 1) % words.length, len: 0, phase: "typing" };
        }
        break;
    }

    timer.current = setTimeout(() => setState(next), Math.max(0, delay));
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [state, enabled, reduceMotion, words, typeMs, deleteMs, holdMs, gapMs, startDelayMs, loop]);

  if (reduceMotion) {
    return { text: words[0] ?? "", index: 0, phase: "holding" as TypePhase, done: true };
  }

  const text = (words[state.index] ?? "").slice(0, state.len);
  const done = state.phase === "holding" && state.index === words.length - 1;

  return { text, index: state.index, phase: state.phase, done };
}
