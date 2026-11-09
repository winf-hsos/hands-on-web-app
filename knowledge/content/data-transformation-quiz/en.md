---
title: "Quiz: Transforming data"
summary: >-
  Twelve questions on the basic operations, tidy data, the verbs of dplyr
  and missing values, each with its reason.
translation_of: de
based_on: 2026-11-09
---

## You only want to look at the respondents from Bavaria. Which operation do you need? {#hds-001}

- [ ] Selecting columns
  > Selecting columns changes which characteristics you see, but not which people the table is about.
- [x] Filtering rows
  > Correct: each person is a row, and you want to keep a subset of these rows.
- [ ] Summarising
  > Summarising turns many rows into one, such as an average, after which the Bavarians are no longer visible one by one.
- [ ] Sorting
  > Sorting might bring the Bavarians to the top, but it keeps all the other rows.

> Filtering rows decides who or what the analysis is about; which columns you need afterwards is a second question.

## Which operation always turns 30 rows into exactly one? {#hds-002}

- [ ] `filter()` with a condition
  > `filter()` may happen to leave exactly one row, but depending on the condition it can also leave none or all 30.
- [ ] `arrange()` by one column
  > `arrange()` only changes the order; the number of rows stays 30.
- [x] `summarize()` without `group_by()`
  > Correct: `summarize()` combines all rows into one, for instance into an average and a count; with `group_by()` before it, you get one row per group.
- [ ] `mutate()` with a new column
  > `mutate()` computes a new value for every row and keeps all 30 rows.

## A table has the columns `id`, `price_2024` and `price_2025`. What is untidy about it? {#hds-003}

- [ ] A cell holds several values.
  > Each cell holds exactly one price here; the problem lies in the column names.
- [x] The year is a variable, but it is hidden in the column names.
  > Correct: tidy would be the columns `id`, `year` and `price` with two rows per `id`, and then you can filter and group by year like by any other variable.
- [ ] The table has too few rows.
  > The number of rows says nothing about whether a table is tidy; what matters is whether every variable has its own column.
- [ ] The column names are in English.
  > The language of the names does not matter for tidy data, as long as each column holds exactly one variable.

## What does `survey |> select(id, starts_with("milk"))` return? (Several answers may be correct.) {#hds-004}

- [x] all 30 rows
  > Correct: `select()` picks columns and never changes the number of rows.
- [x] the column `id`
  > Correct: `id` is the first name in `select()`, so it stays at the front.
- [x] the columns `milk_freq` and `milk_brand`
  > Correct: `starts_with("milk")` selects every column whose name starts with `milk`.
- [ ] only rows in which a kind of milk is given
  > Rows are the business of `filter()`, not `select()`; missing values simply stay as `NA` here.

## Why does `survey |> filter(milk_freq == NA)` return not a single row? {#hds-005}

- [ ] Because no values are missing in `milk_freq`
  > Values are indeed missing; `filter(is.na(milk_freq))` finds them.
- [x] Because a comparison with `NA` yields `NA` again
  > Correct: R cannot know whether an unknown value equals another unknown one, and `filter()` only keeps rows in which the condition is `TRUE`, which is why you ask for missing values with `is.na()`.
- [ ] Because `NA` has to be written in quotation marks
  > `"NA"` in quotation marks would be a text of two letters, not a missing value.
- [ ] Because `filter()` does not allow comparisons with `==`
  > `filter()` uses `==` all the time, for instance `filter(diet == "vegan")`; only the comparison with `NA` leads nowhere.

## Which rows does `filter(diet %in% c("vegan", "vegetarian"), age < 50)` keep? {#hds-006}

- [ ] all who are vegan or vegetarian, and in addition everyone under 50
  > That would be an “or” between the conditions, that is `|`; the comma requires both.
- [x] only those who are vegan or vegetarian and at the same time younger than 50
  > Correct: the comma joins conditions with “and”, and `%in%` checks whether the value is one of the two diets.
- [ ] only those who are vegan and vegetarian at the same time
  > `%in%` asks whether the value occurs in the list, so one or the other; a person has only one value in `diet` anyway.
- [ ] none, because `%in%` cannot be combined with a second condition
  > Like any comparison, `%in%` yields `TRUE` or `FALSE` and can therefore be combined freely with further conditions.

