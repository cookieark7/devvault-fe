# DevVault — Design System (Notion-Inspired)
> **Reference this file for every design decision.**
> Design language: Notion. Light, clean, document-first.

---

## 🎨 Design Philosophy

DevVault uses a **Notion-inspired design system** — not a dashboard, not a SaaS app.  
Think of it as a **personal wiki for developers**. The interface should feel calm, focused, and get out of the way of the content.

**Principles:**
- White space is intentional. Breathing room > density.
- Content is the hero. UI chrome is invisible.
- Interactions are fast and subtle. No bouncy animations.
- Everything is keyboard-navigable.

---

## 1. Typography

### Font Stack
```css
/* Primary UI Font — Inter */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Code / Monospace */
font-family: 'SF Mono', 'Menlo', 'Monaco', 'Consolas', 'Courier New', monospace;
```

Import Inter from Google Fonts in `src/styles/fonts.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
```

### Font Weights
| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body text, descriptions, secondary labels |
| Medium | 500 | Navigation items, card titles, form labels |
| Semibold | 600 | Page headings, important CTAs, section titles |

> **Rule:** Never use 700+ (bold) except for the app wordmark. Notion is never heavy.

### Font Sizes (Tailwind)
| Token | Size | Usage |
|-------|------|-------|
| `text-xs` | 12px | Metadata, timestamps, badges |
| `text-sm` | 14px | Body text, descriptions, list items |
| `text-base` | 16px | Default readable content |
| `text-lg` | 18px | Card titles, subheadings |
| `text-xl` | 20px | Page titles |
| `text-2xl` | 24px | Major headings |

### Line Height
- Body text: `leading-relaxed` (1.625) — maximum readability
- UI labels: `leading-snug` (1.375) — tight but clear
- Code blocks: `leading-normal` (1.5)

---

## 2. Color Palette (Light Mode)

### Core CSS Variables
Define these in `src/app/globals.css` inside `:root`:

```css
:root {
  /* === BACKGROUNDS === */
  --bg-main: #FFFFFF;         /* Main editor/page canvas */
  --bg-sidebar: #F7F7F5;      /* Sidebar, left nav */
  --bg-hover: #EFEFED;        /* Hover states on list items, nav */
  --bg-subtle: #F1F1EF;       /* Input fields, code block backgrounds */
  --bg-elevated: #FFFFFF;     /* Modals, dropdowns (with shadow) */

  /* === BORDERS & DIVIDERS === */
  --border: #E9E9E7;          /* All borders — cards, inputs, dividers */
  --border-focus: #B7B7B5;    /* Focused inputs */

  /* === TEXT === */
  --text-primary: #37352F;    /* Main text — warm dark gray (never pure black) */
  --text-secondary: #787774;  /* Muted text, placeholders, labels */
  --text-tertiary: #ACABA8;   /* Very muted — timestamps, disabled */

  /* === INTERACTIVE ACCENT (Notion Blue) === */
  --accent: #2383E2;                      /* Links, focus rings, active nav */
  --accent-hover: #1A6FC4;               /* Hover on accent elements */
  --accent-muted: rgba(35, 131, 226, 0.1); /* Selection highlight bg */
  --selection: rgba(35, 131, 226, 0.28);  /* Text selection color */

  /* === CONTENT TYPE IDENTITY COLORS === */
  /* Used for icons, badges, and accents — never for backgrounds directly */
  --snippet: #F59E0B;   /* Amber — code snippets */
  --bookmark: #3B82F6;  /* Blue — bookmarks */
  --command: #10B981;   /* Emerald — terminal commands */
  --prompt: #8B5CF6;    /* Violet — AI prompts */
  --tag: #EC4899;       /* Pink — tags */

  /* Content color muted variants (10% opacity backgrounds) */
  --snippet-muted: rgba(245, 158, 11, 0.1);
  --bookmark-muted: rgba(59, 130, 246, 0.1);
  --command-muted: rgba(16, 185, 129, 0.1);
  --prompt-muted: rgba(139, 92, 246, 0.1);

  /* === SEMANTIC === */
  --success: #0F7B6C;
  --success-muted: rgba(15, 123, 108, 0.1);
  --error: #EB5757;
  --error-muted: rgba(235, 87, 87, 0.1);
  --warning: #DFAB01;
  --warning-muted: rgba(223, 171, 1, 0.1);
}
```

### Tailwind Config Mapping
In `tailwind.config.ts`, extend colors so you can use these as class names:

