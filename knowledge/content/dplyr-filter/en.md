---
title: Filtering rows with filter()
summary: >-
  With filter() you keep the rows for which a condition holds: comparisons,
  several conditions, sets with %in%, and why missing values follow rules of
  their own.
objectives:
  intro: "This lesson shows you how to pick the rows of a table with `filter()`, and afterwards you can:"
  goals:
    - "keep the rows for which a condition holds with `filter()` and a comparison, for numbers as well as for text in quotation marks"
    - "combine several conditions with commas, `&` and `|` and reverse them with `!`"
    - "filter against a list with `%in%` and against a range of numbers with `between()`"
    - "find missing values with `is.na()` and explain why rows with `NA` in the condition silently drop out"
    - "use `filter()` to track down implausible values before they distort an analysis"
translation_of: de
based_on: 2026-11-01
---

`select()` picks columns, `filter()` picks rows. You state a **condition**, R
checks it for every row, and only the rows for which it is true remain in the
result. All columns are kept.

## Comparisons

A condition is usually a comparison. R knows these comparison operators:

| Operator | Meaning |
|---|---|
| `==` | equal |
| `!=` | not equal |
| `<`, `<=` | less than, less than or equal |
| `>`, `>=` | greater than, greater than or equal |

```r
survey |> filter(age >= 70)
```

You compare text in the same way:

```r
survey |> filter(diet == "vegetarian")
```

Text goes in quotation marks, column names do not. Without the quotation
marks, R looks for a column called `vegetarian` and reports that there is no
such thing.

> [!WARNING]
> Equality is checked with **two** equals signs. A single `=` means "gets the
> value" in R, and dplyr complains when you write `filter(diet = "vegan")`.
> Try it and read the message: dplyr suspects exactly this mistake and
> suggests `==`.

## Several conditions

If you separate conditions with commas, all of them must hold at once. You
get the same with `&` (and):

```r
survey |> filter(gender == "female", age < 40)
```

If at least one should hold, you join them with `|` (or):

```r
survey |> filter(household_size >= 4 | town_size == "village")
```

A `!` reverses a condition: `!(diet == "omnivore")` is the same as
`diet != "omnivore"`.

## Sets with %in%

If you want all rows whose value belongs to a list, a chain of `|` quickly
gets long. `%in%` checks whether a value occurs in a vector:

```r
survey |>
  filter(diet %in% c("vegan", "vegetarian", "pescetarian")) |>
  select(id, age, diet)
```

For ranges of numbers there is `between()`, which includes both limits:
`filter(between(age, 30, 39))` finds everyone between 30 and 39.

## Missing values

This is where the most common trap in filtering lies. Some answers are
missing in `milk_freq`. The obvious attempt to find them returns not a single
row:

```r
survey |> filter(milk_freq == NA)
```

The reason: a comparison with an unknown value is itself unknown. Is a value
equal to a value nobody knows? R can only answer that with `NA`, and
`filter()` keeps only rows for which the condition is explicitly `TRUE`. So
you ask for missing values with `is.na()`:

```r
survey |> filter(is.na(milk_freq)) |> select(id, age, milk_freq)
```

With a `!` in front you get, the other way round, all rows that have a value:

```r
survey |> filter(!is.na(milk_freq)) |> nrow()
```

The same rule applies where you are not asking about missing values at all.
If you want to know who finds a litre too expensive already below 2 euros,
you only get people who saw the price question in the first place:

```r
survey |>
  filter(price_too_expensive < 2) |>
  select(id, milk_brand, price_too_expensive)
```

Everyone else drops out silently. Usually that is intended, but you should be
aware of it when you count rows afterwards and compare them with the total.

## Filtering to check data

`filter()` is not only for analyses but also for tracking down values that
cannot be right. A litre of milk costs one, two, maybe three euros. What does
this line tell you?

```r
survey |>
  filter(price_too_expensive > 10) |>
  select(id, age, milk_brand, price_too_expensive)
```

Whether someone made a typo, whether 160 cents were meant or whether someone
did not take the question seriously cannot be decided from the data alone.
What matters is that you find the value before it distorts an average, and
that you record how you deal with it.

## Key points

- `filter()` keeps the rows for which a condition is `TRUE`; all columns are
  kept.
- `==` checks equality, text goes in quotation marks.
- Commas and `&` require all conditions, `|` at least one; `%in%` checks
  against a list.
- You ask for missing values with `is.na()`, and rows with `NA` in the
  condition silently drop out when filtering.
