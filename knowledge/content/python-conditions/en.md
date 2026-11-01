---
title: Comparisons and truth values
summary: >-
  Before a program can decide, it has to ask a question that can be answered
  with yes or no. In Python the answer is a value of its own, True or False,
  and comparisons, and, or and not produce it.
objectives:
  intro: "In this lesson you learn how Python asks yes-or-no questions, and afterwards you can:"
  goals:
    - "recognise the truth values `True` and `False` as values of type `bool`"
    - "compare numbers and texts with `==`, `!=`, `<`, `<=`, `>` and `>=` and tell `=` from `==`"
    - "compare texts regardless of upper and lower case by making them alike with `lower()` first"
    - "combine several conditions with `and`, `or` and `not` and check with `in` whether a value is in a list or a text is in another"
    - "write a function that returns a truth value with `return`, such as `is_even(number)`"
translation_of: de
based_on: 2026-11-01
---

In the [[programming-principles|basic ideas]] you met the bouncer who asks
every guest the same question: are you at least 18? Such a condition can
always be answered with yes or no, and only once the answer is known can a
program take one of two ways. Before the next lesson is about deciding, you
learn here how Python asks such questions. You have in fact already seen an
answer to one: with [[python-lists|lists]], `in` gave you `True` or `False`.

## True or false: the type bool

Besides numbers and texts, Python knows a third kind of simple value, the
**truth values**. There are exactly two of them, `True` for true and `False`
for false, and their type is called `bool`, after the mathematician George
Boole:

```python
print(True)
print(type(True))

door_open = False
print(door_open)
```

`True` and `False` are written without quotation marks and start with a
capital letter. `"True"` in quotation marks would be a text, and Python does
not know `true` in lower case. You can keep a truth value in a variable like
any other value.

## Comparing

Usually you do not write `True` and `False` yourself but let a
**comparison** work them out. The bouncer asks about the age:

```python
age = 17

print(age >= 18)
print(age < 18)
print(age == 17)
print(age != 17)
```

Every comparison is a yes-or-no question, and Python answers it with a truth
value. These are the six comparisons:

| Sign | Question | Example with `age = 17` |
|---|---|---|
| `==` | equal? | `age == 17` is `True` |
| `!=` | not equal? | `age != 17` is `False` |
| `<` | less? | `age < 18` is `True` |
| `<=` | less or equal? | `age <= 16` is `False` |
| `>` | greater? | `age > 12` is `True` |
| `>=` | greater or equal? | `age >= 18` is `False` |

The result of a comparison is a value like any other, so you can also give it
to a variable and use it later:

```python
age = 17
adult = age >= 18
print(adult)
```

## `=` is not `==`

You already know the single equals sign: `age = 17` **assigns**, it gives the
name `age` the value 17. The double equals sign **asks** whether two values
are equal and changes nothing:

```python
age = 17

print(age == 18)
print(age)
```

The question `age == 18` is answered with `False`, and `age` is still 17
afterwards. When you read code aloud, it helps to say `=` as "gets" and `==`
as "is equal to?".

Take care when comparing with input: `input()` always returns a text, and a
text is never equal to a number, even if it holds the same digits.

```python
print("18" == 18)
print(int("18") == 18)
```

## Comparing texts

Two texts are equal if they match character by character, and upper and lower
case count too. Type `yes` here, then `Yes` and then `  YES ` with spaces:

```python
answer = input("Do you have a ticket? ")

print(answer == "yes")
print(answer.strip().lower() == "yes")
```

For Python, `"Yes"` and `"yes"` are different texts. Anyone who wants to check
an answer therefore makes it alike first: `strip()` removes the spaces at the
edges and `lower()` makes all letters small, as you know from
[[python-working-with-text|working with text]]. After that a single comparison
with `"yes"` is enough, however someone typed the answer.

## and, or and not

A decision often depends on more than one question. The bouncer only lets in
those who are at least 18 **and** on the guest list. Entry to the swimming
pool is free for anyone younger than 6 **or** having a birthday. Python
combines such conditions with `and` and `or`:

```python
age = 20
on_list = True
print(age >= 18 and on_list)

age = 4
birthday = False
print(age < 6 or birthday)
```

`and` only gives `True` if both sides are true. `or` gives `True` as soon as
at least one side is true, so also when both are. And `not` turns a truth
value around:

```python
raining = False
print(not raining)
print(not raining and 15 > 10)
```

When `and` and `or` meet in one condition, Python works out the `and` first,
much as multiplication comes before addition. In such cases, put in round
brackets, and then it is clear to you and to Python what belongs together.

There is a short way of writing a range. Whether someone is a teenager, that
is at least 13 and younger than 20, you can ask with `and` or by chaining both
comparisons, as you know it from mathematics:

```python
age = 15
print(age >= 13 and age < 20)
print(13 <= age < 20)
```

## in: does it occur in it?

You know `in` from lists: it asks whether a value is in a list, and it also
gives a truth value. With `not in` you ask the opposite, and with texts `in`
checks whether one text occurs in another:

```python
guests = ["Ada", "Alan", "Grace"]

print("Ada" in guests)
print("Linus" in guests)
print("Linus" not in guests)
print("nan" in "banana")
```

## A function that answers yes or no

A function can return a truth value just as it returns a number or a text.
Whether a number is even you can find out with `%` from
[[python-arithmetic|calculating]]: then the remainder of dividing by 2 is
zero.

```python
def is_even(number):
    return number % 2 == 0


print(is_even(4))
print(is_even(7))
```

Python first works out `number % 2`, compares the result with 0 and returns
the truth value with `return`. Such functions are often called `is_…` or
`has_…`, because their call then reads like a question: `is_even(4)` means
"is 4 even?".

So far the program only prints the answers. How it reacts to an answer and
carries out something different depending on the result is what you learn in
the next lesson, [[python-if-else]].

## Takeaways

- `True` and `False` are the two truth values, and their type is called
  `bool`.
- The comparisons `==`, `!=`, `<`, `<=`, `>` and `>=` give a truth value;
  `=` assigns, `==` asks about equality.
- Texts have to match character by character, also in upper and lower case;
  `strip()` and `lower()` make an input alike first.
- `and` needs two true sides, `or` at least one, and `not` turns around; `in`
  asks whether something occurs in a list or a text.
- A function such as `is_even(number)` can return a truth value with
  `return`.
