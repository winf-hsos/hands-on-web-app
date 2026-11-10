---
title: "R self-study, chapter 3: Comparing groups"
summary: >-
  Seven tasks on whether groups differ: shopping places and organic share by
  place of residence, income and children in the household, and for every
  number the question of how many people stand behind it.
objectives:
  intro: "In this chapter you compare groups of respondents with each other, and afterwards you can:"
  goals:
    - "explain what `summarise()` and `mutate()` do to a table with and without `group_by()`"
    - "compute the number of respondents and the share of an answer in percent per group"
    - "determine the distribution of a variable within each group with `count()`, `group_by()`, `mutate()` and `ungroup()`"
    - "form groups of your own with `case_when()` and put them in a sensible order with `fct_relevel()`"
    - "say for every comparison whom it speaks about and how many people stand behind each number"
translation_of: de
based_on: 2026-11-11
---

The guiding question of the five chapters stays the same: **Where do the
respondents shop, and who buys organic?** Now it gets interesting, because
you ask whether groups differ, that is, whether people in a village shop
differently from people in a big city and whether households with a higher
income buy organic more often. The tool for this is `group_by()` together
with `summarise()`, and the most important question for every group is how
many people stand behind it.

In the boxes the whole
[[milk-chocolate-survey|survey on milk and chocolate]] is ready as the table
`survey`, and the tidyverse is loaded. Because every box runs on its own, the
columns `city_size` and `organic_share` from chapter 2 do not exist here by
themselves; where a task needs them, you create them at the start of the pipe
yourself, and the hint shows you the code for it. In `chapter_3.R` from your
course folder the tasks carry the numbers 3.1 to 3.7 in the same order, and most of them have a
control value in the hint against which you can check your result yourself.

## Part 1: Summarising and grouping

1. Run the two pipes and compare how many rows each result has.
   Describe the difference between `summarise()` and `mutate()` in one
   sentence, and then write the `summarise()` with the shorter function that
   gives the same result.

```r
survey |>
  summarise(n_respondents = n())

survey |>
  mutate(n_respondents = n())
```

