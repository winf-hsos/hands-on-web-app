---
title: Computing columns with mutate()
summary: >-
  With `mutate()` you compute new columns from existing ones, form groups
  such as age groups with `if_else()` and `case_when()`, and calculate within
  each group with `group_by()` without losing a single row.
objectives:
  intro: "This lesson shows you how to compute new columns with `mutate()`, and afterwards you can:"
  goals:
    - "compute a new column from existing ones with `mutate()`, overwrite a column and create several columns in one step that build on each other"
    - "distinguish two cases with `if_else()` and turn a number into groups such as age groups with `case_when()`"
    - "compute a value of its group for every row with `group_by()` and `mutate()`, such as the mean, and dissolve the grouping again with `ungroup()`"
    - "explain why `mutate()` does not change the table `survey` and how you keep a result with `<-`"
translation_of: de
based_on: 2026-11-09
---

`select()`, `filter()` and `arrange()` work with the columns a table already
has. `mutate()` adds new ones that you compute from the existing ones, and
keeps every row while doing so.

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

## Calculating within groups

So far `mutate()` has calculated every row on its own. Some calculations,
however, need the other rows of the same group, for instance if you want to
know whether a person is older or younger than the average of their diet.
For this you put `group_by()` before the `mutate()`:

```r
survey |>
  group_by(diet) |>
  mutate(
    mean_age_diet = mean(age),
    age_diff = age - mean_age_diet
  ) |>
  select(id, diet, age, mean_age_diet, age_diff)
```

`group_by()` changes nothing visible in the data, but it remembers which
rows belong together, and the output shows this in the line
`# Groups: diet [6]`: six groups, the five diets and the people without an
answer. `mean(age)` then calculates within each group separately, so all
omnivores get the value 48.8 and all flexitarians 49.3. The table keeps all
2,809 rows, and `age_diff` tells for every person how far they are from the
mean of their group: person 2, aged 35, is 13.8 years younger than the
omnivores on average.

## Dissolving the grouping

The grouping stays attached to the table, even after the `mutate()`, and
every further verb works per group as well. `slice_max()` from the lesson
[[dplyr-arrange]] then returns not the oldest person overall but the oldest
of each diet; `with_ties = FALSE` makes sure it stays at one person per
group even in case of a tie:

```r
survey |>
  group_by(diet) |>
  slice_max(age, n = 1, with_ties = FALSE) |>
  select(id, diet, age)
```

That is handy when you want it and a trap when you forget it. Once you no
longer need the groups, `ungroup()` dissolves them. Here `n()` first counts
within each group how many people a diet has, and after the `ungroup()`,
`filter()` keeps only the diets with at least 100 people:

```r
survey |>
  group_by(diet) |>
  mutate(n_diet = n()) |>
  ungroup() |>
  filter(n_diet >= 100) |>
  select(id, diet, n_diet)
```

The 2,709 omnivores, flexitarians and vegetarians remain, while the 36
vegans, the 36 pescetarians and the 28 people without an answer drop out.
How `group_by()` lets you collapse each group into a single row instead of
keeping all rows is shown in the lesson [[dplyr-summarize]].

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

- `mutate(name = calculation)` creates a column or overwrites an existing
  one, and within one `mutate()` a column can build on the previous one.
- `if_else()` distinguishes two cases, `case_when()` any number of them,
  checked from top to bottom; an `NA` ends up at `.default` there.
- With `group_by()` before it, `mutate()` calculates per group, such as a
  group mean, and keeps all rows; `ungroup()` dissolves the grouping again.
- A result only stays if you pass it on or store it with `<-`.
