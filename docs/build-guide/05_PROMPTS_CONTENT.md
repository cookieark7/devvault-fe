# DevVault — Build Prompts: Content Sections (10–15)
> **Prompts for:** Snippets → Bookmarks → Commands → Prompts → Polish Pass
> Prerequisites: Prompts 00–09 must be complete.

---

## CONTEXT BRIEF (paste at start of every session)

```
Project: DevVault — developer knowledge management tool (Notion-inspired light theme)
Stack: Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, Lucide React

DESIGN RULES (non-negotiable):
  - Light mode ONLY. No dark backgrounds.
  - Tailwind tokens: bg-main, bg-sidebar, bg-hover, bg-subtle, bg-elevated
  - Text: text-primary (#37352F), text-secondary (#787774), text-tertiary (#ACABA8)
  - Borders: border-base (#E9E9E7). Always 1px. Never heavy.
  - Border radius: rounded (4px) for panels/cards, rounded-full for pills only.
  - Shadows: shadow-notion-menu (floating) or shadow-notion-card (hover lift). Never heavy shadows.
  - Framer Motion: dropdowns/menus use { opacity:0, scale:0.97, y:4 } → { opacity:1, scale:1, y:0 }, duration 0.15
  - Icons: Lucide React, size 16, strokeWidth 1.5, text-secondary default.

Available components (all at src/components/common/ui/ and src/components/common/layout/):
  Button (primary/secondary/ghost/danger), Input, Textarea, Badge, Spinner, Tooltip
  Card (default/list-row), Modal, TagPill, CopyButton, EmptyState, ContentTypeBadge, Dropdown
  Sidebar, TopBar, PageWrapper, BackButton
  TagSelector, TagFilter (src/components/tags/)

Types (all from src/lib/types/index.ts):
  Snippet, SnippetCreateInput, Bookmark, BookmarkCreateInput, Command, CommandCreateInput, Prompt, PromptCreateInput, Tag
Hooks (all return { items, isLoading, error, crud fns }):
  useSnippets, useBookmarks, useCommands, usePrompts, useTags
Constants: ROUTES (src/lib/constants/routes.ts), SUPPORTED_LANGUAGES (src/lib/constants/languages.ts)
Utils: cn() (src/lib/utils/cn.ts), formatDate(), formatRelativeTime() (src/lib/utils/format.ts)
```

---

## PROMPT 10 — Snippet Components

**Files:** `CodeBlock`, `LanguageBadge`, `SnippetCard`, `SnippetForm`, `SnippetDetailPanel`, `SnippetGrid`

> **Model:** Use Claude Code — this is the most complex content section.
> For individual components (e.g. just SnippetCard), use Qwen with the QWEN TEMPLATE from `00_AGENT_SKILLS.md`.

