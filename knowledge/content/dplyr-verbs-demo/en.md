---
title: The verbs of dplyr to try out
summary: >-
  Six rows from a survey and one button per verb: you see how select, filter,
  arrange, mutate and summarize reshape a table.
objectives:
  intro: "This demo shows you on six rows of the survey how the verbs of `dplyr` reshape a table, and afterwards you can:"
  goals:
    - "say for `select()`, `filter()` and `arrange()` whether columns disappear, rows drop out or only the order changes"
    - "describe how `mutate()` computes a new column from the age while the number of rows stays the same"
    - "explain why `summarize()` turns six rows into one and why `group_by()` before it gives one row per diet"
    - "match each reshaping to the line of R with the pipe `|>` that runs it"
translation_of: de
based_on: 2026-11-01
---

**Goal:** See how the verbs of dplyr reshape a table: what disappears, what
moves and what is added.

**How to use:** Click a verb. The line of R that runs it appears above the
table, and the table turns into the result; “Original” shows the six people
from the survey on milk and milk alternatives again.

```verb-demo
```
