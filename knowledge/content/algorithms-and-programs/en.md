---
type: [lesson, slides]
code: 5749
title: Algorithms and programs
summary: >-
  What a program is: an algorithm written down so completely that a machine
  can carry it out line by line without adding anything. Along with it the
  four building blocks of every program on an LED that you can program right
  here, what a procedure costs, how to read an error message, and how to work
  with an AI assistant so that you understand the code.
objectives:
  intro: "Using an LED that a program switches line by line, this lesson shows you what an algorithm is and what a program makes of it, and afterwards you can:"
  goals:
    - "explain what makes an algorithm and why a program is an algorithm written down completely for a machine"
    - "carry out bubble sort by hand on a few values and name the condition at which it ends"
    - "predict line by line what the LED shows for a short program with `led.set_color()` and `time.sleep()`, and argue why pauses and order change the result"
    - "find the four building blocks sequence, named value, repetition and condition in a program and recognise when a loop has no way out"
    - "compare two correct procedures by their cost and say how that cost grows with the size of the problem"
    - "read a Python error message and find the file, the line and the cause in it"
    - "ask an AI assistant so that you understand the code, and change code you have taken over yourself"
deck_lang: en
level: 1
duration: 30
topics: [solving-problems, programming-with-python]
modules: [dup]
relations:
  requires: [programming-principles]
  see_also: [python-first-program, python-while-loops, python-error-messages, card-guessing]
status: published
updated: 2026-11-03
---

Around 1900, many living rooms had a piano that played by itself. The keys
moved while the stool stayed empty, and the music came from a roll of paper
above the keyboard, in which every punched hole meant "press this key now".
The piano understood nothing about music and carried out what the roll said,
so the real pianist was whoever had punched the roll, perhaps decades
earlier. The roll is the program, the piano the machine and the person with
the punch the programmer, and this lesson looks at that relationship
closely, with an LED in place of the piano that you can program yourself
further down.

## Be the machine

Imagine someone holding up coloured cards one after another while you note
them down by four steps: look at the card, decide which of four colours it
is, write down its first letter, and wait for the next card. You can follow
these steps without knowing what the sequence of colours means, and that is
exactly what makes them an **algorithm**: a sequence of steps described so
precisely that whoever carries it out does not need to understand its
purpose.

An algorithm needs no computer. It can stand on a piece of paper in everyday
language, and a person can carry it out by hand, as you just did. What counts
is that every step is unambiguous: a thousand steps are still an algorithm as
long as each of them is clear, while four steps are not one if a single step
calls for judgement, such as "write down whether the colour looks nice".
Donald Knuth, whose books are the standard work on the subject, names five
properties: an algorithm ends after finitely many steps, each step is defined
exactly, it takes input, it gives output, and each of its steps can actually
be carried out.

Of the four steps, three are easy for a program on the device: looking means
reading the sensor, writing down means storing a value, and waiting is a
single line. The second step, deciding which colour it is, is the real work
of a receiver, and most of the LiFi project hangs on it.

## One more algorithm: sorting by rules

A second algorithm shows how much a few precise rules can achieve. Six people
stand in a row in random order, and each of them follows five rules without
thinking ahead: stand in a row; look at your right neighbour; if they are
shorter than you, swap; at the end of the row, start again; and if a full
pass had no swap, stop. After a few passes the row stands sorted by height,
although nobody planned it. The procedure is called **bubble sort**, because
the tall ones rise to the right like bubbles in water, and a computer can
sort the same way, following the same five rules, only millions of times
faster.

![Six bars of heights 2, 5, 1, 6, 3 and 4 in a row. When played, each step runs one pass: two neighbouring bars turn yellow while they are compared, and the taller one moves to the right. After the third pass, which finds nothing to swap, all bars turn green.](figure:bubble "Each step is one pass: three swaps, three more, and a third pass without a swap ends the procedure.")

The drawing applies the rules to six bars. The first pass makes three swaps,
the second three more, and the third finds nothing left to swap. In Python
the rules look like this:

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
right neighbour, the line after the `if` swaps the two, and `while True`
around it starts the next pass. Put other numbers into the list, more or
fewer than six, and the same lines sort them as well.

How does the procedure know that it is finished? Nobody from outside says
"done", and nobody judges whether the row looks sorted, because judging is
not part of the rules. The end follows from the rules themselves: a pass
without a single swap means that nothing is left to sort. Such a rule is
called a **termination condition**, and in the code it is the line
`if swaps == 0:` with the `break` below it, which leaves the loop.

