# Ideas

Scratchpad for tooling/product ideas. Nothing here is committed to a roadmap.

## Claude session retro tool

At the end of a Claude Code session, run a retro over the session transcript:

- Identify what took the most time or the most turns (repeated failed commands,
  missing context, wrong assumptions, flaky test/lint loops, permission prompts).
- Turn those findings into concrete instruction improvements — CLAUDE.md rules,
  skills, hooks, or allowlist entries — so the same friction doesn't repeat.
- Ideally proposed as a diff the user can accept or reject, not applied silently.

Could be a slash command (`/retro`) or a Stop hook that fires at session end.
