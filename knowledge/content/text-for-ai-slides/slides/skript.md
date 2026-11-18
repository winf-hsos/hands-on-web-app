# Why text is better for AI

Script to the deck `why-text-is-better-for-ai.html`, in the order of the
slides. Frame numbers count every build-up step, as in the PDF.

The message of this input fits into one sentence: a language model reads and
writes text, so a report written as text, in Quarto, Typst or LaTeX, can be
read, changed and checked by a model in the same way as by you.

## Opening (frames 1–5)

The same words can be handed over in two ways. In an open notebook everyone
can read every line at once, point at a sentence and change it with a pencil.
A parcel taped shut holds the same text, but before anyone can read or change
a word, it has to be unpacked, and afterwards packed again so that nothing
gets lost. For a language model, a Word file is the parcel and a text file is
the notebook.

An anonymous poll asks what the audience writes texts for their studies with:
Word, Google Docs, LaTeX or Typst, Markdown or Quarto. Most will write in
Word or Google Docs, which is no mistake; the question is whether it is the
right tool once a model is meant to write along.

## Part 1: what you write with (frames 6–8)

**Word (frame 7).** Word is familiar, it has comments and track changes that
supervisors use, and for many texts it is good enough. Against it: text and
layout live in one file, numbers from an analysis are copied by hand and go
stale when the data change, and formulas are tedious. The point this input is
about is that a .docx file is not text but a packed bundle of files.

**Text files (frame 8).** Quarto, Typst and LaTeX work with plain text that
any program and any model can read. Content and layout are separate, because
a template sets the layout. Numbers, tables and figures come from code,
citations come from a .bib file in any style, and one source gives PDF, HTML
or Word. None of this is new, but with AI text files gain a strength they did
not have before.

## Part 2: what a model sees (frames 9–16)

**A language model reads and writes text (frame 10).** A language model takes
text and gives text back, nothing else; prompt, model and answer stand in
three boxes of the same size. A picture, a table or a Word file has
to be turned into text first by a program around the model, while a text
file needs no such step.

**One sentence, two files (frames 11–15).** The sentence "Women name a
**higher** price than men." in a Quarto file is one line of 62 bytes; the two
stars make the word bold. Rendered to Word with Quarto 1.10, the same
sentence becomes a zip archive of 16 files and more than ten kilobytes, and
in `word/document.xml` it is cut into pieces wherever the formatting changes.
To change one word there, a program has to unpack the archive, find the right
piece, change it without breaking the structure and pack everything again. A
text file the model reads and changes line by line. Frames 13 to 15 mark the
three pieces of the sentence on both sides, first "Women name a", then
"higher", then "price than men.": everything is there, but scattered between
tags, so a model has to read the markup around every word to find the
sentence.

**A change you can read (frame 16).** When an AI changes a text file, the
change can be shown as a diff, with the old line in red and the new lines in
green. An AI agent shows exactly this before it writes to a file, and you
accept or reject it; in a Word file you only see the result, not the change.

## Part 3: three text formats (frames 17–19)

**The same four things, three times (frame 18).** A heading, a bold word, a
formula and a citation in Quarto, Typst and LaTeX. Quarto uses Markdown, the
lightest syntax. Typst is a newer typesetting system with its own short
syntax and very fast output. LaTeX has been the standard in mathematics and
physics for decades and is the most verbose of the three. All three keep
formulas as text and take citations from a .bib file.

**From text to the file you hand in (frame 19).** An engine sets the text
into the format you hand in. The figure has three rows: each source sits
level with its engine, HTML with Quarto, PDF with LaTeX and the Word file in
the middle. Quarto reads Markdown with code, runs the code
and produces HTML, Word or PDF, handing the text on to Typst or LaTeX for the
PDF; Typst and LaTeX set PDF directly. Writing in text therefore does not
mean giving up Word, because Quarto produces a .docx from the same source
when a supervisor wants to comment in Word.

## Part 4: your report as text (frames 20–23)

**Numbers from code (frames 21–22).** In Quarto a number in the text can come
straight from R: a chunk computes the median and formats it with two
decimals, and an inline expression writes it into the sentence, so it changes
with the data. Frame 22 shows a real cut-out of the PDF that Quarto and Typst
make of it, with the number marked. An AI that edits the text
can neither invent nor mistype that number, because the number lives in the
code, and when you check the code you check the number.

**A report as a folder of text files (frame 23).** A paper in Quarto can be a
small folder: a central file with the settings that pulls in the sections,
one file per section and the references in a .bib file. Every file is text,
so an agent can read the whole report, check one section against another and
change a single line, and you see every change before it is made.

## Part 5: meet the AI where it lives (frames 24–26)

**An agent works in the terminal (frame 25).** An AI agent types a command,
reads what comes back and decides on the next step. Quarto, Typst and LaTeX
each bring such a command (`quarto render`, `typst compile`, `latexmk`), so
an agent can render the paper, read the error messages and fix the source on
its own. Word has menus and buttons but no command to render or change a
document; there are detours such as Pandoc or scripts that remote-control
Word, but Word itself is built for a person with a mouse. An AI uses a tool
with a command line the same way you do, and Quarto, Typst and LaTeX all
bring one.

**The same idea elsewhere (frame 26).** More and more tools keep their files
as text and bring a command line. Excalidraw keeps every drawing as JSON
text, and its official command line interface, made "for humans and agents",
renders drawings and turns Mermaid text into editable drawings. Mermaid
writes a diagram as text, which GitHub, Quarto and Excalidraw draw. Marimo
saves a notebook as a plain Python file without outputs and images inside.
The GitHub CLI brings issues, pull requests and releases to the terminal. A
CSV file is a table as plain text, while an .xlsx file is a packed bundle
like a .docx. And this deck is itself an HTML file and a script, so an AI
can build and change it like a paper in Quarto.

**Closing (frame 27).** Write your report as text, because then an AI can
read, change and check it the same way you do.

## Sources

- Excalidraw CLI, official command line interface for humans and agents.
  https://github.com/excalidraw/cli
- Mermaid. https://mermaid.js.org
- marimo. https://marimo.io
- GitHub CLI. https://cli.github.com
