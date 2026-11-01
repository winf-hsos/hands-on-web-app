---
title: "Exercise: Converting seconds"
summary: >-
  A function of your own turns a number of seconds into a readable duration
  such as 2 h 5 min 7 s, and a small main program asks for it.
objectives:
  intro: "In this exercise you write a function of your own that turns seconds into a readable duration, and afterwards you can:"
  goals:
    - "split a number of seconds step by step into hours, minutes and seconds with `//` and `%`"
    - "write a function that returns its result as text with `return` instead of printing it"
    - "keep input and output in a `main` function, separate from the actual calculation"
    - "test a function on its own with values whose result you know by heart, such as 59, 60, 3600 and 3661 seconds"
translation_of: de
based_on: 2026-11-01
---

## Task

Write a function `format_duration(seconds)` that gets a number of seconds and
returns a text that expresses the same duration in hours, minutes and
seconds, for example `"2 h 5 min 7 s"` for 7507 seconds. The function itself
prints nothing; it returns the text with `return`. A main program `main` asks
for the seconds, calls the function and prints the result.

## What it should look like

```text
How many seconds? 7507
7507 seconds are 2 h 5 min 7 s.
```

## Your program

```python
def main():
    answer = input("How many seconds? ")
    seconds = int(answer)
    duration = format_duration(seconds)
    print(f"{seconds} seconds are {duration}.")


def format_duration(seconds):
    # Work out hours, minutes and seconds and return the text.
    return ""


main()
```

Because `format_duration` returns its result, you can also test it on its
own. To do so, temporarily replace the last line with
`print(format_duration(7507))` and compare with the expected result.

> [!HINT]
> An hour has 3600 seconds. `seconds // 3600` gives the full hours, and
> `seconds % 3600` the seconds left over after that. With this remainder you
> do the same once more with 60 for the minutes.

> [!HINT]
> Test your function with values whose result you know by heart: 59 seconds,
> 60 seconds, 3600 seconds and 3661 seconds.

> [!SOLUTION]
> ```python
> def main():
>     answer = input("How many seconds? ")
>     seconds = int(answer)
>     duration = format_duration(seconds)
>     print(f"{seconds} seconds are {duration}.")
>
>
> def format_duration(seconds):
>     hours = seconds // 3600
>     rest = seconds % 3600
>     minutes = rest // 60
>     rest = rest % 60
>     return f"{hours} h {minutes} min {rest} s"
>
>
> main()
> ```
>
> The function splits the seconds in two steps, first into hours and a
> remainder, then the remainder into minutes and seconds. For 7507 that gives
> 2 hours and a remainder of 307 seconds, and 307 seconds are 5 minutes and 7
> seconds.

## For the quick ones

Extend the function with days, so that 90061 seconds appear as
`1 d 1 h 1 min 1 s`.
