---
title: Showing data with ggplot2
summary: >-
  Which chart fits a variable depends on its level of measurement, for one
  variable as for two. With ggplot2 every one of them is built from the same
  three layers, data, aesthetics and a geom, here with the compact milk
  survey and right in the browser.
objectives:
  intro: "In this lesson you learn to show data with ggplot2, and afterwards you can:"
  goals:
    - "choose the chart for one variable from its level of measurement: bars by frequency, bars in the order of the scale, a histogram or a boxplot"
    - "choose between bars stacked to 100 %, boxplots side by side, a scatter plot and `geom_count()` for two variables, and justify the choice"
    - "recognise when an outlier, a cut axis or a pie chart distorts a picture, and say what you leave out"
    - "build a chart in ggplot2 layer by layer from data, `aes()` and a geom, and tell `|>` from `+`"
    - "set the order of bars with a factor, show groups side by side with `facet_wrap()`, label with `labs()` and save with `ggsave()`"
translation_of: de
based_on: 2026-11-15
---

![Slides: Data visualisation with R and ggplot2](item:data-visualisation-slides)

In the compact milk survey, 2,809 people answered 21 questions, among them
how they eat. The answer to how many live vegetarian is in the table, and
`count()` gets it out:

```r
survey |>
  count(diet, sort = TRUE)
```

Five numbers are still readable, but even here you have to calculate to see
that omnivores are more than twice as many as flexitarians. A bar chart
shows the same at a glance:

```r
survey |>
  filter(!is.na(diet)) |>
  ggplot() +
  aes(y = fct_rev(fct_infreq(diet))) +
  geom_bar() +
  labs(x = "Number of respondents", y = NULL)
```

This lesson answers two questions: which chart fits which variable, and how
to build it with the package ggplot2. Every code box runs in the browser
with the table `survey`, and you can change and rerun each one.

## The scale decides

Which chart fits almost always depends on one question: what scale does the
variable have? You know the four levels of measurement from the slides
[[types-of-variables-slides]]; what matters here is what follows from them
for the picture.

| Scale | Example | in R | Fitting chart |
|---|---|---|---|
| nominal | `diet` | `<chr>` or `<fct>` | bars, sorted by frequency |
| ordinal | `milk_freq`, `eco_conscious` | `<fct>` with levels | bars in the order of the scale |
| interval | year of birth | `<dbl>` | histogram, boxplot |
| ratio | `age`, `price_too_expensive` | `<dbl>` | histogram, boxplot |

Nominal and ordinal are categories you count; interval and ratio are numbers
whose distribution you show. For the chart, the difference between interval
and ratio does not matter, but the one between nominal and ordinal does.

## One variable

### Nominal: bars by frequency

Diet has no natural order. So frequency sets the order, because then the
ranking can be read off directly. The chart at the top does exactly that:
`fct_infreq()` from the package forcats puts the most frequent category
first, and `fct_rev()` turns the order around so that it is on top.
Horizontal bars (`y` instead of `x`) keep long names readable.

### Ordinal: bars in the order of the scale

How often is milk drunk at home? The column `milk_freq` comes from the file
as text, and R sorts text alphabetically:

```r
survey |>
  filter(!is.na(milk_freq)) |>
  ggplot() +
  aes(x = milk_freq) +
  geom_bar() +
  labs(x = "How often milk is drunk at home", y = "Number of respondents")
```

The order daily, monthly, rarely, weekly tears the scale apart. Sorting by
frequency would be just as wrong, because an ordinal variable has an order
of its own. You set it with `factor()` and `levels`:

```r
survey |>
  filter(!is.na(milk_freq)) |>
  mutate(milk_freq = factor(milk_freq, levels = c(
    "daily", "weekly", "monthly", "rarely"
  ))) |>
  ggplot() +
  aes(x = milk_freq) +
  geom_bar() +
  labs(x = "How often milk is drunk at home", y = "Number of respondents")
```

Now you can see that the bars decrease along the scale. The values in
`levels` must be spelled exactly as in the data, otherwise a value silently
becomes `NA`. `filter(!is.na())` leaves out the 424 people without an
answer, and that belongs in the description of the chart.

### Rating scales

A rating from −2 to +2 is stored as a number, but it is a sequence of five
steps. Five bars show how the answers are spread and say more than a mean of
0.6:

```r
survey |>
  filter(!is.na(eco_conscious)) |>
  ggplot() +
  aes(x = eco_conscious) +
  geom_bar() +
  labs(x = "\"I would call myself eco-conscious\" (-2 to +2)", y = "Number of respondents")
```

### One number: the histogram

Age is a number. The histogram divides the numbers into classes, here five
years each, and counts how many people fall into each. This shows the shape
of the distribution: where most people are, how widely it spreads, where it
ends.

