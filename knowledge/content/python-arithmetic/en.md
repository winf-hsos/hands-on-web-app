---
title: Calculating
summary: >-
  Python as a calculator and more: the operators, whole-number division with
  remainder, precedence and brackets, rounding, and a small surprise with
  decimal numbers.
objectives:
  intro: "This lesson shows you how to calculate in Python, and afterwards you can:"
  goals:
    - "calculate with the operators `+`, `-`, `*`, `/` and `**`, including shorthand such as `total += 5`, knowing that `/` always returns a `float`"
    - "split an amount into whole units and a remainder with `//` and `%`, and use `%` to check whether one number divides another"
    - "predict the order in which Python evaluates a calculation and set the order yourself with brackets"
    - "round a value with `round()` and round only the output to two places with `:.2f` in an f-string"
    - "explain why `0.1 + 0.2` does not come out as exactly `0.3`"
translation_of: de
based_on: 2026-11-01
---

Calculating is what computers do fastest, and in Python a calculation looks
almost the way it does on paper. A few operators only exist in programming,
though, and you will need two of them, `//` and `%`, all the time.

## The operators

```python
print(7 + 3)
print(7 - 3)
print(7 * 3)
print(7 / 3)
print(7 // 3)
print(7 % 3)
print(7 ** 3)
```

| Operator | means | `7 … 3` |
|---|---|---|
| `+` `-` `*` | plus, minus, times | `10`, `4`, `21` |
| `/` | divided by, result is always a `float` | `2.3333333333333335` |
| `//` | divided by without remainder (floor division) | `2` |
| `%` | remainder of that division (modulo) | `1` |
| `**` | to the power of | `343` |

`//` and `%` belong together: 7 divided by 3 is 2, remainder 1. With them you
split an amount into whole pieces and what is left over, for example minutes
into hours and minutes:

```python
minutes = 135
hours = minutes // 60
rest = minutes % 60
print(f"{minutes} minutes are {hours} hours and {rest} minutes.")
```

`%` also answers the question whether one number divides another: then the
remainder is zero. A number `n` is even, for example, when `n % 2` is zero.

## Precedence

The same precedence rules apply as in mathematics: `**` first, then `*`, `/`,
`//` and `%`, and `+` and `-` last. Round brackets let you decide yourself
what is calculated first.

```python
print(2 + 3 * 4)
print((2 + 3) * 4)
```

Brackets do no harm where they would not be needed. If you are not sure when
reading a calculation, put them in.

## Rounding

A division with `/` often gives more decimal places than anyone wants to read.
`round(value, places)` rounds to the number of places you want:

```python
price = 10 / 3
print(price)
print(round(price, 2))
print(f"{price:.2f} euros")
```

The last line shows a second way: in an f-string, `:.2f` after the name rounds
the number to two places only for the output, while the value in the variable
stays as it is. This is handy for amounts of money because it also writes
`5.10` with two places instead of `5.1`.

## A small surprise

```python
print(0.1 + 0.2)
```

The result is not exactly `0.3`. This is not a bug in Python: computers store
decimal numbers as bits, and many decimal fractions such as 0.1 can only be
approximated very closely that way, not represented exactly, just as 1/3 never
comes out even in the decimal system. For most calculations the tiny
difference does not matter; you should just know about it so that it does not
confuse you, and round results for output.

## Calculating with variables

Python of course calculates with variables too, and a calculation that changes
a variable can be shortened: `total += 5` means the same as
`total = total + 5`, and there are also `-=`, `*=` and `/=`.

```python
total = 0
total += 4.50
total += 2.20
total += 3.80
print(f"Total: {total:.2f} euros")
```

## Takeaways

- `+`, `-`, `*`, `/` and `**` calculate as usual; `/` always returns a
  `float`.
- `//` divides without remainder, `%` returns the remainder. Together they
  split an amount into whole units and what is left over.
- Brackets decide the order; otherwise multiplication comes before addition.
- `round(x, 2)` rounds the value, `f"{x:.2f}"` only the output.
- Decimal numbers are approximations in a computer; round them for output.
