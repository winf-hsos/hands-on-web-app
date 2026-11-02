---
title: Missing values
summary: >-
  NA stands for a value nobody knows. Why every calculation with it gives NA
  again, how to find missing values and when to leave them out.
objectives:
  intro: "This lesson shows you how R deals with missing values, and afterwards you can:"
  goals:
    - "explain why every calculation and every comparison with `NA` gives `NA` again"
    - "explicitly leave missing values out of a calculation such as `mean()` with `na.rm = TRUE`"
    - "find missing values with `is.na()` and count them with `sum(is.na(x))`"
    - "ask why values are missing before dropping them, and judge how that changes the group you are talking about"
translation_of: de
based_on: 2026-11-01
---

In real data, something is always missing: someone skipped a question, a
measuring device failed, a question was never asked. R writes `NA` for this,
for *not available*. How R deals with it is annoying at first sight and very
sensible at second.

## NA is contagious

With an unknown value, every result is unknown too. What is 5 plus a number
nobody knows? R can only answer that with `NA`:

```r
organic_share <- c(5, NA, 2, 4)
mean(organic_share)
```

This also holds for comparisons. Even `NA == NA` gives `NA`, because nobody
knows whether two unknown values are equal.

## Leaving missing values out

Many functions have the argument `na.rm` (*remove NA*). With `na.rm = TRUE`
they only calculate with the values that are there:

```r
organic_share <- c(5, NA, 2, 4)
mean(organic_share, na.rm = TRUE)
```

Having to say so explicitly is deliberate: missing values should not vanish
unnoticed. The mean above now refers to three people, not four.

## Finding missing values

Because a comparison with `NA` does not work, there is a function of its own
for this. `is.na()` gives `TRUE` where a value is missing:

```r
organic_share <- c(5, NA, 2, 4)
is.na(organic_share)
```

Together with what you know about [[r-vectors|counting]],
`sum(is.na(organic_share))` gives the number of missing values.

## Ask first why something is missing

Before you leave missing values out, it is worth asking why they are
missing. In a survey, `NA` often means "not asked", because a question was
put to only some of the respondents. If you simply remove such values, you
are afterwards talking about a different group of people than before.

## Key points

- `NA` is an unknown value; every calculation with it gives `NA` again.
- `na.rm = TRUE` explicitly leaves missing values out.
- `is.na()` finds them, `sum(is.na(x))` counts them.