```ts
colors: {
  // Backgrounds
  'bg-main':    'var(--bg-main)',
  'bg-sidebar': 'var(--bg-sidebar)',
  'bg-hover':   'var(--bg-hover)',
  'bg-subtle':  'var(--bg-subtle)',
  'bg-elevated':'var(--bg-elevated)',
  // Borders
  'border-base':  'var(--border)',
  'border-focus': 'var(--border-focus)',
  // Text
  'text-primary':   'var(--text-primary)',
  'text-secondary': 'var(--text-secondary)',
  'text-tertiary':  'var(--text-tertiary)',
  // Accent
  'accent':       'var(--accent)',
  'accent-hover': 'var(--accent-hover)',
  'accent-muted': 'var(--accent-muted)',
  // Content types
  'snippet':       'var(--snippet)',
  'bookmark':      'var(--bookmark)',
  'command':       'var(--command)',
  'prompt-color':  'var(--prompt)',
  'tag-color':     'var(--tag)',
  // Semantic
  'success': 'var(--success)',
  'error':   'var(--error)',
  'warning': 'var(--warning)',
},
fontFamily: {
  sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
  mono: ['SF Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
},
```

---

## 3. UI & Layout Principles

### Main Layout Grid
```
┌──────────────────────────────────────────────┐
│  Sidebar (240px)  │  Main Content Area       │
│  bg-sidebar       │  bg-main                 │
│  fixed, full-h    │  flex-1, scrollable      │
│                   │  max-w: 900px content    │
└──────────────────────────────────────────────┘
```

- Sidebar: `width: 240px`, `background: var(--bg-sidebar)`, fixed position
- Main content: `flex-1`, `min-width: 0`, overflow scrollable
- Content wrapper: `max-width: 900px` centered within main area (for readable line lengths)
- Top padding: `pt-12` for page content (breathing room)

### Border Radius
| Usage | Value | Class |
|-------|-------|-------|
| Cards, panels | 4px | `rounded` |
| Buttons, inputs | 4px–6px | `rounded` or `rounded-md` |
| Menus, dropdowns | 6px | `rounded-md` |
| Tags, pills | full | `rounded-full` |
| Avatar | full | `rounded-full` |

> **Never use** `rounded-xl` or `rounded-2xl` for structural elements — only allowed for very specific decorative containers.

### Shadows
Notion uses almost NO shadows on flat surfaces. Exceptions:

```css
/* Dropdown / Popover / Modal shadow — crisp, layered */
box-shadow:
  rgba(15, 15, 15, 0.05) 0px 0px 0px 1px,
  rgba(15, 15, 15, 0.1) 0px 3px 6px,
  rgba(15, 15, 15, 0.2) 0px 9px 24px;

/* Inline card (subtle lift) — only on hover */
box-shadow:
  rgba(15, 15, 15, 0.05) 0px 0px 0px 1px,
  rgba(15, 15, 15, 0.05) 0px 2px 4px;
```

In Tailwind config, define these as:
```ts
boxShadow: {
  'notion-menu': 'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px',
  'notion-card': 'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.05) 0px 2px 4px',
}
```

### Spacing
- Card padding: `p-4` (inner content) with `px-5 py-4` for list rows
- Gap between cards: `gap-1` (list) or `gap-3` (grid)
- Section spacing: `space-y-6` or `space-y-8`
- Page max-width for readable content: `max-w-[900px] mx-auto`

### Sidebar Nav Item
```tsx
// Default state
"flex items-center gap-2 px-3 py-1.5 rounded text-sm text-secondary
 hover:bg-hover hover:text-primary cursor-pointer transition-colors duration-100"

// Active state
"flex items-center gap-2 px-3 py-1.5 rounded text-sm
 bg-hover text-primary font-medium"
```

---

## 4. Icons

**Library:** Lucide React (primary) — install with `npm install lucide-react`

### Rules:
- Default color: `text-secondary` (`#787774`)
- Hover / active color: `text-primary` (`#37352F`)
- Content type icons: use the content's identity color when in badges/headers
- Stroke width: always `strokeWidth={1.5}` (the default is 2 — slightly reduce it)
- Size: `size={16}` for nav/inline, `size={18}` for actions, `size={20}` for standalone icons

```tsx
import { Code2 } from 'lucide-react'

// ✅ Correct usage
<Code2 size={16} strokeWidth={1.5} className="text-secondary" />

// ✅ Active / content type
<Code2 size={16} strokeWidth={1.5} style={{ color: 'var(--snippet)' }} />
```

---

## 5. Framer Motion — Animation Spec

Install: `npm install framer-motion`

### Dropdown / Popover / Menu (Use Everywhere)
```tsx
import { motion, AnimatePresence } from 'framer-motion'

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.97, y: 4 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit:    { opacity: 0, scale: 0.97, y: 4 },
}

<AnimatePresence>
  {isOpen && (
    <motion.div
      variants={dropdownVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="absolute top-full left-0 mt-1 bg-bg-elevated border border-border-base rounded-md shadow-notion-menu z-50"
    >
      {/* menu content */}
    </motion.div>
  )}
</AnimatePresence>
```

### Page / Section Fade In
```tsx
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
>
  {/* page content */}
</motion.div>
```

