# Why text is better for AI

Script to the deck `why-text-is-better-for-ai.html`, in the order of the
slides. Frame numbers count every build-up step, as in the PDF.

The message of this input fits into one sentence: a language model reads and
writes text, so a report written as text, in Quarto, Typst or LaTeX, can be
read, changed and checked by a model in the same way as by you.

## Opening (frames 1–3)

The same words can be handed over in two ways. In an open notebook everyone
can read every line at once, point at a sentence and change it with a pencil.
A parcel taped shut holds the same text, but before anyone can read or change
a word, it has to be unpacked, and afterwards packed again so that nothing
gets lost. For a language model, a Word file is the parcel and a text file is
the notebook.

## Part 1: Word and the alternative (frames 4–8)

**Word (frame 5).** Word is familiar, it has comments and track changes that
supervisors use, and for many texts it is good enough. Against it: text and
layout live in one file, numbers from an analysis are copied by hand and go
stale when the data change, and formulas are tedious. The point this input is
about is that a .docx file is not text but a packed bundle of files.

**Text files (frames 6–8).** Quarto, Typst and LaTeX work with plain text
that any program and any model can read. The animation shows a paper.qmd open
in Positron, in which you and an AI agent write at the same time: your lines
in white, the agent's in blue, with text, an R chunk and a citation side by
side. Only the content is written there. The second click brings in the
layout: a template decides how the document looks, and Quarto renders the
same source to a PDF, a Word file or a web page, runs the code on the way and
takes the citations from a .bib file in whatever style is needed. None of
this is new, but with AI text files gain a strength they did not have before.

## Part 2: what a model sees (frames 9–18)

**A language model reads and writes text (frames 10–12).** A language model
takes text and gives text back, nothing else. The first click sends a prompt
with paper.qmd attached, and since the file is text, the model reads it at
once and answers. The second click sends the same prompt with paper.docx.
The model cannot read the packed file, so an agent first writes a small
Python script that opens it with the package python-docx and prints the
paragraphs, runs it and only then reads the text. Chat tools do the same
behind the scenes with a converter, and what gets lost on the way, such as
comments, tracked changes or the position of a figure, the model never sees.

**One sentence, two files (frames 13–17).** The sentence "Women name a
**higher** price than men." in a Quarto file is one line of 62 bytes; the two
stars make the word bold. Rendered to Word with Quarto 1.10, the same
sentence becomes a zip archive of 16 files and more than ten kilobytes, and
in `word/document.xml` it is cut into pieces wherever the formatting changes.
To change one word there, a program has to unpack the archive, find the right
piece, change it without breaking the structure and pack everything again. A
text file the model reads and changes line by line. Frames 15 to 17 mark the
three pieces of the sentence on both sides, first "Women name a", then
"higher", then "price than men.": everything is there, but scattered between
tags, so a model has to read the markup around every word to find the
sentence.

**A change you can read (frame 18).** When an AI changes a text file, the
change can be shown as a diff, with the old line in red and the new lines in
green. An AI agent shows exactly this before it writes to a file, and you
accept or reject it; in a Word file you only see the result, not the change.
The same diffs are what version control works with: git keeps every change
to a text file as a version you can compare and go back to, while for a
.docx it only knows that the file has changed.

## Part 3: three text formats (frames 19–21)

**The same four things, three times (frame 20).** A heading, a bold word, a
formula and a citation in Quarto, Typst and LaTeX. Quarto uses Markdown, the
lightest syntax. Typst is a newer typesetting system with its own short
syntax and very fast output. LaTeX has been the standard in mathematics and
physics for decades and is the most verbose of the three. All three keep
formulas as text and take citations from a .bib file.

**From text to the file you hand in (frame 21).** An engine sets the text
into the format you hand in. The figure has three rows: each source sits
level with its engine, HTML with Quarto, PDF with LaTeX and the Word file in
the middle. Quarto reads Markdown with code, runs the code and produces HTML,
Word or PDF, handing the text on to Typst or LaTeX for the PDF; Typst and
LaTeX set PDF directly. Writing in text therefore does not mean giving up
Word, because Quarto produces a .docx from the same source when a supervisor
wants to comment in Word.

## Part 4: your report as text and code (frames 22–29)

**Numbers from code (frames 23–24).** In Quarto a number in the text can come
straight from R: a chunk computes the median and formats it with two
decimals, and an inline expression writes it into the sentence, so it changes
with the data. Frame 24 shows a real cut-out of the PDF that Quarto and Typst
make of it, with the number marked. An AI that edits the text can neither
invent nor mistype that number, because the number lives in the code, and
when you check the code you check the number.

**A report as a folder of text files (frames 25–29).** A paper in Quarto can
be a small folder, and the clicks walk through it. `paper.qmd` is the main
document: it holds the settings and pulls in the sections in their order.
`references.bib` is your literature, one entry per source, from which Quarto
formats every citation. The folder `sections` holds one file per section,
with text and code. The last click renders the whole folder with Quarto and
Typst into one PDF. Every file is text, so an agent can read the whole
report, check one section against another and change a single line, and you
see every change before it is made.

## Part 5: meet the AI where it lives (frames 30–33)

**An agent works in the terminal (frame 31).** An AI agent types a command,
reads what comes back and decides on the next step. Quarto, Typst and LaTeX
each bring such a command (`quarto render`, `typst compile`, `latexmk`), so
an agent can render the paper, read the error messages and fix the source on
its own. Word has menus and buttons but no command to render or change a
document; there are detours such as Pandoc or scripts that remote-control
Word, but Word itself is built for a person with a mouse. An AI uses a tool
with a command line the same way you do, and Quarto, Typst and LaTeX all
bring one.

**The same idea elsewhere (frame 32).** More and more tools keep their files
as text and bring a command line. Excalidraw keeps every drawing as JSON
text, and its official command line interface, made "for humans and agents",
renders drawings and turns Mermaid text into editable drawings. Mermaid
writes a diagram as text, which GitHub, Quarto and Excalidraw draw. FFmpeg
cuts, converts and joins videos and audio with a single command, without an
editing program, which is why an agent can prepare a video as easily as a
paper. A CSV file is a table as plain text, while an .xlsx file is a packed
bundle like a .docx. An SVG file is a vector graphic as text, which an AI can
write and change line by line. And this deck is itself an HTML file and a
script, so an AI can build and change it like a paper in Quarto.

**A drawing is text too (frame 33).** One small drawing, a box "paper.qmd"
with an arrow to a box "paper.pdf", appears in two text formats. On the left
it is an Excalidraw file: JSON with one entry per element, a rectangle with
its position and size, a text that sits in the rectangle and an arrow with
its points. Real files add colors, a seed for the hand-drawn look and a
version to every element, which the slide leaves out. On the right the same
drawing is SVG, the vector format of the web, with a rectangle, a text and a
line with an arrowhead; every figure in this deck is SVG, written by a
script. An agent can draw by writing text, and you can read what it drew.

**Closing (frame 34).** The picture closes the circle of the opening: the
parcel is open and empty, and a human hand and a robotic hand write in the
same open notebook. Write your report as text, because then an AI can read,
change and check it the same way you do.

## Sources

- Positron icon: posit-dev/positron,
  `src/vs/workbench/browser/media/positron-icon.svg`. Positron and the
  Positron icon are trademarks of Posit Software, PBC.
  https://github.com/posit-dev/positron
- Excalidraw CLI, official command line interface for humans and agents.
  https://github.com/excalidraw/cli
- Mermaid. https://mermaid.js.org
- FFmpeg. https://ffmpeg.org
