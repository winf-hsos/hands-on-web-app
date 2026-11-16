---
title: Charts that mislead
summary: >-
  A chart can draw a false picture from nothing but correct numbers when the
  ink does not match the value. Two famous examples and five tricks on the
  compact milk survey show how to spot a deception and what the honest
  version looks like in ggplot2.
objectives:
  intro: "In this lesson you learn to spot misleading charts and to draw honest ones, and afterwards you can:"
  goals:
    - "explain the principle of proportional ink and use it to argue why bars start at zero while points and lines need not"
    - "name a cut or inverted axis, counts instead of shares, areas instead of lengths, a hidden outlier and a pie chart as a deception or a hindrance"
    - "build the better version of each of these tricks in ggplot2, for instance with an axis from zero, shares with their group size, `scale_size_area()` or a boxplot with a `caption`"
    - "check a claim about the survey with R before you believe the chart that is meant to prove it"
translation_of: de
based_on: 2026-11-16
---

![Slides: Charts that mislead](item:misleading-charts-slides)

A chart can mislead without a single wrong number in it. It is enough to
cut the axis at the right place, to show counts where shares are asked for,
or to quietly include an outlier in a mean, and a difference that hardly
exists suddenly looks large. Often this happens without intent, because a
program's default or a quick idea decided the picture.

This lesson shows the most common tricks on the compact milk survey, each in
two code boxes: first the misleading version, then the better one. You can
run, change and compare both. Almost all the tricks break the same rule, and
the lesson starts with it.

## Proportional ink

When an area or a length represents a value, it must be proportional to
that value, so that a value twice as large also gets twice as much ink.
Claus O. Wilke calls this the principle of proportional ink in
[[fundamentals-of-data-visualization]] (chapter 17) and takes the term from
Carl Bergstrom and Jevin West, who develop it in [[calling-bullshit]]. Three
things follow from the rule, and you can check them in any chart:

- **Bars start at zero.** A bar shows its value by its length. If the axis
  starts at 34, a bar for 35 only has a length of 1, and a difference of
  13 % looks like five times as much.
- **Points and lines may start elsewhere.** They show their value by their
  position, not by a length, so an axis from 34 is no deception for them as
  long as it is labelled. A filled area under a line, however, is ink again
  and needs the zero.
- **A bubble with twice the radius has four times the area.** Whoever sizes
  the radius by the value makes a value twice as large look four times as
  large.

## Two famous examples

Two charts from the news have been shown as warnings so often that they
belong to the subject. The code boxes rebuild them with their original
numbers, which stand as a small table right in the code: `tribble()` takes
them row by row, `tibble()` column by column.

### The tax bar from television

In the summer of 2012 the US channel Fox Business showed what happens when
the tax cuts from the time of President Bush expire: the top tax rate rises
from 35 % to 39.6 %. The value axis began at 34 %, so the second bar looked
almost six times as high as the first. The rebuild with
`coord_cartesian(ylim = c(34, 42))`:

```r
tribble(
  ~when, ~top_rate,
  "Now", 35,
  "Jan 1, 2013", 39.6
) |>
  ggplot() +
  aes(x = fct_inorder(when), y = top_rate) +
  geom_col() +
  coord_cartesian(ylim = c(34, 42)) +
  labs(x = NULL, y = "Top tax rate (%)")
```

### The tax bar, honestly

Without `coord_cartesian()` the bars start at zero, as ggplot2 sets them up
by itself, and the second bar is only 13 % higher than the first. That is
exactly the difference between 35 and 39.6:

```r
tribble(
  ~when, ~top_rate,
  "Now", 35,
  "Jan 1, 2013", 39.6
) |>
  ggplot() +
  aes(x = fct_inorder(when), y = top_rate) +
  geom_col() +
  labs(x = NULL, y = "Top tax rate (%)")
```

Whether 4.6 percentage points are a lot or a little for high incomes is open
to debate. The chart, however, should not settle that debate in advance with
a shifted axis.

### The inverted axis

In 2014 the news agency Reuters published a chart of the murders committed
with firearms in Florida, where the "Stand Your Ground" law came into force
in 2005, which allows self-defence with a weapon even where one could have
retreated. The y-axis ran from top to bottom, with zero at the top, and the
area hung down like a curtain. `scale_y_reverse()` rebuilds it:

```r
tibble(
  year = 1990:2012,
  firearm_murders = c(873, 806, 789, 800, 739, 687, 668, 634, 589, 460, 499, 502,
                      552, 586, 555, 521, 740, 825, 780, 695, 669, 691, 721)
) |>
  ggplot() +
  aes(x = year, y = firearm_murders) +
  geom_area() +
  geom_vline(xintercept = 2005) +
  annotate("text", x = 2004.5, y = 950, label = "2005: \"Stand Your Ground\"", hjust = 1) +
  scale_y_reverse() +
  labs(x = NULL, y = "Murders using firearms")
```

### The axis the right way up

Whoever reads the picture like any other chart sees a steep fall after 2005.
The same numbers with zero at the bottom show the opposite: murders with
firearms rose from 521 in 2005 to 825 in 2007.

```r
tibble(
  year = 1990:2012,
  firearm_murders = c(873, 806, 789, 800, 739, 687, 668, 634, 589, 460, 499, 502,
                      552, 586, 555, 521, 740, 825, 780, 695, 669, 691, 721)
) |>
  ggplot() +
  aes(x = year, y = firearm_murders) +
  geom_area() +
  geom_vline(xintercept = 2005) +
  annotate("text", x = 2004.5, y = 950, label = "2005: \"Stand Your Ground\"", hjust = 1) +
  labs(x = NULL, y = "Murders using firearms")
```

Whether the law caused the rise is shown by neither version, since that
would take a comparison with states without such a law. The chart should at
least not show the opposite of what the numbers say.

## Five tricks on the survey

The following tricks turn up in reports, presentations and theses, mostly
without bad intent. Each has two code boxes on the table `survey`, first the
misleading version and then the better one.

### One cent becomes huge

In the price experiment, respondents saw either Weihenstephan or Alpro at
random and said from which price a litre would be too expensive for them.
The median is 1.99 € for Weihenstephan and 2.00 € for Alpro. If
`coord_cartesian()` cuts the axis just below the smaller value, one cent
turns into a bar twice as high as the other:

```r
survey |>
  filter(!is.na(price_too_expensive)) |>
  group_by(milk_brand) |>
  summarise(median_price = median(price_too_expensive)) |>
  ggplot() +
  aes(x = milk_brand, y = median_price) +
  geom_col() +
  coord_cartesian(ylim = c(1.98, 2.01)) +
  labs(x = "Brand shown", y = "Median: too expensive from (€)")
```

### One cent stays one cent

The better version lets the bars start at zero, writes the medians above
them with `geom_text()` and gives the number of answers below each brand.
At prices around 2 €, one cent is no difference worth talking about, and now
it looks like none:

```r
survey |>
  filter(!is.na(price_too_expensive)) |>
  group_by(milk_brand) |>
  summarise(median_price = median(price_too_expensive), n = n()) |>
  ggplot() +
  aes(x = paste0(milk_brand, "\n(n = ", n, ")"), y = median_price) +
  geom_col() +
  geom_text(aes(label = format(median_price, nsmall = 2)), vjust = -0.5) +
  coord_cartesian(ylim = c(0, 2.2)) +
  labs(x = "Brand shown", y = "Median: too expensive from (€)")
```

`coord_cartesian()` is back here, this time with limits from zero that only
make room for the labels at the top. The function itself does not mislead;
what matters is where the axis begins.

### Counts instead of shares

Which diet is most likely to shop in an organic store? Counting only the
customers of organic stores, flexitarians with 150 people and omnivores with
147 lead by far, and the 20 vegans seem to hardly matter:

```r
survey |>
  filter(shops_organic, !is.na(diet)) |>
  ggplot() +
  aes(y = fct_rev(fct_infreq(diet))) +
  geom_bar() +
  labs(x = "People who shop in an organic store", y = NULL)
```

### Shares per group, with their size

The counts mainly show how large the groups are, since the survey holds
1,826 omnivores and only 36 vegans. Whoever wants to know which group is
most likely to shop in an organic store needs the share per group: 56 % of
vegans against 8 % of omnivores. The group size belongs in the label,
because only 36 people stand behind the longest bar:

```r
survey |>
  filter(!is.na(diet)) |>
  group_by(diet) |>
  summarise(share = 100 * mean(shops_organic), n = n()) |>
  ggplot() +
  aes(x = share, y = fct_reorder(paste0(diet, " (n = ", n, ")"), share)) +
  geom_col() +
  labs(x = "Shop in an organic store (%)", y = NULL)
```

