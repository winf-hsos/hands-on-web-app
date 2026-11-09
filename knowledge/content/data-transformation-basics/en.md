---
title: What does transforming data mean?
summary: >-
  Hardly any question can be read straight off raw data. A handful of basic
  operations turns a table into the table that holds the answer, in R,
  Python, SQL or Excel.
objectives:
  intro: "This lesson explains what transforming data means, and afterwards you can:"
  goals:
    - "explain why a question can rarely be read straight off raw data and what transforming data means"
    - "name the basic operations of selecting columns, filtering rows, sorting, computing new columns, summarising and grouping, and state what each changes in a table"
    - "explain why the operations can be chained and why their order matters"
    - "plan a question about data as a sequence of basic operations before writing any code"
    - "match each operation to its verb in `dplyr`, such as `select()` or `filter()`, and to its counterpart in SQL, pandas and Excel"
translation_of: de
based_on: 2026-11-09
---

![Slides: Data transformation with R and dplyr](item:data-transformation-slides)

Suppose you have a survey with a few thousand respondents in front of you and
want to know whether people who eat vegan or vegetarian buy more organic food
than others. The answer is not written anywhere in the table. It is in there,
but only once you pick the right rows, split them into groups by diet and
compute an average for each group.

That is exactly what **transforming data** means: making another table out of
a table, one that answers a question, without collecting new data. In
practice this takes more time than any statistics, because almost every chart
and every model needs the data in a shape in which they were not delivered.

## A table in, a table out

The good news is that a handful of basic operations is enough for the vast
majority of questions. Each takes a table and returns a table again, and
that is why they can be chained one after another, in the order the question
requires.

| Operation | Question behind it | What changes |
|---|---|---|
| **Selecting columns** | Which characteristics do I need? | fewer columns |
| **Filtering rows** | Who or what is this about? | fewer rows |
| **Sorting** | What comes first? | order of the rows |
| **Computing new columns** | What can be derived from the characteristics? | more columns |
| **Summarising** | What is typical, how many are there? | one row instead of many |
| **Grouping** | How do subgroups differ? | one row per group |

The question from the beginning thus becomes a sequence of steps that reads
almost like a sentence:

1. Take the survey,
2. keep the rows in which the organic share was answered,
3. split them into groups by diet,
4. compute the average organic share for each group and count the people,
5. sort the groups by this average.

The order matters: if you first compute the average for each group and only
then try to filter out the missing answers, there are no individual
respondents left to filter. Such a sequence is therefore best planned on
paper before writing a single line of code, and once you know the steps, all
that is left is to translate them.

## The same ideas everywhere

The basic operations are not the invention of any particular software. They
are part of every tool for tables, just under different names:

| Operation | R with dplyr | SQL | Python with pandas | Excel |
|---|---|---|---|---|
| Selecting columns | `select()` | `SELECT` | `df[columns]` | hiding columns |
| Filtering rows | `filter()` | `WHERE` | `df.query()` | filter |
| Sorting | `arrange()` | `ORDER BY` | `df.sort_values()` | sort |
| New columns | `mutate()` | expression in `SELECT` | `df.assign()` | formula in a new column |
| Summarising | `summarize()` | `COUNT`, `AVG`, … | `df.agg()` | pivot table |
| Grouping | `group_by()` | `GROUP BY` | `df.groupby()` | pivot table |

On this platform we use **R with the package dplyr**. Its functions are named
after the action they perform, which is why they are called the **verbs** of
dplyr. Once you have understood them, you will quickly find your way around
SQL or pandas as well, because the thinking is the same everywhere.

## Try it before you program

In the demo of the verbs you can see on six rows of the survey how each verb
reshapes a table, before you write code yourself in the following lessons.

![The verbs of dplyr to try out](item:dplyr-verbs-demo)

## Key points

- Transforming data means reshaping a table so that it answers a question.
- A handful of operations is enough: selecting, filtering, sorting,
  computing, summarising and grouping.
- Each operation turns a table into a table, so they can be chained into a
  sequence of steps whose order the question determines.
- The ideas are the same in R, SQL, pandas and Excel; only the names change.
