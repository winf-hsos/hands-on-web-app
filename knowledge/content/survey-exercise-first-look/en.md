---
title: "R self-study, chapter 1: Getting to know the data set"
summary: >-
  Six tasks for a first look at the milk and chocolate survey: how large it is,
  who is who, how the columns are named and what is not in them.
objectives:
  intro: "In this chapter you get to know the full data set of the survey before you calculate with it, and afterwards you can:"
  goals:
    - "determine the size of a data set and say what a row and what a column stands for"
    - "check with `n_distinct()` whether a column identifies every observation uniquely, and create an identifier of your own with `mutate()` and `row_number()`"
    - "select columns by their first letter with `select()` and `starts_with()`, telling upper and lower case apart"
    - "look up the meaning of a column's codes in the codebook"
    - "tell raw and prepared columns apart and choose the right one for a table and for a figure"
    - "name what you need to know about a survey even though it is in no column"
translation_of: de
based_on: 2026-11-11
---

This chapter is the first of five in which you learn R at your own pace
through one continuous exercise. One guiding question runs through all five:
**Where do the respondents shop, and who buys organic?** Before you can
answer it, you need to know the data set, and that is what this chapter is
about: how large it is, how you find a respondent again, by which system the
columns are named, and what you need to know about the survey that is in no
column.

In the boxes on this page the table `survey` is already loaded, and so is the
tidyverse. Unlike in the lessons, `survey` here is not the compact version but
the whole [[milk-chocolate-survey|milk and chocolate survey]]. Every box runs
on its own; what you create in one box is gone in the next. In your course
folder you load the data set yourself in Positron:

```r static
library(tidyverse)
survey <- read_csv("data/mds12_schoko_milch.csv")
```

