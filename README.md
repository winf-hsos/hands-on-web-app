# Hands-on Computer Science

Source of the learning platform planned for hands-on-computer-science.de: a
knowledge base of learning items in Markdown, with typed relations between
them, from which a static, bilingual (German and English) website with
courses, learning paths and local progress is built.

## Layout

| Folder | Content |
|---|---|
| `knowledge/` | the knowledge base, the only source of what the site shows |
| `docs/` | design documents: schema of the knowledge base, architecture |
| `src/content.config.ts` | schema of each file, checked at build time |
| `src/lib/knowledge.ts` | joins lead files and translations, checks links and relations |
| `src/markdown/` | `[[links]]`, callouts and quizzes in Markdown |
| `src/pages/` | the pages, under `/de/` and `/en/` |
| `src/scripts/` | browser code: progress, search box, quizzes |

## Working on it

Requires Node 22 or later.

```
npm install
npm run dev        # local preview at http://localhost:4321
npm run check      # type check and full build, including the knowledge base checks
npm run build      # static site in dist/
npm run new-code   # an unused four-digit short code for a new item
```

A build fails with a list of errors if the knowledge base breaks a rule of
`docs/knowledge-schema.md`, for example a missing field, a duplicate code or a
relation to an id that does not exist.

## Status

Scaffold with pilot content; nothing is published.
