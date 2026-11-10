---
title: First steps with Quarto
summary: >-
  Everything you need for a scientific paper in Quarto: header, Markdown, R
  code with figures and tables, numbers from the code in the text,
  cross-references, formulas, citations and rendering to PDF via Typst.
objectives:
  intro: "In this lesson you learn to write a paper in Quarto in which text, code and results live in one source, and afterwards you can:"
  goals:
    - "explain what happens when a Quarto document is rendered and why it has to load everything it needs itself"
    - "write the header of a paper in YAML, with title, authors, abstract, language and the Typst format on A4"
    - "structure and mark up text in Markdown, with headings, lists, links and footnotes"
    - "run R code in chunks and control with options what appears in the PDF"
    - "create figures and tables from code with captions and refer to them in the text"
    - "have numbers in the text computed by the code instead of typing them"
    - "set formulas, cite literature from a BibTeX file and create a reference list"
    - "recognise and fix the most common rendering errors"
translation_of: de
based_on: 2026-11-10
---

![Slides: First steps with Quarto](item:quarto-first-steps-slides)

Most reports are made by copying: a chart is created in R, exported and
pasted into Word, and a number is typed into the text by hand. If a filter
changes afterwards, the report is no longer correct, and nobody notices.
[Quarto](https://quarto.org) turns this around. A Quarto document contains
the text and the code that computes the results, and when it is rendered it
computes itself: figures, tables and every number in the text come fresh
from the data. This lesson shows everything you need for that with a small
paper about the [[milk-survey-compact]].

## What you need

Quarto is already included in Positron, and Quarto brings along Typst, the
program that typesets the document as a PDF. All you still have to install
is the R package rmarkdown, through which Quarto runs the R code. Run this
line once in the console:

```r static
install.packages("rmarkdown")
```

How to set up R and Positron is described in [[eda-software]].

## One document, three ingredients

A Quarto document is a text file with the extension `.qmd`. You create it in
Positron via *File → New File → Quarto Document* and save it in your project
folder, for instance as `milk-prices.qmd`. The file consists of exactly
three things:

1. a **header** between two lines of three dashes, which holds information
   about the whole document,
2. **text** in Markdown,
3. **R code** in chunks, which are run when rendering.

When **rendering**, Quarto first runs all the R code from top to bottom in a
fresh R session and puts the results in place of the chunks. It hands the
result to Typst, which typesets the PDF. Two rules follow from this that
explain most error messages: the document has to load everything it needs
itself, even if it is already loaded in your console, and an error in the
code stops the rendering.

## The header

The header holds everything that concerns the document as a whole. It is
written in YAML: a name, a colon, a value, and whatever belongs together is
indented with spaces, never with tabs. For a paper in English it looks like
this:

```yaml
---
title: "What is milk worth?"
subtitle: "An analysis of the survey on milk and chocolate"
author:
  - name: Erika Muster
    affiliation:
      - name: Osnabrück University of Applied Sciences
  - name: Max Beispiel
date: today
lang: en
abstract: |
  Two or three sentences that summarise the whole paper.
format:
  typst:
    papersize: a4
    number-sections: true
    toc: false
bibliography: references.bib
execute:
  echo: false
  warning: false
---
```

The most important lines:

- `lang` sets hyphenation and labels such as "Figure" and "Table"; with
  `lang: de` they become German.
- `format: typst` renders the document as a PDF via Typst.
- `papersize: a4` is needed because Quarto otherwise uses the American
  Letter format.
- `number-sections: true` numbers the sections; only then do references to
  sections show a number.
- `execute: echo: false` hides the R code in the whole document, so that the
  PDF shows only the results. In a paper that is the normal case.

## Text in Markdown

Markdown is text with a few characters for the form. You write the content,
and the form comes from the template:

```markdown
# Introduction

Milk is one of the most frequently bought foods. We ask **how much** it is
worth to respondents and use an *online survey* for this.

- an item of a list
- a second item

1. a numbered item
2. a second one

More about Quarto is on [quarto.org](https://quarto.org).^[A footnote is
written right in the text.]
```

One hash makes a heading, two hashes a subheading. A blank line must come
before every list, otherwise it becomes running text in one line; that is
the most common silent error in Markdown.

## Sections you can point to

A heading gets a label in curly braces that starts with `sec-`. In the text
you refer to this label with `@`, and Quarto turns it into "Section 2", even
if the structure changes later:

```markdown
# Method {#sec-method}

How we prepared the data is described in @sec-method.
```

Write labels in lowercase and without underscores, so `sec-method` and not
`sec_Method`.

## R code in chunks

A code chunk begins with three backticks and `{r}` and ends with three
backticks. Lines starting with `#|` are options for this chunk; Quarto
reads them, R ignores them. The first chunk loads the packages and the data
in every document:

````markdown
```{r}
#| label: setup
#| message: false
library(tidyverse)

survey <- read_csv("milk_survey_compact.csv")
```
````

The path to the file is relative to the document: if the CSV file lies in
the same folder as the `.qmd` file, its name is enough.

With the options you control what appears in the PDF:

| Option | Effect |
|---|---|
| `echo: false` | the code runs but is not shown; the result appears |
| `include: false` | the code runs, but neither code nor result appear |
| `eval: false` | the code is shown but not run |
| `warning: false` | warnings do not appear in the document |
| `message: false` | messages, for instance when loading a package, do not appear |

Whatever should apply to the whole document you set in the header under
`execute:` instead of writing it into every chunk.

## Figures

A figure comes from a chunk that draws a chart. So that it gets a number and
a caption and you can refer to it, the chunk needs a label starting with
`fig-` and a caption with `fig-cap`:

````markdown
```{r}
#| label: fig-threshold
#| fig-cap: "Price at which a litre of milk is too expensive."
#| fig-width: 6
#| fig-height: 3.5
survey |>
  filter(price_too_expensive <= 5) |>
  ggplot() +
  aes(x = price_too_expensive) +
  geom_histogram(binwidth = 0.25) +
  labs(x = "Price in euros", y = "Number of respondents")
```
````

Without `fig-` at the start of the label it is not a figure you can refer
to. Width and height are in inches; 6 by 3.5 fits well on an A4 page.

## Tables

The same applies to tables with `tbl-` and `tbl-cap`. You turn a data frame
into a typeset table with `knitr::kable()`; this works reliably with Typst:

````markdown
```{r}
#| label: tbl-diet
#| tbl-cap: "Respondents by diet."
survey |>
  count(diet) |>
  arrange(desc(n)) |>
  knitr::kable(col.names = c("Diet", "Count"))
```
````

A small table that does not come from the data you write directly in
Markdown and give it its caption in a line below:

```markdown
| Part         | Pages |
|--------------|------:|
| Introduction |     1 |
| Method       |     2 |

: Length of the parts {#tbl-parts}
```

## References to figures and tables

In the text you refer with `@` and the label. Quarto numbers them and puts
the right word in front, and the numbers stay correct after you have
rearranged figures:

```markdown
As @fig-threshold shows, most answers lie below two euros.
The respondents' diets are listed in @tbl-diet.
```

Never write "the figure below", because where "below" is depends on the page
break.

## Numbers in the text

This is the part that replaces typing: a number in a sentence can be R code.
Between single backticks with `{r}` in front, the expression is computed
when rendering and the result is inserted:

```markdown
In total, `{r} nrow(survey)` people took part. The median price threshold
is `{r} median(survey$price_too_expensive, na.rm = TRUE)` euros.
```

Longer computations you put into a chunk with `include: false` and insert
only the result in the text:

````markdown
```{r}
#| include: false
median_threshold <- survey |>
  summarize(median = median(price_too_expensive, na.rm = TRUE)) |>
  pull(median)
```

The median price threshold is `{r} median_threshold` euros.
````

Write every value that comes from the data this way. If the data change,
the sentence changes with them.

## Formulas

Formulas stand between dollar signs, with one inside a sentence and with two
as a line of their own. The notation is that of LaTeX, and a displayed
formula gets a label like a figure, here with `eq-`:

```markdown
The mean $\bar{x}$ is defined as

$$
\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_i
$$ {#eq-mean}

We use @eq-mean for all prices.
```

There must be no blank line inside `$$`.

## Citing

The literature lives in a file of its own in BibTeX format, for instance
`references.bib` next to the document. Google Scholar, reference managers
such as Zotero and the publishers' pages give you an entry for it:

```text
@book{doering2023,
  author    = {Döring, Nicola},
  title     = {Forschungsmethoden und Evaluation in den Sozial- und
               Humanwissenschaften},
  edition   = {6},
  publisher = {Springer},
  year      = {2023},
  doi       = {10.1007/978-3-662-64762-2}
}
```

The header contains `bibliography: references.bib`, and in the text you
cite with `@` and the key of the entry:

```markdown
A research question narrows down the topic [@doering2023, p. 148].
As @doering2023 shows, ...

# References {.unnumbered}

::: {#refs}
:::
```

Square brackets put the citation in parentheses, without them the name
stands in the sentence. The reference list appears where the `{#refs}`
block is, otherwise at the end of the document. The citation style is set
by `csl:` in the header, for instance `csl: apa.csl` with a file from the
[Zotero Style Repository](https://www.zotero.org/styles). With Typst, Typst
handles citations itself; if you want exactly the style of a CSL file, add
`citeproc: true` to the header.

## Rendering

In Positron the **Preview** button above the editor renders the document,
and the PDF appears in the *Viewer* pane next to it. In the terminal the
same is done by

```text
quarto render milk-prices.qmd
```

The PDF then lies next to the `.qmd` file.

## When rendering fails

Most errors come from four causes, and the message tells you which:

1. **`could not find function`:** a package is not loaded. The document
   renders in a fresh session and only knows what it loads itself; the
   `library()` call belongs in the first chunk.
2. **`does not exist` when reading:** the file is not where the path,
   relative to the document, points.
3. **An error in the YAML:** usually the indentation is wrong or a colon in
   the title stands without quotation marks.
4. **`?@fig-...` in the PDF:** the label does not start with `fig-` or
   `tbl-`, or it is spelled differently than in the reference.

Two errors do not stop the rendering but show in the PDF: a list without a
blank line before it, which becomes running text, and a PDF in Letter
format because `papersize: a4` is missing. If none of this helps, paste the
message into the chat with your AI agent.

## The whole example to download

The small paper from the slides is shown here in full. Put both files
together with `milk_survey_compact.csv` from the [[milk-survey-compact]]
into one folder, open the `.qmd` file in Positron and render it. First the
document itself:

````markdown file=milk-prices.qmd
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

<!-- This paper reads the compact milk survey from the file
     milk_survey_compact.csv, which must lie in the same folder. -->

```{r}
#| label: setup
#| message: false
library(tidyverse)

survey <- read_csv("milk_survey_compact.csv")
```

## Introduction

Milk is one of the few foods whose price many shoppers know by heart. We ask
from which price on a litre is *too expensive*, and we look at the whole
distribution of the answers before we summarise it [@wickham2023, chap. 10].

## Method {#sec-method}

The data come from an online survey with a **quota sample** of people who do
their own shopping. Each respondent saw one of two brands of milk, chosen at
random, and named the price from which it would be too expensive. We use

- `price_too_expensive`, the price in euros, and
- `diet`, the diet the respondents named.

We summarise the prices with the median rather than the mean

$$
\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_i
$$

because a few answers lie far above any real price.^[Some answers reach 999
euros, a common code for "don't know".]

## Results

```{r}
#| label: fig-threshold
#| fig-cap: "Price at which milk is too expensive."
survey |>
  filter(price_too_expensive <= 5) |>
  ggplot() +
  aes(x = price_too_expensive) +
  geom_histogram(binwidth = 0.25)
```

@fig-threshold shows the answers up to five euros.

The median threshold is
`{r} median(survey$price_too_expensive, na.rm = TRUE)`
euros.

```{r}
#| label: tbl-diet
#| tbl-cap: "Respondents by diet."
survey |>
  count(diet, sort = TRUE) |>
  knitr::kable()
```

Most respondents eat meat, see @tbl-diet.

## Discussion

As described in @sec-method, the respondents form a quota sample and not a
random one, so the thresholds describe the people who took part and not all
of Germany.
````

Next to it goes the bibliography file that the header points to with
`bibliography:`:

```text file=references.bib
@book{wickham2023,
  author = {Wickham, Hadley and
    Çetinkaya-Rundel, Mine and
    Grolemund, Garrett},
  title = {R for Data Science},
  edition = {2},
  publisher = {O'Reilly},
  year = {2023},
  url = {https://r4ds.hadley.nz}
}
```

## Takeaways

- A Quarto document consists of a header in YAML, text in Markdown and R
  code in chunks, and when rendered it computes itself.
- The document loads everything it needs itself, and an error in the code
  stops the rendering.
- Figures get a label with `fig-`, tables with `tbl-`, sections with `sec-`,
  and you refer to each with `@`.
- Every number that comes from the data stands as `` `{r} ...` `` in the
  text.
- Literature lives in a BibTeX file and is cited with `[@key]`.
- For a PDF in German, `lang: de`, `format: typst` and `papersize: a4` belong
  in the header.
