---
title: "Experiment 4: The game as a simulation"
summary: >-
  You rebuild the game in R in two steps: first one game as a function, then a simulation that produces a thousand games as a data set, which you analyse and download.
objectives:
  intro: "In this experiment you rebuild the game in R and can then:"
  goals:
    - "draw at random with `sample()` and avoid the pitfall with a single number"
    - "find the doors still in question with `setdiff()`"
    - "write a function that plays one game and returns it as a row of a table"
    - "repeat an experiment many times with `lapply()` and `bind_rows()`, so that a data set with one row per game emerges"
    - "save a data set with `write.csv()` and `saveRDS()`"
translation_of: de
based_on: 2026-11-03
---

A hundred games are a start, but no proof yet. R can play the game itself,
as often as you like: the car goes behind a random door, the player picks a
random door, and the host opens a door that is neither chosen nor hides the
car. You build this in two steps: first a single game as a function, then a
simulation that calls this function a thousand times and turns the results
into a data set that looks like [[lets-make-a-deal]], only ten times as
large.

## Step 1: One game as a function

For chance there is `sample()`. `sample(1:3, 1)` draws one of the numbers 1
to 3. There is one pitfall, and it is exactly at the host: if only one door
is left for him, say door 3, then `sample(3, 1)` does not draw the 3 but a
number from `1:3`, because R reads a single number as "from 1 up to here".

```r
sample(3, 1)
```

That is why you draw safely from a vector `doors` with
`doors[sample(length(doors), 1)]`: what is drawn is a position, not a value.

Write a function `play_game()` that plays one game. It gets `"stay"` or
`"switch"` and returns the game as a table with one row, with the same
columns as the 100 games plus `won`. `setdiff(a, b)` gives the values of `a`
that are not in `b`; with it you find the doors the host may open and the
door you switch to.

```r
play_game <- function(decision) {
  doors <- 1:3
  prize_door <- sample(doors, 1)
  contestant_choice <- sample(doors, 1)
  # Which doors may the host open, and which one does he open?
  # Which door does the player end up with?
  # Has the player won?
  monty_opens <- NA # replace this with your door
  won <- FALSE # and this with your result
  tibble(prize_door, contestant_choice, monty_opens, decision, won)
}

play_game("switch")
```

> [!SOLUTION]
> ```r
> play_game <- function(decision) {
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
>   won <- final_choice == prize_door
>   tibble(prize_door, contestant_choice, monty_opens, decision, won)
> }
>
> play_game("switch")
> ```
>
> If the first choice was right, the host has two doors left, otherwise only
> one; that is exactly why the safe draw from above is needed. `tibble()`
> turns the values into a row whose columns are named like the names.

## Step 2: The simulation as a data set

Write a function `simulate_games(n)` that plays `n` games and returns them as
one data set with one row per game. The decision should be random, stay or
switch. Two tools help: `lapply(x, f)` calls `f` for every value of `x` and
collects the results in a list, and `bind_rows()` stacks a list of tables
into one. Simulate 1,000 games with it and compute how often staying and how
often switching wins.

```r
# Copy your function play_game() from step 1 here.

decisions <- sample(c("stay", "switch"), 5, replace = TRUE)
decisions
```

> [!SOLUTION]
> ```r
> play_game <- function(decision) {
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
>   won <- final_choice == prize_door
>   tibble(prize_door, contestant_choice, monty_opens, decision, won)
> }
>
> simulate_games <- function(n) {
>   decisions <- sample(c("stay", "switch"), n, replace = TRUE)
>   bind_rows(lapply(decisions, play_game))
> }
>
> simulation <- simulate_games(1000)
> simulation |>
>   group_by(decision) |>
>   summarize(games = n(), rate = mean(won))
> ```
>
> Staying wins in about a third of the games, switching in about two thirds.
> The numbers vary a little from run to run, but with 1,000 games only by a
> few percentage points. The 100 games, at 41 and 73 percent, are close to
> that, your own games probably further away; the fewer the games, the more
> chance there is in the result.

Think about it: why does `won` in the end not depend on which door the host
opens?

> [!SOLUTION]
> Whoever switches always lands on the door that is neither chosen nor
> opened. If the first choice was wrong, that is the door with the car,
> because the host has opened the other wrong one. So switching wins exactly
> when the first choice was wrong, and that is decided before the host opens
> anything. Since the first choice is wrong in two of three games, switching
> wins in two of three games.

## Take the data set with you

Save your simulation as CSV and as RDS. The box then offers both files for
download; on your own computer they are in the working directory, and there
`write_csv()` from the tidyverse works instead of `write.csv()` too.

```r
# Copy play_game() and simulate_games() here.

simulation <- simulate_games(1000)
write.csv(simulation, "monty_hall_simulation.csv", row.names = FALSE)
saveRDS(simulation, "monty_hall_simulation.rds")
```

Which of the two files keeps that `won` is a logical value and `decision`
text? Read both back in and compare them with `glimpse()`.

> [!SOLUTION]
> The RDS file holds the table the way R has it in memory, with all types;
> `readRDS()` returns exactly the same tibble. The CSV file is plain text that
> any program can read; `read_csv()` guesses the type of each column anew
> when reading. For these columns that works, for a factor the order of its
> levels would be lost.
