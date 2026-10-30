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
    code-as-agreement/   one folder per content item, named by its id
      de.md              lead file: shared metadata + German text
      en.md              translation: English title, summary and text
      media/             images and other files used by this item only
  paths/
    codes-in-one-hour/   learning paths, same pattern as content items
      de.md
      en.md
  courses/
    dup-2026-27-ws/      curated collections per course and semester
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
| Example | `code-as-agreement` | `4821` |
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
type: lesson                       # required, see vocabulary.yaml
code: 4821                         # required, four digits
title: Ein Code ist eine Vereinbarung       # required
summary: >-                        # required, one or two sentences, plain text
  Warum dieselben Bits ein Buchstabe, eine Farbe oder ein Ton sein können …
level: 1                           # required, 1–4, see vocabulary.yaml
duration: 20                       # required, minutes of focused work
topics: [representing-information] # required, at least one, see vocabulary.yaml
modules: [dup]                     # optional, modules this item is written for
relations:                         # optional, see section 5
  requires: [number-systems]
  see_also: [prefix-free-code]
access: public                     # optional, public (default) or code, see open decision 7
status: draft                      # required, draft, published or archived
updated: 2026-10-21                # required, date of the last substantive change
---
```

Type-specific fields:

| Type | Extra fields |
|---|---|
| `demo` | `url` if the demo runs elsewhere; otherwise its files sit in `media/` |
| `tool` | `url`, `license` (of the tool) |
| `source`, `paper` | `authors`, `year`, `url` or `doi`, `publisher` or `venue`, `isbn`, `buy` (a page where the book can be bought) |
| `story` | `when` (year or span, free text such as `1838` or `um 1840`) |
| `person` | `born`, and `died` where it applies, as years |
| `slides` | a stagekit deck in the folder `slides/` (one `.html` file, optionally `export/<deck>.pdf`); `deck_lang` if the slides are in one language only; `recordings` later, as `{ title, url, slide }` with YouTube links per part |
| `dataset` | `file`, the name of a CSV in `media/datasets/`; `authors`, `year`, `license` where known. The page offers the file for download with its rows, columns and size, measured when building, and the lines that load it in R and in Python; the body describes the data. Only a dataset has a `file` |
| `quiz` | none; the questions are in the body, see section 7 |

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
- **Links to other items** are written as `[[code-as-agreement]]` or with
  their own text as `[[code-as-agreement|the lesson on codes]]`. The build
  turns them into links in the current language, and the validator checks them.
  Inside the knowledge base this form stays readable and survives renaming of
  URLs; a normal Markdown link would hard-wire a URL.
- **Images** are relative paths into the item's `media/` folder,
  `![Alt text](media/codebook.svg)`. Text inside images should be avoided or
  kept language-neutral; otherwise there is one image per language
  (`codebook.de.svg`, `codebook.en.svg`).
- **Callouts** use the blockquote form known from GitHub:
  `> [!TIP]`, `> [!NOTE]`, `> [!WARNING]`. They render as boxes and remain
  readable as plain text. `> [!HINT]` and `> [!SOLUTION]` render folded, so
  that a learner opens them only when needed; several hints in one text are
  numbered.
- **Python code** in a ` ```python ` block becomes a small editor on the page
  that runs the code in the browser (Pyodide, Python as WebAssembly, loaded on
  the first click). `input()` is answered in a field below the output. A
  fragment that cannot run on its own is marked ` ```python static `, and
  ` ```text ` shows a sample run as it is. Names in code are English in both
  languages; what a program prints follows the language of the text.
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
  game records every round and shows the rounds as R vectors to copy.
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
- [x] Drei
- [ ] Vier
- [ ] Sechsundzwanzig

> Mit zwei Positionen gibt es nur 4 × 4 = 16 Codewörter, mit drei bereits 64.
```

Each `##` heading is a question, `[x]` marks the correct answer (several are
allowed for multiple-select), and the blockquote after the list is the
explanation shown after answering. Question ids for progress are derived from
the position (`q1`, `q2`, …); if questions are reordered later, an explicit id
can be added as `## Frage {#q-positions}`.

This form is deliberately independent of the existing question pools, as the
concept requires. If the platform later takes over the practice quizzes of the
existing websites, a converter can translate between the two.

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

## 8. Learning paths

A path is a folder in `paths/` with the same lead/translation pattern. The
lead holds the structure; the translation holds title, summary, `goal`,
`audience` and the introductory text, since those are prose. The example in
`knowledge/paths/codes-in-one-hour/` shows both files.

