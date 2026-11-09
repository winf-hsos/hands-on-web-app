---
title: "Quiz: First programs"
summary: Eight questions on values, variables, text, calculating, lists and your own functions in Python.
objectives:
  intro: "This quiz uses eight questions to check whether you can:"
  goals:
    - "predict what `+` does with two strings and which type the value from `input()` has"
    - "work out the results of `//` and `%`"
    - "tell valid variable names from invalid and reserved ones"
    - "access elements of a list by their index and predict how `append()` changes it"
    - "recognise that a function without `return` gives `None`, and trace a `NameError` back to its likely cause"
translation_of: de
based_on: 2026-11-09
---

## What does `print("3" + "4")` print? {#hcs-008}

- [ ] `7`
  > Python only calculates with numbers, and in quotation marks `3` and `4` are text.
- [x] `34`
  > With text, `+` attaches the second to the first.
- [ ] An error message, because text cannot be added
  > Texts can be joined with `+`; there would only be an error with text plus number, such as `"3" + 4`.
- [ ] `"34"`
  > `print` outputs the content of the text; the quotation marks are not part of it.

> Both values are in quotation marks and are therefore text. With text, `+` joins the two together; nothing is calculated.

## Someone types the number `19` at `age = input("Age? ")`. What type does `age` have? {#hcs-009}

- [ ] `int`
  > Even if only digits are typed, `input` returns a text, which only becomes a number with `int(...)`.
- [ ] `float`
  > The input does not become a decimal number either, because `input` always returns a string.
- [x] `str`
  > `input` always returns a string, whatever is typed.
- [ ] `bool`
  > A truth value comes from something like a comparison, whereas `input` always returns a string.

> `input` always returns a string, even if only digits were typed. To calculate with it, you convert it with `int(...)`.

## What do `17 // 5` and `17 % 5` return? {#hcs-010}

- [ ] `3.4` and `0`
  > `3.4` would be the result of `17 / 5`, while `//` drops the remainder and `%` returns it.
- [x] `3` and `2`
  > 5 goes into 17 three times, and 2 are left over.
- [ ] `3` and `0.4`
  > `%` returns the remainder as a whole number, not the part after the decimal point.
- [ ] `2` and `3`
  > The order is swapped: `//` gives the 3, `%` the remainder 2.

> 17 divided by 5 is 3 with remainder 2. `//` returns the whole-number part, `%` the remainder.

## Which of these can be the name of a variable in Python? (Several answers may be correct.) {#hcs-011}

- [x] `total_price`
  > Letters and underscores are allowed, so this is a valid name.
- [ ] `2nd_place`
  > A name must not start with a digit.
- [ ] `my-name`
  > Python reads the hyphen as a minus and calculates `my` minus `name`.
- [x] `seconds_per_day`
  > The name consists only of letters and underscores, so it is valid and easy to read as well.
- [ ] `class`
  > `class` is a reserved word in Python and therefore cannot be a name.

> Names consist of letters, digits and underscores and do not start with a digit. A hyphen would be a minus sign, and `class` is a reserved word in Python.

## What does `print(colors[1])` print if `colors = ["red", "green", "blue"]`? {#hcs-012}

- [ ] `red`
  > `red` is at position 0, because counting starts at 0.
- [x] `green`
  > Index 1 is the second element, because counting starts at 0.
- [ ] `blue`
  > `blue` is at position 2, and as the last element you also reach it with `colors[-1]`.
- [ ] `["red", "green"]`
  > A single index returns exactly one element; you would get several with a slice such as `colors[0:2]`.

> The index starts at 0: `colors[0]` is `"red"`, `colors[1]` is `"green"`. You reach the last element with `colors[-1]`.

## What does this program print? {#hcs-013}

```python static
numbers = [3, 8, 1]
numbers.append(5)
print(len(numbers), max(numbers), sorted(numbers)[0])
```

- [ ] `3 8 3`
  > `append` changes the list, so it then has four elements, and `sorted(numbers)[0]` is the smallest element, not the first.
- [x] `4 8 1`
  > The list has four elements, the largest is 8, and when sorted the 1 comes first.
- [ ] `4 5 1`
  > `max` returns the largest value, not the one appended last.
- [ ] `4 8 3`
  > `sorted(numbers)[0]` takes the first element of the sorted list, and that is the 1, not the 3 from the start.

> `append` adds the 5 at the end, so the list then has four elements. The largest is still the 8, and `sorted(numbers)[0]` is the smallest element, the 1. The list `numbers` itself stays unsorted.

## What value does `result` have at the end? {#hcs-014}

```python static
def double(number):
    print(number * 2)


result = double(4)
```

- [ ] `8`
  > The 8 does appear on the screen, but `print` only outputs it and does not return it.
- [ ] `"8"`
  > Nothing comes back as text either, because without `return` the function returns `None`.
- [x] `None`
  > Without `return` every function returns `None`.
- [ ] `0`
  > Without `return` the function does not return 0 but `None`, that is, no value at all.

> `double` only prints the 8 but returns nothing, because a `return` is missing. A function without `return` returns `None`.

## A program stops with `NameError: name 'totl' is not defined`. What most likely happened? {#hcs-015}

- [ ] Python is too old for this program.
  > The message names `totl`, which Python does not know, and that has nothing to do with the version.
- [x] A name is misspelt, or the variable has no value yet at this point.
  > `totl` is probably a typo for `total`, or the variable only gets its value later.
- [ ] A number was divided by zero.
  > Python reports division by zero as a `ZeroDivisionError`.
- [ ] The variable `totl` was given a text instead of a number.
  > Python reports a wrong type as a `TypeError`, whereas the `NameError` means that `totl` does not exist at all.

> A `NameError` means that Python does not know a name. Usually it is a typo like here, where `total` was probably meant, or the variable only gets a value further down.
