# Project Rules Entrypoint

CRITICAL: As an AI agent, you MUST read, load, and follow the specific rules split into folders under `.agents/rules/` before writing any code or making architectural decisions.

Please read the following rules:

## 1. Common Rules
- Project goals, context, and HRIS domain vision: [project-vision.md](file:///Users/dystopia/svelte/hris-frontend/.agents/rules/common/project-vision.md)
- Project configuration, language, and package management guidelines: [config.md](file:///Users/dystopia/svelte/hris-frontend/.agents/rules/common/config.md)
- Naming conventions for directories, files, components, and variables: [naming.md](file:///Users/dystopia/svelte/hris-frontend/.agents/rules/common/naming.md)
- UI Design, styling, card-based layout, and brand color guidelines: [ui-design.md](file:///Users/dystopia/svelte/hris-frontend/.agents/rules/common/ui-design.md)
- Reusable UI component catalog and fallback slicing rules: [components.md](file:///Users/dystopia/svelte/hris-frontend/.agents/rules/common/components.md)
- Accessibility (a11y) & Keyboard Navigation: [a11y.md](file:///Users/dystopia/svelte/hris-frontend/.agents/rules/common/a11y.md)

## 2. Architecture Rules
- Frontend Domain-Driven Design (DDD) Clean Architecture: [ddd.md](file:///Users/dystopia/svelte/hris-frontend/.agents/rules/architecture/ddd.md)
- SvelteKit UI Layout Architecture: [layout.md](file:///Users/dystopia/svelte/hris-frontend/.agents/rules/architecture/layout.md)
- Error Handling, AppError, and Validation: [error-handling.md](file:///Users/dystopia/svelte/hris-frontend/.agents/rules/architecture/error-handling.md)

## 3. Svelte Rules
- Guidelines for working with Svelte 5 and using Svelte MCP tools: [mcp.md](file:///Users/dystopia/svelte/hris-frontend/.agents/rules/svelte/mcp.md)
- Svelte 5 coding conventions, runes patterns, and lint-safe idioms: [conventions.md](file:///Users/dystopia/svelte/hris-frontend/.agents/rules/svelte/conventions.md)

## 4. AI Tooling Setup (Multi-Agent Sync)

This project shares rules, skills, and workflows across multiple AI tools (Gemini/Antigravity, Claude Code, and any AGENTS.md-compatible tool). `.agents/` is the **single source of truth**:

- `/AGENTS.md` (repo root) and `/CLAUDE.md` are entrypoints that point back into this folder — root `AGENTS.md` is a symlink to this file.
- `.claude/rules/`, `.claude/skills/`, and `.claude/commands/` are **symlinks** into `.agents/rules/`, `.agents/skills/`, and `.agents/workflows/` respectively — they are not copies.

**CRITICAL:** Always create, edit, or delete rules, skills, and workflows under `.agents/` (e.g. `.agents/rules/...`, `.agents/skills/...`, `.agents/workflows/...`). Never write directly into `.claude/rules/`, `.claude/skills/`, or `.claude/commands/` — those paths only exist so Claude Code auto-loads the same content every session.

