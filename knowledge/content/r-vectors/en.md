---
title: Vectors
summary: >-
  In R almost everything is a vector, a series of values: how to build them,
  calculate with them, pick out single values, compare them and count with
  the result, using the game with three doors.
objectives:
  intro: "This lesson introduces vectors, the form in which R stores almost every value, and afterwards you can:"
  goals:
    - "build a vector with `c()` and create a sequence of numbers with `1:10`"
    - "calculate with a vector and combine two vectors of the same length position by position"
    - "summarise a vector into a single value with `sum()`, `mean()`, `min()`, `max()` and `length()`"
    - "pick out single positions with square brackets, counted from 1, or leave one out with a minus"
    - "compare vectors with `==`, `!=`, `<`, `<=`, `>` and `>=`, combine conditions with `&`, `|` and `!`, and check against a list with `%in%`"
    - "count the hits of a comparison with `sum()`, compute their share with `mean()` and select positions with a condition in square brackets"
translation_of: de
based_on: 2026-11-03
---

In the game with three doors a car stands behind one of three doors, the
player picks a door, the host opens another one with a goat, and the player
stays with the choice or switches. Whoever records many games has a series of
values for each fact: the doors with the car, the first choices, the
decisions. In R such a series is called a **vector**, and almost everything
in R is one. A single number is a vector too, just with one value; hence the
`[1]` before every output.

## Building vectors

With `c()` (for *combine*) you put values together into a vector, here the
doors behind which the car stood in five games:

```r
prize_door <- c(2, 1, 3, 3, 1)
prize_door
```

There is a shortcut for sequences of numbers: `1:5` is the vector of the
numbers from 1 to 5, such as the numbers of the five games.

Five games give several vectors of the same length, one per fact. The first
position in every vector belongs to the first game, the second to the second,
and so on. Suppose we had also asked the five players their age:

```r
prize_door <- c(2, 1, 3, 3, 1)
contestant_choice <- c(2, 3, 1, 1, 1)
decision <- c("stay", "switch", "stay", "switch", "switch")
age <- c(56, 55, 47, 32, 74)
```

## Calculating with vectors

When you calculate with a vector, R calculates with every single value, here
the age of the five players one year later:

```r
age <- c(56, 55, 47, 32, 74)
age + 1
```

R combines two vectors of the same length position by position, the first
value with the first, the second with the second. If five players played
several times, this gives each one's share of games won:

```r
played <- c(3, 1, 2, 4, 2)
won <- c(2, 0, 1, 3, 1)
won / played
```

That is exactly what makes R so convenient for data: a column of a table is
a vector, and a calculation applies to all rows at once, without a loop. The
door numbers, on the other hand, are not for calculating, since they are
names and not amounts.

## Functions for vectors

Many functions summarise a vector into a single value, for example `sum()`,
`mean()`, `min()`, `max()` and `length()`:

```r
age <- c(56, 55, 47, 32, 74)
mean(age)
```

Try the others in the box too by replacing `mean` with another name.
`length(prize_door)` tells you how many games are recorded.

## Picking out single values

Square brackets give you access to positions of a vector. Counting starts at
1, so `prize_door[2]` is the door with the car in the second game:

```r
prize_door <- c(2, 1, 3, 3, 1)
prize_door[2]
```

A vector of positions fits into the brackets too, for example
`prize_door[c(1, 3)]` for the first and the third game, or `prize_door[2:4]`
for games 2 to 4. A minus leaves a position out: `prize_door[-1]` is
everything except the first game.

## Comparing

Was the first choice already right? Questions like this start with a
comparison. Like calculating, a comparison applies to each value on its own
and gives `TRUE` or `FALSE` for every position:

| Sign | Meaning |
|---|---|
| `==` | equal |
| `!=` | not equal |
| `<`, `<=` | less, less or equal |
| `>`, `>=` | greater, greater or equal |

```r
prize_door <- c(2, 1, 3, 3, 1)
contestant_choice <- c(2, 3, 1, 1, 1)
prize_door == contestant_choice
```

In the first and the fifth game the first choice was right. Equality is
checked with **two** equals signs; a single `=` is an assignment like the
arrow `<-`. You compare text the same way, in quotes: `decision == "switch"`.
Numbers can also be compared by size, as in `age > 50`.

## Combining conditions

`&` means "and", `|` means "or", and `!` reverses a logical value. Whoever
stayed and was right at once won by staying:

```r
prize_door <- c(2, 1, 3, 3, 1)
contestant_choice <- c(2, 3, 1, 1, 1)
decision <- c("stay", "switch", "stay", "switch", "switch")
decision == "stay" & prize_door == contestant_choice
```

Only the first game meets both conditions. With `|` it would be all games
for which at least one of the two holds.

## Checking against a list

When a value is to belong to a selection, a chain of `|` quickly gets long.
`%in%` checks for every value whether it occurs in another vector, for example
whether a player is one of those who played several times:

```r
contestant <- c("Mia", "Jonas", "Lea", "Mia", "Tom")
contestant %in% c("Mia", "Tom")
```

## Counting and shares

When you calculate with logical values, `TRUE` counts as 1 and `FALSE` as 0.
So `sum()` of a comparison is the number of hits and `mean()` their share:

```r
prize_door <- c(2, 1, 3, 3, 1)
contestant_choice <- c(2, 3, 1, 1, 1)
sum(prize_door == contestant_choice)
```

Replace `sum` with `mean` in the box: 0.4 means that in two of five games the
first choice was right. You will write these two lines all the time when
analysing data.

## Selecting with a condition

A comparison also fits into the square brackets. Then R picks out only the
positions where it gives `TRUE`, here the age of those who switched:

```r
age <- c(56, 55, 47, 32, 74)
decision <- c("stay", "switch", "stay", "switch", "switch")
age[decision == "switch"]
```

That is how two groups can be compared: `mean(age[decision == "switch"])`
against `mean(age[decision == "stay"])`.

## Key points

- `c()` builds a vector, `1:10` a sequence of numbers; the positions of
  several vectors belong together when they describe the same game.
- Calculations and comparisons apply to every value, two vectors are combined
  position by position; equal is `==`.
- `&` is "and", `|` is "or", `!` reverses; `%in%` checks against a list.
- `sum()`, `mean()`, `length()` and their relatives summarise a vector;
  `sum()` of a comparison counts the hits, `mean()` gives their share.
- `[ ]` picks out positions, counted from 1, or with a condition exactly
  those for which it holds.
