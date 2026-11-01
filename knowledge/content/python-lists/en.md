---
title: Lists
summary: >-
  A list keeps many values under one name, in a fixed order. You reach single
  values by their position, add new ones, sort them and calculate with all of
  them at once.
objectives:
  intro: "In this lesson you get to know lists, and afterwards you can:"
  goals:
    - "create a list with square brackets and reach the first and the last element with `[0]` and `[-1]`"
    - "explain why positions start at 0 and when Python reports an `IndexError`"
    - "count and summarise the values of a list with `len()`, `sum()`, `min()` and `max()` and work out an average from them"
    - "change a list with `append()` and `remove()`, replace an element and check with `in` whether a value occurs in it"
    - "make a sorted version with `sorted()` and switch between text and list with `split()` and `join()`"
translation_of: de
based_on: 2026-11-01
---

So far every variable has held exactly one value. Often, though, there are
many values of the same kind: the temperatures of a week, all the shopping,
the names in a group. Creating a variable of its own for each would be
tedious, and the program would not know that they belong together. That is
what **lists** are for: they keep many values under one name, in a fixed
order, like the carriages of a train from the
[[programming-principles|basic ideas]].

## Creating a list

A list stands in square brackets, and the values in it are called
**elements** and are separated by commas:

```python
temperatures = [12.5, 14.0, 9.5, 16.0, 13.5]
shopping = ["milk", "bread", "apples"]
empty = []

print(temperatures)
print(shopping)
print(len(shopping))
```

You already know `len()` from text; with a list it counts the elements. A
list may also be empty, and it may hold elements of different types as well.
Mostly, though, a list holds values of the same kind, because you want to do
the same with them.

## Reaching an element

Every element has a position, its **index**, and Python starts counting at 0.
The first element therefore has the index 0, the second the index 1. With a
negative index you count from the back: `-1` is the last element.

```python
shopping = ["milk", "bread", "apples"]

print(shopping[0])
print(shopping[1])
print(shopping[-1])
```

If you ask for a position that does not exist, Python reports an error.
Change a line in the box above to `print(shopping[3])` and look at the
message: the list has three elements at the positions 0, 1 and 2, and
`IndexError: list index out of range` says that 3 lies beyond them.

You can also replace an element by assigning a new value to its position:

```python
shopping = ["milk", "bread", "apples"]
shopping[1] = "rolls"
print(shopping)
```

## Calculating with all values at once

For lists of numbers, Python comes with functions that sum up all the
elements:

```python
temperatures = [12.5, 14.0, 9.5, 16.0, 13.5]

print(sum(temperatures))
print(min(temperatures))
print(max(temperatures))

average = sum(temperatures) / len(temperatures)
print(f"On average {average:.1f} degrees")
```

There is no function of its own for the average, but it is quickly worked
out: the sum divided by the number of values.

## Changing a list

A list can grow and shrink. `append()` adds an element at the end, and
`remove()` takes out the first element with the given value:

```python
shopping = ["milk", "bread", "apples"]

shopping.append("cheese")
print(shopping)

shopping.remove("bread")
print(shopping)
```

`append` and `remove` are **methods** like `upper()` for text and are attached
to the name with a dot in the same way. Unlike the methods of text, however,
the methods of a list change the list itself: you do not write
`shopping = shopping.append("cheese")` but only `shopping.append("cheese")`.

Whether a value occurs in the list you ask with `in`. The answer is `True` or
`False`, a truth value with which you make decisions in part 2 of this path
([[python-conditions]]):

```python
shopping = ["milk", "bread", "apples"]

print("bread" in shopping)
print("butter" in shopping)
```

By the way, `remove()` with a value that is not in the list stops with a
`ValueError`.

## Sorting

`sorted()` returns a sorted version of the list, numbers by size and text in
alphabetical order. The original list stays as it was:

```python
temperatures = [12.5, 14.0, 9.5, 16.0, 13.5]

print(sorted(temperatures))
print(sorted(temperatures, reverse=True))
print(temperatures)
```

With `reverse=True`, `sorted()` sorts in descending order, with the largest
value first.

## From text to list and back

Several values often arrive as a single text, for instance from an input.
`split()` cuts a text at a separator into a list of texts, and `join()` puts a
list of texts back together into one text:

```python
line = "milk, bread, apples, cheese"
shopping = line.split(", ")
print(shopping)
print(len(shopping))

print(" and ".join(shopping))
```

Note that `join()` is attached to the separator and the list stands in the
brackets, not the other way round. Without anything in the brackets, `split()`
cuts at spaces.

## What is still missing

With a list you can now hold many values, pick out single ones and sum up
all of them. What you still lack is a way of doing something of its own with
**each** element, such as converting every temperature to Fahrenheit or
writing every item of shopping on a line of its own. That is the job of
loops, and they follow in part 3 of this path with [[python-for-loops]].

## Takeaways

- A list stands in square brackets and holds many values in a fixed order.
- The index starts at 0, `[-1]` is the last element, and a position outside
  the list gives an `IndexError`.
- `len()`, `sum()`, `min()` and `max()` sum up a list; the average is
  `sum(...) / len(...)`.
- `append()` and `remove()` change the list itself, `in` checks whether a
  value is in it, `sorted()` returns a sorted version.
- `split()` turns a text into a list, `join()` turns a list into a text.
