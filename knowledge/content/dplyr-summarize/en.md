---
title: Summarising with summarize()
summary: >-
  With `summarize()` you condense many rows into figures such as the mean and
  the median, with `group_by()` before it for every group separately, and
  `count()` is the shortcut for the most common summary, counting.
objectives:
  intro: "This lesson shows you how to condense a table into figures with `summarize()`, `group_by()` and `count()`, and afterwards you can:"
  goals:
    - "condense many rows into one row of figures such as `n()`, `mean()`, `median()`, `min()`, `max()` and `sd()` with `summarize()`"
    - "explain why a figure over a column with `NA` is itself `NA`, leave missing values out explicitly with `na.rm = TRUE` and state whom the result then describes"
    - "show with an outlier why the median is often more robust than the mean, and filter out implausible values before summarising"
    - "compute one row per group with `group_by()` and `summarize()`, also for the combinations of two columns"
    - "count frequencies with `count()` and turn them into shares with `mutate()`, overall or within a group"
translation_of: de
based_on: 2026-11-09
---

So far every row in the result of a pipe was still one respondent, even if
there were fewer rows or columns than in `survey`. `summarize()`, in
contrast, condenses many rows into a single one that holds figures such as
a mean. Together with `group_by()` this becomes one row per group, which
lets you compare groups, and that is what most questions about data ask for.

## Many rows, one row

Inside `summarize()`, as in `mutate()`, the name of a new column stands on
the left and the calculation on the right, except that the calculation has
to turn a whole column into a single value. This is how you compute the
average age of the 2,809 respondents:

```r
survey |>
  summarize(mean_age = mean(age))
```

The result is a table again, with one row and one column. All other columns
are gone, since a figure over all people no longer has a single state or a
single diet. The British spelling `summarise()` works just the same.

## Several figures at once

As in `mutate()`, you separate several figures with commas. These functions
turn a column into a single value:

| Function | returns |
|---|---|
| `n()` | the number of rows; needs no column |
| `mean()` | the mean |
| `median()` | the median, the value in the middle when all values are sorted |
| `min()`, `max()` | the smallest and the largest value |
| `sd()` | the standard deviation, the typical distance from the mean |

Together they give a small profile of age in a single row:

```r
survey |>
  summarize(
    n = n(),
    mean_age = mean(age),
    median_age = median(age),
    min_age = min(age),
    max_age = max(age),
    sd_age = sd(age)
  )
```

The respondents are between 18 and 80 years old, 48.4 years on average.
That the median of 50 years lies a little above it shows that the younger
people pull the mean down slightly.

## Missing values and `na.rm = TRUE`

The same attempt fails for the price question, and the result is `NA`:

```r
survey |>
  summarize(mean_price = mean(price_too_expensive))
```

2,198 of the 2,809 respondents never saw the question, and as the lesson
[[r-missing-values]] shows, any calculation with an unknown value is itself
unknown. With `na.rm = TRUE` you leave the missing values out explicitly.
`n()`, however, still counts all rows; how many answers actually go into the
calculation is counted by `sum(!is.na(…))`:

```r
survey |>
  summarize(
    n = n(),
    answers = sum(!is.na(price_too_expensive)),
    mean_price = mean(price_too_expensive, na.rm = TRUE),
    median_price = median(price_too_expensive, na.rm = TRUE)
  )
```

> [!IMPORTANT]
> `na.rm = TRUE` is a decision about whom the figure describes, not a switch
> that makes an error go away. Here it describes the 611 people who saw the
> price experiment, and exactly that belongs in every sentence in which you
> report the result.

## Mean or median

Over 8 euros as the average limit for a litre of milk, with a median of
1.99 euros? The difference comes from the 20 answers above 10 euros, up to
999 euros. The mean spreads these values over all 611 answers, while the
median only looks at the middle of the sorted values and is hardly moved by
a few outliers.

Because `summarize()` stands at the end of the pipe, you decide beforehand
with `filter()` which rows go into it. Without the implausible values it
looks like this:

```r
survey |>
  filter(price_too_expensive <= 10) |>
  summarize(
    n = n(),
    mean_price = mean(price_too_expensive),
    median_price = median(price_too_expensive)
  )
```

