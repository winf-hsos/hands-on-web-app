# Data transformation with R and dplyr

The text to the slides, in their order. Frame numbers count every build-up
step, as in the PDF.

**A board in the kitchen (frame 3).** No cook serves the groceries the way they
come from the market. On the left of the board lie carrots with soil on them,
leeks and onions; on the right stand small bowls with what a cook sets out
before cooking. Cooking consists of a few techniques, such as cutting, sorting
out, ordering and putting together, and every recipe combines them
differently. Data works the same way: hardly any question can be read off the
raw data, but a handful of basic operations turns any table into the one that
holds the answer.

## Part 1: why transform

**A question for the survey (frame 5).** The survey on milk and organic food
has 30 rows, one per respondent, and eleven columns. The question is whether
vegetarians buy more organic food than others. Everything needed is in two
columns, `diet` and `organic_share`, but the answer only appears once we take
the right rows, split them by diet and compute an average per group. That is
data transformation: making one table out of another, without collecting new
data.

**A table in, a table out (frames 6 to 8).** A table goes into a
transformation, and what comes out is again a table, usually a smaller one.
Everything else rests on this property: because the output is a table again,
it can be the input of the next transformation.

**Six basic operations (frames 9 to 11).** Six operations cover almost every
preparation, and each answers a question. Selecting columns asks which columns
are needed, filtering rows asks who the question is about, sorting asks what
comes first, computing new columns asks what can be derived from what is
there, summarizing asks what is typical and how many there are, and grouping
asks how subgroups differ. Grouping is the odd one out, because on its own it
changes nothing; it makes the next operation work per group.

**The same ideas everywhere (frame 12).** The operations are not an invention
of R. SQL has them as `SELECT`, `WHERE`, `ORDER BY` and `GROUP BY`, pandas in
Python has them as methods of a data frame, and in Excel they are filters,
sorting and pivot tables. Whoever has understood the operations finds their
way around these tools quickly, because only the names change.

## Part 2: the verbs

**The rules of dplyr (frames 14 to 17).** The package dplyr calls its functions
verbs, because each is named after what it does. Three rules hold for all of
them: the first argument is always a table, columns go by their bare name
without quotes and without `$`, and the result is a new table while the
original stays as it was. Whoever wants to keep the result has to assign it to
a name.

**Six rows of the survey (frame 18).** To watch the verbs at work, the slides
take the first six rows and four columns of the survey: `id`, `age`, `diet`
and `organic_share`, the share of organic food when shopping from 1 (hardly
any) to 5 (almost all). The table stays at the same place on the following
slides, so each change is visible.

**`select()` keeps columns (frames 19 to 21).** `select(survey, id, diet)`
names the columns to keep; the other two disappear and `diet` moves up to
`id`. All six rows remain, because `select()` never touches rows.

**Three ways to name columns (frame 22).** Columns can be named one by one,
excluded with a minus sign (`-organic_share` keeps all but this one), or
chosen by a pattern in their name: `starts_with("organic")` takes every column
whose name begins with *organic*.

**`filter()` keeps rows (frames 23 to 25).** `filter(survey, age >= 50)` checks
the condition row by row: 56 yes, 55 yes, 47 no, 32 no, 74 yes, 48 no. The rows
with a no disappear and three remain. The columns stay as they were.

**Conditions (frame 26).** `==` asks whether two values are equal, while a
single `=` would assign, and R complains. `!=` means not equal, `&` combines
two conditions that must both hold, `|` two of which one is enough, `%in%`
asks whether a value is one of several, and `is.na()` asks whether a value is
missing. The exclamation mark turns a condition round, so
`filter(survey, !is.na(organic_share))` keeps every row that has an organic
share.

**`arrange()` sorts rows (frames 27 and 28).** `arrange(survey, desc(age))`
sorts from the oldest to the youngest: 74, 56, 55, 48, 47, 32. Nothing is
added or removed; only the order changes.

**Ascending, descending, several columns (frame 29).** Without `desc()` the
order is ascending. With several columns the second one only decides where the
first one is tied, so `arrange(survey, diet, desc(age))` sorts by diet and,
within each diet, from the oldest to the youngest.

**`mutate()` computes new columns (frames 30 to 32).**
`mutate(survey, decade = age %/% 10 * 10)` adds a column computed from the
others. `%/%` is integer division, so 56 becomes 50, the decade. The new
column is filled row by row from the age in the same row, and the number of
rows stays the same.

**One row in, one row out (frame 33).** `mutate()` computes in every row on its
own. It can create several columns at once, and a column may use one computed
earlier in the same call. `organic_fan = organic_share >= 4` is a logical
column: `TRUE` for everyone who buys mostly organic food.

