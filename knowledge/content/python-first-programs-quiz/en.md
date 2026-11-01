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
based_on: 2026-11-01
---

## What does `print("3" + "4")` print?

- [ ] `7`
- [x] `34`
- [ ] An error message, because text cannot be added

> Both values are in quotation marks and are therefore text. With text, `+`
> joins the two together; nothing is calculated.

## Someone types the number `19` at `age = input("Age? ")`. What type does `age` have?

- [ ] `int`
- [ ] `float`
- [x] `str`

> `input` always returns a string, even if only digits were typed. To
> calculate with it, you convert it with `int(...)`.

## What do `17 // 5` and `17 % 5` return?

- [ ] `3.4` and `0`
- [x] `3` and `2`
- [ ] `3` and `0.4`
- [ ] `2` and `3`

> 17 divided by 5 is 3 with remainder 2. `//` returns the whole-number part,
> `%` the remainder.

## Which of these can be the name of a variable in Python? (several are right)

- [x] `total_price`
- [ ] `2nd_place`
- [ ] `my-name`
- [x] `seconds_per_day`
- [ ] `class`

> Names consist of letters, digits and underscores and do not start with a
> digit. A hyphen would be a minus sign, and `class` is a reserved word in
> Python.

## What does `print(colors[1])` print if `colors = ["red", "green", "blue"]`?

- [ ] `red`
- [x] `green`
- [ ] `blue`

> The index starts at 0: `colors[0]` is `"red"`, `colors[1]` is `"green"`.
> You reach the last element with `colors[-1]`.

## What does this program print?

```python static
numbers = [3, 8, 1]
numbers.append(5)
print(len(numbers), max(numbers), sorted(numbers)[0])
```

- [ ] `3 8 3`
- [x] `4 8 1`
- [ ] `4 5 1`
- [ ] `4 8 3`

> `append` adds the 5 at the end, so the list then has four elements. The
> largest is still the 8, and `sorted(numbers)[0]` is the smallest element,
> the 1. The list `numbers` itself stays unsorted.

## What value does `result` have at the end?

```python static
def double(number):
    print(number * 2)


result = double(4)
```

- [ ] `8`
- [ ] `"8"`
- [x] `None`

> `double` only prints the 8 but returns nothing, because a `return` is
> missing. A function without `return` returns `None`.

## A program stops with `NameError: name 'totl' is not defined`. What most likely happened?

- [ ] Python is too old for this program.
- [x] A name is misspelt, or the variable has no value yet at this point.
- [ ] A number was divided by zero.

> A `NameError` means that Python does not know a name. Usually it is a typo
> like here, where `total` was probably meant, or the variable only gets a
> value further down.
