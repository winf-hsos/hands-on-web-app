---
title: From the question to the chart
summary: >-
  Six questions to the compact milk survey, and for each you choose the
  columns and the chart that answers it yourself, from age by diet to the
  brand experiment; at the end you finish a figure for a term paper.
objectives:
  intro: "In this exercise you answer questions to the milk survey with charts you choose yourself, and afterwards you can:"
  goals:
    - "find the columns that answer a question to survey data and name the scale of each column"
    - "choose the fitting chart from the scales of two variables, such as boxplots side by side or bars stacked to 100 %, and justify the choice in one sentence"
    - "put ordinal variables into the order of their scale with `factor()` and sort nominal groups by a value with `fct_reorder()`"
    - "leave out missing values explicitly with `filter()` and say in `caption` who is missing and why"
    - "finish a figure with a title that states the finding, a source and a theme, and save it with `ggsave()` in a size for a term paper"
translation_of: de
based_on: 2026-11-16
---

The tasks at the end of the lesson [[data-visualisation-basics]] already
name the chart, for example "as bars in the order of the scale". This
exercise turns that round: each task asks a question of the
[[milk-survey-compact|compact milk survey]], and you decide yourself which
columns answer it and which chart fits them. The question the lesson starts
with helps you here, namely which scale each of the two variables has. If you
are unsure, the demonstrator [[which-chart]] leads you to the fitting chart
with a few questions and gives you a template in R.

In the boxes the survey is ready as `survey`. Every starter box already
holds the frame of `survey |>`, `filter()`, `ggplot()`, `aes()` and `labs()`
and runs as it stands, with an empty panel as its result. The geom is
missing on purpose, because choosing it is part of the task; you write it
where the comment is. You leave out missing values explicitly with
`filter()` and say in `caption` who is missing and why, since in this survey
missing usually means "not asked".

## Age and diet

1. How old are the respondents who are vegetarian or vegan compared with the
   others? Choose columns and a chart that puts the age distributions of all
   five diets side by side, and leave out the respondents without an answer
   on diet.

```r
survey |>
  filter() |>
  ggplot() +
  aes() +
  # choose a geom that fits the scales and write it here
  labs()
```

> [!HINT]
> Age (`age`) is a number and diet (`diet`) a category without an order, and
> for a number per group the lesson showed you a chart that needs little
> space. `fct_reorder(diet, age)` sorts the groups by their median. To check:
> the median is 38 years for vegetarians, 41 for vegans and 51 for omnivores
> and flexitarians; 2,781 respondents remain, because 28 gave no diet.

## Milk in city and village

2. Is milk drunk less often in a city than in a village? Show for each town
   size (`town_size`) how often milk is drunk in the household (`milk_freq`),
   in a way that lets you compare the places despite their different sizes.

```r
survey |>
  filter() |>
  mutate() |>
  ggplot() +
  aes() +
  # choose a geom that fits the scales and write it here
  labs()
```

> [!HINT]
> Both columns are ordinal and come from the file as text, so in `mutate()`
> you put them into the order of their scale with `factor()` and `levels`,
> `town_size` from `city` through `large town`, `town`, `small town` and
> `very small town` to `village`. Because almost three times as many
> respondents live in a city as in a village, you compare shares rather than
> counts. To check: milk is drunk daily in the household of 60.1 % of the
> respondents in a city and of 61.9 % in a village, and 2,378 respondents
> remain.

## Meat for omnivores and flexitarians

3. Do omnivores really love meat more than flexitarians? Show for these two
   groups how they agree with the statement "I love meals with meat"
   (`loves_meat`, −2 to +2). You leave out vegetarians, vegans and
   pescetarians, because the question only compares the two groups who eat
   meat, and you say so in `caption`.

```r
survey |>
  filter() |>
  ggplot() +
  aes() +
  # choose a geom that fits the scales and write it here
  labs()
```

> [!HINT]
> `diet %in% c("omnivore", "flexitarian")` keeps exactly the two groups and
> drops the rows without a diet at the same time. `loves_meat` is a rating
> scale stored as a number; so that `fill` shows five levels instead of a
> colour gradient, you write `factor(loves_meat)` in `aes()`. To check: 74.9 %
> of the omnivores agree with +1 or +2, but only 33.9 % of the flexitarians,
> and 1,823 omnivores and 747 flexitarians remain.

## TikTok and age

4. People who use TikTok daily are younger, but how much younger? Show age
   for each level of use (`tiktok`, from `daily` to `never`). Only about half
   of the respondents were asked the question about media, and that belongs
   in `caption`.

