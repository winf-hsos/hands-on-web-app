---
type: quiz
code: 2368
title: "Quiz: algorithms and programs"
summary: >-
  Fourteen questions on what makes an algorithm, what a program adds to it,
  the order of instructions, loops that end or do not, and the cost of a
  procedure. Every answer comes with its reason.
level: 1
duration: 15
topics: [solving-problems, processing-information]
modules: [dup]
relations:
  checks: [algorithms-and-programs]
questions: [aa-001, aa-002, aa-003, aa-004, aa-005, aa-006, aa-007, aa-008, aa-009, aa-010, aa-011, aa-012, aa-013, aa-014]
status: published
updated: 2026-11-04
---

Several questions show short programs that switch a coloured lamp:
`lamp.set_color(r, g, b)` gives the lamp a colour mixed from red, green and
blue, each between 0 and 255, and `time.sleep(1)` waits one second before the
next line runs.

## Someone holds up coloured cards, and you follow four steps: look at the card, decide which colour it is, write down its symbol, wait for the next card. What makes these instructions an algorithm? {#aa-001}

- [ ] That they could be transferred to a computer, since only what a machine could execute counts as an algorithm.
  > An algorithm needs no computer, not even in thought. You can carry these steps out by hand, and they are an algorithm all the same; what makes them one is that every step is unambiguous, not who carries it out.
- [x] That the steps are described so precisely that you can carry them out without understanding what they are for.
  > Exactly the definition: an unambiguous sequence of steps that leaves no question open. Whoever follows it acts as the machine.
- [ ] That they consist of a few manageable steps that you can remember without writing them down.
  > Length and memorability do not matter. A thousand steps are still an algorithm as long as each is unambiguous, and four steps are not one if any of them calls for judgement.
- [ ] That they are written in a programming language, since only a fixed syntax turns instructions into an algorithm.
  > That would be the program. The algorithm can stand on a piece of paper, in everyday language; what matters is that each step is unambiguous, not which language it is written in.

> An algorithm is defined by the precision of its steps, not by the machine or the language.

## What is the difference between an algorithm and a program? {#aa-002}

- [ ] A program is the advanced stage of an algorithm, needed only once a problem becomes too large to handle by hand.
  > It is not about size or difficulty but about the reader, a human or a machine. Even a tiny procedure becomes a program as soon as it is written down completely enough for a machine.
- [ ] An algorithm describes how to compute; a program defines how the data for it are stored and managed.
  > Both describe the same procedure, only for different readers. Computing against storing is a different boundary, the one between processing and data, not the one between algorithm and program.
- [x] A program is the same procedure, but written down so completely that a machine can carry it out.
  > Exactly: a human fills in what was obviously meant, a machine does not, and that is why a program has to be complete.
- [ ] There is no essential one: both are unambiguous sequences of steps, and which word you use depends on the field.
  > They are close, but the difference is real: the card procedure is an algorithm and not yet a program, because a person carrying it out fills gaps that a machine would not fill.

> A program is a list of instructions that a computer follows exactly and in order, so it must not rely on anyone filling in what was meant.

## What do you see on the lamp when this program runs? {#aa-003}

```python static
lamp.set_color(255, 0, 0)
time.sleep(1)
lamp.set_color(0, 0, 255)
```

- [x] One second of red, then blue.
  > Correct: line by line, from top to bottom. Red, wait one second, blue.
- [ ] Red and blue at once, so violet.
  > A program runs one line after the other, not all at once, and the second colour replaces the first.
- [ ] Only blue, because the first line is skipped.
  > Nothing is skipped: red really shows, and thanks to `time.sleep(1)` long enough to see it.
- [ ] Only red: the lamp keeps the first colour it receives until the program ends.
  > A colour is not set for good. Every line sets the colour anew, so after the second the third line replaces red with blue.

> The computer carries out the lines in the order in which they stand, and each one changes the state that the next one finds.

## Someone is puzzled: "The lamp never turns red, but the line is right there!" What is going on? {#aa-004}

```python static
lamp.set_color(255, 0, 0)
lamp.set_color(0, 0, 255)
```

- [ ] The first line contains a bug that the machine silently skips; otherwise red would have to show.
  > The line is correct and does run, and a machine does not skip anything silently either: when something is wrong, it stops with a message. The problem is not the code but the time scale.
- [ ] The second line replaces the first before that one runs: with two commands of the same kind only the last one counts.
  > The machine merges nothing and leaves nothing out. Both lines run in this order; red was there, only extremely briefly.
- [x] Red does show, but only for a tiny fraction of a second; without a wait that is invisible to the eye.
  > Exactly: the program is correct and only too fast. Your eyes are slow and the machine is not, so instructions take visible time only where a wait says so.
- [ ] The lamp is sluggish: with two commands this close together only the last one gets through, and the first is lost in the hardware.
  > A lamp switches far faster than any eye can follow, and nothing gets lost: it was red, then blue. The bottleneck is perception, not hardware.

