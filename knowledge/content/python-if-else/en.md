---
title: Decisions with if, elif and else
summary: >-
  With if a program runs a block only when a condition is true, with else it
  takes another way otherwise, and with elif it chooses from several ways the
  first whose condition holds.
objectives:
  intro: "In this lesson you learn how a program makes decisions, and afterwards you can:"
  goals:
    - "run code only when a condition is true, using `if`, a colon and an indented block, and give a second way with `else`"
    - "choose from several ways with `elif` and explain why the order of the conditions matters"
    - "combine nested checks into one condition with `and` where that is possible"
    - "return different results from a function with several `return` statements, depending on the case"
    - "recognise and fix the typical mistakes: `=` instead of `==`, a missing colon and `answer == \"yes\" or \"y\"`"
translation_of: de
based_on: 2026-11-01
---

With [[python-conditions|comparisons]] your program can now ask questions
that Python answers with `True` or `False`. So far, though, it has only
printed the answer. In this lesson it reacts to it and, like the bouncer from
the [[programming-principles|basic ideas]], takes one way or the other
depending on the answer.

## if: only when the condition is true

```python
age = int(input("How old are you? "))

if age >= 18:
    print("Welcome!")

print("See you soon.")
```

The line with `if` consists of the word `if`, a condition and a colon.
Everything indented below it is run by Python only when the condition is
true; you already know this from [[python-functions|functions]], and here too
four spaces are usual. The last line is not indented and therefore no longer
belongs to it, so it runs in any case. Try it with 20 and with 15.

## else: the other way

With 15, the program above only says "See you soon.", and the guest does not
learn why they have to stay outside. With `else` you add the second way:

```python
age = int(input("How old are you? "))

if age >= 18:
    print("Welcome!")
else:
    print("Sorry, only from 18.")
```

`else` stands at the same level as the `if`, has no condition of its own and
also ends with a colon. Of the two blocks, Python always runs exactly one: the
one under `if` when the condition is true, otherwise the one under `else`.

## elif: more than two ways

A traffic light has three colours, and as in the basic ideas the program asks
about one after the other. For this there is `elif`, short for *else if*:

```python
light = "yellow"

if light == "red":
    print("Stop.")
elif light == "yellow":
    print("Slow down.")
else:
    print("Drive.")
```

Python checks the conditions from top to bottom and runs the block of the
**first** one that is true. It skips all the others, and only if none holds
does the block under `else` get its turn. Change `light` to `"red"` and to
`"green"` and see which block runs each time.

Because the first true condition wins, the order matters. Here a temperature
gets a word:

```python
temperature = 25

if temperature >= 30:
    print("hot")
elif temperature >= 20:
    print("warm")
elif temperature >= 10:
    print("mild")
else:
    print("cold")
```

At 25 degrees the first condition is false and the second true, and the
program prints "warm". That 25 is also at least 10 no longer plays a role,
because the decision was made with the first match. That is why the second
condition does not need to read `temperature >= 20 and temperature < 30`:
anything that gets that far is already below 30. Turn the order around, and
the program gets it wrong:

```python
temperature = 35

if temperature >= 10:
    print("mild")
elif temperature >= 20:
    print("warm")
elif temperature >= 30:
    print("hot")
else:
    print("cold")
```

35 is at least 10, so the first condition wins straight away, and the checks
for "warm" and "hot" never get a chance. With ranges you therefore start at
one end, with the highest or the lowest value, and work your way to the
other.

## Combining instead of nesting

An `if` block may contain another `if`. The bouncer who checks age and guest
list could be written like this:

```python
age = 20
on_list = True

if age >= 18:
    if on_list:
        print("Come in!")
```

Because the two questions only lead to entry together, a condition with `and`
is shorter and easier to read:

```python
age = 20
on_list = True

if age >= 18 and on_list:
    print("Come in!")
```

You may also notice that `if on_list:` has no `== True`. It is not needed,
because `on_list` already is a truth value. Nesting only pays off when each
question needs an answer of its own, such as "Sorry, only from 18." for the
younger ones and "You are not on the list." for the others.

## Decisions in functions

A decision often sits inside a function that returns a different result
depending on the case. Each way then gets its own `return`:

```python
def temperature_word(temperature):
    if temperature >= 30:
        return "hot"
    elif temperature >= 20:
        return "warm"
    elif temperature >= 10:
        return "mild"
    else:
        return "cold"


print(temperature_word(25))
print(temperature_word(3))
```

Since `return` ends the function at once, after a match Python never reaches
the lines below. That is why you often see the same decision written without
`elif` and `else`, with the last case at the very bottom:

```python
def describe_number(number):
    if number < 0:
        return "negative"
    if number == 0:
        return "zero"
    return "positive"


print(describe_number(-3))
print(describe_number(0))
print(describe_number(8))
```

Both ways of writing it are correct. What matters is that every way through
the function arrives at a `return`, otherwise it gives `None` in that case.

## Typical mistakes

The most common mistake is a single equals sign in the condition. `=` assigns
and asks nothing, so Python rejects the line and suggests `==` itself:

```python
answer = "yes"

if answer = "yes":
    print("Great.")
```

If the colon at the end of the `if` line is missing, Python reports
`SyntaxError: expected ':'` and points with an arrow to the place where it
belongs.

A mistake that gives no message at all is more treacherous. Anyone who wants
to accept "yes" or just "y" as agreement easily writes this:

```python
answer = "no"

if answer == "yes" or "y":
    print("You agreed.")
else:
    print("You declined.")
```

Although the answer is "no", the program agrees. Python reads the condition as
`(answer == "yes") or "y"`, and on the right there is no comparison, only the
text `"y"`. A text that is not empty counts as true in a condition, and so
the whole condition is always true. The right way is to write each side as a
comparison of its own, or to use `in` with a list straight away:

```python
answer = "no"

if answer == "yes" or answer == "y":
    print("You agreed.")
else:
    print("You declined.")

if answer in ["yes", "y"]:
    print("Here too: agreed.")
else:
    print("Here too: declined.")
```

## What is still missing

Your program can now take different ways depending on the input, but every
decision is made exactly once. If someone types something quite different at
a yes-or-no question, you want to ask again until a valid answer comes, and
with a list of temperatures you want to print a word for **each** of them.
For that, a part of the program has to run repeatedly, which is the job of
loops, starting in part 3 of this path with [[python-for-loops]].

## Takeaways

- `if condition:` runs the indented block below it only when the condition is
  true; `else:` gives the way for all other cases.
- With `elif` there can be as many ways as you like, and Python takes the
  first whose condition is true; the order matters.
- Two questions that only count together are combined with `and` instead of
  nesting two `if` statements.
- In a function each way can have its own `return`, and each way should
  arrive at one.
- The condition uses `==`, not `=`, the line ends with a colon, and
  `answer == "yes" or "y"` is always true.
