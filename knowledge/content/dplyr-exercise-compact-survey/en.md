---
title: "Exercise: From raw data to the compact data set"
summary: >-
  In Positron you turn the full survey on milk and chocolate with 606 columns
  into the compact data set with 21 columns: load, filter, select and rename,
  translate codes into words, and save the result as CSV and as RDS.
objectives:
  intro: "In this exercise you prepare a real raw data set for analysis, and afterwards you can:"
  goals:
    - "load a large CSV file with `read_csv()` and look at it with `dim()` and `glimpse()` before you change anything"
    - "keep rows with `filter()` and `%in%` and explain why you leave some out"
    - "select and rename columns in one step with `select()`"
    - "translate number codes into named levels with `factor()` and build new columns with `case_when()` and `if_else()`"
    - "save a table with `write_csv()` and `saveRDS()` and explain what the RDS file keeps and the CSV file loses"
translation_of: de
based_on: 2026-11-09
---

## Task

The [[milk-chocolate-survey|survey on milk and chocolate]] comes as one file
with 2,811 rows and 606 columns, whose names are codes from the questionnaire
and whose values are mostly numbers whose meaning only the codebook knows. For
the analysis you need 21 of these columns, with names you can read and words
instead of codes. Exactly this table is the
[[milk-survey-compact|compact data set]], and in this exercise you build it
yourself. You work in [[positron|Positron]] on your own computer, because the
raw data are too large for the browser, and you write every step into a
script so that you can repeat them at any time.

1. Create a project folder in Positron, download the file
   `mds12_schoko_milch.csv` from the page of the
   [[milk-chocolate-survey|survey]] and put it into this folder. Load it with
   `read_csv()` into a table `raw` and look at it with `dim()` and
   `glimpse()`.
2. Count with `count()` which values occur in `q004geschlecht`, and keep only
   the people with 1 (male) or 2 (female) with `filter()`. The two people who
   answered "diverse" are too few for an analysis and would be easy to
   recognise in the data.
3. Select the columns of the following table with `select()` and give them
   their new name in the same step, following the pattern `new = old`.
4. Translate the number codes of `gender`, `state`, `town_size`, `diet`,
   `milk_freq` and `tiktok` into words with `mutate()` and `factor()`.
5. Build the remaining columns with `mutate()`: `price_too_expensive` from
   the two price columns, `shops_discounter` and `shops_organic` as `TRUE` or
   `FALSE`, a corrected brand name in `rated_brand`, and a running number
   `id`. Then put the columns into the order of the compact data set with
   `select()`.
6. Save the table with `write_csv()` as `milk_survey_compact.csv` and with
   `saveRDS()` as `milk_survey_compact.rds`. Read both files back in and
   compare them with `glimpse()` and with `count(diet)`.

These are the columns you need, with their names in the raw data:

| new name | column in the raw data | what it holds |
|---|---|---|
| `age` | `Q002alter` | age in years |
| `gender` | `q004geschlecht` | 1 male, 2 female |
| `state` | `q003land` | federal state, 1 to 16 in alphabetical order |
| `town_size` | `d044stadt` | size of the place of residence, 1 city to 6 village |
| `household_size` | `d042hhzahl` | people in the household |
| `diet` | `v041nofleisch` | diet, 0 to 4 |
| `organic_share` | `v032bioanteil` | share of organic food in the shopping, 1 to 5 |
| `milk_freq` | `v007freq3_mi` | how often milk is drunk, 4 daily to 1 rarely |
| `milk_brand` | `AB1619pvonw2f` | price experiment: brand shown |
| `price_weihenstephan` | `u017pvonwzuteuer1` | too expensive from … euros, if Weihenstephan was shown |
| `price_alpro` | `u017pvonwzuteuer2` | too expensive from … euros, if alpro was shown |
| `shops_discounter` | `v008ort_1discount` | shops at a discounter, 1 or 0 |
| `shops_organic` | `v008ort_7bioladen` | shops at an organic store, 1 or 0 |
| `eco_conscious` | `p030green_5umweltbewusst` | "environmentally conscious", −2 to +2 |
| `prefers_organic` | `p031bio_1lieberbio` | "prefer organic", −2 to +2 |
| `loves_meat` | `p033meat_1fan` | "love meat", −2 to +2 |
| `loves_cooking` | `p035koch_2hobby` | "love cooking", −2 to +2 |
| `rated_brand` | `AX010midiff7f` | brand experiment: brand shown |
| `brand_quality` | `B010midiff7_1quali` | quality of this brand, −2 to +2 |
| `brand_buy` | `B010midiff7_14kauf` | would buy this brand, −2 to +2 |
| `tiktok` | `d216medien_18tiktok` | use of TikTok, 4 daily to 0 never |

