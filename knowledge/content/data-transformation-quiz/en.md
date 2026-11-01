---
title: "Quiz: Transforming data"
summary: Six questions on the basic operations, tidy data, select(), filter() and missing values.
objectives:
  intro: "This quiz lets you check whether you can:"
  goals:
    - "choose the basic operation that fits a question, such as filtering rows rather than selecting columns"
    - "tell when `summarize()` returns a single row and when, with `group_by()` before it, one row per group"
    - "recognise that a table is not tidy when a variable such as the year is hidden in the column names"
    - "predict which rows and columns `select()` with `starts_with()` and `filter()` with `%in%` and several conditions return"
    - "explain why `== NA` finds no row and why you look for missing values with `is.na()`"
translation_of: de
based_on: 2026-11-01
---

## You only want to look at the respondents from Bavaria. Which operation do you need?

- [ ] Selecting columns
- [x] Filtering rows
- [ ] Summarising

> This is about a subset of the people, that is, of the rows. Which columns
> you need afterwards is a second question.

## Which operation turns 30 rows into exactly one?

- [ ] `filter()`
- [ ] `arrange()`
- [x] `summarize()` without `group_by()`

> `summarize()` combines all rows into one, for instance into an average and
> a count. With `group_by()` before it, you get one row per group.

## A table has the columns `id`, `price_2024` and `price_2025`. What is untidy about it?

- [ ] A cell holds several values.
- [x] The year is a variable, but it is hidden in the column names.
- [ ] The table has too few rows.

> Tidy would be the columns `id`, `year` and `price`, with two rows per `id`.
> Then you can filter and group by year like by any other variable.

## What does `survey |> select(id, starts_with("milk"))` return? (several correct)

- [x] all 30 rows
- [x] the column `id`
- [x] the columns `milk_freq` and `milk_brand`
- [ ] only rows in which a kind of milk is given

> `select()` never changes the number of rows. `starts_with("milk")` selects
> the columns whose name starts with `milk`.

## Why does `survey |> filter(milk_freq == NA)` return not a single row?

- [ ] Because no values are missing in `milk_freq`
- [x] Because a comparison with `NA` yields `NA` again, and `filter()` only keeps rows with `TRUE`
- [ ] Because `NA` has to be written in quotation marks

> You ask for missing values with `is.na(milk_freq)`. `"NA"` in quotation
> marks would be a text of two letters, not a missing value.

## Which rows does `filter(diet %in% c("vegan", "vegetarian"), age < 50)` keep?

- [ ] all who are vegan or vegetarian, and in addition everyone under 50
- [x] only those who are vegan or vegetarian and at the same time younger than 50
- [ ] only those who are vegan and vegetarian at the same time

> The comma joins conditions with "and". `%in%` checks whether the value
> belongs to the list, that is, whether it is one of the two diets.
