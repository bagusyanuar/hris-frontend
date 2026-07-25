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

- **Borders & Shadows**: Soft borders (`border border-neutral-border`). **IMPORTANT**: Avoid using drop shadows (`shadow-sm`, etc.) on parent/layout containers (such as the Sidebar, Page Header, and Main Content wrap in Bento Grid) to keep the app minimal; rely entirely on border lines for structural definition.
- **Rounding**: Consistent rounded corners, preferably `rounded-xl`.
- **Padding**: Generous spacing inside the card, minimum `p-6` (24px) for desktop, `p-4` (16px) for mobile.
- **Card Variants**:
  - `default`: Clean border-only layout for standard content boxes.
  - `accent-primary` / `accent-success` / `accent-warning` / `accent-danger`: Cards with a colored left-border strip (4px width). Use specifically for alert states, status updates, or notifications (e.g. `accent-warning` for pending requests, `accent-success` for active items).
  - `glass`: Frosted glass semi-transparent cards. Use only for floating popovers, dropdown lists, or items placed over rich background gradients.
  - `glow`: Interactive hoverable card that projects a subtle brand-colored shadow glow. Ideal for main action cards or highlighted KPI widgets on the dashboard.
  - `gradient`: Uses a light, subtle brand-color gradient background. Use sparingly for hero cards or welcome panels.
- **Structure**:
  - **Header**: Optional, but if present, contains a descriptive title (`text-base font-semibold text-slate-900`) and optional actions (e.g. menu, filter button).
    - **Action Button Placement**: For Data Tables, place the primary action button (e.g., "Add Department") inside the Table Card's header alongside the table title, rather than placing it isolated in the main Page Header. This keeps the action contextually close to the data it manipulates.
  - **Body**: Core visual details or data representation.
  - **Footer**: Optional action area separated by a soft border or simple spacing.

```html
<!-- Example of a Standard Card in Svelte using Abstract Tokens -->
<Card title="Card Title" description="Card description text">
  <div class="text-sm">
    <!-- Card content here -->
  </div>
</Card>
```

## 4. Iconography & Domain Consistency

- **Synchronized Icons**: When choosing an icon to represent a domain entity (e.g., `lucide:building-2` for Departments or `lucide:users` for Employees), use it consistently across the **Sidebar Navigation**, **Page Headers**, and any related metric cards to build strong visual recognition.

## 5. Bento Grid & Floating Panels Layout

For premium SaaS dashboards, use the **Bento Grid / Floating Panels** layout:

- **Outer Viewport**: `h-screen flex p-3 gap-3 overflow-hidden bg-neutral-bg`.
- **Layout Container (`<main>`)**: The main content wrapper in `+layout.svelte` MUST be transparent and without card styling (`bg-transparent border-0 rounded-none overflow-y-auto`). Do NOT style the `<main>` tag as a large white card, otherwise, it breaks the floating panels illusion.
- **Page Panels (The "Bento" Boxes)**:
  - Every individual section of a page (e.g., Page Header, Metric Cards, Data Table) must be enclosed in its own independent floating card (`bg-neutral-card border border-neutral-border rounded-2xl p-6`).
  - **CRITICAL**: Do NOT wrap an entire page's content inside a single overarching `<Card>` component.
- **Uniform Spacing**: All gaps between panels—both vertical and horizontal—must use a strict `gap-3` (12px) to match the outer viewport gap. Use `<div class="flex flex-col gap-3">` for vertical stacking and `<div class="grid gap-3">` for horizontal grids. Avoid `space-y-*` if it differs from the grid gap.
- **Internal Scrolling**: Set `overflow-y-auto` and `flex-1` on individual panels (like Sidebar menu and Main workspace body) instead of scrolling the whole window.

## 5. Custom Scrollbars

Never use browser default scrollbars on scrollable panels.

- Add global styling for Webkit and Firefox scrollbars to make them extremely thin and subtle:
  ```css
  :global(*::-webkit-scrollbar) {
    width: 4px;
    height: 4px;
  }
  :global(*::-webkit-scrollbar-thumb) {
    background: var(--color-neutral-border);
    border-radius: 9999px;
  }
  ```

## 6. Typography & Spacing

- **Font**: Use clean, modern geometric fonts (e.g., `font-sans`).
- **Mandatory Typography Component**: **ALL** text content (headings, body copy, descriptions, captions, spans, labels, etc.) must be rendered using the `Typography` component. Never use raw HTML text tags (`<h1>`, `<p>`, `<span>`, `<label>`) with manual classes or custom styles directly in pages or components.
- **Consistency**: Maintain a strict spacing rhythm (e.g., `gap-4`, `space-y-6`, `p-6`). Do not use ad-hoc pixel values; rely entirely on Tailwind CSS utility spacing values.
- **Micro-animations**: All interactive elements (buttons, cards, links, tabs) must have smooth transitions: `transition-all duration-200 ease-in-out` with hover scale or background shifts.

