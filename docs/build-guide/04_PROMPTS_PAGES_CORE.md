# DevVault — Build Prompts: Core Pages (05–09)
> **Prompts for:** Auth Pages → Dashboard Overview → Search → Tags → Common Feature Components
> Prerequisites: Prompts 00–04 must be complete. Verify the foundation checklist before starting.

---

## CONTEXT BRIEF (paste at start of every session)

```
Project: DevVault — developer knowledge management tool (Notion-inspired)
Stack: Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, Lucide React
Design: LIGHT MODE. Notion-style. White pages, gray sidebar, warm dark text.

Key token classes:
  bg-main (white) | bg-sidebar (#F7F7F5) | bg-hover (#EFEFED) | bg-subtle (#F1F1EF)
  text-primary (#37352F) | text-secondary (#787774) | text-tertiary (#ACABA8)
  border-base (#E9E9E7) | accent (#2383E2)
  Content colors: snippet (#F59E0B) | bookmark (#3B82F6) | command (#10B981) | prompt-color (#8B5CF6)

Component paths:
  Button, Input, Textarea, Badge, Spinner → src/components/common/ui/[Name].tsx
  Card, Modal, TagPill, CopyButton, EmptyState, ContentTypeBadge, Dropdown → same path
  Sidebar, TopBar, PageWrapper, BackButton → src/components/common/layout/[Name].tsx
  All types → src/lib/types/index.ts
  ROUTES → src/lib/constants/routes.ts
  cn() → src/lib/utils/cn.ts
  formatDate(), formatRelativeTime() → src/lib/utils/format.ts
```

---

## PROMPT 05 — Auth Pages (Login + Register)

**Files:** `src/app/(auth)/login/page.tsx` · `src/app/(auth)/register/page.tsx` · `src/app/(auth)/layout.tsx`

```
[PASTE CONTEXT BRIEF ABOVE FIRST]

Build the authentication pages for DevVault. These are OUTSIDE the dashboard shell (no sidebar).
Design reference: Notion's login page — centered card on a light background. Clean, minimal.
No complex branding. Just functional and polished.

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/app/(auth)/layout.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Centers children on screen. Full page height.
bg-bg-subtle (the subtle off-white, not pure white for contrast with the card).
Flex col, items-center, justify-center, min-h-screen.

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/app/(auth)/login/page.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
'use client'. useState for email, password, isLoading.

CARD: w-full max-w-sm bg-bg-main border border-border-base rounded-md shadow-notion-menu p-8

TOP:
  Logo area: same as sidebar — small dark square + "DevVault" text-sm font-semibold
  Below: "Welcome back" text-xl font-semibold text-text-primary mt-6
  Subtext: "Sign in to your vault" text-sm text-text-secondary mt-1

FORM (flex flex-col gap-4 mt-6):
  Input: label="Email", type="email", placeholder="you@example.com", value bound to state
  Input: label="Password", type="password", placeholder="••••••••", value bound to state
  
  Forgot password link: text-xs text-accent hover:underline self-end -mt-2

  Button primary full-width: "Sign in" (isLoading state on submit)
  On submit: just console.log + setIsLoading for mock — no real API call.

FOOTER:
  Below card: "Don't have an account?" text-sm text-text-secondary
  + Link to register: text-accent hover:underline font-medium

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/app/(auth)/register/page.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
'use client'. Same structure as login but:
  Heading: "Create your account"
  Subtext: "Start building your developer vault"
  Fields: Name input (required), Email, Password, Confirm Password
  Button: "Create account"
  Footer: "Already have an account?" + link to login
  
Validate passwords match before submit (show error if they don't using Input error prop).
```

---

## PROMPT 06 — Dashboard Overview Page

**Files:** `src/app/(dashboard)/page.tsx`

> **Model recommendation:** This page has more layout complexity — use Claude Code.

