# Types of variables

The text to the slides, in their order. Frame numbers count every build-up
step, as in the PDF.

**Four measuring tools (frame 3).** A ruler, a thermometer, a kitchen scale
and a tally sheet all produce numbers, but the numbers do not allow the same
questions. A board of two metres is twice as long as one of one metre, while
ten degrees Celsius are not twice as warm as five, and the strokes on a tally
sheet only count how often something happened. The sentence to take home: the
scale of a variable decides what you may compute with it, and R's type should
say so.

## Part 1: observations and variables

**One row per game, one column per fact (frames 5 to 8).** The table the room
builds after playing the game has one row per game and one column per fact
about it: the game number, the door with the car, the door picked first, the
door the host opened and the decision. One row is an observation, which
Döring (2023, p. 577) calls a case; one column is a variable, here the door
with the car; and where a row meets a column there is exactly one value, here
the decision in game 4. Cases in the rows, variables in the columns and one
value per cell is the order that *R for Data Science* calls tidy and Döring
calls a data matrix.

**A variable varies (frame 9).** Döring (p. 225) defines a variable as a
feature that can take different values. The decision is a variable, because it
is stay in one game and switch in the next. The number of doors is three in
every game, so it is a constant, which belongs in the description of the study
and needs no column. In passing, two more words: variables that can be
observed directly, such as the door that was opened, are called manifest, and
variables that can only be reached through indicators, such as how willing
someone is to take a risk, are called latent.

## Part 2: four scales

**Types of variables (frames 11 to 13).** Variables fall into three branches.
Categorical variables sort observations into groups, numerical variables
measure an amount, and qualitative variables hold free text that has to be
read before it can be counted. The scales of measurement, which Döring calls
Skalenniveaus (chapter 8.4), divide the first two branches further: a
categorical variable is nominal if its groups have no order and ordinal if
they do, and a numerical variable is on an interval scale if only differences
are meaningful and on a ratio scale if it also has a true zero. One example
each: the decision in the game (`"stay"`, `"switch"`), the share of organic
food in the milk survey (`organic_share`, 1 to 5), a year, a price, and a free
comment. Döring also calls interval and ratio together metric. Some books
split numerical variables into continuous values and counts instead, which
matters for the types of R in part 3.

**What each scale allows (frames 14 to 17).** Nominal values may only be
compared for equal or not equal. Ordinal values add an order: an organic share
of 4 is more than one of 2, but by how much is unknown. Interval values add
equal distances, so the ten years from 1990 to 2000 are as long as those from
2000 to 2010. Ratio values add a true zero, and only then is "twice as much"
meaningful: a milk at 2 euros costs twice as much as one at 1 euro. Each scale
keeps everything the one above it allows and adds one more question you may
ask. Döring adds a useful rule: you may always step down a scale, for example
turn prices into the groups cheap and expensive, but never up.

**Door 3 is not three times door 1 (frame 18).** The doors carry numbers, but
the numbers are names, and left, middle and right would do as well. R does not
know that and computes the mean of the prize doors from five rounds,
`mean(prize_door)`, without complaint: 2. The sentence that the average car
stands behind door 2 is nonsense. Döring warns of exactly this: statistics
software computes meaningless means whenever categories are coded as numbers.
A number used as a name is still a name, and its mean means nothing. A coding
plan that records what each number stands for is the defence, and in R so is
the type of the column.

**Ten degrees are not twice as warm as five (frames 19 and 20).** Two
thermometers show 5 and 10 degrees Celsius, and 10 looks like twice 5; two
prices are 1 and 2 euros. When both change their unit while the things
themselves stay the same, the temperatures become 41 and 50 degrees
Fahrenheit, and nothing is twice anything any more, whereas the prices become
100 and 200 cents, and the second is still twice the first. Zero degrees
Celsius is just where water freezes, a point someone picked, while zero cents
is truly nothing. Ratios need a true zero, which a price has and a temperature
in Celsius does not. In practice the difference rarely matters, because few
methods need a ratio scale, which is why Döring often treats both as metric.

**Is a rating scale ordinal or interval? (frame 21).** The milk survey asks for
the share of organic food when shopping, from 1 (hardly any) to 5 (almost
all). Strictly, only the order is known, so the scale is ordinal and the
median is the right summary. Many researchers treat rating scales with five or
more roughly equal steps as interval and report the mean, and Döring describes
this as common practice. For the 30 people in the sample on the platform the
median is 2 and the mean 2.37, and both tell the same story. If in doubt,
compute both, and say which one you report.

```r
median(survey$organic_share)    # 2
mean(survey$organic_share)      # 2.366667
```

## Part 3: scales in R

**Every scale has its type in R (frames 23 to 26).** R knows nothing about
scales of measurement, but it has data types, written here the way a tibble
prints them. Nominal values are text (`<chr>`), logical values for yes and no
(`<lgl>`) or a factor (`<fct>`); ordinal values are an ordered factor
(`<ord>`). Numerical values are doubles (`<dbl>`) or integers (`<int>`), the
natural type for counts and whole numbers such as years. Free text stays text.
The colours are those of the types in the deck on vectors and data frames,
with the factor added in red. A factor is how R remembers that a column is
categorical.

**Telling R what a column is (frame 27).** One line per scale: the decision
becomes a factor with the levels stay and switch, which makes it nominal, and
the organic share becomes an ordered factor with the levels 1 to 5, which
makes it ordinal. Numerical columns stay as they are. From then on tables and
plots sort the levels in their order, a typo becomes `NA` instead of a new
category, and `mean()` on a factor returns `NA` with a warning instead of a
meaningless number.

```r
library(dplyr)

monty_hall <- monty_hall |>
  mutate(decision = factor(decision, levels = c("stay", "switch")))

survey <- survey |>
  mutate(organic_share = factor(organic_share, levels = 1:5, ordered = TRUE))
```

**What you may compute (frames 28 to 31).** For a nominal variable you count
how often each value occurs (`count()`) and show it as a bar chart. An ordinal
variable adds the median and quantiles (`median()`, `quantile()`) and bars in
the order of the scale. An interval variable adds the mean and the standard
deviation (`mean()`, `sd()`) and a histogram or a boxplot. A ratio variable
adds ratios, such as a new price divided by an old one. The scale tells you
which function makes sense, while R will run all of them anyway.

**Back to our table (frame 32).** The table from the start, *What should we
measure?*, gets a type for every column. The decision becomes a factor; the
doors can be numbers or a factor, and both are defensible: as numbers they can
be compared, as in `prize_door == contestant_choice`, as a factor they are
more honest. Either is fine as long as the choice is justified and nobody
reports the mean door. Saved as RDS, the table keeps its types, which a CSV
file would lose, and `str()` shows them after reading it in R:

```r
str(readRDS("monty_hall_rounds.rds"))
```

**The sentence to take home (frames 33 and 34).** The scale of a variable
decides what you may compute with it, and R's type should say so. To read on:
Döring (2023), *Forschungsmethoden und Evaluation in den Sozial- und
Humanwissenschaften*, chapter 8.4
([doi.org/10.1007/978-3-662-64762-2](https://doi.org/10.1007/978-3-662-64762-2)),
and *R for Data Science*, chapter
[Factors](https://r4ds.hadley.nz/factors.html).