```
[PASTE CONTEXT BRIEF ABOVE FIRST]

Build all snippet-related components for DevVault.
Snippets are the core content type: code blocks with syntax highlighting.
Identity color: #F59E0B (amber) via CSS var --snippet.

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/snippets/LanguageBadge.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: language (string), size? ('sm'|'md', default 'sm')

A small badge showing the programming language.
import { getLanguageLabel } from src/lib/utils/format.ts

Style: inline-flex items-center rounded text-xs font-mono
  bg-bg-subtle text-text-secondary border border-border-base
sm: px-1.5 py-0.5 text-[11px]
md: px-2 py-1 text-xs

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/snippets/CodeBlock.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: code (string), language (string), showLineNumbers? (boolean, default true), maxLines? (number)

This is DevVault's code display block. Uses a monospace font (font-mono class).
NO external syntax highlighting library (keep it simple — styled mono text only).

Container: relative bg-bg-subtle border border-border-base rounded p-4 overflow-x-auto

Header row (above code): flex justify-between items-center mb-3 pb-3 border-b border-border-base
  Left: LanguageBadge
  Right: CopyButton (text={code}) 

Code area: font-mono text-sm text-text-primary leading-relaxed whitespace-pre overflow-x-auto

If showLineNumbers:
  Render each line as a flex row: [line number] [code text]
  Line number: text-text-tertiary text-xs select-none w-8 text-right mr-4 flex-shrink-0

If maxLines is set: clamp display to maxLines rows, show "Show more" button below using a collapsible pattern (useState for expanded).

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/snippets/SnippetCard.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: snippet (Snippet), onClick (() => void), onFavorite ((id: string) => void), view ('grid'|'list')

GRID VIEW:
  Outer: div with hover:shadow-notion-card transition-all duration-100 cursor-pointer
    border border-border-base rounded p-4 bg-bg-main
  Header row: [Code2 icon size 16 color var(--snippet)] [title text-sm font-medium text-text-primary flex-1 truncate] [LanguageBadge]
  Code preview: bg-bg-subtle rounded p-3 mt-3 font-mono text-xs text-text-secondary line-clamp-4 whitespace-pre
  Footer row (mt-3): [TagPill x2 max] [flex-1] [Star button] [date text-xs text-tertiary]
  Star (Heart or Star icon): filled when isFavorite (text-warning), outline when not (text-tertiary). size 14.

LIST VIEW (Notion table row style):
  flex items-center gap-3 px-4 py-3 border-b border-border-base hover:bg-bg-hover transition-colors duration-100 cursor-pointer w-full
  [Code2 icon size 14, color var(--snippet)] [title text-sm text-text-primary flex-1 truncate] [LanguageBadge sm] [first 2 tags] [Star] [date text-xs text-tertiary]

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/snippets/SnippetGrid.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: snippets (Snippet[]), onSnippetClick, onFavorite, view ('grid'|'list'), isLoading (boolean)

If isLoading: show skeleton placeholders.
  Grid: 3x animated placeholder cards (animate-pulse bg-bg-subtle)
  List: 5x animated rows (animate-pulse)

If !isLoading && snippets.length === 0:
  EmptyState: icon=Code2 (amber), title="No snippets yet", description="Save code snippets you want to reference later", action=Button primary "Add snippet" → ROUTES.snippetNew

Grid layout: grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3
List layout: flex flex-col (no gap — borders create separation)

Render SnippetCard for each snippet.

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/snippets/SnippetForm.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: initialValues? (Partial<Snippet>), onSubmit ((data: SnippetCreateInput) => Promise<void>), onCancel? (() => void), isLoading? (boolean)

This is used for both create and edit.

Fields (top to bottom):
  1. Title: Input label="Title" placeholder="What is this snippet?" required
  2. Language: a Select dropdown. Use our Dropdown component or a native <select> styled to match.
     Populated from SUPPORTED_LANGUAGES. Styled: same as Input (bg-bg-subtle border border-border-base rounded px-3 py-1.5 text-sm).
  3. Description: Input label="Description" placeholder="Brief context (optional)"
  4. Code: Textarea label="Code" rows=12 (the main content). font-mono for this textarea.
     Wrap in a div with code-editor feel: bg-bg-subtle border border-border-base rounded. 
     Inside: language indicator header row + textarea below it.
  5. Tags: TagSelector (pass availableTags=[] as placeholder)

Buttons row (mt-6 flex gap-2 justify-end): "Cancel" ghost + "Save snippet" primary (isLoading on submit)
onSubmit: gather form data, call onSubmit prop.

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/snippets/SnippetDetailPanel.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: snippet (Snippet), onEdit (() => void), onDelete (() => void), onFavorite ((id: string) => void)

HEADER (flex items-start justify-between mb-6):
  Left: [Code2 icon amber] + title (text-xl font-semibold text-text-primary mt-0.5 ml-2)
  Right: action buttons row:
    Star toggle button (Star/StarOff icon, ghost, text-warning if favorite)
    "Edit" Button ghost size=sm (Pencil icon)
    "Delete" Button danger size=sm (Trash2 icon)
    Confirm delete: show a small inline confirmation (not modal) — "Are you sure?" with Confirm/Cancel.

META ROW (flex gap-4 items-center mb-6 text-sm text-text-secondary):
  LanguageBadge md | Created: formatDate | Updated: formatRelativeTime

TAGS ROW (flex gap-1.5 flex-wrap mb-6):
  Each tag as TagPill

CODE BLOCK:
  CodeBlock component: code={snippet.content} language={snippet.language} showLineNumbers={true}
  No maxLines on detail view — show full code.

DESCRIPTION (if exists):
  Heading "Notes" text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2 mt-6
  paragraph text-sm text-text-secondary leading-relaxed
```

