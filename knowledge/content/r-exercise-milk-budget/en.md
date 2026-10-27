---
title: "Exercise: What does the milk cost per year?"
summary: >-
  A household drinks milk every week: with names and functions you work out
  what that costs per year and how much switching brands saves.
translation_of: de
based_on: 2026-10-27
---

## Task

A household buys three litres of a branded milk every week, at 1.79 euros
per litre. Answer three questions with R and give every intermediate result
a name instead of writing everything into one long calculation:

1. What does the milk cost in a year of 52 weeks?
2. How much does the household save per year if it switches to a store brand
   at 1.09 euros per litre? Round to whole euros.
3. For how many full weeks could it buy the store brand from these savings,
   and how many euros would be left over?

## Your code

```r
litres_per_week <- 3
price_brand <- 1.79

# 1. cost per year
```

> [!HINT]
> First store the cost per year for both brands under a name each. The
> saving is their difference, and `round()` rounds it.

> [!HINT]
> One week of the store brand costs `litres_per_week * price_store`. How
> often that fits into the saving is what `%/%` tells you, what is left over
> is what `%%` tells you. To check: it is 33 full weeks.

> [!SOLUTION]
> ```r
> litres_per_week <- 3
> price_brand <- 1.79
> price_store <- 1.09
>
> cost_brand <- litres_per_week * price_brand * 52
> cost_store <- litres_per_week * price_store * 52
> saving <- round(cost_brand - cost_store)
> week_store <- litres_per_week * price_store
>
> saving %/% week_store
> ```
>
> The branded milk costs 279.24 euros per year, the store brand 170.04
> euros, so the saving is 109 euros when rounded. That buys 33 full weeks of
> the store brand; `saving %% week_store` shows that 1.09 euros are left over.

## For the quick ones

How does the saving change if the household drinks only two litres per
week? If you chose good names, you only have to change a single number.
