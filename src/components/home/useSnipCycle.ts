"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/** idle → cropping (drag a selection) → snip (scissors close) → lifted (chip) → out (clear). */
export type SnipPhase = "idle" | "cropping" | "snip" | "lifted" | "out";

const ORDER: SnipPhase[] = ["idle", "cropping", "snip", "lifted", "out"];

const DURATION: Record<SnipPhase, number> = {
  idle: 450,
  cropping: 620,
  snip: 380,
  lifted: 1150,
  out: 480,
};

/**
 * Drives the browser-extension snip loop. Each pass selects a different block of
 * lines so the crop lands somewhere new, and `phase` is shared with the scissors
 * icon so the cut reads as one motion.
 */
export function useSnipCycle(regionCount: number, enabled = true) {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled || reduceMotion) return;

    const phase = ORDER[step % ORDER.length];
    timer.current = setTimeout(() => setStep((s) => s + 1), DURATION[phase]);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [step, enabled, reduceMotion]);

  // Reduced motion: hold one finished selection, no timers, no cycling.
  if (reduceMotion) return { phase: "lifted" as SnipPhase, regionIndex: 0 };

  return {
    phase: ORDER[step % ORDER.length],
    regionIndex: Math.floor(step / ORDER.length) % regionCount,
  };
}
