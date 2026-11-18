---
title: "Exercise: A small report with Quarto"
summary: >-
  A template that holds nothing but its header grows in small steps into a
  two-page report on the respondents of the survey, and along the way you use
  everything the slides on Quarto show: header, Markdown, formula, code chunk,
  figure, table, numbers in the text, cross-references and a citation.
objectives:
  intro: "In this exercise you build a small report in one single file, and afterwards you can:"
  goals:
    - "extend the header of a Quarto document with an abstract, section numbers and `echo: false`"
    - "write headings, emphasis, a list, a link, a footnote and a formula in Markdown"
    - "load the survey in a code chunk and produce a figure and a table with a label and a caption"
    - "put numbers from R into the text instead of typing them"
    - "refer to sections, figures and tables and cite a source"
translation_of: de
based_on: 2026-11-18
---

The slides [[quarto-first-steps-slides|First steps with Quarto]] show the
building blocks of a Quarto document in a finished example. In this exercise
you put them together yourself: you download a template that holds nothing
but its header and fill it step by step until it is a small report on who
took part in the [[milk-chocolate-survey|survey on milk and chocolate]]. You
work in one single file the whole time.

Render with **Preview** after every step and look at the PDF. Then you find
an error right away, while little has changed since the last render.

## Getting ready

1. Create a new folder `quarto-exercise` and save two files in it: the
   template [`report.qmd`](media/report.qmd) and the survey
   `mds12_schoko_milch.csv` from the box at the top of this page (or from
   ILIAS). Both must lie in the same folder, because the report reads the
   data by a file name without a path.

2. Open the folder in Positron and in it `report.qmd`. Put your name after
   `author` and render with **Preview**. So far the PDF shows only the
   title, your name and today's date.

> [!HINT]
> If rendering stops before a PDF appears, the package rmarkdown is usually
> missing. Install it once in the console with
> `install.packages("rmarkdown")` and render again.

## Part 1: the header

3. Add an abstract of one or two sentences to the header, switch on the
   section numbers under `typst`, and hide the code in the whole report under
   `execute`. Mind the indentation with spaces.

> [!SOLUTION]
> ```yaml
> ---
> title: "Who took part in the survey?"
> author: "Your name"
> date: today
> lang: en
> abstract: |
>   We describe who took part in the survey on milk and chocolate:
>   how old the respondents are and what they eat.
> format:
>   typst:
>     papersize: a4
>     number-sections: true
> execute:
>   echo: false
> ---
> ```
>
> The abstract appears below the date. You only see the numbers and the
> hidden code once there are headings and code.

## Part 2: text in Markdown

4. Below the header, write four second-level headings: Introduction, Data,
   Results and Discussion. Give the heading "Data" the label `{#sec-data}` so
   that you can refer to it later.

> [!SOLUTION]
> ```markdown
> ## Introduction
>
> ## Data {#sec-data}
>
> ## Results
>
> ## Discussion
> ```
>
> In the PDF the headings now carry the numbers 1 to 4, because the header
> sets `number-sections: true`.

5. Under "Introduction", write two or three sentences on what the report is
   about. Put one word in **bold** and one in *italics*, link the page of the
   survey on this platform, and add a footnote, for example on who ran the
   survey.

> [!SOLUTION]
> ```markdown
> Every report on a survey starts with the question of **who** answered. Only
> then can you say whom the results apply to. We describe the respondents of
> the
> [survey on milk and chocolate](https://hands-on-computer-science.de/ds/en/items/milk-chocolate-survey/)
> by age and *diet*.^[Prof. Dr. Ulrich Enneking ran the survey in November
> 2025.]
> ```
>
> A line break in the source is no line break in the PDF: only an empty line
> starts a new paragraph.

