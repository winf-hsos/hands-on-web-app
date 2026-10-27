---
title: Calling functions
summary: >-
  Functions are R's tools: they receive arguments, return a result and can be
  nested inside each other.
translation_of: de
based_on: 2026-10-27
---

## What this is about

Almost everything you do in R, you do with a **function**. A function has a
name, round brackets follow it, and inside the brackets it receives its
values, the *arguments*. It returns a result.

```r
sqrt(16)
```

`sqrt()` takes the square root. You can show the result, store it under a
name or use it straight away, like any other value.

## Several arguments

Some functions need more than one value. `round()` rounds a number and
learns from the second argument to how many digits:

```r
round(3.14159, 2)
```

Arguments have names, and you may write them out. Then the order no longer
matters, and the code explains itself:

```r
round(3.14159, digits = 2)
```

If you leave out an argument, the function uses its default. For `round()`
that is zero decimal places, so `round(3.14159)` gives 3.

## Nesting functions

The result of one function can be the argument of the next. R reads such
calls from the inside out:

```r
round(sqrt(10), digits = 1)
```

First `sqrt()` takes the square root of 10, then `round()` rounds the result
to one digit. More than two or three levels quickly get confusing; that is
what the [[r-pipe|pipe]] is for later.

## Finding help

Every function has a help page with all its arguments and examples. In R on
your own computer you open it with a question mark in front of the name:

```r static
?round
```

A web search for "r round" works just as well. Help pages are written
tersely, but the examples at the very bottom are almost always worth it.

## When R does not know a function

If you mistype the name, R reports that it cannot find the function:

```r
rund(3.14159)
```

The same message appears when the function comes from a package that is not
loaded; the lesson [[r-packages]] is about that.

## Key points

- A function receives arguments in round brackets and returns a result.
- Arguments can be given by name; missing ones get a default.
- R reads nested calls from the inside out.
