"""Pack the starter folder of an item for download.

    python scripts/zip-kit.py <item> <folder>

zips knowledge/content/<item>/kit/<folder> into
knowledge/content/<item>/media/<folder>.zip, with <folder> as the top folder
inside the archive. Files that a run of the experiment leaves behind (orders,
cash book, caches) stay out. Entries get a fixed date, so the archive only
changes when a file in it changes.
"""

import sys
import zipfile
from pathlib import Path

SKIP_DIRS = {"__pycache__", "outbox", ".agents", ".opencode"}
SKIP_FILES = {"cashbook.csv"}
STAMP = (2026, 1, 1, 0, 0, 0)

item, folder = sys.argv[1], sys.argv[2]
root = Path(__file__).resolve().parent.parent / "knowledge" / "content" / item
src = root / "kit" / folder
out = root / "media" / f"{folder}.zip"
out.parent.mkdir(exist_ok=True)

files = sorted(
    p for p in src.rglob("*")
    if p.is_file() and not SKIP_DIRS & set(p.relative_to(src).parts) and p.name not in SKIP_FILES
)
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    for p in files:
        info = zipfile.ZipInfo(f"{folder}/{p.relative_to(src).as_posix()}", STAMP)
        info.compress_type = zipfile.ZIP_DEFLATED
        info.external_attr = 0o644 << 16
        z.writestr(info, p.read_bytes().replace(b"\r\n", b"\n"))
print(f"{out.relative_to(root.parent.parent.parent)}: {len(files)} files")
