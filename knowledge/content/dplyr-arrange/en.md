---
title: Sorting rows with arrange()
summary: >-
  With `arrange()` you put the rows of a table in order, ascending,
  descending or by several columns, and with `slice_head()` and `slice_max()`
  you keep only the first or largest rows.
objectives:
  intro: "This lesson shows you how to sort rows with `arrange()`, and afterwards you can:"
  goals:
    - "sort rows in ascending order with `arrange()`, in descending order with `desc()` and by several columns, and say where missing values end up"
    - "find the outliers of a column by sorting in descending order"
    - "keep only the first or the largest rows of a table with `slice_head()` and `slice_max()`"
translation_of: de
based_on: 2026-11-09
---

`select()` and `filter()` make a table smaller, because they keep only some
of its columns or rows. `arrange()`, in contrast, keeps every row and column
and only changes the order of the rows.

## Sorting rows

`arrange()` sorts the rows by the values of a column in ascending order, so
the smallest number comes first. To keep the output readable, a `select()`
afterwards keeps only four columns:

```r
survey |>
  arrange(age) |>
  select(id, age, gender, diet)
```

The youngest respondents are now at the top. `arrange()` sorts text
alphabetically, so `arrange(diet)` puts the rows with `flexitarian` before
those with `omnivore`.

## Descending with `desc()`

For the reverse order you wrap the column name in `desc()`, short for
*descending*. Then the oldest respondents come first:

```r
survey |>
  arrange(desc(age)) |>
  select(id, age, gender, diet)
```

## By several columns

If you name several columns, `arrange()` sorts by the first one and only
turns to the next where the first is equal. Here the diets are in
alphabetical order, and within each diet the oldest come first:

```r
survey |>
  arrange(diet, desc(age)) |>
  select(id, diet, age, gender)
```

## Where missing values go

Most respondents have no value for the price question, because they never
saw it. `arrange()` always puts rows with `NA` at the end, whether you sort
in ascending or descending order:

```r
survey |>
  arrange(desc(price_too_expensive)) |>
  select(id, milk_brand, price_too_expensive)
```

Sorted in descending order, this is also a quick way to find outliers: the
prices of several hundred euros for a litre of milk that you know from the
lesson [[dplyr-filter]] are right at the top, led by 999 euros.

## The first or largest rows

After sorting, often only the first rows matter. `slice_head()` keeps as
many as you give with `n`, in the order the table is in at that moment:

```r
survey |>
  arrange(desc(age)) |>
  slice_head(n = 3) |>
  select(id, age, gender, diet)
```

`slice_max()` sorts and cuts in one step and keeps the rows with the largest
values of a column; `slice_min()` keeps those with the smallest. If several
rows share the last place, it returns all of them, even if that makes more
than `n`:

```r
survey |>
  slice_max(price_too_expensive, n = 3) |>
  select(id, milk_brand, price_too_expensive)
```

## Key points

- `arrange()` sorts rows in ascending order, `desc()` reverses the order,
  and further columns break ties; missing values always end up last.
- Sorted in descending order, `arrange()` shows the largest values of a
  column first, and with them often the outliers.
- `slice_head()` keeps the first rows, `slice_max()` and `slice_min()` those
  with the largest or smallest values of a column.
