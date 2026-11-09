---
title: Exploratory data analysis
summary: >-
  Where exploring sits in a data analysis, which six kinds of questions you
  can ask of data, and why a pattern you notice while exploring is a question
  for the next study and not yet an answer.
objectives:
  intro: "In this lesson you learn what exploratory data analysis achieves and where it ends, and afterwards you can:"
  goals:
    - "place exploring in the workflow of a data analysis and describe it as a loop of transforming, visualising and modelling"
    - "tell descriptive, exploratory, inferential, predictive, causal and mechanistic questions apart and use the six yes-or-no questions by Leek and Peng to determine which type a question is"
    - "match each type to a suitable question about the survey on milk and chocolate and explain what you may claim in the end, depending on the type"
    - "spot when an exploratory finding is silently reported as an inferential or causal result"
    - "find missing and unusual values while exploring and explain why the median copes with them better than the mean"
translation_of: de
based_on: 2026-11-09
---

![Slides: Exploratory data analysis](item:exploratory-data-analysis-slides)

When you get a new data set, you do not know yet what is in it. Exploratory
data analysis is the first look inside: you see which values occur, which
columns go together and what does not fit, and every chart raises the next
question. What comes out is a better knowledge of the data and a list of good
questions, but not yet the answers. How far an answer may reach depends on
the kind of question, and Jeffery Leek and Roger Peng proposed a simple order
for this, which you can read in their two-page article:

![The paper of the lesson](item:leek-peng-what-is-the-question)

## Where exploring sits

According to *R for Data Science*, every data analysis begins by loading the
data and bringing it into a tidy shape, and it ends by communicating what you
have understood. Exploring lies in between, and it is not a single step but a
loop: you transform the data, visualise it, perhaps fit a simple model, and
every result sends you back to the start with a new idea. Programming holds
it all together so that every step can be repeated.

Two questions help at the start of almost any exploration. What
**variation** occurs within one variable, that is, which values occur, which
are common and which are rare? And what **covariation** occurs between
variables, that is, do two columns change together? For the first the tool is
the histogram, for the second, depending on the kind of columns, the scatter
plot, the boxplot or a bar chart of shares.

## Six yes-or-no questions

Before drawing conclusions, you should know what kind of question you are
asking. It determines which method fits, which data you need and, above all,
what you may claim in the end. Leek and Peng distinguish six types, and you
find the right one by starting at the top and carrying on until an answer
leads to a type:

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
| inferential | test whether a pattern is more than chance | Is this a real pattern or due to chance? |
| predictive | predict for individuals, often with machine learning | Can age, diet and place of shopping predict whether someone buys oat drink? |
| causal | find out what changes on average when you change one quantity, most reliably with an experiment | Does the intention to buy alpro drop when its price rises by ten cents? |
| mechanistic | understand exactly how a cause works in every single case | How much energy does a litre of milk need to warm from 4 to 60 degrees? |

Inferential does not mean that you would need other data. A significance test
on exactly these data checks whether a difference of this size could also
have come about by chance in a sample of this size. If that is unlikely, it
is called significant: it is systematic and not chance. Whether it also holds
for all of Germany is a question of its own, because it depends on how well
the sample represents the country.

The causal question can actually be answered with this survey, because the
price of alpro was an experiment in it. The shelf showed Weihenstephan at
1.79 euros and Gut & Günstig at 1.09 euros, and alpro cost 1.69, 1.79, 1.89
or 2.09 euros, as chance decided. For each of the three milks the respondents
said how surely they would buy it, from −4 for "certainly not" to +4 for
"certainly". Because chance decided who saw which price, the groups differ
only in the price, and a difference in the intention to buy goes back to it.
The mechanistic question, in contrast, is answered by physics, not by any
survey; such questions are rare in data analysis.

## Exploratory is a beginning, not a result

Almost everything you do on a first look into a data set is exploratory:
looking at distributions, comparing groups, searching for associations. That
is exactly right, as long as you call the result what it is. A pattern you
notice while exploring is a good question for the next study, but not yet an
answer.

The most common mistake is to skip a step. Search long enough in a survey
with 606 columns and you will always find some association, even if it only
exists by chance in these 2,811 people: shuffle every column on its own, so
that no column has anything to do with any other, and about 7,000 pairs of
columns still pass a test at the five percent level. Report such an
association as if it were systematic, and an exploratory question has
silently become an inferential one; read it as a cause, and it has even
become a causal one.

It follows that the questions belong before the data collection. If you write
down beforehand what you want to know and what theory leads you to expect,
you test a hypothesis exactly once; if you search the data afterwards, you
give chance thousands of opportunities. Exploring stays valuable, but what it
finds is a question for the next data collection.

## What exploring the survey shows

The slides explore the survey on milk and chocolate, and three findings carry
over to almost any data set:

- **Missing usually means "not asked".** Almost half of all cells are empty,
  because many questions went only to some of the respondents. Remove every
  row with a gap, and nobody is left; remove them for one question, and you
  are talking about a different group than you think.
- **One strange value can hide a whole distribution.** Asked from which price
  on a litre of milk is too expensive, 16 people answered more than 20 euros,
  up to 999. A histogram of all answers then shows a single bar, and only a
  look at the extreme values shows what is going on.
- **The median copes with outliers, the mean does not.** With all answers the
  mean is 8.11 euros, without the 16 extreme values 2.17 euros, while the
  median is 1.99 euros in both cases. Setting implausible values to `NA`
  instead of removing the whole row keeps everything else the person said;
  which threshold you choose for it belongs in the report.

## Key points

- Exploring is a loop of transforming, visualising and modelling that begins
  with two questions: how does one variable vary, and how do two vary
  together?
- Six types of questions: descriptive, exploratory, inferential, predictive,
  causal and mechanistic. What matters most is whether a pattern is meant to
  be more than chance and whether you are asking for a cause.
- Inferential means testing on these data whether a pattern is more than
  chance; causal most reliably needs an experiment.
- Questions and expectations from theory belong before the data collection;
  an exploratory finding is the beginning of a study, not its result.
