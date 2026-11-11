---
title: "Exercise: Setting up your own paper with Quarto"
summary: >-
  The course assistant creates the template for your paper with /paper; you
  render it, find your way around its header and sections and make it yours
  with your question, a number from R, a citation and a first figure of your
  own.
objectives:
  intro: "In this exercise you set up the paper you will write in until submission, and afterwards you can:"
  goals:
    - "create the template of the paper with the course assistant and render it as a PDF"
    - "say what is in paper.qmd and what is in the files under sections/"
    - "put a number from R into the text and cite a source from references.bib"
    - "add a figure of your own with a label and a caption and refer to it in the text"
    - "read an error when rendering and fix it with the assistant"
translation_of: de
based_on: 2026-11-11
---

Your paper is made with Quarto from one source in which text, R code,
figures and references live together, and you do not have to set it up by
hand: with the command `/paper`, the
[[opencode-course-assistant|course assistant]] in your course folder copies
a template, fills in title, topic, question and names and renders it once
as a PDF. In this exercise you create the template and turn it into your
paper step by step. What the individual building blocks mean is explained
in the lesson [[quarto-first-steps|First steps with Quarto]], and what
belongs in which section in [[paper-structure|How a scientific paper is
built]].

One person in the group creates the paper. The others then get the folder
`my-code/paper/` as a copy in their own course folder, and because every
section is a file of its own, you hardly get in each other's way while
writing. Nobody passes on the data; everyone has it from ILIAS.

## Part 1: Creating the template

1. Get the latest state of the course folder, so that the command `/paper`
   is there:

   ```text
   /update-semester
   ```

2. Start the template:

   ```text
   /paper
   ```

   The assistant asks for a working title, the special topic, the research
   question and the authors. Everything may be provisional; for the
   question, take the version you worked out in the exercise
   [[research-question-exercise|Sharpening your own research question]], or
   the one you have right now.

3. When the assistant reports `FERTIG` (done), open the PDF and leaf through
   it: title page, abstract, table of contents, the sections with their
   examples and the references.

> [!HINT]
> If the assistant reports an error, let it explain the last lines. Most
> often the file `data/mds12_schoko_milch.csv` is missing; it comes from
> ILIAS into the folder `data/` of your course folder. On a Mac, XQuartz may
> be missing the first time you render, and the assistant helps with that
> too.

## Part 2: Finding your way around the template

4. Open the folder `my-code/paper/` in Positron and get an overview:

   ```text
   my-code/paper/
     paper.qmd          the central document: header, loading the data, including the sections
     references.bib     the references
     sections/
       _introduction.qmd
       _methods.qmd
       _results.qmd
       _discussion.qmd
       _conclusion.qmd
       _ai-use.qmd      statement on the use of AI, part of the submission
   ```

5. Open `paper.qmd` and render it yourselves with **Preview**. Only
   `paper.qmd` is ever rendered, even while you are writing in a section; it
   pulls in the sections with `{{< include … >}}`.

6. Open the sections one after the other and read the comments between
   `<!--` and `-->`: they say what belongs in the section and do not appear
   in the PDF.

## Part 3: Making the template yours

7. In `sections/_introduction.qmd`, write two or three sentences above your
   question on why the topic matters, citing Döring with a page number,
   such as `[@doering2023, S. 150]`. Check that the research question stands
   at the end of the introduction.

8. In `sections/_methods.qmd`, add under "Daten" (data) that you analyse an
   existing survey, which makes it a secondary analysis, and who collected
   it. The number of respondents is already there as inline R,
   `` `r nrow(survey)` ``; following this pattern, put a second number into
   the text, such as how many respondents answered a question you need.

9. In `sections/_results.qmd`, replace the example figure with a first
   figure of your own for a column of your question: copy the block, give
   it a new label starting with `fig-`, a caption in `fig-cap` and your
   columns, and refer to it with `@fig-…` in the sentence above.

10. Render again and check in the PDF: the figure has a number, the
    reference in the text gives the same one, the number from R is in the
    sentence, and Döring appears under "Literatur" (references).

> [!HINT]
> This is what a block for a figure looks like, here with the size of the
> place of residence; put in your own column:
>
> ````markdown
> ```{r}
> #| label: fig-city-size
> #| fig-cap: "Respondents by size of their place of residence"
> #| fig-width: 6
> #| fig-height: 3.5
> survey |>
>   ggplot() +
>   aes(x = D044stadtf) +
>   geom_bar() +
>   labs(x = "Place of residence", y = "Number of respondents")
> ```
> ````
>
> The text above it then reads something like: "@fig-city-size shows how
> the respondents are distributed over the size of their place of
> residence." At this point a figure is not yet an answer to your question;
> what matters is that the way from the code into the PDF works.

## Part 4: A first round of feedback

11. Ask the assistant for feedback on the structure as soon as a section
    has text of your own, for example the introduction:

    ```text
    /paper-feedback introduction
    ```

    It shows what holds in the section and what belongs in another one, and
    it rewrites nothing unless you ask it to.

12. In `sections/_ai-use.qmd`, record what you used the assistant for in
    this exercise: creating the template, errors when rendering, feedback on
    the structure.

## What comes next

From now on the paper grows with your analysis: every figure and table that
answers your question goes into the results with a label and a caption, and
every number in the text comes from R, so that it is right when something
in the preparation changes. Delete the examples from the template as soon
as you have your own. Render often, because an error is quickly found when
little has been added since the last render.
