---
title: Numbers, text and logical values
summary: >-
  Every vector has a type: number, text or logical value. How to recognise
  it, why a vector can have only one type and how to convert.
translation_of: de
based_on: 2026-10-27
---

## What this is about

R distinguishes what kind of value a vector holds, because that decides what
you can do with it. You can calculate with numbers, not with text. Three
types are enough to begin with.

| Type | Example | For |
|---|---|---|
| `numeric` | `1.09`, `47` | measurements, prices, counts |
| `character` | `"vegan"` | text, such as categories and names |
| `logical` | `TRUE`, `FALSE` | yes or no, the result of a comparison |

Text always goes in quotation marks. `TRUE` and `FALSE` go without, because
they are not text but logical values.

## Asking for the type

`class()` tells you which type a value has:

```r
diet <- c("vegan", "omnivore", "vegetarian")
class(diet)
```

Whole numbers that R produces itself, for example with `1:10`, have the type
`integer`. For you they behave like any other number.

## One vector, one type

A vector can have only one type. If you mix numbers and text, R silently
turns everything into text, because a number can always be written as text,
but not every text as a number:

```r
answers <- c(3, 5, "no answer", 2)
answers
```

The quotation marks in the output show it: the numbers have become text,
which you can no longer calculate with. This happens often when reading
data, when a single word sits in a column of numbers.

## Converting

With `as.numeric()` you turn text back into numbers. Whatever cannot be read
as a number becomes `NA`, a missing value, and R warns you about it:

```r
as.numeric(c("3", "5", "no answer", "2"))
```

There is also `as.character()`. The other way round, R counts `TRUE` as 1
and `FALSE` as 0 when you calculate with logical values; that becomes very
useful for [[r-comparisons|comparisons]].

## When R is to calculate with text

If you try to calculate with text, R stops and says that an argument is not
numeric:

```r
"3" + 4
```

When you meet this message, check with `class()` which type your values
really have.

## Key points

- Three types to begin with: numbers (`numeric`), text (`character`) and
  logical values (`logical`); `class()` tells you the type.
- A vector has only one type; mixed values become text.
- `as.numeric()` converts and turns anything unreadable into `NA`.