```
[PASTE CONTEXT BRIEF ABOVE FIRST]

Build the main dashboard overview page for DevVault.
This is what the user sees first after logging in.
URL: /dashboard

Think of this like Notion's home page — a summary view, not a data-heavy table.
It should feel like a welcome screen that provides quick access to each section.

━━━━━━━━━━━━━━━━━━━━━━━━━
LAYOUT STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━
<TopBar title="Home" actions={<QuickAddButton />} />
<PageWrapper>
  [Greeting section]
  [Stats row]
  [Quick actions grid]
  [Recent items section]
</PageWrapper>

━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1 — Greeting
━━━━━━━━━━━━━━━━━━━━━━━━━
text-2xl font-semibold text-text-primary "Your Developer Vault"
text-sm text-text-secondary mt-1 "Everything you know, organized."
mb-8

━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2 — Stats Row
━━━━━━━━━━━━━━━━━━━━━━━━━
4 stat cards in a responsive grid: grid-cols-2 md:grid-cols-4 gap-3

Each stat card:
  bg-bg-main border border-border-base rounded p-4 hover:shadow-notion-card transition-all duration-100 cursor-pointer
  Top row: [icon with identity color] + count (text-2xl font-semibold text-text-primary)
  Bottom: label (text-sm text-text-secondary)
  onClick: navigate to that section's ROUTES

Use mock counts: { snippets: 0, bookmarks: 0, commands: 0, prompts: 0 }
Icons + colors: Code2/snippet-color, Bookmark/bookmark-color, Terminal/command-color, Sparkles/prompt-color
Icon size 18, wrapped in a w-8 h-8 rounded flex items-center justify-center using color/10 opacity bg.

━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3 — Quick Actions
━━━━━━━━━━━━━━━━━━━━━━━━━
Heading: "Add something new" text-sm font-medium text-text-secondary mb-3

4 action items in a horizontal row (flex flex-wrap gap-2):
Each: Button variant='secondary' size='sm' with left icon. 
  "+ Snippet" → navigate to ROUTES.snippetNew
  "+ Bookmark" → navigate to ROUTES.bookmarkNew
  "+ Command" → navigate to ROUTES.commandNew
  "+ Prompt" → navigate to ROUTES.promptNew

━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4 — Recent Items (mock)
━━━━━━━━━━━━━━━━━━━━━━━━━
Heading row: "Recent" text-sm font-medium text-text-primary + "View all" link (text-xs text-accent)
mt-8 mb-3

Show an EmptyState if no items:
  icon: Clock (Lucide), title: "Nothing here yet", 
  description: "Items you create will appear here"
  action: Button primary size="sm" "Add your first snippet" → ROUTES.snippetNew

━━━━━━━━━━━━━━━━━━━━━━━━━
Framer Motion
━━━━━━━━━━━━━━━━━━━━━━━━━
Stagger children on mount:
  Each section fades in with y: 8 → 0, opacity 0 → 1
  Delay: 0, 0.05, 0.1, 0.15s for each section
  Duration: 0.25s easeOut
```

---

## PROMPT 07 — Feature Components (Tags + Search)

**Files:** Tag components + Search components

> **Model:** Use Claude Code for this prompt — it spans many files.

