---
title: Loops with for
summary: >-
  A for loop takes the elements of a list one after the other and runs the
  same lines for each of them. With it you convert every temperature, add up
  and count, build new lists and go through sequences of numbers and texts.
objectives:
  intro: "In this lesson you get to know the for loop, and afterwards you can:"
  goals:
    - "work through every element of a list in turn with `for` and tell from the indentation which lines belong to the loop"
    - "add up values with an accumulator variable that starts at 0 before the loop, and count with an `if` in the body how many elements meet a condition"
    - "build a new list from an existing one with `append()` in a loop"
    - "create sequences of numbers with `range()` and one, two or three arguments, and predict which number comes last"
    - "go through the characters of a text and print the elements of a list numbered with `enumerate()`, starting at 1"
translation_of: de
based_on: 2026-11-01
---

At the end of the lesson on [[python-lists|lists]] a question was left open:
how do you do something of its own with **each** element of a list, such as
converting every temperature to Fahrenheit or writing every item of shopping
on a line of its own? With what you know so far, you would need a line of
its own for each element, and as soon as the list got longer you would have
to change the program. A **loop** writes the step down only once and repeats
it for each element, just as you peeled every onion in the net in the
[[programming-principles|basic ideas]], one after the other, until the net
was empty.

## For each element of a list

The `for` loop reads almost like a sentence: for each item in the shopping
list, write it on a line of its own.

```python
shopping = ["milk", "bread", "apples", "cheese"]

for item in shopping:
    print(f"- {item}")
```

The line starts with `for`, followed by a name, the word `in`, the list and a
colon. Everything indented below it belongs to the loop and is called its
**body**; as with [[python-functions|your own functions]], the indentation
alone shows where it ends. Python runs the body once for each element, here
four times, and `item` stands for the next element of the list each time.

The body may also have several lines. Here it converts every temperature to
Fahrenheit, and the last line is not indented, so it no longer belongs to the
loop and runs only afterwards, a single time:

```python
temperatures = [12.5, 14.0, 9.5, 16.0, 13.5]

for celsius in temperatures:
    fahrenheit = celsius * 9 / 5 + 32
    print(f"{celsius} °C is {fahrenheit:.1f} °F")

print("All values converted.")
```

Indent the last line as a test and run the code again: the sentence then
appears after every temperature, because it now belongs to the body.

## The loop variable

The name between `for` and `in` is called the **loop variable**. It is a
perfectly ordinary variable that is assigned the next element before every
round, and you choose its name yourself. It is common to use the singular of
what the list holds in the plural, such as `for item in shopping`,
`for celsius in temperatures` or `for name in names`. Python would also be
happy with `for x in temperatures`, but anyone reading the program
understands `celsius` at once.

After the loop, the variable keeps the value from the last round:

```python
names = ["Ada", "Alan", "Grace"]

for name in names:
    print(f"Hello {name}!")

print(f"Last greeted: {name}")
```

## Adding up

`sum()` adds all the values of a list at once. You can write what happens
inside it yourself with a loop, and you need this pattern whenever there is
no ready-made function. Before the loop you create a variable that starts at
0, and in every round the current element is added to it:

```python
prices = [2.49, 1.19, 3.99, 0.89]
total = 0

for price in prices:
    total += price
    print(f"+ {price:.2f} makes {total:.2f}")

print(f"Total: {total:.2f} euros")
```

Such a variable is called an **accumulator**, because it collects the result
round by round. `total += price` is the short form of `total = total + price`
from the lesson on [[python-arithmetic|calculating]]. It matters that
`total = 0` stands **before** the loop: in the body, the variable would be
set back to 0 in every round, and at the end it would hold only the last
price.

## Counting with a condition

An accumulator can also count. Instead of adding the value, it goes up by one
for every element that fits, and an `if` in the body decides which element
fits, as you know it from [[python-if-else]]:

```python
temperatures = [12.5, 14.0, 9.5, 16.0, 13.5]
warm_days = 0

for celsius in temperatures:
    if celsius > 13:
        warm_days += 1

print(f"{warm_days} of {len(temperatures)} days were warmer than 13 degrees.")
```

Mind the two levels of indentation: the `if` belongs to the loop, and
`warm_days += 1` belongs to the `if` and therefore runs only in the rounds in
which the condition holds.

## Building a new list

Often a new list should come out of a list, such as a list of all
temperatures in Fahrenheit that the program can go on calculating with. The
accumulator then does not start at 0 but as an empty list, and `append()`
adds an element in every round:

```python
temperatures = [12.5, 14.0, 9.5, 16.0, 13.5]
fahrenheit = []

for celsius in temperatures:
    fahrenheit.append(round(celsius * 9 / 5 + 32, 1))

print(fahrenheit)
print(f"At most {max(fahrenheit)} °F")
```

The new list is a perfectly ordinary value that the program can go on
working with, here with `max()`, for instance. If the `append()` stands
inside an `if`, the loop takes over only some of the elements; try writing
only the values above 13 degrees into the new list.

## Sequences of numbers with range()

Sometimes there is no list at all, only a number of rounds, for example when
a program should print the seven times table. For this, `range()` creates a
sequence of whole numbers for the loop to go through:

```python
for number in range(1, 11):
    print(f"{number} × 7 = {number * 7}")
```

`range(1, 11)` starts at 1 and stops **before** 11, just as the index of a
list never reaches its length. This feels unusual at first, but it has an
advantage: how many numbers come out is simply the difference, here
11 − 1 = 10. With one, two or three arguments, `range()` gives these
sequences:

```python
print(list(range(5)))
print(list(range(2, 6)))
print(list(range(0, 20, 5)))
print(list(range(10, 0, -2)))
```

With one argument the sequence starts at 0 and ends before the number, so
that `range(5)` gives exactly five numbers. With two arguments you set start
and end, and a third is the step, which may also be negative in order to
count backwards. `list()` turns the sequence into a list so that `print()`
shows all the numbers at once; in a loop this is not needed.

## The characters of a text

To a loop, a text is a sequence of characters, and `for` takes them one
after the other:

```python
word = "Avocado"

for letter in word:
    print(letter)
```

Together with an accumulator and an `if`, the loop can count the vowels of a
word, for example. With text, `in` checks whether a character occurs in it,
and `lower()` makes sure that the capital A at the start counts as well:

```python
word = "Avocado"
vowels = 0

for letter in word.lower():
    if letter in "aeiou":
        vowels += 1

print(f"{word} has {vowels} vowels.")
```

## Numbered with enumerate()

For output such as "Day 1", "Day 2" you need the number of each element as
well. `enumerate()` gives both in every round, the number and the element,
and the loop takes them into two variables:

```python
temperatures = [12.5, 14.0, 9.5, 16.0, 13.5]

for day, celsius in enumerate(temperatures, start=1):
    print(f"Day {day}: {celsius} degrees")
```

Without `start=1`, counting begins at 0, like the index. The order of the two
variables is fixed: first the number, then the element.

## Takeaways

- `for element in list:` runs the indented body once for each element; the
  loop variable holds the current element and is best named after the
  singular of the list.
- An accumulator starts at 0 or as an empty list before the loop and
  collects the result in the body with `+=` or `append()`.
- An `if` in the body counts or takes over only the elements that meet a
  condition.
- `range(end)`, `range(start, end)` and `range(start, end, step)` create
  whole numbers, and the end is never part of them.
- A loop goes through a text character by character, and
  `enumerate(list, start=1)` gives each element its number.