```r
survey |>
  ggplot() +
  aes(x = age) +
  geom_histogram(binwidth = 5) +
  labs(x = "Age in years", y = "Number of respondents")
```

Try `binwidth = 1` and `binwidth = 10`. Classes that are too narrow show
noise, classes that are too wide blur the shape; there is no right width,
only one that answers the question well.

### One outlier can hide everything

From what price is a litre of milk too expensive? 611 people answered, one
of them with 999 €:

```r
survey |>
  filter(!is.na(price_too_expensive)) |>
  ggplot() +
  aes(x = price_too_expensive) +
  geom_histogram(bins = 30) +
  labs(x = "Too expensive from (€)", y = "Number of respondents")
```

The axis runs to the largest value, and everything of interest is squeezed
into the first bar. With `filter()` you restrict the chart to prices per
litre that can be meant seriously:

```r
survey |>
  filter(price_too_expensive <= 10) |>
  ggplot() +
  aes(x = price_too_expensive) +
  geom_histogram(binwidth = 0.25) +
  labs(x = "Too expensive from (€)", y = "Number of respondents")
```

> [!IMPORTANT]
> Whatever you leave out, you say so, in the chart or in the text below it.
> Here it is 20 of 611 answers above 10 €.

### One number in short: the boxplot

The same prices as a boxplot:

```r
survey |>
  filter(price_too_expensive <= 10) |>
  ggplot() +
  aes(x = price_too_expensive) +
  geom_boxplot() +
  labs(x = "Too expensive from (€)", y = NULL)
```

The line in the box is the median, here 1.99 €. The box spans the middle
half of the answers, from the first to the third quartile. The whiskers
reach the last value that lies at most one and a half box widths from the
box, and anything beyond appears as a single point. The boxplot loses the
shape the histogram shows, but it takes little space, and that makes it
strong as soon as you compare groups.

## Two variables

With two variables, both scales decide together.

| two … | Chart | Geom |
|---|---|---|
| categories | bars stacked to 100 % | `geom_bar(position = "fill")` |
| a number by group | boxplots side by side | `geom_boxplot()` |
| numbers | scatter plot | `geom_point()` |
| numbers with few values | circles by count | `geom_count()` |

### Two categories: bars stacked to 100 %

Do people who live vegan shop in organic stores more often? One bar per
diet, and the fill colour (`fill`) shows who shops in an organic store:

```r
survey |>
  filter(!is.na(diet)) |>
  ggplot() +
  aes(y = fct_infreq(diet), fill = shops_organic) +
  geom_bar(position = "fill") +
  labs(x = "Share of respondents", y = NULL, fill = "Shops in an\norganic store")
```

56 % of vegans shop in an organic store, but only 8 % of omnivores.
`position = "fill"` stacks every bar to 100 %, because the groups differ
greatly in size, 1,826 omnivores against 36 vegans; in counts, the vegans
would hardly show. The price is that the chart no longer shows the size of
the groups, so that belongs in the labels.

### A number by group: boxplots side by side

In the price experiment of the survey, some respondents saw Weihenstephan
and others Alpro, and chance decided who saw which brand:

```r
survey |>
  filter(price_too_expensive <= 10) |>
  ggplot() +
  aes(x = milk_brand, y = price_too_expensive) +
  geom_boxplot() +
  labs(x = "Brand shown", y = "Too expensive from (€)")
```

The medians are almost equal, 1.99 € and 2.00 €. Because the brand was
assigned at random, this is an experiment, and the brand makes hardly any
difference to the price limit.

### Two numbers: the scatter plot

Each point is a person, with their age on the x-axis and their price limit
on the y-axis:

```r
survey |>
  filter(price_too_expensive <= 10) |>
  ggplot() +
  aes(x = age, y = price_too_expensive) +
  geom_point(alpha = 0.6) +
  labs(x = "Age in years", y = "Too expensive from (€)")
```

The cloud falls slightly to the right, the correlation is −0.25: older
people name somewhat lower prices. `alpha = 0.6` makes the points
translucent, so you can see where they overlap.

### When points pile up

Two rating scales from −2 to +2 give only 25 possible points. A scatter plot
shows these 25 and nothing else, not even that 385 people sit on the point
in the middle. `geom_count()` counts and draws circles by number:

```r
survey |>
  ggplot() +
  aes(x = eco_conscious, y = prefers_organic) +
  geom_count() +
  labs(x = "Eco-conscious (-2 to +2)", y = "Prefers organic (-2 to +2)", size = "Respondents")
```

Now the relationship shows (r = 0.41): people who call themselves
eco-conscious are more likely to buy organic. Replace `geom_count()` with
`geom_point()` and compare.

### What to avoid

