---
title: "Quiz: First programs"
summary: Six questions on values, variables, text, calculating and your own functions in Python.
objectives:
  intro: "This quiz uses six questions to check whether you can:"
  goals:
    - "predict what `+` does with two strings and which type the value from `input()` has"
    - "work out the results of `//` and `%`"
    - "tell valid variable names from invalid and reserved ones"
    - "recognise that a function without `return` gives `None`"
    - "trace a `NameError` back to its likely cause"
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
