---
name: auto-commit
description: Automates git staging, conventional commit messages, and pushes after completing tasks. Supports atomic commits for multiple work contexts.
---

# Auto Commit Skill

Use this skill when you have completed coding tasks and want to commit the changes to the git repository.

## 🤖 Workflow

1. **Step 1: Inspect and Group Changes (Context Splitting)**
   - Run `git status` to see all modified/added/deleted files.
   - **CRITICAL:** Analyze if the changes belong to different logical contexts (e.g., a backend model change vs. a frontend button component, or a new feature vs. a documentation update).
   - If there are multiple contexts, **group the changes** into separate atomic groups.

2. **Step 2: Commit Sequentially (Atomic Commits)**
   - For each group of changes:
     - Formulate a specific **Conventional Commit** message for that group (e.g., `feat(button): add variant` or `docs(api): update employee docs`).
     - Stage *only* the files related to this specific context: `git add <file1> <file2>`.
     - Commit the staged files: `git commit -m "<message>"`.
     - *Note:* Do not use `git add .` unless all changes in the workspace strictly belong to the exact same context.

3. **Step 3: Push to Remote**
   - Once all groups are committed and the working directory is clean, ask the user if they want to push the commits to the remote repository. If yes, propose `git push`.

## 📝 Conventional Commit Format

- `feat(scope): [description]` for new features.
- `fix(scope): [description]` for bug fixes.
- `docs(scope): [description]` for documentation changes.
- `style(scope): [description]` for formatting, missing semi-colons, etc.
- `refactor(scope): [description]` for code changes that neither fix a bug nor add a feature.
- `test(scope): [description]` for adding or refactoring tests.
- `chore(scope): [description]` for updating build tasks, package manager configs, etc.
