---
title: Knowledge base schema
status: approved by Nicolas, 2026-10-21
date: 2026-10-21
---

# Knowledge base schema

The knowledge base in `knowledge/` is the single source for everything the
platform shows. The website is only a view of it, and a learning agent will
later read the same files directly. Two requirements follow from that and shape
every decision below: a person must be able to read and edit each file in an
ordinary editor, and a program must be able to check it without guessing.

Decisions that are still open are collected at the end under
[Open decisions](#open-decisions), numbered so they can be answered by number.

## 1. Overview

```
knowledge/
  README.md              how the knowledge base is organised (short)
  vocabulary.yaml        content types, relation types, levels, topics, areas, modules
  content/
    place-value-systems/ one folder per content item, named by its id
      de.md              lead file: shared metadata + German text
      en.md              translation: English title, summary and text
      media/             images and other files used by this item only
      figures.js         drawings drawn with stagekit's draw.js (docs/figures.md)
  paths/
    the-command-line/    learning paths, same pattern as content items
      de.md
      en.md
  courses/
    digitalisation-and-programming/   curated collections per module, without a semester
      de.md
      en.md
  projects/
    lifi/                projects in phases and challenges
      de.md
      en.md
  pages/
    home/                text of the start page (kind: page)
      de.md
      en.md
```

Everything that gets its own page on the site follows the same pattern: a
folder named after a stable id, with one Markdown file per language. One
pattern for content, paths and courses means one set of rules to learn and one
validator to write.

## 2. Ids and short codes

Every content item, path and course has two identifiers.

| | `id` | `code` |
|---|---|---|
| Example | `place-value-systems` | `4821` |
| Form | English kebab case, equal to the folder name | four digits |
| Used for | file system, relations, progress records, URLs | slides, live search, saying it aloud in a lecture |
| Stability | never changes once published | never changes, never reused |

The id is not stored in the front matter, because the folder name already is
the id and a second copy could drift from it. The short code is stored in the
lead file. Four digits allow 9,000 codes (1000–9999), are easy to type on a
phone and are unmistakable in a search box, where typing `4821` jumps straight
to the item. Codes are assigned at random by a small tool, so that they imply
no order, and the validator rejects duplicates.

## 3. Two languages: lead file and translation

Each item has a **lead file** and usually a **translation**. The lead file
carries all language-independent metadata (type, code, relations, level,
duration, topics) together with the text in its language. The translation
carries only what differs between languages: title, summary and text.

```yaml
# en.md, a translation
---
title: A code is an agreement
summary: Why the same bits can mean a letter, a colour or a sound …
translation_of: de
based_on: 2026-10-21     # the lead file's `updated` this translation follows
---
```

The rule that identifies the lead is simple: **the file without
`translation_of` is the lead**, and each folder has exactly one. The lead language can therefore
differ from item to item; an item first written in English simply has its
metadata in `en.md`.

Why not duplicate the metadata in both files? Because two copies of the
relations would be two tables that can drift apart, and nothing would notice.
Why not both languages in one file? Because a lesson would then be twice as
long to read and edit, and a learning agent would read every text twice.

**Missing or stale translations are visible, not hidden.** If `en.md` does not
exist, the English page says that the item is only available in German and
offers it, instead of silently switching language. If the lead's `updated` is
newer than the translation's `based_on`, the build reports the translation as
possibly outdated, and the page can show a note.

## 4. Front matter of a content item

Lead file, all fields:

```yaml
---
type: lesson                       # required, see vocabulary.yaml; several as [lesson, slides]
code: 4821                         # required, four digits
title: Ein Code ist eine Vereinbarung       # required
summary: >-                        # required, one or two sentences, plain text
  Warum dieselben Bits ein Buchstabe, eine Farbe oder ein Ton sein können …
objectives:                        # expected, in every language, see below
  intro: "In dieser Lektion lernst du, warum ein Code eine Vereinbarung ist, und kannst danach:"
  goals:
    - "erklären, warum dieselben Bits Verschiedenes bedeuten können"
    - "einen eigenen Code vereinbaren und anwenden"
level: 1                           # required, 1–4, see vocabulary.yaml
duration: 20                       # required, minutes of focused work (not for a challenge)
topics: [representing-information] # required, at least one, see vocabulary.yaml
modules: [dup]                     # optional, modules this item is written for
relations:                         # optional, see section 5
  requires: [number-systems]
  see_also: [binary-numbers]
access: public                     # optional, public (default) or code, see open decision 7
project: lifi                      # optional, the one project this item belongs to, see section 9a
status: draft                      # required, draft, published or archived
updated: 2026-10-21                # required, date of the last substantive change
---
```

**Code in a title** (Nicolas, 2026-11-02). A title may set a name from code
in backticks, as `` title: "Das Kursmodul `lifi_hardware`" ``, where only the
name is code and the rest of the title stays text. Headings, rows and `[[links]]`
show it in code font; the browser tab, the search and other plain text show
it without the backticks (`inlineCode` and `plainText` in
`src/build/html.mjs`).

**What you learn** (Nicolas, 2026-11-01). Every item says what a learner takes
away from it: `objectives` holds one sentence that leads into a list (`intro`,
ending in a colon) and three to five concrete, checkable goals (`goals`),
each continuing that sentence. They stand in every language file, since they
are text, and the page shows them right after the summary, before a deck, a
dataset or the text, in a box of their own titled "Was du lernst" / "What you
will learn". The box is folded until opened and is not part of the table of
contents, because it guides into the content rather than belonging to it
(Nicolas, 2026-11-02). The
text itself therefore starts without a heading such as "Worum es geht"; the
first paragraphs are the way into the topic. An item without `objectives` is a
warning, not an error, so that a new draft can be saved first; an item of type
`info` may leave them out without a warning. A quiz never shows the box,
since its questions already say what it checks (Nicolas, 2026-11-02), and it
needs no `objectives`.

**Several types** (Nicolas, 2026-11-02). An item may have more than one
type, written as a list: `type: [lesson, slides]`. The item is found under
each of them in the list of items, its rows and its page name all of them
("Lektion · Folien"), and it takes the icon, the group in the list and the
type-specific fields of the first. The slides to a concept always carry the
article on that concept, so such an item is `[lesson, slides]`: the page shows
what you learn, then the deck, then the article (section 8a). In the editor
the types are boxes to tick, and the first one ticked stays first.

Type-specific fields:

| Type | Extra fields |
|---|---|
| `demo` | `url` if the demo runs elsewhere; otherwise its files sit in `media/` |
| `tool` | `url`, `license` (of the tool) |
| `source`, `paper` | `authors`, `year`, `url` or `doi`, `publisher` or `venue`, `isbn`, `buy` (a page where the book can be bought) |
| `story` | `when` (year or span, free text such as `1838` or `um 1840`) |
| `person` | `born`, and `died` where it applies, as years |
| `slides` | a stagekit deck in the folder `slides/` (one `.html` file, optionally `export/<deck>.pdf`); `deck_lang` if the slides are in one language only; `recordings` later, as `{ title, url, slide }` with YouTube links per part. The subtitle of the title slide is the author's name only, `data-subtitle="prof. dr. nicolas meseth"`, without the area, module or anything else (Nicolas, 2026-11-01) |
| `dataset` | `file`, the name of a CSV in `media/datasets/`; `authors`, `year`, `license` where known. The page offers the file for download with its rows, columns and size, measured when building, and the lines that load it in R and in Python; the body describes the data. Only a dataset has a `file` |
| `video` | `url`, a YouTube link, and `start`, the second to begin at. The page shows the video in a frame, but loads nothing from YouTube until the learner presses play; then the player comes from youtube-nocookie.com (Nicolas, 2026-11-02) |
| `quiz` | none; the questions are in the body, see section 7 |
| `challenge` | no `duration`; the task of one phase of a project, see section 9a |
| `info` | none; a page that tells what to know or set up, such as the software for a project, without introducing a concept. A concept is a `lesson` (Nicolas, 2026-11-02) |

Fields deliberately **not** in an item:

- **Order.** Which item comes after which belongs to a course or path, not to
  the item. The same item can then sit at different places in several courses.
- **Release dates.** There are none: all content is always available, also
  inside a course (decision of Nicolas, 2026-10-26).
- **"Optional".** An item is only optional with respect to a path or a course,
  so it is marked at the step there (`optional: true`), never at the item.
  An item-level field existed until 2026-10-22 and was removed on Nicolas'
  remark that it makes no sense outside such a context.
- **Names of people.** Authors of sources are fine, people from teaching
  records never (see `_regeln/datenschutz.md` in the steering folder).

## 5. Relations

Relations are typed. Each is written **once, at the item that knows about
it**, and the build computes the reverse direction, so that a lesson shows both
what you should have seen before and what builds on it.

| Field | Meaning (stored at A, pointing to B) | Shown at B as |
|---|---|---|
| `requires` | A assumes B; read B first | builds on this |
| `deepens` | A goes further into what B introduces | deepened by |
| `example_of` | A is a worked example or instance of B | examples |
| `part_of` | A is a component of the larger B | parts |
| `checks` | A (usually a quiz) tests understanding of B | test yourself |
| `see_also` | loosely related, symmetric | see also |

`checks` is a proposal beyond the list in the concept (open decision 3). All
relation types are defined in `vocabulary.yaml` with labels in both languages,
so new ones need no code change. The validator rejects relations to ids that
do not exist and cycles in `requires`, since a cycle there would mean that no
item can be read first.

## 6. Body text

The body is plain Markdown with a few conventions:

- **Language** (decisions of Nicolas): the German texts address the reader
  as *du*. Thoughts that belong together stand in one connected sentence,
  not in a chain of short sentences for effect. German texts avoid the weak
  verb *tun* ("Fast alles, was du in R tust, tust du mit …") and name what
  happens instead: *bewirken*, *verwenden*, *arbeiten*, *sich kümmern*.
- **Licence** (Nicolas, 2026-10-23): the content of the site is under
  [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), as on
  basiswissen-ki.de, and the footer of every page says so. Material by others,
  such as a dataset or a quoted source, keeps its own licence, which goes
  into its `license` field.
- **Names of functions and packages are code** (Nicolas, 2026-10-30),
  everywhere on the site: in titles, summaries, goals and the body. The build
  does this by itself on every page (`src/build/code-terms.mjs`): a call
  without arguments such as `select()`, `dplyr::filter()` or `df.query()`
  and every package named in `PACKAGES` in `src/client/code-terms.js` is set
  in the code font, also in "dplyr-Verben". A new package the content talks
  about goes into that list. Anything else that is code, such as a call with
  arguments or an operator, is written in backticks; in the front matter,
  backticks work the same way (``title: Die Pipe `|>` ``), and the tab title
  and the description drop them.
- **Headings start at `##`.** The title comes from the front matter.
- **Sections** are `##` headings, subsections `###`. Each gets an id from its
  text (`## Die LED` → `#die-led`), so that it can be linked. An item with
  three or more sections shows a table of contents in the left margin on
  wide screens, which travels along and marks the section being read
  (Nicolas, 2026-11-02); quizzes have none.
- **Links to other items** are written as `[[place-value-systems]]` or with
  their own text as `[[place-value-systems|the lesson on place values]]`. The build
  turns them into links in the current language, and the validator checks them.
  Inside the knowledge base this form stays readable and survives renaming of
  URLs; a normal Markdown link would hard-wire a URL.
- **Images** are relative paths into the item's `media/` folder,
  `![Alt text](media/codebook.svg)`. Text inside images should be avoided or
  kept language-neutral; otherwise there is one image per language
  (`codebook.de.svg`, `codebook.en.svg`). The build copies the folder next
  to the item's page, in every area and language and on the drafts site.
  A photo with a title, `![Alt text](media/front.jpg "Caption")`, alone in
  its paragraph shows with its caption below; several such photos in one
  paragraph stand side by side. Every photo shows as 16:9 and fills its
  column (Nicolas, 2026-11-02), so a photo in another format is cut to 16:9
  before it goes into `media/`, with what matters in the middle. A drawing
  (`.svg`) fills the column too but keeps its own height, so a wide flat one
  does not stand in empty space. Every picture, photo or drawing, with or
  without a caption, sits in the frame of the page's own drawings: a thin
  line, room inside and round corners (Nicolas, 2026-11-02).
- **3D models** are STL files in `media/`:
  `![What it shows](model:media/case.stl "Caption")`. The page shows them in
  a small viewer of its own (`src/client/model.js`, plain WebGL, loaded only
  when the model comes near the screen): dragging turns the model, two
  fingers or, after a click, the mouse wheel zoom it, a double click resets
  it. Several models in one paragraph stand side by side. Link the file as
  well, for downloading. The validator checks that every `model:` path is an
  STL file that exists.
- **Drawings** (diagrams, schemas, processes that play in steps) are code,
  not images: `![What it shows](figure:name "Caption")` shows a drawing that
  the item's `figures.js` registers. It is drawn on the page in the colours
  of the area, light or dark, and in both languages from one source, and a
  slide deck can reuse it. Rules and parts in `docs/figures.md`.
- **Callouts** use the blockquote form known from GitHub:
  `> [!TIP]`, `> [!NOTE]`, `> [!WARNING]`. They render as boxes and remain
  readable as plain text. Every callout's title stands in capitals after an
  icon of its kind (Nicolas, 2026-11-02): "HINWEIS" (info), "TIPP" (light
  bulb), "WICHTIG" (circle), "ACHTUNG" (warning sign), "VORSICHT" (octagon),
  "TIPP ANZEIGEN" (light bulb), "LÖSUNG ANZEIGEN" (tick). Warnings are not
  red, which marks errors. `> [!HINT]` and `> [!SOLUTION]` render folded, so
  that a learner opens them only when needed; several hints in one text are
  numbered.
- **Python code** in a ` ```python ` block becomes a small editor on the page
  that runs the code in the browser (Pyodide, Python as WebAssembly, loaded on
  the first click). `input()` is answered in a field below the output. A
  fragment that cannot run on its own is marked ` ```python static `, and
  ` ```text ` shows a sample run as it is. Names in code are English in both
  languages; what a program prints follows the language of the text.
- **Code as a file** (Nicolas, 2026-11-03): a block that is not run can name
  the file it belongs in, as in ` ```python static file=task_1_light_on.py `.
  The page then shows the name above the block with a button that saves the
  code under that name, next to the copy button. Sample solutions use it, so
  that learners can copy a solution or download it as the file it replaces.
- **What a learner writes stays** (Nicolas, 2026-11-01): a changed code box
  keeps its code in this browser until its "Zurücksetzen" button, across
  reloads and visits. The entry belongs to the box's original code, so when
  an author changes a box, learners see the new version and their old edit
  is no longer offered.
- **Result tables can be filled in.** Every empty body cell of a Markdown
  table becomes a small input field, so a table for measurements is written
  with empty cells where the values go. The entries are kept in this browser
  like the code, and a button below the table clears them after asking.
  Enter moves to the cell below.
- **Code boxes, result tables and quizzes have a focus mode** for presenting
  and working on them together in class (Nicolas, 2026-11-01). A button
  „Fokus“ (`F` while the element has the focus, `Esc` leaves) shows the
  element alone in full screen, its parts keeping the width they had on the
  page and scaled up with CSS `zoom` to the width of the screen, at most two
  and a half times; a table is scaled by the width of its columns. The view
  starts at the top and scrolls, so that nothing moves when an output opens.
  A quiz fits the height as well (Nicolas, 2026-11-02): the question on show
  is measured with its verdict, every reason and its explanation open, so
  that all of it stays on the screen after the answer and nothing changes
  size while it is answered; the next question is measured anew. A code box
  fits the height too: its code, the bar and a fixed room of eight lines for
  the output, in which longer output scrolls and shows its newest line. Its
  size follows the code when it is run, reset or left, not with every key. Where a browser has no full screen for elements, the
  same view opens as a layer over the page. The code is `client/focus.js`,
  used by `runner.js`, `tables.js` and `quiz.js`.
- **R code** in a ` ```r ` block works the same way with webR; ` ```r static `
  only shows it. Each block runs on its own, with dplyr loaded and the data
  sets `survey` (`media/datasets/milk_survey.csv`), `rewe`
  (`media/datasets/rewe_products.csv`) and `monty_hall`
  (`media/datasets/lets_make_a_deal.csv`, a plain `data.frame`, since the
  Monty Hall project teaches base R) ready; a block that names a file, as in
  `read.csv("lets_make_a_deal.csv")`, finds it in its working directory. A
  block that uses `ggplot()` shows the plot below the code. This holds in
  project phases and challenges as well as in items. A runnable block
  has one command that prints something, so that each output stands next to
  the code it came from; a second example gets its own block with a sentence
  between them. Only short calculations such as `3 + 4` may share a block.
  A plot is built as Nicolas teaches it: the data piped into `ggplot()`, and
  every layer, `aes()` included, added on its own line with `+`
  (`rewe |>`, `ggplot() +`, `aes(x = …) +`, `geom_…()`), never
  `ggplot(rewe, aes(…))`. A starter block for a plot task already holds
  this frame with an empty `aes()`.
- **Data sets** lie in `media/datasets/` as CSV. `milk_survey.csv` is a
  30-row excerpt of the survey on milk and milk alternatives by U. Enneking,
  with English column names, made by `scripts/survey-excerpt.py` from the
  full data, which do not go into the repository. `mds12_schoko_milch.csv` is
  the part of the survey he agreed to publish for download (all respondents,
  the main study and the studies on chocolate and milk), made by
  `scripts/survey-download.py` without the postcode and without open answers;
  the item `milk-chocolate-survey` describes it. He agreed to both on
  2026-10-27; anything beyond them needs his consent again.
  `rewe_products.csv` holds products from the REWE online shop, taken by
  `scripts/rewe-excerpt.py` from Nicolas' repository
  github.com/winf-hsos/data-analytics-code with fewer columns and snake_case
  names; the item `rewe-products` describes it. `lets_make_a_deal.csv` holds
  100 games of the Monty Hall problem from the same repository
  (`data/monty_hall_problem`, there separated by semicolons); the item
  `lets-make-a-deal` describes it.
- **The dplyr demonstrator** is placed with an empty ` ```verb-demo ` block,
  **the game with three doors** with an empty ` ```monty-hall ` block. The
  game records every round in a bar per decision (how often staying and
  switching won), shows the rounds as R vectors to copy on request, and the
  doors swing open in place.
  **The byte switchboard** is placed with an empty ` ```byte-switchboard `
  block: eight switches with their place values, and the byte as binary,
  decimal, hexadecimal and text, with counting up and down that shows the
  carry and the overflow. Decimal, hex and text can be typed in: a click
  opens the value for editing, every valid keystroke sets the byte, a value
  that cannot be one (300, G, ä) is marked and explained, Enter keeps it and
  Escape goes back. It is the first of the LiFi demonstrators to come
  over, rebuilt in the design of the platform rather than embedded.
  **The photo digitiser** (` ```photo-digitiser `) and **the audio
  digitiser** (` ```audio-digitiser `), both empty blocks, came over from the
  LiFi demonstrators the same way (2026-11-03) and show the two cuts of
  digitising. The photo digitiser puts a photo beside its digital version,
  with a slider for the resolution (256 × 256 points down to one) and a
  button per colour depth (24, 16 and 8 bits of colour, 256 greys, the 16
  EGA colours, four greys, black and white); pointing at a pixel shows its
  bits and marks its cell on both pictures. The audio digitiser draws a
  window of 25 ms of a sound with its digital staircase over it, with a
  slider for the sampling rate (48 kHz down to 250 Hz) and a button per bit
  depth (16 bits down to 1), and plays the original and the digital version.
  Under both, the file size is worked out as points (or samples) times bits
  and turned into the time a light link of 30 bits per second needs for it.
  Their media lie in `media/photos/` (three photos, AI-generated with
  gpt-image-2) and `media/audio/` (`voice.wav`, an AI-generated voice from
  OpenAI TTS, 48 kHz 16-bit mono); the other four sounds are made in code.
  Both credits stand in a note under the demonstrator.
- **The folder tree and command line** (Nicolas, 2026-11-02) is placed with a
  ` ```shell-demo ` block that holds its scenario in YAML, so a lesson can
  bring its own tree; it may stand in any text, not only on a demo page:

  ````markdown
  ```shell-demo
  start: ~/Documents      # optional; where the terminal starts, from home or absolute
  tree:                   # what lies in the home folder (C:\Users\anna, /Users/anna)
    Documents:
      uni:
        notizen.txt: "Zwei Ideen\n"   # a file with its text (cat shows it)
    Meine Fotos: {}                   # a folder, here an empty one
  ```
  ````

  A mapping is a folder, a text a file; a `.py` file whose lines are
  `print("…")` with fixed text runs with `python`. The build checks names and
  `start`. The terminal speaks PowerShell or zsh, switchable, with the
  commands of the path „Die Kommandozeile“ (`cd`, `ls`, `pwd`, `mkdir`,
  `New-Item`/`touch`, `cp`, `mv`, `rm`, `rmdir`, `cat`, `echo … >`,
  `python`/`python3`, `clear`) and the first line of each real message,
  in English, as the lessons quote them (Nicolas, 2026-11-02). While a path
  is typed, the tree shows the way it takes and where it breaks, and a line
  below says it in words; a click on a folder writes the `cd` that leads there. „Vorhersagen“
  holds every result back until a second Enter, for guessing in class.
- **Nothing in a demonstrator moves while it is used** (Nicolas,
  2026-10-31): every part that changes (a status line, buttons that come and
  go, a result) has a place of a fixed size from the start, with room for
  its longest form at every width, and buttons that are not needed are only
  hidden (`visibility`), never removed from the layout. Only what the
  learner opens on request, such as a code block, may make the demonstrator
  taller, and then below everything else.
- **A demo page is short** (Nicolas, 2026-10-31): above the demonstrator a
  paragraph on its goal (**Ziel:** / **Goal:**) and one on how to use it
  (**Bedienung:** / **How to use:**), then the demonstrator, and nothing
  after it, no questions to try and no explanation; that belongs in the
  lessons the demo is related to. The build warns about text after the
  demonstrator block.
- **Every demonstrator has a full-screen mode and shows its shortcuts**, so
  that it can be shown on a projector in class (Nicolas, 2026-10-31). The
  build puts each demonstrator block into a frame (`<div class="demo"
  data-demo>`), and `client/demo-frame.js` adds two buttons above it,
  „Tastenkürzel“ and „Vollbild“. The keys are the usual ones: `?` opens and
  closes the list of shortcuts, `F` switches full screen, `Esc` closes. A
  demonstrator adds its own keys with `keys(box, list, handle)` from
  `demo-frame.js`: `list` holds the rows of the overview (`['1 – 8', label]`),
  `handle(key)` returns true for the keys it used. Keys work while the focus
  is in the frame, which a click anywhere in it gives, so the page still
  scrolls with the arrow keys elsewhere. Every demonstrator should have keys
  for its main actions. In full screen the demonstrator keeps the width it
  had on the page and is scaled up with CSS `zoom` (at most three times), so
  its layout stays the same, only larger. Where a browser has no full screen
  for elements or refuses it, the same view opens as a layer over the page;
  Escape leaves both. A new demonstrator gets frame, buttons and full screen
  from its entry in `DEMOS` alone; only its own keys need `keys()`.
- **No embedded HTML and no embedded pages from elsewhere.** That keeps the
  rule from the concept that nothing on the site comes from anywhere but the
  knowledge base.

## 7. Quizzes

A quiz is a content item of type `quiz`. Its questions are written in the body,
in a form that reads like a printed worksheet:

```markdown
## Wie viele Positionen braucht ein Buchstabe bei vier Farben?

Das Alphabet hat 26 Buchstaben.

- [ ] Zwei
  > Mit zwei Positionen gibt es nur 4 × 4 = 16 Codewörter.
- [x] Drei
  > Drei Positionen ergeben 4 × 4 × 4 = 64 Codewörter.
- [ ] Vier
- [ ] Sechsundzwanzig

> Mit zwei Positionen gibt es nur 4 × 4 = 16 Codewörter, mit drei bereits 64.
```

Each `##` heading is a question, `[x]` marks the correct answer (several are
allowed for multiple-select), and the blockquote after the list is the
explanation shown after answering. A blockquote indented under an option is
the reason for that option; after answering, the page shows the reasons of the
options chosen and of the correct ones, so that a wrong choice is explained
where it was made. Question ids for progress are derived from the position
(`q1`, `q2`, …); if questions are reordered later, an explicit id can be added
as `## Frage {#q-positions}`.

On the page the options are lettered A, B, C … in the order written, in a
circle for one answer and a square for several (Nicolas, 2026-11-02), and
pressing a letter chooses that option of the question on show, as a click does
(`client/quiz.js`). The letters come from the page, not from the Markdown, so
reordering the options needs no other change. The arrow keys move one question
back or on, and Enter moves on as well (Nicolas, 2026-11-02); on a
multiple-choice question with something chosen, Enter checks the answer first,
so that it is never skipped. A focused button or link keeps its own Enter, and
on an option Space chooses it.

This form is deliberately independent of the existing question pools, as the
concept requires. `scripts/convert-questions.mjs <pool-folder> <de|en> [id …]`
turns questions of a pool in the format of the skill multiple-choice-pruefung
into this form, with the pool's ids as explicit ids and its reasons as option
reasons, as a starting point that is then rewritten for the platform. It
refuses questions that are not public, since those belong to an exam.

Below every quiz the page offers it as two files to learn with elsewhere
(Nicolas, 2026-11-03), written next to the page by the build
(`src/build/quiz-export.mjs`): `<id>.csv` with one row per question, each
option followed by a 0/1 mark for correct and, where the quiz has them, its
reason, and the explanation last; and `<id>-anki.txt` for Anki's text import,
one card per question with the question and its options on the front and the
correct options with their reasons and the explanation on the back. The German
CSV is separated by semicolons and the English one by commas, as spreadsheets
in each language expect, and both begin with a byte order mark so that Excel
reads them as UTF-8. Since only public questions reach the knowledge base, no
exam question can end up in a download.

## 7a. Exercises

An exercise (type `exercise`) is a task in which the learner writes a program
themselves. Its body follows a fixed order of sections: `## Aufgabe` (task),
`## So soll es aussehen` (a sample run as a ` ```text ` block), `## Dein
Programm` (a runnable skeleton), then hints and a model solution as folded
callouts, and optionally `## Für Schnelle` (an extension). An exercise points
to the lessons it needs with `requires`.

```markdown
> [!HINT]
> `seconds // 3600` liefert die vollen Stunden.

> [!SOLUTION]
> ```python
> print(format_duration(7507))
> ```
```

Every exercise with Python or R boxes can be downloaded as a script with
comments (Nicolas, 2026-11-01), to run it in VS Code or Positron: the build
writes `<id>.py` or `<id>.R` next to the page in each language, and the page
offers it above the task (`src/build/exercise-script.mjs`). Task, sample run,
hints and extension become comments, headings become sections (`# Aufgabe ----`
in R), the code of the boxes becomes code, and the solution stays on the page.
Lines of setup that several boxes begin with appear once. An R script starts
by loading what the boxes get in the browser: dplyr, ggplot2 where it draws,
and every data set it names, read from the site. Only boxes that run on the
page count: an exercise whose code is all `static` gets no script.

**Slides with tasks to do along** are an exercise first (Nicolas, 2026-11-02):
`type: [exercise, slides]`, and the tasks the learners do along with the
deck stand below it as text, step by step with hints and solutions as
callouts, so they can be read and continued without the deck. `first-light`
is the first. Its learners write the code into files on their own computer
and run it in the terminal, so its blocks are `static` and the page offers
no script.

## 8. Learning paths

A path is a folder in `paths/` with the same lead/translation pattern. The
lead holds the structure; the translation holds title, summary, `goal`,
`audience` and the introductory text, since those are prose. The example in
`knowledge/paths/the-command-line/` shows both files.

```yaml
---
kind: path
code: 6378
title: Die Kommandozeile
summary: Dateien, Ordner und Pfade verstehen und den Rechner mit getippten Befehlen steuern.
goal: Du bewegst dich sicher durch den Ordnerbaum deines Rechners und startest ein Python-Programm in der Kommandozeile.
audience: Alle, die bisher nur mit Maus und Fenstern gearbeitet haben
level: 1
requires: []                 # ids of items or paths that should come first
steps:
  - files-and-folders
  - command-line
  - command-line-navigating
  - command-line-files
  - command-line-demo
  - command-line-exercise
  - python-on-the-command-line
  - command-line-quiz
  - item: python-virtual-environments
    optional: true
status: published
updated: 2026-11-02
---
```

Duration is not written down but computed from the steps, so it cannot be
wrong. A step is either an id or an object with `item` and `optional`.

A longer path can be divided into parts. Instead of `steps` it then has
`sections`, each with a title in both languages and its own steps; a path has
one or the other, never both. Steps are numbered through the whole path.

```yaml
sections:
  - title: { de: "Teil 1: Erste Programme", en: "Part 1: First programs" }
    steps:
      - python-first-program
      - python-values-and-variables
```

## 9. Courses (called modules on the site)

On the site a course is called a **module** (Nicolas, 2026-11-01): every label
says Modul/Module, the pages live under `/<area>/<lang>/modules/…`, and the
build writes a page at each old `/courses/…` address that forwards there. In
the knowledge base it stays a course (`courses/`, `kind: course`), because
`module:` already names the module of the module handbook it belongs to.

A course is a curated collection for one module, or a few. It names no
semester (Nicolas, 2026-11-01): the platform has no reference to a term, in
fields, ids or texts, so a module stays valid from one year to the next. All
courses are listed on the site under "Module" once they are published, and
opening one adds it to "My learning", which also makes it a filter in the
content list. Access codes are not used for now (Nicolas, 2026-11-01): the
home page leads to the list of courses instead of a field for a code, and a
link with a code from before, `/de/learning/?code=…`, still opens its course.

```yaml
---
kind: course
code: 3307                   # short code, like any page
access_code: LICHT-26        # optional, not used for now: courses are listed under Module (Nicolas, 2026-11-01)
module: dup                  # or a list, module: [ea, wmg]
formerly: [dup-2026-27-ws]   # optional: earlier ids, whose addresses lead here
institution: hs-osnabrueck      # from vocabulary.yaml, with name, address and logo
title: Digitalisierung und Programmierung
summary: Programmieren mit Python von den Grundideen an, dazu …
sections:
  - path: python-for-beginners  # a whole learning path as one section
  - title: { de: "Zahlen- und Codesysteme", en: "Number and code systems" }
    items:
      - code-as-agreement
      - prefix-free-code
      - item: knock-code
        optional: true
      - code-systems-quiz
  - project: lifi              # a project as one section
status: draft
updated: 2026-10-21
---
```

A course consists of **sections** (decision of Nicolas, 2026-10-26; until
then "units" named after sessions). A section is a title with its items, a
learning path given by `path:`, which brings its own title, parts and steps
and stays the same path that can be followed on its own, or a project given by
`project:` (Nicolas, 2026-11-01). A module thus consists of one or more paths
and possibly projects, and loose sections of items remain allowed. A project
section shows the project's summary and its phases, each linking into the
project page; it adds no steps to the progress of the course. Section
titles are short labels and therefore written in both languages inline; the
rule is that short labels in a structure may be bilingual in place, while
prose belongs in the language files. Sections have no release dates:
everything in a course is available from the start.

A course may have a `subtitle`, a short line under its title (in the lead and
in each translation), for example where it belongs in a larger module. Its
`sections` may be an empty list while the content is being written; the page
then says so. `institution` is optional. The course page shows one card per
module (Nicolas, 2026-10-30): the name of the module, the logo and name of the
institution, both linking to its website, and a link to the official module
description. With two or three modules the cards stand side by side and are
smaller. The address of a module description belongs to the module, not to
a course, and stands in `vocabulary.yaml`:
`ea: { de: Empirisches Arbeiten, en: Empirical Research, handbook: "https://…/44m0123/" }`;
a module without it gets a card without the link.

## 8a. Slides

A slides item is a stagekit deck, kept as it was built, in `slides/` next to
the item's `de.md` and `en.md`:

```
knowledge/content/problem-decomposition/
  de.md, en.md        title, summary and the article (type [lesson, slides])
  media/              the article's figures, rendered from the deck
  slides/
    index.html        the deck: the one .html file in the folder, named after
                      the deck's title in newer decks (cutting-the-lifi-project.html)
    deck.js, theme.css, img/
    export/<deck>.pdf the PDF from stagekit's export, offered for download
    skript.md         the script: the text to the slides, in their order
```

**The script belongs to the knowledge base but not to the site** (Nicolas,
2026-10-22). It is the text a learning assistant reads instead of the slides,
so every deck has one, and the build warns when it is missing; the website
never shows it, and the build does not publish any Markdown from a deck
folder. As stagekit requires, every change to a deck changes its script in
the same step.

Working material stays out of the site, and the first two out of git as well: the generator's
original photos in `img/original/` and the export's frames in `export/`
(only the PDF is kept). Decks are exported from the built site, where the
stagekit runtime sits next to them:
`python <stagekit>/tools/export.py dist/decks/<id>/<deck>.html --pdf --png --sheet --steps --fonts`.

The deck loads the stagekit runtime from `../../stagekit/`, as in the folders
where decks are made; the repository keeps that runtime in `vendor/stagekit/`
and the build publishes it next to the decks. The build fails if the deck or
any file it loads is missing, or if it loads anything from another site.
Links (`<a href="https://…">`) may point elsewhere, since a link is followed
and not loaded, and stagekit wants every address on a slide to be one.

The drawings of a deck can serve its lessons as well. `scripts/why-ten-figures.mjs`,
run after the build, renders the figures of the deck `why-ten` with stagekit's
`tools/figures.py` in the light palette, once per language, and copies each
into the `media/` folder of the lesson that uses it as `<name>.<lang>.svg`; a
change to a drawing in `deck.js` thus reaches the lesson by running it again.

**Slides to a concept carry its article** (Nicolas, 2026-11-02). Such an item
has the types `[lesson, slides]`, and its `de.md` and `en.md` hold, below
title and summary, the article on the concept, which the page shows after the
deck. `problem-decomposition` was the first, `input-processing-output-slides`
the second; there the code to run went into an exercise of its own,
`input-processing-output`, which requires the lesson, so the article shows code
only as `python static`. `analog-and-digital` was the third, made on
2026-11-03 from a lesson and a deck that had been two items: since then
(Nicolas) a lesson and its slides normally live in one item, **every figure
of the article also appears in the slides**, and the article may carry small
runnable code intermissions to try out right away between its explanations.
The article shows only figures
exported from its own deck, never drawings or pictures made apart from it:
`slides/figures.js` names the figures (`window.figures`), the deck's
`deck.js` writes its labels in both languages with `T(en, de)`, and
`scripts/deck-figures.mjs <id>`, run after the build, renders them with
stagekit's `tools/figures.py` in the light palette into `media/` as
`<name>.de.svg` and `<name>.en.svg`. Unlike photos, they are not 16:9 but
cropped to the drawing: a 16:9 frame left wide flat drawings in a lot of empty
space (Nicolas, 2026-11-02). `figures.js` wraps each drawing with `rand`, which
adds 16 px above and below, because some labels reach a few pixels above the
slide's viewBox; where the slide leaves room under a drawing, its second
argument trims the bottom so both margins match, a third one the top, and
figures.py then reports no empty edges. figures.py loads no `anim.js`, so an
animated drawing is a function with a `final` flag that draws the state its
last segment ends in, and names its parts through a local `g` that falls back
to plain SVG when `d.g` is missing (`input-processing-output-slides`).

## 9a. Projects

A project is a larger undertaking that learners carry out over weeks, such as
the LiFi project. It is divided into **phases**, shown like the parts of a
path (Nicolas, 2026-11-02): each phase folds, its folded state is remembered
together with the module page that shows the project, and its content is
numbered through the whole project. Each phase has one **challenge**, an item
of its own of type `challenge` that describes the task, and it comes first in
its phase; after it follows the content for that phase, which may be specific
to the project or shared with others. Content for the project as a whole is
listed at the end.

The lead file holds the structure, the text holds titles and prose. A `##`
heading with an id names a phase, such as `## Phase 2: Aus Farben werden
Buchstaben {#word}`; text below it is optional, since the challenge item
carries the description. Headings without an id are ordinary sections, such as
"What you need". The introduction before the first heading folds away below
the phases as "Über dieses Projekt", like "Über dieses Modul" on a module
page, so that the page opens with the summary and then the phases (Nicolas,
2026-11-02).

```yaml
---
kind: project
code: 4577
title: Das LiFi-Projekt
summary: …
level: 1
modules: [dup]
phases:
  - id: word
    challenge: lifi-challenge-2 # an item of type challenge
    items: [morse-code]        # optional: content for this phase
status: draft
updated: 2026-11-02
---

Introduction …

## Phase 2: Aus Farben werden Buchstaben {#word}

## Was ihr braucht
An ordinary section …
```

**Content of one project** (Nicolas, 2026-11-02). An item that only makes
sense inside one project, such as its challenges, its device, its software or
the way its challenges are accepted, names that project in `project:`. It then stays out of the
list of all items and off the map, is still found by search, and its page
leads back to the projects. The build checks that the project exists and
links the item, since otherwise nothing would lead to it. The LiFi project
holds such items at the start of phase 0: the device (`lifi-device`), the
software (`lifi-software`), the course module that talks to the device
(`lifi-hardware`), the team cockpit that shows the link live (`lifi-cockpit`) and the challenges (`lifi-challenges`, how a challenge is
accepted and what each one produces).

A challenge item has the usual fields of an item but no `duration`, since it
runs over weeks; its page shows the project and phase it belongs to. The build
checks that `challenge` names an item of type `challenge`.

The text of a challenge is structured by its tasks (Nicolas, 2026-11-03).
After the introduction (goal, what is new, an overview of the tasks) and any
setup the tasks share, each task has a section of its own, `## Aufgabe N: …`
(`## Task N: …`), always in this order: what to do, the file the solution is
written in (`**Datei:**`, also when there is none) followed by that file as
it stands in the template, with its `TODO`s, as a `file=` code block shown
open (Nicolas, 2026-11-03), hints as `> [!HINT]`, and
the sample solution as `> [!SOLUTION]` with a `file=` code block, as long as
one is published. Hints are numbered within their section. The acceptance
test, pitfalls and anything extra follow after the last task.

The older form writes challenges into the project text as `### … {#id}` below
their phase and lists them under `challenges:` with optional `items`; the page
shows them folded inside their phase. No project uses it any more since the
Monty Hall project moved to challenge items (2026-11-02), but the build and
the page still understand it. New projects use challenge items.

The build checks that phases and challenges in the front matter and the
headings with ids match, in order and in every language, so a phase can
neither be forgotten in one language nor linked to the wrong place. Each
phase can be linked directly as `…/projects/lifi/#word`, which opens it.

A project has **no topics** (Nicolas, 2026-11-01): topics sort the content
items, and a project is found through its module and the content it links.
An old `topics` line in a project is ignored with a warning.

A project has **no content for the whole project** (Nicolas, 2026-11-02): the
list "Dazu passend" below the phases is gone, and with it the field `items` at
the top of a project. Everything a project links belongs to one of its phases.

A project describes the content and is independent of a semester: dates,
assessment and bonus rules belong to the course, as in the separation of
`02 - Lehrinhalte` and `03 - Module pro Semester`.

## 10. Vocabulary

`knowledge/vocabulary.yaml` defines the closed lists with labels in both
languages: content types, relation types, levels, topics, institutions and
modules. An institution has a name in both languages, a `url` and a `logo`,
a file in `knowledge/media/`, the folder for files the whole knowledge base
shares; the build publishes it under `/media/` and fails if the logo is
missing. A logo in black only shows inverted to white in dark mode. Every
content type names an `icon` from Lucide (lucide.dev/icons), which the site
shows wherever an item appears; the build fails if the
icon does not exist. The
website builds its filters from it, so a new topic or type is one entry there
and no change to the code.

Levels, following basiswissen-ki.de:

| | de | en |
|---|---|---|
| 1 | Einstieg | Beginner |
| 2 | Grundlagen | Foundations |
| 3 | Fortgeschritten | Advanced |
| 4 | Vertiefung | Expert |

## 11. Progress records

The schema has to make progress possible without a server and usable later by
a learning agent. A progress record therefore refers to items by **id**, never
by URL or title, and contains only what the browser observed:

```json
{
  "v": 1,
  "items": {
    "code-as-agreement": { "seen": "2026-10-28", "done": "2026-10-28" },
    "code-systems-quiz": { "seen": "2026-10-28", "quiz": { "q1": 1, "q2": 0, "q3": 1 } }
  },
  "courses": ["digitalisation-and-programming"]
}
```

`seen` is set on the first visit, `done` when the learner marks the item as
done, or for a quiz automatically once every question was answered correctly.
Progress bars count `done`. Dates are days, not timestamps, because the time of
day would say more about a person than the record needs.

For transfer to another browser it is compressed and encoded, see
`docs/architecture.md`. Because ids never change, a record from the first
semester remains valid later.

## 12. Validation

The check runs in every build (`src/build/validate.mjs`, called by
`scripts/build.mjs`) in two stages, first each file on its own, then everything
across files, and fails the build on errors. `npm test` breaks each rule once on
purpose to make sure the check still catches it. The errors:

- every folder has exactly one lead file, and its required fields are present
  and well-formed; unknown fields are errors too, so that a misspelt field name
  does not go unnoticed;
- codes are unique and four digits;
- every relation, `[[link]]`, path step and course item points to an existing id;
- no cycle in `requires`;
- types, topics, modules and relation types exist in `vocabulary.yaml`;
- quiz questions have at least one correct answer.

Archived content (`status: archived`) is left out of the site but stays in
the knowledge base, so that its id and code remain reserved and learner
progress stays valid. Nothing that is not archived may point to it.

Drafts (`status: draft`) are not on the published site (Nicolas, 2026-10-30).
The build writes the site twice (`src/build/drafts.mjs`): once without drafts
and without whatever points to them (steps, course sections with a draft path
or project, relations,
requirements, project items, the featured path and samples of a start page;
a `[[link]]` to a draft keeps its text), and once in full under `/drafts/`,
marked "draft" in every list, with a strip on top and `noindex`. `?drafts` on
any address of the published site leads to the same page under `/drafts/`.
The pages with drafts are not secret, only not linked: whoever knows the
parameter sees them. To publish something, set `status: published`; a path
or course that is published shows only its published steps, and the build
warns about the drafts in it.

Warnings, which do not stop the build: missing translation, translation older
than its lead, `draft` items referenced by a published path or course.

## 13. Areas

`vocabulary.yaml` lists the areas of the platform: Computer Science (`cs`,
Hochschulblau), Data Science (`ds`, a darker shade of it) and Artificial
Intelligence (`ai`, pink, since 2026-10-30; until then pink belonged to
Data Science). Content items, paths, courses and projects may name theirs
with `areas: [ds]` or `areas: [cs, ds]`; without the field they belong to `cs`, which is what all
content written before 2026-10-27 assumes. An item in two areas has a page in
both. Every area needs exactly one start page: a page in `pages/` with
`area: <key>` (`pages/home` for cs, `pages/home-ds` for ds,
`pages/home-ai` for ai), which the build checks. Topics and modules have no area; the lists show only the topics that
items of the area use.

## Decisions

Approved by Nicolas on 2026-10-21 as proposed:

1. **Language of the lead file** is free per item, whichever language it was
   written in first.
2. **Four-digit numeric codes**, random and never reused; `npm run new-code`
   prints an unused one.
3. **Relation `checks`** (a quiz tests an item) in addition to the five from
   the concept.
4. **Type list** to start with: `lesson`, `demo`, `experiment`, `term`,
   `story`, `tool`, `quiz`, `source`, `paper`; `person` added on 2026-10-22,
   when Nicolas asked for an entry on Bill Gates; `slides` added on 2026-10-22
   for stagekit decks, which come without text of their own; `dataset` added
   on 2026-10-27 for data sets to download; `info` added on 2026-11-02 for
   pages that inform or guide without introducing a concept.
5. **Levels** 1–4 with the labels above.
6. **Access codes for courses** are readable word codes such as `LICHT-26`;
   case, spaces and hyphens are ignored. Not used for now (2026-11-01).
7. **`access: code`** exists in the schema but has no effect yet.
