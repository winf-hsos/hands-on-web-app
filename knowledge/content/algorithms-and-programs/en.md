---
type: lesson
code: 5749
title: From algorithm to program
summary: >-
  What turns a description into an algorithm, what a program adds to it, how
  a procedure knows that it is finished, and why a correct solution can still
  be useless.
objectives:
  intro: "This lesson follows a procedure from the piece of paper to the computer, and afterwards you can:"
  goals:
    - "explain what makes a description an algorithm and why a program is an algorithm written down completely for a computer"
    - "predict what a short list of instructions does and show that a different order makes a different program"
    - "carry out bubble sort by hand on a few values and name its termination condition"
    - "explain why a loop without a reachable end never stops, and when that is exactly what is wanted"
    - "compare two correct procedures by their cost and say how that cost grows with the size of the problem"
level: 1
duration: 20
topics: [solving-problems, processing-information]
modules: [dup]
relations:
  requires: [programming-principles]
  see_also: [algorithms-and-programs-slides, python-first-program, python-while-loops, card-guessing]
status: draft
updated: 2026-11-01
---

Around 1900, many living rooms had a piano that played by itself. The keys
moved while the stool stayed empty, and the music came from a roll of paper
above the keyboard, in which every punched hole meant "press this key now".
The piano understood nothing about music and carried out what the roll said,
so the real pianist was whoever had punched the roll, perhaps decades
earlier. That is the relationship between a program, a computer and the
person who writes the program, and this lesson looks at it closely: what
turns a description into an algorithm, what a program adds to it, when such
a procedure ends and why a correct solution can still be useless.

## What makes an algorithm

Imagine someone holding up coloured cards one after another while you note
them down by four steps: look at the card, decide which of four colours it
is, write down the first letter of that colour, and wait for the next card.
You can follow these steps without knowing what the sequence of colours
means, and that is exactly what makes them an **algorithm**: a sequence of
steps described so precisely that no question is left open, so that whoever
carries it out does not need to understand its purpose.

An algorithm needs no computer. It can stand on a piece of paper in everyday
language, and a person can carry it out by hand. What counts is that every
step is unambiguous: a thousand steps are still an algorithm as long as each
of them is clear, while four steps are not one if a single step calls for
judgement, such as "write down whether the colour looks nice". Donald Knuth,
whose books are the standard work on the subject, names five properties: an
algorithm ends after finitely many steps, each step is defined exactly, it
takes input, it gives output, and each of its steps can actually be carried
out. The [[programming-principles|basic ideas of programming]] compare an
algorithm with a recipe; here the question is what changes when the cook is
a machine.

## From algorithm to program

An algorithm on paper is not yet a program. A person who carries it out
fills in what was obviously meant, mostly without noticing: if a step is
missing, they add it, and if the order is clumsy, they rearrange it. A
computer does neither. **A program is a list of instructions that a computer
follows exactly and in order**, and that adds a requirement the paper
version never had: the list must be complete.

The box below is a tiny machine of this kind. The list `program` holds four
instructions for a lamp, and the loop under it works through them from top
to bottom: an instruction `color` switches the lamp, an instruction `wait`
lets time pass on a clock. You do not need to understand the machine's
inside yet, since the Python lessons explain each part; for now you only
change the list.

```python
program = [
    ("color", "red"),
    ("wait", 1),
    ("color", "blue"),
    ("wait", 1),
]

clock = 0
for command, value in program:
    if command == "color":
        print(f"{clock} s  lamp: {value}")
    elif command == "wait":
        clock = clock + value
print(f"{clock} s  end")
```

The lamp is red for one second and then blue for one second. Now delete the
first `("wait", 1),` and run the machine again: red and blue both appear at
0 seconds, so red lasts no time at all. A real lamp would be red for a tiny
fraction of a second, far too briefly for an eye, and you would only ever see
blue. The program is not broken but correct and simply too fast for you,
because a computer waits only where the program says so.

Then put the line back, but at the end of the list, so that both colours
come first and both waits after them. The lamp now turns red and at once
blue, and only then does the machine wait two seconds, with a blue lamp. No
line is missing, and still it is a different program, since the order is
part of the program and not merely a way of writing it down.

Almost every error in a program comes from this gap between what was meant
and what is written, and only rarely from something being broken. If the
computer cannot carry out a line at all, for instance because a name is
misspelt, it stops and reports the line and the reason; how to read such a
message is shown in [[python-error-messages]].

## Sorting by rules

A second algorithm shows how much a few precise rules can achieve. Six people
stand in a row in random order, and each of them follows the same rules
without thinking ahead: look at your right neighbour and swap places if you
are taller; when the end of the row is reached, start again from the left;
and stop as soon as a whole pass through the row had no swap. After a few
passes the row stands sorted by height, although nobody planned it. The
procedure is called **bubble sort**, because the tall ones rise to the right
like bubbles in water.

