---
title: Values and variables
summary: >-
  Programs work with numbers and text. To find a value again later, they give
  it a name, and that is exactly what a variable is.
objectives:
  intro: "This lesson explains values and variables, and afterwards you can:"
  goals:
    - "tell the data types `int`, `float` and `str` apart and ask for the type of a value with `type()`"
    - "write decimal numbers with a point and explain why a number in quotation marks is text"
    - "create a variable with `=`, give it a new value and read a line like `count = count + 1`"
    - "choose variable names that follow Python's rules and say clearly what the variable holds"
    - "predict what `+` does with numbers and with text, and when Python reports a `TypeError`"
translation_of: de
based_on: 2026-11-01
---

Almost every program works with **values**: a temperature, a price, a name.
Python distinguishes different kinds of values, and the kind decides what you
can do with a value. So that a program can use a value again later, it stores
it under a name, and such a name is called a **variable**.

## Three kinds of values

For a start, three kinds are enough. Python calls them **data types**:

| Type | stands for | Examples |
|---|---|---|
| `int` | whole numbers (*integer*) | `42`, `-7`, `0` |
| `float` | decimal numbers (*floating point*) | `3.5`, `-0.25`, `100.0` |
| `str` | text (*string*) | `"Hello"`, `"42"`, `""` |

With the function `type` you ask Python which type a value has:

```python
print(type(42))
print(type(3.5))
print(type("42"))
```

Look at the last example: `"42"` is in quotation marks and is therefore a
piece of text that happens to consist of two digits, not a number.

> [!WARNING]
> Python writes decimal numbers with a **point**, never with a comma as many
> languages do. Try what `print(3,5)` prints: Python sees two numbers in it, 3
> and 5, and prints both with a space in between.

## Variables

You create a variable by assigning a value to a name with `=`:

```python
temperature = 21.5
city = "Osnabrück"
print("In", city, "it is", temperature, "degrees.")
```

In Python, `=` does not mean "is equal to" as in mathematics but "gets the
value": Python works out what is on the right and stores the result under the
name on the left. From then on, the name stands for this value wherever you
use it.

A variable can get a new value later. The old one is then gone, and from this
line on the new one applies:

```python
count = 1
print(count)
count = count + 1
print(count)
```

The line `count = count + 1` is nonsense in mathematics but clear to Python:
take the current value of `count`, add one and store the result under `count`
again.

## Good names

Names follow a few fixed rules: they consist of letters, digits and the
underscore `_`, do not start with a digit and contain no spaces. Case matters,
so `price` and `Price` are two different variables. Words like `if`, `for` or
`class` are reserved because they have a meaning in Python itself.

```python
2nd_place = "Ada"
```

This name starts with a digit, and that is why Python stops with a
`SyntaxError` before the program even runs.

Beyond the rules there are habits that almost everyone follows: names are
written in lower case, several words are joined with an underscore
(`total_price`), and a name says what the variable holds. `x` and `a` are quick
to type, but `seconds_per_day` still makes sense a month later.

> [!NOTE]
> The names in the examples are in English, as almost everywhere in
> programming, so that the code reads well together with Python's own English
> words such as `print` or `type`. What a program prints on the screen can of
> course be in any language.

## The type decides what happens

The plus sign shows well why the type matters. With numbers it adds, with text
it joins the pieces together:

```python
print(42 + 1)
print("42" + "1")
```

And if you mix both, Python does not know what you want and reports a
`TypeError`:

```python
print("42" + 1)
```

How to turn text into a number and back is part of the next lesson.

## Takeaways

- Values have a type: `int` for whole numbers, `float` for decimal numbers
  with a point, `str` for text in quotation marks.
- `name = value` stores a value under a name; a new value replaces the old
  one.
- Names are in lower case, join words with `_` and say what the variable
  holds.
- What an operator like `+` does depends on the type of the values.