```yaml
---
kind: path
code: 1094
title: Codes in einer Stunde
summary: Vom Codebuch zum präfixfreien Code, mit einem Experiment zum Mitmachen.
goal: Du kannst erklären, warum ein Code eine Vereinbarung ist und wann Codewörter eindeutig lesbar sind.
audience: Erstes Semester, ohne Vorkenntnisse
level: 1
requires: []                 # ids of items or paths that should come first
steps:
  - code-as-agreement
  - prefix-free-code
  - item: morse-and-the-type-case
    optional: true
  - knock-code
  - code-systems-quiz
status: draft
updated: 2026-10-21
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

## 9. Courses

A course is a curated collection for one module in one semester. All
courses are listed on the site under "Courses"; the access code (or a link
with it, `/de/learning/?code=…`) adds a course to "My learning", which also
makes it a filter in the content list.

```yaml
---
kind: course
code: 3307                   # short code, like any page
access_code: LICHT-26        # what students type in; see open decision 6
module: dup
institution: hs-osnabrueck      # from vocabulary.yaml, with name, address and logo
handbook: https://www.hs-osnabrueck.de/module/44b0850/   # official module description
semester: 2026-27 - WS
title: Digitalisierung und Programmierung
summary: Begleitmaterial zur Vorlesung im Wintersemester 2026/27.
sections:
  - path: python-for-beginners  # a whole learning path as one section
  - title: { de: "Zahlen- und Codesysteme", en: "Number and code systems" }
    items:
      - code-as-agreement
      - prefix-free-code
      - item: knock-code
        optional: true
      - code-systems-quiz
status: draft
updated: 2026-10-21
---
```

A course consists of **sections** (decision of Nicolas, 2026-10-26; until
then "units" named after sessions). A section is either a title with its
items, or a learning path given by `path:`, which brings its own title, parts
and steps and stays the same path that can be followed on its own. Section
titles are short labels and therefore written in both languages inline; the
rule is that short labels in a structure may be bilingual in place, while
prose belongs in the language files. Sections have no release dates:
everything in a course is available from the start.

A course may have a `subtitle`, a short line under its title (in the lead and
in each translation), for example where it belongs in a larger module. Its
`sections` may be an empty list while the content is being written; the page
then says so. `institution` and `handbook` are optional. The course page shows the logo and
name of the institution, both linking to its website, and a link to the
official module description in the module handbook.

## 8a. Slides

A slides item is a stagekit deck, kept as it was built, in `slides/` next to
the item's `de.md` and `en.md`:

```
knowledge/content/problem-decomposition/
  de.md, en.md        title and summary only; slides have no text of their own
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

## 9a. Projects

A project is a larger undertaking that learners carry out over weeks, such as
the LiFi project. It is divided into **phases**, and a phase may contain
**challenges**. Relevant content is linked where it is needed: to the project
as a whole, to a phase or to a single challenge.

The lead file holds the structure and the links, the text holds titles and
prose. A heading with an id marks a phase (`##`) or a challenge (`###`);
headings without an id are ordinary sections, such as "What you need".

```yaml
---
kind: project
code: 4577
title: "LiFi: Daten mit Licht übertragen"
summary: …
level: 1
topics: [transferring-information, representing-information]
modules: [dup]
items: [petzold-code]          # optional: content for the whole project
phases:
  - id: word
    items: [knock-code]        # optional: content for this phase
    challenges:                # optional
      - id: challenge-2
        items: [code-as-agreement, prefix-free-code]
status: draft
updated: 2026-10-22
---

Introduction …

## Aus Farben werden Buchstaben {#word}
Text of the phase …

### Challenge 2: Das Wort {#challenge-2}
Text of the challenge …

## Was ihr braucht
An ordinary section …
```

The build checks that phases and challenges in the front matter and the
headings with ids match, in order and in every language, so a challenge can
neither be forgotten in one language nor linked to the wrong place. Each
phase and challenge can be linked directly as `…/projects/lifi/#challenge-2`.

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
  "courses": ["dup-2026-27-ws"]
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

Warnings, which do not stop the build: missing translation, translation older
than its lead, `draft` items referenced by a published path or course.

## 13. Areas

`vocabulary.yaml` lists the areas of the platform (`cs`, `ds`). Content
items, paths, courses and projects may name theirs with `areas: [ds]` or
`areas: [cs, ds]`; without the field they belong to `cs`, which is what all
content written before 2026-10-27 assumes. An item in two areas has a page in
both. Every area needs exactly one start page: a page in `pages/` with
`area: <key>` (`pages/home` for cs, `pages/home-ds` for ds), which the build
checks. Topics and modules have no area; the lists show only the topics that
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
   on 2026-10-27 for data sets to download.
5. **Levels** 1–4 with the labels above.
6. **Access codes for courses** are readable word codes such as `LICHT-26`;
   case, spaces and hyphens are ignored when typing them in.
7. **`access: code`** exists in the schema but has no effect yet.
