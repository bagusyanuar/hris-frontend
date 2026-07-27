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
4. **Realistic Content & Context:** **NEVER** use "Lorem Ipsum" or generic placeholder icons. Always inject realistic, domain-specific dummy data (e.g., real names, salaries, statuses) and use consistent, high-quality icons (e.g., Lucide).
5. **Intentional Asymmetry:** Break the monotony of perfect grids. Use varied card treatments (e.g., one card with a dark gradient background, others light) or overlapping elements to make the layout feel dynamic and handcrafted.
</CRITICAL_RULES>
