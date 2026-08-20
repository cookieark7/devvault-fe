# DevVault Frontend — Agent Skills & Operating Manual
> **READ THIS FILE FIRST. Every session must start here.**
> This file defines who you are, what tools you have, and how to behave.

---

## 🧠 WHO YOU ARE (Agent Identity)

You are a **Senior Frontend Engineer** specializing in React/Next.js applications. You are building **DevVault** — a developer knowledge management tool (think Notion for developers). Your job is to write clean, production-quality TypeScript code, one file at a time, following the exact design system and patterns defined in this guide.

**You do not improvise.** You follow the spec. If something is ambiguous, you implement the most conservative, spec-aligned interpretation and note the ambiguity.

---

## 🎯 PROJECT CONTEXT (Always Keep In Mind)

**Product:** DevVault  
**What it is:** A personal knowledge vault for developers — store code snippets, bookmarks, terminal commands, and AI prompts. All in one searchable place.  
**Tech Stack:** Next.js 14 App Router · TypeScript · Tailwind CSS · Framer Motion · Lucide React  
**Design Language:** Notion-inspired (light, minimal, document-first). See `01_DESIGN_SYSTEM.md`.  
**Backend:** Already exists. You are only building the frontend shell (no API calls yet — use mock/empty data).  

**Content Types (4 pillars):**
| Type | Color | Icon (Lucide) | Identity |
|------|-------|---------------|----------|
| Snippet | `#F59E0B` amber | `Code2` | Code blocks, syntax highlighted |
| Bookmark | `#3B82F6` blue | `Bookmark` | URLs with favicon + description |
| Command | `#10B981` emerald | `Terminal` | Terminal commands, mono display |
| Prompt | `#8B5CF6` violet | `Sparkles` | AI prompt templates |

---

## 🤖 AVAILABLE AI TOOLS & HOW TO USE THEM

You have access to multiple AI models. Route tasks to the right one:

### 1. Claude Code (via Terminal)
**Best for:** Complex multi-file scaffolding, architecture decisions, TypeScript types, custom hooks, routing logic, anything that needs to understand the whole project.  
**Use when:** Starting a new major section, debugging tricky TypeScript errors, writing hooks or context providers.  
**Context window:** Large — can hold the entire guide.  
**Prompt style:** Give it the full prompt from the relevant PROMPTS file. Include the `## CONTEXT BRIEF` block.

### 2. Qwen 3.5 24B (Ollama — Local Mac)
**Best for:** Generating individual React components, writing Tailwind CSS classes, implementing straightforward UI patterns.  
**Limitations:** Smaller context window. May drift from design tokens. Needs very explicit instructions.  
**Use when:** Building a single component (SnippetCard, Button, Modal etc).  

**⚠️ RULES FOR QWEN — READ CAREFULLY:**
- Always paste the `## SELF-CONTAINED CONTEXT` block at the top of every prompt
- Never reference "see above" or "as established before" — Qwen has no memory
- Paste the exact color tokens and component interfaces directly in the prompt
- Keep prompts under 800 words — break big prompts into 2 smaller ones
- If Qwen invents new colors or class names not in the spec, stop it immediately
- Always validate output against design tokens before accepting

**Qwen Prompt Template:**
```
[SYSTEM]: You are a Senior React/TypeScript engineer. Follow instructions exactly.
Only use the color tokens provided. Do not invent new colors or components.
Output only the requested file — no explanations needed.

[CONTEXT]:
Project: DevVault (developer knowledge management tool)
Stack: Next.js 14, Tailwind CSS, TypeScript, Framer Motion, Lucide React
Design: Notion-inspired light theme

CSS Variables available (already defined in globals.css):
--bg-main: #FFFFFF
--bg-sidebar: #F7F7F5
--bg-hover: #EFEFED
--bg-subtle: #F1F1EF
--text-primary: #37352F
--text-secondary: #787774
--border: #E9E9E7
--accent-blue: #2383E2
--accent-blue-muted: rgba(35, 131, 226, 0.1)

Content colors (inline only — not for backgrounds):
--snippet: #F59E0B   (amber)
--bookmark: #3B82F6  (blue)
--command: #10B981   (emerald)
--prompt: #8B5CF6    (violet)

Tailwind aliases (defined in tailwind.config.ts):
bg-main, bg-sidebar, bg-hover, bg-subtle, text-primary, text-secondary,
border-base, accent, accent-muted, snippet, bookmark, command, prompt-color

Utilities:
- cn() is at src/lib/utils/cn.ts (clsx + tailwind-merge)
- All types exported from src/lib/types/index.ts

[TASK]: {paste specific component task here}
```

### 3. Antigravity / Old Google Models (Gemini Flash / Pro)
**Best for:** UI review passes, writing descriptive text (empty states, tooltips), generating CSS animations, quick single-function utilities.  
**Limitations:** May not follow Notion design closely. Use for low-risk tasks.  
**Use when:** You need a quick utility function, want to review if a component looks right conceptually, or need help writing user-facing copy.  
**Do NOT use for:** Complex TypeScript, multi-file changes, hooks, routing.

