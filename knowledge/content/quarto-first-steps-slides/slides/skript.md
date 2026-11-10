# First steps with Quarto

The text to the slides, in their order. Frame numbers count every build-up
step, as in the PDF. The example paper `milk-prices.qmd` and its
`references.bib` lie in `example/` next to this script; they render with the
compact milk survey saved as `milk_survey_compact.csv` in the same folder.
Every crop of a PDF on the slides comes from that rendered paper.

**Scissors and glue (frame 3).** This is how most reports come about: a chart
is made in R, exported and pasted into Word, and a number is typed into the
text by hand. When a filter changes, the report no longer matches the
analysis, and nobody notices. Every time the data change, someone has to copy
the chart into the report again, unless the report computes the chart itself.
Quarto turns this around, because the report contains the code and computes
itself every time it is rendered.

## Part 1: one source

**Copy and paste (frames 5 and 6).** Results reach a Word document on three
paths: a chart is exported, a table is copied and a number is typed in. Each
of them is manual work that would have to be repeated after every change. As
soon as one line of the script changes, for example a filter, nobody knows
whether the chart, the table and the number in the report are still right,
unless someone goes down all three paths again.

**Poll: what do you write longer texts in (frames 7 and 8)?** A poll without
a right answer, with the options Word, Google Docs, LaTeX or Typst, Markdown
and something else. Both Word and Google Docs are fine for text; the trouble
only starts when results from an analysis have to get into the text.

**One source (frames 9 to 12).** A Quarto document is a text file with the
ending `.qmd`. It consists of exactly three things: a header between two
lines of three dashes with information about the whole document, text in
Markdown, and R code in chunks that runs when the document is rendered. There
is nothing more to learn than these three, and everything else is a detail of
one of them.

**What rendering does (frames 13 to 17).** When you render, Quarto first
hands the document to knitr, which runs all R code from top to bottom in a
fresh R session. Out comes a Markdown file in which the results stand where
the code was: the chart, the table, the numbers. Typst then sets this
Markdown file into a PDF, and one command, `quarto render milk-prices.qmd`,
runs the whole chain. Two rules follow from it: the document has to load
everything it needs itself, and an error in the code stops the rendering.

**The sentence of the input (frame 18).** The document is the analysis, so a
number in the text can only be wrong if the code is wrong. Nothing is copied
by hand any more, and every number in the paper comes from code that anyone
can check, run again and pass on.

## Part 2: writing

**The header (frame 20).** The header of the example paper:

```yaml
---
title: "What is milk worth?"
author: "Group 4"
date: today
lang: en
abstract: |
  We ask from which price on a litre
  of milk is too expensive for shoppers.
format:
  typst:
    papersize: a4
    number-sections: true
execute:
  echo: false
bibliography: references.bib
csl: apa
---
```

The header is written in YAML: a name, a colon, a value, and indentation with
spaces. It holds everything that concerns the document as a whole and the
format it is rendered to. `typst` means that the PDF is set by Typst, which
comes with Quarto. `papersize: a4` is needed because Quarto's default is US
letter. `date: today` puts in the day of rendering, `lang: en` sets English
hyphenation and labels (`lang: de` gives German ones such as "Abbildung"),
`number-sections: true` numbers the headings, and `echo: false` under
`execute` hides the code in the whole paper so that only the results appear.
`bibliography` names the file with the sources and `csl` the citation style.

**Markdown (frame 21).** Markdown is text with a few characters for the form:
`##` for a heading, `**important**` for bold, `*survey*` for emphasis, a dash
at the start of a line for a list item, `[quarto.org](https://quarto.org)` for
a link and `^[a footnote]` for a footnote. You write the content, and the
form comes from the template. In the PDF the heading carries a number,
because the header switches on `number-sections`.

**Sections you can point to (frame 22).** A heading gets a label, as in
`## Method {#sec-method}`, and the text points to it with
`As described in @sec-method`. Quarto writes "Section 2" and counts correctly
even when the outline changes; the number appears only with
`number-sections: true`.

**Math (frame 23).** Formulas stand between dollar signs, a single one inside
a sentence and a double one for a formula on its own line, such as
`$$\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_i$$` for the mean. The notation is
that of LaTeX, and every AI assistant can write it for you if you describe
the formula.

## Part 3: code and results