6. Under "Data", list the three columns you work with: `Q002alter` (age in
   years), `Q004geschlechtf` (gender) and `V041nofleischf` (diet). Put
   column names in backticks so that they appear as code. Then add the
   formula for a share, *p* = *k* / *n*, as a formula on its own line, and explain
   *k* and *n* in the sentence below.

> [!SOLUTION]
> ```markdown
> We use three columns:
>
> - `Q002alter`, the age in years,
> - `Q004geschlechtf`, the gender, and
> - `V041nofleischf`, the diet.
>
> We compute shares as
>
> $$
> p = \frac{k}{n},
> $$
>
> where $k$ is the number of respondents with a property and $n$ the number
> of all respondents who answered the question.
> ```
>
> Without the empty line before the list, Quarto runs the items into the
> sentence before it. Nothing stops, so you only notice it in the PDF.

## Part 3: code and results

7. Directly below the header, add a code chunk that loads the tidyverse and
   reads the survey as `survey`. Give it the label `setup` and the option
   `message: false`. Render: nothing changes in the PDF. Why?

> [!SOLUTION]
> ````markdown
> ```{r}
> #| label: setup
> #| message: false
> library(tidyverse)
>
> survey <- read_csv("mds12_schoko_milch.csv")
> ```
> ````
>
> The chunk runs, but it has no visible result: `echo: false` in the header
> hides the code, and `message: false` hides the messages of loading.

8. Start the section "Data" with a sentence that says how many people took
   part in the survey. Do not type the number, let R compute it.

> [!SOLUTION]
> ```markdown
> `{r} nrow(survey)` people took part in the survey.
> ```
>
> The PDF says 2811. When the data change, for example because you exclude
> respondents, the number changes with them at the next render.

9. Under "Results", draw a histogram of the age with bars five years wide.
   Give the chunk a label that starts with `fig-` and a caption. Below it,
   write a sentence that refers to the figure with `@fig-…`.

> [!SOLUTION]
> ````markdown
> ```{r}
> #| label: fig-age
> #| fig-cap: "Age of the respondents."
> #| fig-width: 6
> #| fig-height: 3.5
> survey |>
>   ggplot() +
>   aes(x = Q002alter) +
>   geom_histogram(binwidth = 5) +
>   labs(x = "Age in years", y = "Number of respondents")
> ```
>
> @fig-age shows how old the respondents are.
> ```
> ````
>
> Quarto numbers the figure and writes "Figure 1" in the text, because the
> header sets `lang: en`. `fig-width` and `fig-height` give the size in
> inches and may be left out.

10. Add two more numbers from R to the sentence below the figure: the median
    age and the share of women in percent, rounded to whole numbers. The
    column `Q004geschlechtf` holds the values `Frauen` (women) and `Männer`
    (men).

> [!SOLUTION]
> ```markdown
> @fig-age shows how old the respondents are. Half of them are younger than
> `{r} median(survey$Q002alter)` years, and
> `{r} round(mean(survey$Q004geschlechtf == "Frauen", na.rm = TRUE) * 100)`
> percent are women.
> ```
>
> The PDF says: "Half of them are younger than 50 years, and 53 percent are
> women." The mean of a comparison with `==` is the share of rows in which it
> holds, which is exactly the *k* / *n* of your formula.

11. Below it, make a table of how many respondents follow which diet, with
    the count and the share in percent, sorted by count. Give the chunk a
    label that starts with `tbl-` and a caption, and refer to the table in the
    sentence below.

> [!SOLUTION]
> ````markdown
> ```{r}
> #| label: tbl-diet
> #| tbl-cap: "Respondents by diet."
> survey |>
>   count(V041nofleischf, sort = TRUE) |>
>   mutate(share = round(n / sum(n) * 100, 1)) |>
>   knitr::kable(col.names = c("Diet", "Count", "Share in %"))
> ```
>
> Most respondents eat meat without restriction, as @tbl-diet shows.
> ```
> ````
>
> `knitr::kable()` turns the data frame into a set table, and `col.names`
> gives the columns names for readers. The 28 people without an answer stand
> as `NA` in the last row.

