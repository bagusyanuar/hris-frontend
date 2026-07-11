# Reusable Component Rules & Fallback Guidelines

This document defines the strict rules for using, searching, and creating UI components within this project to prevent redundant styling, duplicate code, and inconsistent patterns.

For the list of currently registered components, see the [Component Catalog](file:///Users/dystopia/svelte/hris-frontend/.agents/references/catalog.md).

---

## 🤖 AI Workflow & Fallback Decision Tree

Whenever you need to render a UI element (e.g., inputs, buttons, selections, loaders, modal dialogs, status badges):

1. **Step 1: Check the Catalog first**
   - Verify if a matching component exists in the [Component Catalog](file:///Users/dystopia/svelte/hris-frontend/.agents/references/catalog.md).
   - *Note:* The catalog is a reference file. Only read it when you are actively building UI components.
2. **Step 2: Fallback Scan the Physical Directory**
   - If not cataloged, scan the [shared/components](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components) directory to see if the component exists but was not yet registered in the catalog.
3. **Step 3: Slice/Create a New Shared Component**
   - If the component does not exist yet, **do NOT write raw HTML/Tailwind inputs or inline styles directly in page files.**
   - Instead, create a new reusable component under [shared/components](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components).
   - Ensure the new component follows our design system standards (Tailwind v4 abstract tokens, Svelte 5 Runes, strict TypeScript, and barrel exports).
   - **Immediately update** the [Component Catalog](file:///Users/dystopia/svelte/hris-frontend/.agents/references/catalog.md) to register your new component for future sessions.
