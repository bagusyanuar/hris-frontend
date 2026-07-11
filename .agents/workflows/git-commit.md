---
description: command for auto commit to github
---

# Commit Workflow

This workflow automates the commit process when triggered by the `/commit` slash command.

## 🤖 Steps to Execute

1. **Trigger Check:**
   - Execute this workflow when the user requests a commit or runs `/commit`.

2. **Scan Status:**
   - Run `git status` to see what files are modified, added, or deleted.

3. **Group by Context:**
   - Group the changes into logical contexts (e.g., separating component edits from documentation or config files).

4. **Staging & Commit per Context:**
   - For each group of changes:
     - Formulate a precise Conventional Commit message.
     - Stage only the relevant files: `git add <files>`.
     - Commit the staged files: `git commit -m "<message>"`.

5. **Push:**
   - Run `git push` to upload all commits to the remote repository.
