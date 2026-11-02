---
title: "Challenge 5: The simulation as a table"
summary: >-
  You create a thousand rounds at once as a table with one row per round and compare their win rates with your own rounds and the 100 games.
objectives:
  intro: "With this challenge you and your team record a simulation as a table and can then:"
  goals:
    - "draw many random values at once with `sample(..., replace = TRUE)`"
    - "decide for each position of a vector separately with `ifelse()`"
    - "put vectors of equal length together into a table with `data.frame()`"
    - "count combinations of two columns with `table()` and compare win rates"
translation_of: de
based_on: 2026-11-02
---

A win rate is a single number; whoever wants to ask other questions later,
such as whether the door of the car matters, needs the single rounds. The
simulation should therefore give the same kind of table as the data set: one row
per round, one column per fact.

## A thousand rounds as a data frame

Create 1,000 rounds at once as vectors and put them together into a data
frame `simulation` with the columns `prize_door`, `contestant_choice`,
`decision` and `won`. `sample(1:3, n, replace = TRUE)` draws `n` doors at
once, and `ifelse()` decides for each position of a vector separately.

Think about this as you go: why do you not need the host's door at all for
`won`?

```r
n <- 1000
prize_door <- sample(1:3, n, replace = TRUE)
head(prize_door)
```

> [!SOLUTION]
> ```r
> n <- 1000
> prize_door <- sample(1:3, n, replace = TRUE)
> contestant_choice <- sample(1:3, n, replace = TRUE)
> decision <- sample(c("stay", "switch"), n, replace = TRUE)
> won <- ifelse(decision == "stay", prize_door == contestant_choice, prize_door != contestant_choice)
>
> simulation <- data.frame(prize_door, contestant_choice, decision, won)
> head(simulation)
> ```
>
> Whoever switches always lands on the door that is neither picked nor
> opened. If the first choice was wrong, that is the door with the car, since
> the host has opened the other wrong one. Switching therefore wins exactly
> when the first choice was wrong, and that is settled before the host opens
> anything.

## Who wins how often?

Count in `simulation` how often staying and switching won and lost, and
compute both win rates. Compare them with your own rounds and with the 100 games.
Keep working in the box of the previous task for this, since every box starts
without the values of the others.

> [!SOLUTION]
> ```r
> n <- 1000
> prize_door <- sample(1:3, n, replace = TRUE)
> contestant_choice <- sample(1:3, n, replace = TRUE)
> decision <- sample(c("stay", "switch"), n, replace = TRUE)
> won <- ifelse(decision == "stay", prize_door == contestant_choice, prize_door != contestant_choice)
> simulation <- data.frame(prize_door, contestant_choice, decision, won)
>
> table(simulation$decision, simulation$won)
> ```
>
> `table()` with two vectors counts every combination. The rates come from
> `mean(simulation$won[simulation$decision == "stay"])` and the same with
> `"switch"`: about 0.33 and 0.67. The 100 games, with 0.41 and 0.73, are close to
> that, your ten rounds probably further off; the fewer rounds, the more
> chance is in the result.