**`summarize()` turns many rows into one (frames 34 to 36).**
`summarize(survey, n = n(), mean_age = mean(age))` counts the six rows and
turns the six ages into one number, 52. What remains is a table with a single
row and only the columns that were computed.

**Summary functions (frame 37).** Inside `summarize()` go functions that turn
many values into one: `n()`, `mean()`, `median()`, `min()`, `max()` and `sd()`.
A single missing value makes the mean missing as well, because R does not
know what that value would have been; `na.rm = TRUE` leaves missing values
out.

**`group_by()` splits into groups (frames 38 to 40).** `group_by(survey, diet)`
marks every row with its diet, and R notes above the table
`# Groups: diet [3]`. Not a single value changes. Pulling the groups apart
only makes them visible; R keeps the rows where they are, and the grouping
matters only to the next verb.

**One row per group (frames 41 and 42).** After `group_by()`, `summarize()`
works per group: one flexitarian aged 74, four omnivores with a mean age of
47.5 and one vegetarian aged 48. The groups come out in alphabetical order.

**Two verbs at once (frame 43).** Written in R, the previous slide is one verb
inside the other: `summarize(group_by(survey, diet), n = n(), mean_age =
mean(age))`. `group_by()` alone changes nothing visible; it tells the next verb
to work per group. With two verbs nesting is still readable, with four it is
not, and that is what the pipe is for.

**Two quick checks (frames 44 to 49).** Respondents from Bavaria are rows, and
keeping some rows is `filter()`, with `state == "Bayern"`. The average age per
diet takes two verbs, `group_by()` and `summarize()`: the second alone gives one
average for everybody, the first alone changes nothing visible.

## Part 3: the pipe

**Nested calls are read from the inside out (frames 51 to 55).** Four steps:
keep everyone aged 40 or older, group by diet, count, sort by the count.
Nested, R runs them from the inside out, so `filter()` comes first and
`arrange()` last, although it stands at the top. The arguments also stand far
from their function: `desc(n)` at the bottom belongs to `arrange()` at the
top.

**Intermediate tables (frame 56).** Giving every step a name reads from top to
bottom, but leaves four tables behind, three of which nobody needs again, and
every name is a chance to pick the wrong one.

**The pipe passes the table on (frame 57).** The pipe `|>` takes what stands on
its left and puts it into the first slot of the function on its right:
`x |> f(y)` is the same as `f(x, y)`. This is why the first-argument rule of
dplyr matters, because every verb takes a table first, so a table can be piped
into every verb. Read `|>` as "and then". Older code uses `%>%`, which does
the same; ctrl+shift+m types the pipe in RStudio and Positron.

**A pipeline (frames 58 to 62).** The same four steps as a pipeline. `filter()`
drops the 32-year-old and five rows remain. `group_by()` gives the rows the
colours of their groups and changes nothing else. `summarize()` makes one row
per group with its count: three omnivores, one flexitarian, one vegetarian.
`arrange()` sorts by the count, so the omnivores come first.

**The same, as you would write it (frames 63 to 68).**

```r
survey |>
  filter(age >= 40) |>
  group_by(diet) |>
  summarize(n = n()) |>
  arrange(desc(n))
```

One step per line, the pipe at the end of each line. Read aloud: take the
survey, and then keep everyone aged 40 or older, and then group by diet, and
then count, and then sort by the count. The code reads in the order in which
it runs.

**Plan in words, then translate (frames 69 to 74).** Back to the question
whether vegetarians buy more organic food. Before writing code, the steps are
planned in words: take the survey, keep the rows with an organic share, split
by diet, average and count per group, sort by the average. Each line then
becomes one verb.

**The answer (frames 75 and 76).**

```r
survey |>
  filter(!is.na(organic_share)) |>
  group_by(diet) |>
  summarize(
    n = n(),
    mean_organic = mean(organic_share)
  ) |>
  arrange(desc(mean_organic))
```

On the 30 rows of the excerpt the single vegan comes first with 5, the
flexitarians follow with 2.89 (9 people), the omnivores with 2.12 (17), the
vegetarians with 1.5 (2) and the single pescetarian with 1. With two
vegetarians this answers nothing; the data set to download has 2,811
respondents, and there the question can be answered. Copy the code into an R
box on the site or into Positron, run it, and then change one line, for
example `median()` instead of `mean()`.

**Six verbs and a pipe (frame 77).** `select()` chooses columns, `filter()`
rows, `arrange()` the order, `mutate()` adds columns, `summarize()` makes one
row, `group_by()` makes the next verb work per group, and `|>` chains them
with "and then".

**The plate (frame 78).** The same board, now with the finished dish and the
bowls empty: a handful of techniques in the right order. The learning path
"Data transformation with R and dplyr" on Hands-on Data Science practises the
same verbs with R boxes that run in the browser.
