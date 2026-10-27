---
title: Tables in R
summary: >-
  In R a table is a data frame of vectors of equal length: how to look at it,
  pull out its columns and get to know the data set survey.
translation_of: de
based_on: 2026-10-27
---

## What this is about

So far you had single vectors. Real data come as a table: each row a person,
each column a question. In R a table is called a **data frame**, and it is
nothing but several vectors of equal length side by side. Everything you
know about vectors therefore applies to every column.

## Looking at a table

In every R box on this platform a small table called `survey` is ready for
you. If you write its name, R shows it:

```r
survey
```

The variant of the data frame you see here is called a **tibble**; it
displays itself a little more clearly. At the top it says how many rows and
columns the table has, and below each column name, in angle brackets, its
type: `<int>` for whole numbers, `<dbl>` for decimal numbers, `<chr>` for
text. If not everything fits the width, R names the remaining columns
underneath.

For wide tables, `glimpse()` is more practical. It turns the view around and
shows each column as a row, with its first values:

```r
glimpse(survey)
```

## Pulling out columns

With `$` you pull out a column, and it is a perfectly ordinary vector.
Everything from the previous lessons works with it:

```r
mean(survey$age)
```

For text, `table()` is useful. It counts how often each value occurs:

```r
table(survey$diet)
```

`nrow()` and `ncol()` tell you how big a table is, and `names()` lists the
column names.

## The data set `survey`

The 30 rows come from an online survey on milk and milk alternatives by
Prof. Dr. Ulrich Enneking (Osnabrück University of Applied Sciences), in
which about 2,800 people took part. For these lessons it is a few selected
people and ten questions; the columns have English names, as is customary in
programming. You can download the whole survey as a
[[milk-chocolate-survey|data set]].

| Column | Meaning |
|---|---|
| `id` | running number of the person in this excerpt |
| `age` | age in years |
| `gender` | gender (`female`, `male`) |
| `state` | German federal state |
| `town_size` | size of the place of residence, from `village` to `city` |
| `household_size` | number of people in the household |
| `diet` | diet, such as `omnivore`, `flexitarian`, `vegan` |
| `organic_share` | share of organic food when shopping, from 1 (hardly any) to 5 (almost all) |
| `milk_freq` | how often the person drinks milk: `daily`, `weekly`, `monthly`, `rarely` |
| `milk_brand` | which brand they were shown in the price part: `Weihenstephan` or `alpro` |
| `price_too_expensive` | from which price in euros a litre of this brand would be too expensive for them |

Not everyone was asked every question, which is why there are missing
values. The price part, for example, was only shown to some of the
respondents, and only for one of the two brands. Some values are also
deliberately odd, so that there is something to discover when tidying up.

## Key points

- A data frame is a table of vectors of equal length; a tibble is the
  clearer variant that dplyr uses.
- `glimpse()` shows a wide table column by column.
- `$` pulls out a column as a vector; `table()` counts its values.