- **Pie charts:** they ask you to compare angles, which people do badly. Are
  there as many pescetarians as vegans? In a pie chart that is hard to tell,
  in a bar chart it is obvious. A pie in 3D is worse still, because the
  perspective makes the slices in front look bigger.
- **Cut axes under bars:** 64.7 % of women and 56.3 % of men drink milk
  every day. If the axis starts at 55 %, the difference looks threefold. A
  bar shows its size by its length, so bars start at zero, and ggplot2 does
  that by itself.
- **Outliers without a note:** whoever leaves values out says which and how
  many.

## Which chart fits?

The demonstrator asks how many variables you want to show and what values
they have, and gives you the fitting chart with an R template. With the
columns of the survey it fills in real names, so you can copy the code into
a code box of this lesson and run it.

![Which chart fits?](item:which-chart)

## A chart in layers

Every chart in ggplot2 is built from the same three layers:

- the **data**, a table with one row per observation,
- the **aesthetics** (`aes()`), which say which column goes on which axis or
  into which colour,
- the **geom**, the form in which the values appear: bars, points, boxes.

Everything else, labels, scales and the look, only refines. Leland Wilkinson
described this decomposition as the *Grammar of Graphics*, and Hadley
Wickham brought it to R with ggplot2.

### Layer by layer

Run the code, then remove the lines from the bottom up. After each line the
result is a valid chart: `ggplot()` alone gives an empty area, `aes()` brings
the axis, `geom_histogram()` the bars and `labs()` the labels.

```r
survey |>
  ggplot() +
  aes(x = age) +
  geom_histogram(binwidth = 5) +
  labs(
    x = "Age in years",
    y = "Number of respondents"
  )
```

### Pipe and plus

Up to `ggplot()`, the data flow through the pipe `|>`; after it, layers are
added with `+`. If you keep writing the pipe after `ggplot()`, the chart is
passed to `aes()` as an argument. R then draws nothing and only prints a
mapping in which the chart itself has ended up as `y`:

```r
survey |>
  ggplot() |>
  aes(x = age)
```

Replace the second `|>` with `+`, and it runs.

### `geom_bar()` counts, `geom_col()` shows values

`geom_bar()` gets the raw data, one row per person, and counts by itself.
`geom_col()` gets a table in which the values are already there, and only
draws them. Both boxes give the same picture:

```r
survey |>
  filter(!is.na(diet)) |>
  ggplot() +
  aes(x = diet) +
  geom_bar()
```

```r
survey |>
  filter(!is.na(diet)) |>
  count(diet) |>
  ggplot() +
  aes(x = diet, y = n) +
  geom_col()
```

You need the second way as soon as you calculate something first, such as
shares or means per group.

### Aesthetics: inside `aes()` or outside

An aesthetic links a column to a property of the picture: `x` and `y`, but
also `fill`, `colour` (line colour), `size`, `shape` and `alpha`. What is
inside `aes()` depends on a column and changes from bar to bar:

```r
survey |>
  filter(!is.na(diet)) |>
  ggplot() +
  aes(y = diet, fill = shops_organic) +
  geom_bar()
```

What is outside, in the geom, is the same for all:

```r
survey |>
  filter(!is.na(diet)) |>
  ggplot() +
  aes(y = diet) +
  geom_bar(fill = "steelblue")
```

> [!WARNING]
> If you write `fill = "steelblue"` inside `aes()`, ggplot2 treats the text
> like a column with a single value: the bars get the first colour of the
> default palette, and a legend with the entry "steelblue" appears. Try it.

### Order is a factor

The order of the bars is not set by ggplot2 but by the factor behind it.
Three tools from the package forcats and from R itself are enough:

| Expression | Order |
|---|---|
| `fct_infreq(diet)` | most frequent first |
| `fct_rev(fct_infreq(diet))` | turned around, most frequent on top in horizontal bars |
| `factor(milk_freq, levels = c(…))` | the order you set |

You sort nominal variables by frequency and ordinal ones by the scale.

### Small multiples with `facet_wrap()`

`facet_wrap()` draws the same chart once per group, side by side and with
the same axes. The tilde before `gender` means: one panel per value of this
column.

```r
survey |>
  ggplot() +
  aes(x = age) +
  geom_histogram(binwidth = 5) +
  facet_wrap(~ gender) +
  labs(x = "Age in years", y = "Number of respondents")
```

### Labels are for people

Column names are for R, labels are for the people who read the chart.
`labs()` sets title, axes, legend and source, and the title states the
finding rather than just the topic. `scale_x_continuous(labels =
scales::percent)` writes shares as percentages:

