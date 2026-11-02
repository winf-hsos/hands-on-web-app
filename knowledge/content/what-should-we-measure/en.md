---
title: What should we measure?
summary: >-
  An empty table for the rounds played: add variables as columns, give them a
  data type, enter each game as a row, and save everything as a CSV or RDS
  file for R.
objectives:
  intro: "With this demo you decide yourself how the rounds of the game with three doors are recorded, and afterwards you can:"
  goals:
    - "explain that a row is an observation and a column is a variable"
    - "decide for a question which variables have to be recorded, and give them names that R understands directly"
    - "assign each variable a fitting data type: character, double, integer, logical or factor"
    - "save a table as a CSV and as an RDS file and describe why only RDS keeps the data types"
translation_of: de
based_on: 2026-11-02
---

**Goal:** Design the table that records the rounds played of the game with
three doors, and decide along the way which facts about a game are noted and in
which form their values come.

**How to use:** The table starts with three empty columns and two empty rows.
Each column is a variable, which you name at the top and, if you like, give a
data type below. When you move the mouse over the table, a + appears on the
right for another column and one below for another game. Every cell can be
edited, and Enter jumps to the row
below. A value that does not fit the chosen type gets a yellow outline but
stays in place. Finally you save the table as CSV or as RDS, and below the
buttons stands the R code that reads the file back. The table stays stored in
this browser until you choose "Start over".

Each **row** is an observation, here one game played. Each **column** is a
variable, a fact we record for every game, such as the door with the car or
the decision between staying and switching. All values in a column share one
data type, and the label in the head of the column shows it the way R shows it
for a tibble: `<chr>` for text, `<dbl>` for decimal numbers, `<int>` for whole
numbers, `<lgl>` for `TRUE` and `FALSE`, and `<fct>` for categories with fixed
levels. Without a chosen type, the label shows in grey which type R would infer
from the values entered.

```data-table
```
