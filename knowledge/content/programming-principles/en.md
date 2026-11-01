---
title: The basic ideas of programming
summary: >-
  Before you write a line of Python: what a program is and which few building
  blocks come back in every programming language, explained with pictures
  from everyday life instead of code.
objectives:
  intro: "This lesson introduces the building blocks every program is made of, without any code, and afterwards you can:"
  goals:
    - "explain why a program is a sequence of precise instructions that the computer takes literally"
    - "tell input, processing and output apart in an everyday example"
    - "describe what a variable is and what happens when it gets a new value"
    - "recognise branches and loops in everyday examples and explain when a loop ends"
    - "explain what a function is for and what its parameters and its return value are"
translation_of: de
based_on: 2026-11-01
---

A computer calculates faster than any human and never gets tired doing it,
but it understands nothing on its own: it follows instructions, exactly the
ones that are written down. Programming therefore means describing a task so
precisely that someone who neither thinks along nor asks back can carry it
out. There is a handful of basic ideas for this that come back in every
programming language. This lesson introduces them without a single line of
code, with pictures from everyday life, and the lessons after it show you
what each of them looks like in Python.

## A program is a recipe

A recipe is a sequence of steps in a fixed order: first melt the butter, then
stir in the sugar, then the eggs. A program is built the same way, except
that the cook is a computer that takes every step literally. If the recipe
says "butter on the bread", it puts the whole pack on top; "a pinch of salt"
is too vague for it, and it does not notice a missing step. Such a precise
sequence of steps that reliably solves a task is called an **algorithm**, and
a program is an algorithm written down in a language the computer can read.

From this follows the most important habit in programming: when a program
does something other than what you want, the computer has almost never made a
mistake. It carried out what is written, and the question is what you need to
write differently.

## Input, processing, output

Think of a bottle deposit machine in a supermarket. You put bottles in, which
is the **input**. The machine recognises each bottle and adds up the
deposit, which is the **processing**. At the end it prints a receipt, which
is the **output**. Almost every program follows this pattern: it receives
something, such as a number you type or a file, does something with it and
returns a result, on the screen, in a file or as a signal to a device.

## Variables: containers with a label

A program has to remember things: your name, an intermediate result, the
number of bottles. That is what **variables** are for. Picture a variable as
a container with a label stuck on it that carries a name. Inside the
container lies a value, and through the name on the label the program finds
it again whenever it needs it.

![Three containers, each with a blue label: name holding the text Anna, age holding the number 19 and points holding the number 0.](figure:containers "Every container carries a name and holds exactly one value.")

Three things belong to this picture. A container always holds **exactly one
value**: if you put a new one in, the old one is gone without being kept
anywhere. The new value may be **calculated from the old one**: the variable
`points` works like the scoreboard in a stadium, which looks at what it shows
with every goal and puts up one more. And the name on the label is meant **for
humans**: the computer does not care whether a container is called `age` or
`x`, but whoever reads your program, including you yourself in three weeks,
understands `age` at once.

What lies in a container can be of different kinds: a number, a text or an
answer such as yes or no. The kind decides what you can do with the value.
You can add two numbers, but you can only join two texts together, just as
you weigh flour but count eggs.

## Lists: a train with numbered carriages

Sometimes it is not one value but a whole row of them: all the shopping, all
the readings of a day, all the names in a group. That is what **lists** are
for. A list is like a train: each carriage carries a value, the carriages
stand in a fixed order and are numbered, and you can couple one on at the end
or uncouple one. The number gets you to a particular carriage. Many
languages, Python included, start counting at 0, so the first carriage has
the number 0.

## Branches: the bouncer

A program often has to decide what happens next. Think of a bouncer outside a
club: they ask every guest the same question, namely whether they are at
least 18, and depending on the answer they let them in or send them home.
Such a **branch** always consists of a question that can be answered with yes
or no, the **condition**, and two ways, of which exactly one is taken.

![A box with the question at least 18? An arrow marked yes leads to a green box let in, an arrow marked no to a red box turn away.](figure:fork "The condition is a yes-or-no question, and exactly one of the two ways is taken.")

In everyday life you make such decisions all the time without thinking about
it: if it rains, you take the umbrella, otherwise the sunglasses. In a
program you have to write them down explicitly, including the second way,
because whoever forgets it has a program that simply does nothing when the
sun shines. If there are more than two possibilities, you line up several
questions, the way a traffic light first asks whether it shows red, then
whether amber, and otherwise green.

## Loops: the same once more

Many tasks consist of doing the same step again and again. For a salad you
peel each onion in the bag, one after the other, and stop when the bag is
empty. A **loop** writes such a step down only once and adds how often or
how long it is repeated.

![At the top it says for each onion in the bag: peel, below it four boxes onion 1 to 4. Peeled stands under the first two, and a yellow frame marks onion 3.](figure:loop "The loop takes one piece after the other and is at the third onion right now.")

There are two ways of ending a loop. The first is the one in the picture:
once **for each piece** of a list, so as often as the list is long. The
second runs **as long as a condition holds**, like stirring a batter, which
only stops when there are no more lumps; how many rounds that takes, nobody
knows in advance.

The second kind hides a trap that is printed on many a shampoo bottle:
"Lather, rinse, repeat." Whoever takes that literally stays in the shower
forever, because nowhere does it say when to stop. A loop whose condition
never becomes false is called an **infinite loop**, and it is one of the most
common mistakes at the start.

## Functions: the coffee machine

A coffee machine can make a cappuccino, and you do not need to know how hot
the water has to be or how long the milk froths. You press a button, perhaps
say whether the cup should be large or small, and get a cappuccino. A
**function** is such a machine inside a program: a sequence of steps that
gets a name, such as `make_cappuccino`, so that you can call it with one word instead of writing the
steps out again every time.

![On the left the parameter "large", in the middle a box with the function make_cappuccino, on the right under return value nothing yet. When played, the parameter disappears into the function and a large cup of cappuccino comes out; then the same with "small" and a small cup.](figure:machine "The same function, called twice: the parameter changes, the steps inside stay the same.")

What you give the function when you call it is called a **parameter**, and
what it gives back to you is its **return value**. A function is thus a small
program with its own input, processing and output. That has two advantages:
you write the steps down only once and can use them as often as you like,
and whoever uses the function does not need to know its inside, just as with
the coffee machine. With functions you also cut a big task into small ones
that you can solve and check one by one; how to go about that is shown in
[[problem-decomposition]].

## When it does not work

No program runs on the first attempt. Finding mistakes, called
**debugging**, is therefore not a sign that you are doing something wrong but
the largest part of the work. You go about it as with a cake that did not
rise: instead of baking everything again, you check step by step where the
result first differs from what you expected. To make that easier, you write
**comments** into the code, notes for humans that the computer skips, like
the pencil note in the margin of a recipe.

## What comes next

| Basic idea | Everyday picture | in Python |
|---|---|---|
| Sequence of instructions | recipe | [[python-first-program]] |
| Variable | container with a label | [[python-values-and-variables]] |
| Input and output | bottle deposit machine | [[python-working-with-text]] |
| List | train with numbered carriages | [[python-lists]] |
| Function | coffee machine | [[python-functions]] |
| Branch | bouncer | [[python-if-else]] |
| Loop | peeling onions | [[python-for-loops]], [[python-while-loops]] |
| Debugging | a cake that does not rise | [[python-error-messages]] |

Keep the pictures in mind when you start with Python in a moment. The
language is new, but you now know the ideas behind it.
