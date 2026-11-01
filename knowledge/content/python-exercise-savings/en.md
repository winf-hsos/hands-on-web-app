---
title: "Exercise: Savings goal"
summary: >-
  A program works out how many years savings with interest need to reach a
  savings goal. It keeps asking for the interest rate until it is greater
  than 0, so that the loop over the years comes to an end.
objectives:
  intro: "In this exercise you work out when a savings goal is reached, and afterwards you can:"
  goals:
    - "keep asking for an input with `while True` and `break` until it is valid"
    - "give reasons why an input has to be checked so that a later loop does not run endlessly"
    - "credit interest year by year with a `while` loop until a goal is reached, counting the rounds on the way"
    - "print amounts of money with two decimal places using `:.2f` in an f-string"
translation_of: de
based_on: 2026-11-01
---

## Task

Write a program that works out how long savings with interest take to reach
a savings goal. It asks for the starting amount, the interest rate in per
cent and the goal. For the interest rate it keeps asking until the rate is
greater than 0, because at 0 per cent or less the amount would never grow,
and the loop over the years would run endlessly. It then prints the amount at
the end of every year until the goal is reached, and finally after how many
years that was the case.

## What it should look like

```text
Starting amount in euros? 1000
Interest rate in per cent? 0
The interest rate must be greater than 0, otherwise the amount never grows.
Interest rate in per cent? 4
Savings goal in euros? 1500
Year 1: 1040.00 euros
Year 2: 1081.60 euros
Year 3: 1124.86 euros
Year 4: 1169.86 euros
Year 5: 1216.65 euros
Year 6: 1265.32 euros
Year 7: 1315.93 euros
Year 8: 1368.57 euros
Year 9: 1423.31 euros
Year 10: 1480.24 euros
Year 11: 1539.45 euros
After 11 years the goal of 1500.00 euros is reached.
```

## Your program

```python
def main():
    amount = float(input("Starting amount in euros? "))
    rate = ask_rate()
    goal = float(input("Savings goal in euros? "))
    years = 0

    # Credit the interest year by year until the goal is reached,
    # and print the amount at the end of each year on the way.

    print(f"After {years} years the goal of {goal:.2f} euros is reached.")


def ask_rate():
    # Keep asking until the interest rate is greater than 0.
    rate = float(input("Interest rate in per cent? "))
    return rate


main()
```

> [!HINT]
> In `ask_rate` the question belongs in a `while True` loop. Right below it,
> an `if` checks whether the interest rate is greater than 0 and in that case
> leaves the loop with `break`; otherwise the program prints the note, and
> the loop asks again from the start. After the loop, `return` gives back the
> interest rate.

> [!HINT]
> A `while` loop with the condition `amount < goal` counts the years. In the
> body the interest is added, `amount += amount * rate / 100`, then `years`
> goes up by one, and the output shows year and amount with `:.2f`.

> [!SOLUTION]
> ```python
> def main():
>     amount = float(input("Starting amount in euros? "))
>     rate = ask_rate()
>     goal = float(input("Savings goal in euros? "))
>     years = 0
>
>     while amount < goal:
>         amount += amount * rate / 100
>         years += 1
>         print(f"Year {years}: {amount:.2f} euros")
>
>     print(f"After {years} years the goal of {goal:.2f} euros is reached.")
>
>
> def ask_rate():
>     while True:
>         rate = float(input("Interest rate in per cent? "))
>         if rate > 0:
>             break
>         print("The interest rate must be greater than 0, otherwise the amount never grows.")
>     return rate
>
>
> main()
> ```
>
> The program has two loops, and the first makes sure that the second comes
> to an end: only with an interest rate above 0 does `amount` grow in every
> round and eventually reach the goal. Nobody knows beforehand how many years
> that takes, so the second is a `while` loop in which `years` counts along.

## For the quick ones

Extend the program with a fixed deposit at the end of every year, which it
asks for at the start, say 100 euros. Then think about whether the interest
rate still has to be greater than 0 with a deposit, and in which case an
endless loop still threatens.