## What does `survey |> arrange(desc(age))` return? {#hds-007}

- [x] all rows, the oldest person first
  > Correct: `arrange()` sorts whole rows, and `desc()` reverses the order so that the highest age comes first.
- [ ] only the row of the oldest person
  > `arrange()` keeps all rows; the oldest person alone is what `slice_max(age)` returns, for example.
- [ ] the column `age` sorted in descending order, the other columns in their old order
  > A row always stays together when sorting; otherwise each age would afterwards belong to a different person.
- [ ] all rows, the youngest person first
  > That is what `arrange(age)` without `desc()` does, sorting in ascending order.

## What does `survey |> mutate(age_months = age * 12)` return? {#hds-008}

- [x] all rows and columns of `survey` plus the column `age_months`
  > Correct: `mutate()` computes a value for every row and adds it as a new column; the rows and other columns stay.
- [ ] `survey` with the column `age` replaced by the age in months
  > `age` would only be overwritten by `mutate(age = age * 12)`; a new name gives a new column.
- [ ] only the column `age_months`
  > `mutate()` keeps all columns; seeing only the new one would need a `select()` afterwards.
- [ ] a single row with the age in months
  > Turning many rows into one is the job of `summarize()`; `mutate()` computes row by row.

## `survey |> summarize(mean_price = mean(price_too_expensive))` returns `NA`. Why? {#hds-009}

- [x] Values are missing in the column, and without `na.rm = TRUE` the average is then `NA` as well.
  > Correct: most respondents never saw the price question, and an average over unknown values is itself unknown; `mean(price_too_expensive, na.rm = TRUE)` leaves them out.
- [ ] `summarize()` can only count, not average.
  > Any function that turns many values into one works inside `summarize()`, such as `mean()`, `median()` or `max()`.
- [ ] Without `group_by()`, `summarize()` computes nothing.
  > Without `group_by()`, `summarize()` combines the whole table into one row, which is a valid result.
- [ ] An outlier such as 160 euros makes the average fail.
  > An outlier distorts the average but does not turn it into `NA`; that comes from the missing answers.

> Missing values turn average, sum and maximum into `NA` unless you explicitly set `na.rm = TRUE`.

## How many rows does `survey |> group_by(diet) |> summarize(n = n())` return? {#hds-010}

- [x] one per value that occurs in `diet`
  > Correct: `group_by()` forms one group per value that occurs, with missing answers as a group `NA` of their own, and `summarize()` turns each group into one row.
- [ ] as many as `survey`, one per person
  > One row per person is what `mutate()` keeps; `summarize()` combines each group into one row.
- [ ] exactly one
  > Exactly one row is the result without `group_by()`; with it there is one row per group.
- [ ] two, one for `diet` and one for `n`
  > `diet` and `n` are the columns of the result; the number of rows depends on how many groups there are.

## Which expressions count how many respondents there are per diet? (Several answers may be correct.) {#hds-011}

- [x] `survey |> count(diet)`
  > Correct: `count(diet)` is the shorthand for grouping and counting and returns a column `n`.
- [x] `survey |> group_by(diet) |> summarize(n = n())`
  > Correct: this is the long form of the same count; `n()` counts the rows of each group.
- [ ] `survey |> summarize(n = n())`
  > Without `group_by()` this counts all respondents together and returns a single number.
- [ ] `survey |> arrange(diet)`
  > `arrange()` sorts the respondents by diet but does not count them.

## Which pipeline answers the question of how old the vegan respondents are on average? {#hds-012}

- [x] `survey |> filter(diet == "vegan") |> summarize(mean_age = mean(age))`
  > Correct: first pick the rows the question is about, then summarise.
- [ ] `survey |> summarize(mean_age = mean(age)) |> filter(diet == "vegan")`
  > After `summarize()` only the column `mean_age` is left, so there is no `diet` to filter by any more, and R reports an error.
- [ ] `survey |> select(age) |> filter(diet == "vegan")`
  > `select(age)` drops `diet` before `filter()` needs it, and the average is missing as well.
- [ ] `survey |> filter(diet = "vegan") |> summarize(mean_age = mean(age))`
  > A single `=` assigns rather than compares; `filter()` stops with a hint to use `==`.

> The order of the verbs follows the question: first choose whom it is about, then summarise.
