# Vectors and data frames in R

The text to the slides, in their order. Frame numbers count every build-up
step, as in the PDF.

**A type case (frame 3).** A printer's type case looks like a mess of tiny
compartments, and yet a typesetter finds every letter blind, because each
column holds one kind of thing and every compartment has its place. R keeps
data in the same way: a table is a row of columns, and each column holds
values of exactly one kind. Once this picture is in place, most of what R does
with data stops being a surprise. The sentence to take home unfolds it: a data
frame is a list of equally long vectors, and every vector holds values of one
type.

## Part 1: from a value to a table

**Four shapes of data (frames 5 to 8).** A single value, a scalar, is rare in
data analysis. Almost everything comes as many values of the same kind, a
vector. A matrix puts several vectors of one type side by side into a block,
which suits numbers but not a table in which one column holds numbers and
another words. That is what the data frame is for: every column may have its
own type. The matrix appears only here; exploratory analysis hardly needs it.

**One game, four facts (frame 9).** The example for the whole deck is the game
with three doors, known as the Monty Hall problem. A car stands behind one
door and goats behind the other two. The contestant picks a door, the host,
who knows where the car is, opens another door with a goat behind it, and the
contestant either stays with the first pick or switches to the last closed
door. Every game can be written down as four facts: where the car was
(`prize_door`), which door was picked first (`contestant_choice`), which door
the host opened (`monty_opens`) and whether the contestant stayed or switched
(`decision`). Whether staying or switching is better is the question of the
project, and the data will answer it.