### Notion Block Hover (Drag Handle + Plus Button)
Each content block (snippet card, bookmark row, etc.) should reveal controls on hover:
```tsx
const [isHovered, setIsHovered] = useState(false)

<div
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  className="relative group flex items-start gap-2"
>
  {/* Left-side block controls — appear on hover */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: isHovered ? 1 : 0 }}
    transition={{ duration: 0.1 }}
    className="flex items-center gap-0.5 absolute -left-14 top-1"
  >
    <button className="p-1 rounded hover:bg-hover text-secondary opacity-50 hover:opacity-100">
      <Plus size={14} strokeWidth={1.5} />
    </button>
    <button className="p-1 rounded hover:bg-hover text-secondary opacity-50 hover:opacity-100 cursor-grab">
      <GripVertical size={14} strokeWidth={1.5} />
    </button>
  </motion.div>

  {/* Actual content */}
  <div className="flex-1">{children}</div>
</div>
```

### List Item Hover (Background transition)
```tsx
// Use Tailwind — no motion needed for simple bg color transitions
className="transition-colors duration-100 hover:bg-hover"
```

### Modal Entrance
```tsx
// Backdrop
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.15 }}
  className="fixed inset-0 bg-black/30 z-40"
/>

// Panel
<motion.div
  initial={{ opacity: 0, scale: 0.96, y: 8 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.96, y: 8 }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
  className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
>
  <div className="bg-bg-elevated border border-border-base rounded-md shadow-notion-menu pointer-events-auto w-full max-w-lg">
    {/* modal content */}
  </div>
</motion.div>
```

---

## 6. Component Visual Reference

### Card (List Row Style — Notion table row feel)
```
┌─────────────────────────────────────────────────┐
│ [Icon]  Title                     [Badge] [Date] │  ← border-b border-base
│         Short description...                     │    py-3 px-4
└─────────────────────────────────────────────────┘
  hover: bg-hover
```

### Card (Grid Style)
```
┌─────────────────────────┐
│ [Icon]  Title    [Type] │  ← border border-base rounded p-4
│                         │
│ Preview text here...    │  ← text-secondary text-sm
│ line-clamp-3            │
│                         │
│ [tag] [tag]    Jan 15   │  ← text-tertiary text-xs
└─────────────────────────┘
  hover: shadow-notion-card
```

### Sidebar Section
```
 🏠 Home                   ← no label, always visible
 ─────────────────
 LIBRARY (label, text-tertiary text-xs tracking-wider)
 ⚡ Snippets               ← amber icon when active
 🔖 Bookmarks              ← blue icon when active
 > Commands                ← emerald icon when active
 ✨ Prompts                ← violet icon when active
 ─────────────────
 ORGANIZE
 🏷️ Tags
 ─────────────────
 FIND
 🔍 Search
```

### Button Variants
```
Primary:   bg-accent text-white hover:bg-accent-hover rounded px-3 py-1.5 text-sm font-medium
Secondary: bg-bg-subtle text-primary border border-border-base hover:bg-hover rounded px-3 py-1.5 text-sm
Ghost:     text-secondary hover:text-primary hover:bg-hover rounded px-2 py-1.5 text-sm
Danger:    text-error hover:bg-error-muted rounded px-3 py-1.5 text-sm
```

---

## 7. Scrollbar Styling

Apply in `globals.css`:
```css
/* Thin Notion-style scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 9999px; }
::-webkit-scrollbar-thumb:hover { background: var(--border-focus); }
```

---

## 8. Text Selection
```css
::selection {
  background-color: var(--selection); /* rgba(35, 131, 226, 0.28) */
  color: var(--text-primary);
}
```

---

## 9. Quick Cheat Sheet for Local Models (Paste-Ready)

When prompting Qwen or other local models, paste this block:

```
DESIGN TOKENS (use ONLY these — never invent colors):

Backgrounds:
  bg-main (#FFFFFF) — page canvas
  bg-sidebar (#F7F7F5) — sidebar
  bg-hover (#EFEFED) — hover backgrounds
  bg-subtle (#F1F1EF) — inputs, code bgs

Text:
  text-primary (#37352F) — all main text
  text-secondary (#787774) — muted text, labels
  text-tertiary (#ACABA8) — timestamps, very muted

Borders (always 1px):
  border-base (#E9E9E7)

Accent (interactive blue):
  accent (#2383E2) — links, focus, active state
  accent-muted (rgba 35 131 226 / 0.1)

Content identity colors (badges/icons only — never full backgrounds):
  snippet (#F59E0B amber), bookmark (#3B82F6 blue),
  command (#10B981 emerald), prompt (#8B5CF6 violet)

RULES:
- Light mode only. No dark backgrounds.
- Border radius: rounded (4px) or rounded-md (6px) for panels/buttons.
- Shadows only on floating elements (dropdowns, modals).
- Framer Motion for any appear/disappear: opacity 0→1, scale 0.97→1, y 4→0, duration 0.15s easeOut.
- Icons: Lucide React, size 16, strokeWidth 1.5.
- Font: Inter for UI, SF Mono for code.
```