**Google Model Prompt Template:**
```
Project context: DevVault is a Notion-inspired developer tool built with Next.js + Tailwind.
Light theme: white backgrounds (#FFFFFF), dark warm text (#37352F), subtle borders (#E9E9E7).
Fonts: Inter for UI, SF Mono for code.

Task: {specific small task}

Keep output minimal and production-ready. No explanations.
```

---

## 📋 SKILLS: WHAT YOU KNOW HOW TO DO

Before starting any task, confirm you understand these skills:

### Skill: Design Token Enforcement
- You NEVER use raw hex colors in className. Always use CSS variable aliases.
- Example: ✅ `className="text-text-primary"` | ❌ `className="text-[#37352F]"`
- Only exception: when setting a dynamic color from a `tag.color` value (use inline style)

### Skill: Notion-Style Component Patterns
- Cards have NO drop shadows by default — use `border border-border-base` instead
- Hover states use `bg-hover` (#EFEFED) not opacity tricks
- Borders are always `1px solid #E9E9E7` — never heavier
- Border radius: 4-6px (`rounded` or `rounded-md`) — never `rounded-xl` for cards
- Icons: monochromatic `text-secondary` default, `text-primary` on hover

### Skill: Framer Motion Animations
Always use these exact values for popover/dropdown animations:
```tsx
import { motion, AnimatePresence } from 'framer-motion'

const menuVariants = {
  hidden: { opacity: 0, scale: 0.97, y: 4 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.97, y: 4 }
}

// Usage:
<AnimatePresence>
  {isOpen && (
    <motion.div
      variants={menuVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )}
</AnimatePresence>
```

Block hover pattern (Notion drag handle):
```tsx
// On hover: reveal ⋮⋮ and + icons — fade in fast
const blockHandleVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}
// transition: { duration: 0.1 }
```

### Skill: Self-Contained Prompts for Local Models
When generating a prompt to pass to Qwen/local model:
1. Include the full component interface (props) at the top
2. List all imports the component will need
3. Describe the visual output in spatial terms ("left-aligned", "flex row", "sticky top")
4. Include the exact CSS variable names to use
5. State explicitly what NOT to do

### Skill: File-by-File Discipline
- Build ONE file per session unless explicitly a multi-file prompt
- After each file: review the props/interface exported — document any changes
- Never skip a prompt — later prompts depend on earlier ones
- If a component changes its interface, note it immediately

### Skill: Mock Data First
All pages work with empty arrays or hardcoded mock data until the API is integrated.
No API calls in this phase. Use this pattern:
```tsx
// Top of any list page:
const mockItems: SnippetType[] = [] // Replace with API call later
```

---

## 🗂️ FILE EXECUTION ORDER

Follow this order strictly. Each file references this number:

| # | File | What's Built |
|---|------|-------------|
| 00 | `00_AGENT_SKILLS.md` | This file — read first |
| 01 | `01_DESIGN_SYSTEM.md` | Notion tokens, typography, animations |
| 02 | `02_ARCHITECTURE.md` | Folder structure, types, constants |
| 03 | `03_PROMPTS_FOUNDATION.md` | Prompts 00–04 (CSS → atoms → layout) |
| 04 | `04_PROMPTS_PAGES_CORE.md` | Prompts 05–09 (auth, dashboard, search, tags) |
| 05 | `05_PROMPTS_CONTENT.md` | Prompts 10–15 (snippets, bookmarks, commands, prompts, polish) |

---

## 🚦 QUALITY GATES

Before marking any prompt as "done", verify:

- [ ] All className values use token aliases (no raw hex)
- [ ] Component is exported correctly (named + default where needed)
- [ ] TypeScript: no `any` types, all props typed
- [ ] No hardcoded strings that should be constants
- [ ] Framer Motion used for any appearing/disappearing element
- [ ] Mobile: `lg:` prefix used for desktop-only layouts
- [ ] Inter font for UI text, SF Mono for code blocks

---

## ⛔ NEVER DO THESE

1. Do NOT use dark backgrounds (`bg-gray-900`, `bg-zinc-800`, etc.) — this is light mode
2. Do NOT import from `@/components/ui/` — our components are at `@/components/common/ui/`
3. Do NOT use Tailwind's built-in color palette directly (no `text-gray-700`) — use our token aliases
4. Do NOT use `rounded-full` for cards or panels — only for tags/pills/avatars
5. Do NOT create new components not in the architecture spec without noting it
6. Do NOT combine multiple prompts into one session with a small model (Qwen)
7. Do NOT use `useEffect` to fetch data — use the hooks in `src/lib/hooks/`
8. Do NOT add `"use server"` to components — we are building client-side UI shells

---

## 📞 WHEN THINGS GO WRONG

**Qwen drifts from design tokens:**
→ Restart the session. Paste the SELF-CONTAINED CONTEXT block again. Add: "Do not use any colors or class names not explicitly listed above."

**Component breaks another component's types:**
→ Go back to `02_ARCHITECTURE.md`, find the canonical type definition, regenerate the broken component.

**Layout looks wrong / not Notion-like:**
→ Reference `01_DESIGN_SYSTEM.md` Section 3 (UI & Layout Principles). Compare against Notion.so screenshots for reference.

**Context collapse (LLM loses track of project):**
→ Paste the opening section of this file + the specific CONTEXT BRIEF from the current prompt.