## Part 4: references and sources

12. Under "Discussion", write two sentences on whom the numbers apply to.
    Refer to the section "Data" instead of writing "above". The respondents
    come from an online panel with quotas for age, gender and federal state.

> [!SOLUTION]
> ```markdown
> As described in @sec-data, the data come from an online survey with quotas
> for age, gender and federal state. Such a quota sample is not a random
> sample, so the numbers describe the people who took part and not all of
> Germany.
> ```
>
> The PDF says "Section 2", and the number stays right even when you later
> add a section before it.

13. Back up the statement on the quota sample with the textbook by Döring
    (2023). To keep everything in one file, the source stands in the header
    instead of a file `references.bib` of its own. Copy the block below into
    the header, add the line `citeproc: true` under `typst`, put
    `[@doering2023]` after "not a random sample", and end the report with a
    heading for the references.

    ```yaml
    references:
      - id: doering2023
        type: book
        author:
          - family: Döring
            given: Nicola
        issued:
          year: 2023
        title: "Forschungsmethoden und Evaluation in den Sozial- und Humanwissenschaften"
        edition: 6
        publisher: Springer
        publisher-place: Berlin
        DOI: 10.1007/978-3-662-64762-2
    ```

> [!HINT]
> On the slides the references live in `references.bib`, and Typst sets the
> citations itself. Typst does not know a source in the header; with
> `citeproc: true` Pandoc takes over the citing, and without the line
> rendering stops with `label <doering2023> does not exist`. The references
> then appear where `::: {#refs}` stands.

> [!SOLUTION]
> In the header:
>
> ```yaml
> format:
>   typst:
>     papersize: a4
>     number-sections: true
>     citeproc: true
> ```
>
> In the text and at the end:
>
> ```markdown
> Such a quota sample is not a random sample [@doering2023], so the numbers
> describe the people who took part and not all of Germany.
>
> ## References {.unnumbered}
>
> ::: {#refs}
> :::
> ```
>
> The PDF says "(Döring 2023)", with the full entry under "References".
> `{.unnumbered}` keeps the references out of the numbering. With a page you
> cite as `[@doering2023, p. …]`, with the page you read.

## If you finish early

14. Build in errors on purpose, render and read what Quarto reports. Undo
    each error afterwards.
    - Put a `#` in front of `library(tidyverse)`.
    - Change the label `fig-age` to `age`, but not the reference.
    - Indent `papersize: a4` in the header by two more spaces.

> [!SOLUTION]
> Without `library(tidyverse)` R does not know `read_csv()`, and rendering
> stops with `could not find function "read_csv"`, on a computer set to
> German with `konnte Funktion "read_csv" nicht finden`; the line
> `Quitting from report.qmd:…` names the lines of the chunk. Without `fig-`
> at the start the chunk is no figure you can refer to, and the PDF shows
> `?@fig-age` without anything stopping. Quarto reports the wrong
> indentation as `YAMLException: bad indentation of a mapping entry`, with
> line and column in brackets.

15. Change `lang: en` in the header to `lang: de` and render again. What
    changes without you touching the text?

> [!SOLUTION]
> "Figure", "Table", "Section" and "Abstract" become "Abbildung", "Tabelle",
> "Kapitel" and "Zusammenfassung", and hyphenation follows the German rules.
> The words you wrote yourself stay English.

## The whole file