**Play a few rounds (frame 10).** The game runs on the site
([hands-on-computer-science.de/ds/en/items/monty-hall-game](https://hands-on-computer-science.de/ds/en/items/monty-hall-game/)).
After a few rounds it shows the rounds played as four lines of R code, one
per fact, each with as many values as rounds were played. Those four lines
are already the data.

**Rounds as vectors (frame 11).** Ten rounds, written the way the game writes
them:

```r
prize_door <- c(2, 1, 3, 3, 1, 2, 2, 3, 1, 1)
contestant_choice <- c(2, 3, 1, 1, 1, 1, 3, 2, 2, 1)
monty_opens <- c(1, 2, 2, 2, 3, 3, 1, 1, 3, 2)
decision <- c("stay", "switch", "stay", "switch",
              "switch", "stay", "switch", "stay",
              "switch", "stay")
```

The function `c()`, for combine, puts values together into a vector, and the
arrow gives the vector a name. Each line is one fact, each position one round.

## Part 2: vectors

**The same position, the same round (frames 13 to 15).** Position 1 in all
four vectors is round 1: the car was behind door 2, door 2 was picked, the
host opened door 1 and the contestant stayed. Position 8 is round 8. Nothing
in R ties the first value of `prize_door` to the first value of `decision`;
only the position does. That works as long as all four vectors have the same
length and the same order, and the data frame is the structure that
guarantees exactly that.

**One vector, one type (frame 16).** *Hands-On Programming with R* calls
these atomic vectors: the smallest building block of data in R, and always of
one type. Numbers you type are `double`, whole numbers with an `L` or whole
numbers read from a file are `integer`, text in quotes is `character`, and
`TRUE` and `FALSE` are `logical`. The four colours stay with these types for
the rest of the deck. There are two more types, complex and raw, which data
analysis hardly needs. `typeof()` names the type; `class()` says what a
vector is meant to be, for example numeric or factor.

**Asking a vector (frame 17).** Many functions take a whole vector and return
one answer about it:

```r
length(prize_door)    # 10
typeof(decision)      # "character"
mean(prize_door)      # 1.9
table(decision)       # stay 5, switch 5
```

`sum()`, `mean()`, `median()`, `min()`, `max()`, `range()`, `sd()`, `sort()`,
`unique()` and `table()` are the ones used most often. The mean of the prize
doors shows that a function computes whatever it is asked: door numbers are
labels, and their mean means nothing.

**When types meet (frames 18 to 20).** A number and a logical value become two
numbers, because `TRUE` counts as 1: `c(1, TRUE)` is a double. As soon as one
text value joins in, everything becomes text: `c(1, TRUE, "stay")` holds
`"1"`, `"TRUE"` and `"stay"`. The order behind it is logical, then double,
then character, and R always picks the most general type that holds every
value. This rule explains many surprises later: one stray text value in a
column of numbers, a dash or "n/a", and the whole column becomes text, so
`mean()` no longer works. When a column has the wrong type, look for the one
value that pulled it there.

**Quick quiz (frames 21 to 23).** `typeof(c(3, 1, "2"))` returns
`"character"`: the text wins, and R converts without a word.

**Comparing whole vectors (frames 24 and 25).** Was the first pick already
right? `prize_door == contestant_choice` compares the two vectors position by
position and returns one answer per position, a logical vector of the same
length. Arithmetic and comparisons work on whole vectors at once, so no loop
is needed.

**Counting with TRUE and FALSE (frame 26).**

```r
first_pick_right <- prize_door == contestant_choice
sum(first_pick_right)     # 3
mean(first_pick_right)    # 0.3
```

R counts `TRUE` as 1 and `FALSE` as 0, so `sum()` counts and `mean()` gives
the share: in three of ten rounds the first pick was right. *R for Data
Science* devotes a chapter to logical vectors because almost every question
about data passes through one.

**Picking values by position (frames 27 to 30).** Square brackets pick values
by their position: `decision[1]` is the first value, `decision[-1]` everything
except the first, `decision[2:4]` the second to the fourth and
`decision[c(1, 3)]` the first and the third. The result is again a vector. R
starts counting at 1.

**Picking values by a condition (frames 31 and 32).** A logical vector in
square brackets keeps exactly the positions that are `TRUE`.
`first_pick_right[decision == "stay"]` keeps the five rounds in which the
contestant stayed; two of them were won, because whoever stays wins exactly
when the first pick was right. This is how the project question gets
answered: the wins of the rounds with staying against those with switching.

**When a value is missing (frame 33).** A value nobody wrote down is not 0; it
is missing, and R marks it with `NA`, not available. Anything computed with it
is unknown too, so `mean(c(2, NA, 3))` is `NA`; `na.rm = TRUE` leaves missing
values out and gives 2.5. `is.na()` finds them, and the decision whether to
leave them out belongs to the analyst. Three relatives look similar but mean
something else: `NULL` is nothing at all, `NaN` the result of an impossible
calculation such as 0 / 0, and `Inf` infinity, for example 1 / 0.

**Factors (frame 34).**

```r
decision_factor <- factor(
  decision,
  levels = c("stay", "switch")
)
levels(decision_factor)    # "stay" "switch"
```

A factor suits a variable with a fixed set of values. It knows its levels and
their order, which tables and plots respect; a value outside the levels
becomes `NA` instead of a silent new category; and `table()` counts a level
even if it does not occur. The package forcats in the tidyverse reorders and
combines levels.

**A vector in one sentence (frame 35).** A vector is a row of values of one
type, and position i belongs to observation i.

## Part 3: data frames

**Vectors become a table (frames 37 to 39).**
`games <- data.frame(prize_door, contestant_choice, monty_opens, decision)`
puts the four vectors side by side; their names become the header and R
numbers the rows. One row is one game, one column one vector. A data frame is
a list of equally long vectors, and every vector holds values of one type:
all columns have the same length, row 8 is round 8 in every column, and
different columns may have different types.

**Quick quiz (frames 40 to 42).** Every vector can be a column, whatever its
type; a data frame only demands that all columns have the same length.

**100 games from a file (frame 43).** The project's data set holds 100 games
with the name of the contestant as a fifth column:

```r
monty_hall <- read.csv("lets_make_a_deal.csv")
str(monty_hall)
```

`str()` shows 100 observations of 5 variables, and for every column its type
and first values: the doors came in as `int`, the names and decisions as
`chr`. It is the first thing to run on new data, because a column with the
wrong type shows up here first.

**A vector or a table? (frames 44 to 46).** `monty_hall$decision` takes the
column out as a vector, without its name. `monty_hall["decision"]` with single
brackets keeps a table with one column and its header. Both look almost the
same on screen, but `mean()` wants the vector and `head()` works on the
table; an error about a "list" or a "data.frame" usually comes from mixing
them up.

**Rows and columns (frames 47 to 50).** A data frame has two directions, so
square brackets take two places, rows first, then columns, and an empty place
means all of them: `monty_hall[1, ]` is the first row, `monty_hall[, 2]` the
second column as a vector, `monty_hall[1:10, c("prize_door", "decision")]`
the first ten rows of two columns, and `nrow()` and `ncol()` count rows (100)
and columns (5).

**A new column from the others (frame 51).**

```r
monty_hall$won <-
  (monty_hall$decision == "stay" &
     monty_hall$prize_door == monty_hall$contestant_choice) |
  (monty_hall$decision == "switch" &
     monty_hall$prize_door != monty_hall$contestant_choice)
```

Whether a game was won is not in the file, but it follows from three columns:
whoever stays wins if the first pick was the prize door, and whoever switches
wins if it was not. A column is a vector, so everything from part 2 works on
it. With dplyr the rule becomes much shorter.

**Data frame and tibble (frame 52).** Typing the name of a data frame prints
all 100 rows, and what remains on screen is the end, with the header long
gone. A tibble, the data frame of the tidyverse (`as_tibble(monty_hall)`),
says how many rows and columns there are, shows the type of every column and
prints only the first ten rows. *R for Data Science* uses tibbles throughout.
For everything in this deck a tibble behaves like a data frame; it prints
more helpfully, keeps a table a table when one column is selected with single
brackets, and never turns text into factors.

**Tidy data (frame 53).** After *R for Data Science*, chapter "Data tidying":
a table is tidy when each variable is a column, each observation is a row and
each value is a cell. The game table is tidy, one row per game and one column
per fact. Data from the wild often is not, for example with one column per
year or two facts in one cell, and then it has to be reshaped first. The
reward is that every column is a vector and every tool fits it.

**Closing (frame 54).** A data frame is a list of equally long vectors, and
every vector holds values of one type. The picture to remember is the type
case: compartments in columns, each column one kind of thing, all columns
equally long. To read on: *Hands-On Programming with R*, chapter
[R Objects](https://rstudio-education.github.io/hopr/r-objects.html), and
*R for Data Science*, chapters
[Data tidying](https://r4ds.hadley.nz/data-tidy.html),
[Logical vectors](https://r4ds.hadley.nz/logicals.html),
[Factors](https://r4ds.hadley.nz/factors.html) and
[Missing values](https://r4ds.hadley.nz/missing-values.html).
