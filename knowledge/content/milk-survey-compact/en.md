---
title: Milk survey, compact
summary: >-
  All 2,809 respondents of the milk survey, but only 21 selected questions
  with English column names and words instead of codes: the way into a real
  survey with filter questions, experiments and outliers.
translation_of: de
based_on: 2026-11-09
---

This data set is an excerpt from the [[milk-chocolate-survey]] by Prof. Dr.
Ulrich Enneking. All respondents are in it, but instead of 606 columns only a
selection of questions, with English column names and words instead of
numeric codes. Each row is one respondent.

In the code boxes of the site, this data set is available under the name
`survey`, for instance in the lesson [[r-data-frames]] and the lessons on
dplyr. If you read it into Positron under the same name, the code from there
runs for you as well.

## The columns

| Column | Meaning | missing |
|---|---|---|
| `id` | running number | 0 |
| `age` | age in years, 18 to 80 | 0 |
| `gender` | `female` or `male` | 0 |
| `state` | federal state | 0 |
| `town_size` | size of the place of residence: `city`, `large town`, `town`, `small town`, `very small town`, `village` | 7 |
| `household_size` | people in the household; 5 means "5 or more" | 14 |
| `diet` | diet: `omnivore`, `flexitarian`, `vegetarian`, `vegan`, `pescetarian` | 28 |
| `organic_share` | share of organic food in shopping, from 1 (almost never) to 5 (almost only organic) | 18 |
| `milk_freq` | how often milk is drunk in the household: `daily`, `weekly`, `monthly`, `rarely` | 424 |
| `milk_brand` | price experiment: which brand was shown, `Weihenstephan` or `alpro` | 2,190 |
| `price_too_expensive` | the price in euros from which this brand would be too expensive | 2,198 |
| `shops_discounter` | usually shops at a discounter, `TRUE` or `FALSE` | 0 |
| `shops_organic` | usually shops at an organic store, `TRUE` or `FALSE` | 0 |
| `eco_conscious` | "I would describe myself as environmentally conscious." From −2 (does not apply at all) to +2 (applies completely) | 6 |
| `prefers_organic` | "When shopping for food I prefer organic products." −2 to +2 | 11 |
| `loves_meat` | "I love meals with meat." −2 to +2 | 5 |
| `loves_cooking` | "I love cooking or baking." −2 to +2 | 11 |
| `rated_brand` | brand experiment: which of seven milk brands was shown at random for rating | 478 |
| `brand_quality` | rating of this brand, from low (−2) to high (+2) quality | 500 |
| `brand_buy` | rating of this brand, from "would not buy" (−2) to "would buy" (+2) | 587 |
| `tiktok` | how often TikTok is used, from `daily` to `never` | 1,442 |

## What to know before you calculate

- **Missing mostly means "not asked".** The survey only asked about milk those
  who had consumed milk in the last twelve months; only some of the
  respondents got the price experiment, and about half the question on media.
  The many `NA` in these columns come from the design of the survey, not from
  carelessness.
- **Two experiments are built in.** Which brand someone saw in `milk_brand`
  and in `rated_brand` was decided by chance. Differences between these groups
  are therefore due to the brand and not to the people who rated it.
- **Not every value is plausible.** `price_too_expensive` holds prices that
  can hardly be meant for a litre of milk.
- **The sample is quota-based, not random.** It reflects Germany by age,
  gender and federal state, but only people who take part in an online panel
  and do their own shopping.

## What is not in it

Income, education and employment status are left out, as are the two people
who gave "diverse" as their gender: they are too few for an analysis and
would be easy to recognise.

## How it is made

You build the excerpt yourself in the [[dplyr-exercise-compact-survey|exercise
on the compact data set]], from the raw version of the survey: load, filter,
select and rename columns, translate codes into words, and save. That is why
it comes in two formats. The CSV file is plain text that every program can
read; when R reads it, `gender`, `diet` and the other translated columns are
text again, and `count(diet)` sorts the diets alphabetically. The RDS file
keeps the table as the exercise built it, with factors and the order of their
levels, but only R can read it.
