---
title: "Same numbers, different pictures: the shapes"
summary: >-
  Nine point clouds of 142 points each, from the cloud via the star to the
  heart, all with the same means, standard deviations and correlation: the
  data of the demonstrator to recompute and plot.
translation_of: de
based_on: 2026-11-16
---

These are the points of the demonstrator [[same-stats-demo]] from the lesson
[[why-visualise]]. We made them for this platform with the method of Justin
Matejka and George Fitzmaurice ([[matejka-same-stats-different-graphs]]): a
point cloud is moved point by point towards a shape, and a move is kept only
if the means, standard deviations and correlation do not change to two
decimals. They are not the data of the "Datasaurus Dozen" from the paper.

## The columns

Every row is one point in one shape.

| Column | Content |
|---|---|
| `shape` | the shape: `cloud`, `circle`, `bullseye`, `star`, `heart`, `cross`, `h-lines`, `v-lines` or `slant` |
| `point` | the number of the point, 1 to 142 |
| `x`, `y` | the position of the point, between 0 and 100 with two decimals |

All shapes grew from the same cloud, so point 17 of the cloud belongs to
point 17 of every other shape. That is how the demonstrator can move every
point from one picture to the next.

## Recompute and plot

The statistics per shape, as in the lesson for Anscombe's quartet:

```r
same_stats_shapes |>
  group_by(shape) |>
  summarize(
    mean_x = mean(x),
    mean_y = mean(y),
    sd_x = sd(x),
    sd_y = sd(y),
    r = cor(x, y)
  )
```

The means and standard deviations are the same in every row, and the
correlation is around −0.06 everywhere. Rounded to two decimals, they are
48.26 and 51.83 for the means, 19.64 and 20.37 for the standard deviations
and −0.06 for the correlation. Only the picture shows the difference:

```r
same_stats_shapes |>
  ggplot() +
  aes(x = x, y = y) +
  geom_point(size = 0.8) +
  facet_wrap(vars(shape))
```