---

## PROMPT 11 — Snippet Pages

**Files:** `snippets/page.tsx` · `snippets/new/page.tsx` · `snippets/[id]/page.tsx` · `snippets/[id]/edit/page.tsx` · `snippets/loading.tsx`

```
[PASTE CONTEXT BRIEF ABOVE FIRST]

Build all snippet pages. Components are ready (SnippetGrid, SnippetForm, SnippetDetailPanel).
Hook: useSnippets() from src/lib/hooks/useSnippets.ts.

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/app/(dashboard)/snippets/page.tsx — LIST PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━
'use client'. State: view ('grid'|'list'), selectedTagIds (string[]), searchQuery (string).
const { snippets, isLoading, toggleFavorite } = useSnippets()
const { tags } = useTags()

Filter snippets by selectedTagIds and searchQuery (client-side).
const filtered = snippets.filter(s =>
  (selectedTagIds.length === 0 || s.tags.some(t => selectedTagIds.includes(t.id))) &&
  (searchQuery === '' || s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.content.toLowerCase().includes(searchQuery.toLowerCase()))
)

TOPBAR: title="Snippets" subtitle={`${filtered.length} saved`}
actions:
  [GlobalSearchBar compact version — inline in topbar, w-56] 
  [Grid/List toggle: two icon buttons (LayoutGrid / List icon), active one gets bg-bg-hover]
  [Button primary size=sm leftIcon=Plus "New Snippet" onClick→ROUTES.snippetNew]

BELOW TOPBAR (before grid, inside PageWrapper):
  TagFilter: tags={tags} selectedTagIds onFilterChange

SnippetGrid: snippets={filtered} view={view} isLoading onFavorite onSnippetClick→navigate to ROUTES.snippet(id)

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/app/(dashboard)/snippets/loading.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Renders SnippetGrid with isLoading=true and snippets=[] and view='grid'.
Wrap in PageWrapper. No TopBar needed (layout handles it).

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/app/(dashboard)/snippets/new/page.tsx — CREATE PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━
'use client'. const { createSnippet } = useSnippets(); const router = useRouter()

<TopBar title="New Snippet" actions={<BackButton href={ROUTES.snippets} />} />
<PageWrapper>
  <div className="max-w-2xl">
    <h1 className="text-xl font-semibold text-text-primary mb-1">Save a Snippet</h1>
    <p className="text-sm text-text-secondary mb-8">Capture code you want to reuse.</p>
    <SnippetForm
      onSubmit={async (data) => { await createSnippet(data); router.push(ROUTES.snippets) }}
      onCancel={() => router.push(ROUTES.snippets)}
    />
  </div>
</PageWrapper>

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/app/(dashboard)/snippets/[id]/page.tsx — DETAIL PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━
'use client'. const params = useParams(); const { snippets, deleteSnippet, toggleFavorite } = useSnippets()
const snippet = snippets.find(s => s.id === params.id)

If !snippet: show EmptyState (not-found feel) with BackButton.

<TopBar
  title={snippet.title}
  actions={
    <>
      <CopyButton text={snippet.content} label="Copy code" size="md" />
      <BackButton href={ROUTES.snippets} label="Snippets" />
    </>
  }
/>
<PageWrapper>
  <SnippetDetailPanel
    snippet={snippet}
    onEdit={() => router.push(ROUTES.snippetEdit(snippet.id))}
    onDelete={async () => { await deleteSnippet(snippet.id); router.push(ROUTES.snippets) }}
    onFavorite={toggleFavorite}
  />
</PageWrapper>

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/app/(dashboard)/snippets/[id]/edit/page.tsx — EDIT PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━
Same as new but: pre-fill form with snippet data, call updateSnippet on submit.
Title: "Edit Snippet"
```

