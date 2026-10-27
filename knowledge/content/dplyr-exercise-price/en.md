---
title: "Exercise: The price question"
summary: >-
  From which price is a litre of milk too expensive? With select() and
  filter() you find out who answered the question, and clear an implausible
  answer out of the way.
translation_of: de
based_on: 2026-10-27
---

## Task

In the survey, some of the respondents were shown a brand of milk, either
Weihenstephan or alpro, and asked from which price a litre would be too
expensive for them. The brand is in `milk_brand`, the answer in
`price_too_expensive`. Everyone else never saw the question, and both values
are missing for them.

Answer three questions with `select()` and `filter()`, each with a pipe of
its own:

1. How many people answered the price question?
2. For these people, show only `id`, `age`, `diet`, `milk_brand` and
   `price_too_expensive`, and leave out the one answer that cannot be meant
   seriously as a price per litre.
3. Which of them do not eat omnivore and gave the price for alpro?

## Your code

Each question has its own box.

```r
# 1. How many answered the price question?
survey |>
  filter() |>
  nrow()
```

```r
# 2. The plausible answers, with five columns
survey |>
  filter() |>
  select()
```

```r
# 3. Not omnivore and alpro
survey |>
  filter()
```

> [!HINT]
> A person answered the question if `price_too_expensive` is not missing. How
> to ask for missing values is shown in the lesson [[dplyr-filter]]; you get
> the opposite with `!`. To check: there are nine people.

> [!HINT]
> For the second question you need two conditions in `filter()`, separated
> by a comma, followed by a `select()`. A limit of 10 euros safely separates
> serious prices per litre from the one outlier; eight rows remain.

> [!SOLUTION]
> Question 1:
>
> ```r
> survey |>
>   filter(!is.na(price_too_expensive)) |>
>   nrow()
> ```
>
> Question 2:
>
> ```r
> survey |>
>   filter(!is.na(price_too_expensive), price_too_expensive <= 10) |>
>   select(id, age, diet, milk_brand, price_too_expensive)
> ```
>
> Question 3:
>
> ```r
> survey |>
>   filter(milk_brand == "alpro", diet != "omnivore") |>
>   select(id, age, diet, milk_brand, price_too_expensive)
> ```
>
> Strictly speaking, the first condition in the second pipe is unnecessary,
> because `filter()` drops rows with a missing price anyway as soon as you
> compare the price. It does no harm, though, and makes clear what is meant.
> The third question finds three people, all of them flexitarian.

## For the quick ones

Who saw the brand Weihenstephan and finds a litre too expensive at 2 euros
or less? Arrange the columns so that the price comes first.
