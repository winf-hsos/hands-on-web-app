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
npm run editor     # http://localhost:4322: the site with drafts and the editor banner;
                   # the forms under /edit/. Starts the site preview on 4321 if needed
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

## The site as the start page

Since 2026-11-01 the editor opens on the site itself, as it looks on the web,
with all drafts (Nicolas). Every address outside `/edit/` and `/api/` is
passed on to the site preview, and every page gets a banner at the top
(`src/editor/ui/overlay.js`) that says it is the editor:

- On the page of a content item, learning path, course or project: its status
  (Entwurf, Freigegeben but not live yet, Live), its errors if any,
  **Bearbeiten** (opens the form under `/edit/?doc=section/id`) and
  **Freigeben** for a draft or **Zurück zum Entwurf** for a released one. A
  start page has Bearbeiten only.
- Freigeben sets `status: published` in the lead file and nothing else, with
  the same checks as any save. The site on the web shows it after the next
  push ("Veröffentlichen" in the forms). "Not live yet" means the folder has
  changes that are not committed, or commits that are not pushed.
- A link switches between the view with drafts and the public view, and the
  git state links to the forms, where committing and publishing are.

The banner is left out of decks and demonstrators embedded in a page.

## Editing in place

On the view with drafts, a click on a part of a page turns it into an editor
for exactly what it shows (Nicolas, 2026-11-01; `src/editor/ui/inline.js`):

| Click on | Opens |
|---|---|
| title, summary (goal of a path, subtitle of a course) | the text itself; Enter saves, Escape cancels |
| a block of the text (paragraph, heading, list, table, callout) | its Markdown in a box; Ctrl+Enter saves, Escape cancels, saved empty the block is gone |
| code box, demonstrator, quiz question, folded hint | a button "Bearbeiten" over the block, since a click there is used by the block itself |
| type and duration above the title | a choice of type and the minutes |
| topics, modules, level | chips to remove and a menu to add, or a choice |
| the relations ("Mehr dazu", "Setzt voraus") | each relation of this item with its targets, a search to add one |
| authors, year, publisher and the other single values in the details | a field |

Ctrl or Cmd with a click still follows a link. Every change is saved at once
(`PATCH /api/doc/<section>/<id>`, `store.patch()`), with the same checks as
any save, and moves `updated` of the original to today, as the form does. The
page then reloads with the result; the reload of the preview waits while
something is open.

What makes this possible are marks that exist only on the site with drafts:
`data-field` names a field of the front matter (`editable()` in
`src/templates/parts.mjs`), and `data-src="start-end"` gives each top-level
block of the text its place in the Markdown (`sourceMap` in
`src/build/remark-knowledge.mjs`). A passage is only replaced if it still
reads as it did when the page was built; otherwise the editor asks to reload.
Phases and challenges of projects and the structure of paths and courses are
edited in the forms.

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
| Publish | pushes the commits not yet pushed; shown only when the repository has a remote and something to push. GitHub then builds and publishes the site (`.github/workflows/pages.yml`) |

A slides item needs its deck in `slides/` before it can be saved; copy the
folder of the deck there first, then create or edit the item.

Courses and projects edit their structure (sections, phases and challenges) as
YAML in a text field for now; everything else of them uses the forms.

## Files

| File | Job |
|---|---|
| `scripts/editor.mjs` | the local server and its JSON interface |
| `src/editor/store.mjs` | reading, checking and writing documents |
| `src/editor/ui/` | the browser app: `index.html`, `editor.js`, `editor.css`; on the site pages the banner, `overlay.js`, `overlay.css`, and editing in place, `inline.js` |

## Later

- A GitHub backend for running the editor online, behind the same interface
  as `store.mjs`, once the repository is public.
- Forms instead of YAML for course sections and project phases.
- Error messages of the checks in German as well as English.
