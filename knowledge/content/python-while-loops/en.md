---
title: Loops with while
summary: >-
  A while loop repeats its body as long as a condition holds, even when
  nobody knows beforehand how many rounds it will take. You learn how to spot
  and stop an endless loop and how a program keeps asking until an input
  fits.
objectives:
  intro: "In this lesson you get to know the while loop, and afterwards you can:"
  goals:
    - "write a `while` loop that runs as long as a condition holds, and predict how many rounds it makes"
    - "work out with a `while` loop how many steps it takes to reach a goal, such as until savings have doubled"
    - "explain why a loop runs endlessly when its body never makes the condition false, and halt such a program with “Stop”"
    - "keep asking for an input with `while True` and `break` until it is valid"
    - "give reasons when `for` and when `while` is the right loop"
translation_of: de
based_on: 2026-11-01
---

The [[python-for-loops|for loop]] knows from the start how many rounds it
makes: as many as the list has elements or `range()` gives numbers. The
[[programming-principles|basic ideas]], however, had a second kind of loop,
one that runs **as long as a condition holds**, like stirring dough, which
stops only when there are no lumps left. Nobody knows beforehand how many
rounds that takes, and this is exactly what Python has the `while` loop for.

## As long as a condition holds

```python
count = 3

while count > 0:
    print(count)
    count = count - 1

print("Go!")
```

After `while` comes a condition as you know it from `if`
([[python-conditions]]), followed by a colon and the indented body. Before
every round Python checks the condition: if it is true, the body runs once,
and then it goes back up to the next check; if it is false, the program
carries on after the loop. Here the body counts `count` down by one in every
round, after the third round `count` equals 0, the condition `count > 0` no
longer holds, and the program continues with `print("Go!")`.

If the condition is already false at the first check, the body does not run
a single time. To try it, put `count = 0` at the start.

## When nobody knows how many rounds it takes

For a countdown you could also have used `range()`. A `while` loop pays off
where the number of rounds only emerges from the calculation, for instance
for the question of how many years it takes for savings to double at 5 per
cent interest:

```python
amount = 1000
years = 0

while amount < 2000:
    amount = amount * 1.05
    years += 1

print(f"After {years} years it is {amount:.2f} euros.")
```

The loop credits the interest year by year, counts along and stops in the
year in which the amount first reaches 2000 euros. Change the factor to
`1.02` or `1.10`, and without any further change the loop makes as many
rounds as it takes.

The same pattern answers the question of how often you can halve a number
until it is smaller than 1:

```python
number = 100
halvings = 0

while number >= 1:
    number = number / 2
    halvings += 1
    print(number)

print(f"Halved {halvings} times.")
```

## The endless loop

Some shampoo bottles say "lather, rinse, repeat", and anyone who takes that
literally never gets out of the shower again. A `while` loop fares just the
same when its body changes nothing that eventually makes the condition
false. Delete the line `count = count - 1` in the countdown above and run the
code: `count` stays 3, `count > 0` holds for ever, and the output fills up
with threes.

You halt a program that does not stop here with the **Stop** button, which
takes the place of **Run** while a program is running. Afterwards, **Reset**
brings back the original code. On your own computer, the key combination
Ctrl+C stops such a program [[python-on-the-command-line|in the terminal]].

Not every endless loop is this easy to see. In the savings example, `amount`
does change in every round, but with the factor `1.00`, that is 0 per cent
interest, the amount still stays at 1000, and the goal is never reached.
Before you write a `while` loop, therefore, ask yourself what in the body
brings the condition closer to its end and whether that happens in every
case.

## Asking until the answer fits

A common job for `while` is an input that may only have certain values. The
program should keep asking until someone types a positive number, and it
does not know beforehand how often that will be. You write this most
clearly with `while True` and `break`:

```python
while True:
    number = int(input("Enter a positive number: "))
    if number > 0:
        break
    print("The number must be greater than 0, please try again.")

print(f"Thank you, we go on with {number}.")
```

`while True` is a loop whose condition always holds, that is an intended
endless loop. It is ended from inside: `break` leaves the loop at once, and
the program carries on after it. This way the question stands only once in
the program, at the start of the body, with the check right below it. Type
`-3` first and then `0` before you choose a number that fits. By the way,
`break` also ends a `for` loop before its list is finished.

## for or while?

Both loops repeat their body, and every `for` loop could also be written
with `while`:

```python
for number in range(1, 4):
    print(f"for: {number}")

number = 1
while number < 4:
    print(f"while: {number}")
    number += 1
```

Both print 1, 2 and 3, but the `while` version has to take care of three
things itself that `for` handles on its own: a starting value, a condition
and a line that counts on, and anyone who forgets the last one has an
endless loop. This gives a simple rule: if you go through a list, a text or
a known number of rounds, use `for`; if the end depends on something that
only shows up in the loop, such as a growing amount or an input, use
`while`.

## What is still missing

The program that asks for a positive number still has a gap: if someone
types `twelve` instead of `12`, the loop does not even get to the check,
because `int("twelve")` already stops the program with a `ValueError`. Try
it in the box above. How to read such a message is shown in
[[python-error-messages]], and how a program catches the error and simply
asks again follows with [[python-exceptions]] in part 4 of this path.

## Takeaways

- `while condition:` repeats the body as long as the condition holds and
  checks it before every round; if it is false from the start, the body does
  not run at all.
- `while` fits when the number of rounds only emerges from the calculation
  or from inputs.
- If the body changes nothing that eventually makes the condition false, the
  loop runs endlessly; on this page **Stop** halts it, in the terminal
  Ctrl+C.
- `while True` with `break` keeps asking until an input is valid.
- For lists, texts and a fixed number of rounds, `for` is simpler and safer.