```
[PASTE CONTEXT BRIEF ABOVE FIRST]

Build the tag management and search feature components for DevVault.
These are shared across all content sections.

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/tags/TagSelector.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: selectedTags (Tag[]), onTagsChange ((tags: Tag[]) => void), availableTags (Tag[])
'use client'.

This is a multi-select tag picker for forms. Inline, not a modal.

Layout: 
  [Selected tag pills row — renders TagPill with onRemove for each]
  [Dropdown trigger: "+ Add tag" button/input]

Dropdown (Framer Motion, same animation as menu):
  Search input at top: filter available tags by name (text search)
  List of matching tags: each shows a color dot (w-3 h-3 rounded-full inline-block)
    + tag name. Click to select (add to selectedTags).
  Already selected tags: show with a checkmark instead, clicking removes them.
  "No tags found" empty message if search returns nothing.
  "Create tag" row if typed text doesn't match any tag (stretch goal — just UI for now).

Close dropdown on: outside click, Escape key.

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/tags/TagFilter.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: tags (Tag[]), selectedTagIds (string[]), onFilterChange ((tagIds: string[]) => void)

Horizontal scrollable row of tag pills used for filtering list/grid pages.
Each tag: renders as a pill button. When selected: slightly different style (border becomes solid, text darkens).
"All" pill at start (deselects all filters).
flex gap-1.5 overflow-x-auto pb-1 (custom scrollbar thin).

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/tags/TagManagerPanel.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: tags (Tag[]), onCreateTag, onUpdateTag, onDeleteTag

Full tag management UI for the /dashboard/tags page.
List of all tags:
  Each row: [color dot] [name] [count pill "3 snippets, 2 bookmarks"] [edit pencil] [delete trash]
  Hover row to reveal action buttons.
  
Edit inline: clicking pencil shows an inline input to rename + color picker (simple: 8 preset colors).
Delete: clicking trash shows a small confirm (can use Dropdown or inline).
"+ New tag" button at top opens an inline form row at top of list.

Preset colors for tags (an array of 8 hex values, user picks one):
  #F59E0B, #3B82F6, #10B981, #8B5CF6, #EC4899, #EF4444, #F97316, #6366F1

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/search/GlobalSearchBar.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: onSearch ((query: string) => void), isLoading? (boolean), placeholder? (string)
'use client'.

Full-width search input with:
  Left: Search icon (size 16, text-text-tertiary)
  Input: no border/bg on the input itself — the outer wrapper provides styling
    text-sm text-text-primary placeholder:text-text-tertiary
    focus:outline-none, py-2 px-3
  Right: if isLoading show Spinner sm. If value not empty, show X clear button.

Outer wrapper: flex items-center gap-2 bg-bg-subtle border border-border-base rounded px-3
  focus-within: border-border-focus ring-2 ring-accent/20

Keyboard: pressing Escape clears and blurs. Fires onSearch onChange (debounce 300ms using useEffect + setTimeout).

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/search/SearchResultItem.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: result (SearchResult type), onClick (() => void)

Single search result row. Notion-style list item.
Layout: flex items-start gap-3 px-4 py-3 border-b border-border-base hover:bg-bg-hover cursor-pointer transition-colors duration-100

Left: ContentTypeBadge (type only, no label) — acts as a visual type indicator
Center:
  Title: text-sm font-medium text-text-primary
  Preview: text-xs text-text-secondary line-clamp-1 mt-0.5
  Tags row: flex gap-1 mt-1 (first 3 tags as TagPill size='sm')
Right: text-xs text-text-tertiary (formatRelativeTime of createdAt)

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/search/SearchResultsList.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
Props: results (SearchResult[]), isLoading (boolean), query (string), onResultClick ((result: SearchResult) => void)

If isLoading: show 5 skeleton rows (gray animated placeholder blocks, pulse animation using Tailwind animate-pulse).
If !isLoading && results.length === 0 && query:
  EmptyState: icon=Search, title="No results found", description=`Nothing matching "${query}"`
If !isLoading && results.length === 0 && !query:
  EmptyState: icon=Search, title="Search your vault", description="Try searching for snippets, bookmarks, commands, or prompts"
Otherwise: list of SearchResultItem components.
```

---

## PROMPT 08 — Tags Page + Search Page

**Files:** `src/app/(dashboard)/tags/page.tsx` · `src/app/(dashboard)/search/page.tsx`

