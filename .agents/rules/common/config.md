# Project Configuration

- **Language**: TypeScript
- **Package Manager**: npm
- **Framework**: Svelte 5 (Runes mode), SvelteKit (SPA Mode / ssr = false)
- **Add-ons**: prettier, eslint, vitest, playwright, tailwindcss v4, storybook, mcp, mdsvex, paraglide

## Coding Standards

<CRITICAL_RULES>
- **Strict Typesafety**: **ABSOLUTELY NO `any` ALLOWED UNDER ANY CIRCUMSTANCES**. Even as a quick fix or for 3rd-party library typing issues, you MUST find the proper type, use `unknown`, or use `ReturnType` / generics. Do not bypass the linter.
</CRITICAL_RULES>
- **Unused Imports**: Always immediately delete unused imports when you find them or when you remove the code that uses them. Keep the import list perfectly clean.
- **Error Handling**: When catching errors, handle them as `unknown` and use type guards (e.g., `err instanceof Error`) before accessing their properties.
- **Linter Checking & Auto-Fixing (CRITICAL)**: After editing any code files, you MUST run formatting and linting commands to auto-fix and verify the code:
  1. Run formatting: `npm run format` (or `npx prettier --write <modified_files>`) to automatically fix code style issues.
  2. Run linting: `npx eslint --fix <modified_files>` (or `npm run lint`) to automatically fix ESLint violations where possible.
  3. Verify type-safety & Svelte check: `npm run check` (or `npx svelte-check`).
     Do not declare a task complete until you verify the code has zero linter/formatter errors or warnings.
- **No Automated Browser Testing (CRITICAL)**: Do NOT start the dev server (`npm run dev`) or drive the app with Playwright/browser automation to "verify" a UI change, even for frontend/UI tasks. Static verification is `eslint` + `svelte-check` + `npm run build` only — that is the completion bar. The user tests every page manually themselves; running the dev server yourself only risks colliding with their own running instance. Only start the dev server if the user explicitly asks you to run or test something live.