> A computer waits only where the program tells it to wait.

## What role does the part `(255, 0, 0)` play in this line? {#aa-005}

```python static
lamp.set_color(255, 0, 0)
```

- [ ] It says which lamp is addressed: the three numbers identify which of several lamps is meant.
  > Which thing is meant is said by `lamp` before the dot. The numbers in the brackets do not describe the lamp but the colour it should show.
- [x] It says with which values the instruction runs: full red, no green, no blue.
  > Correct: `lamp` says which thing, `set_color` says what should happen to it, and the brackets say with which values. Different values give a different result.
- [ ] It is a note for readers that explains the intended amount of red; only the part before the brackets is carried out.
  > Notes for humans look different, as comments with `#`. These values are carried out and decide directly what the lamp shows; without them `set_color` would not know which colour is meant.
- [ ] It says how long the instruction runs: for 255 milliseconds, after which the lamp is off again.
  > There is no duration anywhere in this line; that takes an instruction of its own, such as `time.sleep(1)`. The three numbers are the shares of red, green and blue, and the colour stays until another line changes it.

> An instruction names a thing, what should happen to it and with which values; change the values, and the result changes while the instruction stays the same.

## What is the benefit of the first line, `bright = 255`? {#aa-006}

```python static
bright = 255
lamp.set_color(bright, 0, 0)
time.sleep(1)
lamp.set_color(bright, bright, 0)
```

- [ ] The program runs faster because the machine reads the value only once instead of anew at every call.
  > A named value has no measurable effect on speed, since reading a number costs the machine nothing. The benefit is for the person who changes the program.
- [ ] Without it the lamp would stay dark, since this line is what sets the brightness to its maximum.
  > The line switches nothing; it only gives a number a name. You could write 255 directly in both calls, and the lamp would light the same. The name is a choice, not a necessity.
- [x] The brightness can be changed in exactly one place instead of at every use.
  > Exactly: a value with a name. To dim the lamp, you change one line, and both calls of `set_color` follow.
- [ ] Names are mandatory: an instruction like `set_color` accepts only named values, not bare numbers in the brackets.
  > Numbers written directly are allowed and often fine. A name pays off where the same value recurs or is meant to change.

> A value with a name gives you one place to change instead of many.

## Roughly how long does this program run, and what does the lamp show? {#aa-007}

```python static
colors = [(255, 0, 0), (0, 255, 0),
          (0, 0, 255), (255, 255, 0)]
for r, g, b in colors:
    lamp.set_color(r, g, b)
    time.sleep(1)
```

- [ ] One second: the loop shows all four colours at once.
  > A loop runs one pass after the other, not in parallel: one pass per value.
- [x] About four seconds: four passes, each showing one colour for one second.
  > Exactly: the same two lines run four times, each time with the next value from the list, and repetition costs time as well.
- [ ] Forever: a `for` loop runs until you stop it.
  > This loop has a built-in end: it runs exactly once per entry of the list and then stops.
- [ ] Four seconds, but only the last colour, yellow, is ever visible.
  > Thanks to `time.sleep(1)` in the body of the loop, every colour stays visible for a full second, not just the last one.

> A loop is a way of writing: the same lines run once per value, one pass after another.

## Roughly how long does this program run in total? {#aa-008}

```python static
colors = [(255, 0, 0), (255, 255, 0), (0, 0, 255)]
for r, g, b in colors:
    lamp.set_color(r, g, b)
    if (r, g, b) == (255, 255, 0):
        time.sleep(3)
    else:
        time.sleep(1)
```

- [ ] 3 seconds
  > That would be one second per pass, but the yellow pass waits three.
- [ ] 9 seconds
  > That would be three seconds per pass, but only yellow waits three and the others one.
- [x] 5 seconds
  > Exactly: red 1, yellow 3, blue 1. The condition decides in every pass which branch with `time.sleep` runs.
- [ ] 4 seconds
  > Close: counting `if` and `else` once each gives 3 plus 1. But each of the three passes waits, so it is 1 plus 3 plus 1.

> A condition is checked anew in every pass, so the run depends on the value at hand.

## Which building blocks is every program made of? Tick all that belong. (Several answers may be correct.) {#aa-009}

- [x] Instructions that run one after another.
  > Correct: the foundation, line by line from top to bottom.
- [x] Values that get a name.
  > Correct: one place to change instead of many.
- [x] Repetition.
  > Correct: the same lines run several times, each time with the next value.
- [x] Conditions: something happens only if something holds.
  > Correct: this is how a program reacts instead of always running through the same steps.

> All four together are the whole building material: sequence, named values, repetition and condition.

## Your program stops with this message. What do you make of it? {#aa-010}

```text
Traceback (most recent call last):
  File "blink.py", line 7, in <module>
    lamp.set_colour(255, 0, 0)
AttributeError: 'Lamp' object has no attribute 'set_colour'. Did you mean: 'set_color'?
```