---

## PROMPT 12 — Bookmark Components + Pages

**Files:** All bookmark components + pages

> **Model:** Qwen works well for this since it mirrors the Snippet pattern closely.
> Use the QWEN TEMPLATE. Replace "snippet" with "bookmark" throughout.

```
[PASTE CONTEXT BRIEF ABOVE FIRST]

Build all bookmark components and pages for DevVault.
Bookmarks are saved URLs with title, description, and optional favicon.
Identity color: #3B82F6 (blue) via CSS var --bookmark.

Pattern reference: Follow the EXACT same structure as Snippet components (built in Prompt 10+11).
Adapt for Bookmark's data shape:
  Snippet.content (code) → Bookmark.url (a link)
  Snippet.language → Bookmark.favicon (optional image)
  CodeBlock → FaviconDisplay (simple — just show favicon image or Bookmark icon fallback)
  No syntax highlighting needed for bookmarks.

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/bookmarks/BookmarkCard.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: bookmark (Bookmark), onClick, onFavorite, view ('grid'|'list')

GRID VIEW:
  Border/hover same as SnippetCard grid.
  Header: [favicon img (16x16, rounded-sm) or Bookmark icon fallback, blue] + [title font-medium] + [external link icon size 12 text-tertiary]
  URL preview: text-xs text-accent font-mono truncate mt-2 (shows the domain only: new URL(url).hostname)
  Description (if exists): text-sm text-text-secondary line-clamp-2 mt-2
  Footer: tags + star + date (same as snippet)

LIST VIEW:
  Same list-row pattern. [favicon/icon] [title flex-1] [domain text-xs text-tertiary] [tags x1] [star] [date]

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/bookmarks/BookmarkForm.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Fields:
  1. URL: Input type="url" label="URL" placeholder="https://..." required
     On blur/change: try to auto-extract domain title using URL API (just prefill title field with hostname as fallback)
  2. Title: Input label="Title" placeholder="What is this link?" required
  3. Description: Textarea label="Description" rows=3 optional
  4. Tags: TagSelector

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/bookmarks/BookmarkDetailPanel.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Header: [favicon/icon blue] + title text-xl font-semibold
Actions: Star, "Open link" (ExternalLink icon, primary button → window.open(url, '_blank')), Edit, Delete
URL display: text-sm text-accent font-mono break-all mt-2 (clickable, opens link)
Description, Tags, Dates — same pattern as snippet.

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/bookmarks/BookmarkGrid.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Same as SnippetGrid but for bookmarks.
EmptyState: icon=Bookmark (blue), title="No bookmarks yet", description="Save links you want to revisit"

━━━━━━━━━━━━━━━━━━━━━━━━━
PAGES (follow exact same structure as Snippet pages):
━━━━━━━━━━━━━━━━━━━━━━━━━
/bookmarks/page.tsx: TopBar title="Bookmarks", filter by tags, search by title/url, grid/list toggle
/bookmarks/loading.tsx: BookmarkGrid isLoading=true
/bookmarks/new/page.tsx: Heading "Save a Bookmark", subtext "Links you want to find again"
/bookmarks/[id]/page.tsx: "Open link" button in TopBar actions (primary), BookmarkDetailPanel
```

---

## PROMPT 13 — Command Components + Pages

**Files:** All command components + pages

