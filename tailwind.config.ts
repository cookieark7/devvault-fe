import type { Config } from "tailwindcss";

/**
 * DevVault — Tailwind Configuration
 *
 * NOTE: This project uses Tailwind CSS v4 with CSS-first configuration.
 * The primary theme tokens are defined via @theme inline in globals.css.
 * This config file exists for compatibility with tools that read
 * tailwind.config.ts (IDE plugins, third-party libraries, etc.)
 *
 * All color tokens, font families, and box shadows are mapped from
 * CSS custom properties defined in :root (globals.css).
 */

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-main": "var(--bg-main)",
        "bg-sidebar": "var(--bg-sidebar)",
        "bg-hover": "var(--bg-hover)",
        "bg-subtle": "var(--bg-subtle)",
        "bg-elevated": "var(--bg-elevated)",
        "border-base": "var(--border)",
        "border-focus": "var(--border-focus)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-tertiary)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "accent-muted": "var(--accent-muted)",
        snippet: "var(--snippet)",
        bookmark: "var(--bookmark)",
        command: "var(--command)",
        "prompt-color": "var(--prompt)",
        "tag-color": "var(--tag)",
        success: "var(--success)",
        error: "var(--error)",
        warning: "var(--warning)",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["SF Mono", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        "notion-menu":
          "rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px",
        "notion-card":
          "rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.05) 0px 2px 4px",
      },
    },
  },
  plugins: [],
};

export default config;