---

## 7. Collapsed Sidebar Tooltips & Hover Flyouts Guidelines

When implementing tooltips or flyout panels in a collapsed/mini-sidebar layout, follow these critical UX and styling patterns:

1. **Hover Bridge Pattern (CRITICAL)**:
   - Avoid using margins (e.g., `ml-2`) to create space between the sidebar trigger button and the absolute-positioned hover panel. Margin gaps create a dead-zone that triggers a `mouseout` event when the cursor crosses over, causing the panel to flicker or close immediately.
   - **Solution**: Wrap the hover panel in a parent container with left padding (e.g., `pl-2`) that acts as an invisible interactive bridge. This ensures the hover state stays active as the mouse moves into the submenu.
2. **Preventing Overflow Clipping**:
   - Scrollable sidebar lists (`overflow-y-auto` or `overflow-hidden`) will clip absolute children extending outside the sidebar width (like tooltips or submenus).
   - **Solution**: Conditionally disable vertical overflow when the sidebar is collapsed (e.g., `{sidebar.isCollapsed ? 'overflow-visible' : 'overflow-y-auto'}`).
3. **Contrast in Dark Mode**:
   - Tooltips and floating panels must stand out against parent containers. Do not use the same background token (e.g., `bg-neutral-card`) as the sidebar.
   - **Solution**: In Light Mode, use a clean white card with a subtle border and shadow. In Dark Mode, use a contrasting background (e.g., `dark:bg-slate-950`) accompanied by a subtle brand-colored border (e.g., `dark:border-emerald-500/30`) to make it pop.

---

## 8. Tailwind & Styling Best Practices

1. **Mandatory `class-variance-authority` (CVA)**:
   - When building a component with multiple states, sizes, colors, or visual styles, you **MUST** define them using `class-variance-authority` (CVA) in a companion file named `<ComponentName>.variants.ts`.
   - Merging classes should be performed using the `cn` utility (`$lib/presentation/shared/utils/cn`).

2. **Strict Avoidance of Tailwind Arbitrary Values**:
   - Do **NOT** use arbitrary values such as `bg-[#6366f1]`, `w-[360px]`, `h-[48px]`, or `top-[8px]`.
   - Prefer Tailwind's native layout, spacing, and sizing scales (e.g., `w-80`, `h-12`, `top-2`).
   - If a specific custom spacing, color, or dimension is needed, configure it as a design token variable inside the `@theme` block in `src/app.css` (Tailwind v4) rather than using an inline arbitrary value.

---

## 9. Datatable and UI Component UX

1. **Status Badges**:
   - Status badges should **not** just be plain colors. Always include a relevant micro-icon (e.g., `lucide:check-circle-2` for active, `lucide:minus-circle` for inactive) to improve accessibility and visual weight.
   - Use subtle borders (e.g., `border border-emerald-200 dark:border-emerald-500/20`) alongside soft background colors instead of harsh solid blocks.
   - Use `font-medium` instead of `font-semibold` or bold for badge text to maintain a clean, refined aesthetic.

2. **Action Dropdowns**:
   - An action dropdown (e.g., the three-dots menu on a datatable row) should never look "empty".
   - Include a small header section (e.g., `ACTIONS` with `text-[10px] font-semibold uppercase tracking-wider`).
   - Include a "View Details" fallback action.
   - Separate dangerous actions (like Delete) with a subtle divider line (`<div class="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>`).
   - Keep font sizes proportional (e.g., `text-xs font-normal`) so dropdown items don't look excessively large compared to the table data.

---

## 10. Premium Layout Design Patterns

These patterns capture the design language for building layouts that feel professional and polished, not basic "AI-generated" UIs. Follow these rules strictly when building any management/settings/CRUD page.

### A. Split-Panel Layout (Master–Detail)

When a page manages a list of entities with detail views, use a **Split-Panel (Master–Detail)** layout instead of a full-page table:

- **Left panel** = compact scrollable list (sidebar-style)
- **Right panel** = detailed workspace for the selected entity
- Grid: `grid-cols-12`, left `col-span-4 xl:col-span-3`, right `col-span-8 xl:col-span-9`
- Gap between panels: `gap-3` (consistent with Bento grid)

### B. Left Panel (Sidebar List) Rules

The left list panel must feel **compact and dense** — it's a navigation tool, not a showcase:

1. **Header card** must be tight:
   - Padding: `p-4 pb-3.5` (never `p-5` or `p-6`)
   - Icon: `h-8 w-8` with flat `bg-brand-light text-brand-primary` (NOT gradient)
   - Title: `body-sm` bold (NOT `body-md`)
   - Subtitle: `text-[11px]` raw span (NOT Typography component — too heavy for micro labels)
   - Add a count badge next to the title: `text-[10px] bg-slate-100 px-1.5 rounded-full`
   - "Add" button: `variant="primary" size="icon"` with small size `h-7 w-7 rounded-md` — solid brand color is the CTA
   - Alignment: Use `items-start` so icon and text top-align

2. **List items** must be slim and interactive:
   - Padding: `p-3.5` with `gap-1.5` between items
   - Use `rounded-xl` (NOT `rounded-2xl`)
   - Active state: subtle background `bg-brand-light/40` + left accent bar (`w-[3px] bg-brand-primary rounded-r-full`)
   - Active icon: `bg-brand-primary text-white shadow-sm`
   - Inactive hover: `hover:bg-slate-50/80` (barely visible)
   - Context menu (⋯): **hidden by default**, shown on hover via `opacity-0 group-hover:opacity-100`
   - Use `<Button variant="ghost" size="icon">` for context triggers — NEVER raw `<button>`
   - Company name: `text-[13px] font-semibold`
   - Meta info (code, branch count, status dot): `text-[10px]`-`text-[11px]` inline

3. **Anti-patterns to AVOID on list panels**:
   - ❌ Large gradient icons (`h-10+ bg-gradient-to-br`) — too dominant for a list
   - ❌ Large padding (`p-5`, `p-6`) — wastes space
   - ❌ `body-md` or `h5` for panel titles — too large
   - ❌ Permanently visible context menus — clutters the list
   - ❌ `rounded-2xl` on list items — too round, feels bloated

### C. Right Panel (Detail Workspace) Rules

The detail workspace should feel informative and spacious:

1. **Profile/Header section**:
   - Avatar: `h-14 w-14 rounded-2xl bg-gradient-to-br` with `shadow-lg` — gradient IS appropriate here for the hero element
   - Overlay status dot on avatar corner (like Slack): `absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 border-[2.5px] border-white`
   - Title: `h4` bold with `tracking-tight`
   - Code badge: `text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded-md border`
   - Status: Use `Badge` with micro-icon (`check-circle-2` for active, `minus-circle` for inactive)
   - Decorative gradient: subtle `from-brand-primary/[0.06]` overlay, NOT heavy solid gradients

2. **Info/Stat cards** (e.g., NPWP, BPJS):
   - Use a 2-column grid with individual mini-cards
   - Background: `bg-slate-100/70` with `border-slate-200/80` — must be **clearly visible**, not washed out
   - Icon container: `bg-white border-slate-200 shadow-sm` — white on gray for contrast
   - Icon color: `text-brand-primary/70` — NOT plain `text-slate-400`
   - Label: `text-[10px] uppercase tracking-wider text-slate-500`
   - Value: `text-[13px] font-semibold text-slate-800`
   - **Anti-pattern**: ❌ `bg-slate-50/80` with `border-slate-100/80` — too pale, looks faded

3. **Action buttons hierarchy**:
   - Primary action (Edit): `<Button variant="outline" size="sm">` — visible but not aggressive
   - Destructive action (Delete): **ALWAYS** hidden inside a dropdown (⋯) — NEVER show a red "Hapus" button directly
   - Use `<Button variant="outline" size="icon">` for the dropdown trigger, NOT raw `<button>`

### D. Sub-entity Section (e.g., Branches inside Company)

When an entity has child entities displayed on the same page:

1. **Separate card** for the sub-entity section with its own header + "Tambah" button
2. Header: icon badge + title + count pill + add button, separated by `border-b`
3. Grid: `grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3`
4. Empty state: dashed border card with icon + text CTA
5. "Add" mini-card: inline with existing cards, compact horizontal layout (icon + text)
6. Cards: `rounded-xl` (not `rounded-2xl`), hover with `hover:border-slate-200 hover:shadow-sm` (subtle, not dramatic)

### E. General Anti-Patterns (NEVER DO)

- ❌ Using raw `<button>` for clickable triggers — always use `<Button>` component
- ❌ Overriding `rounded-*` on `<Button>` — respect the component's default `rounded-lg`
- ❌ `animate-bounce` on empty states — feels cheap
- ❌ Heavy `shadow-xl` or `shadow-lg` on static content cards — shadows are for hover states only
- ❌ `hover:-translate-y-1.5` or larger — too dramatic; use `-translate-y-0.5` or `-translate-y-1` max
- ❌ Mixing `<Typography>` with raw `<span>` for the same visual purpose — pick one per context
- ❌ Using `body-md`/`body-lg` for labels/subtitles in compact areas — use raw `text-[11px]` spans