**A code chunk (frame 25).** A chunk starts with three backticks and `{r}`
and ends with three backticks. Lines that start with `#|` are options for
this chunk: Quarto reads them, and R ignores them as comments. The setup
chunk of the example loads the tidyverse and the data, with `message: false`
so that the messages of loading do not end up in the paper. The file name is
relative to the document, so the CSV file lies in the same folder as the
`.qmd`.

**Chunk options (frame 26).** `echo: false` runs a chunk and shows its
result but not its code, which is what a paper usually wants. `include:
false` runs a chunk and shows nothing, `eval: false` shows code without
running it, and `warning: false` and `message: false` hide what R prints on
the side. For the whole paper, `echo: false` is set once in the header under
`execute:` instead of in every chunk.

**A figure (frame 27).** A figure needs a label that starts with `fig-` and a
caption:

```r
#| label: fig-threshold
#| fig-cap: "Price at which milk is too expensive."
survey |>
  filter(price_too_expensive <= 5) |>
  ggplot() +
  aes(x = price_too_expensive) +
  geom_histogram(binwidth = 0.25)
```

Without `fig-` at the start it is no figure you can refer to. The filter
keeps the answers up to five euros; a few answers up to 999 euros would
otherwise stretch the axis until the distribution disappears. Quarto numbers
the figure and writes "Figure 1" in front of the caption.

**A table (frame 28).** The same for tables, with `tbl-` and `tbl-cap`. The
chunk counts the diets with `count(diet, sort = TRUE)` and turns the data
frame into a set table with `knitr::kable()`; packages such as gt or
tinytable make nicer ones. The table shows 1,826 omnivores, 749
flexitarians, 134 vegetarians, 36 pescetarians, 36 vegans and 28 people
without an answer (NA).

**Numbers in the text (frames 29 and 30).** This replaces typing numbers by
hand. A number in a sentence is R code between backticks with `{r}` in front:
`` The median threshold is `{r} median(survey$price_too_expensive, na.rm = TRUE)` euros. ``
In the PDF this reads "The median threshold is 1.99 euros", and when the data
change, the number changes with them. Every value that comes from the data
belongs in the text this way.

## Part 4: the scholarly apparatus

**Cross-references (frames 32 and 33).** Never write "the figure below", but
point to the label: `@fig-threshold shows the answers up to five euros` and
`see @tbl-diet`. Quarto writes "Figure 1" and "Table 1", and the numbers stay
right after you move things around.

**Citations (frames 34 to 36).** The literature lives in a file of its own in
BibTeX format, here `references.bib` with one entry under the key
`wickham2023`; every reference manager and Google Scholar export this format.
In the text you cite with an at sign and the key in square brackets, with a
page or chapter if you like: `[@wickham2023, chap. 10]`. In the PDF the
citation appears in the style the header asks for, here APA through
`csl: apa`, as "(Wickham et al., 2023, chap. 10)", and the entry lands in the
bibliography at the end.

**Quiz: which label lets you write `@fig-prices` (frames 37 to 39)?** The
answer is `label: fig-prices`. The label must start with `fig-` for a figure,
and the reference repeats it exactly with an at sign in front; `figure-` is
not recognised, and `fig-cap` is the caption, not the label.

## Part 5: rendering

**Render (frame 41).** In Positron the Preview button above the editor
renders the document, and the PDF appears in the Viewer next to it; the
commands "Quarto: Preview" and "Quarto: Render Document" in the command
palette do the same. In the terminal, `quarto render milk-prices.qmd` renders
it. Positron brings Quarto along, and Quarto brings Typst along, so the only
thing to install is the R package rmarkdown. The button on the slide is drawn
after Positron and may look a little different there.

**When rendering fails (frames 42 to 46).** The four most common causes, each
with the line that gives it away:

- a package is not loaded: `could not find function "ggplot"`. The document
  renders in a fresh R session, so a package that was only loaded in the
  console is unknown to it;
- a file is not found: `does not exist in current working directory`. A path
  is relative to the document;
- the header is indented wrongly: `Validation of YAML front matter failed.`;
- a label without `fig-` or `tbl-`: the PDF shows `?@fig-threshold` where
  the reference should be.

Two errors stop nothing and are therefore easy to miss: without a blank line
before it, a list becomes running text, and without `papersize: a4` the page
is US letter.

**The tidy desk (frame 47).** Write the analysis once, render as often as you
like, and every number in the paper stays the one the data give. From now on
every change to the data is a click on render instead of an afternoon of
copying. To try it, put `milk-prices.qmd`, `references.bib` and
`milk_survey_compact.csv` into one folder and render the paper yourself.