```r
survey |>
  filter() |>
  mutate() |>
  ggplot() +
  aes() +
  # choose a geom that fits the scales and write it here
  labs()
```

> [!HINT]
> Use is ordinal, with the levels `daily`, `weekly`, `monthly`, `rarely` and
> `never`, and age is a number. That is the same combination as in task 1,
> except that here the groups keep the order of their scale instead of being
> sorted by the median. To check: 1,367 respondents were asked and 1,442 were
> not, and the median age is 35 years for daily use and 54 for `never`.

## The brand experiment

5. Do the respondents rate the seven milk brands differently? Those who took
   part in this section of the survey were shown one of seven brands
   (`rated_brand`) and rated its quality (`brand_quality`, −2 to +2). Chance
   decided which brand someone saw, so this is an experiment in which
   differences between the brands go back to the brand and not to the people
   who rated it. Show the ratings per brand so that the brand with the best
   ratings is at the top.

```r
survey |>
  filter() |>
  ggplot() +
  aes() +
  # choose a geom that fits the scales and write it here
  labs()
```

> [!HINT]
> The brand is nominal and may therefore be sorted by the ratings:
> `fct_reorder(rated_brand, brand_quality, .fun = mean)` orders it by the
> mean rating, and because the first level is at the bottom in horizontal
> bars, the best brand ends up at the top. The rating goes into `fill` with
> `factor()` as in task 3. To check: 71.6 % give Bärenmarke a +1 or +2,
> 46.6 % give Oatly one, and 2,309 ratings remain, because 478 respondents
> were shown no brand and 22 did not rate the one they were shown.

## Finishing a figure

6. Pick one of your figures from tasks 1 to 5 and finish it for a term
   paper: with a title that states the finding rather than only the topic, a
   `caption` with the source and with what you left out, a theme such as
   `theme_minimal()`, and saved with `ggsave()` in a size that fits a page.

```r
final_plot <- survey |>
  filter() |>
  ggplot() +
  aes() +
  labs(
    title = "",
    caption = ""
  ) +
  theme_minimal()

ggsave("figure.png", final_plot, width = 16, height = 10, units = "cm")

final_plot
```

> [!HINT]
> Copy the code of your figure in place of `filter()` to `aes()` and add the
> axes in `labs()`. A title that states the finding is a sentence such as
> "Vegetarians are the youngest group" instead of "Age by diet". An A4 page
> with the usual margins has about 16 cm of width; if you save the figure at
> this width, it does not have to be scaled down in the paper, and the
> lettering appears about as large as the text.

## To think about

- In task 1 the boxes of the 36 vegans and of the 1,826 omnivores are equally
  wide. What does the chart tell you about the size of the groups, and how
  would you make it visible?
- Task 2 shows hardly any difference between city and village. What would a
  title be that states this result honestly, and why is that a finding too?
- Why may you say after task 5 that the brand changes the rating, but not
  after task 1 that younger people are vegetarian because of their age?

## Solutions

> [!SOLUTION]
> Task 1:
>
> ```r
> survey |>
>   filter(!is.na(diet)) |>
>   ggplot() +
>   aes(x = age, y = fct_reorder(diet, age)) +
>   geom_boxplot() +
>   labs(
>     x = "Age in years", y = NULL,
>     caption = "28 respondents without an answer on diet left out"
>   )
> ```
>
> Boxplots side by side show a number per group most compactly, and because
> diet is nominal, you may sort the groups by the median. Vegetarians are
> the youngest group with a median of 38 years and vegans the second
> youngest with 41, while omnivores, flexitarians and pescetarians are almost
> the same age at 51, 51 and 52 years. The boxplot hides, however, that only
> 36 people each stand behind the boxes of the vegans and the pescetarians;
> histograms with `facet_wrap(~ diet)` show this, because the small groups
> hardly have any bars there.

> [!SOLUTION]
> Task 2:
>
> ```r
> survey |>
>   filter(!is.na(milk_freq), !is.na(town_size)) |>
>   mutate(
>     town_size = factor(town_size, levels = c(
>       "city", "large town", "town", "small town", "very small town", "village"
>     )),
>     milk_freq = factor(milk_freq, levels = c(
>       "daily", "weekly", "monthly", "rarely"
>     ))
>   ) |>
>   ggplot() +
>   aes(y = town_size, fill = milk_freq) +
>   geom_bar(position = "fill") +
>   labs(
>     x = "Share of respondents", y = NULL, fill = "Milk at home",
>     caption = "424 respondents not asked about milk and 7 without a town size left out"
>   )
> ```
>
> You compare two categories with bars stacked to 100 %, and because both
> are ordinal, bars and colours keep the order of their scale. The answer is
> no: in all six town sizes, milk is drunk daily by 56 to 64 % of the
> respondents, 60.1 % in a city and 61.9 % in a village, and the small
> differences follow no direction from large to small places. Those who had
> not consumed milk in the last twelve months were not asked, and they are
> the 424 missing answers.

