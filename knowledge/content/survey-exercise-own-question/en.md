---
title: "Self-study R, chapter 5: Answering a question"
summary: >-
  The whole way on your own, on one of four questions about shopping and organic
  food: find and prepare the variables, key figures and a figure, a finding in three sentences.
objectives:
  intro: "In this chapter you answer a question about the survey from start to finish on your own, and afterwards you can:"
  goals:
    - "translate a question into the columns of the data set and look up their codes in the codebook"
    - "check the level of measurement and the data type of every column, convert them where needed and combine an item battery into one value per person"
    - "count missing values, name their reason and state whom an analysis excludes"
    - "describe a relationship with shares per group or a correlation and say for every number how many respondents it rests on"
    - "draw a figure that answers the question and put the finding into three sentences: result, base and limit"
translation_of: de
based_on: 2026-11-11
---

The guiding question of the self-study is: **Where do the respondents shop,
and who buys organic?** In the last chapter you go the whole way on your
own, on a question you choose from four. This is exactly how you will work
on your group's topic from session 2 onwards, from the question through the
variables, their preparation, the key figures and a figure to a finding you
can stand behind.

In the boxes the complete [[milk-chocolate-survey|survey on milk and
chocolate]] is ready as the table `survey`, and the tidyverse is loaded.
Every box runs on its own: what one box creates, the next one does not know.
This is why the solutions create columns such as `income_group` anew each
time, and your code should do the same.

## Choosing the question

| | Question | Columns |
|---|---|---|
| A | Do households with a higher income buy more organic food? | `d049einkommen`, `v032bioanteil` |
| B | Do people in the countryside buy more often directly from the producer, in a farm shop or at the weekly market? | `d044stadt` or `D044stadtf`, `v008ort_5markt`, `v008ort_6hof` |
| C | Green mobility, green consumption: do households with an e-bike buy more organic food? | `d039besitz_9ebike`, `v032bioanteil` |
| D | Is the attitude towards organic food related to environmental awareness? | `p030green_*` and `p031bio_*` |

For question D you build one value per person from each of the two item
batteries and reverse the reverse-coded statements first. You already
started questions A and B in [[survey-exercise-comparing-groups|chapter 3]]
and [[survey-exercise-figures|chapter 4]] and now go deeper, while C and D
are new. The solutions show the way for all four questions; read only the
part on your question each time, and only once you have tried it yourself.

## Part 1: Preparing the variables

1. Look up the columns you need for your question in the codebook
   and note for each one the page, the question text in short and the
   codes. Then create a small table that contains only an identifier
   `respondent_id` and these columns.

```r
survey
```

