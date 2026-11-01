---
title: Vectors
summary: >-
  In R almost everything is a vector, a series of values: how to build them,
  calculate with them and pick out single values.
objectives:
  intro: "This lesson introduces vectors, the form in which R stores almost every value, and afterwards you can:"
  goals:
    - "build a vector with `c()` and create a sequence of numbers with `1:10`"
    - "calculate with a vector and combine two vectors of the same length position by position"
    - "summarise a vector into a single value with `sum()`, `mean()`, `min()`, `max()` and `length()`"
    - "pick out single positions with square brackets, counted from 1, or leave one out with a minus"
translation_of: de
based_on: 2026-11-01
---

Data rarely consist of a single value. The age of all respondents, the
prices of a shopping trip, the answers to a question: these are series of
values. In R such a series is called a **vector**, and almost everything in
R is one. A single number is a vector too, just with one value; hence the
`[1]` in front of every output.

## Building vectors

With `c()` (for *combine*) you put values together into a vector:

```r
ages <- c(56, 55, 47, 32, 74)
ages
```

There is a shortcut for sequences of numbers: `1:10` is the vector of the
numbers from 1 to 10.

## Calculating with vectors

When you calculate with a vector, R calculates with every single value:

```r
ages <- c(56, 55, 47, 32, 74)
ages + 1
```

R combines two vectors of the same length position by position, the first
value with the first, the second with the second:

```r
prices <- c(1.09, 2.49, 0.89)
amounts <- c(3, 1, 2)
prices * amounts
```

This is exactly what makes R so convenient for data: a column of a table is
a vector, and one calculation applies to all rows at once, without a loop.

## Functions for vectors

Many functions summarise a vector into a single value, such as `sum()`,
`mean()`, `min()`, `max()` and `length()`:

```r
ages <- c(56, 55, 47, 32, 74)
mean(ages)
```

Try the others in the box too, by replacing `mean` with another name.

## Picking out single values

With square brackets you access positions of a vector. Counting starts at 1:

```r
ages <- c(56, 55, 47, 32, 74)
ages[2]
```

The brackets can also hold a vector of positions, such as `ages[c(1, 3)]`
for the first and the third value, or `ages[2:4]` for positions 2 to 4. A
minus leaves a position out: `ages[-1]` is everything except the first value.

## Key points

- `c()` builds a vector, `1:10` a sequence of numbers.
- Calculations apply to every value; two vectors are combined position by
  position.
- `sum()`, `mean()`, `length()` and their relatives summarise a vector;
  `[ ]` picks out single positions, counted from 1.