## What it should look like

At the end of step 5, `glimpse(survey)` shows this table:

```text
Rows: 2,809
Columns: 21
$ id                  <int> 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,…
$ age                 <dbl> 55, 35, 62, 36, 60, 68, 65, 41, 51, 71, 64…
$ gender              <fct> male, male, male, female, male, male, fema…
$ state               <fct> Baden-Württemberg, Hessen, Hamburg, Sachse…
$ town_size           <fct> very small town, city, city, city, city, t…
$ household_size      <dbl> 1, 2, 1, 1, 1, 2, 1, 5, 2, 1, 1, 2, 1, 2, …
$ diet                <fct> omnivore, omnivore, omnivore, flexitarian,…
$ organic_share       <dbl> 1, 2, 3, 2, 1, 2, 2, 2, 2, 3, 1, 3, 2, 3, …
$ milk_freq           <fct> rarely, daily, NA, monthly, daily, daily, …
$ milk_brand          <chr> NA, NA, NA, NA, NA, NA, NA, "alpro", NA, N…
$ price_too_expensive <dbl> NA, NA, NA, NA, NA, NA, NA, 2.99, NA, NA, …
$ shops_discounter    <lgl> TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, …
$ shops_organic       <lgl> FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, …
$ eco_conscious       <dbl> 0, 0, 2, 1, 2, 0, 0, 2, 2, 2, -1, 1, 1, 2,…
$ prefers_organic     <dbl> -2, 2, 2, 1, -1, 0, 0, 1, 0, 1, -2, 0, -1,…
$ loves_meat          <dbl> 0, 2, 2, -1, 2, 1, 0, 0, 1, 1, 2, 2, 2, 1,…
$ loves_cooking       <dbl> -2, -1, 0, 0, 0, 1, 2, 1, -2, 0, 0, 1, 1, …
$ rated_brand         <chr> "Weihenstephan", "Berchtesgadener Land", N…
$ brand_quality       <dbl> 1, 0, NA, 1, 1, 0, 0, 2, 2, NA, 0, 0, NA, …
$ brand_buy           <dbl> -1, 1, NA, NA, -2, 0, -1, 1, 2, NA, -2, 0,…
$ tiktok              <fct> NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA…
```

## Your code

Write the code into a script in your project folder, such as
`compact-survey.R`. The skeleton shows the steps, and you fill the gaps:

```r static
library(tidyverse)

# 1. Load and look
raw <- read_csv("mds12_schoko_milch.csv")
dim(raw)
glimpse(raw)

# 2. Only male and female
raw |>
  count()

# 3. to 5. Select, rename, translate, build
survey <- raw |>
  filter() |>
  select(
    age = Q002alter,
    gender = q004geschlecht
    # … the other columns of the table
  ) |>
  mutate(
    gender = factor(gender, levels = 1:2, labels = c("male", "female"))
    # … the other translations and new columns
  ) |>
  select()

glimpse(survey)

# 6. Save and compare
write_csv(survey, "milk_survey_compact.csv")
saveRDS(survey, "milk_survey_compact.rds")
```

> [!HINT]
> With 606 columns `glimpse()` prints a very long output. For a first look,
> `glimpse(raw[, 1:20])` is often enough, which shows only the first 20
> columns. To check: `dim(raw)` returns 2811 and 606, and `count()` finds
> 1,328 people with 1, 1,481 with 2 and two people with the value 3 in
> `q004geschlecht`.

> [!HINT]
> `factor()` turns a column into one with fixed levels. `levels` names the
> codes in the order the levels should have, and `labels` the words for
> them, in the same order:
>
> ```r static
> diet = factor(
>   diet,
>   levels = 0:4,
>   labels = c("omnivore", "flexitarian", "vegetarian", "vegan", "pescetarian")
> )
> ```
>
> For `milk_freq` and `tiktok` the large codes stand for often, which is why
> `levels` begins with the largest number there, `4:1` and `4:0`. The words
> for `town_size` are `city`, `large town`, `town`, `small town`,
> `very small town` and `village`, for `milk_freq` `daily`, `weekly`,
> `monthly` and `rarely`, and `tiktok` adds `never`. The 16 federal states
> are best written into a vector `states` first.