```
[PASTE CONTEXT BRIEF ABOVE FIRST]

Already built:
  TagManagerPanel (src/components/tags/TagManagerPanel.tsx)
  GlobalSearchBar (src/components/search/GlobalSearchBar.tsx)
  SearchResultsList (src/components/search/SearchResultsList.tsx)
  All layout components: TopBar, PageWrapper, BackButton.
  useTags hook: src/lib/hooks/useTags.ts (returns { tags, isLoading })
  useSearch hook: src/lib/hooks/useSearch.ts (returns { results, isLoading, search, clearResults })

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/app/(dashboard)/tags/page.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
'use client'.

const { tags, isLoading, createTag, updateTag, deleteTag } = useTags()

<TopBar
  title="Tags"
  subtitle={`${tags.length} tag${tags.length !== 1 ? 's' : ''}`}
/>
<PageWrapper>
  {isLoading ? <Spinner md centered /> : (
    <TagManagerPanel
      tags={tags}
      onCreateTag={createTag}
      onUpdateTag={updateTag}
      onDeleteTag={deleteTag}
    />
  )}
</PageWrapper>

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/app/(dashboard)/search/page.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
'use client'. Uses useSearchParams to pre-fill query if ?q= param present.

const { results, isLoading, search, clearResults } = useSearch()
const [query, setQuery] = useState(searchParams.get('q') || '')

On mount: if initial query exists, call search(query).

Layout:
<TopBar title="Search" />
<div className="px-6 pt-6 pb-3 border-b border-border-base">
  <GlobalSearchBar
    onSearch={(q) => { setQuery(q); if (q) search(q); else clearResults() }}
    isLoading={isLoading}
    placeholder="Search snippets, bookmarks, commands, prompts..."
  />
  {results.length > 0 && !isLoading && (
    <p className="text-xs text-text-tertiary mt-2">{results.length} results for "{query}"</p>
  )}
</div>
<SearchResultsList
  results={results}
  isLoading={isLoading}
  query={query}
  onResultClick={(result) => router.push(ROUTES[result.type](result.id))}
/>

Navigation on result click: use Next.js useRouter().
```

---

## PROMPT 09 — Global Keyboard Shortcuts + Cmd+K

**File:** `src/components/common/layout/KeyboardShortcuts.tsx`

> **Model:** Qwen works fine for this single file. Use [QWEN VERSION] below.

```
[PASTE CONTEXT BRIEF ABOVE FIRST]

Build a global keyboard shortcut handler component for DevVault.
This is a 'use client' component, mounted once in the dashboard layout.

━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: src/components/common/layout/KeyboardShortcuts.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━
'use client'. Uses: useRouter, useEffect, useState from react.

SHORTCUTS TO HANDLE:
  Cmd/Ctrl + K: router.push(ROUTES.search) — open search
  Cmd/Ctrl + N: open a "New item" dropdown (show a small floating modal centered on screen)
    The modal has 4 options: "+ New Snippet", "+ New Bookmark", "+ New Command", "+ New Prompt"
    Each navigates to the corresponding ROUTES.*New route.
    Modal is simple: bg-bg-elevated border border-border-base rounded-md shadow-notion-menu p-2 w-60
    Use Framer Motion for entrance: scale 0.97→1, opacity 0→1, duration 0.15.

TOAST NOTIFICATION:
  On first mount (check localStorage key 'devvault-shortcut-hint' — if not set, show toast + set key):
    Bottom-right floating toast: "Press ⌘K to search" 
    Style: fixed bottom-4 right-4 bg-bg-elevated border border-border-base rounded shadow-notion-menu px-3 py-2 text-sm text-text-primary z-50
    Auto-dismiss after 4000ms. Use Framer Motion for slide-in from bottom.

EVENT LISTENER:
  useEffect: add keydown listener to window. Check e.key === 'k' && (e.metaKey || e.ctrlKey).
  Always remove listener on cleanup.

RETURN: render the "New item" modal (AnimatePresence) + toast (AnimatePresence). No visible UI otherwise (renders null base).

Add this component to src/app/(dashboard)/layout.tsx — place it as a sibling before <main>.
```

---

## ✅ CORE PAGES COMPLETE CHECKLIST

After completing PROMPT 05–09, verify:

- [ ] `/login` — centered card on gray bg, Inter font, no dark colors
- [ ] `/register` — same card style, password validation works
- [ ] `/dashboard` — stats row visible, Quick Actions row works, empty state shows for Recent
- [ ] `/dashboard/tags` — tag manager renders (even if empty)
- [ ] `/dashboard/search` — search bar centered at top, empty state below
- [ ] `Cmd+K` → navigates to /search
- [ ] `Cmd+N` → shows floating new-item modal with 4 options
- [ ] First load: shortcut hint toast appears in bottom-right, auto-dismisses
- [ ] All pages: TopBar shows correct title, sidebar nav highlights correct item
