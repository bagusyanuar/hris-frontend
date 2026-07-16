@AGENTS.md

## Claude Code notes

- Rules and skills are shared with other AI tools via `.agents/`. `.claude/rules/` and `.claude/skills/` are symlinks into `.agents/rules/` and `.agents/skills/` — edit files there, not in `.claude/`.
- The `/commit` workflow is available here too via `.claude/commands/commit.md` (symlinked from `.agents/workflows/git-commit.md`).
