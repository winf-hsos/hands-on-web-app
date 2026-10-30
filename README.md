# Hands-on Computer Science

Source of the learning platform planned for hands-on-computer-science.de: a
knowledge base of learning items in Markdown, with typed relations between
them, from which our own build script makes a static, bilingual (German and
English) website with courses, learning paths and local progress. The site
has three areas built from the same knowledge base, Hands-on Computer
Science under `/cs/`, Hands-on Data Science under `/ds/` and Hands-on
Artificial Intelligence under `/ai/` (see `docs/architecture.md`).

## Layout

| Folder | Content |
|---|---|
| `knowledge/` | the knowledge base, the only source of what the site shows |
| `docs/` | schema of the knowledge base, architecture |
| `scripts/` | build, local preview, new short codes |
| `src/build/` | reading, checking and rendering the knowledge base |
| `src/editor/` | the editor: storage and browser app (`docs/editor.md`) |
| `src/templates/` | the pages |
| `src/client/` | browser modules |
| `src/styles/` | the stylesheet |
| `vendor/stagekit/` | the stagekit runtime for slide decks |
| `tests/` | checks of the knowledge base rules |

## Working on it

Requires Node 22 or later.

```
npm install
npm run dev        # preview at http://localhost:4321, rebuilds on every save
npm run editor     # editor at http://localhost:4322 (see docs/editor.md)
npm run build      # static site in dist/, stops with a list if the knowledge base has errors
npm test           # each rule of the knowledge base broken once on purpose
npm run new-code   # an unused four-digit short code for a new item
npm run fetch-r-packages  # once: dplyr, ggplot2 and their dependencies for R in the browser
Rscript scripts/r-functions.R  # after changing which functions R editors suggest
```

## Publishing

Content is written locally with the editor. A push to `main` publishes:
`.github/workflows/pages.yml` runs the tests, fetches the R packages, builds
the site and deploys `dist/` to GitHub Pages (in the repository settings,
Pages needs "GitHub Actions" as its source). The editor's "Veröffentlichen"
pushes. The site uses absolute paths (`/cs/de/…`), so it needs its own
domain or a `<user>.github.io` repository, not a project path like
`<user>.github.io/hands-on-web-app/`.

Only content with `status: published` is on the site; `?drafts` on any
address shows everything (`docs/knowledge-schema.md`, section 12).

## Status

Scaffold with pilot content; no GitHub repository yet, nothing is published.
