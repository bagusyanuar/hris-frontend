# UI Layout Architecture Guidelines

This rule defines how the UI layout and page content should be structured in SvelteKit for the HRIS project, enforcing a clear separation of concerns.

## SvelteKit Layout vs Page Responsibilities

### 1. `+layout.svelte` (The Application Shell)

- **Purpose**: Acts as the main application shell for a route group.
- **Responsibilities**:
  - Must contain global, persistent UI components such as the Sidebar (`<aside>`), Navbar / Header (`<header>`), and the Main content wrapper (`<main>`).
  - Must manage global UI states (e.g., Sidebar `isCollapsed`, Mobile Drawer `isMobileOpen`).
  - Must handle global lifecycle events (e.g., reading the theme from `localStorage` on `onMount` or initializing auth state).
  - **Layout Styling (Bento Grid strictness)**: The `<main>` tag MUST act purely as a transparent container without any card styling (no `bg-white`, no `border`, no `p-6`). The background color should come from the outer `body` or shell wrapper, allowing the child pages to render their own floating panels.
  - The dynamic content from individual pages is injected into the `<main>` tag using the `{@render children()}` Svelte 5 rune.

### 2. `+page.svelte` (The Page Content)

- **Purpose**: Contains the unique content for a specific URL/route.
- **Responsibilities**:
  - Must ONLY contain the specific content for that particular page (e.g., Dashboard widgets, Employee lists, Settings forms).
  - **MUST NOT** re-declare or re-import the Sidebar, Navbar, or the `<main>` wrapper.
  - **Card Fragmentation (Bento Grid)**: Pages MUST NOT wrap all their contents in a single giant `<Card>`. Instead, break down the UI into separate floating panels (Header, Metrics, Table) using uniform `gap-3` spacing to achieve the Bento Grid look.
  - Focused entirely on domain-specific UI, data fetching, and interactions.

## DRY (Don't Repeat Yourself) Principle

- The layout elements (Sidebar, Navbar, etc.) must be abstracted into modular components in `src/lib/presentation/shared/components/` and imported into `+layout.svelte`.
- Avoid writing raw HTML for shared layout components directly inside `+page.svelte` to prevent redundant and unmaintainable code across the application.

---

## 🎨 Card-based Layout Guidelines

Every content card must have:

- **Borders & Shadows**: Soft borders (`border border-neutral-border`). **IMPORTANT**: Avoid using drop shadows (`shadow-sm`, etc.) on parent/layout containers (such as the Sidebar, Page Header, and Main Content wrap in Bento Grid) to keep the app minimal; rely entirely on border lines for structural definition.
- **Rounding**: Consistent rounded corners, preferably `rounded-xl`.
- **Padding**: Generous spacing inside the card, minimum `p-6` (24px) for desktop, `p-4` (16px) for mobile.
- **Card Variants**:
  - `default`: Clean border-only layout for standard content boxes.
  - `accent-primary` / `accent-success` / `accent-warning` / `accent-danger`: Cards with a colored left-border strip (4px width). Use specifically for alert states, status updates, or notifications.
  - `glass`: Frosted glass semi-transparent cards. Use only for floating popovers, dropdown lists.
  - `glow`: Interactive hoverable card that projects a subtle brand-colored shadow glow.
  - `gradient`: Uses a light, subtle brand-color gradient background. Use sparingly for hero cards.
- **Structure**:
  - **Header**: Optional, contains descriptive title (`text-base font-semibold text-slate-900`).
    - **Action Button Placement**: For Data Tables, place the primary action button (e.g., "Add Department") inside the Table Card's header, rather than placing it isolated in the main Page Header.
  - **Body**: Core visual details or data representation.
  - **Footer**: Optional action area.

## 🍱 Bento Grid & Floating Panels Layout

For premium SaaS dashboards, use the **Bento Grid / Floating Panels** layout:

- **Outer Viewport**: `h-screen flex p-3 gap-3 overflow-hidden bg-neutral-bg`.
- **Layout Container (`<main>`)**: The main content wrapper MUST be transparent and without card styling (`bg-transparent border-0 rounded-none overflow-y-auto`).
- **Page Panels (The "Bento" Boxes)**:
  - Every individual section of a page (e.g., Page Header, Metric Cards, Data Table) must be enclosed in its own independent floating card (`bg-neutral-card border border-neutral-border rounded-2xl p-6`).
  - **CRITICAL**: Do NOT wrap an entire page's content inside a single overarching `<Card>` component.
