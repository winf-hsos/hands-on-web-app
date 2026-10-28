---
title: The Monty Hall Problem
summary: >-
  Switch or stay? With a famous guessing game you learn to record an
  experiment as data, rebuild it in R and play it so often that the data give
  an answer hardly anyone expects.
translation_of: de
based_on: 2026-10-28
---

On a game show there are three doors. Behind one waits a car, behind each of
the other two a goat. You choose a door, and the host, who knows where the
car is, then opens one of the other two, always one with a goat. Then he asks
whether you stay with your door or switch to the other closed one.

Most people are sure that it makes no difference, since two doors are left.
Whether that is true you will not find out by thinking in this project, but
with data: you play yourselves, record every round, analyse 100 games from
the show and let R repeat the game until the answer no longer depends on
chance.

Along the way you learn what every data analysis needs: how to write down an
experiment so that it can be analysed, what such data look like in R as
vectors and as a table, and how a few lines of code run an experiment as
often as you like.

## Play the game {#play}

What the game feels like is shown in a clip from "Geh aufs Ganze" from 1994,
the German version of "Let's Make a Deal":
[the video on YouTube](https://www.youtube.com/watch?v=hXlsPGlAqbM&t=109s).
The host there is Jörg Draeger; the principle is the same.

Here you can play yourselves. Every round is recorded below as R code, which
you need in the next phase. The rounds stay stored in this browser until you
choose "Start over".

```monty-hall
```

### Challenge 1: Guess first, then play {#challenge-1}

Before you play the first round, write down what you expect: does staying
win more often, does switching, or does it not matter?

Then play at least ten rounds, sometimes staying and sometimes switching. If
you prefer playing at a table: in pairs with three cups and a coin it works
just as well, one person hosts and knows where the coin is. Then note for
each round where the prize was, which cup the player chose first, which one
the host lifted and whether the player switched.

## Rounds as vectors {#vectors}

A round consists of four facts: behind which door the car stood, which door
was chosen first, which one the host opened, and whether the player stayed or
switched. Many rounds can therefore be written down as four vectors, one per
fact, where the first position always belongs to the first round, the second
to the second, and so on.

Below are ten example rounds. Replace them with your own: copy the R code
under the game from phase 1 and paste it in place of the four lines.

### Challenge 2: Your rounds in R {#challenge-2}

Answer with R, each question with one line under the vectors:

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

## The data from the show {#data-frame}

The data set [[lets-make-a-deal]] holds 100 games with exactly the facts you
just had as vectors, plus the contestant's first name. In R they come as a
**data frame**: a table whose columns are vectors of equal length and whose
rows describe one game each.

This is how the file is loaded; in the boxes of this phase the table is
already loaded as `monty_hall`.

```r
monty_hall <- read.csv("lets_make_a_deal.csv")
head(monty_hall)
```

### Challenge 3: A first look {#challenge-3}

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

### Challenge 4: Columns and rows {#challenge-4}

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

### Challenge 5: Who won? {#challenge-5}

1. Add a column `won` to the table, by the same rule as in challenge 2.
2. Create a new table with only the games that were won. How many of them
   were won by switching, how many by staying?
3. How often does staying win in the show, and how often switching?
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

## Rebuild the game in R {#simulate}

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

### Challenge 6: One round {#challenge-6}

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

### Challenge 7: Ten thousand rounds {#challenge-7}

With your function, play 10,000 rounds switching and 10,000 staying. How
often does each strategy win? `replicate(n, expression)` evaluates an
expression `n` times and collects the results in a vector; a `for` loop would
work too, but takes more lines.

```r
# Copy your function play_round() from challenge 6 here.
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

## Every round a row {#collect}

A win rate is a single number; whoever wants to ask other questions later,
such as whether the door of the car matters, needs the single rounds. The
simulation should therefore give the same kind of table as the show: one row
per round, one column per fact.

### Challenge 8: The simulation as a table {#challenge-8}

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

### Challenge 9: Who wins how often? {#challenge-9}

Count in `simulation` how often staying and switching won and lost, and
compute both win rates. Compare them with your own rounds and with the show.
Keep working in the box of challenge 8 for this, since every box starts
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
> `"switch"`: about 0.33 and 0.67. The show, with 0.41 and 0.73, is close to
> that, your ten rounds probably further off; the fewer rounds, the more
> chance is in the result.

## The answer {#resolve}

Three sources say the same: your own rounds (with a lot of chance), the show
and the simulation. Whoever switches wins twice as often.

The reason lies in the first choice. It hits the car in one case out of
three, and exactly then staying wins. In the other two cases out of three
the car is behind one of the other two doors, and since the host knows where
it is, he opens the other one. The door one can switch to is then always the
one with the car. The host's knowledge makes the difference: if he opened a
door at random, sometimes the one with the car, the two remaining doors
would indeed be equally good.

### Challenge 10: A plot for the answer {#challenge-10}

Show the win rate per decision in the show as a bar chart. With dplyr,
`monty_hall` gets the column `won` and is summarised per decision; ggplot2
draws the bars from it, layer by layer.

```r
monty_hall |>
  mutate(won = (decision == "stay") == (prize_door == contestant_choice))
```

> [!SOLUTION]
> ```r
> monty_hall |>
>   mutate(won = (decision == "stay") == (prize_door == contestant_choice)) |>
>   group_by(decision) |>
>   summarise(win_rate = mean(won)) |>
>   ggplot() +
>   aes(x = decision, y = win_rate) +
>   geom_col()
> ```
>
> `(decision == "stay") == (prize_door == contestant_choice)` is a shorter
> form of the rule: whoever's decision fits the first choice has won, that is
> staying after a right choice and switching after a wrong one.

### Challenge 11: What kind of question was that? {#challenge-11}

Assign your questions to the six types from [[analytic-questions]]. "How
often did those who switched win in the show?" is descriptive: it only
describes the 100 games. Which question does the simulation answer, and
which the explanation above of why switching is better?

> [!SOLUTION]
> The simulation generalises beyond the observed games: it says what happens
> in very many games played by these rules, and so resembles an inferential
> question. The explanation via the host's knowledge is mechanistic: it says
> how the result comes about. For a game of chance with fixed rules this can
> exceptionally be settled completely; with real data one usually stays with
> the first types.

## What you need

This browser is enough for everything: the game and R run on the page. If you
prefer working on your own computer, take [[positron]] and download the
[[lets-make-a-deal|data set]]. For further reading, chapters 5 to 7 of
[[hands-on-programming-with-r]] fit well, on objects, the notation with
square brackets and modifying values.
