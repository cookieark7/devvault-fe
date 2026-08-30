"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CopyButtonProps {
  text: string;
  size?: "sm" | "md";
  label?: string;
  /** Text shown briefly after a successful copy. Defaults to "Copied!". */
  copiedLabel?: string;
}

/** Copy text to the clipboard, with a graceful fallback for insecure contexts. */
async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    // navigator.clipboard is unavailable over plain HTTP / older browsers.
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } finally {
      document.body.removeChild(ta);
    }
  }
}

export default function CopyButton({
  text,
  size = "sm",
  label,
  copiedLabel = "Copied!",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const iconSize = size === "sm" ? 14 : 16;

  const handleCopy = async () => {
    await copyText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : label || "Copy"}
      title={copied ? copiedLabel : label || "Copy"}
      className={cn(
        "inline-flex items-center transition-colors duration-100",
        label ? "gap-1.5" : "",
        copied ? "text-success" : "text-text-secondary hover:text-text-primary"
      )}
    >
      <span
        className={cn(
          "inline-flex transition-transform duration-150",
          copied ? "scale-125" : "scale-100"
        )}
      >
        {copied ? <Check size={iconSize} /> : <Copy size={iconSize} />}
      </span>
      {label && <span className="text-sm">{copied ? copiedLabel : label}</span>}
    </button>
  );
}
