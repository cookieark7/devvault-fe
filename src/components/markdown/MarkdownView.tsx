"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import Mermaid from "./Mermaid";

// Recover raw text from a hast node — used to get the original mermaid source
// (rehype-highlight leaves unknown languages untouched with ignoreMissing).
function hastToText(node: any): string {
  if (!node) return "";
  if (node.type === "text") return node.value ?? "";
  if (Array.isArray(node.children)) return node.children.map(hastToText).join("");
  return "";
}

function isMermaidPre(node: any): boolean {
  const codeEl = node?.children?.[0];
  if (!codeEl || codeEl.tagName !== "code") return false;
  const cls = codeEl.properties?.className;
  const list = Array.isArray(cls) ? cls : typeof cls === "string" ? cls.split(" ") : [];
  return list.includes("language-mermaid");
}

/**
 * Renders trusted markdown (the user's own .md files) as GitHub-flavoured
 * markdown with syntax-highlighted code and rendered Mermaid diagrams.
 * Raw HTML in the source is intentionally NOT rendered (no rehype-raw).
 */
export default function MarkdownView({ content }: { content: string }) {
  return (
    <div className="dv-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }]]}
        components={{
          pre({ node, children, ...props }: any) {
            if (isMermaidPre(node)) {
              const code = hastToText(node.children[0]).replace(/\n$/, "");
              return <Mermaid code={code} />;
            }
            return <pre {...props}>{children}</pre>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
