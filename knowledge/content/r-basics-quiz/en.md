---
title: "Quiz: Getting started with R"
summary: Seven questions on names, functions, vectors, types, comparisons, missing values and the pipe.
translation_of: de
based_on: 2026-10-27
---

## What is in `litres` after these three lines?

```r static
litres <- 2
litres <- litres * 3
litres <- litres + 1
```

- [ ] `2`
- [ ] `6`
- [x] `7`

> Each line overwrites the value: first 2, then 2 times 3, so 6, then 6 plus
> 1.

## What does `round(sqrt(10), digits = 1)` give?

- [ ] `3`
- [x] `3.2`
- [ ] `3.16`

> R reads from the inside out: the square root of 10 is 3.162…, and
> `round()` rounds it to one decimal place.

## What does `c(1, 2, 3) * 2` give?

- [ ] `12`
- [x] `2 4 6`
- [ ] An error, because you cannot multiply a vector

> Calculations with a vector apply to every single value.

## What type does the vector `c(5, 3, "no answer")` have?

- [ ] `numeric`
- [x] `character`
- [ ] It has two types, the right one for each value.

> A vector has only one type. Because not every text can be read as a number,
> R turns everything into text.

## `ages` holds five ages. What does `mean(ages > 50)` give?

- [ ] the average age of those older than 50
- [x] the share of those older than 50
- [ ] how many are older than 50

> The comparison gives `TRUE` or `FALSE` for every person. `TRUE` counts as 1,
> `FALSE` as 0, and their mean is the share. The number would be `sum()`.

## What does `mean(c(4, NA, 2))` give?

- [ ] `3`
- [x] `NA`
- [ ] `2`

> With an unknown value, the mean is unknown too. Only with `na.rm = TRUE`
> does `mean()` calculate with the two known values and give 3.

## What does `survey |> nrow()` do? (several correct)

- [x] the same as `nrow(survey)`
- [x] it counts the rows of `survey`
- [ ] it counts the rows and stores the number in `survey`

> The pipe passes `survey` as the first argument to `nrow()`. Nothing is
> stored; that would take an assignment with `<-`.
