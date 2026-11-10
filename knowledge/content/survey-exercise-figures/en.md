---
title: "R self-study, chapter 4: Figures"
summary: >-
  The tables of chapters 2 and 3 become figures with ggplot2: age, place of
  residence, shopping places and organic share, each fitting its question and clear without code.
objectives:
  intro: "In this chapter you turn tables of the survey on milk and chocolate into figures, and afterwards you can:"
  goals:
    - "show the distribution of a number with a histogram and choose a bin width that makes its shape visible"
    - "show a category and a question with multiple answers as a bar chart, in an order that suits the variable"
    - "compare stacked, side-by-side and 100 percent stacked bars and justify which form answers a question"
    - "set groups side by side with box plots and with small multiples (`facet_wrap()`)"
    - "label every figure with `labs()` so that a person understands it without your code, and recognise an axis that deceives"
translation_of: de
based_on: 2026-11-11
---

The guiding question of the self-study stays the same: where do the
respondents shop, and who buys organic? In chapters 2 and 3 you answered it
with tables, and in this chapter you turn them into figures. Two questions
accompany you with each one: which form suits the question and the kind of
variable, and does a person understand the figure without seeing your code?
That is why every figure gets labels with `labs()` instead of variable names,
just as they would appear in your report.

In the boxes the whole [[milk-chocolate-survey]] is ready as `survey`, with
2,811 rows and 606 columns, and the tidyverse is loaded. Every box runs on
its own. Columns you built in chapters 2 and 3, such as `city_size` or
`organic_share`, are therefore already in the starter code of the task that
needs them.

