"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CopyButtonProps {
  text: string;
  size?: "sm" | "md";
  label?: string;
}

export default function CopyButton({
  text,
  size = "sm",
  label,
}: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "copied">("idle");

  const iconSize = size === "sm" ? 14 : 16;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setState("copied");
    setTimeout(() => setState("idle"), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center transition-colors duration-100",
        label ? "gap-1.5" : "",
        state === "copied"
          ? "text-success"
          : "text-text-secondary hover:text-text-primary"
      )}
    >
      {state === "idle" ? (
        <Copy size={iconSize} />
      ) : (
        <Check size={iconSize} />
      )}
      {label && <span className="text-sm">{label}</span>}
    </button>
  );
}
