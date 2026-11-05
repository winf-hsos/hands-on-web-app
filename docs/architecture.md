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
- **modules** (courses in the knowledge base) listed for everyone, and **learning paths**;
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
an import map; there is no bundler. Every asset carries a version, a hash of
its content (`?v=…`), and so does every import of one browser module by
another: the build writes `from './focus.js?v=…'` into the copy under
`assets/`. The site's files are cached for ten minutes, and without the
version in the import a new module could run with an old one it imports
(Nicolas saw that happen on 2026-11-02).

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
- **Courses** are called modules on the site and listed under "Module" at
  `/<area>/<lang>/modules/`; old `/courses/` addresses forward there. A module
  page shows its sections: learning paths with their own parts, projects with
  their phases, and loose sections of items. The access
  code on "My learning", or a link with it, adds a course there.
- **Folding** (`src/client/fold.js`): the sections of a module and the parts
  of a path fold, on the path page and inside a module alike. On a first
  visit they start closed, so that the page shows its outline, except the part
  of a path or project that has only one (Nicolas, 2026-11-02). The browser
  keeps the keys of the ones a learner closed (`hocs-folded`) or opened
  (`hocs-opened`) in local storage; a key names the path, part or section
  (`path:<id>:<part>`), not the page, so a part opened on the path page is
  open in every module that shows the path.
- **Projects** show their phases as a numbered, folded list that starts
  closed like the sections of a module (Nicolas, 2026-11-02); a phase opens to
  its challenge and the content linked to it. A link to a phase such as
  `#vectors`, or to anything inside one, opens exactly that part
  (`src/client/project.js`).
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
  continuous run. A program that imports `lifi_hardware` runs against a simulated
  LED in the same worker: `time.sleep()` moves a clock instead of waiting, and
  `src/client/led-view.js` plays the recorded colours back in real time. `src/client/highlight.js` highlights Python and R both at
  build time and while editing.
- **R** runs in the browser with webR (R compiled to WebAssembly), served
  from `/assets/vendor/webr-<version>/` and started on the first click
  (`src/client/r-engine.js`). It installs dplyr from a small package
  repository of our own under `/assets/vendor/webr-repo/` (dplyr, tibble,
  ggplot2 and their dependencies, about 20 MB), which `npm run
  fetch-r-packages` fetches once from the webR repository; nothing is loaded
  from elsewhere while someone learns. Every run gets a fresh environment, so
  the code boxes do not depend on each other. Data sets and ggplot2 come only
  when a block needs them: a block that names `survey` or `rewe` gets that
  table from `knowledge/media/datasets/` (the list is `DATASETS` in
  `r-engine.js`), and a block that draws loads ggplot2, whose plots come back
  as images. Stop ends webR, the next Run starts it again.
- **Embeddings** run in the browser with transformers.js and its ONNX
  runtime, served from `/assets/vendor/transformers-<version>/`, and the
  model all-MiniLM-L6-v2 (8 bits, about 23 MB) from `/assets/vendor/models/`,
  which `npm run fetch-embedding-model` fetches once from Hugging Face into
  `vendor/models/` (not in git, cached in the publish workflow). Only the map
  of meaning (` ```meaning-map `, `src/client/meaning-map.js`) loads them, on
  a click, about 50 MB the first time; nothing typed leaves the browser.
  `scripts/meaning-data.mjs` writes the cards, their numbers for R and the
  printable cards with the same model.
- **The dplyr demonstrator** (` ```verb-demo `, `src/client/verb-demo.js`)
  computes the verbs itself in JavaScript on six rows of the survey and
  animates the change; it needs no R.
- **The game with three doors** (` ```monty-hall `, `src/client/monty-hall.js`)
  plays the Monty Hall problem on the page and writes every round down as R
  vectors with the columns of `lets_make_a_deal.csv`, to be copied into an R
  box. The rounds are kept in local storage, so a reload or a switch of
  language keeps them. A project page loads the runner and the demonstrators
  when its phases contain them, just as an item page does.
- **R editors suggest names while typing** (`src/client/r-complete.js`): the
  columns of the table a pipe works on, names assigned in the block, the data
  sets the page uses and functions, after two letters, after `table$` or with
  Ctrl+Space. `src/client/r-context.js` decides what fits at the cursor
  without running R, so the suggestions are there before the first Run. The
  build writes `/assets/r-completions.json` (`src/build/r-completions.mjs`):
  the columns and types of every data set in `src/client/r-datasets.js`, and
  the functions of `src/build/r-functions.json`, a hand-picked list for
  base R, dplyr and ggplot2 whose signatures `scripts/r-functions.R` takes
  from R. The same file holds constants (`pi`, `LETTERS`, `month.name`, …)
  with their type and first values, and the words of the language that stand
  for a value (`TRUE`, `NA`, `NULL`, `Inf`, …), which have no package; they
  are offered everywhere, after columns, names and tables and before
  functions. dplyr and ggplot2 are suggested only on pages whose code uses them.
  Each function shows its package in braces, as RStudio and Positron do,
  found the way R's search path finds it: `sd()` is `{stats}`, and
  `starts_with()` is `{dplyr}`, which exports it. After `package::` the list
  holds every function of that package, on any page, so `dplyr::` shows all
  of dplyr and `stats::` shows `sd()` but not `mean()`, which is in base;
  a longer list scrolls.
- **The folder tree and command line** (` ```shell-demo `) is two modules:
  `src/client/shell-model.js` holds a small file system in memory and a
  shell that runs the commands of PowerShell and zsh on it, works out the
  way of a path being typed and completes names; it touches no page, so
  `tests/shell-model.test.mjs` runs it and the build uses it to check a
  scenario. `src/client/shell-demo.js` draws the tree and the terminal and
  moves rows by their node, so a moved file glides to its new place.