Before the chapter it is worth looking into [[r-for-data-science]]: the
[first steps, distributions and relationships](https://r4ds.hadley.nz/data-visualize.html#first-steps)
(1.2 to 1.5), the sections on
[geometric objects](https://r4ds.hadley.nz/layers.html#sec-geometric-objects),
facets and positions (9.3, 9.4, 9.6) and on
[labels](https://r4ds.hadley.nz/communication.html#labels) (11.2). Which
figure suits which purpose is shown by Claus Wilke in the
[Directory of Visualizations](https://clauswilke.com/dataviz/directory-of-visualizations.html)
of his book [[fundamentals-of-data-visualization]].

## Showing one variable

1. Draw a histogram of age (`Q002alter`) with `geom_histogram()` and
   label both axes. Try `binwidth = 1`, `5` and `10` and describe in two
   sentences which width shows the distribution best and what you see:
   shape, peaks and limits.

```r
survey
```

> [!HINT]
> `binwidth` goes inside the parentheses of `geom_histogram()`, and with
> `labs(x = …, y = …)` you replace the variable names on the axes. Read the
> section
> [Visualizing distributions](https://r4ds.hadley.nz/data-visualize.html#visualizing-distributions)
> (1.4) in R4DS.

> [!SOLUTION]
> ```r
> survey |>
>   ggplot() +
>   aes(x = Q002alter) +
>   geom_histogram(binwidth = 5) +
>   labs(x = "Age in years", y = "Number of respondents")
> ```
>
> With a width of 5 years the shape is clearest: there are only a few
> respondents under 23, the bars are about equally high between 28 and 52,
> highest between 53 and 62, and after that the distribution falls until it
> almost ends at 75. Only `binwidth = 1` shows the limits: at 29 there are 76
> respondents, at 30 only 39, exactly at the border between the age groups
> 18-29 and 30-44 (`Q002altergru4f`), and after 74, with 37 respondents, only
> 7 older people up to 80 follow. A width of 10 years, by contrast, smooths
> so much that neither can be seen.

2. Draw a bar chart of the respondents by size of place of residence
   (`city_size`) in the order of the codebook, from the large city to the
   village. Leave out the 7 respondents without an answer and write a
   comment in the code saying that you do so. Explain in one sentence why
   you do not sort the bars by frequency here.

```r
survey |>
  mutate(
    city_size = factor(D044stadtf, levels = c(
      "Großstadt", "Große Mittelstadt", "Große Kleinstadt",
      "Kleinstadt >5000", "Kleinstadt <5000", "Dorf"
    ))
  )
```

> [!HINT]
> The starter code builds `city_size` as in chapter 2, task 3: as a
> factor whose levels set the order. The levels are the values in the data,
> so they stay German, from "Großstadt" (large city) to "Dorf" (village).
> Add `filter()` and then `ggplot()` with `geom_bar()`; `geom_bar()` counts
> the rows itself.

> [!SOLUTION]
> ```r
> survey |>
>   mutate(
>     city_size = factor(D044stadtf, levels = c(
>       "Großstadt", "Große Mittelstadt", "Große Kleinstadt",
>       "Kleinstadt >5000", "Kleinstadt <5000", "Dorf"
>     ))
>   ) |>
>   # the 7 respondents without an answer on city size are left out
>   filter(!is.na(city_size)) |>
>   ggplot() +
>   aes(x = city_size) +
>   geom_bar() +
>   labs(x = "Size of place of residence", y = "Number of respondents")
> ```
>
> The size of the place of residence is ordinal, so its levels have an
> order from large to small, and sorting by frequency would tear this order
> apart, so that nobody could see any more how the number of respondents
> changes from the large-city end to the village end. With 1,042
> respondents the large city is the most frequent category, and with 188
> the small town under 5,000 inhabitants is the rarest.

3. Show the shopping places as horizontal bars, one bar per place,
   sorted by share and with the x-axis in percent. The starter code is the
   table `places` from chapter 2, task 7. Because nobody understands
   column names like `v008ort_5markt`, you first create a small table
   `place_labels` with the columns `place` and `label` and join both with
   `left_join()`.

```r
places <- survey |>
  summarize(across(v008ort_1discount:v008ort_9online, mean)) |>
  pivot_longer(everything(), names_to = "place", values_to = "share") |>
  mutate(pct = 100 * share)

places
```

> [!HINT]
> The names are in the codebook on page 8; the codebook
> (`data/M3b_Musterstudie-quantitativ.pdf`) exists only in your course
> folder. In short, in the order of the columns, they are: discounter,
> supermarket, hypermarket, specialist shop, weekly market, farm shop,
> organic shop or health food shop, online at a discounter or supermarket,
> online grocer. A small table is easiest to write row by row with
> `tribble()`. You get horizontal bars when the place is on the y-axis, and
> `fct_reorder(label, pct)` sorts it by share. Read
> [Basic joins](https://r4ds.hadley.nz/joins.html#sec-mutating-joins) (19.3)
> and
> [Modifying factor order](https://r4ds.hadley.nz/factors.html#sec-modifying-factor-order)
> (16.4) in R4DS.

> [!SOLUTION]
> ```r
> place_labels <- tribble(
>   ~place, ~label,
>   "v008ort_1discount", "Discounter",
>   "v008ort_2super", "Supermarket",
>   "v008ort_3sbmarkt", "Hypermarket",
>   "v008ort_4fach", "Specialist shop",
>   "v008ort_5markt", "Weekly market",
>   "v008ort_6hof", "Farm shop",
>   "v008ort_7bioladen", "Organic or health food shop",
>   "v008ort_8onlineds", "Online at discounter or supermarket",
>   "v008ort_9online", "Online grocer"
> )
>
> places <- survey |>
>   summarize(across(v008ort_1discount:v008ort_9online, mean)) |>
>   pivot_longer(everything(), names_to = "place", values_to = "share") |>
>   mutate(pct = 100 * share)
>
> places |>
>   left_join(place_labels, by = join_by(place)) |>
>   ggplot() +
>   aes(x = pct, y = fct_reorder(label, pct)) +
>   geom_col() +
>   labs(x = "Share of respondents who shop there (%)", y = NULL)
> ```
>
> Because the table already contains the shares, `geom_col()` draws them
> directly instead of counting rows like `geom_bar()`. In front are the
> supermarket with 75.9 and the discounter with 73.5 percent, at the very
> end the online grocer with 6.2 percent. Together the bars add up to far
> more than 100 percent, because every person could name several places,
> and every share refers to the respondents, not to the mentions.
> `y = NULL` leaves out the axis label because the names of the places
> speak for themselves.

## Comparing groups

4. Show how the organic share (`organic_share`) is distributed in
   the four income groups (`income_group`). The starter code builds both
   columns as in chapters 2 and 3, leaves out respondents without an answer
   on either of them and draws the stacked version. Change it twice, first
   with `position = "dodge"` (side by side) and then with
   `position = "fill"` (stacked to 100 percent), and describe in two
   sentences which of the three versions best answers the question "Do
   people with a higher income buy more organic?" and which would be
   misleading.

```r
survey |>
  mutate(
    organic_share = factor(v032bioanteil, levels = 1:5, labels = c(
      "(almost) never organic", "clearly less than half", "about half",
      "clearly more than half", "(almost) only organic"
    )),
    income_group = case_when(
      d049einkommen <= 4 ~ "under €2,000",
      d049einkommen <= 7 ~ "€2,000 to under €3,500",
      d049einkommen <= 10 ~ "€3,500 to under €5,000",
      d049einkommen == 11 ~ "€5,000 and more"
    ),
    income_group = fct_relevel(
      income_group, "under €2,000", "€2,000 to under €3,500",
      "€3,500 to under €5,000", "€5,000 and more"
    )
  ) |>
  filter(!is.na(income_group), !is.na(organic_share)) |>
  ggplot() +
  aes(x = income_group, fill = organic_share) +
  geom_bar() +
  labs(x = "Net household income", y = "Number of respondents", fill = "Organic share of shopping")
```

> [!HINT]
> `position` goes inside the parentheses of `geom_bar()`. When comparing,
> pay attention to how many respondents are in each income group, and ask
> yourself whether the height of a bar then still says anything about
> organic food. Read
> [Position adjustments](https://r4ds.hadley.nz/layers.html#position-adjustments)
> (9.6) in R4DS.

> [!SOLUTION]
> ```r
> survey |>
>   mutate(
>     organic_share = factor(v032bioanteil, levels = 1:5, labels = c(
>       "(almost) never organic", "clearly less than half", "about half",
>       "clearly more than half", "(almost) only organic"
>     )),
>     income_group = case_when(
>       d049einkommen <= 4 ~ "under €2,000",
>       d049einkommen <= 7 ~ "€2,000 to under €3,500",
>       d049einkommen <= 10 ~ "€3,500 to under €5,000",
>       d049einkommen == 11 ~ "€5,000 and more"
>     ),
>     income_group = fct_relevel(
>       income_group, "under €2,000", "€2,000 to under €3,500",
>       "€3,500 to under €5,000", "€5,000 and more"
>     )
>   ) |>
>   filter(!is.na(income_group), !is.na(organic_share)) |>
>   ggplot() +
>   aes(x = income_group, fill = organic_share) +
>   geom_bar(position = "fill") +
>   labs(x = "Net household income", y = "Share within the income group", fill = "Organic share of shopping")
> ```
>
> The question compares shares, so the version with `position = "fill"`
> answers it best: every bar reaches 100 percent, and you can see that the
> share of those who (almost) never buy organic falls from 28.0 percent
> under €2,000 to 15.9 percent from €5,000 upwards. The stacked and the
> side-by-side versions would be misleading because they show counts and
> the groups differ greatly in size: the top income group contains only 289
> respondents and the second 920, so every segment there looks small,
> although the top group buys the most organic in relative terms. Overall,
> 2,694 respondents with both answers remain; in chapter 3 the top group
> had 291, because the organic share played no part there and 2 of them did
> not give it.

5. Draw box plots of age for each level of `organic_share` with
   `geom_boxplot()`, with the levels on the y-axis so that the long labels
   stay readable. Then describe in two sentences whether the respondents
   who buy a lot of organic food are younger or older, what a box plot
   shows and what it hides, and how many people are in the group
   "(almost) only organic".

```r
survey |>
  mutate(
    organic_share = factor(v032bioanteil, levels = 1:5, labels = c(
      "(almost) never organic", "clearly less than half", "about half",
      "clearly more than half", "(almost) only organic"
    ))
  )
```

> [!HINT]
> Put age on `x` and `organic_share` on `y`, then the boxes lie
> horizontally. The box plot does not tell you how many people are in a
> group; for that you need `count(organic_share)` in a run of its own. Read
> [Visualizing relationships](https://r4ds.hadley.nz/data-visualize.html#visualizing-relationships)
> (1.5) in R4DS.

> [!SOLUTION]
> ```r
> survey |>
>   mutate(
>     organic_share = factor(v032bioanteil, levels = 1:5, labels = c(
>       "(almost) never organic", "clearly less than half", "about half",
>       "clearly more than half", "(almost) only organic"
>     ))
>   ) |>
>   filter(!is.na(organic_share)) |>
>   ggplot() +
>   aes(x = Q002alter, y = organic_share) +
>   geom_boxplot() +
>   labs(x = "Age in years", y = "Organic share of shopping")
> ```
>
> Those who buy more organic food are somewhat younger on average: the
> median is 52 years in the two groups with little organic food and 44
> years in the group "(almost) only organic", but the boxes overlap widely.
> A box plot shows the median, the two quartiles and the range of the
> remaining values, here without outliers, but it hides how many people
> are behind it and how their ages are distributed within the box; the
> group "(almost) only organic" has only 111 respondents, while the group
> "clearly less than half" has 938.

6. Show the share who shop at a farm shop and at a weekly market for
   each size of place of residence as two bar charts side by side. The
   starter code is the table from chapter 3, task 3. Bring the two shares
   below each other with `pivot_longer()`, one column for the place and one
   for the share, and split the figure with `facet_wrap()`. Describe in one
   sentence what the figure shows faster than the table.

```r
survey |>
  mutate(
    city_size = factor(D044stadtf, levels = c(
      "Großstadt", "Große Mittelstadt", "Große Kleinstadt",
      "Kleinstadt >5000", "Kleinstadt <5000", "Dorf"
    ))
  ) |>
  # the 7 respondents without an answer on city size are left out
  filter(!is.na(city_size)) |>
  group_by(city_size) |>
  summarize(
    n = n(),
    farm_shop = 100 * mean(v008ort_6hof),
    market = 100 * mean(v008ort_5markt)
  )
```

> [!HINT]
> `pivot_longer(c(farm_shop, market), names_to = "place", values_to =
> "pct")` turns the two columns into two rows per size of place. So that
> "Farm shop" and "Weekly market" appear above the panels instead of the
> column names, translate them afterwards with `mutate()` and `if_else()`.
> `facet_wrap(vars(place))` then draws a chart of its own for each place
> with the same axis. Read [Facets](https://r4ds.hadley.nz/layers.html#facets)
> (9.4) in R4DS.

> [!SOLUTION]
> ```r
> survey |>
>   mutate(
>     city_size = factor(D044stadtf, levels = c(
>       "Großstadt", "Große Mittelstadt", "Große Kleinstadt",
>       "Kleinstadt >5000", "Kleinstadt <5000", "Dorf"
>     ))
>   ) |>
>   # the 7 respondents without an answer on city size are left out
>   filter(!is.na(city_size)) |>
>   group_by(city_size) |>
>   summarize(
>     n = n(),
>     farm_shop = 100 * mean(v008ort_6hof),
>     market = 100 * mean(v008ort_5markt)
>   ) |>
>   pivot_longer(c(farm_shop, market), names_to = "place", values_to = "pct") |>
>   mutate(place = if_else(place == "farm_shop", "Farm shop", "Weekly market")) |>
>   ggplot() +
>   aes(x = pct, y = city_size) +
>   geom_col() +
>   facet_wrap(vars(place)) +
>   labs(x = "Share of respondents who shop there (%)", y = "Size of place of residence")
> ```
>
> The figure shows at a glance that the two places run in opposite
> directions: 11.9 percent go to a farm shop in the large city and 17.8
> percent in the village, and 19.0 percent go to a weekly market in the
> large city but only 13.1 percent in the village, whereas in the table you
> have to compare two rows of numbers line by line to see this.

## A figure that deceives

7. The starter code is the figure of the shopping places from task
   4.3, stored as `plot_places`. Let the x-axis start at 5 percent by
   adding `+ coord_cartesian(xlim = c(5, NA), expand = FALSE)`, and compare
   the figure with the one from 4.3. Describe in two sentences how much
   longer the bar "Supermarket" now looks compared with "Online grocer", how
   much larger the share really is, and why bars must start at zero.

```r
place_labels <- tribble(
  ~place, ~label,
  "v008ort_1discount", "Discounter",
  "v008ort_2super", "Supermarket",
  "v008ort_3sbmarkt", "Hypermarket",
  "v008ort_4fach", "Specialist shop",
  "v008ort_5markt", "Weekly market",
  "v008ort_6hof", "Farm shop",
  "v008ort_7bioladen", "Organic or health food shop",
  "v008ort_8onlineds", "Online at discounter or supermarket",
  "v008ort_9online", "Online grocer"
)

plot_places <- survey |>
  summarize(across(v008ort_1discount:v008ort_9online, mean)) |>
  pivot_longer(everything(), names_to = "place", values_to = "share") |>
  mutate(pct = 100 * share) |>
  left_join(place_labels, by = join_by(place)) |>
  ggplot() +
  aes(x = pct, y = fct_reorder(label, pct)) +
  geom_col() +
  labs(x = "Share of respondents who shop there (%)", y = NULL)

plot_places
```

> [!HINT]
> `expand = FALSE` prevents ggplot2 from adding a small margin on the left
> and right, so that the axis really starts at 5. For the comparison you
> need the two shares from the solution of 4.3 and the length of the bars
> that remains after cutting. Read
> [Coordinate systems](https://r4ds.hadley.nz/layers.html#coordinate-systems)
> (9.7) in R4DS.

> [!SOLUTION]
> ```r
> place_labels <- tribble(
>   ~place, ~label,
>   "v008ort_1discount", "Discounter",
>   "v008ort_2super", "Supermarket",
>   "v008ort_3sbmarkt", "Hypermarket",
>   "v008ort_4fach", "Specialist shop",
>   "v008ort_5markt", "Weekly market",
>   "v008ort_6hof", "Farm shop",
>   "v008ort_7bioladen", "Organic or health food shop",
>   "v008ort_8onlineds", "Online at discounter or supermarket",
>   "v008ort_9online", "Online grocer"
> )
>
> plot_places <- survey |>
>   summarize(across(v008ort_1discount:v008ort_9online, mean)) |>
>   pivot_longer(everything(), names_to = "place", values_to = "share") |>
>   mutate(pct = 100 * share) |>
>   left_join(place_labels, by = join_by(place)) |>
>   ggplot() +
>   aes(x = pct, y = fct_reorder(label, pct)) +
>   geom_col() +
>   labs(x = "Share of respondents who shop there (%)", y = NULL)
>
> plot_places +
>   coord_cartesian(xlim = c(5, NA), expand = FALSE)
> ```
>
> In reality the share of the supermarket, 75.9 percent, is about twelve
> times as large as that of the online grocer, 6.2 percent, but from 5
> percent onwards only 70.9 and 1.2 percentage points of the bars remain,
> so that one looks a good sixty times as long as the other. A bar shows
> its value by its length, and only if all bars start at zero are the
> lengths in the same proportion as the values; without `expand = FALSE`
> the axis starts at about 1.5 percent because of the margin, and the
> effect, a ratio of about 16 to 1, is smaller but still wrong.

## What comes next

If you get stuck on a figure, the
[[opencode-course-assistant|course assistant]] in your course folder helps
you further, and in the next chapter, [[survey-exercise-own-question]], you
answer a question about the survey yourself with tables and figures.
