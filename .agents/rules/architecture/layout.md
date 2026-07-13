# UI Layout Architecture Guidelines

This rule defines how the UI layout and page content should be structured in SvelteKit for the HRIS project, enforcing a clear separation of concerns.

## SvelteKit Layout vs Page Responsibilities

### 1. `+layout.svelte` (The Application Shell)
- **Purpose**: Acts as the main application shell for a route group.
- **Responsibilities**:
  - Must contain global, persistent UI components such as the Sidebar (`<aside>`), Navbar / Header (`<header>`), and the Main content wrapper (`<main>`).
  - Must manage global UI states (e.g., Sidebar `isCollapsed`, Mobile Drawer `isMobileOpen`).
  - Must handle global lifecycle events (e.g., reading the theme from `localStorage` on `onMount` or initializing auth state).
  - The dynamic content from individual pages is injected into the `<main>` tag using the `{@render children()}` Svelte 5 rune.

### 2. `+page.svelte` (The Page Content)
- **Purpose**: Contains the unique content for a specific URL/route.
- **Responsibilities**:
  - Must ONLY contain the specific content for that particular page (e.g., Dashboard widgets, Employee lists, Settings forms).
  - **MUST NOT** re-declare or re-import the Sidebar, Navbar, or the `<main>` wrapper.
  - Focused entirely on domain-specific UI, data fetching, and interactions.

## DRY (Don't Repeat Yourself) Principle
- The layout elements (Sidebar, Navbar, etc.) must be abstracted into modular components in `src/lib/presentation/shared/components/` and imported into `+layout.svelte`.
- Avoid writing raw HTML for shared layout components directly inside `+page.svelte` to prevent redundant and unmaintainable code across the application.