Now mean and median are almost level at 2.08 and 1.99 euros. `na.rm = TRUE` is
no longer needed here, because `filter()` already dropped the rows without a
price when comparing.

## One row per group

`summarize()` shows its real strength together with `group_by()`, which you
know from the lesson [[dplyr-mutate]]. While `mutate()` after a `group_by()`
gives every row a value of its group and keeps all rows, `summarize()` turns
each group into a single row. How old are the respondents per diet, and how much
organic food do they buy? Because 18 people did not give their organic
share, the mean needs `na.rm = TRUE` for it:

```r
survey |>
  group_by(diet) |>
  summarize(
    n = n(),
    mean_age = mean(age),
    mean_organic = mean(organic_share, na.rm = TRUE)
  )
```

The column you group by stays in the result, so every row says which group
it stands for; the 28 people who gave no diet form a group of their own,
`NA`. Always look at `n` as well: 1,826 people are omnivores, but only 36
each are vegan or pescetarian, and a mean of 36 answers varies much more
from sample to sample than one of 1,826.

## Sorting groups

The result of `summarize()` is an ordinary table, and `arrange()` sorts its
rows like any other. Here the groups with the highest organic share come
first:

```r
survey |>
  group_by(diet) |>
  summarize(
    n = n(),
    mean_organic = mean(organic_share, na.rm = TRUE)
  ) |>
  arrange(desc(mean_organic))
```

## Grouping by two columns

`group_by()` also takes several columns, and then every combination that
occurs in the data forms a group of its own:

```r
survey |>
  group_by(gender, diet) |>
  summarize(
    n = n(),
    mean_organic = mean(organic_share, na.rm = TRUE),
    .groups = "drop"
  )
```

`summarize()` only removes the last level of grouping, and without
`.groups = "drop"` the result would stay grouped by `gender`. dplyr points
this out with a message, because a `mutate()` afterwards would then
calculate per gender. With `.groups = "drop"` the result is an ordinary
table again, and `ungroup()` at the end of the pipe does the same. Delete
the line once and read the message.

> [!TIP]
> Instead of writing `group_by()` before `summarize()`, you can also name the
> groups for this one step only, with
> `summarize(n = n(), .by = c(gender, diet))`. The result is then never
> grouped, but the groups appear in the order in which they first occur in
> the data.

## Counting with `count()`

How many people are there per diet? `group_by()` and `summarize(n = n())`
could work this out, but counting is so common that dplyr has a shortcut for
it:

```r
survey |>
  count(diet)
```

With `sort = TRUE` the most frequent values come first:

```r
survey |>
  count(diet, sort = TRUE)
```

With two columns, `count()` counts every combination, just like
`group_by()` with two columns:

```r
survey |>
  count(gender, diet)
```

Missing values form a group of their own when counting. That is useful,
because it shows at a glance how many people saw the price experiment at all
and how many did not:

```r
survey |>
  count(milk_brand)
```

## Computing shares

`count()` returns a table with the column `n`, and you can keep calculating
with it. If you divide every count by the sum of all of them, you get the
share of each group:

```r
survey |>
  count(diet) |>
  mutate(share = n / sum(n))
```

1,826 of the 2,809 respondents are omnivores, a share of 0.650, and 749 are
flexitarians, 0.267. The shares add up to 1; if you prefer per cent,
multiply by 100.

If the shares should add up to 1 within each group, for instance per gender,
you group before the `mutate()`. `sum(n)` is then the sum within the group,
and you can read off which share of the women and which share of the men
follow which diet:

```r
survey |>
  count(gender, diet) |>
  group_by(gender) |>
  mutate(share = n / sum(n))
```

## Key points

- `summarize()` turns many rows into one, with figures such as `n()`,
  `mean()`, `median()`, `min()`, `max()` and `sd()`.
- A single `NA` makes a figure `NA`; `na.rm = TRUE` leaves missing values
  out, while `n()` still counts all rows.
- An outlier shifts the mean but hardly the median, and you filter out
  implausible values before `summarize()`.
- `group_by()` and `summarize()` give one row per group; after grouping by
  two columns, `.groups = "drop"` removes the grouping afterwards.
- `count()` counts values and combinations, and `mutate(share = n / sum(n))`
  turns them into shares.
