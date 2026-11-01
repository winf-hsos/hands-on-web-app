---
title: "Exercise: Bug hunt"
summary: >-
  A small checkout program contains four bugs, three with an error message
  and one that only gives a wrong total. You find and fix them one after
  another.
objectives:
  intro: "In this exercise you find and fix the bugs in a finished program, and afterwards you can:"
  goals:
    - "read the kind and the reason of an error from the last line of the message and find the line it names in the program"
    - "recognise a `SyntaxError`, a `NameError` and a `TypeError` by their message and fix them"
    - "find an error without a message by printing intermediate values inside a loop"
    - "fix one bug after another and check after each change whether the output matches the sample"
translation_of: de
based_on: 2026-11-01
---

## Task

A till is meant to list the prices of the scanned items, print how many there
are and their total, ask for a discount in percent and state the amount after
the discount. The program for this is already written, but it contains four
bugs: three of them lead to an error message, and one only causes a wrong
total at the end.

Run the program, read the error message and fix the bug it reports. Then run
it again, because behind each fixed bug the next one may come to light. When
no more messages appear, compare the output line by line with the sample
below and look for the last bug. When asked for the discount, enter `10`.

## What it should look like

```text
Receipt
  1.29 euros
  2.49 euros
  0.99 euros
  3.79 euros
Items: 4
Total: 8.56 euros
Discount in percent? 10
With 10 % discount: 7.70 euros
```

## Your program

```python
def with_discount(price, percent)
    return price - price * percent / 100


def main():
    # prices of the scanned items in euros
    prices = [1.29, 2.49, 0.99, 3.79]
    print("Receipt")
    total = 0
    for price in prices:
        print(f"  {price:.2f} euros")
        total = price
    print("Items: " + len(prices))
    print(f"Total: {total:.2f} euros")
    percent = int(input("Discount in percent? "))
    final = with_discount(totl, percent)
    print(f"With {percent} % discount: {final:.2f} euros")


main()
```

> [!HINT]
> Read every message from the bottom up, as in [[python-error-messages]]. The
> last line names the kind and the reason of the error, and above it is the
> number of the line where Python got stuck. With the first bug not a single
> line of output appears, and that alone tells you which kind of error it must
> be.

> [!HINT]
> If the program runs through but prints `Total: 3.79 euros`, look at what
> happens to `total` in the loop. To do so, put a
> `print("total is now", total)` into the loop below the line with `total` and
> compare the values with what you would work out in your head.

> [!SOLUTION]
> ```python
> def with_discount(price, percent):
>     return price - price * percent / 100
>
>
> def main():
>     # prices of the scanned items in euros
>     prices = [1.29, 2.49, 0.99, 3.79]
>     print("Receipt")
>     total = 0
>     for price in prices:
>         print(f"  {price:.2f} euros")
>         total = total + price
>     print(f"Items: {len(prices)}")
>     print(f"Total: {total:.2f} euros")
>     percent = int(input("Discount in percent? "))
>     final = with_discount(total, percent)
>     print(f"With {percent} % discount: {final:.2f} euros")
>
>
> main()
> ```
>
> The four bugs show up in this order: after
> `def with_discount(price, percent)` the colon is missing (`SyntaxError`),
> `"Items: " + len(prices)` joins a text with a number (`TypeError`, fixed
> with an f-string or `str(len(prices))`), and `totl` is a typo for `total`
> (`NameError`). The fourth bug does not announce itself: `total = price`
> replaces the total with the current price on every pass, so that only the
> last one is left at the end, and only `total = total + price` adds the
> prices up.

## For the quick ones

Make the till also print how many euros the discount saves, and use `if` to
check whether the discount entered lies between 0 and 100. If it lies outside,
the program should print `Invalid discount` and carry on without a discount.
