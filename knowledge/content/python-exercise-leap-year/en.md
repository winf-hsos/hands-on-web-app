---
title: "Exercise: Leap year"
summary: >-
  A function checks with remainder, and and or whether a year is a leap year,
  and a small main program asks for the year and answers with a sentence.
objectives:
  intro: "In this exercise you write a function that recognises leap years, and afterwards you can:"
  goals:
    - "translate a rule with exceptions into a single condition made of `%`, `and` and `or`"
    - "use round brackets to set which parts of a condition belong together"
    - "write a function that returns a truth value with `return` and turn it into a sentence with `if` and `else`"
    - "test a rule with examples that cover every exception, such as 2024, 2023, 1900 and 2000"
translation_of: de
based_on: 2026-11-01
---

## Task

A year has 365 days, a leap year one more, the 29th of February. In our
calendar a year is a leap year if it is divisible by 4. There is one
exception: if it is also divisible by 100, it is not a leap year. And the
exception has an exception of its own: if it is divisible by 400, it is one
after all. So 2024 is a leap year, 2023 is not, 1900 is not and 2000 is
again.

Write a function `is_leap_year(year)` that returns `True` if `year` is a leap
year, and `False` otherwise. A main program `main` asks for a year and
answers with a sentence.

## What it should look like

Two runs, once with 2024 and once with 1900:

```text
Which year? 2024
2024 is a leap year.

Which year? 1900
1900 is not a leap year.
```

## Your program

```python
def main():
    year = int(input("Which year? "))
    # Print a fitting sentence with the help of is_leap_year.


def is_leap_year(year):
    # Return True if year is a leap year, otherwise False.
    return False


main()
```

> [!HINT]
> "Divisible by 4" means that dividing by 4 leaves no remainder, so in Python
> `year % 4 == 0`. "Not divisible by 100" is then `year % 100 != 0`. First
> translate each of the three rules into such a comparison before you combine
> them.

> [!HINT]
> In words, the whole rule reads: divisible by 4, **and** in addition either
> not divisible by 100 **or** divisible by 400. Because Python works out
> `and` before `or`, the part with `or` belongs in round brackets. Afterwards,
> test the function with all four examples from the task.

> [!SOLUTION]
> ```python
> def main():
>     year = int(input("Which year? "))
>     if is_leap_year(year):
>         print(f"{year} is a leap year.")
>     else:
>         print(f"{year} is not a leap year.")
>
>
> def is_leap_year(year):
>     return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)
>
>
> main()
> ```
>
> The function needs no `if`, because the condition itself already is the
> truth value it is meant to return. For 1900 the first part is true, but in
> the brackets both sides are false, and so the whole result is `False`. The
> brackets make the condition read like the rule in words, with the `or` as
> the exception to the exception.

## For the quick ones

Write a function `days_in_month(month, year)` that returns how many days a
month has, with `month` as a number from 1 to 12. February has 28 days, 29 in
a leap year, April, June, September and November have 30, all others 31. Use
`is_leap_year` in it, and for the months with 30 days, `in` with a list
helps.