> [!HINT]
> Whoever saw Weihenstephan in the price experiment has their price in
> `price_weihenstephan`, whoever saw alpro in `price_alpro`. `case_when()`
> picks the matching column for each row. A column of 1 and 0 becomes one of
> `TRUE` and `FALSE` with `shops_discounter == 1`. `rated_brand` holds the
> typo "Berchtesgardener Land" 316 times, which `if_else()` replaces with
> "Berchtesgadener Land". `row_number()` gives the running number, and in the
> last `select()` `shops_discounter:tiktok` takes every column from the one
> to the other.

> [!SOLUTION]
> ```r static
> library(tidyverse)
>
> raw <- read_csv("mds12_schoko_milch.csv")
> dim(raw)
>
> raw |>
>   count(q004geschlecht)
>
> states <- c(
>   "Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen",
>   "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen",
>   "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen",
>   "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen"
> )
>
> survey <- raw |>
>   filter(q004geschlecht %in% c(1, 2)) |>
>   select(
>     age = Q002alter,
>     gender = q004geschlecht,
>     state = q003land,
>     town_size = d044stadt,
>     household_size = d042hhzahl,
>     diet = v041nofleisch,
>     organic_share = v032bioanteil,
>     milk_freq = v007freq3_mi,
>     milk_brand = AB1619pvonw2f,
>     price_weihenstephan = u017pvonwzuteuer1,
>     price_alpro = u017pvonwzuteuer2,
>     shops_discounter = v008ort_1discount,
>     shops_organic = v008ort_7bioladen,
>     eco_conscious = p030green_5umweltbewusst,
>     prefers_organic = p031bio_1lieberbio,
>     loves_meat = p033meat_1fan,
>     loves_cooking = p035koch_2hobby,
>     rated_brand = AX010midiff7f,
>     brand_quality = B010midiff7_1quali,
>     brand_buy = B010midiff7_14kauf,
>     tiktok = d216medien_18tiktok
>   ) |>
>   mutate(
>     id = row_number(),
>     gender = factor(gender, levels = 1:2, labels = c("male", "female")),
>     state = factor(state, levels = 1:16, labels = states),
>     town_size = factor(
>       town_size,
>       levels = 1:6,
>       labels = c("city", "large town", "town", "small town", "very small town", "village")
>     ),
>     diet = factor(
>       diet,
>       levels = 0:4,
>       labels = c("omnivore", "flexitarian", "vegetarian", "vegan", "pescetarian")
>     ),
>     milk_freq = factor(
>       milk_freq,
>       levels = 4:1,
>       labels = c("daily", "weekly", "monthly", "rarely")
>     ),
>     tiktok = factor(
>       tiktok,
>       levels = 4:0,
>       labels = c("daily", "weekly", "monthly", "rarely", "never")
>     ),
>     price_too_expensive = case_when(
>       milk_brand == "Weihenstephan" ~ price_weihenstephan,
>       milk_brand == "alpro" ~ price_alpro
>     ),
>     shops_discounter = shops_discounter == 1,
>     shops_organic = shops_organic == 1,
>     rated_brand = if_else(rated_brand == "Berchtesgardener Land", "Berchtesgadener Land", rated_brand)
>   ) |>
>   select(
>     id, age, gender, state, town_size, household_size, diet,
>     organic_share, milk_freq, milk_brand, price_too_expensive,
>     shops_discounter:tiktok
>   )
>
> glimpse(survey)
>
> write_csv(survey, "milk_survey_compact.csv")
> saveRDS(survey, "milk_survey_compact.rds")
>
> from_csv <- read_csv("milk_survey_compact.csv")
> from_rds <- readRDS("milk_survey_compact.rds")
>
> from_csv |>
>   count(diet)
>
> from_rds |>
>   count(diet)
> ```
>
> From the CSV file, `diet` comes back as text, and `count()` sorts the diets
> alphabetically, from `flexitarian` to `vegetarian`. From the RDS file it
> comes back as a factor, and `count()` keeps the order of the levels you
> set, from `omnivore` to `pescetarian`. A CSV file is plain text that every
> program can read, but it knows no types; only R can read the RDS file, but
> in return it keeps the table exactly as you built it. On the side, at 35 kB
> it is not even an eighth of the size of the CSV file at 296 kB, and the raw
> data still had 4.9 MB.

## For the quick ones

The columns `price_weihenstephan` and `price_alpro` are no longer in the
result, because they went into `price_too_expensive`. Check with
`count(milk_brand, is.na(price_too_expensive))` whether everyone who saw a
brand also named a price. Then create a column `age_group` with `mutate()`
as a factor with the levels `18-29`, `30-49`, `50-64` and `65+`, as in the
lesson [[dplyr-arrange-mutate]], and save the table as RDS again: when you
read it back in, the age groups stand in the right order and not
alphabetically.
