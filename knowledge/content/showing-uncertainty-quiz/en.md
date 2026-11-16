---
title: "Quiz: Showing uncertainty"
summary: >-
  Five questions on the standard error, error bars and what can and cannot be
  concluded from overlapping intervals, each with its reason.
translation_of: de
based_on: 2026-11-16
---

## What does the standard error of a mean, which you calculate with `sd(x) / sqrt(n())`, depend on? {#hds-038}

- [ ] Only on the number of values.
  > The sample size is in the denominator, but the standard deviation is in the numerator, so with the same sample size widely spread answers give a larger standard error than similar ones.
- [x] On the spread of the single values and on the number of values.
  > Correct: it grows with the standard deviation and shrinks with the square root of the sample size, so it takes four times as many values to halve it.
- [ ] On the size of the mean: the larger the mean, the larger the standard error.
  > The mean does not appear in the formula; if you shift all answers by one step, the mean changes but the standard error does not.
- [ ] Only on the standard deviation.
  > The standard deviation is divided by the square root of the sample size, which is why vegans and omnivores have very different standard errors for `prefers_organic` despite almost the same standard deviation of 1.20.

> The standard error is the standard deviation divided by the square root of the sample size; it grows with the spread and shrinks with the number of answers.

## For `prefers_organic` (−2 to +2), omnivores and vegans have almost the same standard deviation of 1.20. Yet the interval mean ± 2 standard errors is 0.80 wide for the vegans and only 0.11 for the omnivores. Why? {#hds-039}

- [ ] Vegans agree less among themselves than omnivores.
  > Then their standard deviation would be larger, but it is almost the same in both groups, 1.20.
- [ ] The vegans have a higher mean, and a higher mean has a wider interval.
  > The size of the mean does not enter the standard error; only the spread and the sample size determine it.
- [x] The sample size: 36 vegans face 1,819 omnivores.
  > Correct: with the same spread the sample size decides, and since the square root of 1,819 / 36 is about 7.1, the standard error of the vegans is about seven times as large, 0.20 instead of 0.028.
- [ ] The vegans were chosen at random, the omnivores were not.
  > The diet was not assigned but asked, and that holds for all groups alike; the width of the interval comes from the sample size.

> Small groups have wide intervals even when their answers do not spread more, which is why the sample size belongs in the chart.

## In a chart made with `geom_pointrange()`, the point for Oatly is at 0.48 and the line reaches from 0.38 to 0.59. The caption reads "Points: mean; lines: mean ± 2 standard errors". What does the line show? {#hds-040}

- [ ] That 95 % of the respondents rated Oatly between 0.38 and 0.59.
  > The line describes the mean, not the single answers, and in fact not a single rating lies in this range, because the scale only has whole steps from −2 to +2.
- [x] How precisely the mean of the Oatly ratings is estimated, as an approximate 95 % interval for the mean.
  > Correct: the line reaches two standard errors below and above the mean and so describes how much the mean would vary from sample to sample.
- [ ] The lowest and the highest rating of Oatly.
  > The ratings of Oatly range from −2 to +2; the line is much shorter because it is calculated from the standard error.
- [ ] One standard deviation below and above the mean.
  > The standard deviation of the Oatly ratings is 0.96, so such a line would be almost two steps long; according to the caption it shows two standard errors of about 0.05 each.

> A line made of standard errors describes the precision of the mean, not the spread of the answers, and what it shows is stated in the labels.

## What does the rule of thumb mean ± 2 standard errors roughly give? {#hds-041}

- [ ] The range in which 95 % of the single answers lie.
  > That would need the standard deviation instead of the standard error; the interval from standard errors describes the mean and is much narrower than the spread of the answers.
- [ ] An exact test result on whether two groups differ.
  > The rule of thumb is an approximation, not a test; whether two means differ beyond chance is answered by a statistical test.
- [x] An approximate 95 % interval for the mean.
  > Correct: as a simplified rule of thumb, based on the normal distribution with its exact factor of 1.96, an interval built this way includes the mean of the population in about 95 of 100 samples.
- [ ] An approximate 68 % interval for the mean.
  > About 68 % holds for an interval from one standard error below to one above the mean; with two standard errors it is about 95 %.

> Mean ± 2 standard errors is an approximate 95 % interval for the mean, a simplified rule of thumb and not a test.

## In the brand experiment, the interval mean ± 2 standard errors reaches from 0.89 to 1.10 for Bärenmarke and from 0.74 to 0.94 for Milchhof Müller regional. What follows from the overlap? {#hds-042}

- [ ] The two brands are rated equally well among everyone the sample stands for.
  > Overlap does not prove equality, since two intervals can overlap even though the means differ beyond chance.
- [ ] Bärenmarke is certainly rated better, because its point is higher.
  > The higher point holds for this sample; whether the difference goes beyond chance is shown neither by the point nor by the line alone.
- [x] It does not follow from this alone that both brands are rated equally; whether the difference goes beyond chance is answered by a statistical test.
  > Correct: the difference of two means is less uncertain than the two intervals together suggest, and a test even rates the difference of 0.15 here as unlikely to be chance.
- [ ] The experiment failed because the intervals are too wide.
  > Intervals show honestly how precisely the means are estimated, and with over 300 ratings per brand these are even fairly narrow.

> Overlapping intervals do not prove equality and separate ones do not replace a test; whether a difference goes beyond chance is decided by a statistical test.
