---
title: Sorting rows and computing columns with arrange() and mutate()
summary: >-
  With `arrange()` you put the rows of a table in order, with `mutate()` you
  compute new columns from existing ones, up to groups such as age groups
  with `if_else()` and `case_when()`.
objectives:
  intro: "This lesson shows you how to sort rows with `arrange()` and compute new columns with `mutate()`, and afterwards you can:"
  goals:
    - "sort rows in ascending order with `arrange()`, in descending order with `desc()` and by several columns, and say where missing values end up"
    - "keep only the first or the largest rows of a table with `slice_head()` and `slice_max()`"
    - "compute a new column from existing ones with `mutate()`, overwrite a column and create several columns in one step that build on each other"
    - "distinguish two cases with `if_else()` and turn a number into groups such as age groups with `case_when()`"
    - "explain why `mutate()` does not change the table `survey` and how you keep a result with `<-`"
translation_of: de
based_on: 2026-11-09
---

`select()` and `filter()` make a table smaller, because they keep only some
of its columns or rows. The two verbs of this lesson, in contrast, keep every
row: `arrange()` only changes their order, and `mutate()` adds new columns
that you compute from the existing ones.

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

## Computing a new column

`mutate()` adds a column to the table. To the left of the equals sign stands
the name of the new column, to the right the calculation, in which you use
the existing columns. The survey ran in November 2025, which gives the
approximate year of birth of every respondent:

```r
survey |>
  mutate(birth_year = 2025 - age) |>
  select(id, age, birth_year)
```

R calculates with the whole column at once, as you know from the lesson
[[r-vectors]], and `2025 - age` gives a result of its own for every row. The
year of birth is approximate because the data do not tell whether someone
had already had their birthday by November. The new column is added at the
end of the table, which is why the `select()` brings it into the output.

## Several columns at once

One `mutate()` can create several columns, separated by commas, and a column
you have just computed is already available for the next one. Here the year
of birth becomes the decade someone was born in: `birth_year / 10` turns 1969
into 196.9, `floor()` rounds it down to 196, and times ten that gives 1960.

```r
survey |>
  mutate(
    birth_year = 2025 - age,
    birth_decade = floor(birth_year / 10) * 10
  ) |>
  select(id, age, birth_year, birth_decade)
```

## Two cases with `if_else()`

Often a new column should not hold a number but say which group a row
belongs to. `if_else()` checks a condition and returns, for every row, the
first value if it holds and the second one otherwise:

```r
survey |>
  mutate(age_group = if_else(age < 50, "under 50", "50 and over")) |>
  select(id, age, age_group)
```

## Overwriting a column

If you give a column in `mutate()` a name that already exists, the result
replaces the old column. This way you can replace the implausible prices with
missing values without the people disappearing from the table, as they
would with `filter()`:

```r
survey |>
  mutate(
    price_too_expensive = if_else(price_too_expensive > 10, NA, price_too_expensive)
  ) |>
  filter(!is.na(milk_brand)) |>
  select(id, milk_brand, price_too_expensive)
```

The `filter()` at the end shows only the 611 people who saw the price
question. For everyone else the condition `price_too_expensive > 10` is
itself unknown, and `if_else()` then returns `NA` as well, so a missing
value stays missing. Whether you replace a value like this or drop the row
depends on the question: for an average price both come to the same thing,
but if you want to count how many people saw the brand alpro, you still need
the row.

## Building groups with `case_when()`

For more than two groups, a chain of `if_else()` quickly becomes hard to
read. `case_when()` takes any number of cases in the form
`condition ~ value`, and `.default` sets what applies when no condition
holds. This is how you divide age into four age groups:

```r
survey |>
  mutate(
    age_group = case_when(
      age < 30 ~ "18-29",
      age < 50 ~ "30-49",
      age < 65 ~ "50-64",
      .default = "65+"
    )
  ) |>
  select(id, age, age_group)
```

`case_when()` checks the cases for every row from top to bottom and takes
the first one that holds. That is why `age < 50` is enough in the second
line, since anyone younger than 30 already got their group in the first
line. Swap the first two cases and see where the 26-year-olds end up.

> [!WARNING]
> A missing value meets none of the conditions and therefore gets the value
> of `.default`. If you divide prices into classes this way, all 2,198 people
> without a price end up in the last class. Filter them out first, or catch
> them with a first case `is.na(price_too_expensive) ~ NA`.

## Keeping the result

`mutate()` does not change `survey`; it returns a new table, which R prints
and then forgets. If you want to keep working with a new column, you add the
next verbs to the same pipe or store the result under a name of its own with
`<-`, as here, to sort by the new column afterwards:

```r
survey_groups <- survey |>
  mutate(age_group = if_else(age < 50, "under 50", "50 and over"))

survey_groups |>
  arrange(age_group, age) |>
  select(id, age, age_group)
```

You could overwrite the name `survey` itself, but that is rarely a good
idea, because afterwards nobody can see what the table originally looked
like.

## Key points

- `arrange()` sorts rows in ascending order, `desc()` reverses the order,
  and further columns break ties; missing values always end up last.
- `slice_head()` keeps the first rows, `slice_max()` and `slice_min()` those
  with the largest or smallest values of a column.
- `mutate(name = calculation)` creates a column or overwrites an existing
  one, and within one `mutate()` a column can build on the previous one.
- `if_else()` distinguishes two cases, `case_when()` any number of them,
  checked from top to bottom; an `NA` ends up at `.default` there.
- A result only stays if you pass it on or store it with `<-`.
