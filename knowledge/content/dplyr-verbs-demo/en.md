---
title: The verbs of dplyr to try out
summary: >-
  Six rows from a survey and one button per verb: you see how select, filter,
  arrange, mutate and summarize reshape a table.
translation_of: de
based_on: 2026-10-27
---

The table below holds six people from the survey on milk and milk
alternatives with four of their characteristics: number, age, diet and the
share of organic food in their shopping. Click a verb: the line of R that
runs it appears above, and the table turns into the result. Watch what
disappears, what moves and what is added each time.

```verb-demo
```

## What you should see

- `select()` keeps all rows, but only the named **columns**.
- `filter()` keeps all columns, but only the **rows** for which the condition
  holds.
- `arrange()` changes nothing but the **order** of the rows.
- `mutate()` adds a **new column** computed from existing ones, here the
  decade of the age.
- `summarize()` turns all rows into **a single one** that summarises the
  table.
- `group_by()` together with `summarize()` summarises **per group** and
  returns one row per diet.

How to write these verbs yourself is shown in the lessons starting with
[[r-in-ten-minutes]].
