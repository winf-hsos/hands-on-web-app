---
title: "Exercise: Pizza calculator"
summary: >-
  A group orders pizza: the program works out how many pizzas they need and
  what each person pays, tip included.
translation_of: de
based_on: 2026-10-26
---

## Task

You are ordering pizza as a group. Each person eats three slices, a pizza has
eight slices and costs 11.50 euros, and 10 percent tip goes on top of the
total. Write a program that asks for the number of people and then prints how
many pizzas you have to order, what everything costs together and how much
each person contributes.

Slices may be left over, but nobody should go short: seven people need 21
slices, and two pizzas are not enough for that, it has to be three.

## What it should look like

```text
How many people? 7
You need 3 pizzas.
Total with tip: 37.95 euros
Per person: 5.42 euros
```

## Your program

```python
SLICES_PER_PERSON = 3
SLICES_PER_PIZZA = 8
PRICE_PER_PIZZA = 11.50
TIP = 0.10

people = int(input("How many people? "))

# How many slices are needed, and how many pizzas is that?

# What does everything cost, and what does each person pay?
```

The names in capitals at the top are values that do not change in the
program; this is how **constants** are usually written in Python. If the
pizzeria raises its prices, you only change this one line.

> [!HINT]
> `slices // SLICES_PER_PIZZA` only counts full pizzas and therefore rounds
> down. Use `%` to check whether slices are left over that still need a
> started pizza, or calculate `(slices + SLICES_PER_PIZZA - 1) // SLICES_PER_PIZZA`,
> which always rounds up.

> [!HINT]
> 10 percent tip means the price is multiplied by `1 + TIP`. `:.2f` in the
> f-string takes care of printing two decimal places.

> [!SOLUTION]
> ```python
> SLICES_PER_PERSON = 3
> SLICES_PER_PIZZA = 8
> PRICE_PER_PIZZA = 11.50
> TIP = 0.10
>
> people = int(input("How many people? "))
>
> slices = people * SLICES_PER_PERSON
> pizzas = (slices + SLICES_PER_PIZZA - 1) // SLICES_PER_PIZZA
> total = pizzas * PRICE_PER_PIZZA * (1 + TIP)
> share = total / people
>
> print(f"You need {pizzas} pizzas.")
> print(f"Total with tip: {total:.2f} euros")
> print(f"Per person: {share:.2f} euros")
> ```
>
> The trick in the line with `pizzas`: adding seven slices before the floor
> division rounds up, because every started pizza pushes the result past the
> next whole number. With 21 slices that gives `28 // 8 = 3`, with exactly 24
> slices `31 // 8 = 3`.

## For the quick ones

Also ask how many slices each person should get, and print how many slices are
left over at the end.
