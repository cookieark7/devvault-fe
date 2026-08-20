# DevVault — Build Prompts: Foundation (00–04)
> **Prompts for:** Design System → Types → UI Atoms → UI Molecules → Layout Shell
> Each prompt is self-contained. Paste the entire block — do not summarize.
> Use **Claude Code** for all prompts in this file.

---

## HOW TO USE THIS FILE

1. Start a fresh Claude Code session
2. Paste **PROMPT 00** in full
3. Verify output, check files created
4. Start new session, paste **PROMPT 01** in full
5. Continue sequentially — never skip

**For Qwen / local models:** Each prompt has a `[QWEN VERSION]` section — a smaller, self-contained version you can use for individual components if Claude Code is unavailable.

---

## PROMPT 00 — Design System Foundation

**Files:** `src/styles/fonts.css` · `src/app/globals.css` · `src/app/layout.tsx` · `tailwind.config.ts`

```
CONTEXT: I am building DevVault — a developer knowledge management tool.
Stack: Next.js 14 App Router, TypeScript, Tailwind CSS.
Design language: Notion-inspired (light mode, clean, document-first).

CREATE THESE FILES:

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/styles/fonts.css
━━━━━━━━━━━━━━━━━━━━━━━━━
@import url for Inter from Google Fonts (weights: 400, 500, 600).
Also define a CSS var --font-mono for: 'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace.

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/app/globals.css
━━━━━━━━━━━━━━━━━━━━━━━━━
@tailwind base/components/utilities directives.
Import fonts.css.
Define in :root — ALL of these exact CSS variables:

Backgrounds:
  --bg-main: #FFFFFF
  --bg-sidebar: #F7F7F5
  --bg-hover: #EFEFED
  --bg-subtle: #F1F1EF
  --bg-elevated: #FFFFFF

Borders:
  --border: #E9E9E7
  --border-focus: #B7B7B5

Text:
  --text-primary: #37352F
  --text-secondary: #787774
  --text-tertiary: #ACABA8

Accent:
  --accent: #2383E2
  --accent-hover: #1A6FC4
  --accent-muted: rgba(35, 131, 226, 0.1)
  --selection: rgba(35, 131, 226, 0.28)

Content identity colors:
  --snippet: #F59E0B
  --bookmark: #3B82F6
  --command: #10B981
  --prompt: #8B5CF6
  --tag: #EC4899
  --snippet-muted: rgba(245, 158, 11, 0.1)
  --bookmark-muted: rgba(59, 130, 246, 0.1)
  --command-muted: rgba(16, 185, 129, 0.1)
  --prompt-muted: rgba(139, 92, 246, 0.1)

Semantic:
  --success: #0F7B6C
  --success-muted: rgba(15, 123, 108, 0.1)
  --error: #EB5757
  --error-muted: rgba(235, 87, 87, 0.1)
  --warning: #DFAB01
  --warning-muted: rgba(223, 171, 1, 0.1)

@layer base rules:
  html, body: background var(--bg-main), color var(--text-primary)
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif
  font-size: 15px, antialiased rendering
  smooth scrolling
  ::selection: background var(--selection)

Custom scrollbar styles:
  ::-webkit-scrollbar width 6px
  track: transparent
  thumb: var(--border), border-radius 9999px
  thumb:hover: var(--border-focus)

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: tailwind.config.ts
━━━━━━━━━━━━━━━━━━━━━━━━━
Extend colors to map all CSS vars:
  'bg-main': 'var(--bg-main)'
  'bg-sidebar': 'var(--bg-sidebar)'
  'bg-hover': 'var(--bg-hover)'
  'bg-subtle': 'var(--bg-subtle)'
  'bg-elevated': 'var(--bg-elevated)'
  'border-base': 'var(--border)'
  'border-focus': 'var(--border-focus)'
  'text-primary': 'var(--text-primary)'
  'text-secondary': 'var(--text-secondary)'
  'text-tertiary': 'var(--text-tertiary)'
  'accent': 'var(--accent)'
  'accent-hover': 'var(--accent-hover)'
  'accent-muted': 'var(--accent-muted)'
  'snippet': 'var(--snippet)'
  'bookmark': 'var(--bookmark)'
  'command': 'var(--command)'
  'prompt-color': 'var(--prompt)'
  'tag-color': 'var(--tag)'
  'success': 'var(--success)'
  'error': 'var(--error)'
  'warning': 'var(--warning)'

Extend fontFamily:
  sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
  mono: ['SF Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace']

Extend boxShadow:
  'notion-menu': 'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px'
  'notion-card': 'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.05) 0px 2px 4px'

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/app/layout.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Root layout. Import globals.css.
Metadata: title "DevVault", description "Your developer knowledge vault".
html element: lang="en"
body: className "antialiased font-sans"
No navigation here — just the shell. Children rendered directly.
```

