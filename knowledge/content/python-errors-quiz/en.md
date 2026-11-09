---
title: "Quiz: Errors and exceptions"
summary: Eight questions on reading error messages, the most common errors and catching them with try and except.
objectives:
  intro: "This quiz uses eight questions to check whether you can:"
  goals:
    - "find the kind and the line of the error in an error message"
    - "predict which error a program causes and whether it prints anything before"
    - "tell a `TypeError` from a `ValueError` in an example"
    - "predict what a program with `try` and `except` prints for an input, and explain why an `except` without a name hides errors"
    - "decide which errors are worth catching and how to look for an error without a message"
translation_of: de
based_on: 2026-11-09
---

## On which line did the error happen, and what kind is it? {#hcs-032}

A program stops with this message:

```text
Traceback (most recent call last):
  File "program.py", line 9, in <module>
    main()
    ~~~~^^
  File "program.py", line 6, in main
    print(shopping[3])
          ~~~~~~~~^^^
IndexError: list index out of range
```

- [ ] On line 9, an `IndexError`
  > Line 9 only holds the call of `main()`; from there Python reached the place of the error, but the error itself lies further down.
- [x] On line 6, an `IndexError`
  > The program line directly above the last line of the message is line 6, and position 3 is missing there.
- [ ] On line 6, a `NameError`
  > The kind of error is in the last line, and it says `IndexError` there.
- [ ] On line 9, a `SyntaxError`
  > With a `SyntaxError` the program would not even start, but here it worked until line 6.

> The last line names the kind, `IndexError`, and the reason: position 3 does not exist in the list. The program line directly above it, line 6 in `main`, is where it happened; line 9 is only the call that led there.

## What appears when you run this program? {#hcs-033}

```python static
print("Start")
for number in [1, 2, 3]
    print(number)
print("End")
```

- [ ] `Start`, then an error message
  > With a `SyntaxError` not even the first line runs, although it is fine.
- [x] Only an error message, a `SyntaxError`
  > Python notices the missing colon before it runs any line.
- [ ] `Start`, `1`, `2`, `3` and `End`
  > The colon after `for number in [1, 2, 3]` is missing, and so the program does not run.
- [ ] `Start` and `End`, the loop is skipped
  > Python does not skip anything that is written wrongly but rejects the whole program.

> The colon is missing after `for number in [1, 2, 3]`. Python checks the whole text before it runs the first line, and so it reports `SyntaxError: expected ':'` without printing `Start` first.

## Which error does `print("Price: " + 4.5)` report? {#hcs-034}

- [x] `TypeError`
  > `+` only joins a string with a string, and `4.5` is a number, so the types do not fit.
- [ ] `ValueError`
  > A `ValueError` means that the type is right and only the value does not fit, but here even the type does not fit.
- [ ] `SyntaxError`
  > The line is written correctly; the error only shows up when it runs.
- [ ] `NameError`
  > The only name in the line is `print`, and Python knows it.

> `+` can only join a string with a string, and `4.5` is a number. Python reports `TypeError: can only concatenate str (not "float") to str`. An f-string such as `f"Price: {4.5}"` solves the problem.

## What does `int("12.5")` give? {#hcs-035}

- [ ] `12`
  > `int()` does not round a text down. For a decimal number that already is a number, `int(12.5)` does give `12`, but here there is a text.
- [ ] `12.5`
  > `int()` always returns a whole number and never a decimal.
- [x] A `ValueError`
  > `"12.5"` is a string and so the right type, but it does not represent a whole number.
- [ ] A `TypeError`
  > The type is right: `int()` accepts a string, only this value does not fit.

> `int()` can only convert texts that represent a whole number. `"12.5"` is a string, so the right type, but not a fitting value, and that is why Python reports `ValueError: invalid literal for int() with base 10: '12.5'`.

## What does this program print when you type `19`? {#hcs-036}

```python static
try:
    age = int(input("Age? "))
    print(f"Next year: {aeg + 1}")
except:
    print("Not a whole number.")
```

- [ ] `Next year: 20`
  > `aeg` is a typo for `age`, and the `NameError` prevents this output.
- [x] `Not a whole number.`
  > The `except` without a name catches the `NameError` and prints the message for a wrong input, although the input was right.
- [ ] An error message with `NameError`
  > The `NameError` does occur, but the `except` without a name catches it before it can appear as a message.
- [ ] An error message with `ValueError`
  > `int("19")` succeeds, so there is no `ValueError`, and it would be caught as well.

> `int("19")` succeeds, but the next line contains the typo `aeg`, and Python raises a `NameError`. Because no exception is named after `except`, it catches this error too and prints the wrong explanation. With `except ValueError:` the `NameError` would become visible.

## You type `ten`, `10.5` and `10` one after another. What appears? {#hcs-037}

```python static
def get_int(prompt):
    while True:
        try:
            return int(input(prompt))
        except ValueError:
            print("Please enter a whole number.")


number = get_int("Number? ")
print(number * 2)
```

- [ ] `Please enter a whole number.` once, then `20`
  > For `int()`, `10.5` is not a whole number either.
- [x] `Please enter a whole number.` twice, then `20`
  > `ten` and `10.5` both raise a `ValueError`, and at `10` `return` returns the number, which doubled makes `20`.
- [ ] `Please enter a whole number.` twice, then `21`
  > The program doubles the number, and `10 * 2` makes `20`.
- [ ] `Please enter a whole number.` once, then the program stops at `10.5` with a `ValueError`
  > The `ValueError` at `10.5` is caught just like the one at `ten`, and the loop asks again.

> `ten` and `10.5` both raise a `ValueError`, which is caught, and each time the loop asks again. At `10`, `return` hands back the number and ends the function, and `10 * 2` gives `20`.

## Which errors are worth catching? (Several answers may be correct.) {#hcs-038}

- [x] A `ValueError` because someone types a word at `int(input(...))`
  > A wrong input comes from outside, and the program can react sensibly by asking again.
- [ ] A `NameError` because a name in your own code is misspelt
  > That is an error in the program itself. If caught, it would go unnoticed instead of being reported with its line number.
- [x] A `ZeroDivisionError` because someone enters `0` as the number of people
  > The `0` also comes from outside, and the program can ask for a different number.
- [ ] A `TypeError` because your own code adds a text to a number
  > That too is an error in the program, which you should fix instead of hiding it.

> Catching is worthwhile for errors that come from outside, for example through an input, and to which the program can react sensibly. Errors in your own code should stay visible so that you find and fix them.

## A program runs without a message but prints a wrong result. What is most likely to help first? {#hcs-039}

- [ ] Putting the whole program into `try` and `except`
  > Where no exception occurs, there is nothing to catch.
- [ ] Writing the program again from scratch
  > Rewriting takes a lot of time, and as long as you do not know where the error lies, it may be in there again.
- [x] Printing intermediate values with `print` and checking where they first differ from what you expect
  > The first place where an intermediate value is wrong narrows the error down.
- [ ] Changing several places at once and hoping that one of them helps
  > If something changes afterwards, you do not know which change it was, and new errors easily creep in.

> As with a cake that did not rise, you check step by step where the result first differs from what you expected. The place where an intermediate value stops being right narrows the error down.
