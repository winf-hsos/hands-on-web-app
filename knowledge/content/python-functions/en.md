---
title: Your own functions
summary: >-
  With def you give a piece of program a name and call it as often as you
  like. Parameters pass values in, return passes a result back, and a program
  made of small functions is easier to understand.
translation_of: de
based_on: 2026-10-26
---

## What this is about

`print`, `input`, `len` and `round` are functions that come with Python. But
you can also write your own. A function is a piece of program with a name: you
write it once and then call it wherever you need it. That saves repetition,
and it helps with thinking, because you can split a large task into small,
named steps.

## Defining and calling a function

```python
def greet():
    print("Hello!")
    print("Nice to have you here.")


greet()
greet()
```

The first line starts with `def` (for *define*), followed by the name, a pair
of round brackets and a colon. Everything **indented** below it belongs to the
function. Python requires this indentation, and four spaces are usual; in the
editor here the Tab key indents exactly that far, and after a colon Enter
indents by itself.

The difference between **defining** and **calling** is important: the `def`
block on its own does nothing visible, it only teaches Python what `greet`
means. Only `greet()` carries out its content, and it does so anew every time.

## Parameters: passing something in

Usually a function should work with values that are only known when it is
called. For this you write **parameters** in the brackets, names that get a
value when the function is called:

```python
def greet(name):
    print(f"Hello {name}, nice to have you here.")


greet("Ada")
greet("Alan")
```

In the first call, `name` stands for `"Ada"` inside the function, in the
second for `"Alan"`. You separate several parameters with commas, and in the
call the values come in the same order.

## return: passing a result back

Many functions should not print anything but calculate something and hand the
result back so that the program can keep working with it. That is what
`return` does:

```python
def area(width, height):
    return width * height


kitchen = area(3, 4.5)
bathroom = area(2, 2.5)
print(f"Together {kitchen + bathroom} square metres.")
```

As soon as Python reaches `return`, the function ends, and the call
`area(3, 4.5)` stands for the returned value in its place, here `13.5`.

A common stumbling block is the difference between `print` and `return`.
`print` shows a value on the screen, and then it is lost to the program.
`return` hands it back to the place from which the function was called. Try
what happens here:

```python
def double_print(number):
    print(number * 2)


def double_return(number):
    return number * 2


a = double_print(4)
b = double_return(4)
print("a is", a)
print("b is", b)
```

`double_print` does print `8`, but returns nothing, and in Python this nothing
is called `None`. Rule of thumb: a function that calculates something returns
the result with `return`, and printing happens where the program wants to show
the result.

## What stays inside the function

Variables created inside a function only exist there. They are created anew
with every call and disappear when the function ends:

```python
def add_tax(price):
    tax = price * 0.19
    return price + tax


print(add_tax(100))
print(tax)
```

The last line fails with a `NameError` because `tax` does not exist outside
`add_tax`. That is intentional: this way every function can use its own names
without getting in the way of the rest of the program. Whatever a function
wants to give to the outside, it returns with `return`.

## A program made of functions

With functions you can build a whole program so that it reads from top to
bottom like an outline. A common pattern is a function `main` that describes
the flow and calls the individual steps; the very end of the program then only
calls `main`.

```python
def main():
    name = ask_name()
    print(greeting(name))


def ask_name():
    return input("What is your name? ").strip().title()


def greeting(name):
    return f"Hello {name}, welcome to Python!"


main()
```

`main` may call `ask_name` and `greeting` even though both come further down,
because Python only runs `main` in the last line, and by then it has read all
the definitions. Each function has a single, clearly named job, and anyone who
wants to understand the program reads `main` first. It is the same idea as
splitting a problem into smaller problems: [[problem-decomposition]].

## Takeaways

- `def name(parameter):` defines a function; the indented block below it is
  its content, and only `name(value)` carries it out.
- Parameters get their values when the function is called, in the order of
  the brackets.
- `return` ends the function and hands a value back; without `return` it
  returns `None`.
- Variables inside a function only exist there.
- A function `main` describes the flow, small functions do the steps.
