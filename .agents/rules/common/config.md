# Project Configuration

- **Language**: TypeScript
- **Package Manager**: npm
- **Framework**: Svelte 5 (Runes mode), SvelteKit (SPA Mode / ssr = false)
- **Add-ons**: prettier, eslint, vitest, playwright, tailwindcss v4, storybook, mcp, mdsvex, paraglide

## Coding Standards
- **Strict Typesafety**: **ABSOLUTELY NO `any` ALLOWED UNDER ANY CIRCUMSTANCES**. Even as a quick fix or for 3rd-party library typing issues, you MUST find the proper type, use `unknown`, or use `ReturnType` / generics. Do not bypass the linter.
- **Unused Imports**: Always immediately delete unused imports when you find them or when you remove the code that uses them. Keep the import list perfectly clean.
- **Error Handling**: When catching errors, handle them as `unknown` and use type guards (e.g., `err instanceof Error`) before accessing their properties.
