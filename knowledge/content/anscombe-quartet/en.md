---
title: Anscombe's quartet
summary: >-
  Four small data sets of eleven points each that share their means,
  standard deviations and correlation and still look completely different as
  scatter plots.
translation_of: de
based_on: 2026-11-16
---

The statistician Francis Anscombe published these four data sets in 1973 in
his paper [[anscombe-graphs-in-statistical-analysis]] to show that data must
be plotted before one believes their statistics. The lesson
[[why-visualise]] computes the statistics and draws the four scatter plots.

R has the quartet built in, as the table `anscombe` in the package datasets,
which is always loaded; in Positron you therefore do not need the file. The
CSV file holds exactly this table for every other tool, such as Python or a
spreadsheet, and whoever reads it into R gets the same columns under the
same name.

## The columns

Every row holds one point of each of the four data sets, and the digit in
the column name says which data set a value belongs to.

| Column | Content |
|---|---|
| `x1`, `y1` | data set 1: a cloud running diagonally upwards |
| `x2`, `y2` | data set 2: an arc |
| `x3`, `y3` | data set 3: a straight line with one outlier |
| `x4`, `y4` | data set 4: ten points with the same x value and one far to the right |

The columns `x1`, `x2` and `x3` are equal. In all four data sets the mean of
x is 9 and that of y 7.50, the standard deviations are 3.32 and 2.03, and
the correlation is 0.82.

For ggplot2 the table needs the long form with a column for the data set;
the lesson [[why-visualise]] shows how `pivot_longer()` produces it.