> [!HINT]
> Read the sections
> [3.3 "Columns"](https://r4ds.hadley.nz/data-transform.html#columns) and
> [3.5 "Groups"](https://r4ds.hadley.nz/data-transform.html#groups) in
> [[r-for-data-science]]. You know the shorter function from chapter 2,
> where you used it to count frequencies.
>
> Control: 1 row against 2,811 rows.

> [!SOLUTION]
> ```r
> survey |>
>   count()
> ```
>
> `summarise()` condenses all 2,811 rows into a single row with the number
> of respondents, while `mutate()` keeps all 2,811 rows and adds the same
> number to each of them as a new column. The shortcut for the `summarise()`
> is `count()`, which, however, calls its column `n`.

2. Put a `group_by(Q004geschlechtf)` in front of both pipes from 3.1
   and run them again. Describe what changes for `summarise()` and what
   changes for `mutate()`, and find out where the row with `NA` comes from.

```r
survey |>
  summarise(n_respondents = n())

survey |>
  mutate(n_respondents = n())
```

> [!HINT]
> Read sections 3.5.1 to 3.5.3 under
> [3.5 "Groups"](https://r4ds.hadley.nz/data-transform.html#groups) in
> [[r-for-data-science]]. For the `NA`, compare the processed column with
> the raw column `q004geschlecht`; the trail leads to the section „Zwei
> Menschen verschwinden in der Aufbereitung“ (two people disappear in the
> processing) in `course/datasets/mds12-schoko-milch.md` in your course
> folder.

> [!SOLUTION]
> ```r
> survey |>
>   group_by(Q004geschlechtf) |>
>   summarise(n_respondents = n())
>
> survey |>
>   group_by(Q004geschlechtf) |>
>   mutate(n_respondents = n()) |>
>   select(Q004geschlechtf, n_respondents)
>
> survey |>
>   count(q004geschlecht, Q004geschlechtf)
> ```
>
> With `group_by()`, `summarise()` returns one row per group: 1,481 women
> (`Frauen`), 1,328 men (`Männer`) and 2 people with `NA`. `mutate()`, on
> the other hand, keeps all 2,811 rows but writes the size of its own group
> into each of them, and the result stays grouped, as the line
> `# Groups: Q004geschlechtf [3]` shows; the `select()` only serves to see
> the two columns side by side. The count with the raw column shows where
> the `NA` comes from: the two people who answered "diverse" (code 3) are
> missing in the processed column. With two people no group analysis is
> possible, but this decision is recorded nowhere, and whoever makes such a
> decision writes it into the methods section.

## Part 2: Comparing shares

3. Compute per size of the place of residence (`city_size`) the
   number of respondents and the share in percent who shop at a farm shop
   (`v008ort_6hof`) and at a weekly market (`v008ort_5markt`). Leave out the
   7 people without information on their place of residence and give the
   reason in a comment in the code. Then describe in one sentence what stands
   out when you read the two columns side by side.

```r
survey
```

> [!HINT]
> `city_size` is the size of the place of residence from `D044stadtf` as a
> factor ordered from large to small, as you created it in chapter 2. Your
> pipe therefore starts like this:
>
> ```r
> survey |>
>   mutate(city_size = factor(D044stadtf, levels = c(
>     "Großstadt", "Große Mittelstadt", "Große Kleinstadt",
>     "Kleinstadt >5000", "Kleinstadt <5000", "Dorf"
>   ))) |>
>   count(city_size)
> ```
>
> In the columns `v008ort_*`, 1 stands for mentioned and 0 for not
> mentioned. The mean of a condition such as `v008ort_6hof == 1` is the
> share of respondents for whom it is true; read section
> [12.4 "Summaries"](https://r4ds.hadley.nz/logicals.html#sec-logical-summaries)
> in [[r-for-data-science]].
>
> Control: farm shop in the village (`Dorf`) 17.8 %, weekly market in the
> village 13.1 %.

> [!SOLUTION]
> ```r
> survey |>
>   mutate(city_size = factor(D044stadtf, levels = c(
>     "Großstadt", "Große Mittelstadt", "Große Kleinstadt",
>     "Kleinstadt >5000", "Kleinstadt <5000", "Dorf"
>   ))) |>
>   # without a city size a person belongs to none of the groups we compare,
>   # and 7 people would be too few for a group of their own
>   filter(!is.na(city_size)) |>
>   group_by(city_size) |>
>   summarise(
>     n_respondents = n(),
>     pct_farm_shop = 100 * mean(v008ort_6hof == 1),
>     pct_market = 100 * mean(v008ort_5markt == 1)
>   )
> ```
>
> Both places stand for buying directly from the producer, but they behave
> in opposite ways: 11.9 % mention the farm shop in big cities and 19.2 and
> 17.8 % in the small towns and villages, whereas the weekly market is
> mentioned by around 19 to 20 % in big cities, medium-sized towns and large
> small towns, and by only 10.6 and 13.1 % in the small places. Whoever
> merged both places into one column "directly from the producer" would not
> see this difference. The shares refer to the respondents, not to the
> mentions, because every person could name several places to shop.

4. Compute how the organic share (`organic_share`) is distributed
   within each size of the place of residence. To do so, count with
   `count(city_size, organic_share)`, then group by `city_size`, compute with
   `mutate()` the share of each row in its group in percent
   (`pct = 100 * n / sum(n)`) and remove the grouping again at the end with
   `ungroup()`. Leave out people without information on place of residence
   or organic share, and give the reason in one sentence why `mutate()` fits
   here and not `summarise()`.

```r
survey
```

> [!HINT]
> `organic_share` is the organic share of food shopping from
> `v032bioanteil` with its five levels as a factor. Together with
> `city_size` your pipe starts like this:
>
> ```r
> survey |>
>   mutate(
>     city_size = factor(D044stadtf, levels = c(
>       "Großstadt", "Große Mittelstadt", "Große Kleinstadt",
>       "Kleinstadt >5000", "Kleinstadt <5000", "Dorf"
>     )),
>     organic_share = factor(v032bioanteil, levels = 1:5, labels = c(
>       "(fast) nie Bio", "deutlich weniger als die Hälfte", "etwa die Hälfte",
>       "deutlich mehr als die Hälfte", "(fast) nur Bio"
>     ))
>   ) |>
>   count(organic_share)
> ```
>
> Control: "(fast) nie Bio" ((almost) never organic) in the big city
> (`Großstadt`) 20.9 %, in the village 23.4 %.

> [!SOLUTION]
> ```r
> survey |>
>   mutate(
>     city_size = factor(D044stadtf, levels = c(
>       "Großstadt", "Große Mittelstadt", "Große Kleinstadt",
>       "Kleinstadt >5000", "Kleinstadt <5000", "Dorf"
>     )),
>     organic_share = factor(v032bioanteil, levels = 1:5, labels = c(
>       "(fast) nie Bio", "deutlich weniger als die Hälfte", "etwa die Hälfte",
>       "deutlich mehr als die Hälfte", "(fast) nur Bio"
>     ))
>   ) |>
>   filter(!is.na(city_size), !is.na(organic_share)) |>
>   count(city_size, organic_share) |>
>   group_by(city_size) |>
>   mutate(pct = 100 * n / sum(n)) |>
>   ungroup()
> ```
>
> `summarise()` would condense each size of place into a single row, while
> `mutate()` keeps the five rows per group and, thanks to `group_by()`,
> computes `sum(n)` only over its own group. The distributions are similar:
> 20.9 % in the big city and 23.4 % in the village say "(fast) nie Bio", and
> everywhere around a third buy clearly less than half organic. The village
> stands out most, where only 10.1 % buy clearly more than half organic,
> compared with 13.9 to 17.2 % in the other sizes of place; with 385
> respondents in the village, however, these numbers alone cannot tell
> whether this is more than chance. `ungroup()` makes sure that a further
> step does not compute per size of place without you noticing.

## Part 3: Forming groups yourself

5. Income (`d049einkommen`) has eleven levels, too many for a
   comparison. Use `case_when()` to form a column `income_group` with four
   groups in which people without information remain `NA`, and put the
   groups in the right order with `fct_relevel()`:

   - "unter 2.000 €" (under 2,000 €) from codes 1 to 4,
   - "2.000 bis unter 3.500 €" (2,000 to under 3,500 €) from codes 5 to 7,
   - "3.500 bis unter 5.000 €" (3,500 to under 5,000 €) from codes 8 to 10,
   - "5.000 € und mehr" (5,000 € and more) from code 11.

   Also form a column `is_organic_half` that is `TRUE` if someone buys at
   least about half organic (`v032bioanteil` from 3). Then compute per
   income group the number of respondents and the share with
   `is_organic_half` in percent.

```r
survey
```

> [!HINT]
> The codes are in the codebook on page 33; the PDF exists only in your
> course folder as `data/M3b_Musterstudie-quantitativ.pdf`, the short
> version in the section „Wichtige Variablen und ihre Codes“ (important
> variables and their codes) in `course/datasets/mds12-schoko-milch.md`.
> Read the sections
> [12.5 "Conditional transformations"](https://r4ds.hadley.nz/logicals.html#conditional-transformations)
> and
> [16.4 "Modifying factor order"](https://r4ds.hadley.nz/factors.html#sec-modifying-factor-order)
> in [[r-for-data-science]]. For the mean, keep in mind that not all
> respondents answered the question about the organic share.
>
> Control: 291 respondents in "5.000 € und mehr"; share with
> `is_organic_half` in "unter 2.000 €" 38.3 %, in "5.000 € und mehr"
> 50.2 %.

> [!SOLUTION]
> ```r
> survey |>
>   mutate(
>     income_group = case_when(
>       d049einkommen %in% 1:4 ~ "unter 2.000 €",
>       d049einkommen %in% 5:7 ~ "2.000 bis unter 3.500 €",
>       d049einkommen %in% 8:10 ~ "3.500 bis unter 5.000 €",
>       d049einkommen == 11 ~ "5.000 € und mehr"
>     ),
>     income_group = fct_relevel(
>       income_group,
>       "unter 2.000 €", "2.000 bis unter 3.500 €",
>       "3.500 bis unter 5.000 €", "5.000 € und mehr"
>     ),
>     is_organic_half = v032bioanteil >= 3
>   ) |>
>   group_by(income_group) |>
>   summarise(
>     n_respondents = n(),
>     pct_organic_half = 100 * mean(is_organic_half, na.rm = TRUE)
>   )
> ```
>
> The share rises steadily with income, from 38.3 % under 2,000 € through
> 44.6 and 46.7 % to 50.2 % at 5,000 € and more. Without `na.rm = TRUE`
> every group would show `NA`, because 18 respondents did not answer the
> question about the organic share; the shares therefore apply to everyone
> who answered it. The 100 respondents without information on income stand
> in a row of their own with `NA`, and their share of 52.5 % belongs to no
> income group.

6. Find out whether households with children under 12 shop at a
   discounter (`v008ort_1discount`) more often. To do so, form a column
   `has_children` that is `TRUE` if `D043kinderzahl` is greater than 0.
   First count for how many respondents `has_children` is missing and in
   which household sizes (`d042hhzahl`) they live, and describe in one
   sentence whom your comparison speaks about. Then compare the share who
   shop at a discounter.

```r
survey
```

> [!HINT]
> Remember chapter 2, task 6: the question about children was only asked
> if the household has at least two members (codebook page 32), and 12
> implausible values were removed in the processing into `D043kinderzahl`.
> Why a missing value often means "not asked" is explained on the page
> about the [[milk-chocolate-survey|survey]] under "What to know
> before you calculate". With `count(d042hhzahl, has_children)` you see both
> at once.
>
> Control: 436 respondents with children under 12.

> [!SOLUTION]
> ```r
> survey |>
>   mutate(has_children = D043kinderzahl > 0) |>
>   count(d042hhzahl, has_children)
>
> survey |>
>   mutate(has_children = D043kinderzahl > 0) |>
>   group_by(has_children) |>
>   summarise(
>     n_respondents = n(),
>     pct_discounter = 100 * mean(v008ort_1discount == 1)
>   )
> ```
>
> `has_children` is missing for 929 respondents: 824 live alone and were
> not asked at all, 14 lack the household size, and 91 live in households
> of two to four people without a valid answer, among them the 12 whose
> values were removed in the processing. The comparison therefore speaks
> only about people in households of at least two, and "without children
> under 12" here mainly means two-person households (1,087 of 1,446), not
> people who live alone. There is hardly any difference between the
> groups: 75.0 % of the 436 respondents with children shop at a
> discounter, and 74.0 % of the 1,446 without.

## Part 4: How many are behind it?

7. Compute the mean age (`Q002alter`) by diet (`V041nofleischf`)
   together with the number of respondents per group, and sort by group
   size. Then describe in two sentences how far you trust the mean of the
   smallest group and what would have to stand next to this number in a
   report.

```r
survey
```

> [!HINT]
> Read section
> [3.6 "Case study: aggregates and sample size"](https://r4ds.hadley.nz/data-transform.html#sec-sample-size)
> in [[r-for-data-science]].
>
> Control: the smallest group with an answer is the 36 vegan respondents.

> [!SOLUTION]
> ```r
> survey |>
>   group_by(V041nofleischf) |>
>   summarise(
>     n_respondents = n(),
>     mean_age = mean(Q002alter)
>   ) |>
>   arrange(desc(n_respondents))
> ```
>
> The 36 vegan respondents are 41.8 years old on average, the 134
> vegetarian ones 39.3 and the 37 pescetarian ones 44.8 years, while the
> 749 flexitarian respondents and the 1,827 without restrictions are
> clearly older at 49.3 and 48.8 years. I trust a mean from 36 people only
> roughly, because a few people can shift it by several years and another
> 36 people might give a noticeably different result. In a report, every
> mean needs the number of respondents it comes from next to it, ideally
> also a measure of spread such as the standard deviation (12.3 years for
> the vegans), and the 28 respondents without an answer on their diet need
> an explanation of their own instead of silently dropping out.

## What comes next

You can go through your solutions with the
[[opencode-course-assistant|course assistant]] in your course folder, and the
next step is [[survey-exercise-figures|chapter 4: Figures]].
