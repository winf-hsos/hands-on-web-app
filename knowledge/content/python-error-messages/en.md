---
title: Reading error messages
summary: >-
  An error message tells you which error happened on which line, if you read
  it from the bottom up. You get to know the most common errors and also find
  those where Python reports nothing at all.
objectives:
  intro: "This lesson shows you how to read error messages and look for errors systematically, and afterwards you can:"
  goals:
    - "read an error message from the bottom up and find the kind, the reason and the line of the error in it"
    - "trigger `SyntaxError`, `IndentationError`, `NameError`, `TypeError`, `ValueError`, `IndexError` and `ZeroDivisionError` and name their typical cause"
    - "explain why a program with a `SyntaxError` does not start at all, while the other errors only occur on their line"
    - "narrow down an error without a message by printing intermediate values and checking where the result first differs from what you expect"
translation_of: de
based_on: 2026-11-01
---

In [[python-first-program|your first program]] you already saw two error
messages: a `SyntaxError` because a quotation mark was missing, and a
`NameError` because `Print` was written with a capital P. Since then your
programs have grown longer, with functions, lists, decisions and loops, and
accordingly more can go wrong. This lesson shows you how an error message is
built, which errors are the most common and how to find an error when Python
reports nothing at all and only the result is wrong.

## Reading an error message from the bottom up

This program adds tax to a price and contains a typo. Run it:

```python
def add_tax(price):
    tax = price * 0.19
    return price + tax


def main():
    total = add_tax(100)
    print(f"With tax: {totl} euros")


main()
```

Python stops and prints this message:

```text
Traceback (most recent call last):
  File "program.py", line 11, in <module>
    main()
    ~~~~^^
  File "program.py", line 8, in main
    print(f"With tax: {totl} euros")
                       ^^^^
NameError: name 'totl' is not defined. Did you mean: 'total'?
```

Such a message is called a **traceback**, because it traces back the way
Python took up to the error. You learn the most from it if you read it from
the bottom up:

1. The **last line** names the kind of error, here `NameError`, and after
   the colon the reason: Python does not know the name `totl`. Often Python
   adds a suggestion, here `Did you mean: 'total'?`.
2. Above it you see **where** it happened: on line 8, inside the function
   `main`, and below that the line itself. The characters `^^^^` point to
   the place where Python got stuck.
3. At the very top you see **where the call came from**: from line 11, where
   `main()` is called. `<module>` stands for the program itself, outside any
   function.

For short programs the last line and the program line above it are usually
enough. The steps further up become important when a function is called from
several places, because then they tell you which call caused the error.

## Errors that stop the program from starting at all

Before Python runs the first line, it reads the whole text and checks whether
it follows the rules of the language. If it finds a violation, it reports a
**SyntaxError** and runs not a single line, not even those before the error:

```python
print("Calculating the area")


def area(width, height)
    return width * height


print(area(3, 4))
```

The message is `SyntaxError: expected ':'`, and the `^` sits right after the
bracket where the colon is missing. Note that `Calculating the area` does not
appear either, although that line itself is fine. A missing quotation mark as
in your first program also gives a `SyntaxError`, there with the reason
`unterminated string literal`, a text that never ends.

A special case is the **IndentationError**, an error in the indentation.
After a colon Python expects an indented block, and here it is missing:

```python
def greet(name):
print(f"Hello {name}!")


greet("Ada")
```

Python reports `IndentationError: expected an indented block after function
definition on line 1`. The opposite case, a line that is indented for no
reason, it reports as `IndentationError: unexpected indent`.

## Errors that only occur while running

Python notices all other errors only when it reaches the line in question.
Everything before it runs as usual, and only then does the program stop.

A **NameError** means that Python does not know a name. Besides typos such as
`totl`, a common cause is a variable that only exists inside a function, as
you saw in [[python-functions]]:

```python
def average(numbers):
    result = sum(numbers) / len(numbers)
    return result


average([12.5, 14.0, 9.5])
print(f"Average: {result}")
```

`result` only exists in `average`. The function does return the value with
`return`, but the call on line 6 does not keep it anywhere. Correct would be
`result = average([12.5, 14.0, 9.5])`; then there is a variable `result`
outside the function as well.

