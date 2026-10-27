---
title: R as a calculator
summary: >-
  Your first contact with R: calculating, using brackets, dividing into whole
  numbers and writing comments, right in the browser.
translation_of: de
based_on: 2026-10-27
---

## What this is about

R is a programming language made for working with data. Before data come in,
you get to know R from its simplest side: as a calculator. Every code box on
this page is a small editor. You can change the code and start it with
**Run**; R runs in your browser, so there is nothing to install. On the first
click, loading takes a moment.

## Calculating

R computes what you write and shows the result straight away:

```r
3 + 4
19.90 - 2.50
6 * 7
1 / 3
```

You write decimals with a point, as almost everywhere in programming. You can
ignore the `[1]` in front of each result for now; it counts the values of an
output and only becomes useful with long outputs.

## Powers and brackets

`^` raises to a power. Multiplication comes before addition, and brackets
change the order, just as at school:

```r
2^10
2 + 3 * 4
(2 + 3) * 4
```

## Dividing into whole numbers

Two operators come up again and again when analysing data. `%/%` divides
without a remainder, `%%` returns only the remainder:

```r
17 %/% 5
17 %% 5
```

This lets you assign an age to its decade, for example: `47 %/% 10 * 10`
gives 40.

## Comments

R ignores everything after a `#`. That is how you write notes into your code
that explain what it does:

```r
# price of a litre of milk with 7 percent VAT
1.09 * 1.07
```

Comments are for people, including yourself in a few weeks.

## Key points

- R calculates with `+`, `-`, `*`, `/` and `^`, multiplication before
  addition, brackets first.
- `%/%` divides without a remainder, `%%` gives the remainder.
- Decimals with a point, comments after `#`.
