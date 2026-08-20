"use client";

import { useEffect, useId, useState } from "react";

/**
 * Renders a single Mermaid diagram from its source. The app is a light theme,
 * so we use mermaid's "default" theme with strict sanitization.
 */
export default function Mermaid({ code }: { code: string }) {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const rawId = useId();
  const id = "mmd-" + rawId.replace(/[^a-zA-Z0-9]/g, "");

  useEffect(() => {
    let cancelled = false;
    // Client-only dynamic import: mermaid touches browser globals and must not
    // load during server-side rendering.
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({ startOnLoad: false, theme: "default", securityLevel: "strict" });
        const res = await mermaid.render(id, code);
        if (!cancelled) {
          setSvg(res.svg);
          setError(null);
        }
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to render diagram");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code, id]);

  if (error) {
    return (
      <pre className="my-4 overflow-x-auto rounded border border-border-base bg-bg-subtle p-3 text-xs text-error whitespace-pre-wrap">
        Mermaid error: {error}
        {"\n\n"}
        {code}
      </pre>
    );
  }

  return (
    <div
      className="dv-mermaid my-4 flex justify-center overflow-x-auto rounded border border-border-base bg-bg-subtle p-3"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