Neither chart is wrong: the counts describe what the customers of organic
stores are made of, the shares which group is most likely to shop there. It
becomes misleading when the title asks one question and the chart answers
the other.

### Twice as much, four times as large

1,451 people drink milk at home every day and 682 weekly, a little less than
half as many. Here `scale_radius()` makes the radius of each bubble
proportional to the count, and since the area grows with the square of the
radius, the bubble for daily looks about four and a half times as large as
the one for weekly:

```r
survey |>
  filter(!is.na(milk_freq)) |>
  count(milk_freq) |>
  mutate(milk_freq = factor(milk_freq, levels = c(
    "daily", "weekly", "monthly", "rarely"
  ))) |>
  ggplot() +
  aes(x = milk_freq, y = 1, size = n) +
  geom_point() +
  scale_radius(limits = c(0, NA), range = c(0, 50)) +
  scale_y_continuous(breaks = NULL) +
  labs(x = "How often milk is drunk at home", y = NULL)
```

### The area by the value

`scale_size_area()` instead makes the area proportional to the count, and
the bubble for daily is now a little more than twice as large as the one for
weekly. Bars would be easier still to compare, because the eye judges a
length more precisely than an area; bubbles only pay off when x and y are
already taken, as with `geom_count()`.

```r
survey |>
  filter(!is.na(milk_freq)) |>
  count(milk_freq) |>
  mutate(milk_freq = factor(milk_freq, levels = c(
    "daily", "weekly", "monthly", "rarely"
  ))) |>
  ggplot() +
  aes(x = milk_freq, y = 1, size = n) +
  geom_point() +
  scale_size_area(max_size = 50) +
  scale_y_continuous(breaks = NULL) +
  labs(x = "How often milk is drunk at home", y = NULL)
```

### The silent outlier

Whoever shows the mean price limit per brand gets 7.25 € for Weihenstephan
and 9.07 € for Alpro, as if respondents would pay a quarter more for Alpro.
The bars correctly start at zero and still mislead, because the means
include answers such as 344 € and 999 € for a litre of milk:

```r
survey |>
  filter(!is.na(price_too_expensive)) |>
  group_by(milk_brand) |>
  summarise(mean_price = mean(price_too_expensive)) |>
  ggplot() +
  aes(x = milk_brand, y = mean_price) +
  geom_col() +
  labs(x = "Brand shown", y = "Mean: too expensive from (€)")
```

### A boxplot that says what is missing

The boxplot shows only the prices up to 10 € and in them the medians,
1.99 € and 2.00 €, and `caption` names what was left out: 20 of 611 answers
above 10 €, up to 999 €. Whoever reads the chart can thus decide for
themselves whether the cut at 10 € is right:

```r
survey |>
  filter(price_too_expensive <= 10) |>
  ggplot() +
  aes(x = milk_brand, y = price_too_expensive) +
  geom_boxplot() +
  labs(
    x = "Brand shown", y = "Too expensive from (€)",
    caption = "Left out: 20 of 611 answers above 10 €, up to 999 €"
  )
```

### Angles instead of lengths

A pie chart keeps to proportional ink, since every slice is as large as its
share, but it makes the comparison hard. Here `coord_polar()` bends a
stacked bar of the five diets into a circle, and whether pescetarians and
vegans are equally many can hardly be told:

```r
survey |>
  filter(!is.na(diet)) |>
  count(diet) |>
  ggplot() +
  aes(x = "", y = n, fill = diet) +
  geom_col() +
  coord_polar(theta = "y") +
  labs(x = NULL, y = NULL, fill = NULL)
```

### Sorted bars

The same numbers as bars, sorted by count. Lengths are easier to compare
than angles, and the two smallest groups with 36 people each now visibly
stand equally long one above the other:

```r
survey |>
  filter(!is.na(diet)) |>
  count(diet) |>
  ggplot() +
  aes(x = n, y = fct_reorder(diet, n)) +
  geom_col() +
  labs(x = "Number of respondents", y = NULL)
```

## Manipulation gallery

Whoever has built a misleading chart once spots the tricks faster
afterwards. In this group activity each group gets a false or misleading
claim about the survey and builds a chart that seems to prove it, without
faking a single number. The claims:

- "Vegans are the biggest organic shoppers in the country."
- "People would pay far more for Alpro than for Weihenstephan."
- "Women are far more eco-conscious than men."
- "Oatly has by far the worst reputation of all brands."
- "Older people drink milk daily far more often than younger ones."
- "TikTok users hardly drink milk any more."

