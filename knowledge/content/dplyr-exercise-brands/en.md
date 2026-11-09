---
title: "Exercise: Will people pay more for alpro?"
summary: >-
  In the survey's price experiment, some respondents saw Weihenstephan and
  others alpro. With `count()`, `group_by()`, `summarize()`, `mutate()` and
  `arrange()` you compare from which price a litre is too expensive for the
  two groups.
objectives:
  intro: "In this exercise you compare the two groups of the price experiment with the verbs of dplyr, and afterwards you can:"
  goals:
    - "count with `count()` how many answers each group of an experiment has"
    - "exclude an implausible value with `filter()` and then compute the mean and median per group with `group_by()` and `summarize()`"
    - "turn a price into a price class with `mutate()` and `case_when()` and sort the result with `arrange()`"
    - "split an analysis by a second column such as diet"
    - "explain why a difference between two groups of four answers each says nothing yet about the brands"
translation_of: de
based_on: 2026-11-09
---

## Task

The survey contains a small experiment. Some of the respondents were shown a
brand of milk, and chance decided whether it was Weihenstephan or alpro;
which brand someone saw is in `milk_brand`. They were then asked from which
price a litre of this milk would be too expensive for them, and that answer
is in `price_too_expensive`. Because the brand was assigned at random, the
two groups should differ only in the brand they saw. So will people pay more
for alpro than for Weihenstephan?

Follow the question in five steps, each with a pipe of its own:

1. Count how many people answered the price question for each of the two
   brands.
2. Compute, per brand, the number of answers, the mean price and the
   median, without the one answer that cannot be meant seriously as a price
   per litre.
3. For the plausible answers, create a column `price_class` with
   `mutate()` that puts each price into one of three classes: `"under 2"`
   for less than 2 euros, `"2 to 2.49"` and `"2.50 or more"`. Show `id`,
   `milk_brand`, `price_too_expensive` and `price_class`, sorted from the
   highest price to the lowest.
4. Count how often each price class occurs for each brand.
5. Compute, for each diet, the number of plausible answers and the mean
   price, and sort the groups so that the highest mean comes first.

## Your code

Each task has its own box. In the first one you count the answers per
brand:

```r
# 1. Answers per brand
survey |>
  filter() |>
  count()
```

In the second one you compute the three figures per brand:

```r
# 2. Number, mean and median per brand
survey |>
  filter() |>
  group_by() |>
  summarize()
```

In the third one you create the price class and sort:

```r
# 3. Price class per answer
survey |>
  filter() |>
  mutate() |>
  select() |>
  arrange()
```

In the fourth one you count brand and price class together:

```r
# 4. Price classes per brand
survey |>
  filter() |>
  mutate() |>
  count()
```

In the fifth one you split by diet:

```r
# 5. Mean price per diet
survey |>
  filter() |>
  group_by() |>
  summarize() |>
  arrange()
```

> [!HINT]
> You can tell who answered the price question by a value in
> `price_too_expensive`, as in the exercise [[dplyr-exercise-price]].
> `count()` takes the column whose values it should count. To check: there
> are nine answers, five for alpro and four for Weihenstephan.

> [!HINT]
> A limit of 10 euros separates the serious prices per litre from the one
> outlier. Because `filter()` with this comparison also drops all rows
> without a price, you need no `na.rm = TRUE` afterwards. To check: each
> brand then has four answers.

> [!HINT]
> `case_when()` checks the cases from top to bottom, so the condition
> `price_too_expensive < 2.5` is enough for the middle class, and `.default`
> takes care of the top one. For the fourth task you copy `filter()` and
> `mutate()` from the third and count two columns with `count()`.

> [!SOLUTION]
> Task 1:
>
> ```r
> survey |>
>   filter(!is.na(price_too_expensive)) |>
>   count(milk_brand)
> ```
>
> Task 2:
>
> ```r
> survey |>
>   filter(price_too_expensive <= 10) |>
>   group_by(milk_brand) |>
>   summarize(
>     n = n(),
>     mean_price = mean(price_too_expensive),
>     median_price = median(price_too_expensive)
>   )
> ```
>
> Task 3:
>
> ```r
> survey |>
>   filter(price_too_expensive <= 10) |>
>   mutate(
>     price_class = case_when(
>       price_too_expensive < 2 ~ "under 2",
>       price_too_expensive < 2.5 ~ "2 to 2.49",
>       .default = "2.50 or more"
>     )
>   ) |>
>   select(id, milk_brand, price_too_expensive, price_class) |>
>   arrange(desc(price_too_expensive))
> ```
>
> Task 4:
>
> ```r
> survey |>
>   filter(price_too_expensive <= 10) |>
>   mutate(
>     price_class = case_when(
>       price_too_expensive < 2 ~ "under 2",
>       price_too_expensive < 2.5 ~ "2 to 2.49",
>       .default = "2.50 or more"
>     )
>   ) |>
>   count(milk_brand, price_class)
> ```
>
> Task 5:
>
> ```r
> survey |>
>   filter(price_too_expensive <= 10) |>
>   group_by(diet) |>
>   summarize(
>     n = n(),
>     mean_price = mean(price_too_expensive)
>   ) |>
>   arrange(desc(mean_price))
> ```
>
> Without the outlier, the limit for alpro is 2.12 euros on average and 2.09
> euros in the median, for Weihenstephan 1.90 and 2 euros. Those who saw
> alpro would therefore pay a good 20 cents more on average. In the price
> classes, however, alpro falls below 2 euros twice and Weihenstephan only
> once; the higher mean comes mainly from the 2.79 euros of a single person.
>
> The fifth task shows why this means little. The plausible answers come
> only from flexitarians and omnivores, and the flexitarians give 2.29 euros
> on average, the omnivores only 1.53 euros. Of the four answers for alpro,
> three come from flexitarians, of those for Weihenstephan only two, so part
> of the difference may come from diet rather than from the brand. Chance
> only evens out such differences between the groups with many respondents,
> and with four answers per brand a single extra person could reverse the
> result; with the outlier, alpro would even average 33.70 euros.

## For the quick ones

Which share of the plausible answers lies below 2 euros for each brand?
Create a column with `mutate()` that holds `TRUE` or `FALSE`, and compute
its mean per brand: the mean of `TRUE` and `FALSE` is the share of `TRUE`,
as you know from the lesson [[r-vectors]].

Whether alpro really may cost more can only be said with more answers. The
full data set [[milk-survey-compact]] contains the same experiment with more
than 600 answers. Download it from its page, read it into Positron and
repeat the second task. Look at the outliers first, because
there are twenty prices above 10 euros there, and a litre for 0 euros is
hardly meant seriously either.
