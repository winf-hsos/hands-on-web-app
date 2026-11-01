---
title: "Exercise: Calculator"
summary: >-
  A calculator asks for two numbers and an operator, is not thrown by wrong
  inputs or a division by zero, and keeps calculating for as long as you
  like.
objectives:
  intro: "In this exercise you write a calculator that can deal with wrong inputs, and afterwards you can:"
  goals:
    - "write a function `get_number(prompt)` that uses `while True`, `try` and `except ValueError` to keep asking until a number comes"
    - "use `if`, `elif` and `else` to choose the right calculation for an operator and report an unknown one"
    - "catch a division by zero and explain when `except` and when a check in advance is the better choice"
    - "repeat a program with a `while` loop until someone wants to stop"
translation_of: de
based_on: 2026-11-01
---

## Task

Write a calculator. It asks for a number, an operator and a second number,
calculates and prints the calculation with its result. Then it asks
`Another calculation? (y/n)` and starts again as long as the answer is `y`.

For the numbers you write a function `get_number(prompt)` that keeps asking
until the input can be converted into a number with `float()`, like `get_int`
in [[python-exceptions]]. The calculator understands the operators `+`, `-`,
`*` and `/`; for any other character it prints a message, and likewise for a
division by zero. In no case should the program stop with an error message.

This exercise brings together everything from the four parts of the path:
input and functions of your own from the first, decisions from the second, a
loop from the third and caught errors from the fourth.

## What it should look like

```text
First number: 12
Operator (+ - * /): *
Second number: three
That is not a number, please try again.
Second number: 3
12.0 * 3.0 = 36.0
Another calculation? (y/n) y
First number: 7
Operator (+ - * /): /
Second number: 0
Cannot divide by zero.
Another calculation? (y/n) y
First number: 2
Operator (+ - * /): %
Second number: 5
I do not know the operator %.
Another calculation? (y/n) n
Goodbye!
```

You type decimal numbers with a point, such as `2.5`; anything `float()`
cannot read, such as `2,5`, raises a `ValueError`, and your calculator simply
asks again.

## Your program

```python
def get_number(prompt):
    # Keep asking until float() can convert the input
    return float(input(prompt))


def main():
    a = get_number("First number: ")
    operator = input("Operator (+ - * /): ").strip()
    b = get_number("Second number: ")
    # Calculate depending on the operator and print the calculation

    # Ask whether another calculation should follow


main()
```

> [!HINT]
> For `get_number` you need the same pattern as for `get_int`: a loop
> `while True`, in it `try` with `return float(input(prompt))` and below that
> `except ValueError` with a hint. For the repetition, put everything that
> belongs to one calculation in `main` into a second loop `while True` and
> leave it with `break` when the answer is not `y`.

> [!HINT]
> Check the operator with `if operator == "+":`, then the other three with
> `elif`, and catch everything else with `else`. In the branch for `/`, put
> the division into a `try` block with `except ZeroDivisionError`.

> [!SOLUTION]
> ```python
> def get_number(prompt):
>     while True:
>         try:
>             return float(input(prompt))
>         except ValueError:
>             print("That is not a number, please try again.")
>
>
> def main():
>     while True:
>         a = get_number("First number: ")
>         operator = input("Operator (+ - * /): ").strip()
>         b = get_number("Second number: ")
>
>         if operator == "+":
>             print(f"{a} + {b} = {a + b}")
>         elif operator == "-":
>             print(f"{a} - {b} = {a - b}")
>         elif operator == "*":
>             print(f"{a} * {b} = {a * b}")
>         elif operator == "/":
>             try:
>                 print(f"{a} / {b} = {a / b}")
>             except ZeroDivisionError:
>                 print("Cannot divide by zero.")
>         else:
>             print(f"I do not know the operator {operator}.")
>
>         again = input("Another calculation? (y/n) ").strip().lower()
>         if again != "y":
>             break
>     print("Goodbye!")
>
>
> main()
> ```
>
> `get_number` makes sure that `main` does not have to deal with wrong inputs,
> because only `float()` itself can decide which texts make a number, and so
> `except ValueError` is the right way there. For the division by zero, a
> check in advance with `if b == 0:` would be just as good, because the
> problem case can be described by a single condition. The solution catches
> the `ZeroDivisionError` because the exercise is meant to practise `except`,
> and you can try the check in advance as a second way. In both cases it
> matters that only the one line with the division is protected and not the
> whole calculator.

## For the quick ones

Teach your calculator `**` for powers, so that `2 ** 10` gives `1024.0`. Also
calculate `0.1 + 0.2` and look at the result: decimal numbers are not always
stored exactly in a computer. So first store the result in a variable
`result` and print it rounded to two decimal places with `round(result, 2)`.