```
[PASTE CONTEXT BRIEF ABOVE FIRST]

Build command components for DevVault. Commands are terminal command strings.
Identity color: #10B981 (emerald) via CSS var --command.
Key difference from snippets: always displayed in monospace, grouped by platform.
NO grid view — commands are always shown as a list (cheatsheet density).

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/commands/CommandCard.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: command (Command), onClick, onFavorite
Always list-row layout (no grid prop).

Layout (list-row pattern): 
  flex items-center gap-3 px-4 py-3 border-b border-border-base hover:bg-bg-hover transition-colors duration-100 cursor-pointer

Left: Terminal icon size 14 color var(--command)
Center-left: title text-sm text-text-primary font-medium (flex-1)
Center: the command text — bg-bg-subtle rounded px-2 py-0.5 font-mono text-xs text-command max-w-[280px] truncate
  + CopyButton size='sm' inline (copy just the command string)
Right: [tags x1] [star] [date text-xs text-tertiary]

Platform badge: a tiny pill label showing the platform.
  Platform colors: macos=gray, linux=orange, windows=blue, cross-platform=emerald
  Use Badge variant='default' styled with the platform's color.

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/commands/CommandList.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: commands (Command[]), onSelect, onFavorite, isLoading, groupByPlatform? (boolean, default false)

If isLoading: 5 skeleton rows.
If empty: EmptyState icon=Terminal (emerald), title="No commands saved", description="Never forget a useful terminal command again"

If groupByPlatform:
  Group commands by platform value.
  Render a section header before each group:
    "macOS", "Linux", "Windows", "Cross-platform"
    Style: text-xs font-semibold text-text-tertiary uppercase tracking-widest px-4 py-2 mt-2 bg-bg-subtle border-b border-border-base

Render CommandCard for each command.

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/commands/CommandForm.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Fields:
  1. Title: Input label="Title" placeholder="What does this command do?"
  2. Command string: styled mono input
     Container: flex items-center bg-bg-subtle border border-border-base rounded px-3 py-1.5
     Left: "$ " span (text-text-tertiary font-mono text-sm select-none)
     Input: font-mono text-sm text-text-primary bg-transparent border-none focus:outline-none flex-1
     Tab key: insert 2 spaces (preventDefault + insert manually)
  3. Platform: Select (native styled or Dropdown):
     Options with icons: "macOS" (Apple logo text), "Linux" (terminal), "Windows", "Cross-platform"
     Styled same as Input.
  4. Description: Textarea optional
  5. Tags: TagSelector

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/commands/CommandDetailPanel.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Header: Terminal icon (emerald) + title text-xl font-semibold + platform badge + star + edit + delete

THE COMMAND DISPLAY (the star of the show):
  Container: bg-bg-subtle border border-border-base rounded p-5 mt-4
  Inner: flex items-center gap-2
    "$ " span (text-text-tertiary font-mono text-base select-none)
    command text (font-mono text-base text-text-primary break-all)
  CopyButton prominent: absolutely positioned top-right of container, size='md' label="Copy"

Description and tags below (same as snippet pattern).

━━━━━━━━━━━━━━━━━━━━━━━━━
PAGES:
━━━━━━━━━━━━━━━━━━━━━━━━━
/commands/page.tsx:
  Default view: always list. No grid toggle.
  Filter by platform: pill buttons "All | macOS | Linux | Windows | Cross-platform"
  Toggle "Group by platform" button.
  Search by title or command text.
  
/commands/loading.tsx: CommandList isLoading=true
/commands/new/page.tsx: Heading "Save a Command", subtext "Terminal commands, always at hand"
/commands/[id]/page.tsx: CopyButton prominent in TopBar actions. CommandDetailPanel.
```

---

## PROMPT 14 — Prompt Components + Pages

**Files:** All AI prompt components + pages

