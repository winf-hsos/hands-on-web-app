---
title: R in ten minutes
summary: >-
  Just enough R for dplyr: calculating, naming values, vectors, functions,
  missing values, looking at a table and the pipe.
translation_of: de
based_on: 2026-10-27
---

## What this is about

R is a programming language made for working with data. This lesson shows
only what you need for the following lessons on dplyr and leaves everything
else out. Every code box is a small editor: you can change the code and start
it with **Run**. R runs in your browser, so there is nothing to install; on
the first click, loading takes a moment.

## R as a calculator

R computes what you write and shows the result straight away:

```r
3 + 4
2.19 * 1.07
2^10
```

You can ignore the `[1]` in front of each result for now; it counts the
values of an output and only becomes useful with long outputs.

## Giving values a name

With `<-` you store a value under a name. From then on the name stands for
the value, and R shows it as soon as you write it on a line of its own:

```r
price <- 2.19
price_with_tax <- price * 1.07
price_with_tax
```

The arrow reads as "gets": `price` gets the value 2.19. `=` works too, but the
arrow is customary in R, and that is also how most examples you find online
are written.

## Vectors: several values at once

Almost everything in R is a **vector**, a series of values of the same kind.
You build one with `c()` (for *combine*). When you calculate with a vector, R
calculates with every single value:

```r
ages <- c(56, 55, 47, 32, 74)
ages + 1
mean(ages)
```

This is exactly what makes R so convenient for data: a column of a table is a
vector, and one calculation applies to all rows at once.

## Functions

`mean()` is a **function**: it receives its values, the *arguments*, in the
brackets and returns a result. Arguments can carry a name, and functions can
be nested inside each other:

```r
ages <- c(56, 55, 47, 32, 74)
round(mean(ages), digits = 1)
max(ages) - min(ages)
```

R reads nested calls from the inside out: first `mean(ages)`, then `round()`
with that result.

## Text and missing values

Text goes in quotation marks. If a value is missing, for instance because
someone did not answer a question, it says `NA` (*not available*). You cannot
calculate with `NA`, and R says so honestly:

```r
diet <- c("vegan", "omnivore", "vegetarian")
organic_share <- c(5, NA, 2)
mean(organic_share)
mean(organic_share, na.rm = TRUE)
```

Only with `na.rm = TRUE` (*remove NA*) does R leave out the missing values.
Having to say so explicitly is deliberate: missing values should not vanish
unnoticed.

## Looking at a table

In every R box on this platform a small table called `survey` is ready for
you. If you write its name, R shows it:

```r
survey
```

A table in R is called a **data frame**; the variant that dplyr uses is
called a **tibble**. At the top it says how many rows and columns it has, and
below each column name, in angle brackets, its type: `<int>` for whole
numbers, `<dbl>` for decimal numbers, `<chr>` for text. If not everything fits
the width, R names the remaining columns underneath.

You pull out single columns with `$`, and each is a vector:

```r
mean(survey$age)
table(survey$diet)
```

## The data set `survey`

The 30 rows come from an online survey on milk and milk alternatives by
Prof. Dr. Ulrich Enneking (Osnabrück University of Applied Sciences), in which
about 2,800 people took part. For these lessons it is a few selected people
and ten questions; the columns have English names, as is customary in
programming.

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

## The pipe: and then

With dplyr, an analysis is written as a chain of steps. The symbol `|>` is
called the **pipe** and passes the result on its left as the first argument
to the function on its right. It is best read as "and then":

```r
survey |> nrow()
survey |> filter(diet == "vegan")
```

The first line means the same as `nrow(survey)`, the second: take `survey`
and then keep the rows in which `diet` equals `"vegan"`. With one step the
difference is small; with five steps the pipe turns an unreadable tangle of
brackets into a list that you read from top to bottom.

> [!TIP]
> You can type the pipe faster with **Ctrl+Shift+M** (**Cmd+Shift+M** on a
> Mac). The shortcut works in every R box on this platform just as it does in
> RStudio.

> [!NOTE]
> Older examples often use `%>%` instead of `|>`. That is the pipe from the
> package magrittr, which existed before R got its own. For everything you
> learn here, the two behave the same.

## Packages

dplyr is a **package**, an extension of R. On this platform it is already
loaded. When you work in RStudio on your own computer, you install it once
and then load it at the start of every script:

```r static
install.packages("dplyr")  # once
library(dplyr)             # in every script
```

## Key points

- `<-` gives a value a name, `c()` builds a vector, and calculations apply to
  every value of a vector.
- `NA` stands for a missing value; `na.rm = TRUE` explicitly leaves it out
  when calculating.
- A table is a data frame or tibble; you get a column with `$`.
- `|>` reads "and then" and turns an analysis into a sequence of steps.
