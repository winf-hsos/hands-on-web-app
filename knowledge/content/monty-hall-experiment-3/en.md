---
title: "Experiment 3: 100 games as a tibble"
summary: >-
  You explore a data set of 100 games as a tibble with the tidyverse, select columns and rows, add who won and find out how often staying and how often switching wins.
objectives:
  intro: "In this experiment you and your team explore a table in R and can then:"
  goals:
    - "read a CSV file as a tibble with `read_csv()` and determine rows, columns and column types with `glimpse()`"
    - "select columns and rows and sort a table with `select()`, `pull()`, `slice_head()` and `arrange()`"
    - "add a computed column with `mutate()`, filter by it with `filter()` and count per group with `count()` and `summarize()`"
    - "explain why you compare shares rather than counts when the groups differ in size"
translation_of: de
based_on: 2026-11-03
---

The data set [[lets-make-a-deal]] holds 100 games with exactly the facts you
just had as vectors, plus the first name of the player. The games were
generated for this exercise and do not come from a recording of the show. A
table whose columns are vectors of equal length and whose rows each describe
one game is called a **tibble** in the tidyverse. You work with the functions
of dplyr, which reshape a table step by step, joined by the pipe `|>`.

On your own computer you load the tidyverse and read the file with
`read_csv()`; your own games from the previous phase work the same way, from
the CSV file or with `readRDS()` from the RDS file.

```r static
library(tidyverse)
monty_hall <- read_csv("lets_make_a_deal.csv")
my_games <- as_tibble(readRDS("monty_hall_games.rds"))
```

In the boxes of this experiment dplyr is already loaded and the table is
there as `monty_hall`.

## First look

How many rows and columns does the table have, and what type is each column?

```r
monty_hall
```

> [!SOLUTION]
> ```r
> glimpse(monty_hall)
> ```
>
> The printed table already says it in its header: `100 × 5`, that is 100
> rows and five columns, and under every column name its type. A tibble shows
> only the first ten rows so that the output stays readable. `glimpse()` turns
> the table around and shows every column as a line with its type and first
> values: the first name and the decision as text (`<chr>`), the doors as
> numbers (`<int>` here, `<dbl>` after `read_csv()`).

## Columns and rows

Try each step in a run of its own:

1. Get the column `prize_door` once with `select()` and once with `pull()`.
   What is the difference?
2. Select the columns `prize_door` and `decision` together.
3. Show the first ten and the last ten rows.
4. Show all columns except `contestant`.
5. Sort the table by `prize_door`, ascending and descending.

```r
monty_hall |>
  select(prize_door)
```

> [!SOLUTION]
> ```r static
> monty_hall |> select(prize_door)              # 1.: a table with one column
> monty_hall |> pull(prize_door)                # 1.: a vector
> monty_hall |> select(prize_door, decision)    # 2.
> monty_hall |> slice_head(n = 10)              # 3.
> monty_hall |> slice_tail(n = 10)              # 3.
> monty_hall |> select(-contestant)             # 4.
> monty_hall |> arrange(prize_door)             # 5.
> monty_hall |> arrange(desc(prize_door))       # 5.
> ```
>
> Each of these functions takes a table and returns a table again; only
> `pull()` takes a column out as a vector, as you know it from the previous
> phase. A minus before the name leaves a column out.

## Who won?

1. Add a column `won` to the table with `mutate()`, following the same rule
   as in [[monty-hall-experiment-2|Experiment 2]].
2. Use `filter()` to create a new table that holds only the games won. How
   many of them were won by switching, how many by staying? `count()` counts
   the rows per value of a column.
3. How often does staying win in these 100 games, and how often switching?
   `group_by()` splits the table into groups, and `summarize()` condenses each
   group into one row.
4. Turn `decision` into a factor and look at its levels. What is that good
   for?

```r
monty_hall |>
  mutate(won = FALSE)
```

> [!SOLUTION]
> ```r
> monty_hall <- monty_hall |>
>   mutate(won = (decision == "stay" & prize_door == contestant_choice) |
>     (decision == "switch" & prize_door != contestant_choice))
>
> games_won <- monty_hall |>
>   filter(won)
> games_won |>
>   count(decision)
>
> monty_hall |>
>   group_by(decision) |>
>   summarize(games = n(), rate = mean(won))
> ```
>
> Of the 49 games won, 30 were won by staying and 19 by switching. That looks
> like an advantage for staying, but it is a trap: players stayed in 74 games
> and switched in only 26. Only the shares can be compared, and they show the
> opposite: staying wins 41 percent of the games, switching 73 percent.
>
> `mutate(decision = factor(decision))` turns the column into a factor with
> the levels `stay` and `switch`, and `glimpse()` then shows `<fct>`. A factor
> knows all allowed values; typos stand out, and tables and charts show the
> categories in a fixed order.
