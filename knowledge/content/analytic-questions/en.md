---
title: What question are you asking of the data?
summary: >-
  Describing, exploring, generalising, predicting, finding causes or
  understanding mechanisms: six kinds of questions about data, and six
  yes-or-no questions that tell you which one you are asking.
translation_of: de
based_on: 2026-10-27
---

## What this is about

Before you calculate, you should know what kind of question you are asking.
It determines which method fits, which data you need and, above all, what you
may claim in the end. Jeffery Leek and Roger Peng proposed a simple order for
this ([[leek-peng-what-is-the-question]]): six types of questions, told apart
by a sequence of yes-or-no questions.

## Six yes-or-no questions

You start at the top and carry on until an answer leads to a type:

1. **Do you summarise the data?** If not, it is not yet a data analysis, for
   instance if you only show single rows.
2. **Do you report the summary without interpreting it?** Then the question
   is *descriptive*.
3. **Do you check whether your discoveries would also hold in a new
   sample?** If not, it is *exploratory*.
4. **Do you want to know how one quantity changes when you change the
   average of another?** If so, go on with question 6, otherwise with
   question 5.
5. **Do you want to predict values for individual people or things?** Then
   the question is *predictive*, otherwise *inferential*.
6. **Are you looking for an effect that occurs on average, or one that
   occurs in exactly this way in every single case?** On average the
   question is *causal*, in every single case *mechanistic*.

## The six types by example

The examples come from the [[milk-chocolate-survey|survey on milk and chocolate]].

| Type | What you do | Example |
|---|---|---|
| descriptive | count and summarise without interpreting | How many respondents drink milk every day? |
| exploratory | look for patterns that raise new questions | Do younger people buy oat drink more often than older ones? |
| inferential | check whether a pattern holds beyond the sample | Does that also hold for everyone who shops in Germany? |
| predictive | predict for individuals, often with machine learning | Can age, diet and place of shopping predict whether someone buys oat drink? |
| causal | find out what changes on average when you change one quantity, most reliably with an experiment | Do fewer people buy alpro when its price rises by ten cents? |
| mechanistic | understand exactly how a cause works in every single case | How much energy does a litre of milk need to warm from 4 to 60 degrees? |

The causal question can actually be answered with this survey, because the
price of alpro was an experiment in it: chance decided who got to see which
price. The mechanistic question, in contrast, is answered by physics, not by
any survey; such questions are rare in data analysis.

## Exploratory is a beginning, not a result

Almost everything you do on a first look into a data set is exploratory:
looking at distributions, comparing groups, searching for associations. That
is the core of exploratory data analysis and exactly right, as long as you
call the result what it is. A pattern you notice while exploring is a good
question for the next study, but not yet an answer.

The most common mistake is to skip a step. Search long enough in a survey
with 600 columns and you will always find some association, even if it only
exists by chance in these 2,811 people. Report it as if it held for everyone,
and an exploratory question has silently become an inferential one; read it
as a cause, and it has even become a causal one.

## Key points

- Six types of questions: descriptive, exploratory, inferential, predictive,
  causal and mechanistic.
- Six yes-or-no questions lead to the type; the decisive ones are whether you
  want to conclude beyond the sample and whether you are asking about a cause.
- The type of question determines what you may claim in the end. An
  exploratory finding is the beginning of a study, not its result.
