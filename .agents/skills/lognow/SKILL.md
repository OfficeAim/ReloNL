---
name: lognow
description: Automatically stages and commits current changes with a timestamp to allow safe rollbacks.
---

# `lognow` Protocol

**Trigger:** When the user runs `/lognow`, or asks to "save progress", "log the step", or "crea un punto de guardado".

## Purpose
This skill creates a safe checkpoint in Git so that if the next step fails, the user can easily roll back without losing previous work.

## Execution Steps
1. **Analyze changes:** Briefly check what files were modified (`git status --short`).
2. **Commit:** Run the following command in the terminal:
   ```bash
   git add . && git commit -m "lognow: checkpoint for [Brief description of what was just done]"
   ```
3. **Report:** Inform the user that the progress is saved safely. Mention that if they ever need to go back, they can use `git reset --hard HEAD~1` to undo the next mistake, or `git log` to see the checkpoint.
