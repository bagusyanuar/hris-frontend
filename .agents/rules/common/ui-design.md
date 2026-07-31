# UI Design & Theming Rules (Modern Corporate SaaS UI)

These rules define the core UI standards, theming conventions, and typography guidelines for the HRIS frontend project. All components and pages must adhere to these rules to maintain visual consistency, premium aesthetics, and professional user experience.

> **Note:** Layout specific rules have been moved to `architecture/layout.md` and Component UX rules have been moved to `common/components.md`.

## 1. Design Philosophy

- **Modern Corporate SaaS / Clean Dashboard**: Clean layout, premium feel, subtle border lines, spacious elements, and rich typography.
- **Card-based Layout**: Main data and sections must be grouped in structured, independent cards with consistent padding, subtle shadows, and rounded corners.
- **Aesthetic Excellence**: Avoid generic colors or raw CSS borders. Use proper shadows, micro-interactions, transitions, and hover states.

## 2. Color Palette (Abstracted Tokens)

We use a premium, configurable color theme. All component classes should use abstract tokens rather than hardcoded tailwind colors (e.g. use `bg-brand-primary` instead of `bg-emerald-600`), making it trivial to change colors if requested by clients.

- **Primary / Brand Color Tokens**:
  - Base Primary: `bg-brand-primary` / `text-brand-primary` (for main actions, focus states, and primary highlights)
  - Dark Primary: `bg-brand-hover` / `hover:bg-brand-hover` (for button hover states)
  - Light Primary Accent: `bg-brand-light` / `text-brand-text` (for active navigation indicators, badges, or selected state highlights)
  - Border Accent: `border-brand-border`
- **Neutral Colors (Slate / Zinc)**:
  - App Background: `bg-neutral-bg` (soft off-white to contrast against white cards in light mode; slate-950 in dark mode)
  - Card Background: `bg-neutral-card` (white in light mode; slate-900 in dark mode)
  - Text Primary: `text-slate-900` / `text-zinc-900` (auto shifts in dark mode)
  - Text Secondary: `text-slate-500` / `text-zinc-500`
  - Borders: `border-neutral-border` (slate-100 in light mode; slate-800 in dark mode)
- **Status Colors**:
  - Success: Green (`emerald-600` / `emerald-50` or success tokens)
  - Warning: Amber (`amber-500` / `amber-50`)
  - Danger: Rose (`rose-600` / `rose-50`)
  - Info: Sky/Blue (`sky-600` / `sky-50`)

## 3. Dark Mode Support

The application defaults to **Light Mode** and fully supports **Dark Mode** via class toggling (`.dark` on the `html` or `body` element).

- Design system variables (neutral backgrounds, cards, and borders) will automatically invert values when the `.dark` class is active.
- Always use the semantic abstract token classes (e.g., `bg-neutral-bg`, `bg-neutral-card`, `border-neutral-border`) to ensure layout components transition seamlessly.
- Avoid absolute colors like `bg-white` or `bg-slate-50` on core layout wrappers, use `bg-neutral-card` and `bg-neutral-bg` respectively.

## 4. Typography & Spacing

- **Font**: Use clean, modern geometric fonts (e.g., `font-sans`).
- **Mandatory Typography Component**: **ALL** text content (headings, body copy, descriptions, captions, spans, labels, etc.) must be rendered using the `Typography` component. Never use raw HTML text tags (`<h1>`, `<p>`, `<span>`, `<label>`) with manual classes or custom styles directly in pages or components.
- **Consistency**: Maintain a strict spacing rhythm (e.g., `gap-4`, `space-y-6`, `p-6`). Do not use ad-hoc pixel values; rely entirely on Tailwind CSS utility spacing values.
- **Micro-animations**: All interactive elements (buttons, cards, links, tabs) must have smooth transitions: `transition-all duration-200 ease-in-out` with hover scale or background shifts.

## 5. Tailwind & Styling Best Practices

1. **Mandatory `class-variance-authority` (CVA)**:
   - When building a component with multiple states, sizes, colors, or visual styles, you **MUST** define them using `class-variance-authority` (CVA) in a companion file named `<ComponentName>.variants.ts`.
   - Merging classes should be performed using the `cn` utility (`$lib/presentation/shared/utils/cn`).