## A program is a list

An algorithm on paper is not yet a program. A person who carries it out
fills in what was obviously meant, mostly without noticing: if a step is
missing, they add it, and if the order is clumsy, they rearrange it. A
machine does neither. **A program is a list of instructions that a computer
follows exactly and in order**, and that adds a requirement the paper
version never had: the list must be complete.

The program below switches an LED. The two lines at the top fetch the tools,
`time` for waiting and `led` from the course module `lifi_hardware`, and the
four lines under them are the instructions. Run it, and the box under the
code shows what the LED does, on a timeline that runs as fast as the real
one would: on the device the same lines switch the real LED.

```python
import time
from lifi_hardware import led

led.set_color(255, 0, 0)
time.sleep(1)
led.set_color(0, 0, 255)
time.sleep(1)
```

The first instruction makes the LED red, the second waits one second, the
third makes the LED blue, and the fourth waits another second. When the last
line is done, the program ends, and the course module switches the LED off.
The machine does not know what was meant: it carries out what is written, in
the order in which it is written, and nothing else.

Each instruction line has three parts. In `led.set_color(255, 0, 0)` the
part `led` says which thing is addressed, `.set_color` says what should
happen to it, and the brackets say with which values: here full red, no
green and no blue. The same instruction with other values gives other
colours, `(0, 0, 255)` blue and `(255, 255, 0)` yellow, mixed from full red
and full green. Change the values in the box and run it again, for example
to `(255, 0, 255)` or to `(40, 0, 0)` for a dim red.

## Four building blocks

Every program in this lesson, and every program you write in the project, is
made of four building blocks: instructions one after another, values with
names, repetition and condition. All four can be seen on the LED.

### 1 · One after another

Instructions run in order, and the order is part of the program, not merely a
way of writing it down. `time.sleep(1)` makes the program wait one second
before it carries out the next line, and a computer waits only where a
program says so.

Delete the first `time.sleep(1)` in the box above and run it again. Red and
blue now both come at 0 seconds, so red lasts no time at all: on the device
it shines for about a millisecond, far too briefly for an eye, and you only
ever see blue. The timeline shows it as a hairline at the start. The program
is not broken but correct and simply too fast for you.

The order matters even when no line is missing. In the next program the
pause stands between the two colours:

```python
import time
from lifi_hardware import led

led.set_color(255, 0, 0)
time.sleep(1)
led.set_color(0, 0, 255)
```

Red stays for a second, then blue comes, and right after that the program
ends and the LED goes off, so you see red. Now move `time.sleep(1)` to the
end, below the blue line: blue comes at once and stays for a second, so you
see blue. The same three lines make a different program, because the machine
does not rearrange what was meant but carries out what stands where.

### 2 · A value with a name

A name for a value that you then use everywhere: `bright = 120` sets the
brightness once, and red, green and blue all follow it.

```python
import time
from lifi_hardware import led

bright = 120
led.set_color(bright, 0, 0)
time.sleep(1)
led.set_color(0, bright, 0)
time.sleep(1)
led.set_color(0, 0, bright)
time.sleep(1)
```

Change `120` into `255` or `30` and run it: all three colours change with
it. The gain is not brevity but one place to change instead of three.

### 3 · Again

A list of colours and a loop over it. Every colour in the list is a triple of
numbers such as `(255, 0, 0)`, and `for r, g, b in colors:` unpacks each
triple into the three numbers that `led.set_color` expects.

```python
import time
from lifi_hardware import led

colors = [(255, 0, 0), (0, 255, 0),
          (0, 0, 255), (255, 255, 0)]
for r, g, b in colors:
    led.set_color(r, g, b)
    time.sleep(1)
```

A loop is not magic but a way of writing: the same two indented lines run
four times, each time with the next value from the list, so the timeline
shows four passes and four seconds. Add a fifth colour to the list, and the
loop makes a fifth pass without any other change.

### 4 · Only if

A condition carries out a line only if it holds, and `else` says what
happens otherwise. Here yellow stays for three seconds and every other colour
for one:

```python
import time
from lifi_hardware import led

colors = [(255, 0, 0), (0, 255, 0),
          (0, 0, 255), (255, 255, 0)]
for r, g, b in colors:
    led.set_color(r, g, b)
    if (r, g, b) == (255, 255, 0):
        time.sleep(3)
    else:
        time.sleep(1)
```

