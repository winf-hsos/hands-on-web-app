---
title: Technical architecture
status: decided by Nicolas on 2026-10-21: own build script, no framework
date: 2026-10-21
---

# Technical architecture

The site is built by our own script from the knowledge base. There is no site
framework: a Node script reads the Markdown files, checks them, renders every
page to plain HTML and copies a few small browser modules next to them. The
result in `dist/` can be served by any static web host.

## History of the decision

On 2026-10-21 three variants were compared: Astro, Eleventy, and an own build
script. Nicolas first chose Astro, saw the result and decided the same day to
build it ourselves, with the checks as scripts in the build and a simpler,
calmer design. The Astro version is in the git history (commit `cd457ba`).

## Fixed requirements

- a **static site**, no server at run time, until the AI companion arrives;
- the knowledge base in `knowledge/` is the **only source** of what the site
  shows; templates contain interface labels only;
- **German and English** side by side, switchable on every page;
- filter, sort and **live search** including short codes, fast and offline;
- **courses** reached by code with release dates, and **learning paths**;
- **progress** in local storage, portable as a link, a QR code and a file;
- a **map** of all items and relations;
- **no login, no personal data** leaving the browser.

## How the build works

```
knowledge/  ──load.mjs──▶  files with front matter and body
            ──validate.mjs──▶  errors stop the build, warnings are printed
            ──site.mjs──▶  lookups, relations both ways, text per language
            ──templates/──▶  HTML per page and language
                                  ▼
dist/  de/…, en/…, de/index.json, en/index.json, assets/
```

| File | Job |
|---|---|
| `scripts/build.mjs` | the whole build; `npm run build` |
| `scripts/dev.mjs` | local preview with rebuild on save and reload; shows the error list instead of the site while the knowledge base has errors |
| `src/build/load.mjs` | reads `knowledge/` |
| `src/build/validate.mjs` | the rules of `knowledge-schema.md`, as code |
| `src/build/markdown.mjs`, `remark-knowledge.mjs` | Markdown to HTML with `[[links]]`, callouts and quizzes (unified/remark) |
| `src/build/site.mjs` | the model the templates use |
| `src/build/html.mjs` | a tagged template that escapes everything not already HTML |
| `src/templates/` | layout, shared parts, one function per kind of page |
| `src/client/` | browser modules: progress, search, list filters, quiz, map, course, my learning |
| `src/styles/site.css` | the one stylesheet |
| `tests/` | `npm test`: each rule of the knowledge base broken once on purpose |

Dependencies are deliberately few: `js-yaml` for front matter, the unified
family for Markdown, MiniSearch for search, `qrcode-generator` for the QR
code, the Lucide icons for the content types, and the Atkinson Hyperlegible fonts, which are served from the site
itself rather than from Google. The browser loads ES modules directly through
an import map; there is no bundler.

## Design principle

**Overview first, details on request.** Lists are rows with a topic dot, the
title, type and duration, and one quiet line of summary. Level, topics, code,
status, date, further relations, the text about a path or course, and taking
progress along all sit in disclosures that open when asked for.

Motion answers what the learner does: the title of an item glides from the
list into the heading of its page (cross-document view transitions), filtered
results move to their new place, disclosures open smoothly, and the check
mark draws itself when an item is marked done. The one motion that is not
triggered by the learner is the map settling into place on the start page.
All motion is switched off for people who ask their system for reduced motion.

## Search, progress, courses, map

- **Search** uses `de/index.json` or `en/index.json` (titles, summaries, plain
  text, codes), loaded only when needed. A four-digit code jumps straight to its
  item. The search dialog opens from every page with `/` or Ctrl+K.
- **Progress** is stored in local storage by item id. For transfer it is
  compressed with the browser's own `CompressionStream`, with items written by
  their four-digit codes, and put into a link `…/learning/#p=…`. The part after
  `#` never reaches any server. The QR code shows the same link.
- **Courses** are opened by access code on "My learning"; units before their
  release date are folded and greyed out, but every item stays reachable.
- **Projects** show their phases as a numbered, folded list; a phase opens to
  its text, its challenges and the content linked to it. A link to
  `#challenge-2` opens exactly that part.
- **The map** is drawn as SVG with a small force layout of our own; hovering a
  node brings out its neighbours.

## Hosting and address

Any static host will do; GitHub Pages (like the book sites) or the Uberspace
of Classroom Live are candidates. The address is open; `cs.`, `book.` and
`ai.hands-on-computer-science.de` are already taken by the book sites. Nothing
is published before Nicolas says so explicitly.