2. **Strict Avoidance of Tailwind Arbitrary Values**:
   - Do **NOT** use arbitrary values such as `bg-[#6366f1]`, `w-[360px]`, `h-[48px]`, or `top-[8px]`.
   - Prefer Tailwind's native layout, spacing, and sizing scales (e.g., `w-80`, `h-12`, `top-2`).
   - If a specific custom spacing, color, or dimension is needed, configure it as a design token variable inside the `@theme` block in `src/app.css` (Tailwind v4) rather than using an inline arbitrary value.
## 6. Anti-AI Slop UI Slicing

<CRITICAL_RULES>
To prevent generic, unpolished "AI Slop" designs, you **MUST** apply the following principles when slicing UI:

1. **Micro-Interactions & Transitions:** Never leave interactive elements static. Always add smooth transitions (e.g., `transition-all duration-300 ease-out`), subtle scale effects on hover (`hover:-translate-y-1 hover:shadow-lg`), and soft glow effects on focus/active states.
2. **Depth & Nuance over Default Colors:** Avoid flat, default Tailwind colors (like `bg-blue-500` or raw `shadow-md`). Use multiple soft drop-shadows, low-opacity borders (`border-white/10` in dark mode), subtle glassmorphism (`backdrop-blur-md bg-white/30`), and nuanced gradients to add depth.
3. **Extreme Typography Hierarchy & Whitespace:** Do not use uniform spacing. Be generous with whitespace and padding (especially in Bento Grid layouts). Use contrasting font weights (e.g., Extra Bold for headings, Medium/Regular with muted colors for subtitles) and tight tracking for large headings (`tracking-tight`).
4. **Realistic Content, Context & Mock Data:** **NEVER** use "Lorem Ipsum" or generic placeholder text (e.g., "Click here", "Enter data"). Always inject realistic, domain-specific dummy data with contextual copywriting (e.g., "Lihat Detail Absensi"). When creating mock data arrays, **DO NOT duplicate identical rows**. Use varied string lengths, varied statuses, and distinct avatars to test how the UI handles real-world diversity.
5. **Intentional Asymmetry:** Break the monotony of perfect grids. Use varied card treatments (e.g., one card with a dark gradient background, others light) or overlapping elements to make the layout feel dynamic and handcrafted.
6. **Meaningful Empty & Error States:** Never leave a blank card with generic "No data" text. Empty states MUST be visually designed: use a large, low-opacity icon, domain-specific explanatory text, and a primary Call-to-Action (CTA) button if applicable.
7. **Skeleton Loaders over Generic Spinners:** Avoid lazy `<Loader class="animate-spin" />` centered on a screen. Use **Skeleton Loaders** (`animate-pulse bg-slate-200 dark:bg-slate-800`) that mimic the actual content structure (like table rows or text blocks) to create a premium, fast-feeling loading experience.
8. **Proactive Edge-Case Handling:** Assume the worst for data lengths. Always apply `truncate`, `line-clamp-2`, or `break-words` proactively to dynamic text elements (names, descriptions, titles) to prevent the layout from breaking when real data is injected.
9. **Proportional Padding & Density:** Do not use overly thick or chunky padding (`p-6`, `p-8`) excessively on small widgets. Balance the density; use tighter padding (`p-3`, `p-4`) for secondary cards or metric widgets so they do not look disproportionately bulky or "AI Slop-like".
10. **Avoid Pure Black & Pure White Text:** Never use pure black (`#000000`, `text-black`) or pure white (`#FFFFFF`, `text-white`) for main text elements. Always use tinted neutrals (e.g., `text-slate-800`, `text-slate-100`, `text-slate-200`) to create a softer, more sophisticated SaaS look.
11. **Flat Cards Over Shadows:** For inner bento/grid cards, prefer a flat aesthetic relying on borders (e.g., `border-slate-200 hover:border-brand-primary/30`) rather than drop shadows (`shadow-md`). This creates a cleaner, more modern SaaS look.
12. **Header Stats Contrast:** Ensure header metric/stat cards do not look pale or washed out in Light Mode. If the container is `bg-neutral-card` (white), use `bg-white` with a crisp `border-slate-200` and a subtle `shadow-sm` or a brand-tinted background so it pops.
13. **Inline Action Cards:** Instead of generic "Add" buttons in the top-right header, consider placing "Create/Add" actions as the final card in a grid list (using dashed borders and hover tint) or integrated into the empty state. This improves the interactive flow.
14. **Branded Avatars & Icons:** Avoid raw default backgrounds for avatar initials or icons. Apply subtle tinted backgrounds (`bg-brand-primary/5`) and borders (`border-brand-primary/20`) to integrate them seamlessly with the premium brand theme.
</CRITICAL_RULES>
