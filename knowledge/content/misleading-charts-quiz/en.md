---
title: "Quiz: Charts that mislead"
summary: >-
  Eight questions on proportional ink, cut and inverted axes, counts and
  shares, bubbles and outliers, each with its reasons.
translation_of: de
based_on: 2026-11-16
---

## What does the principle of proportional ink say? {#hds-030}

- [x] When an area or a length represents a value, it must be proportional to that value.
  > Correct: a value twice as large gets twice as much ink; it follows, for instance, that bars start at zero and bubbles are sized by their area.
- [ ] A chart should use as little ink as possible.
  > Sparing design is a different idea; proportional ink does not ask how much ink a chart uses but whether the ink matches the value it shows.
- [ ] Every group in a chart gets a colour of its own in equal strength.
  > The principle is about areas and lengths that carry a value, not about the choice of colours.
- [ ] Every axis of a chart must start at zero.
  > That only holds where a length or an area shows the value, as with bars; points and lines show their value by position, and their axis may start elsewhere.

> Where an area or a length shows a value, it must be proportional to it; that is the principle of proportional ink after Bergstrom and West.

## Why may the y-axis of a line chart start at 34 % but not that of a bar chart? {#hds-031}

- [ ] Because ggplot2 cannot draw zero for lines.
  > ggplot2 can start any axis at zero; the difference lies in how a line and a bar show their value.
- [ ] Because lines are only used for time series.
  > Lines often show time series, but that does not explain why the axis need not start at zero; what matters is that no length carries the value.
- [x] A bar shows its value by its length, a line by its position.
  > Correct: if the axis under bars is cut, the lengths no longer match the values; with a line, the position is read off the labelled axis, and no length misleads.
- [ ] Because percentages never start at zero.
  > Percentages can very well be zero; the rule depends on the form of the chart, not on the unit.

> Bars carry their value as a length and therefore start at zero; points and lines carry it as a position, and their axis may start elsewhere.

## 1,451 people drink milk daily, 682 weekly. In a bubble chart, the radius of each bubble is proportional to the count (`scale_radius()`). How much larger does the bubble for daily look? {#hds-032}

- [ ] A little more than twice as large, as the numbers say
  > The area would be twice as large if it were proportional to the count, as with `scale_size_area()`; here it is the radius.
- [x] About four and a half times as large, because the area grows with the square of the radius
  > Correct: the radius is 1,451 / 682 ≈ 2.1 times as large, so the area about 2.1² ≈ 4.5 times, and the eye compares the areas.
- [ ] The same size, because bubbles only show position
  > In a bubble chart it is precisely the size that carries the value; the position only shows the category here.
- [ ] Eight times as large, because bubbles are read as spheres
  > The bubbles are flat circles, and the eye compares their area; the square of the ratio of about 2.1 gives about 4.5.

> Sizing the radius by the value squares the impression; `scale_size_area()` makes the area proportional to the value.

## A bar chart on US television showed the top tax rates of 35 % and 39.6 % on an axis that began at 34 %. How do the visible bar lengths relate to each other? {#hds-033}

- [ ] The second bar is about 1.13 times as long as the first.
  > That would be the ratio on an axis from zero, 39.6 / 35; from 34 % only 1 percentage point of the first bar remains visible and 5.6 of the second.
- [ ] Both bars are equally long, because ggplot2 adjusts the axis.
  > An axis from 34 % does not make the values equal; it even enlarges the difference.
- [x] The second bar is 5.6 times as long as the first.
  > Correct: what is visible is 39.6 − 34 = 5.6 against 35 − 34 = 1 percentage point; a difference of 13 % thus becomes almost six times as much.
- [ ] The second bar is 4.6 times as long as the first.
  > 4.6 is the difference in percentage points; the lengths above the axis from 34 % are 1 and 5.6.

> Under a cut axis a bar only shows what is left above the cut, and the ratio of the lengths no longer has anything to do with that of the values.

## In a chart of the murders with firearms in Florida, the y-axis ran from top to bottom, with zero at the top (`scale_y_reverse()`). After 2005 the line falls steeply. What actually happened after 2005? {#hds-034}

