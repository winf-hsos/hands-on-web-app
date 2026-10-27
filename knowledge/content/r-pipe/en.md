---
title: The pipe
summary: >-
  The symbol |> passes a result on to the next function and turns nested
  brackets into a chain you read from top to bottom.
translation_of: de
based_on: 2026-10-27
---

## What this is about

An analysis consists of several steps: selecting rows, selecting columns,
sorting, summarising. If you nest the functions for them inside each other,
you have to read the code from the inside out, and the arguments end up far
away from their function. The **pipe** solves this.

## And then

The symbol `|>` passes the result on its left as the first argument to the
function on its right. It is best read as "and then":

```r
survey |> nrow()
```

This means the same as `nrow(survey)`: take `survey` and then count the
rows. You attach a dplyr verb in the same way:

```r
survey |> filter(diet == "vegan")
```

This reads: take `survey` and then keep the rows in which `diet` equals
`"vegan"`. The lesson [[dplyr-filter]] shows exactly what `filter()` does.

## Chains

The pipe shows its strength with several steps. It is customary to start a
new line after every `|>`, so that each step has a line of its own:

```r
survey |>
  filter(diet == "vegan") |>
  nrow()
```

Without the pipe this would be `nrow(filter(survey, diet == "vegan"))`. With
two steps that still works; with five it becomes a tangle of brackets that
nobody enjoys reading.

> [!TIP]
> You can type the pipe faster with **Ctrl+Shift+M** (**Cmd+Shift+M** on a
> Mac). The shortcut works in every R box on this platform just as it does in
> [[positron|Positron]].

> [!NOTE]
> Older examples often use `%>%` instead of `|>`. That is the pipe from the
> package magrittr, which existed before R got its own in 2021. For
> everything you learn here, the two behave the same.

## Key points

- `|>` reads "and then"; it passes the result on its left to the function on
  its right.
- A new line after every `|>`, so that each step stands on its own.
- `%>%` from older examples does the same for a start.
