---
title: Showing survey data
summary: >-
  Surveys consist of item batteries, rating scales, yes/no questions and
  groups of very different sizes. Using the compact milk survey, this lesson
  shows how to compare several items in one chart, stack rating scales around
  the neutral middle and show shares in a way that keeps the number of cases
  visible.
objectives:
  intro: "In this lesson you learn to show typical survey data with ggplot2, and afterwards you can:"
  goals:
    - "bring several items on the same scale into the long form with `pivot_longer()` and show them as bars stacked to 100 %, sorted by agreement"
    - "turn the numeric codes of a rating scale into ordered levels with readable names and show them with a diverging colour scale"
    - "draw a rating scale as diverging bars around the neutral middle and say what happens to the neutral answers"
    - "show several yes/no questions as shares instead of counts and explain why their shares do not add up to 100 %"
    - "compare the shares of groups and write the number of cases of each group into the labels"
translation_of: de
based_on: 2026-11-16
---

Questionnaires rarely ask about just one thing. The compact milk survey
holds four statements that almost all of the 2,809 respondents rated on the
same scale from −2 (does not apply at all) to +2 (applies completely), two
questions that only know yes or no, and groups such as the diets, one of
which has 36 people and another 1,826. How to show a single rating scale as
bars you know from [[data-visualisation-basics]]; here the point is to
compare several questions in one chart without losing numbers that are
needed to understand it.

All code boxes run in the browser with the table `survey`, and you can
change and rerun each of them.

## An item battery at a glance

An item battery is a series of statements with the same answer scale. The
survey has four:

| Column | Statement |
|---|---|
| `eco_conscious` | "I would call myself eco-conscious." |
| `prefers_organic` | "When buying food, I prefer organic products." |
| `loves_meat` | "I love meals with meat." |
| `loves_cooking` | "I love cooking or baking." |

### First into the long form

For ggplot2 the four items are in an awkward place, namely in four columns
side by side, while a chart with one bar per item needs one column that says
which item it is and a second one with the answer. `pivot_longer()` from
[[tidy-data]] rearranges the table this way: all columns except `id` move
below each other, their name goes into the new column `item` and their value
into the column `value`.

```r
survey |>
  select(id, eco_conscious, prefers_organic, loves_meat, loves_cooking) |>
  pivot_longer(-id, names_to = "item", values_to = "value")
```

The 2,809 rows become 11,236, four per person, since every person now
appears once per item in the table.

### Stacked to 100 %

With the long table, every item becomes a bar and every answer level a
colour. So that the legend shows words instead of numbers, `factor()` with
`levels` and `labels` turns the codes −2 to +2 into five ordered levels with
names. `position_fill(reverse = TRUE)` stacks every bar to 100 % and puts
disagreement on the left, since without `reverse` the first level would sit
at the right end.

```r
survey |>
  select(id, eco_conscious, prefers_organic, loves_meat, loves_cooking) |>
  pivot_longer(-id, names_to = "item", values_to = "value") |>
  filter(!is.na(value)) |>
  mutate(answer = factor(value, levels = c(-2, -1, 0, 1, 2), labels = c(
    "strongly disagree", "disagree", "neutral", "agree", "strongly agree"
  ))) |>
  ggplot() +
  aes(y = item, fill = answer) +
  geom_bar(position = position_fill(reverse = TRUE)) +
  scale_fill_brewer(palette = "PuOr") +
  labs(x = "Share of respondents", y = NULL, fill = NULL)
```

`scale_fill_brewer(palette = "PuOr")` chooses a diverging colour scale: from
a light grey in the middle it becomes ever stronger orange towards one side
and ever stronger purple towards the other, so that disagreement and
agreement can be told apart by colour and their strength by saturation. A
scale from red to green would be the obvious choice, but many people with a
colour vision deficiency confuse red and green, and the two colours easily
read as wrong and right. `filter(!is.na(value))` leaves out the missing
answers, between 5 and 11 per item.

### Sorted by agreement

In the last chart the items are in alphabetical order, and to find out which
statement most people agree with, you have to compare the borders of the
purple areas across all bars. Sorted by the share of agreement, this turns
into a ranking. `value > 0` is `TRUE` for every agreeing answer, so its mean
is the share of agreement, and `fct_reorder()` orders the items by it:

