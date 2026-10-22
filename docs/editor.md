---
title: Editor
status: first version, 2026-10-22
---

# Editor

The editor is the human tool next to the knowledge base: a local web app for
creating, editing, linking, archiving and deleting content without touching
YAML by hand. It works directly on the Markdown files in `knowledge/`, so
everything it does can be read, reviewed and versioned like any other change.

```
npm run editor     # http://localhost:4322, starts the site preview on 4321 if needed,
                   # and restarts itself when the code in src/ changes
```

## Principles

- **The files stay the source.** The editor reads and writes the same
  Markdown files that a person would edit in a text editor. There is no
  database and no second copy.
- **Nothing breaks the build.** Every save is checked with the rules of
  `src/build/validate.mjs` first. A change that would introduce a new error,
  wherever it shows up, is not written; the editor lists the errors instead.
  Errors that existed before are shown but do not block.
- **Small diffs.** Fields that did not change keep their exact lines, and a
  file saved without changes stays byte for byte the same (`tests/store.test.mjs`).
  Line endings are kept as they are.
- **Local only.** The server listens on 127.0.0.1, answers only requests for
  `localhost`, and accepts changes only with a custom header, so that other
  websites open in the same browser cannot send changes through it.

## What it does

A document with problems carries a red mark in the list; hovering over it, or
opening the document, shows what the check says about it.


| Action | Effect |
|---|---|
| Create | asks for kind, title, id, language, summary and what the kind needs; assigns an unused four-digit code; starts as a draft |
| Edit | shared fields as a form (type, level, duration, topics, modules, relations, type-specific fields, path steps); title, summary and text per language, with a live preview rendered by the site's own Markdown pipeline |
| Link | relations and path steps via a searchable picker; "Verknüpfen" in the text inserts `[[id]]` or `[[id|selected text]]` |
| Translate | creates the other language as a copy of the original, marked as outdated until it is checked off as current |
| Archive | status `archived`: gone from the site, file, id and code kept, learner progress kept; refused while something visible still points to it |
| Delete | removes the folder for good; id and code become free and learner progress for it is lost; refused while anything still points to it |
| Commit | commits the changes in `knowledge/` to the local git repository with a message; nothing is pushed |

A slides item needs its deck in `slides/` before it can be saved; copy the
folder of the deck there first, then create or edit the item.

Courses and projects edit their structure (units, phases and challenges) as
YAML in a text field for now; everything else of them uses the forms.

## Files

| File | Job |
|---|---|
| `scripts/editor.mjs` | the local server and its JSON interface |
| `src/editor/store.mjs` | reading, checking and writing documents |
| `src/editor/ui/` | the browser app: `index.html`, `editor.js`, `editor.css` |

## Later

- A GitHub backend for running the editor online, behind the same interface
  as `store.mjs`, once the repository is public.
- Forms instead of YAML for course units and project phases.
- Error messages of the checks in German as well as English.
