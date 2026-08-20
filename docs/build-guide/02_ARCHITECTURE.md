# DevVault — Architecture & Type Definitions
> **Canonical reference for folder structure, types, and constants.**
> When any file references a type or import path, verify it here first.

---

## Folder Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx               ← Shell: Sidebar + main area
│   │   ├── page.tsx                 ← Overview/home
│   │   ├── snippets/
│   │   │   ├── page.tsx             ← List + filter
│   │   │   ├── loading.tsx          ← Skeleton state
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx         ← Detail view
│   │   │       └── edit/page.tsx
│   │   ├── bookmarks/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── commands/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── prompts/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── tags/page.tsx
│   │   ├── search/page.tsx
│   │   └── not-found.tsx
│   ├── globals.css                  ← CSS variables + base styles
│   └── layout.tsx                   ← Root layout (html, body, fonts)
│
├── components/
│   ├── common/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx          ← Fixed left nav (240px)
│   │   │   ├── TopBar.tsx           ← Page-level header bar
│   │   │   ├── MobileDrawer.tsx     ← Slide-in nav for mobile
│   │   │   ├── PageWrapper.tsx      ← Content max-width wrapper
│   │   │   ├── BackButton.tsx       ← Reusable back navigation
│   │   │   └── KeyboardShortcuts.tsx ← Global Cmd+K / Cmd+N handler
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Textarea.tsx
│   │       ├── Badge.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       ├── Dropdown.tsx
│   │       ├── EmptyState.tsx
│   │       ├── Spinner.tsx
│   │       ├── TagPill.tsx
│   │       ├── ContentTypeBadge.tsx
│   │       ├── CopyButton.tsx
│   │       └── Tooltip.tsx
│   │
│   ├── search/
│   │   ├── GlobalSearchBar.tsx
│   │   ├── SearchResultsList.tsx
│   │   └── SearchResultItem.tsx
│   │
│   ├── tags/
│   │   ├── TagSelector.tsx          ← Multi-select tag picker
│   │   ├── TagFilter.tsx            ← Filter bar with tag pills
│   │   └── TagManagerPanel.tsx      ← CRUD for tags
│   │
│   ├── snippets/
│   │   ├── SnippetCard.tsx
│   │   ├── SnippetDetailPanel.tsx
│   │   ├── SnippetForm.tsx
│   │   ├── SnippetGrid.tsx          ← Grid + List view switcher
│   │   ├── LanguageBadge.tsx        ← Language indicator pill
│   │   └── CodeBlock.tsx            ← Syntax-highlighted code display
│   │
│   ├── bookmarks/
│   │   ├── BookmarkCard.tsx
│   │   ├── BookmarkDetailPanel.tsx
│   │   ├── BookmarkForm.tsx
│   │   └── BookmarkGrid.tsx
│   │
│   ├── commands/
│   │   ├── CommandCard.tsx
│   │   ├── CommandDetailPanel.tsx
│   │   ├── CommandForm.tsx
│   │   └── CommandList.tsx
│   │
│   └── prompts/
│       ├── PromptCard.tsx
│       ├── PromptDetailPanel.tsx
│       ├── PromptForm.tsx
│       └── PromptGrid.tsx
│
├── lib/
│   ├── types/
│   │   ├── tag.types.ts
│   │   ├── snippet.types.ts
│   │   ├── bookmark.types.ts
│   │   ├── command.types.ts
│   │   ├── prompt.types.ts
│   │   ├── search.types.ts
│   │   └── index.ts                 ← Re-exports everything
│   ├── constants/
│   │   ├── routes.ts
│   │   ├── content-types.ts
│   │   └── languages.ts
│   ├── hooks/
│   │   ├── useSnippets.ts
│   │   ├── useBookmarks.ts
│   │   ├── useCommands.ts
│   │   ├── usePrompts.ts
│   │   ├── useTags.ts
│   │   └── useSearch.ts
│   └── utils/
│       ├── cn.ts                    ← clsx + tailwind-merge
│       └── format.ts
│
└── styles/
    └── fonts.css                    ← Google Fonts import
```

---

## Canonical Type Definitions

> Copy these EXACTLY into type files. Other prompts depend on these exact shapes.

### `src/lib/types/tag.types.ts`
```ts
export interface Tag {
  id: string
  name: string
  color: string        // hex color, e.g. "#F59E0B"
  userId: string
  createdAt: Date
  _count?: {
    snippets: number
    bookmarks: number
    commands: number
    prompts: number
  }
}
```

### `src/lib/types/snippet.types.ts`
```ts
import { Tag } from './tag.types'

