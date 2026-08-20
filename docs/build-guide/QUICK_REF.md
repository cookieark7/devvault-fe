# DevVault — Agent Quick Reference Card
> Paste this as context when a session needs fast orientation.
> ≈ 200 words. Designed for Qwen / small model context windows.

---

## WHO YOU ARE
Senior React/Next.js engineer building **DevVault** — a Notion-inspired developer knowledge vault.
Stack: Next.js 14 · TypeScript · Tailwind CSS · Framer Motion · Lucide React.

## DESIGN (NEVER DEVIATE)
- **Light mode only.** White pages, off-white sidebar, warm dark text.
- **Token classes:** `bg-main` `bg-sidebar` `bg-hover` `bg-subtle` `text-primary` `text-secondary` `text-tertiary` `border-base` `accent`
- **Content colors:** `snippet`=amber `bookmark`=blue `command`=emerald `prompt-color`=violet
- **Border radius:** `rounded` (4px) for panels, `rounded-full` pills only
- **Shadows:** `shadow-notion-menu` on floating, `shadow-notion-card` on hover
- **Framer Motion dropdowns:** `opacity:0 scale:0.97 y:4` → `opacity:1 scale:1 y:0`, `duration:0.15`
- **Icons:** Lucide React, `size={16}` `strokeWidth={1.5}` `className="text-secondary"`

## COMPONENT PATHS
- Atoms: `src/components/common/ui/[Name].tsx`
- Layout: `src/components/common/layout/[Name].tsx`
- Types: `src/lib/types/index.ts`
- Utils: `cn()` at `src/lib/utils/cn.ts`
- Routes: `ROUTES` at `src/lib/constants/routes.ts`

## NEVER DO
❌ Dark backgrounds · ❌ Raw hex in className · ❌ `rounded-xl` for cards · ❌ Heavy shadows · ❌ `any` TypeScript type · ❌ Invent components not in architecture spec
