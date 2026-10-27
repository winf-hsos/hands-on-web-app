---
title: Giving values a name
summary: >-
  With the arrow <- you store a result under a name and keep calculating with
  the name; plus the rules for good names.
translation_of: de
based_on: 2026-10-27
---

## What this is about

A result that R only shows is gone the next moment. To keep calculating
with it, you give it a name. Programmers call this a *variable*: a name with
a value behind it.

## The arrow

With `<-` you store a value under a name. The arrow reads as "gets": `price`
gets the value 1.09. From then on the name stands for the value, and R shows
it as soon as you write it on a line of its own:

```r
price <- 1.09
price_with_tax <- price * 1.07
price_with_tax
```

The first and second lines show nothing, because assigning is not showing.
Only the third asks for the value.

`=` also works for assignment, but the arrow is customary in R, and that is
also how most examples you find online are written.

## Overwriting

If you assign a new value to a name, the old one is gone. That also holds
when the new value is calculated from the old one:

```r
litres <- 2
litres <- litres + 1
litres
```

## Good names

A name may contain letters, digits, `_` and `.`, but must start with a
letter. Spaces are not allowed, and R distinguishes upper and lower case:
`Price` and `price` are two different names.

It is customary to write names in lower case and separate words with `_`,
such as `price_per_litre`. A good name says what is in it; `x` does not.

## When R does not know a name

If you make a typo, or use a name before assigning anything to it, R reports
that it cannot find the object:

```r
price <- 1.09
prise * 2
```

You will meet this message often. Almost always it is a typo or a line that
has not been run yet.

## Key points

- `<-` gives a value a name that you can use instead of the value.
- A new value overwrites the old one.
- Names in lower case, with `_` between words; case matters.