The passes follow each other as before, but the yellow bar grows three times
as long as the others, four passes and six seconds in all. With that, the
run depends on something that changes along the way, and a program can react
to something instead of reeling off the same thing, for instance to the value
the sensor is measuring right now.

### When does this end?

A loop `while True:` repeats its body for as long as its condition holds, and
`True` always holds:

```python
import time
from lifi_hardware import led

while True:
    led.set_color(255, 0, 0)
    time.sleep(1)
    led.set_color(0, 0, 255)
    time.sleep(1)
```

This program never ends, because the body has no way out. On the device it
blinks until you stop it with Ctrl+C, and here the page stops it after 20
seconds. You know the termination condition from sorting, a pass without a
swap; here it is missing. For continuous blinking that is even right, and a
program that waits for messages runs in such a loop as well. A receiver that
is meant to wait for the end of a message, on the other hand, needs a
condition at which its loop ends, and the complaint "my program hangs" almost
always means that the loop has no way out. [[python-while-loops]] shows more
such loops.

A condition can also be present and still never be met. In the sorting
program further up, change the `4` in the list into a `5`, so that two values
are equal, and change `>` into `>=`, so that the rule says "swap if you are
taller or just as tall". The two fives then trade places in every pass, every
pass has a swap, and the row never comes to rest, so you halt the program
with **Stop**: a single character in the rule decides whether the procedure
ends.

## What does it cost?

All the programs so far work, and for the LED that is enough. As soon as a
program handles a lot of data, though, say a whole file sent over the light,
a second question joins the first: how much work does it take? Someone
thinks of a number between 1 and 100, and you may ask questions that are
answered with yes or no. You can ask for one number after another, which
takes 99 questions in the worst case, or you can ask whether the number is
greater than 50 and so halve the range with every question, which takes at
most seven. Both procedures are certain to find the number, and the
difference grows with the size of the problem:

| Numbers | one by one | halving |
|---|---|---|
| 100 | 99 | 7 |
| 1,000 | 999 | 10 |
| 1,000,000 | 999,999 | 20 |

Being correct is therefore only the minimum, and after that procedures are
compared by their **cost**: how many steps, how much time or how many
measurements they need, and above all how that number grows when the problem
grows. You can try halving for yourself in [[card-guessing]].

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
far more slowly. For a transmission over light this becomes the concrete
question of how many seconds a file is on its way.

## Reading an error message

If the machine cannot carry out a line at all, it stops and says why. The
program below has a typo in its second instruction; run it.

```python
import time
from lifi_hardware import led

led.set_color(255, 0, 0)
time.slep(1)
led.set_color(0, 0, 255)
```

A traceback looks threatening, but it is a precise report, and it reads from
top to bottom. First it names the file and the line, here `program.py` and
line 5, since the page saves the code from the box under that name. Then it
shows what stands in that line, and the carets under it point at the place.
The last line says what exactly does not exist, here `slep` instead of
`sleep`, and Python even guesses what was meant. It does not act on the
guess, though: the machine did not fail but carried out what was written,
and it reports exactly where it got stuck. The LED shows the same, since it
turned red before line 5 and goes off when the program stops.

An error message is information about the program, not a verdict on you.
Read it out loud, because most of the time it says literally what is wrong,
and then correct the line and run it again. [[python-error-messages]] goes
through the common messages one by one.

## Working with the assistant

You write most of the programs in the project together with an AI assistant,
and how you ask decides what you get. "Write me a program for the LED" gets
you code that you do not understand. "The LED should be red for three
seconds, then blue. Explain each line before you write it" says what should
come out and asks for the explanation along with it, and that gets you code
and understanding.

Never keep code that you cannot change. Every hand-over ends with a small
change that you make yourself, such as another colour or a different waiting
time, and the boxes on this page are the place to practise that. If you
cannot change a piece of code, you have not taken it over but only copied it.

## Takeaways

- An algorithm is a sequence of steps so precise that it can be carried out
  without understanding its purpose; it needs no computer.
- A program is a list of instructions that a computer follows exactly and in
  order. It adds nothing, so the list must be complete, and a different order
  makes a different program.
- Every program is made of four building blocks: one after another, a value
  with a name, repetition and condition.
- A procedure ends only if its termination condition can be reached; bubble
  sort stops after a pass without a swap, and `while True:` without a way out
  never stops.
- Being correct is the minimum: two correct procedures are compared by their
  cost and by how it grows with the size of the problem.
- An error message names the file, the line and the cause, and it is
  information, not a verdict.