```r
survey |>
  select(id, eco_conscious, prefers_organic, loves_meat, loves_cooking) |>
  pivot_longer(-id, names_to = "item", values_to = "value") |>
  filter(!is.na(value)) |>
  mutate(
    item = fct_reorder(item, value > 0, .fun = mean),
    answer = factor(value, levels = c(-2, -1, 0, 1, 2), labels = c(
      "strongly disagree", "disagree", "neutral", "agree", "strongly agree"
    ))
  ) |>
  ggplot() +
  aes(y = item, fill = answer) +
  geom_bar(position = position_fill(reverse = TRUE)) +
  scale_fill_brewer(palette = "PuOr") +
  labs(x = "Share of respondents", y = NULL, fill = NULL)
```

Now the love of meat stands at the top with 59 % agreement and the
preference for organic at the bottom with 38 %, while eco-consciousness
(53 %) and cooking (51 %) lie almost level in between. You never sort the
answer levels by frequency, since they are ordinal and keep the order of the
scale; only the items are sorted.

## Rating scales diverging

In bars stacked to 100 %, only the two outermost levels start at a common
line, at the left and at the right edge, while all others start somewhere
inside the bar. How much agreement one item gets compared to another is
therefore hard to read. Diverging bars stack the answers around a zero line
in the middle: disagreement goes to the left, agreement to the right, and
both sides can be compared directly from that line.

### Shares per item and answer

For this chart you calculate the shares yourself and draw them with
`geom_col()`. The box counts every answer level per item and divides by the
number of answers to that item; `.by = item` makes sure that `sum(n)` is
calculated per item.

```r
survey |>
  select(id, eco_conscious, prefers_organic, loves_meat, loves_cooking) |>
  pivot_longer(-id, names_to = "item", values_to = "value") |>
  filter(!is.na(value)) |>
  mutate(item = fct_reorder(item, value > 0, .fun = mean)) |>
  count(item, value) |>
  mutate(share = n / sum(n) * 100, .by = item)
```

### Stacked around the middle

The trick lies in one line: the shares of disagreement get a minus sign, and
ggplot2 stacks negative values from zero to the left and positive ones to
the right. `group = -abs(value)` sets the order of stacking, so that the
moderate answers lie at the middle and the strong ones outside, and
`scale_x_continuous(labels = abs)` writes positive percentages on the left
of the axis again.

```r
survey |>
  select(id, eco_conscious, prefers_organic, loves_meat, loves_cooking) |>
  pivot_longer(-id, names_to = "item", values_to = "value") |>
  filter(!is.na(value)) |>
  mutate(item = fct_reorder(item, value > 0, .fun = mean)) |>
  count(item, value) |>
  mutate(share = n / sum(n) * 100, .by = item) |>
  filter(value != 0) |>
  mutate(
    share = if_else(value < 0, -share, share),
    answer = factor(value, levels = c(-2, -1, 1, 2), labels = c(
      "strongly disagree", "disagree", "agree", "strongly agree"
    ))
  ) |>
  ggplot() +
  aes(x = share, y = item, fill = answer, group = -abs(value)) +
  geom_col() +
  geom_vline(xintercept = 0) +
  scale_x_continuous(labels = abs) +
  scale_fill_brewer(palette = "PuOr") +
  labs(
    x = "Share of respondents (%)", y = NULL, fill = NULL,
    caption = "Not shown: neutral answers, 26.2 to 34.5 % per item"
  )
```

Now you notice what was lost in the stacked bar: for the preference for
organic, 33 % disagreement stand against 38 % agreement, so opinions are
split almost evenly, while for the three other items agreement is more than
twice as large as disagreement, for eco-consciousness even four times as
large.

> [!IMPORTANT]
> The neutral middle belongs to neither side. This chart leaves it out and
> states its share in the caption, since shares of 26.2 to 34.5 % are too large
> to keep quiet about. The other common solution splits the neutral answers
> half to the left and half to the right; for that, every neutral row has to
> appear twice in the table, which makes the code considerably longer.

## Several yes/no questions

