---
title: Survey on milk and chocolate
summary: >-
  An online survey of 2,811 people on shopping, diet and attitudes, with two
  sub-studies on chocolate and milk: real data with filter questions,
  experiments and everything else that comes with analysing them.
objectives:
  intro: "With this data set you practise analysing a market research study on a real survey with filter questions and experiments, and with it you can:"
  goals:
    - "read the question block from the start of a column name and tell raw data, prepared columns and text versions ending in `f` apart"
    - "explain why a missing value here mostly means \"not asked\" and why removing `NA` changes the group you are looking at"
    - "interpret numeric codes such as those in `q004geschlecht` with the help of the columns ending in `f`"
    - "compare the randomly formed groups of an embedded experiment using the columns starting with `a`"
    - "judge whom the results of a quota-based online sample speak for and whom they do not"
translation_of: de
based_on: 2026-11-01
---

Prof. Dr. Ulrich Enneking (agricultural marketing, Osnabrück University of
Applied Sciences) surveyed people all over Germany online in November 2025,
all of whom do the food shopping for their household. A panel provider
recruited them, with quotas for age, gender and federal state. The study was
made for teaching: it contains almost every kind of question that occurs in
market research, and a few experiments on top. He agreed to its use on this
platform.

Each row is a respondent, each column an answer or a value derived from one.
The small data set `survey` from the lesson [[r-data-frames]] is an excerpt of it.

## What is in it

| Part | Who was asked | What it is about |
|---|---|---|
| Main study | all 2,811 | shopping and where people shop, diet, attitudes to organic food, regionality, the environment and new foods, prices for milk, labels, household and person |
| Chocolate | 275 | occasions and criteria for buying, brand awareness, ratings of single brands, vegan chocolate and chocolate with milk |
| Milk | about 230 | occasions and criteria, cow's milk and oat drink, packaging, manufacturer brand and retailer brand |

The two sub-studies were answered by different people. Whoever got chocolate
has a missing value for every question on milk, and vice versa.

## How the columns are named

The first letter of a column name says which block the question belongs to;
the number of the question in the questionnaire and a German keyword follow.

| Start | Block |
|---|---|
| `q` | selecting respondents and quotas, such as age and federal state |
| `v` | behaviour, such as what someone buys and how often |
| `p` | psychological scales, such as attitudes to organic food |
| `b`, `u`, `w` | ratings, overall judgements, knowledge questions |
| `d` | details about the person and the household |
| `a` | which variant of an experiment someone saw |
| `s`, `m` | the sub-studies on chocolate (*Schokolade*) and milk |

Lower case stands for raw data as it came from the questionnaire, upper case
for prepared columns. An `f` at the end means that the column holds words
instead of codes. Age shows the whole chain: `q002geburt` is the year of
birth, `Q002alter` the age in years, `Q002altergru4` the age group as a
number and `Q002altergru4f` the same group as text, such as `45-59 Jahre`.
Values and labels are in German.

## What to know before you calculate

- **Missing mostly means "not asked".** About half of all cells are empty,
  because many questions were put to only some of the respondents: after a
  filter question, in a sub-study or in one variant of an experiment. If you
  simply remove missing values, you change who you are talking about.
- **Numbers are often codes.** `q004geschlecht` or `d044stadt` hold numbers
  whose meaning the questionnaire defines. Where there is a column with `f`
  at the end, such as `D044stadtf`, the meaning is already there.
- **Experiments sit in the middle of the survey.** The columns starting with
  `a` say which variant someone was randomly given, such as which brand of
  milk to rate or which price to see. These groups can be compared because
  chance formed them.
- **The sample is quota-based, not random.** It mirrors Germany by age, gender
  and federal state, but only people who take part in an online panel and do
  their own shopping.

## What is not in it

The postcode and all open answers, in which people wrote freely, have been
removed, 13 columns in all. For about half of the respondents, their postcode
occurred only once in the whole data set, and in free text someone may reveal
more about themselves than they meant to. Everything else is in the file just
as it came from the survey.