How to proceed:

1. Draw a claim and check it first with `count()`, `group_by()` and
   `summarise()`, so that you know what the data really say.
2. Build a chart in the code box below that seems to prove the claim.
   Everything from this lesson is allowed: a cut axis, selected groups,
   counts instead of shares, means with outliers and a title that promises
   more than the data carry.
3. Show your chart to the other groups without the code. They name the
   trick and say which number they would need to check the claim.
4. Then build the honest version and put it next to the misleading one.

The code box only holds the frame. `geom_col()` fits when you compute one
value per group with `summarise()` first; when ggplot2 counts by itself, use
`geom_bar()`, and for distributions `geom_boxplot()`.

```r
survey |>
  filter() |>
  group_by() |>
  summarise() |>
  ggplot() +
  aes() +
  geom_col()
```

> [!SOLUTION]
> What the data say about the six claims and which trick suggests itself:
>
> - **Vegans:** With 56 % they shop in organic stores most often as a
>   share, but among the 355 organic store customers with a stated diet there
>   are only 20 vegans, against 150 flexitarians and 147 omnivores. "In the
>   country" does not fit anyway, since the sample comes from an online
>   panel. The obvious trick is shares without group sizes under a title that
>   speaks of the "biggest shoppers".
> - **Alpro:** The means are 9.07 € and 7.25 €, because outliers of up to
>   999 € are included; the medians are 2.00 € and 1.99 €. Obvious tricks are
>   means with outliers or medians with a cut axis.
> - **Women and men:** On the scale from −2 to +2 the mean of
>   `eco_conscious` is 0.57 and 0.45, the median is 1 for both, and 54 % of
>   women against 51 % of men agree. The obvious trick is an axis starting
>   at 0.4.
> - **Oatly:** The mean quality rating (`brand_quality`) is 0.48, 0.56 for
>   Gut&Günstig and between 0.84 and 0.99 for the other brands; all are
>   positive. The obvious trick is an axis from 0.45, in which Oatly almost
>   disappears.
> - **Older people:** Under 60, 61 % of those asked about milk drink it
>   daily, from 60 on also 61 %. Comparing only those aged 18 to 29 (52 %)
>   with those aged 40 to 49 (68 %) finds a difference that does not exist
>   between young and old. The trick is the choice of groups.
> - **TikTok:** Of those who use TikTok daily, 60 % drink milk daily, of
>   those who never use it, 63 %. Only the 45 people who use TikTok monthly
>   come to 36 %. The trick is to pick the small group and to hide its size;
>   on top of that, only about half of the respondents were asked about
>   TikTok.

## Key points

- The ink must be proportional to the value it shows: bars and areas start
  at zero, while points and lines show their value by position and may
  start elsewhere.
- A cut or inverted axis changes the picture without changing a number, so
  with every chart you read the axes first.
- Counts show the size of the groups and shares how common something is
  within a group; whoever shows shares gives the group sizes as well.
- You size bubbles by their area with `scale_size_area()`, never by the
  radius, and where you can, you use lengths instead of areas or angles.
- What you leave out, or what distorts a mean, you state in the chart, for
  instance with `caption`.

![Quiz: Charts that mislead](item:misleading-charts-quiz)

## Sources and further reading

Claus O. Wilke: *Fundamentals of Data Visualization*, chapter 17 "The
principle of proportional ink", free to read at
<https://clauswilke.com/dataviz/proportional-ink.html>.

Carl T. Bergstrom and Jevin D. West: *Calling Bullshit. The Art of
Skepticism in a Data-Driven World*. Random House, 2020. Their page on
proportional ink is at
<https://www.callingbullshit.org/tools/tools_proportional_ink.html>.

The tax bar ran in July 2012 on the programme *Cavuto* on Fox Business; it
was described by Media Matters
(<https://www.mediamatters.org/fox-business/dishonest-fox-chart-bush-tax-cut-edition>)
and FlowingData
(<https://flowingdata.com/2012/08/06/fox-news-continues-charting-excellence/>),
which also names the axis from 34 %.

The Florida chart appeared at Reuters in February 2014 and was reprinted by
Business Insider, among others. The numbers are the murders with firearms
that the Florida Department of Law Enforcement publishes every year, for the
years 1990 to 2012.
