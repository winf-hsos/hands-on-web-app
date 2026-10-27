---
title: "Exercise: The weekly shop"
summary: >-
  A receipt as vectors: you work out the total, count expensive items and
  deal with a price that is missing from the receipt.
translation_of: de
based_on: 2026-10-27
---

## Task

A receipt lists six items. For each you know the price per piece and the
amount, only the price of the cheese is illegible:

| Item | Price per piece | Amount |
|---|---|---|
| Milk | 1.09 | 3 |
| Oat drink | 1.79 | 2 |
| Bread | 2.49 | 1 |
| Cheese | illegible | 1 |
| Apples | 0.45 | 6 |
| Chocolate | 1.29 | 2 |

Answer three questions with R, each in a box of its own:

1. What does the shopping cost without the cheese?
2. How many items cost more than 1.50 euros per piece?
3. What share of the known total do milk and oat drink make up together?

## Your code

```r
items <- c("milk", "oat drink", "bread", "cheese", "apples", "chocolate")
prices <- c(1.09, 1.79, 2.49, NA, 0.45, 1.29)
amounts <- c(3, 2, 1, 1, 6, 2)

# 1. total without the cheese
```

```r
items <- c("milk", "oat drink", "bread", "cheese", "apples", "chocolate")
prices <- c(1.09, 1.79, 2.49, NA, 0.45, 1.29)
amounts <- c(3, 2, 1, 1, 6, 2)

# 2. items above 1.50 euros
```

```r
items <- c("milk", "oat drink", "bread", "cheese", "apples", "chocolate")
prices <- c(1.09, 1.79, 2.49, NA, 0.45, 1.29)
amounts <- c(3, 2, 1, 1, 6, 2)

# 3. share of milk and oat drink
```

> [!HINT]
> `prices * amounts` gives the amount per line of the receipt. For the cheese
> it says `NA`, which is why `sum()` needs a particular argument. To check:
> the known amount is 14.62 euros.

> [!HINT]
> For the second question you count a comparison with `sum()`. The missing
> price of the cheese is in the way here too. For the third you select the
> two drinks with `%in%` and divide their amount by the known total.

> [!SOLUTION]
> ```r
> items <- c("milk", "oat drink", "bread", "cheese", "apples", "chocolate")
> prices <- c(1.09, 1.79, 2.49, NA, 0.45, 1.29)
> amounts <- c(3, 2, 1, 1, 6, 2)
>
> sum(prices * amounts, na.rm = TRUE)
> ```
>
> ```r
> prices <- c(1.09, 1.79, 2.49, NA, 0.45, 1.29)
>
> sum(prices > 1.50, na.rm = TRUE)
> ```
>
> ```r
> items <- c("milk", "oat drink", "bread", "cheese", "apples", "chocolate")
> prices <- c(1.09, 1.79, 2.49, NA, 0.45, 1.29)
> amounts <- c(3, 2, 1, 1, 6, 2)
>
> totals <- prices * amounts
> drinks <- items %in% c("milk", "oat drink")
> sum(totals[drinks]) / sum(totals, na.rm = TRUE)
> ```
>
> Without the cheese the shopping costs 14.62 euros. Two items cost more
> than 1.50 euros, the oat drink and the bread; whether the cheese belongs to
> them, nobody knows. Milk and oat drink make up just under 47 percent of the
> known amount. In the last line only the denominator needs `na.rm`, because
> no price is missing among the two drinks.

## For the quick ones

The cheese cost 3.99 euros. Fill in the price: which of your answers change,
and which lines of your code do you have to touch for that?
