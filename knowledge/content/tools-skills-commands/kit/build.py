"""Build the stages of the farm shop folder for the experiment page.

    python kit/build.py

The learners start with an almost empty folder and add the tools, skills and
commands step by step. This script writes, from the starter folder in
kit/farm-shop and the files each step adds in kit/added/<step>/:

- kit/farm-shop/opencode.jsonc, the configuration at the start;
- media/steps/<step>/, the files a step creates or changes, to download one by one;
- media/farm-shop.zip and media/farm-shop-after-process-<n>.zip, the whole
  folder at the start and after each process, for anyone who falls behind.

Steps are named <process>-<step>, as in the experiment: 1-2 is the second
step of process 1. All files are written with LF line endings.
"""

import shutil
import tempfile
import zipfile
from pathlib import Path

KIT = Path(__file__).resolve().parent
ITEM = KIT.parent
START = KIT / "farm-shop"
ADDED = KIT / "added"
MEDIA = ITEM / "media"
STAMP = (2026, 1, 1, 0, 0, 0)

SHOP_SYSTEM = ("You are the assistant of the Lindenhof farm shop, a small self-service shop on a farm. "
               "You help the owner with the daily work. Answer briefly.")
COACH_SYSTEM = ("You help the owner of the Lindenhof farm shop to prepare the agent \\\"shop\\\" in this folder "
                "for a smaller language model. Its role and rules are in opencode.jsonc, its tools in tools/shop.py, "
                "tools/orders.py and tools/till.py, its skills in .agents/skills and its commands in .opencode/commands.")

# What each step adds to opencode.jsonc: servers, rules of the agent shop, and changes.
SERVERS = {
    "shop": "1-2",
    "orders": "1-5",
    "till": "2-1",
}
RULES = [
    ("1-2", "shop_*", "*", "allow", "read products, stock and sales freely"),
    ("1-4", "skill", "weekly-order", "allow", "load the skill weekly-order"),
    ("1-5", "orders_*", "*", "ask", "ordering costs money: ask the person first"),
    ("2-1", "till_*", "*", "allow", "read the till and the cash box, write the cash book"),
    ("2-2", "skill", "daily-closing", "allow", "load the skill daily-closing"),
    ("2-2", "edit", ".agents/skills/**", "ask", "write skills, after asking"),
    ("2-2", "edit", ".opencode/commands/**", "ask", "write commands, after asking"),
    ("2-5", "edit", "reports/**", "allow", "write reports"),
    ("2-5", "shell", "typst compile reports/*", "allow", "turn a report into a PDF"),
]
SMALL_MODEL = "3-3"
COACH = "4-1"
ORDER = ["0", "1-2", "1-4", "1-5", "1-6", "2-1", "2-2", "2-3", "2-5", "3-3", "4-1", "4-2"]
OPTIONAL = {"2-5"}  # left out of the ZIP files of later processes
ZIPS = {"1": "1-6", "2": "2-3", "3": "3-3", "4": "4-2"}


def reached(step, now):
    """Whether the step `step` is done when the folder is at step `now`."""
    if step in OPTIONAL and now != step:
        return False
    return ORDER.index(step) <= ORDER.index(now)