---

## PROMPT 01 — TypeScript Types + Constants + Utilities

**Files:** All of `src/lib/`

```
CONTEXT: DevVault. Next.js 14, TypeScript. Design system done (globals.css + tailwind.config.ts).
Now creating all type definitions, constants, and utilities.

CREATE ALL FILES BELOW. Do not abbreviate any field.

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/lib/types/tag.types.ts
━━━━━━━━━━━━━━━━━━━━━━━━━
export interface Tag {
  id: string
  name: string
  color: string       // hex, e.g. "#F59E0B"
  userId: string
  createdAt: Date
  _count?: { snippets: number; bookmarks: number; commands: number; prompts: number }
}

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/lib/types/snippet.types.ts
━━━━━━━━━━━━━━━━━━━━━━━━━
import { Tag } from './tag.types'
Snippet interface: id, title, content (code string), language, description?, userId, tags: Tag[], createdAt: Date, updatedAt: Date, isFavorite: boolean
SnippetCreateInput type: title, content, language (required); description?, tagIds: string[]
SnippetUpdateInput: Partial<SnippetCreateInput>

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/lib/types/bookmark.types.ts
━━━━━━━━━━━━━━━━━━━━━━━━━
Bookmark interface: id, title, url, description?, favicon?, userId, tags: Tag[], createdAt, updatedAt, isFavorite
BookmarkCreateInput: title, url (required); description?, tagIds
BookmarkUpdateInput: Partial<BookmarkCreateInput>

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/lib/types/command.types.ts
━━━━━━━━━━━━━━━━━━━━━━━━━
Platform type: 'macos' | 'linux' | 'windows' | 'cross-platform'
Command interface: id, title, command (string), description?, platform: Platform, userId, tags: Tag[], createdAt, updatedAt, isFavorite
CommandCreateInput: title, command, platform (required); description?, tagIds
CommandUpdateInput: Partial<CommandCreateInput>

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/lib/types/prompt.types.ts
━━━━━━━━━━━━━━━━━━━━━━━━━
Prompt interface: id, title, content (string), useCase?, model (string), userId, tags: Tag[], createdAt, updatedAt, isFavorite
PromptCreateInput: title, content, model (required); useCase?, tagIds
PromptUpdateInput: Partial<PromptCreateInput>

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/lib/types/search.types.ts
━━━━━━━━━━━━━━━━━━━━━━━━━
SearchResult: id, type ('snippet'|'bookmark'|'command'|'prompt'), title, preview, language?, url?, tags: Tag[], similarity?: number (0-1), createdAt: Date
SearchResponse: results: SearchResult[], query: string, total: number, searchType: 'semantic'|'keyword'|'hybrid'

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/lib/types/index.ts
━━━━━━━━━━━━━━━━━━━━━━━━━
Re-export everything: export * from all 5 type files.

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/lib/constants/routes.ts
━━━━━━━━━━━━━━━━━━━━━━━━━
ROUTES const (as const): home, snippets, snippetNew, snippet(id), snippetEdit(id),
bookmarks, bookmarkNew, bookmark(id), commands, commandNew, command(id),
prompts, promptNew, prompt(id), tags, search, login, register.
All dashboard routes prefix with '/dashboard'.

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/lib/constants/content-types.ts
━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENT_TYPES const with entries: snippet, bookmark, command, prompt.
Each entry: key, label, pluralLabel, route, color (use var(--snippet) etc), iconName (Lucide name as string), description.
Export ContentTypeKey = keyof typeof CONTENT_TYPES.

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/lib/constants/languages.ts
━━━━━━━━━━━━━━━━━━━━━━━━━
SUPPORTED_LANGUAGES array of { value: string, label: string }. Include at minimum:
javascript, typescript, python, rust, go, java, cpp, c, csharp, php, ruby, swift, kotlin, css, html, bash, sql, json, yaml, markdown, dockerfile, graphql, plaintext.

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/lib/utils/cn.ts
━━━━━━━━━━━━━━━━━━━━━━━━━
import clsx and twMerge. export cn(...inputs: ClassValue[]).

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/lib/utils/format.ts
━━━━━━━━━━━━━━━━━━━━━━━━━
formatDate(date: Date): "Jan 15, 2025" format using Intl.DateTimeFormat.
formatRelativeTime(date: Date): "2h ago", "3d ago", "just now" — handle seconds/min/hours/days/weeks/months/years.
truncate(str: string, length: number): string — append "..." if truncated.
getLanguageLabel(value: string): looks up in SUPPORTED_LANGUAGES, returns label or the value itself as fallback.

━━━━━━━━━━━━━━━━━━━━━━━━━
HOOK STUBS (create all 6):
━━━━━━━━━━━━━━━━━━━━━━━━━
Files: src/lib/hooks/useSnippets.ts, useBookmarks.ts, useCommands.ts, usePrompts.ts, useTags.ts, useSearch.ts.

Pattern: useState for items array + isLoading + error. Export CRUD functions as no-ops (async, return void).
useSnippets: { snippets, isLoading, error, createSnippet, updateSnippet, deleteSnippet, toggleFavorite }
useBookmarks: same shape but bookmarks.
useCommands: same shape but commands.
usePrompts: same shape but prompts.
useTags: { tags, isLoading, error, createTag, updateTag, deleteTag }
useSearch: { results, isLoading, error, search(query: string): Promise<void>, clearResults() }
```

