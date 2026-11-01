---
title: Working with text
summary: >-
  Programs ask for input, put text together and tidy it up. That takes input,
  f-strings, a few useful methods and turning text into numbers.
objectives:
  intro: "This lesson shows you how to work with input and text, and afterwards you can:"
  goals:
    - "ask for input with `input()` and explain why the answer is always a string"
    - "join text with `+`, repeat it with `*` and put values straight into a text with f-strings"
    - "tidy up input with the methods `strip()`, `lower()`, `upper()`, `title()` and `replace()`, chaining them one after another"
    - "count the characters of a text with `len()`"
    - "convert text into numbers with `int()` and `float()` and back with `str()`, and recognise the `ValueError` that unsuitable input causes"
translation_of: de
based_on: 2026-11-01
---

So far your programs have always printed the same thing. It gets interesting
when a program asks a question and works with the answer. Python has the
function `input` for this, and because an answer always arrives as text, this
lesson also shows you how to put text together, tidy it up and turn it into
numbers.

## Asking for input

`input` prints a text, waits until someone types something and presses Enter,
and returns what was typed. Usually you store it in a variable straight away:

```python
name = input("What is your name? ")
print("Hello,", name)
```

When you run the program, an input field appears below the code. The space at
the end of `"What is your name? "` keeps your answer from sticking to the
question mark.

## Putting text together

You join two strings with `+`, and `*` repeats one:

```python
first = "Ada"
last = "Lovelace"
print(first + " " + last)
print("=" * 20)
```

As soon as several parts and variables come together, `+` quickly gets hard to
read. **f-strings** are more convenient: you put an `f` in front of the first
quotation mark and write variables in curly brackets right inside the text.

```python
name = input("What is your name? ")
city = input("Where do you live? ")
print(f"Hello {name}, greetings to {city}!")
```

The brackets may even contain a small calculation, such as
`f"{2 * 21} is the answer"`.

## Tidying up text

Strings come with functions of their own, called **methods**. You call them
with a dot directly on the text:

```python
answer = "   ada LOVELACE  "
print(answer.strip())
print(answer.strip().lower())
print(answer.strip().upper())
print(answer.strip().title())
print(answer.replace("ada", "Augusta Ada"))
```

`strip` removes spaces at the start and end, `lower` and `upper` make
everything lower or upper case, `title` capitalises every word, and `replace`
swaps one part of the text for another. None of these methods changes the
original string; each returns a new one, which is why they can be chained as
in the example. This is especially worth it with input, because people like to
type one space too many or everything in lower case.

The function `len` tells you how long a text is:

```python
word = "Informatics"
print(len(word))
```

## From text to number

`input` always returns a string, even when someone types a number. Python
cannot calculate with this text:

```python
age = input("How old are you? ")
print(age + 1)
```

The solution is to convert the text first. `int(...)` turns text into a whole
number, `float(...)` into a decimal number, and `str(...)` turns a number back
into text:

```python
age = int(input("How old are you? "))
print(f"Next year you will be {age + 1}.")
```

One function call sits inside the other here: Python first runs the inner
`input` and then passes its result on to `int`. If someone types something
that is not a whole number, such as `twelve` or `12.5`, the program stops with
a `ValueError`. How to deal with that without the program crashing comes in a
later part.

## Takeaways

- `input("Question ")` waits for input and always returns it as a string.
- f-strings like `f"Hello {name}"` put values right into a text.
- Methods such as `strip`, `lower`, `upper`, `title` and `replace` return a
  new, changed string; `len` counts the characters.
- `int(...)`, `float(...)` and `str(...)` convert between text and numbers.
