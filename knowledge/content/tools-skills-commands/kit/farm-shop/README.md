# Lindenhof farm shop

The starter folder for the experiment "Tools, skills and commands" on
hands-on-computer-science.de. The shop and its numbers are invented.

- `opencode.jsonc` sets up two agents for OpenCode. `shop` is the shop's
  assistant with its model, its role and what it may do; `coach` runs on a
  strong model and rewrites skills and commands so that `shop` can follow them
  on a smaller model. The three groups of tools are switched off at the start;
  set `"disabled"` to `false` to switch one on and start a new session.
- `tools/farm_shop.py` holds the tools. It needs Python 3 and no packages.
  On macOS and Linux, write `python3` instead of `python` in `opencode.jsonc`.
- `python tools/farm_shop.py solution [date]` prints the order and the daily
  closing that the shop's rules lead to, for checking your agent.

Skills go into `.agents/skills/<name>/SKILL.md`, commands into
`.opencode/commands/<name>.md`. Orders the agent sends land in `outbox/`, the
cash book is `cashbook.csv`.