---

## PROMPT 02 — Atom UI Components

**Files:** `Button`, `Input`, `Textarea`, `Badge`, `Spinner`, `Tooltip`

> **RECOMMENDED MODEL:** Claude Code
> **Qwen alternative:** Use [QWEN VERSION] blocks below for individual components.

```
CONTEXT: DevVault. Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Lucide React.
All types at src/lib/types/index.ts. Utility cn() at src/lib/utils/cn.ts.

Notion-inspired LIGHT theme. CSS vars available as Tailwind classes:
  bg-main bg-sidebar bg-hover bg-subtle bg-elevated
  text-primary text-secondary text-tertiary
  border-base border-focus
  accent accent-hover accent-muted

BUILD THESE COMPONENTS. Each is a 'use client' component unless stated.

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/common/ui/Button.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props (typed interface):
  variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  + all standard HTML button attributes (extend ButtonHTMLAttributes)

Variants (all use rounded not rounded-full, transition-colors duration-100):
  primary:   bg-accent text-white hover:bg-accent-hover font-medium
  secondary: bg-bg-subtle text-text-primary border border-border-base hover:bg-bg-hover
  ghost:     text-text-secondary hover:text-text-primary hover:bg-bg-hover bg-transparent
  danger:    text-error hover:bg-error/10 bg-transparent border border-transparent hover:border-error/20
  outline:   border border-border-base text-text-primary hover:bg-bg-hover

Sizes:
  sm: text-xs px-2.5 py-1.5 h-7
  md: text-sm px-3 py-1.5 h-8
  lg: text-sm px-4 py-2 h-9

isLoading: show Spinner (from Spinner.tsx) as leftIcon, disable, pointer-events-none, opacity-70.
leftIcon/rightIcon: render as-is with appropriate gap (gap-1.5 for sm, gap-2 for md/lg).

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/common/ui/Spinner.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: size ('sm'|'md'|'lg'), className?
Simple CSS animation spinning circle. sm=12px, md=16px, lg=20px.
Border-based spinner: border-2 border-border-base border-t-text-secondary.
animate-spin. rounded-full.

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/common/ui/Input.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: label?, error?, hint?, leftIcon? (ReactNode), rightIcon? (ReactNode) + all InputHTMLAttributes.
Layout: label above, input in middle, error/hint below.
Base input style:
  w-full rounded border border-border-base bg-bg-subtle
  px-3 py-1.5 text-sm text-text-primary
  placeholder:text-text-tertiary
  focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-accent/20
  transition-colors duration-100
Error state: border-error focus:ring-error/20.
If leftIcon: pl-8, position icon absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary.

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/common/ui/Textarea.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Same as Input but textarea element. Props + rows? (default 4), showCount? (shows char count if maxLength set).
resize-none. min-h-[80px]. Same styling as Input.
If showCount: absolute bottom-2 right-3 text-xs text-text-tertiary showing "120 / 500".

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/common/ui/Badge.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: variant ('default'|'success'|'error'|'warning'|'info'), size ('sm'|'md'), children.
Base: inline-flex items-center rounded-full font-medium.
sm: text-xs px-2 py-0.5
md: text-xs px-2.5 py-1
Variants (all use bg/text color combos from CSS vars):
  default: bg-bg-hover text-text-secondary
  success: bg-success/10 text-success
  error:   bg-error/10 text-error
  warning: bg-warning/10 text-warning
  info:    bg-accent/10 text-accent

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/common/ui/Tooltip.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: content (string), children (ReactNode), side ('top'|'bottom'|'left'|'right' default 'top').
Simple CSS-only tooltip using group/group-hover approach.
Tooltip panel: bg-bg-elevated text-text-primary text-xs rounded px-2 py-1
  border border-border-base shadow-notion-menu
  absolute pointer-events-none z-50.
Position based on 'side' prop.
```

