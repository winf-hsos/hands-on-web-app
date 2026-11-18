---
title: Why text is better for AI
summary: >-
  A plea for writing a report in Quarto, Typst or LaTeX instead of Word: what
  a language model sees in a file, why a change in text stays readable, what
  the three formats look like, what this means for a report in Quarto and why
  tools with a command line suit an AI agent.
objectives:
  intro: "In this lesson you learn why a report written as text suits working with AI better, and afterwards you can:"
  goals:
    - "explain why a language model can read a text file directly but has to unpack a Word file first"
    - "read a change as a diff and say why this works for text and not for Word"
    - "recognize heading, bold, formula and citation in Quarto, Typst and LaTeX"
    - "describe how a text source becomes a PDF, HTML or Word file"
    - "explain why a number from code cannot slip into the text wrongly, neither by you nor by an AI"
    - "explain why a tool with a command line suits an AI agent and name examples beyond writing"
translation_of: de
based_on: 2026-11-17
---

![Slides: Why text is better for AI](item:text-for-ai-slides)

You can hand over the same words in two ways. In an open notebook everyone
reads all the lines at once, points at a sentence and changes it with a
pencil. A parcel taped shut on every edge holds the same text, but before
anyone can read or change a word, it has to be unpacked and afterwards
packed again so that nothing gets lost. For a language model a Word file is
the parcel and a text file is the notebook. This lesson shows why that makes
the difference when you work with AI.

## Word and the alternative

Word is familiar, it has comments and track changes that many supervisors
use, and for many texts it is good enough. Against it: text and layout live
in one file, numbers from an analysis are copied by hand and go stale as
soon as the data change, and formulas are tedious. For this lesson one point
matters most: a .docx file is not text but a packed bundle of files.

Quarto, Typst and LaTeX work with plain text files instead:

- The source is plain text that any program and any model can read.
- Content and layout are separate, and a template sets the layout.
- Numbers, tables and figures come from code.
- Citations come from a .bib file, in any style you need.
- One source gives PDF, HTML or Word.

All of this has been true for years; what is new is that a language model
can work with such files directly.

## What a language model sees

A language model takes text and gives text back, nothing else. A picture, a
table or a Word file has to be turned into text first by a program around
the model, while a text file is read as it is.

A single sentence shows how big the difference is. In a Quarto file it is
one line of 62 bytes, and the two stars make the word bold:

```markdown
Women name a **higher** price than men.
```

Rendered to Word with Quarto 1.10, this becomes a zip archive of 16 files and
just over ten kilobytes. The sentence itself sits in `word/document.xml`, cut
into pieces, because every change of formatting starts a new piece: "Women
name a", "higher" and "price than men." are all there, but scattered
between tags. To change
one word there, a program has to unpack the archive, find the right piece in
the XML, change it without breaking the structure and pack everything again.
A file saved by Word itself is larger still. A text file, in contrast, the
model reads and changes line by line.

## A change you can read

When an AI changes a text file, the change can be shown as a **diff**: the
old line with a minus, the new lines with a plus.

```diff
- Women name a higher price than men.
+ Women name a higher price than men
+ (median 2.00 € vs. 1.89 €).
```

An AI agent shows you exactly this before it writes to your file, and you
accept or reject the change. In a Word file the same change happens inside
the packed XML, and you see the result, not the change.

## Three text formats

Heading, bold, formula and citation look like this in the three formats:

| | Quarto (`.qmd`) | Typst (`.typ`) | LaTeX (`.tex`) |
|---|---|---|---|
| Heading | `# Results` | `= Results` | `\section{Results}` |
| Bold | `the **median** price` | `the *median* price` | `the \textbf{median} price` |
| Formula | `$\tilde{x} = 2.00$` | `$tilde(x) = 2.00$` | `$\tilde{x} = 2.00$` |
| Citation | `[@doering2023]` | `@doering2023` | `\cite{doering2023}` |

Quarto uses Markdown, the lightest syntax. Typst is a newer typesetting
system with its own short syntax and very fast output. LaTeX has been the
standard in mathematics and physics for decades and is the most verbose of
the three. All three keep formulas as text and take citations from a .bib
file.

From the text, a program sets the file you hand in. Quarto reads Markdown
with code, runs the code and produces a web page, a Word file or a PDF; for
the PDF it hands the text on to Typst or LaTeX. Typst and LaTeX set PDF
directly. Writing in text therefore does not mean giving up Word: if your
supervisor wants a .docx to comment on, Quarto produces it from the same
source.

## Your report as text

In Quarto a number in the text can come straight from R. A chunk computes
the median and formats it with two decimals, and an inline expression
writes it into the sentence:

````markdown
```{r}
med_w <- sprintf("%.2f", median(women$price))
```

Women name a median of `{r} med_w` €.
````

Quarto turns this into "Women name a median of 2.00 €.", and when the data
change, the number changes with them. For working with AI this matters
twice: an AI that edits your text can neither invent nor mistype the number,
because it is not in the text but in the code, and when you check the code,
you check the number.

A paper in Quarto can be a small folder, like the template in the course
folder:

```
paper/
  paper.qmd
  references.bib
  sections/
    _introduction.qmd
    _methods.qmd
    _results.qmd
    _discussion.qmd
```

The central file `paper.qmd` holds the settings and pulls in the sections
with `{{< include sections/_introduction.qmd >}}`, and the references live in
`references.bib`. Quarto runs the code and Typst sets the PDF. Every file is
text, so an agent can read the whole report, check one section against
another and change a single line, and you see every change before it
happens.

## Meet the AI where it lives

An AI agent works in a terminal: it types a command, reads what comes back
and decides on the next step. A tool that brings a command line can
therefore be used by an AI the same way as by you, and Quarto, Typst and
LaTeX each bring one:

```bash
quarto render paper.qmd --to pdf
typst compile paper.typ
latexmk -pdf paper.tex
```

An agent can render your paper, read the error messages and fix the source
on its own. Word has menus and buttons but no command to render or change a
document; there are detours such as Pandoc or scripts that remote-control
Word, but Word itself is built for a person with a mouse.

More and more tools follow the same idea and keep their files as text and
bring a command line:

- [Excalidraw](https://github.com/excalidraw/cli) keeps every drawing as
  JSON text, and its official command line interface, made "for humans and
  agents", renders drawings and turns Mermaid text into editable drawings.
- [Mermaid](https://mermaid.js.org) writes a diagram as text, and GitHub,
  Quarto and Excalidraw draw it.
- [marimo](https://marimo.io) saves a notebook as a plain Python file,
  without outputs and images inside.
- The [GitHub CLI](https://cli.github.com) brings issues, pull requests and
  releases to the terminal.
- A .csv file is a table as plain text, while an .xlsx file is a packed
  bundle like a .docx.
- The slides of this lesson are an HTML file and a script, so an AI can
  build and change them like a paper in Quarto.

## Takeaways

- A language model reads and writes text; a text file needs no intermediate
  step, a Word file does.
- In a text file every change an AI makes is a line you can read before you
  accept it.
- Quarto, Typst and LaTeX differ in syntax but share the idea: text as the
  source, layout from a template.
- One Quarto source gives PDF, HTML and, when needed, Word.
- A number that comes from code cannot slip into the text wrongly, neither
  by you nor by an AI.
- An AI agent works in the terminal, so tools that keep text files and bring
  a command line suit it, while Word does not.
