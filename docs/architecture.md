---
title: Technical architecture
status: decided by Nicolas on 2026-10-21 (variant A, Astro)
date: 2026-10-21
---

# Technical architecture

This document proposes how the website is built from the knowledge base. It
compares three variants for the site generator and recommends one; the parts
that are the same in every variant (search, progress, graph, hosting) follow
after the comparison.

## Fixed requirements

These come from the concept and are not up for choice here:

- a **static site**, no server at run time, until the AI companion arrives;
- the knowledge base in `knowledge/` is the **only source** of what the site
  shows, so no text lives in templates beyond interface labels;
- **German and English** side by side, switchable on every page;
- filter, sort and **live search** including short codes, fast and offline;
- **courses** reached by code with release dates, and **learning paths**;
- **progress** in local storage, portable as a copyable code, a QR code and a file;
- a **graph view** of all items and relations;
- **no login, no personal data** leaving the browser.

## Variants for the site generator

### A. Astro (recommended)

Astro is a static site generator built around content collections: Markdown
files with front matter that are checked against a schema at build time. It
renders every page to plain HTML and adds JavaScript only to the parts that
need it (search, progress, graph), which Astro calls islands.

- **Fits the schema directly.** The front matter rules from
  `knowledge-schema.md` become a typed schema; a missing field or a broken
  relation stops the build with a clear message instead of producing a wrong
  page.
- **Two languages are built in** (routing under `/de/` and `/en/`, fallbacks).
- **Fast pages**, since content pages are plain HTML and work without
  JavaScript; only filters, search, progress and graph need it.
- **Cost:** a Node toolchain (Node and npm are installed) and a framework that
  has to be learned and updated. Astro has a large user base and a stable
  release history, so the risk is moderate.

### B. Eleventy with plain JavaScript

Eleventy is a deliberately minimal generator that turns Markdown and templates
into HTML and imposes almost no structure.

- **Very small and flexible**, few dependencies, easy to understand fully.
- **Validation and two-language routing are our own work**: Eleventy checks
  nothing about front matter, so the validator from the schema has to be written
  and maintained separately.
- Good choice if long-term independence from a framework matters more than
  speed of building.

### C. Own build script and a single-page app

A script (Python or Node) reads the knowledge base, validates it and writes
one JSON file; a single-page app in the browser renders everything from it.

- **Full control and the cleanest data path**: the same JSON a learning agent
  could read is what the site uses.
- **Everything else is our own work**: routing, language switching, page titles
  for search engines and link previews, accessibility. Pages without JavaScript
  stay empty.
- Worth it only if the site becomes mostly an application rather than a
  collection of pages, which may happen with the AI companion but not now.

### Not proposed

- **Quarto**, which runs the existing LiFi and book websites, is made for
  books and documentation. It has no typed data model for relations, courses
  and progress, and reusing it would invite reusing the existing sites, which
  the concept rules out.
- **Hugo** would work technically, but its template language is harder to
  maintain than the alternatives, and it is not installed.

### Recommendation

**Variant A, Astro.** The decisive point is the schema check at build time:
since the knowledge base is meant to be edited by hand, the build has to catch
mistakes, and Astro provides that without a separate validator. The interactive
parts stay small, and the pages remain readable without JavaScript. If Astro
were ever abandoned, the knowledge base would be unaffected, because it is
plain Markdown and does not depend on the generator.

## Parts common to every variant

### Search and filters

At build time a small search index is written as JSON: id, code, type, title,
summary, topics, level, language and duration of every item, in both
languages. In the browser a compact full-text library (MiniSearch, about
7 KB compressed) searches it as you type and combines the result with the
filters. A four-digit input matching a code jumps directly to the item. With a
few hundred items, the index stays well below 100 KB.

### Courses and release dates

A course page shows its units in order. Units with a future `available_from`
date are shown greyed out with the date. Entering a course's access code on the
start page stores the course in local storage and adds it to the navigation.
Without a server this is a convenience and not a lock, which is fine because all
content is public.

### Progress and how to take it along

Progress is stored in local storage in the format from section 11 of the
schema. For transfer to another browser:

- **Copyable code and link.** The record is compressed with the browser's own
  `CompressionStream` (no library needed) and encoded as base64url. To keep it
  short, items are written by their four-digit code and dates as days since a
  fixed start date; 100 viewed items then need well under 1 KB.
- **QR code** of a link of the form `…/#progress=<code>`. Scanning it with a
  phone camera opens the site, which offers to import. The part after `#` is
  never sent to any server, not even to the web host, so the progress stays
  with the student.
- **File export and import** as readable JSON, which is also the format a
  student would later hand to the AI companion, and only if they choose to.

The QR code is generated in the browser by a small library (about 20 KB).

### Graph view

All items as nodes, coloured by topic and shaped by type, with relations as
edges. A force-directed layout (Cytoscape.js, or d3-force if the graph should
be drawn in SVG to match the site) shows clusters and entry points; clicking a
node opens the item. With filters, the graph doubles as a map for self-study.

### Hosting and address

Any static host will do. GitHub Pages is used by the existing sites, and the
Uberspace of Classroom Live is available and would later also host the small
server for the AI companion. Which address the platform gets is open (see the
open points in `Konzept.md`): `cs.`, `book.` and `ai.` subdomains of
`hands-on-computer-science.de` are already used by the book sites.

Nothing is published before Nicolas says so explicitly.

## Next steps once decided

1. Set up the generator with the schema as a typed content collection.
2. Pages: start page with three entry points, content list with filters and
   search, item page with relations, path page, course page, graph.
3. Progress, export and import.
4. Fill in the pilot items and check them on phone and desktop.