---

## PROMPT 03 — Molecule UI Components

**Files:** `Card`, `Modal`, `TagPill`, `CopyButton`, `EmptyState`, `ContentTypeBadge`, `Dropdown`

```
CONTEXT: DevVault. Notion-inspired light theme. Next.js 14 TypeScript.
Already built: Button (src/components/common/ui/Button.tsx), Spinner, Badge, Input.
Types: import from src/lib/types/index.ts. Utility: cn() from src/lib/utils/cn.ts.
Framer Motion is installed. Lucide React is installed.

Tailwind token aliases available: bg-main, bg-sidebar, bg-hover, bg-subtle, bg-elevated,
text-primary, text-secondary, text-tertiary, border-base, border-focus, accent, accent-muted.
Shadow aliases: shadow-notion-menu, shadow-notion-card.

BUILD THESE COMPONENTS:

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/common/ui/Card.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: children, className?, onClick?, noPadding?, variant ('default'|'list-row')

default variant: bg-bg-main border border-border-base rounded p-4
  Interactive (when onClick): hover:shadow-notion-card hover:border-border-focus cursor-pointer transition-all duration-100
  
list-row variant: flex items-center gap-3 border-b border-border-base py-3 px-4 w-full
  hover:bg-bg-hover cursor-pointer transition-colors duration-100

noPadding: removes padding so children control it.

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/common/ui/Modal.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: isOpen, onClose, title (string), size ('sm'|'md'|'lg'), children, footer? (ReactNode)

Use Framer Motion + AnimatePresence for entrance/exit.
Backdrop: fixed inset-0 bg-black/20 z-40
  motion: opacity 0→1, duration 0.15
Panel: fixed inset-0 flex items-center justify-center z-50
  Inner div: bg-bg-elevated border border-border-base rounded-md shadow-notion-menu
  motion: opacity 0→1, scale 0.96→1, y 8→0, duration 0.2 easeOut

Sizes: sm=max-w-sm, md=max-w-lg, lg=max-w-2xl
Header: text-base font-medium text-text-primary + X button (X icon from Lucide, ghost style) top-right.
Body: p-5 max-h-[65vh] overflow-y-auto
Footer (if provided): border-t border-border-base p-4 flex justify-end gap-2
Close on: backdrop click + Escape key (useEffect keydown listener).

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/common/ui/TagPill.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: tag (Tag type), onRemove? (function), onClick? (function), size ('sm'|'md')

Tag.color is a hex string like "#F59E0B". Use inline styles for dynamic color.
Layout: inline-flex items-center gap-1 rounded-full font-medium
sm: text-xs px-2 py-0.5
md: text-sm px-2.5 py-1
Background: tag.color at 12% opacity (use inline style: `rgba(r,g,b,0.12)`)
Text color: tag.color directly
Border: 1px solid tag.color at 25% opacity

When onRemove: show X (XIcon size 10) button after text. Clicking X calls onRemove, stops propagation.
When onClick: cursor-pointer, hover slightly increases opacity.

Helper function to convert hex to rgba — handle both #RGB and #RRGGBB.

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/common/ui/CopyButton.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: text (string), size ('sm'|'md'), label? (string — shows next to icon when provided)

States: 'idle' | 'copied'
On click: navigator.clipboard.writeText(text), set state 'copied', reset to 'idle' after 2000ms.
Icons: Copy (idle) | Check (copied) — from Lucide, size 14 for sm / 16 for md.
Styling: ghost-like, text-text-secondary hover:text-text-primary transition-colors.
When copied: text-success (green).
If label provided: show label text after icon (gap-1.5).

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/common/ui/EmptyState.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: icon (ReactNode), title (string), description (string), action? (ReactNode)

Layout: flex flex-col items-center text-center py-20 px-4
Icon wrapper: w-12 h-12 bg-bg-subtle border border-border-base rounded-md flex items-center justify-center mb-4 text-text-secondary
Title: text-sm font-medium text-text-primary mt-1
Description: text-sm text-text-secondary max-w-xs mt-1
Action: mt-4 (rendered as-is)

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/common/ui/ContentTypeBadge.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: type ('snippet'|'bookmark'|'command'|'prompt'), showLabel? (default true)

Map type to: { icon component, label, color CSS var name }
  snippet: Code2, 'Snippet', var(--snippet)
  bookmark: Bookmark, 'Bookmark', var(--bookmark)
  command: Terminal, 'Command', var(--command)
  prompt: Sparkles, 'Prompt', var(--prompt)

Layout: inline-flex items-center gap-1.5 rounded text-xs px-2 py-0.5
Background: the color at 10% opacity (use CSS var with /10 Tailwind or inline style)
Text/icon color: the full color (inline style)
Icons: size 12, strokeWidth 1.5

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/common/ui/Dropdown.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: trigger (ReactNode), items: Array<{ label: string, icon?: ReactNode, onClick: () => void, danger?: boolean, disabled?: boolean }>, align ('left'|'right', default 'left')

Uses useState for open/close. useEffect to close on outside click (document mousedown listener).
Trigger wrapper: relative inline-block.
Menu: absolute top-full mt-1 (left-0 or right-0 based on align)
  bg-bg-elevated border border-border-base rounded-md shadow-notion-menu z-50 min-w-[160px]
  Use Framer Motion: opacity 0→1, scale 0.97→1, y 4→0, duration 0.15 easeOut

Item style: flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer
  text-text-primary hover:bg-bg-hover transition-colors duration-100
  danger items: text-error hover:bg-error/5
  disabled: opacity-40 pointer-events-none
Divider support: if item has isDivider: true, render border-t border-border-base my-1 (extend item type).
```

