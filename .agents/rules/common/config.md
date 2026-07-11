# Project Configuration

- **Language**: TypeScript
- **Package Manager**: npm
- **Framework**: Svelte 5 (Runes mode), SvelteKit (SPA Mode / ssr = false)
- **Add-ons**: prettier, eslint, vitest, playwright, tailwindcss v4, storybook, mcp, mdsvex, paraglide

## Coding Standards
- **Strict Typesafety**: STRICTLY avoid using `any`. Use `unknown`, proper interfaces/types, or generics instead.
- **Error Handling**: When catching errors, handle them as `unknown` and use type guards (e.g., `err instanceof Error`) before accessing their properties.
