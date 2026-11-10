---
title: "R self-test: milk and chocolate survey"
summary: >-
  Eleven small tasks on the whole survey that you check right on the page:
  eight in which you write code yourself, and three in which you read code
  that is given.
translation_of: de
based_on: 2026-11-11
---

This test shows you whether you are already confident enough with R to keep
up in the next session. Each of the eleven tasks gives exactly one value or
one figure. With **Check** below the box your code runs in the background, and
the line below it says whether the result is right. What the last line of
your code gives is checked, which is exactly what **Run** shows you. If it is
not right, the page names the chapter
of the [[survey-exercise-first-look|exercise]] where you can catch up; at the
end of the page you see how many tasks you already have right.

In tasks 1 to 8 you write code yourself: every box starts with `survey`, and
you continue after it with a pipe. In tasks 9 to 11 you read code that is
given. It runs without an error, and still there is something in it you
need to know. In every box the whole [[milk-chocolate-survey|survey]] is
loaded as `survey`, and so is the tidyverse.

The test has no grade, and nobody sees your result but you: it stays stored in
this browser. The correct answers are not in the page as plain text, only as a
checksum. Your course assistant could solve the test, but only you can pass
it; it will gladly help you understand a function or an error message,
though.

## Task 1: Loading data and counting

How many respondents live in a large city (`Großstadt`)? The size of the
place of residence is in `D044stadtf`.

```r check=1
survey
```

> [!HINT]
> `count()`, or `filter()` with `nrow()`. Which values occur in `D044stadtf`
> is shown by `count(survey, D044stadtf)`.

## Task 2: Calculating a statistic

How old are the respondents on average (`Q002alter`)? One decimal place is
enough.

```r check=2
survey
```

> [!HINT]
> `mean()` inside `summarise()`, or directly on the column.

## Task 3: Filtering rows

How many respondents are 60 or older **and** live in a village (`Dorf`)?

```r check=3
survey
```

> [!HINT]
> `filter()` with two conditions, separated by a comma.

## Task 4: Grouping and summarising

Calculate the mean age for each size of place of residence (`D044stadtf`).
Respondents without an answer on their place of residence do not count. What
is the lowest mean age? One decimal place.

```r check=4
survey
```

> [!HINT]
> `group_by()` and `summarise()`; missing answers on the size of the place do
> not count.

## Task 5: Calculating a new column

For the question "Where do you usually buy your groceries?" every person could
name several places, with one column per place from `v008ort_1discount` to
`v008ort_9online` (1 = named, 0 = not named). Use `mutate()` to calculate for
each person how many places they named, in a new column `n_places`. How many
places do the respondents name on average? One decimal place.

```r check=5
survey
```

> [!HINT]
> `mutate()` with the nine columns from `v008ort_1discount` to
> `v008ort_9online`. With `rowSums(pick(...))` you do not have to add them up
> one by one.

## Task 6: Shares with multiple answers

What percentage of the respondents shop at a discounter
(`v008ort_1discount`)? One decimal place.

```r check=6
survey
```

> [!HINT]
> The base is the respondents, not the mentions. And: as a percentage.

## Task 7: Missing values and routing

The question how often someone drinks milk (`v007freq3_mi`) has no value for
many respondents, and some of them were never asked. How many respondents
bought **and** consumed milk (`v006gekauft_3mi == 3`) and still have no value
in `v007freq3_mi`?

```r check=7
survey
```

> [!HINT]
> Who was asked the question `v007freq3_mi`? The page on the
> [[milk-chocolate-survey|survey]] explains why missing usually means "not
> asked". You find missing values with `is.na()`.

## Task 8: A figure with ggplot2

Draw a bar chart with the number of respondents per age group
(`Q002altergru4f`), both axes with a label that a human understands.

```r check=8
survey
```

> [!HINT]
> `ggplot()` with `geom_bar()`, and `labs()` for both axes.

## Task 9: Reading code, prepared variables

The code in the box calculates the mean age by gender. The result has three
rows: women, men and `NA` with 2 people. Where does the third row come from?

- **a)** Two people did not answer the question about their gender.
- **b)** Two people answered "diverse" in the survey; in the prepared
  variable they were set to `NA`.
- **c)** R always adds a row for missing values in `group_by()`.
- **d)** Two rows were damaged when the file was read.

Check your guess with code before you answer, then write the letter between
the quotation marks in the last line.

```r check=9
survey |>
  group_by(Q004geschlechtf) |>
  summarise(mean_age = mean(Q002alter), n_respondents = n())

""
```

> [!HINT]
> Compare the raw column `q004geschlecht` with the prepared
> `Q004geschlechtf`, for example with
> `count(survey, q004geschlecht, Q004geschlechtf)`.

## Task 10: Reading code, silent exclusions

The code in the box calculates how often the respondents drink milk on average
(4 = mostly daily to 1 = less often). It runs without an error, but whom does
the number speak about? On how many respondents is it based? Below the
given code, `survey` is already there as the start of your answer.

```r check=10
survey |>
  summarise(mean_milk_frequency = mean(v007freq3_mi, na.rm = TRUE))

survey
```

> [!HINT]
> How many values does `v007freq3_mi` have that are not missing?

## Task 11: Reading code, the base of a share

The code in the box is meant to show how many respondents shop at which
place. According to the result, 26.5 % shop at a discounter, but task 6 gave
something else. What does the share in this code refer to?

- **a)** the respondents
- **b)** all mentions together
- **c)** the nine places
- **d)** the households

```r check=11
survey |>
  select(v008ort_1discount:v008ort_9online) |>
  pivot_longer(everything(), names_to = "place", values_to = "is_mentioned") |>
  filter(is_mentioned == 1) |>
  count(place, name = "n_mentions") |>
  mutate(pct_mentions = round(100 * n_mentions / sum(n_mentions), 1))

""
```

> [!HINT]
> What does `sum(n_mentions)` refer to when every person can name several
> places?