> [!SOLUTION]
> Task 3:
>
> ```r
> survey |>
>   filter(diet %in% c("omnivore", "flexitarian"), !is.na(loves_meat)) |>
>   ggplot() +
>   aes(y = diet, fill = factor(loves_meat)) +
>   geom_bar(position = "fill") +
>   labs(
>     x = "Share of respondents", y = NULL,
>     fill = "\"I love meals\nwith meat\"\n(-2 to +2)",
>     caption = "Only omnivores and flexitarians; 5 of them without a rating left out"
>   )
> ```
>
> You show a rating scale per group as bars stacked to 100 %, because its
> levels are ordered categories and shares make groups of different sizes
> comparable. The answer is yes, and clearly so: 74.9 % of the omnivores
> agree, 38.7 % even with +2, while among flexitarians it is 33.9 % and
> 8.0 %, and their largest group, 43.0 %, stays in the middle at 0.

> [!SOLUTION]
> Task 4:
>
> ```r
> survey |>
>   filter(!is.na(tiktok)) |>
>   mutate(tiktok = factor(tiktok, levels = c(
>     "daily", "weekly", "monthly", "rarely", "never"
>   ))) |>
>   ggplot() +
>   aes(x = tiktok, y = age) +
>   geom_boxplot() +
>   labs(
>     x = "Uses TikTok", y = "Age in years",
>     caption = "Only the 1,367 respondents who were asked about TikTok"
>   )
> ```
>
> Age is a number and use is ordinal, so boxplots stand side by side in the
> order of the scale. The median rises from 35 years for daily use through
> 40, 41 and 44 years to 54 years for `never`, so daily users are 19 years
> younger in the median than those who never use TikTok; the boxes overlap,
> though, and a quarter of the daily users are 51 or older. That half were
> not asked probably distorts the picture little as far as age goes, since
> those asked and those not asked have the same median age, 50 years.

> [!SOLUTION]
> Task 5:
>
> ```r
> survey |>
>   filter(!is.na(brand_quality)) |>
>   ggplot() +
>   aes(
>     y = fct_reorder(rated_brand, brand_quality, .fun = mean),
>     fill = factor(brand_quality)
>   ) +
>   geom_bar(position = "fill") +
>   labs(
>     x = "Share of respondents", y = NULL, fill = "Quality\n(-2 to +2)",
>     caption = "Each respondent rated one brand drawn at random; 500 without a rating left out"
>   )
> ```
>
> The brand is nominal and the rating a rating scale, so bars stacked to
> 100 % per brand fit, sorted by the mean rating. Five brands lie close
> together, from 71.6 % high ratings (+1 or +2) for Bärenmarke to 64.6 % for
> Milchhof Müller regional, while Gut&Günstig with 51.6 % and Oatly with
> 46.6 % fall clearly behind. Because chance assigned the brand, you may
> attribute the difference to the brand; whether it is more than chance only
> a test can tell.

> [!SOLUTION]
> Task 6, here with the figure from task 5:
>
> ```r
> final_plot <- survey |>
>   filter(!is.na(brand_quality)) |>
>   ggplot() +
>   aes(
>     y = fct_reorder(rated_brand, brand_quality, .fun = mean),
>     fill = factor(brand_quality)
>   ) +
>   geom_bar(position = "fill") +
>   labs(
>     title = "Oatly and Gut&Günstig are rated lowest for quality",
>     x = "Share of respondents", y = NULL, fill = "Quality\n(-2 to +2)",
>     caption = "Source: milk survey, compact. Each respondent rated one of seven brands drawn at random.\n2,309 ratings; 500 respondents without a rating left out."
>   ) +
>   theme_minimal()
>
> ggsave("brand_quality.png", final_plot, width = 16, height = 10, units = "cm")
>
> final_plot
> ```
>
> The form stays the one from task 5, because it fits a nominal brand and a
> rating scale; what is new is only the title that states the finding, the
> source with what is missing, the quieter theme and the file. At 16 by 10 cm
> the figure fills the width of an A4 page without the lettering getting
> smaller when it is inserted.