def config(now):
    """opencode.jsonc as it is after the step `now`."""
    model = "lmstudio/google/gemma-4-e2b" if reached(SMALL_MODEL, now) else "openai/gpt-6-luna"
    rules = ['        // The first rule takes away everything OpenCode brings along:\n'
             '        // no files, no shell, no web. Later rules win over earlier ones.\n'
             '        { "action": "*", "resource": "*", "effect": "deny" }']
    for step, action, resource, effect, why in RULES:
        if reached(step, now):
            rules.append(f'        // {why}\n        {{ "action": "{action}", "resource": "{resource}", "effect": "{effect}" }}')
    servers = []
    for name, step in SERVERS.items():
        if reached(step, now):
            servers.append(f'      "{name}": {{\n'
                           f'        "type": "local",\n'
                           f'        "command": ["python", "tools/{name}.py"],\n'
                           f'        "codemode": false\n'
                           f'      }}')
    coach = ""
    if reached(COACH, now):
        coach = (',\n'
                 '    // A second agent with a frontier model that prepares "shop" for a smaller one.\n'
                 '    // It may read every file in this folder and rewrite skills and commands, but\n'
                 '    // it cannot run anything and asks before every change.\n'
                 '    "coach": {\n'
                 '      "description": "Prepares the shop agent for a smaller model",\n'
                 '      "mode": "primary",\n'
                 '      "model": "openai/gpt-6.2-sol",\n'
                 f'      "system": "{COACH_SYSTEM}",\n'
                 '      "permissions": [\n'
                 '        { "action": "*", "resource": "*", "effect": "deny" },\n'
                 '        { "action": "read", "resource": "*", "effect": "allow" },\n'
                 '        { "action": "glob", "resource": "*", "effect": "allow" },\n'
                 '        { "action": "grep", "resource": "*", "effect": "allow" },\n'
                 '        { "action": "list", "resource": "*", "effect": "allow" },\n'
                 '        { "action": "edit", "resource": ".agents/skills/**", "effect": "ask" },\n'
                 '        { "action": "edit", "resource": ".opencode/commands/**", "effect": "ask" }\n'
                 '      ]\n'
                 '    }')
    return ('{\n'
            '  "$schema": "https://opencode.ai/config.json",\n'
            '  "default_agent": "shop",\n'
            '  "agents": {\n'
            '    // The agent of the Lindenhof farm shop: a model, a role and the rules\n'
            '    // for what it may do.\n'
            '    "shop": {\n'
            '      "description": "Assistant of the Lindenhof farm shop",\n'
            '      "mode": "primary",\n'
            f'      "model": "{model}",\n'
            f'      "system": "{SHOP_SYSTEM}",\n'
            '      "permissions": [\n'
            + ",\n".join(rules) + '\n'
            '      ]\n'
            '    }' + coach + '\n'
            '  },\n'
            '  // The tools: each group is a small Python program, an MCP server, that\n'
            '  // OpenCode starts with the command given. On macOS and Linux, write\n'
            '  // "python3" instead of "python".\n'
            '  "mcp": {\n'
            '    "servers": {\n'
            + ",\n".join(servers) + ('\n' if servers else '') +
            '    }\n'
            '  }\n'
            '}\n')


def write(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(text.replace("\r\n", "\n").encode("utf-8"))


def folder(now, target):
    """The whole folder after the step `now`, written to `target`."""
    shutil.copytree(START, target, ignore=shutil.ignore_patterns("__pycache__", "outbox", "cashbook.csv"))
    for step in ORDER[1:]:
        src = ADDED / step
        if reached(step, now) and src.is_dir():
            for f in src.rglob("*"):
                if f.is_file():
                    write(target / f.relative_to(src), f.read_text(encoding="utf-8"))
    write(target / "opencode.jsonc", config(now))


def pack(now, out):
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp) / "farm-shop"
        folder(now, root)
        files = sorted(p for p in root.rglob("*") if p.is_file())
        with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
            for p in files:
                info = zipfile.ZipInfo(f"farm-shop/{p.relative_to(root).as_posix()}", STAMP)
                info.compress_type = zipfile.ZIP_DEFLATED
                info.external_attr = 0o644 << 16
                z.writestr(info, p.read_bytes())
    print(f"{out.name}: {len(files)} files")


def main():
    write(START / "opencode.jsonc", config("0"))
    steps = MEDIA / "steps"
    if steps.exists():
        shutil.rmtree(steps)
    previous = config("0")
    for step in ORDER[1:]:
        target = steps / step
        src = ADDED / step
        if src.is_dir():
            files = [f for f in src.rglob("*") if f.is_file()]
            names = [f.name for f in files]
            for f in files:
                # two skills in one step both hold a SKILL.md: those go into a folder named after the skill
                name = f"{f.parent.name}/{f.name}" if names.count(f.name) > 1 else f.name
                write(target / name, f.read_text(encoding="utf-8"))
        now = config(step)
        if now != previous:
            write(target / "opencode.jsonc", now)
        previous = now
    for f in MEDIA.glob("farm-shop*.zip"):
        f.unlink()
    pack("0", MEDIA / "farm-shop.zip")
    for process, step in ZIPS.items():
        pack(step, MEDIA / f"farm-shop-after-process-{process}.zip")


if __name__ == "__main__":
    main()
