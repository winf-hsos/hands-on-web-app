---
title: "Self-study R, chapter 2: Describing single variables"
summary: >-
  Eight tasks on the survey on milk and chocolate: determine levels of
  measurement, choose summary statistics, translate codes, spot missing and
  implausible values, analyse multiple responses and item batteries.
objectives:
  intro: "In this chapter you describe single variables of the survey, and afterwards you can:"
  goals:
    - "determine the level of measurement of a variable and check whether its data type in R fits it"
    - "compute the summary statistics that fit the level of measurement with `summarise()`"
    - "put text and codes into a meaningful order and give them meaning with `factor()`"
    - "count missing values and tell whether a question was not answered or never asked"
    - "compare raw data with prepared columns and find implausible values"
    - "analyse multiple responses as shares of respondents and an item battery with `across()`"
translation_of: de
based_on: 2026-11-11
---

The self-study follows one guiding question through five chapters: **Where
do the respondents shop, and who buys organic?** After getting to know the
data set in [[survey-exercise-first-look|chapter 1]], in this chapter you
describe single variables: what they measure, at which level of
measurement, how many values are missing and which summary statistic fits.
On top of that come three forms of data that turn up in surveys all the
time: codes that first have to be given a meaning, multiple responses and
item batteries.

In the boxes on this page the complete
[[milk-chocolate-survey|survey on milk and chocolate]] is ready as the table
`survey`, with 2,811 rows and 606 columns, and the tidyverse packages are
loaded. Every box runs on its own: whatever you create in one box, a new
column for instance, no longer exists in the next. In `chapter_2.R` from your
course folder the tasks carry the numbers 2.1 to 2.8 in the same order. Every task comes with a
control value, a hint with the reading and a solution; try each one on your
own first.

