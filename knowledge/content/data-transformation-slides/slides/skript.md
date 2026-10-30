# Data transformation with R and dplyr

The text to the slides, in their order. Frame numbers count every build-up
step, as in the PDF.

**A box of bricks (frame 3).** Nobody builds straight out of a box of building
bricks in which everything lies mixed up. First come the bricks that are
needed, sorted and grouped by colour or size, and only then is something put
together. Data works the same way: hardly any question can be read off the raw
data, but a handful of basic operations, such as picking, sorting, grouping and
summarizing, turns any table into the one that holds the answer.

## Part 1: why transform

**A question for the survey (frame 5).** The survey on milk and organic food
has 30 rows, one per respondent, and eleven columns. The question is whether
vegetarians buy more organic food than others. Everything needed is in two
columns, `diet` and `organic_share`, but the answer only appears once we take
the right rows, split them by diet and compute an average per group. That is
data transformation: making one table out of another, without collecting new
data.

**A table in, a table out (frames 6 to 10).** A table goes into a
transformation, but the table itself stays where it is, because the
transformation works on a copy. What comes out is again a table, usually a
smaller one, and since it is a table it can go into the next transformation,
which again returns a table, and so on as often as the question needs.
Everything else rests on this property.

**Six basic operations (frames 11 to 18).** Six operations cover almost every
preparation, and each answers a question. One by one, each acts on a copy of a
small table: selecting columns asks which columns are needed, and two columns
go; filtering rows asks who the question is about, and two rows go; sorting
asks what comes first, and the rows take the order of their numbers; computing
new columns asks what can be derived from what is there, and a new column is
filled; summarizing asks what is typical and how many there are, and many rows
become one; grouping asks how subgroups differ, and every row is marked with
its group while nothing else changes. Grouping is the odd one out, because on
its own it changes nothing; it makes the next operation work per group. In
dplyr each operation is one verb: `select()`, `filter()`, `arrange()`,
`mutate()`, `summarize()` and `group_by()`.

**The same ideas everywhere (frame 19).** The operations are not an invention
of R. SQL has them as `SELECT`, `WHERE`, `ORDER BY` and `GROUP BY`, pandas in
Python has them as methods of a data frame, and in Excel they are filters,
sorting and pivot tables. Whoever has understood the operations finds their
way around these tools quickly, because only the names change.

## Part 2: the verbs

**The rules of dplyr (frames 21 to 24).** dplyr comes with the tidyverse, which
`library(tidyverse)` loads together with the other packages used here. dplyr
calls its functions verbs, because each is named after what it does, and three
rules hold for all of them, shown on `filter(survey, age >= 50)`: the first
argument is always a table, here `survey`; columns go by their bare name
without quotes and without `$`, here `age`; and what comes out is a new table,
while `survey` stays as it was. Whoever wants to keep the result has to assign
it to a name.

**Six rows of the survey (frame 25).** To watch the verbs at work, the slides
take the first six rows and four columns of the survey: `id`, `age`, `diet`
and `organic_share`, the share of organic food when shopping from 1 (hardly
any) to 5 (almost all). The table stays at the same place on the following
slides, so each change is visible.

**`select()` keeps columns (frames 26 to 28).** From here on every verb is
written with the pipe `|>`, which puts the table into the first slot of the
verb: `survey |> select(id, diet)` is short for `select(survey, id, diet)`.
Part 3 shows why this helps. `select()` names the columns to keep; the other
two disappear and `diet` moves up to `id`. All six rows remain, because
`select()` never touches rows.

**Some ways to name columns (frame 29).** There are many ways to say which
columns are wanted, and five come up often: by name (`id, diet`), as a range
in the order of the table (`id:diet`), excluded with a minus sign
(`-organic_share` keeps all but this one), by a pattern in the name
(`starts_with("organic")`) and by type (`where(is.numeric)` takes every column
that holds numbers). The help page `?select` lists more helpers, such as
`ends_with()` and `contains()`.

**`filter()` keeps rows (frames 30 to 32).** `survey |> filter(age >= 50)`
checks the condition row by row: 56 yes, 55 yes, 47 no, 32 no, 74 yes, 48 no.
The rows with a no disappear and three remain. The columns stay as they were.

**Conditions (frame 33).** `==` asks whether two values are equal, while a
single `=` would assign, and R complains. `!=` means not equal, `&` combines
two conditions that must both hold, `|` two of which one is enough, `%in%`
asks whether a value is one of several, and `is.na()` asks whether a value is
missing. The exclamation mark turns a condition round, so
`filter(!is.na(organic_share))` keeps every row that has an organic share.

