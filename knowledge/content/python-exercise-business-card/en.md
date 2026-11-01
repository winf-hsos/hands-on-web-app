---
title: "Exercise: Business card"
summary: >-
  A program asks for a name, a subject and a city and turns them into a neatly
  formatted business card, however sloppily they were typed.
objectives:
  intro: "In this exercise you turn three inputs into a neatly formatted business card, and afterwards you can:"
  goals:
    - "ask for several inputs one after another with `input()` and store them in variables"
    - "tidy up and format input with chained methods such as `strip().upper()` and `strip().title()`"
    - "build a dividing line from a single character with `*` and keep it in a variable so that it can be changed in one place"
    - "combine several values into one line of output with an f-string"
translation_of: de
based_on: 2026-11-01
---

## Task

Write a program that asks for a name, a subject and a city, one after the
other, and makes a small business card from them. The name should appear in
capitals, subject and city with capital initials, and extra spaces at the
start or end of an input should disappear. A line of 30 equals signs closes
off the card at the top and bottom.

## What it should look like

With the inputs `  ada lovelace`, `mathematics` and `london  ` the program
prints:

```text
Name:   ada lovelace
Subject: mathematics
City: london
==============================
  ADA LOVELACE
  Mathematics · London
==============================
```

## Your program

The skeleton already asks for the name. Add the rest and try it with
different inputs, including deliberately sloppy ones.

```python
name = input("Name: ")

# Ask for subject and city.

# Print the card.
```

> [!HINT]
> The methods from the lesson can be chained: `input("Name: ").strip().upper()`
> reads, tidies up and capitalises, all in one line. You get the line with
> `"=" * 30`.

> [!HINT]
> For the second line of the card, an f-string puts both values together with
> the dot in between: `f"  {course} · {city}"`.

> [!SOLUTION]
> ```python
> name = input("Name: ").strip().upper()
> course = input("Subject: ").strip().title()
> city = input("City: ").strip().title()
>
> line = "=" * 30
> print(line)
> print(f"  {name}")
> print(f"  {course} · {city}")
> print(line)
> ```
>
> The line is stored in a variable because it is needed twice. If the card
> should get wider, you change the number in one place only.

## For the quick ones

Make the line exactly as long as the longest line of the card. The function
`max` returns the largest of several numbers, for example
`max(len(a), len(b))`.