- **Uniform Spacing**: All gaps between panels—both vertical and horizontal—must use a strict `gap-3` (12px) to match the outer viewport gap. Avoid `space-y-*` if it differs from the grid gap.
- **Internal Scrolling**: Set `overflow-y-auto` and `flex-1` on individual panels (like Sidebar menu and Main workspace body) instead of scrolling the whole window.

### Custom Scrollbars

Never use browser default scrollbars on scrollable panels. Add global styling for Webkit and Firefox scrollbars to make them extremely thin and subtle:
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

## 💎 Premium Layout Design Patterns

These patterns capture the design language for building layouts that feel professional and polished. Follow these rules strictly when building any management/settings/CRUD page.

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
   - Icon: `h-8 w-8` with flat `bg-brand-light text-brand-primary`
   - Title: `body-sm` bold
   - Subtitle: `text-[11px]` raw span
   - Add a count badge next to the title: `text-[10px] bg-slate-100 px-1.5 rounded-full`
   - "Add" button: `variant="primary" size="icon"` with small size `h-7 w-7 rounded-md`
   - Alignment: Use `items-start` so icon and text top-align
2. **List items** must be slim and interactive:
   - Padding: `p-3.5` with `gap-1.5` between items
   - Use `rounded-xl`
   - Active state: subtle background `bg-brand-light/40` + left accent bar (`w-[3px] bg-brand-primary rounded-r-full`)
   - Active icon: `bg-brand-primary text-white shadow-sm`
   - Inactive hover: `hover:bg-slate-50/80`
   - Context menu (⋯): **hidden by default**, shown on hover via `opacity-0 group-hover:opacity-100`
   - Use `<Button variant="ghost" size="icon">` for context triggers
   - Entity name: `text-[13px] font-semibold`
   - Meta info: `text-[10px]`-`text-[11px]` inline
3. **Anti-patterns**: No large gradient icons, no large padding, no permanent context menus, no `rounded-2xl` on list items.

### C. Right Panel (Detail Workspace) Rules

The detail workspace should feel informative and spacious:

1. **Profile/Header section**:
   - Avatar: `h-14 w-14 rounded-2xl bg-gradient-to-br` with `shadow-lg`
   - Overlay status dot on avatar corner (like Slack): `absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 border-[2.5px] border-white`
   - Title: `h4` bold with `tracking-tight`
   - Code badge: `text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded-md border`
   - Status: Use `Badge` with micro-icon (`check-circle-2` for active, `minus-circle` for inactive)
   - Decorative gradient: subtle `from-brand-primary/[0.06]` overlay
2. **Info/Stat cards**:
   - Use a 2-column grid with individual mini-cards
   - Background: `bg-slate-100/70` with `border-slate-200/80` (must be clearly visible)
   - Icon container: `bg-white border-slate-200 shadow-sm`
   - Icon color: `text-brand-primary/70`
   - Label: `text-[10px] uppercase tracking-wider text-slate-500`
   - Value: `text-[13px] font-semibold text-slate-800`
3. **Action buttons hierarchy**:
   - Primary action (Edit): `<Button variant="outline" size="sm">`
   - Destructive action (Delete): **ALWAYS** hidden inside a dropdown (⋯)
   - Use `<Button variant="outline" size="icon">` for the dropdown trigger

### D. Sub-entity Section Rules

When an entity has child entities displayed on the same page:

1. **Separate card** for the sub-entity section with its own header + "Tambah" button.
2. Header: icon badge + title + count pill + add button, separated by `border-b`.
3. Grid: `grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3`.
4. Empty state: dashed border card with icon + text CTA.
5. "Add" mini-card: inline with existing cards, compact horizontal layout (icon + text).
6. Cards: `rounded-xl` (not `rounded-2xl`), hover with `hover:border-slate-200 hover:shadow-sm`.

### E. General Anti-Patterns (NEVER DO)

- ❌ Using raw `<button>` for clickable triggers — always use `<Button>` component
- ❌ Overriding `rounded-*` on `<Button>`
- ❌ `animate-bounce` on empty states
- ❌ Heavy `shadow-xl` or `shadow-lg` on static content cards
- ❌ `hover:-translate-y-1.5` or larger — use `-translate-y-0.5` or `-translate-y-1` max
- ❌ Mixing `<Typography>` with raw `<span>` for the same visual purpose
- ❌ Using `body-md`/`body-lg` for labels/subtitles in compact areas