```r
survey |>
  filter(!is.na(diet)) |>
  ggplot() +
  aes(y = fct_infreq(diet), fill = shops_organic) +
  geom_bar(position = "fill") +
  scale_x_continuous(labels = scales::percent) +
  labs(
    title = "Vegans shop in organic stores most often",
    x = "Share of respondents", y = NULL, fill = "Organic store",
    caption = "Source: milk survey, compact (n = 2,781 with a diet)"
  )
```

### Saving

`ggsave()` writes a chart to a file. You give the size in centimetres so
that the text fits in the report:

```r
diet_plot <- survey |>
  filter(!is.na(diet)) |>
  ggplot() +
  aes(y = fct_rev(fct_infreq(diet))) +
  geom_bar()

ggsave("diet.png", diet_plot, width = 16, height = 10, units = "cm")
```

In a Quarto report you do not need this: the code chunk draws the chart
itself, and the caption goes into the chunk option `#| fig-cap`.

## Try it

Three tasks, each with a code box in which the pipe is already there. Open
the hints and the solution when you need them.

1. Show how often milk is drunk at home (`milk_freq`) as bars in the order of
   the scale, without the missing answers.

```r
survey |>
  filter() |>
  mutate() |>
  ggplot() +
  aes() +
  geom_bar()
```

2. Show for each diet how the organic share of shopping (`organic_share`,
   1 to 5) is spread, as bars stacked to 100 %.

```r
survey |>
  filter() |>
  ggplot() +
  aes() +
  geom_bar()
```

3. Compare the price limit (`price_too_expensive`) of women and men as
   boxplots side by side, with prices up to 10 € only.

```r
survey |>
  filter() |>
  ggplot() +
  aes() +
  geom_boxplot()
```

> [!HINT]
> Task 1 needs `factor()` with `levels` in the order daily, weekly, monthly,
> rarely. To check: the first bar stands for 1,451 people.

> [!HINT]
> In task 2, `organic_share` is a number. For `fill` to show five separate
> colours instead of a gradient, you turn it into a category inside `aes()`
> with `factor(organic_share)`. To check: among vegans, 61 % are at level 4
> or 5, among omnivores 11 %.

> [!HINT]
> In task 3, `gender` goes on the x-axis and the price on the y-axis. To
> check: the median is 2.00 € for women and 1.89 € for men.

> [!SOLUTION]
> Task 1:
>
> ```r
> survey |>
>   filter(!is.na(milk_freq)) |>
>   mutate(milk_freq = factor(milk_freq, levels = c(
>     "daily", "weekly", "monthly", "rarely"
>   ))) |>
>   ggplot() +
>   aes(x = milk_freq) +
>   geom_bar() +
>   labs(x = "How often milk is drunk at home", y = "Number of respondents")
> ```
>
> Task 2:
>
> ```r
> survey |>
>   filter(!is.na(diet), !is.na(organic_share)) |>
>   ggplot() +
>   aes(y = fct_infreq(diet), fill = factor(organic_share)) +
>   geom_bar(position = "fill") +
>   labs(x = "Share of respondents", y = NULL, fill = "Organic share\n(1 to 5)")
> ```
>
> Task 3:
>
> ```r
> survey |>
>   filter(price_too_expensive <= 10) |>
>   ggplot() +
>   aes(x = gender, y = price_too_expensive) +
>   geom_boxplot() +
>   labs(x = NULL, y = "Too expensive from (€)")
> ```

## Key points

- The scale decides the chart: nominal variables as bars by frequency,
  ordinal ones as bars in the order of the scale, numbers as a histogram or
  boxplot.
- For two variables: two categories as bars stacked to 100 %, a number by
  group as boxplots side by side, two numbers as a scatter plot, and with
  few values with `geom_count()`.
- Whatever you leave out, you say so; bars start at zero, and lengths are
  easier to compare than angles.
- ggplot2 builds every chart from data, `aes()` and a geom; up to
  `ggplot()` the pipe connects, after it the plus.
- The factor sets the order of the bars, `facet_wrap()` shows groups side by
  side, `labs()` labels for people.

![Quiz: Charts and ggplot2](item:data-visualisation-quiz)

## Further reading

Claus O. Wilke: *Fundamentals of Data Visualization*. O'Reilly, 2019, free
to read at <https://clauswilke.com/dataviz/>. The book sorts charts by what
they are meant to show and is built with ggplot2.

Hadley Wickham, Mine Çetinkaya-Rundel and Garrett Grolemund: *R for Data
Science*. 2nd edition, O'Reilly, 2023, free to read at
<https://r4ds.hadley.nz/>, especially the chapters "Data visualization" and
"Layers".

Leland Wilkinson: *The Grammar of Graphics*. 2nd edition, Springer, 2005.
The theory behind ggplot2, for everyone who wants to know why the layers are
called what they are called.