- **Every code block has a copy button** (`src/client/copy.js`) in its upper
  right corner. A runnable block copies what is in its editor at that moment,
  changes included; any other block copies its text.
- **What learners write is kept per page** (`src/client/saved.js`): changed
  code in `hocs-code`, keyed by a fingerprint of the box's original code and
  its count on the page, and entries of result tables in `hocs-tables`
  (`src/client/tables.js`; the build turns empty table cells into inputs in
  `fillableTables()` of `remark-knowledge.mjs`). Both are local storage
  under the page's path without `/drafts`. They stay in the browser and are
  not part of the progress link, which would grow with every line of code.
- **Focus mode** (`src/client/focus.js`): `focusable(box, bar)` gives a code
  box, a result table or the questions of a quiz a button that shows them
  alone and enlarged in full screen, for a projector. The button is a small
  symbol without text in the element's header row, named in its tooltip
  (Nicolas, 2026-11-04): in the bar of a code box, below a table, and in a
  quiz of several questions at the end of the row with Back, the position
  and Next. Unlike the full screen
  of a demonstrator (`demo-frame.js`), it scales code boxes and tables by
  width only; a quiz passes `height()`, which measures its question fully
  opened, and a code box one that measures its code with a fixed room for
  the output, so both fit the screen in both directions. A quiz also passes
  `steady()`, its bar with Back, the position and Next, which keeps the size
  and width of the first fit for as long as the focus lasts, so that its
  buttons do not move from question to question; only the question below it
  is fitted anew (Nicolas, 2026-11-05). In focus the bar also saves room:
  Back and Next become thin arrows without a frame, in one row with a bar of
  thin segments and the position; their words stay for screen readers and
  as tooltips. Tables scale by the
  width of their columns only. Full screen draws nothing outside the box, so
  the suggestions of a code box (`complete.js`) move into it while it is in
  focus and grow with the code.
- **Presenting code boxes** (`src/client/present.js`, Nicolas, 2026-11-04):
  code boxes do not use `focusable()` but `presentable(box, bar, height)`.
  Their button puts the box on a stage that covers the page (and goes full
  screen where the browser grants it) together with copies of the heading of
  its section and of the paragraph or list right above it, in a column of
  800 px scaled once to the width of the screen, the same for every box and
  every heading level, so that nothing changes size from box to box or when
  code runs; what is taller than the screen scrolls, with the scrollbar's
  room kept from the start (Nicolas, 2026-11-05). The arrow keys outside the editor, Page
  Up and Page Down (as presentation clickers send them) and two small
  buttons in the corner go to the previous or next code box of the page; F
  or Escape leave, and the page is left at the box shown last. The box itself
  is moved onto the stage and back, so what was typed and run stays with it.
- **Embedded slide decks** (`src/client/deck-frame.js`): the button
  "Vollbild" puts the deck's iframe into full screen and hands it the
  keyboard focus, and while a deck fills the screen the page passes every key
  but Escape on to it, so the arrows turn the slides without a click first.
  A click anywhere in the middle of a slide turns it too (`stagekit.next()`);
  stagekit itself turns only at the outer fifths, which suits a presenter.
  Links, buttons, selected text and the click that closes a code window do
  not turn.

## Areas

One app and one knowledge base serve several **areas** (decision of Nicolas,
2026-10-27): Hands-on Computer Science under `/cs/` and Hands-on Data Science
under `/ds/`. Each area is a part of the site of its own, with its start page,
lists, map, search index and "My learning", and its own accent colour (blue
for computer science, pink for data science), set on `<html data-area>` in
`site.css`. The icon in the browser tab takes the same colour
(`public/favicon.svg` for computer science, `favicon-ai.svg` and
`favicon-ds.svg` for the others, chosen in `layout.mjs`; Nicolas,
2026-11-05). The build makes one site model per area (`createSite(knowledge,
area)`): lookups cover the whole knowledge base, lists only the area, and a
link to a doc that belongs to another area leads into that area. `/de/` and
`/en/` are the entrance with one card per area and below them the content
of all areas, with the same search and filters as an area's content page;
each row carries the colour of its area, half and half for an item in two
(`createSite(knowledge, null)` spans all areas). On every page the title at
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
