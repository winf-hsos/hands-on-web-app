# Lindenhof farm shop

The starter folder for the experiment "Tools, skills and commands" on
hands-on-computer-science.de. The shop and its numbers are invented.

- `opencode.jsonc` sets up the agent `shop` for OpenCode: its model, its role
  and the rules for what it may do. At the start it has no tools; the
  experiment adds them step by step.
- `tools/lindenhof.py` stands in for the shop's database and its till. The
  tools you write call it, so you do not need to read it.
- `tools/mcp_lite.py` is a small MCP server that offers Python functions to
  OpenCode as tools. It needs Python 3 and nothing else; on macOS and Linux,
  write `python3` instead of `python` in `opencode.jsonc`.
- `python tools/lindenhof.py [date]` prints the order and the daily closing
  that the shop's rules lead to, for checking your agent.

Tools go into `tools/<group>.py`, skills into
`.agents/skills/<name>/SKILL.md`, commands into
`.opencode/commands/<name>.md`. Orders the agent sends land in `outbox/`, the
cash book is `cashbook.csv`.
