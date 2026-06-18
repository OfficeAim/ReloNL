---
name: savetoday
description: Closes the current session, estimates time spent, saves progress to Engram, and updates the project journal.
---

# `savetoday` Protocol

**Trigger:** When the user runs `/savetoday`, or says they are done for the day/session.

## Purpose
To properly close a work session by documenting what was done, storing it in persistent memory (Engram), updating the project journal, and providing the user with a summary of the time spent.

## Execution Steps

1. **Estimate Time:** Briefly look at the timestamps of the first and last messages in the session (or estimate based on the conversation flow) to give the user a rough idea of "Time worked in this session: ~X hours/minutes".
2. **Update PROJECT_JOURNAL.md:** Add a new block at the top of the journal with the current date, listing the `✅ Completed` tasks and `🎯 Next Priority`.
3. **Engram Session Close (CRITICAL):**
   Call the MCP tool `mem_session_summary` (from the `engram` server) with the required structure:
   - **Goal:** What the main objective of the session was.
   - **Instructions:** Any new rules, preferences, or constraints learned.
   - **Discoveries:** Non-obvious findings or technical decisions made.
   - **Accomplished:** Bullet points of what was actually finished.
   - **Next Steps:** What is pending for the next session.
   - **Relevant Files:** Paths to the main files modified.
4. **Report:** Output a clean, warm message to the user summarizing the session, confirming the Engram save, showing the time spent, and saying goodbye.
