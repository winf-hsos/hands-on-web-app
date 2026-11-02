---
title: "Challenge 4: The game as a function"
summary: >-
  You write a function that plays one round of the game and let R use it to play ten thousand rounds staying and switching.
objectives:
  intro: "With this challenge you and your team rebuild the game in R and can then:"
  goals:
    - "draw at random with `sample()` and avoid its pitfall with a single number"
    - "find the doors that are still possible with `setdiff()`"
    - "write a function that plays one round of an experiment"
    - "repeat an experiment many times with `replicate()` and analyse the results"
translation_of: de
based_on: 2026-11-02
---

A hundred games are a start, but no proof yet. R can play the game itself, as
often as you like: the car goes behind a random door, the player picks a
random door, and the host opens a door that is neither picked nor hiding the
car.

For chance there is `sample()`. `sample(1:3, 1)` draws one of the numbers 1
to 3. There is one pitfall, and it is exactly at the host: if only one door
is left for him, say door 3, then `sample(3, 1)` does not draw the 3 but a
number from `1:3`, because R reads a single number as "from 1 to here".

```r
sample(3, 1)
```

The safe way to draw from a vector `doors` is therefore
`doors[sample(length(doors), 1)]`: it draws a position, not a value.

## One round

Write a function `play_round()` that plays one round. It takes `"stay"` or
`"switch"` and returns `TRUE` if the round is won. `setdiff(a, b)` gives the
values of `a` that are not in `b`; with it you find the doors the host may
open and the door one switches to.

```r
play_round <- function(decision) {
  doors <- 1:3
  prize_door <- sample(doors, 1)
  contestant_choice <- sample(doors, 1)
  # Which doors may the host open, and which one does he open?
  # Which door does the player end up with?
  # Did the player win?
  FALSE # replace this with your result
}

play_round("switch")
```

> [!SOLUTION]
> ```r
> play_round <- function(decision) {
>   doors <- 1:3
>   prize_door <- sample(doors, 1)
>   contestant_choice <- sample(doors, 1)
>   options <- setdiff(doors, c(prize_door, contestant_choice))
>   monty_opens <- options[sample(length(options), 1)]
>   if (decision == "switch") {
>     final_choice <- setdiff(doors, c(contestant_choice, monty_opens))
>   } else {
>     final_choice <- contestant_choice
>   }
>   final_choice == prize_door
> }
>
> play_round("switch")
> ```
>
> If the first choice was right, the host has two doors left, otherwise only
> one; that is exactly why the safe draw from above is needed.

## Ten thousand rounds

With your function, play 10,000 rounds switching and 10,000 staying. How
often does each strategy win? `replicate(n, expression)` evaluates an
expression `n` times and collects the results in a vector; a `for` loop would
work too, but takes more lines.

```r
# Copy your function play_round() from "One round" here.
replicate(5, sample(1:3, 1))
```

> [!SOLUTION]
> ```r
> play_round <- function(decision) {
>   doors <- 1:3
>   prize_door <- sample(doors, 1)
>   contestant_choice <- sample(doors, 1)
>   options <- setdiff(doors, c(prize_door, contestant_choice))
>   monty_opens <- options[sample(length(options), 1)]
>   if (decision == "switch") {
>     final_choice <- setdiff(doors, c(contestant_choice, monty_opens))
>   } else {
>     final_choice <- contestant_choice
>   }
>   final_choice == prize_door
> }
>
> c(
>   stay = mean(replicate(10000, play_round("stay"))),
>   switch = mean(replicate(10000, play_round("switch")))
> )
> ```
>
> Staying wins about a third of the rounds, switching about two thirds. The
> numbers vary a little from run to run, but hardly any more at 10,000
> rounds.
