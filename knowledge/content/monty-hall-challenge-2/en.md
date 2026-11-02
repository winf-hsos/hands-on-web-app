---
title: "Challenge 2: Your rounds in R"
summary: >-
  You write your rounds as four vectors in R and answer with one line each how often the first choice was right and how often staying and switching win.
objectives:
  intro: "With this challenge you and your team bring your rounds into R and can then:"
  goals:
    - "record the rounds of an experiment as vectors of equal length"
    - "build a logical vector such as `won` from comparisons"
    - "compute shares from a logical vector with `mean()`"
    - "use square brackets to pick only the positions of a vector that meet a condition"
translation_of: de
based_on: 2026-11-02
---

A round consists of four facts: behind which door the car stood, which door
was chosen first, which one the host opened, and whether the player stayed or
switched. Many rounds can therefore be written down as four vectors, one per
fact, where the first position always belongs to the first round, the second
to the second, and so on.
[[data-representation-slides|The slides]] use exactly these four facts to show
how R holds vectors and tables, and they reach into the next phase.

Below are ten example rounds. Replace them with your own: copy the R code
under [[monty-hall-game|the game with three doors]] and paste it in place of the four lines.

**Task:** Answer with R, each question with one line under the vectors:

1. How often was the first choice already right, as a share of all rounds?
2. Which rounds were won? Create a vector `won` of `TRUE` or `FALSE` for
   this. A round is won by whoever stayed and was right at once, or switched
   and was wrong at first.
3. What percentage of all rounds were won?
4. In what percentage of the rounds did the player stay?
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
> only the positions where the player stayed. Ten rounds, however, are too few
> to conclude anything; that is why more data come next.
