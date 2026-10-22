# Knowledge base

Everything the website shows comes from this folder, and nothing else. The
full rules are in [`../docs/knowledge-schema.md`](../docs/knowledge-schema.md);
this page is the short version.

- `content/<id>/` holds one learning item: a lesson, demo, experiment, term,
  story, tool, quiz, source or paper.
- `paths/<id>/` holds a learning path, `courses/<id>/` a course for one
  semester, `projects/<id>/` a project in phases and challenges.
- Each folder has one Markdown file per language, `de.md` and `en.md`. The file
  without `translation_of` is the **lead file** and holds the shared
  metadata; the other is its translation and holds only title, summary and
  text.
- The folder name is the item's id. Never rename a published folder, since
  relations, courses and the progress of learners refer to it.
- Links between items are written `[[id]]` or `[[id|link text]]`.
- `vocabulary.yaml` defines types, relations, levels, topics and modules.

Status: schema approved on 2026-10-21. The five items in `content/`, the path in
`paths/` and the course in `courses/` are pilot drafts.