Before you start, read chapter 8.4 "Messung und die vier Skalenniveaus"
(measurement and the four levels of measurement) in
[[doering-research-methods|Döring (2023)]] and, in
[[r-for-data-science|R for Data Science]], the sections
[3.2 "Rows" and 3.3 "Columns"](https://r4ds.hadley.nz/data-transform.html#rows),
[3.4 "The pipe"](https://r4ds.hadley.nz/data-transform.html#sec-the-pipe),
[13.3 "Counts" and 13.6 "Numeric summaries"](https://r4ds.hadley.nz/numbers.html#sec-counts)
as well as [16.2 "Factor basics"](https://r4ds.hadley.nz/factors.html#factor-basics),
plus the section "What to know before you calculate" on the page of the
data set.

## Part 1: Level of measurement and data type

1. Determine the level of measurement (nominal, ordinal, interval
   or ratio) of each of the variables `q003land`, `D044stadtf`,
   `Q002alter`, `v032bioanteil`, `d049einkommen` and `p031bio_1lieberbio`,
   and justify it in half a sentence. Then use `glimpse()` to see which
   data type R has given each of these columns, and describe where it does
   not fit the level of measurement.

```r
survey
```

> [!HINT]
> With 606 columns, `glimpse(survey)` gets very long; pick the six columns
> with `select()` first. What the codes mean is in the section "Wichtige
> Variablen und ihre Codes" (important variables and their codes) of
> `course/datasets/mds12-schoko-milch.md` in your course folder; the
> statement behind `p031bio_1lieberbio` reads "When shopping for food I
> prefer organic products". Reading: Döring 8.4 and R4DS
> [16.1 and 16.2](https://r4ds.hadley.nz/factors.html#factor-basics).

> [!SOLUTION]
> ```r
> survey |>
>   select(
>     q003land, D044stadtf, Q002alter,
>     v032bioanteil, d049einkommen, p031bio_1lieberbio
>   ) |>
>   glimpse()
> ```
>
> - `q003land` is nominal, since the federal states have no order, and the
>   numbers 1 to 16 are just codes assigned in alphabetical order.
> - `D044stadtf` is ordinal, since places of residence can be ordered from
>   the large city down to the village, but the steps are not equally far
>   apart.
> - `Q002alter` is ratio-scaled, since age has a natural zero, and "twice
>   as old" makes sense.
> - `v032bioanteil` is ordinal, since its five steps range from "(almost)
>   never organic" to "(almost) only organic", without equal distances.
> - `d049einkommen` is ordinal, since it consists of eleven income
>   brackets, the first ("under €500") and the last ("€5,000 and more") of
>   which are open.
> - `p031bio_1lieberbio` is ordinal, an agreement from −2 to +2; in
>   practice such scales are often treated as interval-scaled as soon as
>   you compute means, as in task 8.
>
> R only knows numbers and text: all columns except `D044stadtf` are
> integers (`<int>`), `D044stadtf` is text (`<chr>`). This fits only for
> age. For federal state, organic share and income, R takes codes for
> numbers you could calculate with, although an average federal state of
> 7.6, for instance, means nothing, and for the place of residence the text
> knows no order, so R sorts it alphabetically. If you load the file on
> your computer with `read_csv()`, you see `<dbl>` instead of `<int>`,
> because `read_csv()` reads all numbers as decimal numbers; the finding
> stays the same.

## Part 2: Summary statistics and orders

2. Compute minimum, maximum, median and standard deviation of
   `Q002alter` in a single `summarise()`, and explain in one sentence why
   these are the fitting statistics for this variable. To check: median
   50, standard deviation 14.7.

```r
survey
```

> [!HINT]
> The functions are called `min()`, `max()`, `median()` and `sd()`, and
> `summarise()` takes several of them one after another, each with its own
> name for the new column. Reading: R4DS
> [13.6 "Numeric summaries"](https://r4ds.hadley.nz/numbers.html#numeric-summaries).

> [!SOLUTION]
> ```r
> survey |>
>   summarise(
>     min_age = min(Q002alter),
>     max_age = max(Q002alter),
>     median_age = median(Q002alter),
>     sd_age = sd(Q002alter)
>   )
> ```
>
> The respondents are between 18 and 80 years old, half of them are 50 or
> younger, and the standard deviation is 14.7 years. Since age is
> ratio-scaled, distances and therefore a spread make sense, and minimum
> and maximum show the range set by the quotas. No age value is missing,
> so there is no need for `na.rm = TRUE` here.

3. Count the respondents by `D044stadtf` with `count()`. The order
   is alphabetical and therefore meaningless, since "Dorf" (village) comes
   before "Großstadt" (large city). So use `mutate()` to create a new
   column `city_size` that holds the same values as a factor in the order
   of the codebook, from "Großstadt" to "Dorf", and then count by
   `city_size`. Describe in one sentence which category is the most
   frequent (the mode) and how many people gave no answer. To check:
   "Große Mittelstadt" is second in the table, and `NA` stands at 7
   people.

```r
survey
```

> [!HINT]
> The order in the codebook (page 32; the PDF is in your course folder at
> `data/M3b_Musterstudie-quantitativ.pdf`) is Großstadt, Große
> Mittelstadt, Große Kleinstadt, Kleinstadt over 5,000, Kleinstadt under
> 5,000 and Dorf. In `factor(D044stadtf, levels = c("Großstadt", ...))`,
> write the values exactly as `count()` shows them, because a typo
> silently turns a value into `NA`. Reading: R4DS
> [16.2 "Factor basics"](https://r4ds.hadley.nz/factors.html#factor-basics).

> [!SOLUTION]
> ```r
> survey |>
>   count(D044stadtf)
> ```
>
> ```r
> survey |>
>   mutate(
>     city_size = factor(
>       D044stadtf,
>       levels = c(
>         "Großstadt", "Große Mittelstadt", "Große Kleinstadt",
>         "Kleinstadt >5000", "Kleinstadt <5000", "Dorf"
>       )
>     )
>   ) |>
>   count(city_size)
> ```
>
> The most frequent category is the large city with 1,042 respondents,
> more than a third, and 7 people gave no answer. If after the conversion
> `NA` shows a larger number than 7, one of the values in `levels` is
> misspelt.

4. `v032bioanteil` is the share of organic food in one's own
   shopping, as a code from 1 to 5. Create a column `organic_share` that
   carries the codes as text, in the right order, with `factor()`,
   `levels = 1:5` and `labels = c(...)`. Then count by `organic_share`,
   compute the share in percent with `mutate()` after `count()`, and
   describe in one sentence which value is the median. To check: "(fast)
   nie Bio" 21.7%, "etwa die Hälfte" 26.3%, 18 people without an answer.

```r
survey
```

> [!HINT]
> The codes are on page 28 of the codebook (chapter 1, task 4): 1
> "(fast) nie Bio" ((almost) never organic), 2 "deutlich weniger als die
> Hälfte" (clearly less than half), 3 "etwa die Hälfte" (about half), 4
> "deutlich mehr als die Hälfte" (clearly more than half), 5 "(fast) nur
> Bio" ((almost) only organic). You find the median of an ordered variable
> by adding up the shares from the top until you pass 50 percent. Reading:
> R4DS [16.2](https://r4ds.hadley.nz/factors.html#factor-basics) and
> [3.3 "Columns"](https://r4ds.hadley.nz/data-transform.html#columns)
> (`mutate()` is there).

> [!SOLUTION]
> ```r
> survey |>
>   mutate(
>     organic_share = factor(
>       v032bioanteil,
>       levels = 1:5,
>       labels = c(
>         "(fast) nie Bio", "deutlich weniger als die Hälfte", "etwa die Hälfte",
>         "deutlich mehr als die Hälfte", "(fast) nur Bio"
>       )
>     )
>   ) |>
>   count(organic_share) |>
>   mutate(percent = n / sum(n) * 100)
> ```
>
> A third of the respondents say they buy clearly less than half organic
> (33.4%), a good fifth (almost) never and only 3.9% (almost) only organic.
> Since the `NA` row counts in `sum(n)`, the percentages refer to all 2,811
> respondents. The median is "deutlich weniger als die Hälfte" (clearly
> less than half), because of the 2,793 people with an answer, 21.8% are at
> code 1 and 55.4% together at code 1 or 2. You can check this with
> `median(v032bioanteil, na.rm = TRUE)` in a `summarise()`, which gives 2;
> this is allowed because the median only needs the order.

## Part 3: Missing and implausible values

5. Compute how many respondents gave no answer on income
   (`d049einkommen`), as a count and in percent. Describe in one sentence
   why they might be missing and whether this is the same kind of missing
   as with a question that was never put to someone. To check: 3.6%.

```r
survey
```

> [!HINT]
> `is.na()` returns `TRUE` or `FALSE` for every row. Its sum is the number
> of missing values, its mean their share. Reading: R4DS
> [18.2 "Explicit missing values"](https://r4ds.hadley.nz/missing-values.html#explicit-missing-values)
> and, on the page of the [[milk-chocolate-survey|data set]], the section
> "What to know before you calculate".

> [!SOLUTION]
> ```r
> survey |>
>   summarise(
>     n_missing = sum(is.na(d049einkommen)),
>     percent_missing = mean(is.na(d049einkommen)) * 100
>   )
> ```
>
> Income is missing for 100 of the 2,811 respondents, that is 3.6%. The
> questionnaire offered "Keine Angabe" (no answer) here, and income is a
> question many find too personal; so the question was put to everyone,
> and 100 people declined to answer. This is a different kind of missing
> than with a filter question someone never got: there, no answer exists
> because none was expected, while here an answer is missing that should
> have been there.

6. The question about the number of children under 12 exists
   twice, raw (`d043kinderzahl`) and prepared (`D043kinderzahl`).

   a) Compare the maximum of both columns and describe what has happened.

   b) Show the rows that have a raw value but no prepared one, together
   with the household size `d042hhzahl`, and describe how you can tell
   that these values cannot be right. So that you can find the rows again,
   first create a column `respondent_id` that numbers the rows, as in
   chapter 1.

   c) Use `count(d042hhzahl, is_asked = !is.na(d043kinderzahl))` to count
   who has a value at all, and describe who was asked the question.

   To check: 12 values were removed during preparation.

```r
survey
```

> [!HINT]
> With `max()` you need `na.rm = TRUE` here, because many values are
> missing. For b) you combine two conditions in `filter()` with
> `!is.na()` and `is.na()`. The condition for c) is on page 32 of the
> codebook: the question only came up if question 42 (persons in the
> household) said at least 2. Reading: `course/datasets/mds12-schoko-milch.md`
> in your course folder, "Fehlend heißt oft: nicht gefragt" (missing often
> means: not asked), and R4DS
> [12.2 "Comparisons"](https://r4ds.hadley.nz/logicals.html#comparisons).

> [!SOLUTION]
> ```r
> survey |>
>   summarise(
>     max_raw = max(d043kinderzahl, na.rm = TRUE),
>     max_clean = max(D043kinderzahl, na.rm = TRUE)
>   )
> ```
>
> The raw maximum is 911234567890 children, the prepared one 9. Any number
> could be typed into the field, and the impossible values were removed
> during preparation.
>
> ```r
> survey |>
>   mutate(respondent_id = row_number(), .before = 1) |>
>   filter(!is.na(d043kinderzahl), is.na(D043kinderzahl)) |>
>   select(respondent_id, d042hhzahl, d043kinderzahl, D043kinderzahl)
> ```
>
> There are 12 rows. A household of 2 to 4 people cannot have 11, 22, 222
> or 1,000 children under 12, let alone more children than people; values
> like 12345 or 11111010 look more like randomly typed digits than like an
> answer. The prepared column is not entirely clean either: two people from
> two-person households have 9 children there.
>
> ```r
> survey |>
>   count(d042hhzahl, is_asked = !is.na(d043kinderzahl))
> ```
>
> People living alone never have a value, which fits the condition in the
> codebook: only those who reported at least two people in their household
> got the question. In households of two or more, by contrast, the value is
> missing for only 79 people, who should have got the question according to
> the condition, and for the 14 people without a household size it is
> missing entirely. So the column `is_asked` shows who has a value; who was
> asked is only revealed by the condition in the codebook.

## Part 4: Multiple responses and item batteries

7. For the question "Where do you usually buy your food?" every
   person could name several places, and there is one column per place,
   from `v008ort_1discount` to `v008ort_9online` (1 = named, 0 = not
   named). Compute for each of the nine places the share of respondents
   who named it, in percent, sort in descending order and save the result
   as `places`. Explain in one sentence why the mean of a 0/1 column is a
   share. Keep the code, since you will need the table again in chapter 4.
   To check: weekly market 17.5%, farm shop 14.1%, organic shop 12.8%.

```r
survey
```

> [!HINT]
> The way goes through `summarise(across(v008ort_1discount:v008ort_9online, mean))`,
> which gives one wide row with nine means, and `pivot_longer()`, which
> turns it into a long table with one row per place. Reading: R4DS
> [5.3 "Lengthening data"](https://r4ds.hadley.nz/data-tidy.html#sec-pivoting),
> [12.4 "Summaries"](https://r4ds.hadley.nz/logicals.html#sec-logical-summaries)
> and `course/datasets/mds12-schoko-milch.md` in your course folder,
> "Mehrfachantworten: die Basis ist die Person" (multiple responses: the
> base is the person).

> [!SOLUTION]
> ```r
> places <- survey |>
>   summarise(across(v008ort_1discount:v008ort_9online, mean)) |>
>   pivot_longer(
>     everything(),
>     names_to = "place",
>     values_to = "share"
>   ) |>
>   mutate(percent = share * 100) |>
>   arrange(desc(percent))
>
> places
> ```
>
> The supermarket leads with 75.9% and the discounter with 73.5%, ahead of
> the specialist shop with 36.6% and the hypermarket with 30.2%; at the
> very end are the two online channels with 10.8% and 6.2%. The mean of a
> 0/1 column is the sum of the ones divided by the number of people, and
> that is exactly the share of those who named the place. The percentages
> add up to a good 277%, because every person named almost three places on
> average; the base is the person, not the mention.

8. Question 31 consists of seven statements about organic
   products, each from +2 (fully agree) to −2 (strongly disagree), in the
   columns `p031bio_1lieberbio` to `p031bio_7besserfuehlen`.

   a) Use `across(starts_with(...))` to compute the mean of each
   statement.

   b) Two statements are marked (R) in the codebook. Describe which ones
   they are and what this means for a mean across all seven statements.

   To check: `p031bio_5gesund` has the highest mean, 0.18.

```r
survey
```

> [!HINT]
> A few values are missing in every statement; without `na.rm = TRUE`
> every mean is `NA`. So that `across()` passes it on to `mean()`, you
> write the function as `\(x) mean(x, na.rm = TRUE)`. The statements are
> on pages 27 and 28 of the codebook, which is only in your course folder
> (`data/M3b_Musterstudie-quantitativ.pdf`). Watch the direction: for which
> statements does agreement mean that someone values organic less?

> [!SOLUTION]
> ```r
> survey |>
>   summarise(across(starts_with("p031bio"), \(x) mean(x, na.rm = TRUE))) |>
>   pivot_longer(
>     everything(),
>     names_to = "statement",
>     values_to = "mean"
>   )
> ```
>
> All means are close to zero, between −0.10 for `p031bio_2gleich` and
> 0.18 for `p031bio_5gesund` ("Organic food is healthier than conventional
> food"); on average the respondents are clearly for or against none of
> the statements. Marked (R) are `p031bio_2gleich` ("I see hardly any
> differences between organically and conventionally produced food") and
> `p031bio_4teuer` ("I do not buy organic food because it is too expensive
> for me"). For these two, agreement means a negative attitude towards
> organic, for the other five a positive one. If you simply average all
> seven, the two work against the rest; they have to be reversed first,
> and since the scale is centred on zero, a minus sign is enough, for
> instance `-p031bio_2gleich`.

## What comes next

In the course, the [[opencode-course-assistant|course assistant]] guides
you through the chapters and looks at your code; the next step is
[[survey-exercise-comparing-groups|chapter 3: Comparing groups]].
