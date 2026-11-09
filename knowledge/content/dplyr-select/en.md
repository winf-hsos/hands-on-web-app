---
title: Selecting columns with select()
summary: >-
  With select() you keep only the columns a question needs: by name, range,
  pattern or type. Along the way you get to know rename() and relocate().
objectives:
  intro: "This lesson shows you how to keep only the columns a question needs with `select()`, and afterwards you can:"
  goals:
    - "name columns in `select()` and set their order in the result at the same time"
    - "select a range of columns with `:` and exclude columns with `-`"
    - "select columns by pattern with `starts_with()`, `ends_with()` and `contains()`, and by type with `where()`"
    - "rename columns with `rename()` or within `select()`"
    - "move certain columns to the front with `relocate()` without losing the others"
translation_of: de
based_on: 2026-11-09
---

Real data sets are wide. The survey that `survey` comes from has 606
columns, its compact version `survey` still 21, and a single question rarely needs more than a handful of them.
`select()` keeps the columns you name and drops all others; it does not touch
the rows.

## Naming columns

The first argument of `select()` is the table that the pipe delivers,
followed by the columns, separated by commas and without quotation marks:

```r
survey |>
  select(id, age, diet)
```

The order in which you name the columns is also the order in the result. So
you can make a table smaller and rearrange it at the same time:

```r
survey |>
  select(diet, age, id)
```

## Ranges and exclusions

A colon selects all columns from one to another, as they stand next to each
other in the table:

```r
survey |>
  select(id:state)
```

A minus sign excludes a column, and all others remain:

```r
survey |>
  select(-state, -town_size, -household_size)
```

Excluding is handy when you want to keep almost everything. With very wide
data sets it is usually clearer to name the columns you want explicitly,
because then the code shows what is being worked with.

## Columns by pattern

Well-named columns follow patterns, and dplyr comes with small helpers that
recognise such patterns:

| Helper | selects columns whose name … |
|---|---|
| `starts_with("milk")` | starts with `milk` |
| `ends_with("size")` | ends with `size` |
| `contains("price")` | contains `price` anywhere |
| `everything()` | all remaining columns |

This is how you get the identifier and every column that starts with `milk`:

```r
survey |>
  select(id, starts_with("milk"))
```

A helper can also stand on its own, and then only the columns that match the
pattern remain:

```r
survey |>
  select(ends_with("size"))
```

This is where a rule pays off that is often underestimated when preparing
data: if you name columns consistently, you can later select them in groups
instead of listing each one.

## Columns by type

`where()` selects columns by a property of their content. With `is.numeric`
you get all columns with numbers, with `is.character` all those with text:

```r
survey |>
  select(where(is.numeric))
```

Note that `id` is a number too. R does not know that it makes no sense to
calculate with this number; that is something you have to know yourself.

## Renaming

`rename()` gives a column a new name and leaves everything else as it is. The
new name goes on the left, the old one on the right, as in an assignment:

```r
survey |>
  rename(brand = milk_brand, too_expensive = price_too_expensive) |>
  names()
```

`names()` shows only the column names, so you can see the two new ones in
their place without the table leaving them out for lack of space.

The same works inside `select()`, but then only for the selected columns:

```r
survey |>
  select(id, brand = milk_brand, too_expensive = price_too_expensive)
```

## Moving columns to the front

Sometimes you want to keep all columns and just see certain ones first. That
is what `relocate()` does:

```r
survey |>
  relocate(diet, organic_share)
```

## Key points

- `select()` keeps only the named columns, in the named order; the rows stay
  unchanged.
- `a:b` selects a range, `-a` excludes a column.
- `starts_with()`, `ends_with()`, `contains()` and `where()` select columns by
  name or type and reward consistent naming.
- `rename(new = old)` renames, `relocate()` moves columns to the front.
