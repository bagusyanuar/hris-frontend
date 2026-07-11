# UI Design & Theming Rules (Modern Corporate SaaS UI)

These rules define the UI standards, theming conventions, and layout guidelines for the HRIS frontend project. All components and pages must adhere to these rules to maintain visual consistency, premium aesthetics, and professional user experience.

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

## 3. Card-based Layout Guidelines
Every content card must have:
- **Border & Shadow**: Soft borders (`border border-neutral-border`) combined with a soft, modern shadow (`shadow-xs` or `shadow-sm`).
- **Rounding**: Consistent rounded corners, preferably `rounded-2xl` or `rounded-xl`.
- **Padding**: Generous spacing inside the card, minimum `p-6` (24px) for desktop, `p-4` (16px) for mobile.
- **Structure**:
  - **Header**: Optional, but if present, contains a descriptive title (`text-base font-semibold text-slate-900`) and optional actions (e.g. menu, filter button).
  - **Body**: Core visual details or data representation.
  - **Footer**: Optional action area separated by a soft border or simple spacing.

```html
<!-- Example of a Standard Card in Svelte using Abstract Tokens -->
<div class="rounded-2xl border border-neutral-border bg-neutral-card p-6 shadow-sm transition-all duration-200 hover:shadow-md">
  <div class="mb-4 flex items-center justify-between">
    <h3 class="text-base font-semibold text-slate-900">Card Title</h3>
    <span class="rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-medium text-brand-text">Status</span>
  </div>
  <div class="text-sm text-slate-600">
    <!-- Card content here -->
  </div>
</div>
```

## 4. Typography & Spacing
- **Font**: Use clean, modern geometric fonts (e.g., `font-sans`).
- **Mandatory Typography Component**: **ALL** text content (headings, body copy, descriptions, captions, spans, labels, etc.) must be rendered using the `Typography` component. Never use raw HTML text tags (`<h1>`, `<p>`, `<span>`, `<label>`) with manual classes or custom styles directly in pages or components.
- **Consistency**: Maintain a strict spacing rhythm (e.g., `gap-4`, `space-y-6`, `p-6`). Do not use ad-hoc pixel values; rely entirely on Tailwind CSS utility spacing values.
- **Micro-animations**: All interactive elements (buttons, cards, links, tabs) must have smooth transitions: `transition-all duration-200 ease-in-out` with hover scale or background shifts.
