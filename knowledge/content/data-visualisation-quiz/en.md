---
title: "Quiz: Charts and ggplot2"
summary: >-
  Ten questions on which chart suits which variable and how ggplot2 builds it
  from layers, each with its reason.
translation_of: de
based_on: 2026-11-15
---

## The nominal variable `diet` has five values, from omnivore (1,826 people) to vegan (36). Which chart suits it? {#hds-014}

- [ ] A histogram of `diet`
  > A histogram divides a number axis into intervals; `diet` holds no numbers but five categories, and `geom_histogram()` stops with an error on text.
- [x] A bar chart with the bars sorted by frequency
  > Correct: each bar stands for one diet, and since a nominal variable has no order of its own, you arrange the bars by their length so that the ranking from omnivore to vegan can be read at a glance.
- [ ] A pie chart with five slices
  > The eye compares angles less well than lengths, and the two smallest groups would be thin wedges of just over one per cent with hardly room for a label.
- [ ] A bar chart with the bars sorted alphabetically
  > This shows the same numbers, but the alphabetical order carries no meaning: flexitarian would come before omnivore, and anyone looking for the ranking has to compare the bar lengths themselves.

> A nominal variable is shown as bars, and since its categories have no order of their own, the frequency may decide their arrangement.

## The ordinal variable `town_size` ranges from `city` to `village`. Why do you not sort its bars by frequency? {#hds-015}

- [ ] Because ggplot2 always arranges bars alphabetically and this cannot be changed
  > The order can certainly be set: as text, R sorts the categories alphabetically, while as a factor with `levels`, `town_size` keeps the order of the scale.
- [ ] Because you must not count frequencies for ordinal variables
  > Counting is allowed for every categorical variable, ordinal ones included; the only open question is the order in which the bars stand.
- [x] Because the scale has an order of its own, which sorting by frequency would tear apart
  > Correct: from city to village the place gets smaller step by step, and only in this order can you read how the number of respondents changes with the size of the place; as a factor with `levels`, `town_size` keeps this order.
- [ ] Because a sorted chart distorts the frequencies
  > Sorting leaves the bars just as long, so nothing is distorted; what gets lost is the order of the scale, which gives the categories their meaning.

> If a variable has an order of its own, that order sets the arrangement of the bars; you sort by frequency only where there is no such order.

## The histogram of all 611 answers to `price_too_expensive` essentially shows a single bar. What lies behind this? {#hds-016}

```r static
survey |>
  ggplot() +
  aes(x = price_too_expensive) +
  geom_histogram()
```

- [ ] Almost everyone gave the same price.
  > The answers do spread around the median of 1.99 €, but you cannot see it as long as the axis reaches up to 999 € and all the usual prices fall into the same bar.
- [x] A few extreme values of up to 999 € stretch the axis so far that almost all answers end up in the first bar; you filter them out and say what you left out.
  > Correct: the median is 1.99 € and the maximum 999 €, and the histogram has to show the whole range. With `filter(price_too_expensive <= 10)` the usual prices become visible, and the chart needs a note that 20 of the 611 answers above 10 € are not shown.
- [ ] The bars are too wide, and a smaller `binwidth` solves the problem.
  > Narrower bars do not change the axis: it still reaches 999 €, and the usual prices crowd together in a few millimetres on the far left.
- [ ] The values above 10 € are errors and are deleted from the data set without further notice.
  > Whether 999 € is a typo or a joke, you do not know; you leave such values out of this chart without deleting them and say how many answers are missing.

> A single bar usually means that a few extreme values stretch the axis; whoever leaves them out of the chart says how many there are and where the cut-off lies.

## What does the line inside the box of this boxplot show? {#hds-017}

```r static
survey |>
  ggplot() +
  aes(y = age) +
  geom_boxplot()
```

- [ ] The mean
  > `geom_boxplot()` does not show the mean; the line marks the median, and in a skewed distribution the two differ clearly.
- [ ] The midpoint between the smallest and the largest value
  > The midpoint of the range would depend only on the two most extreme people, whereas the line follows the person in the middle when everyone is ordered by size.
- [x] The median
  > Correct: one half of the values lies below it and the other above; for the age of the respondents the line is at 50 years.
- [ ] The most frequent value
  > A boxplot does not show the most frequent value, the mode, at all; where most values lie is easier to see in a histogram.

> The box spans the middle half of the values from the first to the third quartile, and the line inside it is the median.

## You want to show whether shopping in an organic shop is related to diet. The groups differ greatly in size, from 1,826 omnivores down to 36 vegans. Do you show counts or shares? {#hds-018}

- [ ] Counts as stacked bars with `geom_bar()`
  > The bar of the omnivores is then about fifty times as long as that of the vegans, and the fact that more than half of the vegans shop in an organic shop disappears in a barely visible piece.
- [ ] Counts side by side with `geom_bar(position = "dodge")`
  > Side by side again mainly shows the size of the groups: about 150 omnivores shop in an organic shop but only about 20 vegans, although the share among vegans is seven times as high.
- [x] Shares within each group with `geom_bar(position = "fill")`
  > Correct: every bar reaches 100 %, so the size of the group no longer matters and the difference becomes visible: 56 % of vegans, 21 % of vegetarians and 8 % of omnivores shop in an organic shop.
- [ ] Neither, because 36 people are too few for a comparison
  > A small group makes a share less certain but not worthless; you show the share and state how large the group is.

