---
title: The case for data visualisation
summary: >-
  Mean, standard deviation and correlation summarise data and lose their
  shape on the way: four small data sets and nine point clouds with the same
  statistics show why you have to look at data before you believe their
  numbers.
objectives:
  intro: "In this lesson you see what summary statistics keep quiet about, and afterwards you can:"
  goals:
    - "explain which information mean, standard deviation and correlation keep and which they lose"
    - "show with Anscombe's quartet that the same statistics can belong to completely different data"
    - "argue why a chart belongs before and after every calculation when exploring data"
translation_of: de
based_on: 2026-11-16
---

Nobody reads a table of 2,809 rows row by row, so we summarise it: with
`summarize()` a column becomes a mean, a standard deviation or, for two
columns, a correlation. Such statistics are useful because they press a lot
into a few numbers, but exactly then something gets lost, namely the shape
of the data: where they cluster, whether they fall into groups, whether a
single value shifts everything. This lesson shows with two famous examples
how much that can be, and so argues why the rest of this path shows data
instead of only describing them.

## Four data sets, one summary

In 1973 the statistician Francis Anscombe published four small data sets of
eleven points each to convince his colleagues that they should plot their
data. They are ready in R as the table `anscombe`, with the columns `x1` to
`x4` and `y1` to `y4`. The first lines of the code bring them into the long
form with a column `set` for the data set, as you know it from the lesson on
tidy data; then `summarize()` computes means, standard deviations and the
correlation for each of the four data sets.

```r
anscombe |>
  pivot_longer(
    everything(),
    names_to = c(".value", "set"),
    names_pattern = "(.)(.)"
  ) |>
  group_by(set) |>
  summarize(
    mean_x = mean(x),
    mean_y = mean(y),
    sd_x = sd(x),
    sd_y = sd(y),
    r = cor(x, y)
  )
```

All four have the same mean of x (9) and almost the same mean of y (7.50),
the same standard deviations (3.32 and 2.03) and the same correlation of
0.82. Whoever sees only this table takes the four data sets to be the same.

### The same data as a picture

The same beginning, but instead of `summarize()` a scatter plot per data
set, side by side with `facet_wrap()`, and in each the straight line that
fits the points best:

```r
anscombe |>
  pivot_longer(
    everything(),
    names_to = c(".value", "set"),
    names_pattern = "(.)(.)"
  ) |>
  ggplot() +
  aes(x = x, y = y) +
  geom_point() +
  geom_smooth(method = "lm", formula = y ~ x, se = FALSE) +
  facet_wrap(vars(set))
```

Only the first data set looks the way one imagines a correlation of 0.82: a
cloud running diagonally upwards. In the second the points lie on a curve,
for which a straight line is the wrong model. In the third, ten points lie
exactly on a line and a single outlier tilts it. In the fourth, ten points
share the same x value, and a single point on the right creates the whole
correlation. Four different stories are hidden in the same summary.

## Same numbers, different pictures

Anscombe built his data sets by hand. In 2017 Justin Matejka and George
Fitzmaurice showed that any number of pictures can be found for any given
statistics: a program moves a point cloud point by point towards a shape and
keeps a move only if the means, standard deviations and correlation do not
change to two decimals. The demonstrator shows shapes made with this method.
Hide the points first and think about what the data could look like from
the statistics alone; then let the points travel from shape to shape and
watch what changes in the numbers on the right.

![Same numbers, different pictures](item:same-stats-demo)

The statistics stay put while the cloud turns into a circle, a star or a
heart. A mean and a standard deviation therefore cannot tell whether data
form a cloud, two lines or a bullseye, and a correlation near zero does not
mean that there is no relationship, only that it is not a straight line.

## What follows from it

Summary statistics are not wrong, they only answer a narrower question than
people often credit them with. Three habits follow for every analysis:

- **Plot first, then summarise.** A chart shows whether a mean describes
  the data well at all or whether groups, curves and outliers call for a
  different summary.
- **Plot again after calculating.** A correlation or a comparison of groups
  is only credible when the picture agrees with it.
- **Never report a statistic alone.** Whoever gives a mean gives the spread
  and the number of cases as well, or shows the distribution as a chart
  right away.

When exploring, transforming and visualising therefore take turns all the
time, as the lesson [[exploratory-data-analysis-basics]] describes as a
cycle. How to find the right chart for a variable and build it with ggplot2
is shown by the next lesson, [[data-visualisation-basics]].

## Key points

- Mean, standard deviation and correlation summarise data and lose their
  shape on the way.
- Anscombe's four data sets have the same statistics and look completely
  different: a cloud, a curve, a line with an outlier and a single point
  that creates the correlation.
- Any number of pictures fit the same statistics, as the shapes of Matejka
  and Fitzmaurice show.
- A chart belongs before and after every calculation, and a statistic never
  stands without spread and number of cases.

## Further reading

- [[anscombe-graphs-in-statistical-analysis]]: the paper with the quartet,
  short and easy to read.
- [[matejka-same-stats-different-graphs]]: the method behind the shapes of
  the demonstrator, with the "Datasaurus Dozen".