export interface Snippet {
  id: string
  title: string
  content: string      // the actual code
  language: string     // e.g. "typescript", "python"
  description?: string
  userId: string
  tags: Tag[]
  createdAt: Date
  updatedAt: Date
  isFavorite: boolean
}

export type SnippetCreateInput = {
  title: string
  content: string
  language: string
  description?: string
  tagIds: string[]
}

export type SnippetUpdateInput = Partial<SnippetCreateInput>
```

### `src/lib/types/bookmark.types.ts`
```ts
import { Tag } from './tag.types'

export interface Bookmark {
  id: string
  title: string
  url: string
  description?: string
  favicon?: string     // URL to favicon image
  userId: string
  tags: Tag[]
  createdAt: Date
  updatedAt: Date
  isFavorite: boolean
}

export type BookmarkCreateInput = {
  title: string
  url: string
  description?: string
  tagIds: string[]
}

export type BookmarkUpdateInput = Partial<BookmarkCreateInput>
```

### `src/lib/types/command.types.ts`
```ts
import { Tag } from './tag.types'

export type Platform = 'macos' | 'linux' | 'windows' | 'cross-platform'

export interface Command {
  id: string
  title: string
  command: string      // the actual terminal command text
  description?: string
  platform: Platform
  userId: string
  tags: Tag[]
  createdAt: Date
  updatedAt: Date
  isFavorite: boolean
}

export type CommandCreateInput = {
  title: string
  command: string
  platform: Platform
  description?: string
  tagIds: string[]
}

export type CommandUpdateInput = Partial<CommandCreateInput>
```

### `src/lib/types/prompt.types.ts`
```ts
import { Tag } from './tag.types'

export interface Prompt {
  id: string
  title: string
  content: string      // the prompt text
  useCase?: string     // e.g. "Code review", "Documentation"
  model: string        // e.g. "gpt-4o", "claude-3-5-sonnet", "any"
  userId: string
  tags: Tag[]
  createdAt: Date
  updatedAt: Date
  isFavorite: boolean
}

export type PromptCreateInput = {
  title: string
  content: string
  model: string
  useCase?: string
  tagIds: string[]
}

export type PromptUpdateInput = Partial<PromptCreateInput>
```

### `src/lib/types/search.types.ts`
```ts
import { Tag } from './tag.types'

export interface SearchResult {
  id: string
  type: 'snippet' | 'bookmark' | 'command' | 'prompt'
  title: string
  preview: string      // short excerpt for display
  language?: string    // snippets only
  url?: string         // bookmarks only
  tags: Tag[]
  similarity?: number  // 0–1 from vector search
  createdAt: Date
}

export interface SearchResponse {
  results: SearchResult[]
  query: string
  total: number
  searchType: 'semantic' | 'keyword' | 'hybrid'
}
```

### `src/lib/types/index.ts`
```ts
export * from './tag.types'
export * from './snippet.types'
export * from './bookmark.types'
export * from './command.types'
export * from './prompt.types'
export * from './search.types'
```

---

## Constants

### `src/lib/constants/routes.ts`
```ts
export const ROUTES = {
  home: '/dashboard',
  snippets: '/dashboard/snippets',
  snippetNew: '/dashboard/snippets/new',
  snippet: (id: string) => `/dashboard/snippets/${id}`,
  snippetEdit: (id: string) => `/dashboard/snippets/${id}/edit`,
  bookmarks: '/dashboard/bookmarks',
  bookmarkNew: '/dashboard/bookmarks/new',
  bookmark: (id: string) => `/dashboard/bookmarks/${id}`,
  commands: '/dashboard/commands',
  commandNew: '/dashboard/commands/new',
  command: (id: string) => `/dashboard/commands/${id}`,
  prompts: '/dashboard/prompts',
  promptNew: '/dashboard/prompts/new',
  prompt: (id: string) => `/dashboard/prompts/${id}`,
  tags: '/dashboard/tags',
  search: '/dashboard/search',
  login: '/login',
  register: '/register',
} as const
```

### `src/lib/constants/content-types.ts`
```ts
export const CONTENT_TYPES = {
  snippet: {
    key: 'snippet' as const,
    label: 'Snippet',
    pluralLabel: 'Snippets',
    route: '/dashboard/snippets',
    color: 'var(--snippet)',
    iconName: 'Code2',
    description: 'Code snippets and examples',
  },
  bookmark: {
    key: 'bookmark' as const,
    label: 'Bookmark',
    pluralLabel: 'Bookmarks',
    route: '/dashboard/bookmarks',
    color: 'var(--bookmark)',
    iconName: 'Bookmark',
    description: 'Saved links and resources',
  },
  command: {
    key: 'command' as const,
    label: 'Command',
    pluralLabel: 'Commands',
    route: '/dashboard/commands',
    color: 'var(--command)',
    iconName: 'Terminal',
    description: 'Terminal commands and scripts',
  },
  prompt: {
    key: 'prompt' as const,
    label: 'Prompt',
    pluralLabel: 'Prompts',
    route: '/dashboard/prompts',
    color: 'var(--prompt)',
    iconName: 'Sparkles',
    description: 'AI prompt templates',
  },
} as const