- [ ] The computer crashed; after a restart the program usually works again, since messages like this come and go.
  > Nothing crashed, and after a restart the same message would return, because the wrong name still stands in line 7. The machine stopped in an orderly way and reported precisely why.
- [x] The message states file, line and cause: line 7 says `set_colour`, which does not exist; `set_color` was meant.
  > Exactly: an error message is information, not a verdict. Read it out loud; it usually says literally what is wrong.
- [ ] The program overwhelms the machine; the message shows that it could not keep up when running line 7.
  > This has nothing to do with performance, since a few lines overwhelm no machine. A name in the code does not exist, and that is precisely what the message says, nothing more.
- [ ] The message is a warning you can read past: the program continues after line 7, and the lamp lights up anyway.
  > It is not a warning but a stop: the program ends in line 7, and nothing lights up after that. The message is the fastest route to the fix, not noise.

> The computer carried out what was written and reports exactly where it got stuck; the last line of the message names the cause.

## When does this program end? {#aa-011}

```python static
while True:
    lamp.set_color(255, 0, 0)
    time.sleep(1)
    lamp.set_color(0, 0, 255)
    time.sleep(1)
```

- [ ] Once both colours have been shown, because then the body of the loop has been carried out completely.
  > After blue, the loop jumps back to its start, and one pass is not an end.
- [ ] By itself after a while, when the machine notices that nothing new happens.
  > The machine notices nothing and judges nothing. It carries out what is written, and what is written says: for ever.
- [x] Never: the condition is always true, and the body of the loop has no way out.
  > Exactly: a procedure ends only if its end is reachable. This loop blinks until someone stops it from outside, which is even intended for a lamp that should blink continuously; a program that is meant to finish needs a termination condition.
- [ ] After a fixed number of repetitions, because every loop has a built-in upper limit so that the machine does not get stuck.
  > There is no built-in limit, and the machine does not protect itself from getting stuck either. What is not written does not happen.

> A loop ends only when its end is reachable; `while True` without a way out runs for ever.

## In the guessing game from 1 to 100, two procedures are certain to succeed: asking for every number one by one (up to 99 questions) or halving the range (at most 7 questions). What follows? {#aa-012}

- [ ] Only halving deserves the name algorithm; asking one by one is mere trial without a procedure.
  > Both are correct algorithms, with unambiguous steps, a certain end and the right result. They differ in something else.
- [x] A solution can be correct and still useless; procedures are compared by their cost.
  > Exactly: being correct is the minimum, and after that the cost counts, here the number of questions.
- [ ] On modern computers the difference no longer matters, since both procedures finish in a fraction of a second anyway.
  > Fast machines shift the limit but do not remove it: 99 against 7 becomes 999 against 10 with a thousand numbers, so the gap grows with the problem.
- [ ] The slow procedure is safer because it checks every number explicitly, and is therefore preferable.
  > Both are equally safe, since both are certain to end with the right number. Slowness buys no safety here, only cost.

> What matters is how the cost grows with the size of the problem.

## Six people sort themselves by height with these rules: look at your right neighbour, swap places if you are taller, start again from the left at the end of the row. How does this procedure know that it is finished? {#aa-013}

- [ ] After exactly one pass through the row, because by then every person has checked their neighbour once.
  > One pass only moves the tallest person to the far right; the rest can still be out of order.
- [ ] When the people can see that the row looks sorted.
  > "Looks sorted" is a judgement, and the rules contain none, because whoever follows them acts as a machine. The end has to follow from the rules themselves.
- [x] By a complete pass in which nobody swapped.
  > Exactly: that is the built-in termination condition. No swap in a whole pass means that nothing is left to sort, and without such a condition the procedure would run for ever.
- [ ] Not by itself: as with any repetition that starts over, someone from outside has to stop it once the row is right.
  > That would be a loop without a way out. This one has one, and exactly that distinguishes it from `while True` without a termination condition.

> Bubble sort ends by its own rule: a pass without a swap.

## What does the lamp show when this program runs? {#aa-014}

```python static
lamp.set_color(255, 0, 0)
lamp.set_color(0, 0, 255)
time.sleep(1)
```

- [ ] Red for one second, then blue: the `time.sleep(1)` obviously belongs to the red phase.
  > The machine assigns nothing and rearranges nothing. It runs the lines in order, and the pause comes after both changes of colour.
- [ ] Blue for one second, then red: the pause holds the colour set last, and the first line is caught up on afterwards.
  > Nothing is caught up on: the machine runs each line exactly once, red before blue, and after the last line it is finished. The lamp stays blue.
- [x] Red only for a split second, then blue for one second.
  > Exactly: blue replaces red at once, and only then does the machine wait, with the lamp blue. The same three lines with the pause in the middle would be a different program, because the order is part of the program.
- [ ] The program is faulty and does not start, because `time.sleep(1)` is not allowed as the last line.
  > Each of these lines is valid on its own and in any order. The program runs; it just does not show what may have been meant.

> No line is missing, and still the order makes it a different program.
