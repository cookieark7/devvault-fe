"use client";

import { useLayoutEffect, useRef } from "react";
import { motion, useMotionValue, animate, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { TypePhase } from "./useTypewriter";

interface HighlightWordProps {
  text: string;
  phase: TypePhase;
  /** solid identity color — drives the dot cursor */
  color: string;
  /** 10% identity color — drives the pill background */
  muted: string;
  className?: string;
}

function Dot({ color, blinking }: { color: string; blinking?: boolean }) {
  return (
    <span
      className={cn(
        "inline-block shrink-0 rounded-full mr-[0.14em] transition-colors duration-300",
        blinking && "dv-cursor-blink"
      )}
      style={{ width: "0.24em", height: "0.24em", backgroundColor: color }}
    />
  );
}

/**
 * The live-typed word inside a resizing highlight pill. The pill's real CSS
 * width eases toward the natural width of [dot + text], measured from a hidden
 * clone — not framer's transform-based `layout`, which would squish the glyphs
 * while resizing. Pill and dot recolor per word so the slot takes on each
 * content type's identity; the text itself stays text-primary.
 */
export default function HighlightWord({
  text,
  phase,
  color,
  muted,
  className,
}: HighlightWordProps) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const mounted = useRef(false);
  const width = useMotionValue<number | "auto">("auto");
  const reduceMotion = useReducedMotion();
  const blinking = phase === "holding" || phase === "idle";

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const target = el.offsetWidth;
    if (!mounted.current || reduceMotion) {
      width.jump(target);
      mounted.current = true;
      return;
    }
    const controls = animate(width, target, { duration: 0.18, ease: "easeOut" });
    return () => controls.stop();
  }, [text, width, reduceMotion]);

  return (
    <motion.span
      className={cn(
        "relative inline-flex items-center align-middle box-content overflow-hidden rounded-[0.22em] px-[0.2em] py-[0.04em] mx-[0.02em] min-w-[0.6em] leading-none transition-colors duration-300",
        className
      )}
      style={{ width, backgroundColor: muted }}
    >
      <Dot color={color} blinking={blinking} />
      <span className="text-text-primary whitespace-pre">{text || "\u200B"}</span>
      {/* Hidden clone, measurement only */}
      <span
        ref={measureRef}
        aria-hidden="true"
        className="absolute left-0 top-0 invisible inline-flex items-center whitespace-pre pointer-events-none"
      >
        <Dot color={color} />
        {text || "\u200B"}
      </span>
    </motion.span>
  );
}
