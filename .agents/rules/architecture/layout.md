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