The survey asks where people usually shop, and `shops_discounter` and
`shops_organic` hold `TRUE` or `FALSE`. The mean of `TRUE` and `FALSE` is the
share of `TRUE`, since R counts `TRUE` as 1 and `FALSE` as 0. With the long
form, one `summarise()` is therefore enough for both questions, and `n()`
counts how many people answered:

```r
survey |>
  select(id, shops_discounter, shops_organic) |>
  pivot_longer(-id, names_to = "question", values_to = "yes") |>
  summarise(share = mean(yes) * 100, n = n(), .by = question)
```

The chart then shows the share instead of the count, 73 % instead of 2,064
and 13 % instead of 358. A count is only understood by someone who knows the
total, whereas a share says at once which part of the respondents is meant
and stays comparable even when a question was asked of only some of them.
The number of cases goes into the label, the percentage onto the bar with
`geom_text()`:

```r
survey |>
  select(id, shops_discounter, shops_organic) |>
  pivot_longer(-id, names_to = "question", values_to = "yes") |>
  summarise(share = mean(yes) * 100, n = n(), .by = question) |>
  mutate(question = paste0(question, " (n = ", n, ")")) |>
  ggplot() +
  aes(x = share, y = question, label = paste0(round(share), " %")) +
  geom_col() +
  geom_text(hjust = -0.2) +
  scale_x_continuous(limits = c(0, 100)) +
  labs(x = "Share who answered yes (%)", y = NULL)
```

The two shares add up to 86 % and not to 100 %, since someone who shops at a
discounter can also go to an organic store: 228 people ticked both and 615
neither. Several yes/no questions therefore belong in separate bars and
never in one stacked bar or a pie chart, both of which would claim that the
answers add up to a whole. `limits = c(0, 100)` shows the axis up to 100 %,
so that the distance to the whole stays visible.

## Comparing groups without hiding numbers

How many people prefer organic when shopping, depending on their diet?
`prefers_organic > 0` is true for every agreeing answer, so the mean is a
share again, and `paste0()` writes the number of cases of each group into
its name before `fct_reorder()` orders the groups by their share:

```r
survey |>
  filter(!is.na(diet), !is.na(prefers_organic)) |>
  summarise(share = mean(prefers_organic > 0) * 100, n = n(), .by = diet) |>
  mutate(group = paste0(diet, " (n = ", n, ")")) |>
  ggplot() +
  aes(x = share, y = fct_reorder(group, share)) +
  geom_col() +
  labs(x = "Prefer organic products (% agreeing)", y = NULL)
```

72 % of vegans prefer organic, but only 30 % of omnivores. The labels show
what these numbers rest on: behind the top bar stand 36 people, behind the
bottom one 1,819, and with 36 people a single one shifts the share by almost
3 percentage points, with 1,819 by 0.05. The bars look equally solid, but
they are not, and without the number of cases nobody could tell. The
omnivores show 1,819 rather than 1,826 because seven of them did not answer
this question; the number of cases in the label is always the number of
people the bar rests on. How to bring this uncertainty into the picture
itself is shown in [[showing-uncertainty]].

## Key points

- `pivot_longer()` brings an item battery into the long form, one row per
  person and item, and then every item becomes a bar, stacked to 100 % and
  sorted by agreement.
- The levels of a rating scale become ordered factor levels with names, and
  a diverging colour scale such as `"PuOr"` shows the direction through the
  colour and the strength through the saturation.
- Diverging bars put disagreement to the left and agreement to the right of
  a common zero line, and what happens to the neutral answers is stated in
  the chart.
- You show several yes/no questions as shares in separate bars, since their
  answers do not add up to 100 %.
- Whoever compares the shares of groups writes the number of cases into the
  labels, since a share from 36 answers is far less reliable than one from
  1,819.

![Quiz: Showing survey data](item:survey-charts-quiz)

## Further reading

Claus O. Wilke: [[fundamentals-of-data-visualization]], in particular the
chapters "Color scales" on diverging colour scales and "Visualizing
proportions" on stacked bars and their alternatives.

Hadley Wickham, Mine Çetinkaya-Rundel and Garrett Grolemund:
[[r-for-data-science]], in particular the chapter "Data tidying" on
`pivot_longer()` and the long form.
