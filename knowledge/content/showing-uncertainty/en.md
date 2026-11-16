---
title: Showing uncertainty
summary: >-
  A mean from a sample is an estimate whose precision depends on spread and
  sample size. With `summarize()` you calculate the standard error per group
  and show it with `geom_pointrange()` as a point with error bars, using the
  brand experiment and the diets of the compact milk survey.
objectives:
  intro: "In this lesson you learn to calculate and show the uncertainty of a mean, and afterwards you can:"
  goals:
    - "calculate the mean, standard deviation, sample size and standard error per group with `group_by()` and `summarize()`"
    - "explain why the standard error grows with the spread and shrinks with the sample size, and form an approximate 95 % interval from the mean ± 2 standard errors"
    - "show means as points with error bars with `geom_pointrange()` and write the sample size of each group into the labels"
    - "tell the standard deviation from the standard error and state what the lines of a chart show"
    - "explain why overlapping intervals do not prove equality and separate intervals do not replace a test"
translation_of: de
based_on: 2026-11-16
---

Every mean from a survey is an estimate, since other people answering would
have given a slightly different number. A chart that only shows the mean
hides how precise this estimate is. This lesson shows you how to calculate
the uncertainty with the tools from [[dplyr-summarize]] and make it visible
with ggplot2, without any extra package.

## A mean alone is not enough

In the brand experiment of the survey, respondents were shown one of seven
milk brands, chosen at random, and rated its quality in `brand_quality` from
−2 (low) to +2 (high). The code calculates the mean per brand and draws it as
bars:

```r
survey |>
  filter(!is.na(brand_quality)) |>
  group_by(rated_brand) |>
  summarize(mean_rating = mean(brand_quality)) |>
  ggplot() +
  aes(x = mean_rating, y = fct_reorder(rated_brand, mean_rating)) +
  geom_col() +
  labs(x = "Mean quality rating (-2 to +2)", y = NULL)
```

Oatly is at the bottom with 0.48, Bärenmarke at the top with 0.99, and in
between stand five bars that hardly differ. Each bar rests on 315 to 339
ratings, and a second survey with other people would give somewhat different
means. Whether Bärenmarke really ranks above Fockenbrock or only in this
sample is something the bars cannot tell, because they show no uncertainty.

## How precise is a mean?

How much a mean would vary from sample to sample depends on two things: how
widely the single answers spread, measured by the standard deviation, and how
many answers there are. Both are part of the **standard error**, the standard
deviation divided by the square root of the sample size, in R
`sd / sqrt(n)`. A mean from many similar answers is therefore more precise
than one from a few widely scattered ones, and because the sample size sits
under the square root, it takes four times as many answers to halve the
standard error.

### Everything in one table

With `group_by()` and `summarize()` you calculate the mean, standard
deviation, sample size and standard error per brand, and from the standard
error the lower and upper limit of an interval:

```r
survey |>
  filter(!is.na(brand_quality)) |>
  group_by(rated_brand) |>
  summarize(
    mean_rating = mean(brand_quality),
    sd_rating = sd(brand_quality),
    n = n(),
    se = sd_rating / sqrt(n),
    lower = mean_rating - 2 * se,
    upper = mean_rating + 2 * se
  ) |>
  arrange(desc(mean_rating))
```

`summarize()` calculates the columns in order, so `se` can already use
`sd_rating` and `n`, and `lower` and `upper` can use `se`. All seven brands
have a similar number of ratings and a similar spread, so the standard error
is about 0.05 everywhere. The limits reach two standard errors below and
above the mean, for Bärenmarke from 0.89 to 1.10 and for Oatly from 0.38 to
0.59.

### The rule of thumb: mean ± 2 standard errors

The interval from two standard errors below to two standard errors above the
mean is an approximate 95 % interval: in about 95 of 100 samples, an interval
built this way would include the mean you would get if you could ask
everyone the sample stands for. It describes how precisely the mean is
estimated, not where the single answers lie; for Oatly, not a single rating
lies between 0.38 and 0.59, because the scale only has whole steps.

> [!NOTE]
> Mean ± 2 standard errors is a simplified rule of thumb, not an exact test.
> It rests on the normal approximation, whose exact factor is 1.96; for small
> groups it would be somewhat larger, 2.03 for 36 people. It also assumes a
> random sample, while the milk survey is a quota sample, which is one more
> reason why the interval only gives an approximate picture.

## Points with error bars

`geom_pointrange()` draws a point at the mean for each group and a line from
`xmin` to `xmax`. The table from before goes straight into `ggplot()`, and
the caption says what the lines show:

```r
survey |>
  filter(!is.na(brand_quality)) |>
  group_by(rated_brand) |>
  summarize(
    mean_rating = mean(brand_quality),
    se = sd(brand_quality) / sqrt(n()),
    lower = mean_rating - 2 * se,
    upper = mean_rating + 2 * se
  ) |>
  ggplot() +
  aes(
    x = mean_rating,
    xmin = lower,
    xmax = upper,
    y = fct_reorder(rated_brand, mean_rating)
  ) +
  geom_pointrange() +
  labs(
    x = "Mean quality rating (-2 to +2)",
    y = NULL,
    caption = "Points: mean; lines: mean ± 2 standard errors"
  )
```

Now you see what the bars kept quiet about: the intervals of the top five
brands overlap a lot, so their order could well come out differently in
another sample, while Gut&Günstig and Oatly lie clearly below them. Unlike
bars, points need not start at zero, because they show their value by their
position and not by a length. If you prefer crossbars at the ends, replace
`geom_pointrange()` with the two layers `geom_errorbar(width = 0.2)` and
`geom_point()`.

