---
title: Your first program
summary: >-
  A program is a text of instructions that the computer carries out from top
  to bottom. You write your first one in Python, right here on the page, and
  learn to read error messages.
objectives:
  intro: "In this lesson you write your first Python program, and afterwards you can:"
  goals:
    - "explain that a program is a sequence of instructions that Python carries out from top to bottom"
    - "print text, numbers and empty lines with `print()`, including several values separated by commas"
    - "tell a string in quotation marks apart from a number without them"
    - "write comments with `#` that Python skips"
    - "read an error message from the bottom up and tell a `SyntaxError` from a `NameError`"
translation_of: de
based_on: 2026-11-01
---

A program is a text that contains instructions for the computer, and the
computer carries them out exactly as they are written: one after the other,
from top to bottom. For the computer to understand them, they have to be
written in a language with fixed rules, a **programming language**. Here you
learn **Python**, a language that reads well and is widely used in science,
data analysis and AI.

You do not need to install anything. Every box with code on this page is a
small editor: you can change the code and start it with **Run** (or
Ctrl+Enter), and whatever the program prints appears below it. The first time,
it takes a few seconds until Python has loaded.

## Hello, world

The first program in almost every language prints a greeting. In Python it is
a single line:

```python
print("Hello, world!")
```

`print` is a **function**, a ready-made piece of program that does one job,
here: writing something on the screen. What the function should print goes in
the round brackets after it. The quotation marks tell Python that
`Hello, world!` is text and not a command; such a piece of text is called a
**string**.

Change the text between the quotation marks and run the program again. With
**Reset** you can always go back to the original code.

## Line by line

A program may have as many lines as you like, and Python carries them out in
the order in which they appear:

```python
print("First line")
print("Second line")
print()
print("After an empty line")
```

A `print()` with nothing in the brackets prints an empty line. You can also
give `print` several values separated by commas; it then puts a space between
each of them:

```python
print("A day has", 24, "hours.")
```

The `24` has no quotation marks here because it is a number and not text. What
this difference is about is the subject of the next lesson.

## Comments

Python ignores everything on a line after a `#`. Such **comments** are notes
for the people who read the code, including yourself in a few weeks:

```python
# greeting for the first day
print("Welcome!")  # appears on the screen
```

## When something goes wrong

Python is strict: a single missing quotation mark is enough, and the program
does not start. Run this code and see what happens:

```python
print("Hello, world!)
```

Instead of output you get an **error message**. It looks daunting at first but
says fairly precisely what is wrong: on which line Python got stuck
(`line 1`), at which point (the `^` underneath) and what kind of error it is.
A `SyntaxError` means that the text breaks the rules of the language, here
because the string never ends. Add the missing quotation mark and the program
runs.

A second error that often happens at the start:

```python
Print("Hello, world!")
```

Python distinguishes between upper and lower case. There is no function called
`Print`, and that is why Python reports a `NameError`: it does not know this
name.

> [!TIP]
> Read error messages from the bottom up. The last line names the kind of
> error and usually the reason, and above it you see where it happened.

Errors are part of programming, for professionals too. People who program
spend a good part of their time reading error messages and improving their
code accordingly. How to read every message line by line, and which errors
come up most often, is shown later in [[python-error-messages]].

## Takeaways

- A program is a sequence of instructions that Python carries out from top to
  bottom.
- `print(...)` prints what is in the brackets. Text goes in quotation marks,
  numbers do not.
- A `#` starts a comment, which Python skips.
- An error message names the line, the place and the kind of error; the last
  line tells you the most.
