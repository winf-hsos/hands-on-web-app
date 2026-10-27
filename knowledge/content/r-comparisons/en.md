---
title: Comparing and counting
summary: >-
  Comparisons give TRUE or FALSE for every value. How to combine them, check
  against a list with %in% and use them to count and to calculate shares.
translation_of: de
based_on: 2026-10-27
---

## What this is about

How many respondents are older than 50? What share are vegan? Such questions
begin with a comparison. In R a comparison gives `TRUE` or `FALSE` for every
value of a vector, and with these logical values you can count and select.

## Comparing

| Operator | Meaning |
|---|---|
| `==` | equal |
| `!=` | not equal |
| `<`, `<=` | less than, less than or equal |
| `>`, `>=` | greater than, greater than or equal |

Like calculating, a comparison applies to each value separately:

```r
ages <- c(56, 55, 47, 32, 74)
ages > 50
```

Equality is checked with **two** equals signs. A single `=` is an
assignment, like the arrow `<-`. You compare text the same way, in quotation
marks: `diet == "vegan"`.

## Combining conditions

`&` means "and", `|` means "or", and `!` reverses a logical value:

```r
ages <- c(56, 55, 47, 32, 74)
ages > 40 & ages < 60
```

This finds everyone between 40 and 60. With `|` it would be everyone for
whom at least one of the two conditions holds, so here everyone.

## Checking against a list

If a value should belong to a selection, a chain of `|` quickly gets long.
`%in%` checks for every value whether it occurs in another vector:

```r
diet <- c("vegan", "omnivore", "vegetarian", "omnivore")
diet %in% c("vegan", "vegetarian")
```

## Counting and shares

When you calculate with logical values, `TRUE` counts as 1 and `FALSE` as 0.
So `sum()` of a comparison is the number of hits and `mean()` their share:

```r
ages <- c(56, 55, 47, 32, 74)
sum(ages > 50)
```

Replace `sum` with `mean` in the box: 0.6 means three out of five are older
than 50. You will write these two lines all the time when analysing data.

## Key points

- Comparisons give `TRUE` or `FALSE` for every value; equal is `==`.
- `&` is "and", `|` is "or", `!` reverses; `%in%` checks against a list.
- `sum()` of a comparison counts the hits, `mean()` gives their share.