> When groups differ greatly in size, you compare shares within the groups, because otherwise the chart mainly shows which group is the largest.

## You want to show how two numeric variables are related, such as the ratings `eco_conscious` and `prefers_organic`. Which chart suits this? {#hds-019}

- [x] A scatter plot in which each person is a point
  > Correct: each axis carries one of the two numbers, and the cloud of points shows whether high values of one go together with high values of the other; for these two ratings they do, with r = 0.41.
- [ ] Two histograms side by side
  > Each histogram shows the distribution of one variable on its own, and which values meet in the same person is lost.
- [ ] A bar chart with the mean of each variable
  > Two means tell you where each variable lies on average, but nothing about whether the two rise or fall together.
- [ ] A line chart that connects the values one after the other
  > A line connects points in an order, such as over time; the respondents have no such order, and the line would run criss-cross.

> Two numbers are shown as a scatter plot. When many points lie on top of each other, like the 385 people on the point (0, 0) here, `geom_count()` instead of `geom_point()` shows how many there are.

## This code draws no chart and only prints a mapping of columns. Why? {#hds-020}

```r static
survey |>
  ggplot() |>
  aes(x = age)
```

- [ ] `aes()` belongs inside the parentheses of `ggplot()`.
  > `aes()` may stand as a layer of its own, which is even how this platform writes it; the error lies in the symbol before it.
- [x] After `ggplot()`, layers are joined with `+`, not with `|>`.
  > Correct: the pipe passes the data set on to `ggplot()`, after which `+` builds the chart layer by layer. With `|>`, `aes()` receives the whole chart as an argument, and R only prints this mapping instead of drawing anything.
- [ ] A geom such as `geom_histogram()` is missing.
  > Without a geom, ggplot2 still draws an area with axes; that no chart appears at all comes from the step to `aes()`.
- [ ] `survey` has to go inside the parentheses of `ggplot()`, because the pipe does not pass the data set on.
  > The first pipe works correctly: it passes `survey` to `ggplot()` as its first argument, which there is the data set.

> `|>` leads the data set to `ggplot()`, and from there `+` joins the layers of the chart.

## The table from `count(diet)` already holds the frequencies in the column `n`. Which layer draws the bars from it? {#hds-021}

```r static
survey |>
  count(diet) |>
  ggplot() +
  aes(x = diet, y = n)
```

- [ ] `geom_bar()`
  > `geom_bar()` counts the rows itself, but in the table from `count()` each diet stands in a single row; `geom_bar()` does not accept a given height such as `y = n` and stops with an error.
- [x] `geom_col()`
  > Correct: `geom_col()` takes the height of the bars from `y`, here from the column `n`, and counts nothing itself.
- [ ] `geom_histogram()`
  > A histogram divides a number axis into intervals and counts itself, whereas `diet` is a category and not a number.
- [ ] Either, since `geom_bar()` and `geom_col()` are two names for the same thing.
  > Both draw bars, but `geom_bar()` counts the rows of the data set, whereas `geom_col()` takes ready-made numbers from `y`.

> `geom_bar()` draws raw data with one row per person and counts them itself; a table with ready-made numbers needs `geom_col()`.

## This code is meant to colour all bars blue. Instead they appear in a reddish default colour, next to a legend with the entry “blue”. Why? {#hds-022}

```r static
survey |>
  ggplot() +
  aes(x = diet, fill = "blue") +
  geom_bar()
```

- [ ] R does not know the colour name `"blue"`; you have to write `"#0000FF"`.
  > R knows `"blue"` perfectly well, and with `"#0000FF"` in the same place the bars would be just as reddish, because the problem is the place, not the name.
- [ ] `fill` only colours the outline; for the area you need `colour`.
  > It is the other way round: `fill` colours the area and `colour` the outline; the mistake is that `fill` stands inside `aes()`.
- [x] A constant colour belongs outside `aes()`, for instance `geom_bar(fill = "blue")`; inside `aes()`, ggplot2 treats `"blue"` like a variable with a single value.
  > Correct: `aes()` holds mappings of variables to properties of the chart. There, the text “blue” becomes a category that gets the first colour of the default palette and an entry in the legend.
- [ ] `fill` has no effect on `geom_bar()`, only on `geom_col()`.
  > Both geoms accept `fill`; without an effect, the bars would have stayed grey instead of getting the reddish default colour.

> `aes()` holds what depends on the data; a fixed colour for all bars is set as an argument of the geom.

## What does the last line `facet_wrap(~ gender)` in this code do? {#hds-023}

```r static
survey |>
  ggplot() +
  aes(x = age) +
  geom_histogram(binwidth = 5) +
  facet_wrap(~ gender)
```

- [ ] It colours the bars of the histogram by gender.
  > That is what `aes(fill = gender)` achieves, with a single histogram of coloured bars, whereas `facet_wrap()` draws separate panels.
- [x] It draws a separate histogram for each gender in a panel of its own, all with the same axes.
  > Correct: `facet_wrap()` splits the data by the values of `gender` and draws the same chart once more for each group; since the axes are the same, the panels can be compared directly.
- [ ] It only shows the people of the first gender in the table.
  > Nobody is left out: each person appears in exactly one panel, and all panels together contain all respondents.
- [ ] It sorts the bars by gender.
  > The bars of a histogram always follow the order of the number axis; `facet_wrap()` spreads the data across several panels and leaves the bars in them as they are.

> `facet_wrap()` draws one chart per group, side by side and with shared axes, so that the groups can be compared without colours.
