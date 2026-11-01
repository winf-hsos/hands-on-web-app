---
title: "Quiz: Decisions"
summary: Eight questions on truth values, comparisons, and, or and not and on decisions with if, elif and else in Python.
objectives:
  intro: "This quiz uses eight questions to check whether you can:"
  goals:
    - "recognise the type `bool` and tell `=` from `==`"
    - "predict what a comparison of texts and a condition with `and`, `or` and `not` give"
    - "pick out from several conditions those that are true for a value"
    - "predict which block a chain of `if`, `elif` and `else` runs and what a function with several `return` statements gives"
    - "explain why `answer == \"yes\" or \"y\"` is always true"
translation_of: de
based_on: 2026-11-01
---

## What type does the value of `5 > 3` have?

- [ ] `int`
- [ ] `str`
- [x] `bool`

> A comparison answers a yes-or-no question, here with `True`. `True` and
> `False` are truth values, and their type is called `bool`.

## What is the difference between `x = 5` and `x == 5`?

- [x] `x = 5` gives `x` the value 5, `x == 5` asks whether `x` is equal to 5.
- [ ] `x = 5` asks whether `x` is equal to 5, `x == 5` gives `x` the value 5.
  > It is exactly the other way round: the single sign assigns, the double
  > one asks.
- [ ] There is none, both ways of writing mean the same.
  > In a condition such as `if x = 5:` Python reports a `SyntaxError` and
  > suggests `==`.

> `=` assigns and so changes `x`, `==` compares and gives `True` or `False`
> without changing anything.

## What does `print("Yes" == "yes")` print?

- [ ] `True`
- [x] `False`
- [ ] An error message, because texts cannot be compared

> Texts are only equal if they match character by character, also in upper
> and lower case. With `"Yes".lower() == "yes"` the comparison would give
> `True`.

## What does this program print?

```python static
age = 15
student = True
print(age >= 18 or student, not student)
```

- [x] `True False`
- [ ] `False False`
  > `age >= 18` is false, but `or` only needs one true side, and `student` is
  > true.
- [ ] `True True`
- [ ] `False True`

> `age >= 18` is false, `student` is true, and for `or` one true side is
> enough, so `True`. `not student` turns `True` around and gives `False`.

## Which conditions are true if `number = 12`? (several are right)

- [x] `number % 2 == 0`
- [ ] `number > 12`
  > 12 is not greater than 12; `number >= 12` would be true.
- [x] `10 < number and number < 20`
- [ ] `not number == 12`
  > `number == 12` is true, and `not` turns it into `False`.
- [x] `number in [4, 8, 12]`

> 12 can be divided by 2 without a remainder, lies between 10 and 20 and is in
> the list. 12 is not greater than itself, and `not` turns the true comparison
> `number == 12` into `False`.

## What does this program print?

```python static
temperature = 25

if temperature >= 10:
    print("mild")
elif temperature >= 20:
    print("warm")
else:
    print("cold")
```

- [x] `mild`
- [ ] `warm`
  > `warm` would only come out if the check `temperature >= 20` came first.
- [ ] `mild` and below it `warm`
  > Of a chain of `if`, `elif` and `else`, only one block ever runs.
- [ ] `cold`

> Python takes the first condition that is true, and 25 is at least 10. It no
> longer checks the other conditions after that, which is why with ranges the
> check with the highest value belongs at the top.

## What does this program print?

```python static
answer = "no"

if answer == "yes" or "y":
    print("Agreed.")
else:
    print("Declined.")
```

- [x] `Agreed.`
- [ ] `Declined.`
  > That would be the intention, but the condition is built differently from
  > how it reads.
- [ ] An error message

> Python reads the condition as `(answer == "yes") or "y"`. To the right of
> the `or` there is no comparison but the text `"y"`, and a text that is not
> empty counts as true. Correct would be `answer == "yes" or answer == "y"` or
> `answer in ["yes", "y"]`.

## What does this program print?

```python static
def size(number):
    if number > 10:
        return "large"
    if number > 5:
        return "medium"
    return "small"


print(size(8), size(20))
```

- [x] `medium large`
- [ ] `medium medium`
  > At 20 the first condition is already true, and `return` ends the function
  > before the second is checked.
- [ ] `small large`
  > Only a number for which neither condition is true reaches the last line of
  > the function.
- [ ] `large medium`

> 8 is not greater than 10 but greater than 5, so `size(8)` gives the text
> `"medium"`. At 20 the first condition is true, and `return` ends the
> function at once with `"large"`.