```
[PASTE CONTEXT BRIEF ABOVE FIRST]

Build prompt components for DevVault. These are AI prompt templates (for Claude, GPT, etc.).
Identity color: #8B5CF6 (violet) via CSS var --prompt.
Key difference: prompts are LONG TEXT — not code. Use DM-like fonts, generous spacing.
The reading experience is paramount.

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/prompts/PromptCard.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: prompt (Prompt), onClick, onFavorite, view ('grid'|'list')

GRID VIEW:
  Same card structure as snippets.
  Header: [Sparkles icon violet size 16] [title text-sm font-medium] [model badge]
  Model badge: text-xs font-mono bg-prompt-color/10 text-prompt-color border border-prompt-color/20 rounded-full px-2 py-0.5
  Content preview: first 150 chars of prompt.content
    bg-bg-subtle rounded p-3 mt-3 text-sm text-text-secondary line-clamp-3
    Use regular font (NOT mono — prompts are natural language)
  useCase (if exists): text-xs text-text-tertiary italic mt-2
  Footer: tags + star + date

LIST VIEW: title + model badge + truncated first line + tags + date (standard row)

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/prompts/PromptForm.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Fields:
  1. Title: Input label="Title" required
  2. Model: Select/Dropdown with these options:
     "gpt-4o", "gpt-4-turbo", "claude-3-5-sonnet", "claude-opus-4",
     "claude-sonnet-4", "gemini-1.5-pro", "gemini-flash", 
     "qwen-2.5-72b", "llama-3.3", "any / model-agnostic"
     Plus "Custom..." option that reveals a free-text Input.
  3. Use Case: Input optional placeholder="e.g. Code review, Documentation, Brainstorming"
  4. Prompt Content: Textarea min-h-[400px], rows=16 — the main field.
     Style this to feel like a writing area:
       bg-bg-subtle border border-border-base rounded p-4 leading-relaxed text-text-primary
       Inside: character count below-right (text-xs text-tertiary "1,247 chars")
     Use Textarea component but with augmented wrapper.
  5. Tags: TagSelector

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/prompts/PromptDetailPanel.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
This is the most text-forward of all detail panels.
Header: [Sparkles violet] + title text-xl font-semibold + model badge + star + edit + delete
Use case (if exists): pill label below title (text-xs text-text-tertiary bg-bg-hover rounded-full px-3 py-1 inline-block)

THE PROMPT CONTENT BLOCK:
  Container: bg-bg-subtle border border-border-base rounded p-6 mt-4 relative
  Text: text-sm text-text-primary leading-relaxed whitespace-pre-wrap (readable line height, NOT monospace)
  CopyButton top-right of container: labeled "Copy Prompt" (not just icon — this is the primary action)
    Style: Button primary size='sm' leftIcon=Copy

Tags and dates at bottom — same as other panels.

━━━━━━━━━━━━━━━━━━━━━━━━━
PAGES:
━━━━━━━━━━━━━━━━━━━━━━━━━
/prompts/page.tsx:
  Filter by model: pill buttons. Show top 5 models + "All".
  Filter by tags: TagFilter
  Grid default (prompts look good in cards)
  Search by title or content text.
  EmptyState: icon=Sparkles (violet), title="No prompts saved", description="Build your library of AI prompts that actually work"

/prompts/loading.tsx: PromptGrid isLoading=true
/prompts/new/page.tsx: Heading "Save a Prompt", subtext "Prompts that work, ready when you need them"
/prompts/[id]/page.tsx: "Copy Prompt" Button primary in TopBar actions (most important action). PromptDetailPanel.
```

---

## PROMPT 15 — Final Polish Pass

**Files:** Minor fixes across all pages + new utility components

> **Model:** Distribute tasks — use Qwen for individual files, Claude Code for the keyboard shortcut and layout fixes.

