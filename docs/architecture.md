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
- **courses** reached by code, and **learning paths**;
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
| `scripts/editor.mjs`, `src/editor/` | the local editor (`docs/editor.md`) |
| `tests/` | `npm test`: each rule of the knowledge base broken once on purpose |

Dependencies are deliberately few: `js-yaml` for front matter, the unified
family for Markdown, MiniSearch for search, `qrcode-generator` for the QR
code, the Lucide icons for the content types, Pyodide for running Python in
the browser, and the Atkinson Hyperlegible fonts, which are served from the site
itself rather than from Google. The browser loads ES modules directly through
an import map; there is no bundler.

## Design principle

**Overview first, details on request.** Lists are rows with a type icon, the
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
- **Courses** are listed under "Courses" for everyone; a course page shows
  its sections, a learning path among them with its own parts. The access
  code on "My learning", or a link with it, adds a course there.
- **Projects** show their phases as a numbered, folded list; a phase opens to
  its text, its challenges and the content linked to it. A link to
  `#challenge-2` opens exactly that part.
- **The map** shows topics as large nodes with their items in a ring around
  them; an item with several topics sits between them and links them, and
  topics that share items are drawn close together (a small layout of our
  own, `src/client/map.js`). Item titles appear on hover or when a topic is
  chosen. Relations between items are not drawn there; they show on the
  items' own pages.
- **Python** runs in the browser with Pyodide (Python compiled to
  WebAssembly, about 12 MB), served from the site under
  `/assets/vendor/pyodide-<version>/` and loaded only when someone first clicks
  Run. It runs in a worker (`src/client/python-worker.js`), so an endless loop
  cannot freeze the page and Stop simply ends the worker. `input()` cannot
  wait inside a worker without special server headers, which static hosts
  rarely allow; instead a program runs with the answers given so far, stops
  when it needs one more, and runs again from the start once the learner has
  typed it. Programs at this level are deterministic, so the learner sees one
  continuous run. `src/client/highlight.js` highlights Python both at build
  time and while editing.

## Areas

One app and one knowledge base serve several **areas** (decision of Nicolas,
2026-10-27): Hands-on Computer Science under `/cs/` and Hands-on Data Science
under `/ds/`. Each area is a part of the site of its own, with its start page,
lists, map, search index and "My learning", and its own accent colour (blue
for computer science, pink for data science), set on `<html data-area>` in
`site.css`. The build makes one site model per area (`createSite(knowledge,
area)`): lookups cover the whole knowledge base, lists only the area, and a
link to a doc that belongs to another area leads into that area. `/de/` and
`/en/` are the entrance with one card per area; on every page the title at
the top left opens a menu with the other area (and the start page of the
current one).

The background differs by area (`src/client/backdrop.js`): bits and bytes
for computer science; for data science small, pale charts in the margins and
data frames that run through dplyr verbs (`filter()`, `select()`,
`arrange()`, `mutate()`, `group_by()` and `summarize()`), each verb written
above the frame while it acts. Progress is kept per browser, not per area, since
items have one id everywhere.

## Addresses: every view can be linked

What a page shows is in its address, so a view can be bookmarked, sent as a
link, and found again with "back". Pages update their address while
someone filters or switches, without adding history entries.

| Address | Shows |
|---|---|
| `/cs/de/items/?type=lesson&topic=…&level=1&path=…&project=…&course=…&progress=open&q=…` | the content list filtered; every filter is optional |
| `…&sort=duration`, `…&group=topic` (or `level`, `none`) | order and grouping (defaults: title, type) |
| `…?view=cards` (also on `/de/projects/`) | cards instead of rows, for this visit; the stored preference otherwise |
| `/cs/de/map/?topic=processing-information` | the map with one topic highlighted |
| `/cs/de/items/<quiz>/?question=3` (or `=result`) | a quiz at its third question, or at its result |
| `/cs/de/learning/?code=LICHT-26` | adds the course with this access code and opens it; the code is read without case, spaces or hyphens |

**Back to where you came from.** Every page but the start page has a "back
to …" link. The build fills in a default (an item leads back to the content
list, a path to the paths, a course to My learning). In the browser,
`client/site.js` replaces it with the page the learner actually came from,
read from `document.referrer`, and names it: the filtered list, a path or
course by its title, the map. If the page before in this tab was exactly that
one, the link uses the browser history, which also restores the scroll
position. The origin survives a switch of language, because it is kept per
tab in session storage.

## Hosting and address

Any static host will do; GitHub Pages (like the book sites) or the Uberspace
of Classroom Live are candidates. The address is open; `cs.`, `book.` and
`ai.hands-on-computer-science.de` are already taken by the book sites. Nothing
is published before Nicolas says so explicitly.
