---
title: "Exercise: A week of weather"
summary: >-
  The temperatures of a week are in a list. The program sums them up, takes in
  a new reading and shows how the picture changes.
objectives:
  intro: "In this exercise you analyse the temperatures of a week, and afterwards you can:"
  goals:
    - "sum up a list of readings with `min()`, `max()`, `sum()` and `len()`"
    - "print the first and the last value of a list with `[0]` and `[-1]`"
    - "convert an input value with `float()` and add it to the list with `append()`"
    - "print the values in order with `sorted()` without changing the list itself"
    - "print decimal numbers with one decimal place using `:.1f` in an f-string"
translation_of: de
based_on: 2026-11-01
---

## Task

A weather station measured the temperature at noon on seven days; the values
are already in the program. Write a program that prints how many readings
there are, which value stood at the start and which at the end of the week,
how warm it was at most and at least, and how high the average is. After that
it asks for today's reading, adds it to the list and prints the new average
and all values by size.

## What it should look like

```text
7 readings
First day: 12.5 degrees, last day: 15.5 degrees
At most 18.0 degrees, at least 9.5 degrees
Average: 13.4 degrees
Temperature today? 21
Now 8 readings, average: 14.4 degrees
By size: [9.5, 11.0, 12.5, 13.5, 14.0, 15.5, 18.0, 21.0]
```

## Your program

```python
temperatures = [12.5, 14.0, 9.5, 18.0, 13.5, 11.0, 15.5]

# How many values, first and last, highest and lowest, average?

# Ask for today's value and add it, then analyse again
```

> [!HINT]
> No function of its own gives the average: divide the sum by the number of
> values, that is `sum(temperatures) / len(temperatures)`. With `:.1f` in the
> f-string it appears with one decimal place.

> [!HINT]
> `input()` returns text. For it to go into the list as a number, convert it
> with `float()` before you add it with `append()`. After adding, the list is
> one element longer, and `len()` and `sum()` see the new value by
> themselves.

> [!SOLUTION]
> ```python
> temperatures = [12.5, 14.0, 9.5, 18.0, 13.5, 11.0, 15.5]
>
> average = sum(temperatures) / len(temperatures)
> print(f"{len(temperatures)} readings")
> print(f"First day: {temperatures[0]} degrees, last day: {temperatures[-1]} degrees")
> print(f"At most {max(temperatures)} degrees, at least {min(temperatures)} degrees")
> print(f"Average: {average:.1f} degrees")
>
> today = float(input("Temperature today? "))
> temperatures.append(today)
>
> average = sum(temperatures) / len(temperatures)
> print(f"Now {len(temperatures)} readings, average: {average:.1f} degrees")
> print(f"By size: {sorted(temperatures)}")
> ```
>
> The average is worked out again after adding, because the variable
> `average` still holds the old value: it remembered the number, not the
> calculation. And because `sorted()` returns a new list, `temperatures` keeps
> the order of the measuring days.

## For the quick ones

Also print on which day it was warmest. `temperatures.index(value)` returns
the position at which a value first occurs; add one so that the first day is
called day 1 and not day 0.