export type ContentTypeKey = keyof typeof CONTENT_TYPES
```

### `src/lib/constants/languages.ts`
```ts
export const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'css', label: 'CSS' },
  { value: 'html', label: 'HTML' },
  { value: 'bash', label: 'Bash / Shell' },
  { value: 'sql', label: 'SQL' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'dockerfile', label: 'Dockerfile' },
  { value: 'graphql', label: 'GraphQL' },
  { value: 'plaintext', label: 'Plain Text' },
] as const

export type LanguageValue = typeof SUPPORTED_LANGUAGES[number]['value']
```

---

## Utility Files

### `src/lib/utils/cn.ts`
```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### `src/lib/utils/format.ts`
```ts
import { SUPPORTED_LANGUAGES } from '@/lib/constants/languages'

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)

  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  if (weeks < 4) return `${weeks}w ago`
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function getLanguageLabel(value: string): string {
  const found = SUPPORTED_LANGUAGES.find((l) => l.value === value)
  return found ? found.label : value
}
```

---

## Hooks (Stub Pattern for Mock Phase)

All hooks follow this pattern. Create empty stubs first, wire to API later.

### Example: `src/lib/hooks/useSnippets.ts`
```ts
import { useState } from 'react'
import { Snippet, SnippetCreateInput, SnippetUpdateInput } from '@/lib/types'

export function useSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // TODO: Replace with real API calls
  const createSnippet = async (input: SnippetCreateInput) => {}
  const updateSnippet = async (id: string, input: SnippetUpdateInput) => {}
  const deleteSnippet = async (id: string) => {}
  const toggleFavorite = async (id: string) => {}

  return { snippets, isLoading, error, createSnippet, updateSnippet, deleteSnippet, toggleFavorite }
}
```

Create identical stubs for: `useBookmarks`, `useCommands`, `usePrompts`, `useTags`, `useSearch`.

---

## Component Dependency Map

```
Layer 0 — Utilities (no dependencies):
  cn(), formatDate(), formatRelativeTime(), truncate()
  All types in src/lib/types/
  All constants in src/lib/constants/

Layer 1 — Atoms (depends on Layer 0):
  Button, Input, Textarea, Badge, Spinner, Tooltip

Layer 2 — Molecules (depends on Layer 1):
  Card, Modal, TagPill, CopyButton, EmptyState, ContentTypeBadge, Dropdown

Layer 3 — Layout (depends on Layer 1 + 2):
  Sidebar, TopBar, MobileDrawer, PageWrapper, BackButton, KeyboardShortcuts

Layer 4 — Feature Components (depends on Layer 1–3):
  TagSelector → TagPill, Input, Button
  TagFilter → TagPill
  GlobalSearchBar → Input, Spinner
  SearchResultItem → ContentTypeBadge, TagPill
  SearchResultsList → SearchResultItem, EmptyState, Spinner

Layer 5 — Content Components (depends on Layer 1–4):
  CodeBlock → CopyButton
  SnippetCard → Card, ContentTypeBadge, TagPill, CopyButton
  SnippetForm → Input, Textarea, TagSelector, Button, Dropdown
  SnippetDetailPanel → CodeBlock, TagPill, Button, Badge
  SnippetGrid → SnippetCard, EmptyState, Spinner
  (same tree for Bookmark, Command, Prompt)

Layer 6 — Pages (depends on everything):
  List pages → TopBar, PageWrapper, Grid/List, TagFilter, EmptyState, Button
  New pages → TopBar, PageWrapper, BackButton, Form
  Detail pages → TopBar, PageWrapper, BackButton, DetailPanel
```

---

## npm Packages Required

```bash
# Install all at project setup:
npm install framer-motion lucide-react clsx tailwind-merge
npm install --save-dev @types/node
```

No other UI library is needed. Build everything custom.
