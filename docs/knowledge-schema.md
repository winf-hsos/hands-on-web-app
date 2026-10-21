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
  vocabulary.yaml        content types, relation types, levels, topics, modules
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
optional: false                    # optional, true marks enrichment (demos etc.)
relations:                         # optional, see section 5
  requires: [number-systems]
  see_also: [prefix-free-code]
access: public                     # optional, public (default) or code, see open decision 7
status: draft                      # required, draft or published
updated: 2026-10-21                # required, date of the last substantive change
---
```

Type-specific fields:

| Type | Extra fields |
|---|---|
| `demo` | `url` if the demo runs elsewhere; otherwise its files sit in `media/` |
| `tool` | `url`, `license` (of the tool) |
| `source`, `paper` | `authors`, `year`, `url` or `doi`, `publisher` or `venue` |
| `story` | `when` (year or span, free text such as `1838` or `um 1840`) |
| `quiz` | none; the questions are in the body, see section 7 |

Fields deliberately **not** in an item:

- **Order.** Which item comes after which belongs to a course or path, not to
  the item. The same item can then sit at different places in several courses.
- **Release dates.** They depend on the course and semester, so they live in
  the course file.
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
  readable as plain text.
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

## 9. Courses

A course is a curated collection for one module in one semester. Students
reach it with an access code that Nicolas sends them.

```yaml
---
kind: course
code: 3307                   # short code, like any page
access_code: LICHT-26        # what students type in; see open decision 6
module: dup
semester: 2026-27 - WS
title: Digitalisierung und Programmierung
summary: Begleitmaterial zur Vorlesung im Wintersemester 2026/27.
units:
  - title: { de: "Sitzung 3: Codes", en: "Session 3: Codes" }
    available_from: 2026-10-28
    items:
      - code-as-agreement
      - prefix-free-code
      - item: knock-code
        optional: true
      - code-systems-quiz
  - title: { de: "Sitzung 4: Fehler", en: "Session 4: Errors" }
    available_from: 2026-11-04
    items: [ … ]
status: draft
updated: 2026-10-21
---
```

Unit titles are short labels and therefore written in both languages inline;
the rule is that short labels in a structure may be bilingual in place, while
prose belongs in the language files. Without a server, `available_from` is a
display rule and not a lock: the item is shown as "available from 28 October"
in the course, but remains reachable directly, which is fine because all
content is public.

## 10. Vocabulary

`knowledge/vocabulary.yaml` defines the closed lists with labels in both
languages: content types, relation types, levels, topics and modules. The
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

Warnings, which do not stop the build: missing translation, translation older
than its lead, `draft` items referenced by a published path or course.

## Decisions

Approved by Nicolas on 2026-10-21 as proposed:

1. **Language of the lead file** is free per item, whichever language it was
   written in first.
2. **Four-digit numeric codes**, random and never reused; `npm run new-code`
   prints an unused one.
3. **Relation `checks`** (a quiz tests an item) in addition to the five from
   the concept.
4. **Type list** to start with: `lesson`, `demo`, `experiment`, `term`,
   `story`, `tool`, `quiz`, `source`, `paper`.
5. **Levels** 1–4 with the labels above.
6. **Access codes for courses** are readable word codes such as `LICHT-26`;
   case, spaces and hyphens are ignored when typing them in.
7. **`access: code`** exists in the schema but has no effect yet.
