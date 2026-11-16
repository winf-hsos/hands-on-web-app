---
title: "Quiz: Showing survey data"
summary: >-
  Six questions on how to show item batteries, rating scales, yes/no
  questions and groups of different sizes and how to read such charts, each
  with its reason.
translation_of: de
based_on: 2026-11-16
---

## Why do you sort the four items of an item battery in a stacked bar chart by their share of agreement? {#hds-024}

- [ ] Because ggplot2 can only draw stacked bars when the items come as a sorted factor.
  > Without sorting, ggplot2 draws the bars just the same, only in the alphabetical order of the column names; sorting is a decision for the readers, not a requirement of ggplot2.
- [x] So that the items read as a ranking and nobody has to compare the borders of the coloured areas across bars that lie far apart.
  > Correct: sorted, the love of meat with 59 % agreement stands at the top and the preference for organic with 38 % at the bottom, and items with similar agreement such as eco-consciousness (53 %) and cooking (51 %) stand next to each other, where they can be compared directly.
- [ ] So that the answer levels in each bar run in the right order from "strongly disagree" to "strongly agree".
  > The order of the answer levels is set by the factor with `levels`, and it always follows the scale; sorting the items does not change it, it only moves whole bars.
- [ ] Because the shares in the bars are only calculated correctly after sorting.
  > Every bar shows the same shares before and after sorting; sorting only changes where it stands.

> You sort the items of an item battery by agreement so that a ranking emerges, while the answer levels in each bar keep the order of the scale.

## What do diverging bars of a rating scale show at a glance that bars stacked to 100 % show less well? {#hds-025}

- [ ] The mean of each item on the scale from −2 to +2.
  > Diverging bars do not show a mean but the shares of the individual answer levels, disagreement on the left and agreement on the right.
- [ ] How many people answered each item.
  > The bars show shares, not counts; how many answered, here between 2,798 and 2,804 per item, would have to be stated in the labels.
- [ ] The share of neutral answers, more precisely than any other chart.
  > The neutral middle belongs to neither side; it is left out and named in the caption or split half to each side, and both make it harder to read, not easier.
- [x] How agreement and disagreement relate to each other per item, because both sides start from a common zero line in the middle.
  > Correct: for the preference for organic you see at once that 33 % disagreement is almost as much as 38 % agreement, whereas in the stacked bar only the two outermost levels start at a common line.

> Diverging bars stack disagreement to the left and agreement to the right of a common zero line, so that both sides can be compared directly; what happens to the neutral answers has to be stated in the chart.

## Of the 2,809 respondents, 2,064 usually shop at a discounter and 358 at an organic store. Why is a chart better off showing 73 % and 13 % instead of these counts? {#hds-026}

- [ ] Shares are more precise than counts because they have decimal places.
  > A share is calculated from the count and holds no information that is not already in it and the total; it is not more precise, only easier to understand.
- [ ] With shares, there is no longer any need to state the number of cases.
  > The opposite is true; precisely because a share hides the number of cases, you write it into the labels, such as "shops_organic (n = 2809)".
- [x] A share says at once which part of the respondents is meant and stays comparable even when questions were answered by different numbers of people; a count is only understood by someone who knows the total.
  > Correct: 2,064 says little on its own, while 73 % means that almost three in four respondents shop at a discounter. The number of cases, here 2,809 for both questions, still belongs in the labels.
- [ ] With counts, the two questions would have to be stacked into one bar to 100 %.
  > That would be wrong in either case: 228 people shop at both places and 615 at neither, the shares add up to 86 % and not to a whole, and that is why the questions stand in separate bars.

> You show several yes/no questions as shares, because they can be understood without the total and compared with each other, and you add the number of cases.

## In the chart, 72 % of vegans (n = 36) and 30 % of omnivores (n = 1,819) prefer organic when shopping. Why does the number of cases belong in the labels? {#hds-027}

- [x] Because a share from 36 answers depends much more on chance than one from 1,819, and the bars themselves do not show this.
  > Correct: with 36 people a single one shifts the share by almost 3 percentage points, with 1,819 people by 0.05. Both bars look equally solid, and only the number of cases shows how reliable they are.
- [ ] Because ggplot2 could not otherwise sort the bars by their share.
  > Sorting is done with `fct_reorder(group, share)`, and that works with or without the number of cases in the name; the number of cases is there for the people who read the chart.
- [ ] Because the bar of the vegans would otherwise look longer than it is.
  > The length is right, the bar shows the 72 % correctly; what is missing without the number of cases is how many answers these 72 % rest on.
- [ ] Because groups with fewer than 100 people do not belong in the chart, and the number of cases shows which ones they are.
  > Leaving small groups out would hide information; you show them and say with the number of cases how much weight their share can carry.

> Whoever compares the shares of groups of very different sizes writes the number of cases into the labels, since a share from few answers can shift a lot through a few people.

## The table `survey` has 2,809 rows, one per respondent. What does the table look like after this code? {#hds-028}

```r static
survey |>
  select(id, eco_conscious, prefers_organic, loves_meat, loves_cooking) |>
  pivot_longer(-id, names_to = "item", values_to = "value")
```

- [ ] 2,809 rows with the columns `id`, `item` and `value`
  > The columns are right but the number of rows is not, since every person answered four items and therefore appears four times in the table.
- [x] 11,236 rows with the columns `id`, `item` and `value`, one row per person and item
  > Correct: `pivot_longer()` puts the four items below each other, 2,809 × 4 = 11,236 rows; the column name goes into `item`, the answer into `value`, and `id` stays because `-id` excludes it from the pivot.
- [ ] 4 rows, one per item, with the mean of the answers
  > `pivot_longer()` does not summarise anything, it only rearranges; a mean per item would only come from a `summarise()` afterwards.
- [ ] 11,236 rows with the columns `id`, `eco_conscious`, `prefers_organic`, `loves_meat` and `loves_cooking`
  > The four item columns no longer exist afterwards; their names now stand as values in the column `item`.

> `pivot_longer()` turns several columns on the same scale into two columns, one for the name and one for the value, so that ggplot2 can draw one bar per item.

## In the diverging chart of the four items, the bar of `prefers_organic` reaches about 33 % on the left and about 38 % on the right; the neutral answers are not shown. What do you read from it? {#hds-029}

- [ ] 33 % reject the statement completely, so they ticked −2.
  > The left side combines both levels of disagreement, 13.6 % with −2 and 19.0 % with −1; how much of it falls on −2 is only shown by the darker colour on the outside.
- [ ] Because the right part is longer than the left, `prefers_organic` has the highest agreement of the four items.
  > With 38 %, `prefers_organic` has the lowest agreement, the three other items lie between 51 and 59 %, and that is why it stands at the very bottom of the chart sorted by agreement.
- [ ] 71 % agree with the statement, since both sides together show the agreement.
  > The left side stands for disagreement, not agreement; both sides together only show how many took a side at all, just over 70 %.
- [x] About a third reject the statement, slightly more agree, and the remaining 30 % or so answered neutrally.
  > Correct: 32.7 % disagreement, 37.7 % agreement and 29.6 % neutral add up to 100 %; opinions on preferring organic are therefore split almost evenly.

> In diverging bars you read disagreement on the left and agreement on the right, each with both levels together, and what is missing to 100 % are the neutral answers.
