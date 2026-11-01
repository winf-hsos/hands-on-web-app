---
title: "Exercise: Cinema box office"
summary: >-
  A function works out the price of a cinema ticket from age and student
  status, and a small main program asks for both and names the price.
objectives:
  intro: "In this exercise you write the price rules of a cinema box office as a function, and afterwards you can:"
  goals:
    - "put several price rules with `if`, `elif` and `else` in the right order, so that the first matching one wins"
    - "return a price with `return` on every way through a function"
    - "turn a yes-or-no answer into a truth value with `strip()`, `lower()` and `==`, however it was typed"
    - "pass a truth value as a parameter and use it in a condition without `== True`"
    - "test the function on its own with edge cases, such as 5, 6, 17 and 18 years"
translation_of: de
based_on: 2026-11-01
---

## Task

At the cinema box office these prices apply: children under 6 see the film
for free, anyone under 18 pays 6.00 euros, students pay 7.50 euros, and
everyone else 10.00 euros. Write a function `ticket_price(age, student)` that
gets the age as a number and, with `student`, a truth value, and returns the
matching price. A main program `main` asks for the age and then whether the
person is a student, and prints the price with two decimal places. For the
second question, `yes` should count in any spelling, so also `Yes` or `YES`,
and any other answer as no.

## What it should look like

```text
How old are you? 21
Are you a student? (yes/no) Yes
Your ticket costs 7.50 euros.
```

## Your program

```python
def main():
    age = int(input("How old are you? "))
    answer = input("Are you a student? (yes/no) ")
    # Turn the answer into a truth value, also for "Yes" or "YES".
    student = False
    price = ticket_price(age, student)
    print(f"Your ticket costs {price:.2f} euros.")


def ticket_price(age, student):
    # Check the rules in order and return the price.
    return 0.0


main()
```

Because `ticket_price` returns its result, you can also test it without any
input. To do so, temporarily replace the last line with
`print(ticket_price(16, True))` and think beforehand about which price has to
come out.

> [!HINT]
> Anyone under 6 is also under 18, and anyone who is already a student at 16
> is still under 18. Because Python takes the first true condition with `if`
> and `elif`, the narrowest rule belongs at the top: first under 6, then
> under 18, then students, and `else` is left for everyone else.

> [!HINT]
> `answer.strip().lower() == "yes"` already is the truth value you need for
> `student`; no `if` is needed for it. Test the function at the edges: at 5
> the film is free, at 6 it costs 6.00 euros, at 17 too, and only at 18 does
> it cost 7.50 or 10.00 euros.

> [!SOLUTION]
> ```python
> def main():
>     age = int(input("How old are you? "))
>     answer = input("Are you a student? (yes/no) ")
>     student = answer.strip().lower() == "yes"
>     price = ticket_price(age, student)
>     print(f"Your ticket costs {price:.2f} euros.")
>
>
> def ticket_price(age, student):
>     if age < 6:
>         return 0.0
>     elif age < 18:
>         return 6.0
>     elif student:
>         return 7.5
>     else:
>         return 10.0
>
>
> main()
> ```
>
> The rules are ordered from the narrowest to the widest, because after the
> first true condition `return` ends the function. At 21 the first two
> conditions are false, and because `student` already is a truth value,
> `elif student:` without `== True` is enough after that.

## For the quick ones

Tuesday is cinema day: then every ticket that is not free anyway costs 2
euros less. Give `ticket_price` a third parameter `cinema_day` and let `main`
also ask whether today is Tuesday. Students then pay 5.50 euros, and a child
under 6 stays at 0.00 euros.
