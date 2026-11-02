---
title: "Experiment 2: Your games as vectors"
summary: >-
  You play the game with three doors on the computer, record your games as four vectors in R and answer with one line each how often the first choice was right and how often staying and switching win.
objectives:
  intro: "In this experiment you and your team bring your games into R and can then:"
  goals:
    - "record the games of an experiment as vectors of equal length"
    - "build a logical vector such as `won` from comparisons"
    - "compute shares from a logical vector with `mean()`"
    - "use square brackets to pick only the positions of a vector that meet a condition"
translation_of: de
based_on: 2026-11-03
---

In the first phase you decided what you record of every game: behind which
door the car stood, which door was chosen first, which one the host opened,
and whether the player stayed or switched. Now these four facts get their
form in R. Many games can be written down as four vectors, one per fact,
where the first position always belongs to the first game, the second to the
second, and so on. [[data-representation-slides|The slides]] use exactly
these four facts to show how R holds vectors.

## Play

Play at least twenty games in [[monty-hall-game|the game with three doors]]
and take turns. Do not always decide the same way, but stay in about half of
the games and switch in the other half. The game records every round and on
request shows them as R code, one vector per fact. Also save your games as
CSV and as RDS; you will need the files in the next phase.

## Analyse

Below are ten example games. Replace them with your own: copy the R code from
the game and paste it in place of the four lines.

**Task:** Answer with R, each question with one line under the vectors:

1. How often was the first choice already right, as a share of all games?
2. Which games were won? Create a vector `won` of `TRUE` or `FALSE` for
   this. A game is won by whoever stayed and was right at once, or switched
   and was wrong at first.
3. What percentage of all games were won?
4. In what percentage of the games did the player stay?
5. How often does staying win, and how often switching?

```r
prize_door <- c(2, 1, 3, 3, 1, 2, 2, 3, 1, 1)
contestant_choice <- c(2, 3, 1, 1, 1, 1, 3, 2, 2, 1)
monty_opens <- c(1, 2, 2, 2, 3, 3, 1, 1, 3, 2)
decision <- c("stay", "switch", "stay", "switch", "switch", "stay", "switch", "stay", "switch", "stay")

length(prize_door)
```

> [!SOLUTION]
> ```r static
> mean(prize_door == contestant_choice)        # 1.: 0.3
>
> won <- (decision == "stay" & prize_door == contestant_choice) |
>   (decision == "switch" & prize_door != contestant_choice)
> mean(won)                                    # 3.: 0.6
> mean(decision == "stay")                     # 4.: 0.5
> mean(won[decision == "stay"])                # 5.: 0.4
> mean(won[decision == "switch"])              # 5.: 0.8
> ```
>
> The `mean()` of a logical vector is the share of `TRUE`, because R counts
> `TRUE` as 1 and `FALSE` as 0. `won[decision == "stay"]` picks from `won`
> only the positions where the player stayed. Ten or twenty games, however,
> are too few to conclude anything; that is why more data come next.