**`arrange()` sorts rows (frames 34 and 35).** `survey |> arrange(desc(age))`
sorts from the oldest to the youngest: 74, 56, 55, 48, 47, 32. Nothing is
added or removed; only the order changes.

**Ascending, descending, several columns (frame 36).** Without `desc()` the
order is ascending. With several columns the second one only decides where the
first one is tied, so `arrange(diet, desc(age))` sorts by diet and, within
each diet, from the oldest to the youngest.

**`mutate()` computes new columns (frames 37 to 39).**
`survey |> mutate(decade = age %/% 10 * 10)` adds a column computed from the
others. `%/%` is integer division, so 56 becomes 50, the decade. The new
column is filled row by row from the age in the same row, and the number of
rows stays the same.

**One row in, one row out (frame 40).** `mutate()` computes in every row on its
own. It can create several columns at once, and a column may use one computed
earlier in the same call. `organic_fan = organic_share >= 4` is a logical
column: `TRUE` for everyone who buys mostly organic food.

**`summarize()` turns many rows into one (frames 41 to 43).**
`survey |> summarize(n = n(), mean_age = mean(age))` counts the six rows and
turns the six ages into one number, 52. What remains is a table with a single
row and only the columns that were computed.

**Summary functions (frame 44).** Inside `summarize()` go functions that turn
many values into one: `n()`, `mean()`, `median()`, `min()`, `max()` and `sd()`.
A single missing value makes the mean missing as well, because R does not
know what that value would have been; `na.rm = TRUE` leaves missing values
out.

**`group_by()` splits into groups (frames 45 to 47).**
`survey |> group_by(diet)` marks every row with its diet, and R notes above the
table `# Groups: diet [3]`. Not a single value changes. Pulling the groups
apart only makes them visible; R keeps the rows where they are, and the
grouping matters only to the next verb.

**One row per group (frames 48 and 49).**
`survey |> group_by(diet) |> summarize(n = n(), mean_age = mean(age))` puts two
verbs in a row. `group_by()` alone changes nothing visible; it tells
`summarize()` to work per group: one flexitarian aged 74, four omnivores with a
mean age of 47.5 and one vegetarian aged 48. The groups come out in
alphabetical order.

**Two quick checks (frames 50 to 55).** Respondents from Bavaria are rows, and
keeping some rows is `filter()`, with `state == "Bayern"`. The average age per
diet takes two verbs, `group_by()` and `summarize()`: the second alone gives one
average for everybody, the first alone changes nothing visible.

## Part 3: the pipe

**Nested calls are read from the inside out (frames 57 to 61).** Without the
pipe every verb takes the table as its first argument, so four steps (keep
everyone aged 40 or older, group by diet, count, sort by the count) end up
inside each other. Nested, R runs them from the inside out, so `filter()`
comes first and `arrange()` last, although it stands at the top. The
arguments also stand far from their function: `desc(n)` at the bottom belongs
to `arrange()` at the top.

**Intermediate tables (frame 62).** Giving every step a name reads from top to
bottom, but leaves four tables behind, three of which nobody needs again, and
every name is a chance to pick the wrong one.

**The pipe passes the table on (frame 63).** The pipe `|>` takes what stands on
its left and puts it into the first slot of the function on its right:
`x |> f(y)` is the same as `f(x, y)`. This is why the first-argument rule of
dplyr matters, because every verb takes a table first, so a table can be piped
into every verb. Read `|>` as "and then". Older code uses `%>%`, which does
the same; ctrl+shift+m types the pipe in RStudio and Positron.

**A pipeline (frames 64 to 68).** The same four steps as a pipeline. `filter()`
drops the 32-year-old and five rows remain. `group_by()` gives the rows the
colours of their groups and changes nothing else. `summarize()` makes one row
per group with its count: three omnivores, one flexitarian, one vegetarian.
`arrange()` sorts by the count, so the omnivores come first.

**The same, as you would write it (frames 69 to 74).**

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

**Plan in words, then translate (frames 75 to 80).** Back to the question
whether vegetarians buy more organic food. Before writing code, the steps are
planned in words: take the survey, keep the rows with an organic share, split
by diet, average and count per group, sort by the average. Each line then
becomes one verb.

**The answer (frames 81 and 82).**

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

**Six verbs and a pipe (frame 83).** `select()` chooses columns, `filter()`
rows, `arrange()` the order, `mutate()` adds columns, `summarize()` makes one
row, `group_by()` makes the next verb work per group, and `|>` chains them
with "and then".

**The chart of bricks (frame 84).** The same bricks, now sorted by colour and
built into a small bar chart: a handful of operations in the right order
turned the jumble into something that answers a question. The learning path
"Data transformation with R and dplyr" on Hands-on Data Science practises the
same verbs with R boxes that run in the browser.