> [!HINT]
> Read section 10.2
> ["Questions"](https://r4ds.hadley.nz/EDA.html#questions) in
> [[r-for-data-science]] first. The codebook is the study documentation
> `data/M3b_Musterstudie-quantitativ.pdf`, which exists only in your course
> folder; the page numbers in the solutions refer to it. You create the
> identifier with `mutate(respondent_id = row_number(), .before = 1)`, and
> for a whole item battery `select(starts_with("p030green"))` helps.

> [!SOLUTION]
> The identifier `respondent_id` does not exist on this page from the start,
> so every solution creates it itself.
>
> **Question A.** `d049einkommen` is the net household income (F49, p. 33)
> with the codes 1 "under €500" to 11 "€5,000 and more" in steps of €500;
> whoever chose "no answer" is missing. `v032bioanteil` is the share of
> organic food in the whole shopping (F32, p. 28), from 1 "(almost) never
> organic" through 2 "clearly less than half", 3 "about half" and 4 "clearly
> more than half" to 5 "(almost) only organic".
>
> ```r
> survey |>
>   mutate(respondent_id = row_number(), .before = 1) |>
>   select(respondent_id, d049einkommen, v032bioanteil)
> ```
>
> **Question B.** `d044stadt` is the size of the place of residence as the
> respondents rate it themselves (F44, p. 32), from 1 "large city" (more
> than 100,000 inhabitants) to 6 "village" (fewer than 2,000), and
> `D044stadtf` the same answer as text, in German. `v008ort_5markt` and
> `v008ort_6hof` belong to the question where someone usually buys food
> (F8, p. 8, multiple answers): 1 means weekly market or farm shop and
> direct from the producer was named, 0 not named.
>
> ```r
> survey |>
>   mutate(respondent_id = row_number(), .before = 1) |>
>   select(respondent_id, d044stadt, D044stadtf, v008ort_5markt, v008ort_6hof)
> ```
>
> **Question C.** `d039besitz_9ebike` belongs to the question of what the
> household owns (F39, p. 31, multiple answers), with 1 for an e-bike and 0
> for none; `v032bioanteil` is the same column as in question A.
>
> ```r
> survey |>
>   mutate(respondent_id = row_number(), .before = 1) |>
>   select(respondent_id, d039besitz_9ebike, v032bioanteil)
> ```
>
> **Question D.** The five columns `p030green_*` are statements on
> environmental protection in consumption (F30, p. 27), such as "I would
> describe myself as environmentally conscious", the seven columns
> `p031bio_*` statements on organic products (F31, pp. 27 and 28), such as
> "When shopping for food I prefer organic products". Both range from +2
> "fully applies" to −2 "does not apply at all", and in F31
> `p031bio_2gleich` ("hardly any differences") and `p031bio_4teuer` ("too
> expensive") are marked (R) as reverse-coded.
>
> ```r
> survey |>
>   mutate(respondent_id = row_number(), .before = 1) |>
>   select(respondent_id, starts_with("p030green"), starts_with("p031bio"))
> ```

2. Determine the level of measurement of each of your columns and
   check whether the data type fits it. Convert where needed: into a factor
   with the right order, into groups or, for reverse-coded statements, into
   reversed values.

```r
survey
```

> [!HINT]
> You build groups with `case_when()` and put them in the right order with
> `fct_relevel()`, as in task 5 of [[survey-exercise-comparing-groups|chapter 3]].
> A comparison such as `v032bioanteil >= 3` turns a code into a logical
> value. Since the statements run from −2 to +2 around zero, you reverse a
> reverse-coded statement with a minus sign, and
> `rowMeans(pick(starts_with("p030green")))` inside `mutate()` computes the
> mean of every row over the chosen columns.

> [!SOLUTION]
> **Question A.** Both columns are ordinal but stored as whole numbers. For
> a comparison eleven income levels are too many, so the solution combines
> them into four groups as in chapter 3. It splits the organic share at
> "about half" into two groups: `organic_half` is `TRUE` if someone buys at
> least about half organic.
>
> ```r
> survey |>
>   mutate(
>     income_group = case_when(
>       d049einkommen <= 4 ~ "under €2,000",
>       d049einkommen <= 7 ~ "€2,000 to under €3,500",
>       d049einkommen <= 10 ~ "€3,500 to under €5,000",
>       d049einkommen == 11 ~ "€5,000 and more"
>     ),
>     income_group = fct_relevel(
>       income_group, "under €2,000", "€2,000 to under €3,500",
>       "€3,500 to under €5,000", "€5,000 and more"
>     ),
>     organic_half = v032bioanteil >= 3
>   ) |>
>   count(income_group, organic_half)
> ```
>
> Whoever gave no income lands in no group and stays `NA`, and the same
> holds for `organic_half` without an answer on the organic share. If you
> want to show all five levels of the organic share, create a factor
> `organic_share` with `factor(v032bioanteil, levels = 1:5, labels = …)` as
> in chapter 3.
>
> **Question B.** The size of the place of residence is ordinal;
> `D044stadtf` is text and would be sorted alphabetically, so it becomes a
> factor from the large city to the village. The two shopping places are
> nominal with two values, and they can stay 0 and 1, because their mean is
> exactly the share of ones.
>
> ```r
> survey |>
>   mutate(
>     city_size = factor(D044stadtf, levels = c(
>       "Großstadt", "Große Mittelstadt", "Große Kleinstadt",
>       "Kleinstadt >5000", "Kleinstadt <5000", "Dorf"
>     ))
>   ) |>
>   count(city_size)
> ```
>
> **Question C.** Owning an e-bike is nominal with two values and becomes
> the logical value `has_ebike`, the organic share becomes `organic_half` as
> in question A.
>
> ```r
> survey |>
>   mutate(
>     has_ebike = d039besitz_9ebike == 1,
>     organic_half = v032bioanteil >= 3
>   ) |>
>   count(has_ebike, organic_half)
> ```
>
> **Question D.** Every single statement is ordinal. Taking the mean over
> several statements treats the distances between the levels as equal; this
> is common for such scales, but it is an assumption you should state. That
> the two (R) statements are coded the other way round also shows in the
> data, since they are negatively related to the others:
>
> ```r
> survey |>
>   summarize(
>     r_equal = cor(p031bio_2gleich, p031bio_1lieberbio, use = "complete.obs"),
>     r_expensive = cor(p031bio_4teuer, p031bio_6biokauf, use = "complete.obs")
>   )
> ```
>
> The correlations are −0.25 and −0.41. After reversing, the solution
> computes per person a mean over the five statements on the environment
> (`green_score`) and over the seven on organic food (`organic_score`), both
> again between −2 and +2:
>
> ```r
> survey |>
>   mutate(
>     p031bio_2gleich = -p031bio_2gleich,
>     p031bio_4teuer = -p031bio_4teuer,
>     green_score = rowMeans(pick(starts_with("p030green"))),
>     organic_score = rowMeans(pick(starts_with("p031bio")))
>   ) |>
>   select(green_score, organic_score)
> ```

3. Check which values occur in your columns and how many are
   missing, and describe in one sentence why they are missing. Decide whom
   you exclude from the analysis, and count how many people that is.

```r
survey
```

> [!HINT]
> Read section 10.3 "Variation" in the
> [chapter on exploratory data analysis](https://r4ds.hadley.nz/EDA.html#questions)
> of [[r-for-data-science]]. `count()` shows you every value that occurs,
> and `sum(is.na(…))` inside `summarize()` counts the missing ones. Whether
> a missing value means "not asked" or "not answered" is explained under
> "What to know before you calculate" on the page on the
> [[milk-chocolate-survey]]; according to the data set guide
> (`course/datasets/mds12-schoko-milch.md` in your course folder), every
> respondent got the blocks `q`, `v`, `p` and `d`.

> [!SOLUTION]
> In all four questions only the codes named in the codebook occur, as
> `count()` shows for every column. Since all columns come from blocks that
> every respondent got, a missing value here does not mean "not asked" but
> "not answered".
>
> **Question A.** For income the questionnaire offered "no answer", and 100
> people chose it; for the organic share 18 answers are missing.
>
> ```r
> survey |>
>   summarize(
>     income_missing = sum(is.na(d049einkommen)),
>     organic_missing = sum(is.na(v032bioanteil)),
>     excluded = sum(is.na(d049einkommen) | is.na(v032bioanteil)),
>     remaining = sum(!is.na(d049einkommen) & !is.na(v032bioanteil))
>   )
> ```
>
> 117 people are excluded, because one of them gave no answer to either
> question, and 2,694 remain.
>
> **Question B.** Only the size of the place of residence has missing
> values, for 7 people; the shopping places are complete, because every
> multiple answer is stored as 0 or 1.
>
> ```r
> survey |>
>   summarize(
>     city_missing = sum(is.na(d044stadt)),
>     market_missing = sum(is.na(v008ort_5markt)),
>     farm_missing = sum(is.na(v008ort_6hof)),
>     remaining = sum(!is.na(d044stadt))
>   )
> ```
>
> Without the 7, 2,804 respondents remain.
>
> **Question C.** E-bike ownership is complete, and for the organic share
> the same 18 answers as in question A are missing.
>
> ```r
> survey |>
>   summarize(
>     ebike_missing = sum(is.na(d039besitz_9ebike)),
>     organic_missing = sum(is.na(v032bioanteil)),
>     remaining = sum(!is.na(v032bioanteil))
>   )
> ```
>
> 2,793 respondents remain.
>
> **Question D.** All twelve statements range from −2 to +2, and each one
> lacks between 5 and 11 answers:
>
> ```r
> survey |>
>   select(starts_with("p030green"), starts_with("p031bio")) |>
>   pivot_longer(everything(), names_to = "item", values_to = "value") |>
>   group_by(item) |>
>   summarize(
>     min = min(value, na.rm = TRUE),
>     max = max(value, na.rm = TRUE),
>     missing = sum(is.na(value))
>   )
> ```
>
> The solution builds the two values only for people who answered all
> statements of their battery, since `rowMeans()` without `na.rm = TRUE`
> otherwise returns `NA`. Whoever is missing on at least one of the twelve
> statements drops out:
>
> ```r
> survey |>
>   mutate(
>     green_missing = rowSums(is.na(pick(starts_with("p030green")))),
>     organic_missing = rowSums(is.na(pick(starts_with("p031bio"))))
>   ) |>
>   summarize(
>     excluded = sum(green_missing > 0 | organic_missing > 0),
>     remaining = sum(green_missing == 0 & organic_missing == 0)
>   )
> ```
>
> These are 53 people, and 2,758 remain.

## Part 2: Answers

4. First describe each of your variables on its own and then their
   relationship, with shares or means per group or, for question D, with a
   correlation (`cor()` with `use = "complete.obs"`). State for every
   number how many respondents it rests on.

```r
survey
```

> [!HINT]
> Read section 10.5 "Covariation" in the
> [chapter on exploratory data analysis](https://r4ds.hadley.nz/EDA.html#questions)
> of [[r-for-data-science]]. The mean of a condition such as
> `mean(v032bioanteil >= 3)` is the share for which it holds, and `n()`
> inside `summarize()` gives you the number of respondents per group as
> well. Exclude the people you excluded in 5.3 with `filter()` first, then
> all numbers rest on the same base.

> [!SOLUTION]
> **Question A.** Of the 2,694 respondents with both answers, 44.3 per cent
> buy at least about half organic, and the median income lies at code 7,
> that is €3,000 to under €3,500.
>
> ```r
> survey |>
>   filter(!is.na(d049einkommen), !is.na(v032bioanteil)) |>
>   summarize(
>     n = n(),
>     median_income_code = median(d049einkommen),
>     share_organic_half = mean(v032bioanteil >= 3) * 100
>   )
> ```
>
> Per income group this share rises steadily, from 38.3 per cent under
> €2,000 (661 respondents) through 44.6 and 46.7 per cent to 50.2 per cent
> at €5,000 and more (289 respondents):
>
> ```r
> survey |>
>   filter(!is.na(d049einkommen), !is.na(v032bioanteil)) |>
>   mutate(
>     income_group = case_when(
>       d049einkommen <= 4 ~ "under €2,000",
>       d049einkommen <= 7 ~ "€2,000 to under €3,500",
>       d049einkommen <= 10 ~ "€3,500 to under €5,000",
>       d049einkommen == 11 ~ "€5,000 and more"
>     ),
>     income_group = fct_relevel(
>       income_group, "under €2,000", "€2,000 to under €3,500",
>       "€3,500 to under €5,000", "€5,000 and more"
>     )
>   ) |>
>   group_by(income_group) |>
>   summarize(
>     n = n(),
>     share_organic_half = mean(v032bioanteil >= 3) * 100
>   )
> ```
>
> **Question B.** Of the 2,804 respondents with an answer on their place
> of residence, 17.6 per cent shop at the weekly market and 14.1 per cent
> in a farm shop, and 25.5 per cent name at least one of the two places.
>
> ```r
> survey |>
>   filter(!is.na(d044stadt)) |>
>   summarize(
>     n = n(),
>     share_market = mean(v008ort_5markt) * 100,
>     share_farm = mean(v008ort_6hof) * 100,
>     share_direct = mean(v008ort_5markt == 1 | v008ort_6hof == 1) * 100
>   )
> ```
>
> Per size of the place of residence the two places run in opposite
> directions: the farm shop is named by 11.9 per cent in large cities
> (`Großstadt`) and by 17.8 per cent in villages (`Dorf`), the weekly market
> by contrast by 19.0 per cent in large cities and by only 13.1 per cent in
> villages. The share naming at least one of the two places lies between
> 23.9 and 28.7 per cent in every group.
>
> ```r
> survey |>
>   filter(!is.na(D044stadtf)) |>
>   mutate(
>     city_size = factor(D044stadtf, levels = c(
>       "Großstadt", "Große Mittelstadt", "Große Kleinstadt",
>       "Kleinstadt >5000", "Kleinstadt <5000", "Dorf"
>     ))
>   ) |>
>   group_by(city_size) |>
>   summarize(
>     n = n(),
>     share_market = mean(v008ort_5markt) * 100,
>     share_farm = mean(v008ort_6hof) * 100,
>     share_direct = mean(v008ort_5markt == 1 | v008ort_6hof == 1) * 100
>   )
> ```
>
> The two smallest groups are the small towns under 5,000 inhabitants with
> 188 and the villages with 388 respondents.
>
> **Question C.** Of the 2,793 respondents with an answer on the organic
> share, a quarter have an e-bike in the household, 25.2 per cent, and 44.6
> per cent buy at least about half organic.
>
> ```r
> survey |>
>   filter(!is.na(v032bioanteil)) |>
>   summarize(
>     n = n(),
>     share_ebike = mean(d039besitz_9ebike) * 100,
>     share_organic_half = mean(v032bioanteil >= 3) * 100
>   )
> ```
>
> With an e-bike it is 48.5 per cent of 705 respondents, without one 43.2
> per cent of 2,088:
>
> ```r
> survey |>
>   filter(!is.na(v032bioanteil)) |>
>   mutate(has_ebike = d039besitz_9ebike == 1) |>
>   group_by(has_ebike) |>
>   summarize(
>     n = n(),
>     share_organic_half = mean(v032bioanteil >= 3) * 100
>   )
> ```
>
> **Question D.** Among the 2,758 respondents who answered all twelve
> statements, environmental awareness averages 0.36 and the attitude
> towards organic food 0.06, both close to the middle "partly". The
> correlation of the two values is 0.51.
>
> ```r
> survey |>
>   mutate(
>     p031bio_2gleich = -p031bio_2gleich,
>     p031bio_4teuer = -p031bio_4teuer,
>     green_score = rowMeans(pick(starts_with("p030green"))),
>     organic_score = rowMeans(pick(starts_with("p031bio")))
>   ) |>
>   filter(!is.na(green_score), !is.na(organic_score)) |>
>   summarize(
>     n = n(),
>     mean_green = mean(green_score),
>     mean_organic = mean(organic_score),
>     r = cor(green_score, organic_score)
>   )
> ```
>
> Since the solution excluded everyone with missing values beforehand,
> `cor()` needs no `use = "complete.obs"` here; without the `filter()` it
> would be necessary.

5. Draw a figure that answers your question in a way that you could
   put it into a report: with a fitting form, a sensible order, labels and,
   for shares, an axis that starts at zero.

```r
survey |>
  ggplot() +
  aes()
```

> [!HINT]
> Which form fits which question is shown in Claus Wilke's
> [Directory of Visualizations](https://clauswilke.com/dataviz/directory-of-visualizations.html),
> and you know the tools from [[survey-exercise-figures|chapter 4]]. If you
> have already computed the shares with `summarize()`, `geom_col()` draws
> them as bars whose axis starts at zero by itself. You set the title, the
> axes and a line on the base with `labs(title = …, x = …, y = …, caption = …)`.

> [!SOLUTION]
> **Question A.** One bar per income group with the share that buys at
> least about half organic, and the number of respondents above each bar:
>
> ```r
> survey |>
>   filter(!is.na(d049einkommen), !is.na(v032bioanteil)) |>
>   mutate(
>     income_group = case_when(
>       d049einkommen <= 4 ~ "under €2,000",
>       d049einkommen <= 7 ~ "€2,000 to under €3,500",
>       d049einkommen <= 10 ~ "€3,500 to under €5,000",
>       d049einkommen == 11 ~ "€5,000 and more"
>     ),
>     income_group = fct_relevel(
>       income_group, "under €2,000", "€2,000 to under €3,500",
>       "€3,500 to under €5,000", "€5,000 and more"
>     )
>   ) |>
>   group_by(income_group) |>
>   summarize(
>     n = n(),
>     share_organic_half = mean(v032bioanteil >= 3) * 100
>   ) |>
>   ggplot() +
>   aes(x = income_group, y = share_organic_half, label = paste0("n = ", n)) +
>   geom_col() +
>   geom_text(vjust = -0.5) +
>   labs(
>     title = "More income, somewhat more organic",
>     x = "Net household income",
>     y = "Share buying at least about half organic (%)",
>     caption = "2,694 respondents with answers on income and organic share"
>   )
> ```
>
> **Question B.** The two shopping places side by side per size of the
> place of residence. For this `pivot_longer()` puts the two shares into one
> column, and horizontal bars leave room for the long names of the places;
> `fct_rev()` makes sure that the large city is at the top.
>
> ```r
> survey |>
>   filter(!is.na(D044stadtf)) |>
>   mutate(
>     city_size = factor(D044stadtf, levels = c(
>       "Großstadt", "Große Mittelstadt", "Große Kleinstadt",
>       "Kleinstadt >5000", "Kleinstadt <5000", "Dorf"
>     ))
>   ) |>
>   group_by(city_size) |>
>   summarize(
>     market = mean(v008ort_5markt) * 100,
>     farm_shop = mean(v008ort_6hof) * 100
>   ) |>
>   pivot_longer(c(market, farm_shop), names_to = "place", values_to = "share") |>
>   ggplot() +
>   aes(x = share, y = fct_rev(city_size), fill = place) +
>   geom_col(position = "dodge") +
>   scale_fill_discrete(labels = c(farm_shop = "Farm shop", market = "Weekly market")) +
>   labs(
>     title = "Farm shops in the village, weekly markets in the city",
>     x = "Share of respondents shopping there (%)",
>     y = NULL,
>     fill = NULL,
>     caption = "2,804 respondents with an answer on the size of their place of residence"
>   )
> ```
>
> **Question C.** Two bars are enough, one for households with and one for
> households without an e-bike:
>
> ```r
> survey |>
>   filter(!is.na(v032bioanteil)) |>
>   mutate(ebike = if_else(d039besitz_9ebike == 1, "with e-bike", "without e-bike")) |>
>   group_by(ebike) |>
>   summarize(
>     n = n(),
>     share_organic_half = mean(v032bioanteil >= 3) * 100
>   ) |>
>   ggplot() +
>   aes(x = ebike, y = share_organic_half, label = paste0("n = ", n)) +
>   geom_col(width = 0.5) +
>   geom_text(vjust = -0.5) +
>   labs(
>     title = "Households with an e-bike buy organic somewhat more often",
>     x = NULL,
>     y = "Share buying at least about half organic (%)",
>     caption = "2,793 respondents with an answer on the organic share"
>   )
> ```
>
> **Question D.** Two values per person call for a scatter plot. Since the
> values are means over a few levels, many points lie exactly on top of
> each other; `geom_jitter()` moves them a little, and `alpha` makes dense
> areas darker. The line from `geom_smooth()` shows the direction of the
> relationship.
>
> ```r
> survey |>
>   mutate(
>     p031bio_2gleich = -p031bio_2gleich,
>     p031bio_4teuer = -p031bio_4teuer,
>     green_score = rowMeans(pick(starts_with("p030green"))),
>     organic_score = rowMeans(pick(starts_with("p031bio")))
>   ) |>
>   filter(!is.na(green_score), !is.na(organic_score)) |>
>   ggplot() +
>   aes(x = green_score, y = organic_score) +
>   geom_jitter(width = 0.05, height = 0.05, alpha = 0.2) +
>   geom_smooth(method = "lm", formula = y ~ x) +
>   labs(
>     title = "More environmentally aware, more positive about organic (r = 0.51)",
>     x = "Environmental awareness (mean of 5 statements, -2 to +2)",
>     y = "Attitude towards organic (mean of 7 statements, -2 to +2)",
>     caption = "2,758 respondents who answered all twelve statements"
>   )
> ```

## Part 3: The finding

6. Write down your finding in three sentences. The first names the
   result with a number, the second the base, that is whom the number
   speaks about, how many they are and who is missing, and the third the
   limit, that is what explicitly does not follow from the result.

> [!HINT]
> Think of two things for the limit. The first is the sample: what the
> page on the [[milk-chocolate-survey]] says about it under "What to know
> before you calculate" is complemented by the section "Die Stichprobe ist
> nicht bundesrepräsentativ" (the sample is not representative of Germany)
> in the data set guide `course/datasets/mds12-schoko-milch.md` in your
> course folder. The second is that a relationship is not a cause; consider
> which third variable could be behind your result.

> [!SOLUTION]
> The same limit of the sample holds for all four questions: it is quota
> sampled by age, gender and federal state but not drawn at random, and
> with 13.6 per cent more respondents come from Lower Saxony than the quota
> provided for, because according to the data set guide additional people
> from the Osnabrück region were surveyed for a special topic.
>
> **Question A.**
> - *Result:* The higher the household income, the more often the
>   respondents buy at least about half organic, from 38.3 per cent under
>   €2,000 to 50.2 per cent at €5,000 and more.
> - *Base:* The numbers rest on 2,694 of the 2,811 respondents, since 117
>   gave no answer on income or on the organic share, and the top income
>   group comprises only 289 people.
> - *Limit:* The organic share is a self-assessment in a quota-sampled
>   online sample, and the relationship does not show that more money leads
>   to more organic food, because other characteristics of the households
>   change with income as well.
>
> **Question B.**
> - *Result:* In the countryside the respondents shop more often in a farm
>   shop (village 17.8 per cent, large city 11.9 per cent) but less often at
>   the weekly market (village 13.1 per cent, large city 19.0 per cent), so
>   that the share naming at least one of the two places hardly depends on
>   the place of residence.
> - *Base:* The numbers rest on 2,804 respondents with an answer on the
>   size of their place of residence, which they rated themselves, and the
>   rural groups are small, 388 in villages and 188 in small towns under
>   5,000 inhabitants.
> - *Limit:* The data say where the respondents shop, not why; whether
>   there is a weekly market or a farm shop near them is not in the data
>   set, and the result holds for Germany as a whole only with the caution
>   the sample calls for.
>
> **Question C.**
> - *Result:* Households with an e-bike buy at least about half organic
>   somewhat more often than households without, 48.5 against 43.2 per
>   cent.
> - *Base:* The numbers rest on 2,793 respondents with an answer on the
>   organic share, 705 of them with an e-bike; 18 without an answer are
>   missing.
> - *Limit:* It does not follow that green mobility and green consumption
>   go together, because e-bikes are owned above all by households with more
>   income, and according to question A these buy more organic food anyway.
>
> That income comes into question as a third variable is shown by e-bike
> ownership per income group: it rises from 13.8 per cent under €2,000 to
> 33.0 per cent in the two upper groups.
>
> ```r
> survey |>
>   filter(!is.na(d049einkommen)) |>
>   mutate(
>     income_group = case_when(
>       d049einkommen <= 4 ~ "under €2,000",
>       d049einkommen <= 7 ~ "€2,000 to under €3,500",
>       d049einkommen <= 10 ~ "€3,500 to under €5,000",
>       d049einkommen == 11 ~ "€5,000 and more"
>     ),
>     income_group = fct_relevel(
>       income_group, "under €2,000", "€2,000 to under €3,500",
>       "€3,500 to under €5,000", "€5,000 and more"
>     )
>   ) |>
>   group_by(income_group) |>
>   summarize(
>     n = n(),
>     share_ebike = mean(d039besitz_9ebike) * 100
>   )
> ```
>
> **Question D.**
> - *Result:* Whoever describes themselves as more environmentally aware
>   also has a more positive attitude towards organic food, with a
>   correlation of 0.51.
> - *Base:* The number rests on 2,758 of the 2,811 respondents who
>   answered all twelve statements; 53 are missing on at least one.
> - *Limit:* Both values are attitudes the same people stated in the same
>   questionnaire, and the correlation says neither what the cause is nor
>   whether these people actually buy more organic food.

## What comes next

This chapter completes the exercise. Afterwards, solve the
[[survey-self-test|self-test]] again, and in your course folder talk to the
[[opencode-course-assistant|course assistant]] about your code and your
finding at the final check.
