export const CONTENT_TYPES = {
  snippet: {
    key: "snippet" as const,
    label: "Snippet",
    pluralLabel: "Snippets",
    route: "/dashboard/snippets",
    color: "var(--snippet)",
    iconName: "Code2",
    description: "Code blocks with syntax highlighting",
  },
  bookmark: {
    key: "bookmark" as const,
    label: "Bookmark",
    pluralLabel: "Bookmarks",
    route: "/dashboard/bookmarks",
    color: "var(--bookmark)",
    iconName: "Bookmark",
    description: "URLs with favicon and description",
  },
  command: {
    key: "command" as const,
    label: "Command",
    pluralLabel: "Commands",
    route: "/dashboard/commands",
    color: "var(--command)",
    iconName: "Terminal",
    description: "Terminal commands with mono display",
  },
  prompt: {
    key: "prompt" as const,
    label: "Prompt",
    pluralLabel: "Prompts",
    route: "/dashboard/prompts",
    color: "var(--prompt)",
    iconName: "Sparkles",
    description: "AI prompt templates",
  },
  project: {
    key: "project" as const,
    label: "Project",
    pluralLabel: "Projects",
    route: "/projects",
    color: "#14B8A6",
    iconName: "BookOpen",
    description: "Markdown knowledge hub with diagrams",
  },
} as const;

export type ContentTypeKey = keyof typeof CONTENT_TYPES;
