# Crops of the rendered example paper for the deck "first steps with quarto".
#
# Renders example/milk-prices.qmd and a small Markdown demo with Quarto in a
# working folder outside the repository, then cuts the pieces the slides show
# as PNGs into img/: the figure, the table, the formula, single lines with a
# cross-reference, the inline number or the citation, the bibliography, the
# Markdown demo and both pages. A crop is cut tight around its lines, so no
# neighbouring line peeks in, and then gets a white margin of 6 pt.
#
# Usage, from the repository root (needs Quarto, R with the tidyverse and
# rmarkdown, and PyMuPDF):
#   python knowledge/content/quarto-first-steps-slides/slides/crops.py <work folder>
# The rectangles below are in PDF points and were read from the rendered
# paper; if the paper changes, check them against page.get_text("dict").
import shutil, subprocess, sys
from pathlib import Path
import fitz
from PIL import Image, ImageOps

here = Path(__file__).resolve().parent
repo = here.parents[3]
work = Path(sys.argv[1]).resolve()
work.mkdir(parents=True, exist_ok=True)
out = here / "img"

for f in ["milk-prices.qmd", "references.bib"]:
    shutil.copy(here / "example" / f, work / f)
shutil.copy(repo / "knowledge/media/datasets/milk_survey_compact.csv", work / "milk_survey_compact.csv")
(work / "md-demo.qmd").write_text("""---
format:
  typst:
    papersize: a4
    number-sections: true
    include-before-body:
      - text: |
          #set page(height: auto)
---

## Method

This is **important**.

We ran a *survey*.

- one item
- another item

See [quarto.org](https://quarto.org).

A claim.^[a footnote]
""", encoding="utf-8")
for f in ["milk-prices.qmd", "md-demo.qmd"]:
    subprocess.run(["quarto", "render", f], cwd=work, check=True, shell=sys.platform == "win32")


def crop(pdf, page, rect, name, z=4, margin=6):
    doc = fitz.open(work / pdf)
    r = fitz.Rect(rect[0] - 2, rect[1] - 0.5, rect[2] + 2, rect[3] + 0.5)
    doc[page].get_pixmap(matrix=fitz.Matrix(z, z), clip=r).save(out / f"{name}.png")
    im = ImageOps.expand(Image.open(out / f"{name}.png").convert("RGB"), border=int(margin * z), fill="white")
    im.save(out / f"{name}.png")
    wpt, hpt = r.width + 2 * margin, r.height + 2 * margin
    print(f"{name}: {wpt:.0f} x {hpt:.0f} pt, at 3.4 px/pt {wpt * 3.4:.0f} x {hpt * 3.4:.0f}")


crop("milk-prices.pdf", 0, (252, 490, 343, 527), "pdf-formula", z=8)
crop("milk-prices.pdf", 1, (98, 106, 498, 378), "pdf-figure")
crop("milk-prices.pdf", 1, (228, 425, 369, 575), "pdf-table")
crop("milk-prices.pdf", 1, (90, 406, 249, 418), "pdf-median")
crop("milk-prices.pdf", 1, (90, 385, 289, 398), "pdf-figref")
crop("milk-prices.pdf", 1, (90, 588, 268, 601), "pdf-tblref")
crop("milk-prices.pdf", 1, (90, 634, 508, 660), "pdf-secref")
crop("milk-prices.pdf", 0, (90, 342, 311, 355), "pdf-citation")
crop("milk-prices.pdf", 1, (90, 674, 497, 720), "pdf-bibliography")
# the Markdown demo: every line of its page but the page number
p = fitz.open(work / "md-demo.pdf")[0]
bb = [l["bbox"] for b in p.get_text("dict")["blocks"] if b["type"] == 0 for l in b["lines"]
      if not "".join(s["text"] for s in l["spans"]).strip().isdigit()]
x0, y0, y1 = min(b[0] for b in bb), min(b[1] for b in bb), max(b[3] for b in bb)
x1 = max(max(b[2] for b in bb), x0 + 126)   # the footnote rule is wider than its text
crop("md-demo.pdf", 0, (x0, y0, x1, y1), "pdf-markdown")
for i in range(2):
    fitz.open(work / "milk-prices.pdf")[i].get_pixmap(dpi=150).save(out / f"pdf-page-{i + 1}.png")
