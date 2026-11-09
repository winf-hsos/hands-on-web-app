---
title: Data transformation with R and dplyr
summary: >-
  Turning raw data into the table that answers a question: first the idea,
  then the verbs of dplyr, with a real survey and right in the browser.
goal: >-
  You break a question about a data set down into basic operations and carry
  them out in R with the verbs of dplyr, from selecting through computing to
  summarising by group, even when values are missing or cannot be right.
audience: Everyone who wants to analyse data, without programming experience
translation_of: de
based_on: 2026-11-09
---

This path starts without code. The first two steps cover what it means to
transform data, which few basic operations are enough for it, and which shape
a table should have so that it is easy to analyse. That holds for every tool,
whether R, Python, SQL or Excel. The slides of the first lesson show all six
verbs and the pipe in one go, while the lessons after it go into the details
step by step.

After that you put the ideas into practice in R with the package dplyr: you
select columns and rows, sort rows, compute new columns and summarise groups
into figures, until you use them to answer a question about the price
experiment in the survey. Every code box is a small editor in which R runs
right in your browser, so there is nothing to install. All examples use a
small excerpt from a survey on milk and milk alternatives. If you do not know
R yet, start with the path [[getting-started-with-r]]; that is also where you
get to know the data set. Steps on joining tables will follow.
