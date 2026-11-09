---
title: Tidy data
summary: >-
  Every variable a column, every observation a row, every value a cell: three
  rules that make tables easy to analyse, and how to recognise untidy data.
objectives:
  intro: "This lesson introduces the rules of tidy data, which make tables easy to analyse, and afterwards you can:"
  goals:
    - "state the three rules of tidy data and check whether a table follows them"
    - "decide for a given question what counts as an observation in a table"
    - "recognise values in column names and several values in one cell as breaches of the rules, and codes instead of meanings as a source of mistakes"
    - "describe how pivoting with `pivot_longer()` from `tidyr` brings a wide table into the long form"
    - "explain why it pays to tidy data before analysing it"
translation_of: de
based_on: 2026-11-09
---

![Slides: Tidy data with tidyr](item:tidy-data-slides)

The basic operations from [[data-transformation-basics]] work best when a
table has a particular shape. Hadley Wickham, who also wrote dplyr, calls
this shape **tidy data**. The idea is older than R and applies just as well
to SQL, pandas or a spreadsheet.

## Three rules

A table is tidy if

1. every **variable** has its own column,
2. every **observation** has its own row and
3. every **cell** holds exactly one value.

What an observation is depends on the question. In a survey it is usually a
respondent: everything we know about them is in their row, and every
question has its column. `survey` is built like this.

## How to recognise untidy data

Untidy tables are not wrong, since people often find them easier to read or
they arise quite naturally during data collection, but they make the
analysis more laborious. Three patterns come up again and again: the first
two break one of the rules, while the third breaks none and is still a
constant source of mistakes.

### Values hidden in column names

In the survey it was decided at random for which brand someone should give a
price. The survey tool created two columns for this, one per brand, and only
one of them is filled in each row:

| id | price_weihenstephan | price_alpro |
|---|---|---|
| 3 | | 1.51 |
| 13 | 2.00 | |
| 14 | 1.09 | |

Here the brand is not a column but hidden in the column name. Anyone who
wants to know whether the price depends on the brand first has to bring the
two columns together. In `survey` this has already been done, with one
column for the brand and one for the price:

| id | milk_brand | price_too_expensive |
|---|---|---|
| 3 | alpro | 1.51 |
| 13 | Weihenstephan | 2.00 |
| 14 | Weihenstephan | 1.09 |

Now the brand is a variable like any other, by which you can filter and
group. Reshaping from the wide into the long form is called *pivoting*; in R
it is done by `pivot_longer()` from the package tidyr.

### Several values in one cell

If a cell says `"vegetarian, organic, regional"`, you can no longer simply
count how many people shop regionally. A tidy version would have one column
per characteristic with yes or no, or a separate table with one row per
person and characteristic.

### Codes instead of meanings

In the raw version of the survey, gender is `1` or `2` and the size of the
town a number from 1 to 6. What the numbers mean is only revealed by the
codebook. This breaks none of the three rules, but it is a constant source of
mistakes: R will happily compute the mean of gender. That is why `survey` has
words for gender and town size where the raw data had codes, while scales such
as the organic share from 1 to 5 stay numbers because their order means
something.

## Tidy first, analyse second

In practice the process therefore almost always looks the same: load the
data, bring them into a tidy shape, then analyse them with the basic
operations. The second step often takes more time than the third, and it is
worth it, because afterwards every further question takes only a few lines.

## Key points

- A table is tidy when every variable has a column, every observation a row
  and every value a cell.
- Typical deviations are values in column names and several values in one
  cell; codes without meaning break no rule but make the analysis prone to
  mistakes.
- If you tidy first, you can then answer every question with the same few
  verbs.
