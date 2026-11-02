---
title: "Challenge 3: Exploring 100 games"
summary: >-
  You explore a data set of 100 games as a data frame, access its columns and rows and find out how often staying and how often switching wins.
objectives:
  intro: "With this challenge you and your team explore a table in R and can then:"
  goals:
    - "determine the rows, columns and column types of a data frame"
    - "select columns and rows with `$` and square brackets and sort a table"
    - "add a computed column to a table and filter by it"
    - "explain why you compare shares instead of counts when groups differ in size"
translation_of: de
based_on: 2026-11-02
---

The data set [[lets-make-a-deal]] holds 100 games with exactly the facts you
just had as vectors, plus the contestant's first name. In R they come as a
**data frame**: a table whose columns are vectors of equal length and whose
rows describe one game each. The games were generated for this exercise
and are not a record of the show.

This is how the file is loaded; in the boxes of this challenge the table is
already loaded as `monty_hall`.

```r
monty_hall <- read.csv("lets_make_a_deal.csv")
head(monty_hall)
```

## A first look

How many rows and columns does the table have, and what type is each column?

```r
monty_hall
```

> [!SOLUTION]
> ```r
> str(monty_hall)
> ```
>
> `str()` shows everything at once: 100 rows (`obs.`), five columns
> (`variables`), three of them whole numbers (`int`) and two text (`chr`).
> On their own, `nrow()`, `ncol()` and `class(monty_hall$decision)` give the
> same.

## Columns and rows

Try each access in a run of its own:

1. Get the column `prize_door` once with `$` and once with square brackets.
   What is the difference between `monty_hall[, "prize_door"]` and
   `monty_hall["prize_door"]`?
2. Select the columns `prize_door` and `decision` together.
3. Show the first ten and the last ten rows.
4. Show all columns except the last one.
5. Sort the table by `prize_door`, ascending and descending.

```r
monty_hall$prize_door
```

> [!SOLUTION]
> ```r static
> monty_hall$prize_door                         # 1.: a vector
> monty_hall[, "prize_door"]                    # 1.: a vector as well
> monty_hall["prize_door"]                      # 1.: a table with one column
> monty_hall[, c("prize_door", "decision")]     # 2.
> monty_hall[1:10, ]                            # 3.: or head(monty_hall, 10)
> monty_hall[91:100, ]                          # 3.: or tail(monty_hall, 10)
> monty_hall[, -ncol(monty_hall)]               # 4.
> monty_hall[order(monty_hall$prize_door), ]    # 5.
> monty_hall[order(monty_hall$prize_door, decreasing = TRUE), ]
> ```
>
> In `table[rows, columns]` the part before the comma says which rows and the
> part after it which columns; an empty side means all of them. A single
> column with a comma gives a vector, without a comma a table. A negative
> number leaves the column out.

## Who won?

1. Add a column `won` to the table, by the same rule as in
   [[monty-hall-challenge-2|challenge 2]].
2. Create a new table with only the games that were won. How many of them
   were won by switching, how many by staying?
3. How often does staying win in these 100 games, and how often switching?
4. Turn `decision` into a factor and look at its levels. What is that good
   for?

```r
monty_hall$won <- FALSE
head(monty_hall)
```

> [!SOLUTION]
> ```r
> monty_hall$won <- (monty_hall$decision == "stay" & monty_hall$prize_door == monty_hall$contestant_choice) |
>   (monty_hall$decision == "switch" & monty_hall$prize_door != monty_hall$contestant_choice)
>
> games_won <- monty_hall[monty_hall$won, ]
> table(games_won$decision)
> ```
>
> Of the 49 games won, 30 were won by staying and 19 by switching. That looks
> like an advantage for staying, but it is a trap: players stayed in 74 games
> and switched in only 26. Only the shares are comparable, and they show the
> opposite:
>
> ```r static
> mean(monty_hall$won[monty_hall$decision == "stay"])     # 0.41
> mean(monty_hall$won[monty_hall$decision == "switch"])   # 0.73
> ```
>
> `factor(monty_hall$decision)` has the levels `stay` and `switch`. A factor
> knows all allowed values, so typos stand out, and tables and plots show the
> categories in a fixed order.