> [!IMPORTANT]
> Error bars can show one standard deviation, one standard error or two
> standard errors, and without saying which, such a chart cannot be read.
> What the lines mean therefore belongs in the labels.

## Small groups, wide intervals

How much the sample size matters shows in the diets, whose groups differ a
lot in size. The table calculates the same figures per diet for the
statement "When buying food, I prefer organic products" (`prefers_organic`,
−2 to +2):

```r
survey |>
  filter(!is.na(diet), !is.na(prefers_organic)) |>
  group_by(diet) |>
  summarize(
    mean_rating = mean(prefers_organic),
    sd_rating = sd(prefers_organic),
    n = n(),
    se = sd_rating / sqrt(n),
    lower = mean_rating - 2 * se,
    upper = mean_rating + 2 * se
  ) |>
  arrange(desc(n))
```

The standard deviation is almost the same for omnivores and vegans, 1.20 in
both groups, and yet the standard error of the vegans is about seven times as
large, 0.20 instead of 0.028. That is due to the sample size alone, since 36
vegans face 1,819 omnivores, and the square root of the ratio of the two is
7.1.

### The picture

The same code as for the brands, with `diet` instead of `rated_brand` and
`prefers_organic` instead of `brand_quality`, draws the diets as points with
error bars:

```r
survey |>
  filter(!is.na(diet), !is.na(prefers_organic)) |>
  group_by(diet) |>
  summarize(
    mean_rating = mean(prefers_organic),
    se = sd(prefers_organic) / sqrt(n()),
    lower = mean_rating - 2 * se,
    upper = mean_rating + 2 * se
  ) |>
  ggplot() +
  aes(
    x = mean_rating,
    xmin = lower,
    xmax = upper,
    y = fct_reorder(diet, mean_rating)
  ) +
  geom_pointrange() +
  labs(
    x = "\"I prefer organic products\" (-2 to +2)",
    y = NULL,
    caption = "Points: mean; lines: mean ± 2 standard errors"
  )
```

The interval of the vegans reaches from 0.60 to 1.40 and is thus 0.80 wide,
that of the omnivores only 0.11. The vegans' mean is the highest, but how
high it would be among all vegans the sample stands for can only be told
roughly from 36 answers. Replace `prefers_organic` everywhere with
`eco_conscious`: the order of the middle groups changes, while the wide
intervals of the small groups remain.

## The sample size belongs in the picture

A point with a narrow interval and one with a wide interval look equally
weighty as long as nobody knows how many answers they rest on. The code
therefore writes the sample size into the label of each group, and
`paste0()` glues name and number into one text for this:

```r
survey |>
  filter(!is.na(diet), !is.na(prefers_organic)) |>
  group_by(diet) |>
  summarize(
    mean_rating = mean(prefers_organic),
    n = n(),
    se = sd(prefers_organic) / sqrt(n),
    lower = mean_rating - 2 * se,
    upper = mean_rating + 2 * se
  ) |>
  mutate(label = paste0(diet, " (n = ", n, ")")) |>
  ggplot() +
  aes(
    x = mean_rating,
    xmin = lower,
    xmax = upper,
    y = fct_reorder(label, mean_rating)
  ) +
  geom_pointrange() +
  labs(
    x = "\"I prefer organic products\" (-2 to +2)",
    y = NULL,
    caption = "Points: mean; lines: mean ± 2 standard errors"
  )
```

Now you read along that the highest point rests on 36 people, and the wide
interval has its explanation right next to it. Writing the sample size into
the labels costs one line and keeps you from reading a small group like a
large one.

## What overlap means and what it does not

It is tempting to read two intervals like a test, as if overlapping meant
"no difference" and being apart meant "a difference". Neither is quite right:

- **Overlap does not prove equality.** The intervals of Bärenmarke (0.89 to
  1.10) and Milchhof Müller regional (0.74 to 0.94) overlap, and yet a
  statistical test would rate the difference of 0.15 between them as
  unlikely to be chance, because the difference of two means is less
  uncertain than the two intervals together suggest. For pescetarians and
  vegans, the overlap mainly says that 36 answers per group are too few to
  detect a difference or rule one out.
- **Separate intervals are not yet a test.** The rule of thumb is an
  approximation, and comparing seven brands means comparing 21 pairs, among
  which some look different by chance alone.

Whether a difference goes beyond chance is answered by a statistical test,
such as the t-test for two means. That is a topic of its own among the
statistical methods that follow this lesson; here it is enough that you read
error bars as an honest picture of uncertainty and not as a verdict.

## Key points

- A mean from a sample is an estimate, and a chart that only shows the mean
  hides how precise it is.
- The standard error is the standard deviation divided by the square root of
  the sample size, so it grows with the spread and shrinks with the number of
  answers, to half with four times as many answers.
- Mean ± 2 standard errors gives, as a simplified rule of thumb, an
  approximate 95 % interval for the mean, not for the single answers.
- `geom_pointrange()` shows the mean and the interval as a point with a line,
  and the labels say what the line shows and how many answers each point
  rests on.
- Overlapping intervals do not prove equality and separate ones do not
  replace a test, since only a statistical test decides whether a difference
  goes beyond chance.

![Quiz: Showing uncertainty](item:showing-uncertainty-quiz)

## Further reading

Claus O. Wilke: [[fundamentals-of-data-visualization]], chapter 16
"Visualizing uncertainty", free to read at
<https://clauswilke.com/dataviz/visualizing-uncertainty.html>. Besides error
bars, the chapter shows other ways of displaying uncertainty, and like the
whole book it is built with ggplot2.