```
[PASTE CONTEXT BRIEF ABOVE FIRST]

All major pages and components are built. This is the final polish pass.
Complete each task below. Each is a separate small file change.

━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 1: not-found.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/app/(dashboard)/not-found.tsx

Centered full-page 404 state.
Large "404" text-[120px] font-semibold text-border-base (faded, like Notion's placeholder text)
Below: "This page doesn't exist" text-xl text-text-secondary
Below: "Go home" Button primary → ROUTES.home
Centered with PageWrapper.

━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 2: loading.tsx files
━━━━━━━━━━━━━━━━━━━━━━━━━
Already done for each section IF you followed prompts 11-14.
Verify these exist: snippets/loading.tsx, bookmarks/loading.tsx, commands/loading.tsx, prompts/loading.tsx.
Each renders the section's grid/list component with isLoading=true.

━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 3: Sidebar active state audit
━━━━━━━━━━━━━━━━━━━━━━━━━
Review Sidebar.tsx active state logic:
  - /dashboard — EXACT match only (pathname === ROUTES.home, NOT startsWith)
  - /dashboard/snippets and /dashboard/snippets/* — startsWith('/dashboard/snippets')
  - Same for bookmarks, commands, prompts, tags, search

Fix if any of these are wrong.

━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 4: Mobile responsiveness audit
━━━━━━━━━━━━━━━━━━━━━━━━━
Ensure all pages work on mobile (< 1024px):
  - Sidebar: hidden. Hamburger in TopBar shows MobileDrawer. ✓ (already built)
  - Grids: collapse to 1 column (grid-cols-1). ✓
  - TopBar actions: check if they overflow. Add hidden sm:flex if needed. Ensure at minimum "New" button visible.
  - Forms: all inputs full-width. ✓
  - PageWrapper: px-4 on mobile, px-6 on desktop. ✓

━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 5: Consistent empty state + loading state audit
━━━━━━━━━━━━━━━━━━━━━━━━━
Verify each section has:
  - Loading skeleton: ✓ (from loading.tsx)
  - Empty state with correct icon color (amber/blue/emerald/violet)
  - Empty state action button linking to the "new" page

━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 6: Global style additions to globals.css
━━━━━━━━━━━━━━━━━━━━━━━━━
Add to src/app/globals.css:

/* Focus ring style — consistent across all interactive elements */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Remove default focus outline in favor of focus-visible */
:focus:not(:focus-visible) {
  outline: none;
}

/* Prevent layout shift from scrollbar appearing */
html {
  overflow-y: scroll;
}

━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 7: Stagger animation helper
━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/lib/utils/animations.ts

Export reusable Framer Motion variants:
  dropdownVariants: { hidden: {opacity:0, scale:0.97, y:4}, visible: {opacity:1, scale:1, y:0}, exit: {opacity:0, scale:0.97, y:4} }
  modalVariants: { hidden: {opacity:0, scale:0.96, y:8}, visible: {opacity:1, scale:1, y:0}, exit same }
  fadeInVariants: { hidden: {opacity:0, y:6}, visible: {opacity:1, y:0} }
  staggerContainer: { visible: { transition: { staggerChildren: 0.05 } } }
  
Export dropdownTransition: { duration: 0.15, ease: 'easeOut' }
Export modalTransition: { duration: 0.2, ease: 'easeOut' }
```

---

## ✅ FULL BUILD COMPLETE CHECKLIST

Verify before declaring the build done:

**Design:**
- [ ] All backgrounds are light (no dark panels)
- [ ] Text is warm dark gray #37352F, not black
- [ ] Sidebar is #F7F7F5 (slightly gray)
- [ ] All cards use border only (no shadow except on hover)
- [ ] Inter font renders for all UI text
- [ ] SF Mono / system mono renders for code and command text
- [ ] Icons are 16px, strokeWidth 1.5, monochromatic

**Pages:**
- [ ] /login — renders, no sidebar
- [ ] /register — renders, no sidebar
- [ ] /dashboard — stats row, quick actions, empty recent
- [ ] /dashboard/snippets — list and grid view work, filter by tag works
- [ ] /dashboard/snippets/new — form renders, all fields present
- [ ] /dashboard/bookmarks — same structure ✓
- [ ] /dashboard/commands — list-only, platform filter pills visible
- [ ] /dashboard/prompts — grid default, model filter pills
- [ ] /dashboard/tags — tag manager panel visible
- [ ] /dashboard/search — search bar top, results list below

**Interactions:**
- [ ] Cmd+K → search
- [ ] Cmd+N → new item modal
- [ ] Framer Motion: all dropdowns/menus animate in/out
- [ ] Sidebar active states correct (Home = exact, others = startsWith)
- [ ] Mobile: hamburger shows/hides sidebar drawer

**Code quality:**
- [ ] No TypeScript errors (`npx tsc --noEmit` passes)
- [ ] No `any` types
- [ ] All components have typed props interfaces
- [ ] No hardcoded hex colors in className
- [ ] `npm run build` succeeds
