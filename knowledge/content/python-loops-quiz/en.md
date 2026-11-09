---
title: "Quiz: Loops"
summary: Eight questions on for and while loops, range(), accumulators, endless loops and enumerate().
objectives:
  intro: "This quiz uses eight questions to check whether you can:"
  goals:
    - "predict which numbers `range()` gives with one, two or three arguments and how often a loop runs over them"
    - "work out the result of an accumulator and recognise why it gets its starting value before the loop"
    - "predict the rounds and the final value of a `while` loop and recognise which loop never stops"
    - "give reasons when `while` is the right loop, and predict what `enumerate()` gives with `start=1`"
translation_of: de
based_on: 2026-11-09
---

## What does this program print? {#hcs-024}

```python static
for number in range(2, 10, 3):
    print(number)
```

- [x] 2, 5 and 8, each number on a line of its own
  > The sequence starts at 2 and goes on in steps of three until the next number, 11, would reach the limit of 10.
- [ ] 2, 5, 8 and 11
  > With `range()` the end is never included, and 11 even lies beyond it.
- [ ] 3, 6 and 9
  > The first argument is the start, so the sequence begins at 2 and not at the first multiple of 3.
- [ ] 2, 3, 4, 5, 6, 7, 8 and 9
  > The third argument is the step, here 3.

> `range(start, end, step)` begins at `start`, counts in steps of `step` and stops before `end`: 2, 5, 8.

## How often does `for i in range(5): print("Hello")` print the greeting? {#hcs-025}

- [ ] Four times
  > `range(5)` gives 0, 1, 2, 3 and 4, which are five numbers.
- [x] Five times
  > The numbers 0 to 4 make five rounds.
- [ ] Six times
  > The 5 itself is not included; the sequence ends before it.
- [ ] Once
  > `range(5)` gives five numbers, and the loop runs one round for each.

> With one argument, `range()` starts at 0 and ends before the number, and so `range(5)` gives exactly five numbers and the loop five rounds.

## What does this program print? {#hcs-026}

```python static
total = 0
for number in [4, 7, 1, 8]:
    if number > 3:
        total += number
print(total)
```

- [ ] `20`
  > That would be the sum of all the numbers, but the 1 does not meet the condition.
- [x] `19`
  > 4 + 7 + 8 = 19, because only these three numbers are greater than 3.
- [ ] `3`
  > That many numbers meet the condition, but `total += number` adds up the values, not the hits.
- [ ] `8`
  > That is the last number that was added, but `total` collects all the values that fit.

> The accumulator starts at 0, and in every round in which the number is greater than 3 it is added: 4, then 11, then 19.

## Someone wants to add up the prices and gets `3.5`. Why? {#hcs-027}

```python static
for price in [2.5, 1.0, 3.5]:
    total = 0
    total += price
print(total)
```

- [ ] `print()` is in the wrong place and should be indented.
  > A value would then appear in every round, but each would only be the current price.
- [x] `total = 0` is in the body and resets the sum in every round.
  > Right: the line belongs before the loop, and then the result is `7.0`.
- [ ] `+=` does not calculate reliably with decimal numbers.
  > `+=` adds decimal numbers just like whole numbers.
- [ ] `+=` replaces the old value instead of increasing it.
  > `total += price` means `total = total + price`, so the old value stays in it, and it is reset by `total = 0`.

> An accumulator gets its starting value **before** the loop. In the body it is set back to 0 in every round, and at the end it holds only the last price.

## What does this program print? {#hcs-028}

```python static
number = 100
rounds = 0
while number > 10:
    number = number // 2
    rounds += 1
print(rounds, number)
```

- [x] `4 6`
  > 100 becomes 50, 25, 12 and 6, and at 6 the condition `number > 10` no longer holds.
- [ ] `3 12`
  > After three rounds `number` is 12 and thus still greater than 10, so one more round runs.
- [ ] `4 6.25`
  > `//` divides as whole numbers, so 25 becomes 12 and not 12.5.
- [ ] `5 3`
  > Before the fifth round `number` is already 6, and the loop ends.

> The condition is checked before every round: 100, 50, 25 and 12 are greater than 10, 6 no longer is. That gives four rounds and the final value 6.

## Which of these loops never stop if `count` is 0 beforehand? (Several answers may be correct.) {#hcs-029}

- [x] `while count < 3: print(count)`
  > The body only prints and never changes `count`.
- [ ] `while count < 3: count += 1`
  > After three rounds `count` equals 3, and the loop ends.
- [x] `while count < 3: count -= 1`
  > `count` keeps getting smaller and therefore stays below 3 for ever.
- [ ] `while count > 3: count += 1`
  > The condition is already false at the first check, so the body does not run a single time.

> A `while` loop ends only if its body eventually makes the condition false. If a program in the browser does not stop, the **Stop** button ends it.

## For which tasks is `while` the right loop? (Several answers may be correct.) {#hcs-030}

- [ ] Writing every item of a shopping list on a line of its own
  > The list sets the rounds, which is a case for `for`.
- [x] Asking for the age until a number above 0 is entered
  > How many attempts it takes only shows up while asking.
- [ ] Printing the numbers from 1 to 10
  > The number of rounds is fixed, and `for` with `range(1, 11)` is simpler.
- [x] Working out after how many years savings have doubled
  > The number of years is exactly what the loop is meant to find out.

> `for` fits when a list, a text or a fixed number of rounds sets the course, `while` when the end only shows up in the loop.

## What does this program print? {#hcs-031}

```python static
for number, item in enumerate(["milk", "bread"], start=1):
    print(number, item)
```

- [ ] `0 milk` and `1 bread`
  > That is how `enumerate()` counts without `start=1`, from 0 like the index.
- [x] `1 milk` and `2 bread`
  > With `start=1` the number begins at 1.
- [ ] `milk 1` and `bread 2`
  > `enumerate()` gives the number first and then the element, and that is also the order in which they stand in `print()`.
- [ ] `(1, 'milk')` and `(2, 'bread')`
  > The loop splits the pair into `number` and `item`, and `print()` outputs the two separated by a space.

> `enumerate()` gives the number and the element in every round, the loop shares them out to `number` and `item`, and `start=1` makes counting begin at 1.