- [ ] The number of murders with firearms fell sharply.
  > That is how the picture reads if you miss the inverted axis; since zero lies at the top, a line going down means more murders.
- [ ] The number stayed the same, only the scale changed.
  > The scale is the same across the whole chart, only inverted; the line moves because the numbers change.
- [ ] The 2005 law demonstrably led to more murders.
  > The chart shows a rise after 2005 but no cause; that would take a comparison, for instance with states without such a law.
- [x] The number of murders with firearms rose clearly, from 521 to 825 in 2007.
  > Correct: with an inverted axis, "down" means "more"; with zero at the bottom, the same series shows a steep rise.

> An inverted axis reverses the reading direction without changing a number; read the axes first before you believe a line.

## In the survey, 147 omnivores and 20 vegans shop in an organic store. Altogether there are 1,826 omnivores and 36 vegans. Which chart answers the question of which diet is most likely to shop in an organic store? {#hds-035}

- [ ] Bars with the number of organic store customers per diet
  > The counts mainly show how large the groups are; that the omnivores lead only says that there are many of them.
- [ ] A pie chart of the organic store customers by diet
  > The pie also shows what the customers are made of, so again counts, and in angles that are harder to compare than lengths.
- [x] Bars with the share of organic store customers per diet, with the group size in the label
  > Correct: 56 % of vegans against 8 % of omnivores answer the question of "most likely"; the group size shows that only 36 people stand behind the longest bar.
- [ ] Bars with the number of all respondents per diet
  > This chart says nothing about organic stores, only how many people follow each diet.

> Counts show the size of the groups, shares how common something is within a group; whoever shows shares gives the group sizes as well.

## The mean price limit is 7.25 € for Weihenstephan and 9.07 € for Alpro, the medians are 1.99 € and 2.00 €. A bar chart of the means starts at zero. Why does it still mislead? {#hds-036}

- [x] The means include single answers such as 344 € and 999 €, which decide the picture without the chart saying so.
  > Correct: a few extreme answers pull the mean up, while the median stays at about 2 €; a median or boxplot is better, and what is left out goes into `caption`.
- [ ] Because bars for prices must never start at zero.
  > Bars always start at zero, also for prices; the deception here lies not in the axis but in the value the bars show.
- [ ] Because Alpro really is a quarter more expensive and the chart understates it.
  > The medians lie only one cent apart; the gap between the means comes from a few extreme answers, not from the majority of respondents.
- [ ] Because means may only be shown as a pie chart.
  > A pie chart shows parts of a whole, not means; the problem is the outlier in the mean, not the form of the chart.

> A mean with outliers can mislead even when the axis is right; a median or boxplot and a note on what was left out show more honestly.

## The code shows the medians of the price limit, 1.99 € and 2.00 €, as bars. Which change turns it into an honest chart? {#hds-037}

```r static
survey |>
  filter(!is.na(price_too_expensive)) |>
  group_by(milk_brand) |>
  summarise(median_price = median(price_too_expensive)) |>
  ggplot() +
  aes(x = milk_brand, y = median_price) +
  geom_col() +
  coord_cartesian(ylim = c(1.98, 2.01))
```

- [x] Remove the line with `coord_cartesian()`, so that the bars start at zero
  > Correct: without the limits 1.98 to 2.01 the bars start at zero, and the difference of one cent looks as small as it is.
- [ ] Replace `geom_col()` with `geom_bar()`
  > `geom_bar()` counts rows instead of showing the medians, and it changes nothing about the cut axis.
- [ ] Narrow the limits to `ylim = c(1.99, 2.00)`
  > The axis then starts exactly at the smaller value, and its bar shrinks to almost nothing; the difference looks even larger.
- [ ] Replace `median()` with `mean()`
  > The means of 7.25 € and 9.07 € include outliers up to 999 € and would reach far beyond the limits; that does not remove the deception but adds a second one.

> `coord_cartesian(ylim = …)` under bars cuts the axis; without that line, bars in ggplot2 start at zero by themselves.
