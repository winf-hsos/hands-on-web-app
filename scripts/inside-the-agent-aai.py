"""Build aai.js for the deck inside-the-agent-slides: drawings borrowed from the Applications of AI decks.

Each source deck.js runs inside its own function scope, so its helpers cannot clash with this deck's
deck.js. Inside that scope, every figure id gets the prefix "aai-" (in $() and in d.anim()), so a
figure of the source deck never draws into a figure of this deck with the same id (fig-metr, fig-loop).
The step hooks (show...) are exported as globals with a short prefix per source, e.g. ntp_showTemp.

Run again after a source deck changed:  python scripts/inside-the-agent-aai.py
"""
import pathlib
import re

REPO = pathlib.Path(__file__).resolve().parent.parent / "knowledge" / "content"
SOURCES = {  # prefix: source deck
    "ntp": "next-token-prediction-slides/slides/deck.js",
    "om": "open-models-slides/slides/deck.js",
    "rs": "reasoning-slides/slides/deck.js",
    "ag": "ai-agents-slides/slides/deck.js",
}
OUT = REPO / "inside-the-agent-slides" / "slides" / "aai.js"

# The examples of the source decks give way to examples from the game Shelf Life. Every replacement
# must match exactly once, so a changed source deck stops the build instead of drawing the old example.
SUBS = {
    "ntp": [
        ('const NAECHSTE = [["field", 0.41], ["barn", 0.22], ["yard", 0.09], ["shed", 0.06], ["mud", 0.04]];',
         'const NAECHSTE = [["food", 0.31], ["bin", 0.24], ["fridge", 0.09], ["shelf", 0.07], ["cashier", 0.04]];'),
        ("const REST = 0.18, REST_N = 1000;", "const REST = 0.25, REST_N = 1000;"),
        ('const KONTEXT = "the farmer drove the tractor into the …";',
         'const KONTEXT = "milk that expires tonight goes to the …";'),
        ('"262,000 tokens in the vocabulary, most of them almost zero"',
         '"every token in the vocabulary gets a share, most of them almost zero"'),
        ('const basis = "the farmer drove the tractor into the";', 'const basis = "milk that expires tonight goes to the";'),
        ('const neu = [" field", ",", " where"];', 'const neu = [" food", " bank", "."];'),
        ('const ende = step >= 2 ? "narrow" : "wide";', 'const ende = step >= 2 ? "full" : "big";'),
        ('const woerter = ["the", "tractor", "did", "not", "fit", "through", "the", "gate", "because", "it", "was", "too", ende];',
         'const woerter = ["the", "crate", "did", "not", "fit", "into", "the", "fridge", "because", "it", "was", "too", ende];'),
        ('woerter.slice(0, -1).join(" ") + " wide"', 'woerter.slice(0, -1).join(" ") + " full"'),
        ('const SATZ_IT = ["the", "tractor", "did", "not", "fit", "through", "the", "gate", "because", "it", "was", "too", "wide"];',
         'const SATZ_IT = ["the", "crate", "did", "not", "fit", "into", "the", "fridge", "because", "it", "was", "too", "big"];'),
    ],
    "rs": [
        ('d.box(1400, A - 55, 200, 110, "1,000 €"', 'd.box(1400, A - 55, 200, 110, "0.10 €"'),
        ('"then together: 12,000 €"', '"then together: 1.20 €"'),
        ('zeilen(820, 308, 55, ["trailer: x", "tractor: x + 10,000", "x + x + 10,000 = 11,000", "x = 500"]',
         'zeilen(820, 308, 55, ["yoghurt: x", "milk: x + 1.00", "x + x + 1.00 = 1.10", "x = 0.05"]'),
        ('d.box(1400, B - 55, 200, 110, "500 €"', 'd.box(1400, B - 55, 200, 110, "0.05 €"'),
        ('["tractor + trailer = 11,000 €", "tractor = trailer + 10,000 €"]', '["yoghurt + milk = 1.10 €", "milk = yoghurt + 1.00 €"]'),
        ('["trailer: x", "tractor: x + 10,000", "x + x + 10,000 = 11,000", "2x = 1,000", "x ="]',
         '["yoghurt: x", "milk: x + 1.00", "x + x + 1.00 = 1.10", "2x = 0.10", "x ="]'),
        ('step >= 1 ? "500" : "?"', 'step >= 1 ? "0.05" : "?"'),
        ('breite("2x = 1,000", 32, true)', 'breite("2x = 0.10", 32, true)'),
        ('d.label(230, 0, "500", {', 'd.label(230, 0, "0.05", {'),
        ('[["attempt 1: … 500 €", true], ["attempt 2: … 1,000 €", false], ["attempt 3: … 400 €", false], ["attempt 4: … 500 €", true]]',
         '[["attempt 1: … 0.05 €", true], ["attempt 2: … 0.10 €", false], ["attempt 3: … 0.55 €", false], ["attempt 4: … 0.05 €", true]]'),
        # the problem box as high as the model box (Nicolas, 2026-11-23)
        ('d.box(40, MID - 80, 300, 160, "problem with a\\nknown answer"', 'd.box(40, MID - 60, 300, 120, "problem with a\\nknown answer"'),
    ],
}


def adapt(prefix: str, src: str) -> str:
    for old, new in SUBS.get(prefix, []):
        n = src.count(old)
        if n != 1:
            raise SystemExit(f"{prefix}: expected one match, found {n}: {old}")
        src = src.replace(old, new)
    return src

HEAD = """  const $ = (id) => document.getElementById("aai-" + id);
  const d = Object.assign(Object.create(window.draw), { anim: (id, o) => window.draw.anim("aai-" + id, o) });
"""


def wrap(prefix: str, src: str) -> str:
    # the source's own d and $ give way to the prefixed ones
    src = re.sub(r"^const d = window\.draw;\n", "", src, count=1, flags=re.M)
    src = re.sub(r"^const \$ = \(id\) => document\.getElementById\(id\);\n", "", src, count=1, flags=re.M)
    # unguarded writes like $("fig-x").innerHTML = ...; only draw when the figure exists here
    src = re.sub(r'^(\s*)\$\("([\w-]+)"\)\.innerHTML = (.*);$',
                 r'\1{ const e = $("\2"); if (e) e.innerHTML = \3; }', src, flags=re.M)
    hooks = sorted(set(re.findall(r"^function (show\w+)\(", src, flags=re.M)))
    exports = ", ".join(f"{prefix}_{h}: {h}" for h in hooks)
    return f"// ---- {SOURCES[prefix]}\n(() => {{\n{HEAD}{src}\n  Object.assign(window, {{ {exports} }});\n}})();\n"


parts = ["// Generated by scripts/inside-the-agent-aai.py from the Applications of AI decks; do not edit by hand.\n"]
for prefix, rel in SOURCES.items():
    parts.append(wrap(prefix, adapt(prefix, (REPO / rel).read_text(encoding="utf-8"))))
OUT.write_text("\n".join(parts), encoding="utf-8", newline="\n")
print(OUT, OUT.stat().st_size, "bytes")
