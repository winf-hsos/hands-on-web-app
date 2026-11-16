---
title: Datasaurus Dozen
summary: >-
  A dinosaur made of 142 points and twelve more pictures, from the star to
  the bullseye, with almost the same means, standard deviations and the same
  correlation: the most famous example of statistics hiding the shape of
  data.
translation_of: de
based_on: 2026-11-16
---

The information designer Alberto Cairo drew the dinosaur from 142 points in 2016.
In 2017, Justin Matejka and George Fitzmaurice moved it point by point into
twelve other pictures in their paper [[matejka-same-stats-different-graphs]],
without the means, standard deviations and correlation changing in any
noticeable way. The lesson [[why-visualise]] computes the statistics and
draws all 13 pictures.

The file comes from the R package
[datasauRus](https://cran.r-project.org/package=datasauRus) (MIT licence),
where the same table is called `datasaurus_dozen`. If you read the CSV file
under this name, you can run the code of the lesson unchanged.

## The columns

Every row is one point in one of the 13 pictures.

| Column | Content |
|---|---|
| `dataset` | the picture: `dino`, `away`, `h_lines`, `v_lines`, `x_shape`, `star`, `high_lines`, `dots`, `circle`, `bullseye`, `slant_up`, `slant_down` or `wide_lines` |
| `x`, `y` | the position of the point, both between 0 and 100 |

Unlike the shapes in [[same-stats-shapes]], the statistics agree not to two
decimals but only to one.

## Recompute and plot

```r
datasaurus_dozen |>
  group_by(dataset) |>
  summarize(
    mean_x = mean(x),
    mean_y = mean(y),
    sd_x = sd(x),
    sd_y = sd(y),
    r = cor(x, y)
  )
```

Rounded to one decimal, every row says the same: 54.3 and 47.8 for the
means, 16.8 and 26.9 for the standard deviations, and the correlation lies
between −0.06 and −0.07.

```r
datasaurus_dozen |>
  ggplot() +
  aes(x = x, y = y) +
  geom_point(size = 0.8) +
  facet_wrap(vars(dataset))
```
