---
title: Catching errors with try and except
summary: >-
  With try and except your program catches an error instead of stopping, for
  example when someone types a word where a number belongs. You write a
  function that keeps asking until a valid number comes.
objectives:
  intro: "This lesson shows you how to catch errors with `try` and `except`, and afterwards you can:"
  goals:
    - "convert an input with `try` and `except ValueError` so that an invalid input does not end the program"
    - "explain why you name the expected exception after `except` instead of catching every error"
    - "use `else` to keep the code that should only run on success out of the `try` block"
    - "write a function `get_int(prompt)` that uses `while True` to keep asking until a whole number is entered"
    - "reject an invalid value in a function of your own with `raise ValueError(...)`"
translation_of: de
based_on: 2026-11-01
---

In [[python-working-with-text]] the program stops with a `ValueError` as soon
as someone types something at `int(input(...))` that is not a whole number,
and it said there that you would learn later how to deal with that. Now the
time has come: you cannot prevent such an error, because what someone types is
not in your hands, but you can **catch** it. Python tries something, and if it
goes wrong, it carries out a plan B instead of stopping. An error that occurs
while a program runs is called an **exception** in Python, and `ValueError`,
`ZeroDivisionError` and the others from [[python-error-messages]] are such
exceptions.

## try and except

Try this program twice, once with `19` and once with `twelve`:

```python
try:
    age = int(input("How old are you? "))
    print(f"Next year you will be {age + 1}.")
except ValueError:
    print("That was not a whole number.")
```

Python runs the indented block under `try`. If it runs through without an
error, Python skips the `except` block. If, however, a line in the `try` block
raises a `ValueError`, Python leaves the block at that point, the remaining
lines in it are skipped, and it continues in the `except` block. The program
then ends normally, without an error message.

## Naming the expected exception

You can also write `except` without a name; then it catches every error. That
sounds convenient, but it hides exactly the errors you ought to see. This
program contains a typo, `aeg` instead of `age`. Enter `19`:

```python
try:
    age = int(input("How old are you? "))
    print(f"Next year you will be {aeg + 1}.")
except:
    print("That was not a whole number.")
```

The program claims that `19` is not a whole number, because the bare `except`
caught the `NameError` from the second line and gave it the wrong
explanation. Write `except ValueError:` and run it again: now the `NameError`
appears with its line number, and the typo is found in a second.

So always name the exception you expect after `except`. Then your program
handles the one case you foresaw, and everything else still announces itself
as clearly as before.

## else: what should only happen on success

The less there is in the `try` block, the more precisely you know where the
exception comes from. Code that should only run when everything worked
therefore goes into an `else` block:

```python
try:
    age = int(input("How old are you? "))
except ValueError:
    print("That was not a whole number.")
else:
    print(f"Next year you will be {age + 1}.")
```

The `else` block only runs if no exception occurred in the `try` block. The
`try` block now holds only the one line that can really fail because of the
input.

## Asking until the input fits

So far the program at least ends politely after a wrong input, but it does
end. It is better to ask again. With `while True` from
[[python-while-loops]] and `try` this becomes a function you can use in any
program that needs a whole number:

```python
def get_int(prompt):
    while True:
        try:
            return int(input(prompt))
        except ValueError:
            print("Please enter a whole number.")


def main():
    age = get_int("How old are you? ")
    print(f"Next year you will be {age + 1}.")


main()
```

Type `twelve` first, then `12.5` and then `12`. If the conversion succeeds,
`return` hands back the number and thereby ends not only the loop but the
whole function, so no `break` is needed. If it fails, the `except` block
prints a hint and the loop starts again. `main` no longer has to deal with
wrong inputs at all, because `get_int` is guaranteed to deliver a whole
number.

This also closes the gap that remained open in [[python-while-loops]]: the
program that asks for a positive number stopped at `twelve` before it could
even check whether the number is greater than 0. With `try` and `else` the
loop catches both cases:

```python
while True:
    try:
        number = int(input("Enter a positive number: "))
    except ValueError:
        print("That was not a whole number, please try again.")
    else:
        if number > 0:
            break
        print("The number must be greater than 0, please try again.")

print(f"Thank you, we go on with {number}.")
```

Type `twelve`, `-3` and `5` one after another. The check with `if` sits in
the `else` block because it only makes sense once the conversion has
succeeded.

## Other exceptions can be caught too

`except` works with any exception, for example with `ZeroDivisionError`. This
program splits a bill among several people:

```python
def get_int(prompt):
    while True:
        try:
            return int(input(prompt))
        except ValueError:
            print("Please enter a whole number.")


def main():
    total = get_int("How many euros does the pizza cost? ")
    people = get_int("How many people share the bill? ")
    try:
        share = total / people
    except ZeroDivisionError:
        print("Nothing can be split among zero people.")
    else:
        print(f"Each person pays {share:.2f} euros.")


main()
```

Enter `0` at the second question once. You could just as well check
beforehand with `if people == 0:`, as in [[python-if-else]]. If the problem
case can be described by a simple condition, a check in advance is often
easier to read. With `int(input(...))` that is not so simple, because only
`int()` itself knows which texts make a valid number, and there `try` is the
right way.

## When you should not catch

Catching is worthwhile for errors that come from outside and to which your
program can react sensibly: an input that is not a number, or a zero to be
divided by. An error in your own code, on the other hand, a misspelt name, a
text added to a number, a position that can never exist in the list, should
stay visible. If you catch it, the program carries on with a wrong result,
and later you look for the error in a completely different place. In this
case the error message is not a nuisance but the quickest help you can get.

## Raising an exception yourself

Your own functions can also report an exception when they are called with a
value they cannot work with. That is what `raise` is for:

```python
def split_bill(total, people):
    if people < 1:
        raise ValueError("There must be at least one person.")
    return total / people


print(split_bill(30, 3))
print(split_bill(30, 0))
```

The first call gives `10.0`, the second stops with a `ValueError` and your own
text as the reason. That way, whoever calls the function wrongly learns at
once what is not right, instead of getting a meaningless result later.
Whoever uses the function can then catch the `ValueError` with `try` and
`except` like any other.

## Takeaways

- `try` tries a block; if the named exception occurs in it, the program
  continues in the `except` block instead of stopping.
- Always name the expected exception after `except`, such as `ValueError`, so
  that errors in your own code stay visible.
- The `try` block holds only what can fail; what should follow on success goes
  into `else`.
- `while True` with `try` and `return` keeps asking until a valid input comes.
- With `raise ValueError("…")` a function of your own rejects an invalid
  value.