![Six bars of heights 2, 5, 1, 6, 3 and 4 in a row. When played, each step runs one pass: two neighbouring bars turn yellow while they are compared, and the taller one moves to the right. After the third pass, which finds nothing to swap, all bars turn green.](figure:bubble "Each step is one pass: three swaps, three more, and a third pass without a swap ends the procedure.")

The drawing applies the same rules to six bars. The first pass makes three
swaps, the second three more, and the third finds nothing left to swap. In
Python the rules look like this:

```python
values = [2, 5, 1, 6, 3, 4]

passes = 0
while True:
    swaps = 0
    for i in range(len(values) - 1):
        if values[i] > values[i + 1]:
            values[i], values[i + 1] = values[i + 1], values[i]
            swaps = swaps + 1
    passes = passes + 1
    print(f"pass {passes}: {values}, {swaps} swaps")
    if swaps == 0:
        break
```

The line with `for` walks along the row and compares each value with its
right neighbour, the line after the `if` swaps the two, and the loop
`while True` around it starts the next pass. The output shows the row after
every pass, as in the drawing. Put other numbers into the list, more or
fewer than six, and the same lines sort them as well.

## When does it end?

How does bubble sort know that it is finished? Nobody from outside says
"done", and nobody judges whether the row looks sorted, because judging is
not part of the rules. The end follows from the rules themselves: a pass
without a single swap means that nothing is left to sort. Such a rule is
called a **termination condition**, and in the code it is the line
`if swaps == 0:` with the `break` below it, which leaves the loop.

A run ends only if its end is reachable. Delete the two lines with
`if swaps == 0:` and `break` and run the program again: `while True` now has
no way out, the passes go on for ever, and you halt the program with
**Stop**. The computer does not notice that nothing new happens, since it
notices nothing at all and carries out what is written. That is not always
a mistake: a lamp that is meant to blink until someone switches it off runs
in exactly such an endless loop, and so does a program that waits for
messages. A loop that is meant to end, however, needs a condition that
eventually holds, and the complaint "my program hangs" almost always means
that it has none. [[python-while-loops]] shows more such loops.

A condition can also be present and still never be met, which shows how
exact the rules have to be. Change the `4` in the list into a `5`, so that
two values are equal, and change `>` into `>=`, so that the rule says "swap
if you are taller or just as tall". The two fives then trade places in every
pass, every pass has a swap, and the row never comes to rest, so a single
character in the rule decides whether the procedure ends.

## Correct is only the minimum

Two procedures can both be correct and still be worlds apart. Someone thinks
of a number between 1 and 100, and you may ask questions that are answered
with yes or no. You can ask for one number after another, which takes 99
questions in the worst case, or you can ask whether the number is greater
than 50 and so halve the range with every question, which takes at most
seven. Both procedures are certain to find the number, and the difference
grows with the size of the problem:

| Numbers | one by one | halving |
|---|---|---|
| 100 | 99 | 7 |
| 1,000 | 999 | 10 |
| 1,000,000 | 999,999 | 20 |

A solution can therefore be correct and still useless, which is why
procedures are compared by their **cost**: how many steps, how much time or
how many measurements they need, and above all how that number grows when
the problem grows. You can try halving for yourself in [[card-guessing]].

Bubble sort has a cost as well, and the box below counts it as the number of
comparisons until the row is sorted. Six values in reverse order take 30
comparisons.

```python
values = [6, 5, 4, 3, 2, 1]

comparisons = 0
while True:
    swaps = 0
    for i in range(len(values) - 1):
        comparisons = comparisons + 1
        if values[i] > values[i + 1]:
            values[i], values[i + 1] = values[i + 1], values[i]
            swaps = swaps + 1
    if swaps == 0:
        break
print(f"{len(values)} values sorted with {comparisons} comparisons")
```

Now replace the list with `list(range(40, 0, -1))`, which gives the numbers
from 40 down to 1. Forty values take 1,560 comparisons, and a thousand would
take 999,000, because with n values in reverse order the procedure makes
n passes of n − 1 comparisons each. Its cost therefore grows not like the
length of the row but roughly like its square, and that is why `sorted()`
and `sort()` from [[python-lists]] use a cleverer procedure whose cost grows
far more slowly.

## Takeaways

- An algorithm is a sequence of steps so precise that it can be carried out
  without understanding its purpose; it needs no computer.
- A program is a list of instructions that a computer follows exactly and in
  order. It adds nothing, so the list must be complete, and a different order
  makes a different program.
- A procedure ends only if its termination condition can be reached; bubble
  sort stops after a pass without a swap.
- Being correct is the minimum: two correct procedures are compared by their
  cost and by how it grows with the size of the problem.