To get started, [[r-for-data-science]] is worth reading: chapter
[2 "Workflow: basics"](https://r4ds.hadley.nz/workflow-basics.html), sections
[6.1 and 6.2 "Scripts" and "Projects"](https://r4ds.hadley.nz/workflow-scripts.html)
and [7.2 "Reading data from a file"](https://r4ds.hadley.nz/data-import.html#reading-data-from-a-file),
together with the page on the [[milk-chocolate-survey|survey]]. In
`chapter_1.R` in your course folder the tasks carry the numbers 1.1 to 1.6 in
the same order, and many tasks
come with a control value against which you can check your result yourself.

## Part 1: How large, and who is who?

1. Find out how many rows and how many columns `survey` has. Then
   describe in one sentence what a row and what a column stands for.

```r
survey
```

> [!HINT]
> Read the beginning of the page on the [[milk-chocolate-survey|survey]],
> and in your course folder the section "Eckdaten" in
> `course/datasets/mds12-schoko-milch.md`. The header of a printed table
> already gives its size, and `nrow()` and `ncol()` return the two numbers
> separately.

> [!SOLUTION]
> ```r
> nrow(survey)
> ncol(survey)
> ```
>
> `survey` has 2,811 rows and 606 columns: each row is one respondent, and
> each column is a question or, for multiple answers and item batteries, part
> of a question or a value derived from it. The postcode and the open answers
> are not included, so that nobody can be recognised by them.

2. Every observation in a data set should be identifiable, so that you
   can find it again and join tables. Use `n_distinct()` on the first five
   columns to check whether one of them does this: an identifier would have as
   many distinct values as there are rows. If none fits, use `mutate()` to
   create a new column `respondent_id` that numbers the rows with
   `row_number()`, and store the result under `survey` again.

```r
survey
```

> [!HINT]
> Read section [3.3 "Columns"](https://r4ds.hadley.nz/data-transform.html#columns)
> in [[r-for-data-science]]. Printing `survey` shows you the names of the
> first five columns in its header. A single `summarize()` with five calls of
> `n_distinct()` counts their distinct values side by side.
>
> Control: `respondent_id` has 2,811 distinct values.

> [!SOLUTION]
> ```r
> survey |>
>   summarize(
>     q001hheinkauf = n_distinct(q001hheinkauf),
>     q002geburt = n_distinct(q002geburt),
>     q003land = n_distinct(q003land),
>     q004geschlecht = n_distinct(q004geschlecht),
>     q005os = n_distinct(q005os)
>   )
> ```
>
> The five columns have 2, 61, 16, 3 and 2 distinct values, so none comes
> even close to 2,811; they are answers that many people share, such as the
> federal state or the year of birth. No other column of the data set has
> more than 99 distinct values either, so you have to create an identifier
> yourself:
>
> ```r
> survey <- survey |>
>   mutate(respondent_id = row_number())
>
> survey |>
>   summarize(n_ids = n_distinct(respondent_id))
> ```
>
> `respondent_id` has 2,811 distinct values, one for each row. The number
> depends on the order of the rows in the file; as long as you load the file
> as it is, it always refers to the same person.

## Part 2: Column names and codebook

3. The first letter of a column name tells you which block the
   question belongs to. Count how many columns belong to block `v`
   (behaviour) by selecting them with `select(starts_with("v"))` and counting
   them with `ncol()`. By default, `starts_with()` does not distinguish
   between upper and lower case; look up in the help (`?starts_with`) how to
   change that, and then count only the columns that start with a lower-case
   `v`. Describe in one sentence why the difference can matter here.

```r
survey
```

> [!HINT]
> Read the section "Wie die Spalten heißen" (how the columns are named) on the
> page on the [[milk-chocolate-survey|survey]], and in your course folder the
> sections "Die Präfixe" and "Klein oder groß" in
> `course/datasets/mds12-schoko-milch.md`. The setting you are looking for is
> an argument of `starts_with()` whose name already says that it is about
> letter case.
>
> Control: with upper- and lower-case `v` 85, lower-case `v` only 82. The
> full version in the course folder arrives at 86 and 85, because the two
> versions do not have exactly the same columns.

> [!SOLUTION]
> ```r
> survey |>
>   select(starts_with("v")) |>
>   ncol()
>
> survey |>
>   select(starts_with("v", ignore.case = FALSE)) |>
>   ncol()
>
> survey |>
>   select(starts_with("V", ignore.case = FALSE)) |>
>   names()
> ```
>
> With upper- and lower-case `v` there are 85 columns, with lower-case `v`
> only 82. The remaining three, `V041nofleischf`, `V041nofleisch3` and
> `V041nofleisch3f`, start with an upper-case `V` and are therefore prepared
> columns on diet, two of them with text instead of codes. The difference
> matters because lower-case letters stand for raw data and upper-case ones
> for prepared columns: if you want to select the raw data of a block with
> `starts_with("v")`, without `ignore.case = FALSE` you also get prepared
> columns that contain the same question a second time, partly as text.

4. The column `v032bioanteil` contains numbers from 1 to 5. Look up
   the question in the codebook and note the page, the question text in short
   and what codes 1 and 5 mean.

```r
survey
```

> [!HINT]
> The codebook exists only in your course folder, as
> `data/M3b_Musterstudie-quantitativ.pdf`; in the PDF you find the question
> with Ctrl+F (Mac: Cmd+F) by searching for `v032`. The same information in
> text form is in `course/datasets/mds12-schoko-milch-codebook.md`. Which
> codes actually occur is shown by `count()` here in the box.
>
> Control: the question is on page 28.

> [!SOLUTION]
> ```r
> survey |>
>   count(v032bioanteil)
> ```
>
> The question is on page 28 of the codebook and asks how large the share of
> organic food is in the respondent's whole normal shopping. Code 1 means
> "Ich kaufe (fast) nie Bio" (I (almost) never buy organic), code 5 "Ich
> kaufe (fast) nur Bio" (I (almost) only buy organic); in between lie
> "clearly less than half" (2), "about half" (3) and "clearly more than half"
> (4). The most frequent is code 2 with 938 people, only 111 chose code 5,
> and for 18 people the value is missing. Without the codebook you would not
> even know whether 5 means a lot of organic food or little.

5. Show `respondent_id`, `q002geburt`, `Q002alter`, `Q002altergru4`
   and `Q002altergru4f` side by side for the first five respondents, using
   `select()` and `slice()`. Then describe in one sentence how the four age
   columns are related and which one you would use for a table and which for
   a figure.

```r
survey
```

> [!HINT]
> Read section [3.2 "Rows"](https://r4ds.hadley.nz/data-transform.html#rows)
> in [[r-for-data-science]], where `slice()` and its relatives are
> introduced. `respondent_id` from task 2 does not exist yet in this box;
> create it again at the start of the pipe with `mutate()`.

> [!SOLUTION]
> ```r
> survey |>
>   mutate(respondent_id = row_number()) |>
>   select(respondent_id, q002geburt, Q002alter, Q002altergru4, Q002altergru4f) |>
>   slice(1:5)
> ```
>
> The first person was born in 1970, is 55 years old and belongs to group 3,
> `45-59 Jahre`. The four columns form a chain: `q002geburt` is the raw year
> of birth, `Q002alter` the age calculated from it (for all 2,811
> respondents 2025 minus the year of birth), `Q002altergru4` the age group as
> a code from 1 to 4 and `Q002altergru4f` the same group as text. For a table
> with key figures such as the mean age you use `Q002alter`, for a figure or
> a table by age group `Q002altergru4f`, because it contains readable groups
> instead of codes.

## Part 3: What is not in the data

6. Read pages 1 to 3 of the codebook on the aim of the survey, the
   sample and how it was carried out. Then name two things you need to know
   for the analysis that are in no column.

```r
survey
```

> [!HINT]
> The codebook exists only in your course folder
> (`data/M3b_Musterstudie-quantitativ.pdf`). Read the beginning and the
> section "Was man wissen sollte, bevor man rechnet" (what you should know
> before you calculate) on the page on the [[milk-chocolate-survey|survey]],
> and in your course folder the section "Die Stichprobe ist nicht
> bundesrepräsentativ" in `course/datasets/mds12-schoko-milch.md`. Ask
> yourself who got into the survey at all, and how.

> [!SOLUTION]
> Two examples among several possible ones: the respondents come from an
> online panel and were selected by quotas for age, gender and federal state,
> not at random, and they are only people who do the food shopping for their
> household themselves. In addition, some 200 people from the city and
> district of Osnabrück were surveyed on top for a special topic, which is
> why Lower Saxony is over-represented. You see the second point in the data
> only if you already know it:
>
> ```r
> survey |>
>   count(q003land) |>
>   mutate(share_respondents = n / sum(n))
> ```
>
> Lower Saxony has code 9 and accounts for 382 respondents, 13.6 percent,
> while the quota planned for 9.2 percent. Statements about "the Germans" are
> therefore possible with these data only with caution.

## What comes next

In your course folder the [[opencode-course-assistant|course assistant]]
guides you through the same tasks and looks at your code, and the exercise
continues with [[survey-exercise-describing-variables|chapter 2: Describing
single variables]].