> [!SOLUTION]
> This is what `report.qmd` looks like at the end. Rendered, it gives two
> pages.
>
> ````markdown
> ---
> title: "Who took part in the survey?"
> author: "Your name"
> date: today
> lang: en
> abstract: |
>   We describe who took part in the survey on milk and chocolate:
>   how old the respondents are and what they eat.
> format:
>   typst:
>     papersize: a4
>     number-sections: true
>     citeproc: true
> execute:
>   echo: false
> references:
>   - id: doering2023
>     type: book
>     author:
>       - family: Döring
>         given: Nicola
>     issued:
>       year: 2023
>     title: "Forschungsmethoden und Evaluation in den Sozial- und Humanwissenschaften"
>     edition: 6
>     publisher: Springer
>     publisher-place: Berlin
>     DOI: 10.1007/978-3-662-64762-2
> ---
>
> ```{r}
> #| label: setup
> #| message: false
> library(tidyverse)
>
> survey <- read_csv("mds12_schoko_milch.csv")
> ```
>
> ## Introduction
>
> Every report on a survey starts with the question of **who** answered. Only
> then can you say whom the results apply to. We describe the respondents of
> the
> [survey on milk and chocolate](https://hands-on-computer-science.de/ds/en/items/milk-chocolate-survey/)
> by age and *diet*.^[Prof. Dr. Ulrich Enneking ran the survey in November
> 2025.]
>
> ## Data {#sec-data}
>
> `{r} nrow(survey)` people took part in the survey. We use three columns:
>
> - `Q002alter`, the age in years,
> - `Q004geschlechtf`, the gender, and
> - `V041nofleischf`, the diet.
>
> We compute shares as
>
> $$
> p = \frac{k}{n},
> $$
>
> where $k$ is the number of respondents with a property and $n$ the number
> of all respondents who answered the question.
>
> ## Results
>
> ```{r}
> #| label: fig-age
> #| fig-cap: "Age of the respondents."
> #| fig-width: 6
> #| fig-height: 3.5
> survey |>
>   ggplot() +
>   aes(x = Q002alter) +
>   geom_histogram(binwidth = 5) +
>   labs(x = "Age in years", y = "Number of respondents")
> ```
>
> @fig-age shows how old the respondents are. Half of them are younger than
> `{r} median(survey$Q002alter)` years, and
> `{r} round(mean(survey$Q004geschlechtf == "Frauen", na.rm = TRUE) * 100)`
> percent are women.
>
> ```{r}
> #| label: tbl-diet
> #| tbl-cap: "Respondents by diet."
> survey |>
>   count(V041nofleischf, sort = TRUE) |>
>   mutate(share = round(n / sum(n) * 100, 1)) |>
>   knitr::kable(col.names = c("Diet", "Count", "Share in %"))
> ```
>
> Most respondents eat meat without restriction, as @tbl-diet shows.
>
> ## Discussion
>
> As described in @sec-data, the data come from an online survey with quotas
> for age, gender and federal state. Such a quota sample is not a random
> sample [@doering2023], so the numbers describe the people who took part and
> not all of Germany.
>
> ## References {.unnumbered}
>
> ::: {#refs}
> :::
> ````

## To look things up

Everything in this exercise is covered in more detail in the Quarto
documentation:

- [Guide](https://quarto.org/docs/guide/): the way into all topics
- [Front Matter](https://quarto.org/docs/authoring/front-matter.html): title,
  authors, date and abstract in the header
- [Markdown Basics](https://quarto.org/docs/authoring/markdown-basics.html):
  headings, emphasis, lists, links, footnotes and formulas
- [Execution Options](https://quarto.org/docs/computations/execution-options.html):
  `echo`, `message`, `warning` and the other options of a code chunk
- [Inline Code](https://quarto.org/docs/computations/inline-code.html):
  numbers from R in the text
- [Figures](https://quarto.org/docs/authoring/figures.html) and
  [Tables](https://quarto.org/docs/authoring/tables.html): figures and tables
  with a label and a caption
- [Cross References](https://quarto.org/docs/authoring/cross-references.html):
  references to sections, figures and tables
- [Citations](https://quarto.org/docs/authoring/citations.html): citations and
  the list of references
- [Typst](https://quarto.org/docs/output-formats/typst.html): the format the
  PDF is made from, with all options under `typst:`