---

## PROMPT 04 — Layout Shell

**Files:** `Sidebar`, `TopBar`, `MobileDrawer`, `PageWrapper`, `BackButton` + `(dashboard)/layout.tsx`

```
CONTEXT: DevVault. Notion-inspired light theme. Next.js 14 App Router TypeScript.
Built so far: All UI atoms (Button, Input, Badge, Spinner, Tooltip) + molecules (Card, Modal, TagPill, CopyButton, EmptyState, ContentTypeBadge, Dropdown).
Constants: ROUTES from src/lib/constants/routes.ts.
Utility: cn() from src/lib/utils/cn.ts.
Framer Motion + Lucide React installed.

This prompt builds the main dashboard shell: a collapsible left sidebar + scrollable main content area.
Notion's actual layout is the reference: sidebar navigation on left, blank content canvas on right.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/common/layout/Sidebar.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
'use client'. Uses usePathname() from next/navigation.

OUTER LAYOUT:
  fixed left-0 top-0 h-screen w-[240px] bg-bg-sidebar flex flex-col
  border-r border-border-base z-30
  Hidden on mobile: hidden lg:flex

TOP SECTION (brand area):
  px-3 pt-4 pb-2
  Row: [Small square logo glyph] + "DevVault" text
    Logo: 20x20px div, bg-text-primary rounded-sm — a simple dark square (no emoji, no SVG complexity)
    Text: text-sm font-semibold text-text-primary ml-2

SEARCH SHORTCUT (below brand):
  Button-like row: flex items-center gap-2 w-full px-2 py-1.5 rounded text-xs text-text-secondary
  hover:bg-bg-hover transition-colors duration-100 cursor-pointer
  Left: Search icon (size 14, text-text-tertiary) + "Search..."
  Right: keyboard shortcut pill "⌘K" (text-xs bg-bg-hover rounded px-1.5 py-0.5)
  onClick: navigate to ROUTES.search

NAVIGATION (flex-1 overflow-y-auto):
  px-1 pb-2

  Section — no header label:
    NavItem: Home (LayoutDashboard icon), ROUTES.home (exact match for active)

  Section — "LIBRARY" header (text-[10px] font-semibold text-text-tertiary tracking-widest uppercase px-3 py-2 mt-3):
    NavItem: Snippets (Code2 icon, identity color var(--snippet))
    NavItem: Bookmarks (Bookmark icon, identity color var(--bookmark))
    NavItem: Commands (Terminal icon, identity color var(--command))
    NavItem: Prompts (Sparkles icon, identity color var(--prompt))

  Section — "ORGANIZE" header:
    NavItem: Tags (Tag icon)

  Section — "FIND" header:
    NavItem: Search (Search icon)

NAV ITEM internal logic:
  isActive: for Home use pathname === ROUTES.home. For others use pathname.startsWith(itemRoute).
  Default:  flex items-center gap-2 w-full rounded px-2 py-1.5 text-sm text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors duration-100
  Active:   bg-bg-hover text-text-primary font-medium
  Icon: size 16, strokeWidth 1.5. Default: text-text-secondary. Active: use the identity color via inline style if defined, else text-text-primary.

BOTTOM SECTION (mt-auto):
  border-t border-border-base px-2 py-3
  Row: circle avatar (w-7 h-7 bg-bg-hover rounded-full text-xs font-medium text-text-secondary flex items-center justify-center) showing "U" + "User" text (text-sm text-text-primary font-medium flex-1 truncate)
  Settings icon button: (Settings icon size 15, ghost style)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/common/layout/TopBar.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
'use client'.
Props: title (string), subtitle? (string), actions? (ReactNode), onMenuClick? (() => void)

Layout: h-12 flex items-center px-4 border-b border-border-base bg-bg-main
  sticky top-0 z-20 (NOT backdrop-blur — clean and simple)

Left:
  Mobile hamburger: Menu icon, lg:hidden, mr-2, onClick → onMenuClick
  Title: text-sm font-medium text-text-primary
  Subtitle (if set): text-text-tertiary text-sm ml-2 hidden sm:block "·" separator before subtitle

Right:
  actions slot: flex items-center gap-2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/common/layout/MobileDrawer.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
'use client'.
Props: isOpen (boolean), onClose (() => void)

lg:hidden wrapper. Renders the full Sidebar contents (or imports Sidebar with mobile prop).
Approach: render Sidebar inside a fixed drawer.
Backdrop: fixed inset-0 bg-black/30 z-40, onClick → onClose
Drawer: fixed left-0 top-0 h-full w-[240px] bg-bg-sidebar z-50 shadow-notion-menu
Use Framer Motion: x -240→0 when open, duration 0.2, ease 'easeOut'.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/common/layout/PageWrapper.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Props: children, className?

Purpose: consistent page content container. NOT full-width — Notion-like centered content.
className: px-6 py-8 max-w-[900px] mx-auto w-full

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/common/layout/BackButton.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
'use client'.
Props: href (string), label? (default "Back")
Renders: Button variant='ghost' size='sm' with ArrowLeft icon (size 14) on left.
Uses Next.js Link wrapper. Visually: "← Back" or "← [label]".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/app/(dashboard)/layout.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
'use client'. Uses useState for mobileDrawerOpen (boolean).

Structure:
<div className="flex h-screen bg-bg-main overflow-hidden">
  <Sidebar />
  <MobileDrawer isOpen={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)} />
  <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex-1"
    >
      {children}
    </motion.div>
  </main>
</div>

Pass setMobileDrawerOpen to children via context or prop-drill through TopBar onMenuClick.
(TopBar is added per-page, not here — each page has its own TopBar.)
Use a MobileMenuContext to pass the setter down cleanly:
  create a context: MobileMenuContext with value { openMobileMenu: () => void }
  Provide it here. TopBar will consume it.
```

---

## ✅ FOUNDATION COMPLETE CHECKLIST

After completing PROMPT 00–04, verify:
- [ ] `npm run dev` starts without errors
- [ ] Visiting `localhost:3000/dashboard` shows sidebar (left, 240px, gray background) + empty main area (white)
- [ ] Sidebar nav items highlight on hover with gray background
- [ ] Text in sidebar uses Inter font, is dark gray (#37352F) not black
- [ ] No dark backgrounds anywhere — everything is light mode
- [ ] Mobile: sidebar hidden, hamburger button visible in TopBar
- [ ] Framer Motion: page content fades in on load (200ms)

**Common issues to watch for:**
- Tailwind not picking up CSS var aliases → Check tailwind.config.ts colors mapping
- Font not loading → Verify Google Fonts import in fonts.css + imported in globals.css
- Sidebar overlaps content → Main area needs `lg:pl-[240px]` or sidebar needs to be part of flex layout
```
