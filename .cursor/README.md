# `.cursor/` in this repo

Most Cursor workspace state stays local. **Only these folders are tracked in git:**

| Path | Contents |
|------|----------|
| `.cursor/plans/` | Task plans (e.g. portfolio v1 scope and AC) |
| `.cursor/transcripts/` | Exported agent session transcripts (Markdown) |

Everything else under `.cursor/` is gitignored.

The transcript for v1 includes the full build arc through GitHub Pages deploy and post-launch fixes. Re-export from the Cursor JSONL when the session continues.