A **TypeError** occurs when a value has the wrong type for an operation, most
often when text and a number are joined with `+`:

```python
age = 19
print("You are " + age + " years old.")
```

`TypeError: can only concatenate str (not "int") to str` means that only a
string can be attached to a string, not a whole number. An f-string such as
`f"You are {age} years old."` or `str(age)` solves the problem, as in
[[python-working-with-text]].

A **ValueError** is related but subtler: the type is right, only the value
does not fit. `int` happily accepts a string, but not every string:

```python
number = int("twelve")
print(number)
```

The message `invalid literal for int() with base 10: 'twelve'` says that this
text cannot be read as a whole number in the decimal system. This is exactly
what happens when someone types a word or `12.5` at `int(input(...))`.

An **IndexError** reports access to a position that does not exist in a list:

```python
shopping = ["milk", "bread", "apples"]
print(shopping[3])
```

The list has the positions 0, 1 and 2, and `list index out of range` means
that 3 lies outside them (more on this in [[python-lists]]).

Finally, a **ZeroDivisionError** occurs when dividing by zero. Hardly anyone
writes `10 / 0`, but it happens easily when a list is empty:

```python
temperatures = []
print(sum(temperatures) / len(temperatures))
```

`len(temperatures)` is 0, and Python reports `division by zero`.

## The most common errors at a glance

| Error | Typical cause |
|---|---|
| `SyntaxError` | a colon, bracket or quotation mark is missing |
| `IndentationError` | a block after a colon is not indented, or a line is indented too far |
| `NameError` | a name is misspelt, upper and lower case are mixed up, or the variable only exists inside a function |
| `TypeError` | text and a number joined with `+`, or a value of the wrong type passed to a function |
| `ValueError` | text that is not a number passed to `int()` or `float()` |
| `IndexError` | a position outside the list, often one too far because counting starts at 0 |
| `ZeroDivisionError` | divided by zero, often by `len()` of an empty list |

## When the result is simply wrong

The nastiest errors do not announce themselves. The program runs to the end,
but it calculates something other than what you meant. This function is meant
to convert a temperature from Fahrenheit to Celsius, and 212 degrees
Fahrenheit, the boiling point of water, should give 100 degrees Celsius:

```python
def to_celsius(fahrenheit):
    return fahrenheit - 32 * 5 / 9


print(to_celsius(212))
```

The result is `194.22222222222223`. What helps here is the same approach as
with a cake that did not rise, which you know from the
[[programming-principles|basic ideas]]: do not rewrite everything, but check
step by step where the result first differs from what you expected. To do so,
you print the **intermediate values** with `print`:

```python
fahrenheit = 212
print("fahrenheit - 32 gives", fahrenheit - 32)
print("32 * 5 / 9 gives", 32 * 5 / 9)
print("all together gives", fahrenheit - 32 * 5 / 9)
```

The first intermediate value is right, `180` is the correct distance from the
freezing point. The second, however, shows that Python first calculated
`32 * 5 / 9` and then subtracted the result from 212, because multiplication
and division come before addition and subtraction ([[python-arithmetic]]).
With brackets, `(fahrenheit - 32) * 5 / 9`, the function calculates
correctly. Once the error is found, you remove the extra `print` lines again.

A second technique sounds odd but helps surprisingly often: explain your
program line by line out loud, to someone else or, if need be, to a rubber
duck on your desk. Programmers call this **rubber duck debugging**. When you
have to put every line into words, you often notice yourself at which point
the code says something other than what you meant.

> [!TIP]
> Change only one thing at a time and run the program again afterwards. If
> you change several places at once, you will not know afterwards which change
> helped, and sometimes you introduce a new error along the way.

## Takeaways

- You read an error message from the bottom up: the last line names the kind
  and the reason, above it are the line and the function, and at the top the
  first call.
- A `SyntaxError` or `IndentationError` prevents even a single line from
  running; all other errors only occur on their line.
- `NameError` means an unknown name, `TypeError` a wrong type, `ValueError`
  a wrong value of the right type.
- `IndexError` and `ZeroDivisionError` often come from a list that is shorter
  or emptier than expected.
- You find errors without a message by printing intermediate values and
  checking where the result first differs from what you expect.
