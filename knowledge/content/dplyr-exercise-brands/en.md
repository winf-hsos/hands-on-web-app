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
    - "check whether the two groups of an experiment differ in diet as well as in brand, and explain why chance only makes them comparable with many answers"
translation_of: de
based_on: 2026-11-09
---

## Task

The survey contains an experiment. Some of the respondents were shown a
brand of milk, and chance decided whether it was Weihenstephan or alpro;
which brand someone saw is in `milk_brand`. They were then asked from which
price a litre of this milk would be too expensive for them, and that answer
is in `price_too_expensive`. Because the brand was assigned at random, the
two groups should differ only in the brand they saw. So will people pay more
for alpro than for Weihenstephan?

Follow the question in five steps, each with a pipe of its own in a box
of its own.

## Your code

1. Count how many people answered the price question for each of the two
   brands.

```r
survey |>
  filter() |>
  count()
```

2. Compute, per brand, the number of answers, the mean price and the
   median, without the answers that cannot be meant seriously as a price
   per litre.

```r
survey |>
  filter() |>
  group_by() |>
  summarize()
```

3. For the plausible answers, create a column `price_class` with
   `mutate()` that puts each price into one of three classes: `"under 2"`
   for less than 2 euros, `"2 to 2.49"` and `"2.50 or more"`. Show `id`,
   `milk_brand`, `price_too_expensive` and `price_class`, sorted from the
   highest price to the lowest.

```r
survey |>
  filter() |>
  mutate() |>
  select() |>
  arrange()
```

4. Count how often each price class occurs for each brand.

```r
survey |>
  filter() |>
  mutate() |>
  count()
```

5. Compute, for each diet, the number of plausible answers and the mean
   price, and sort the groups so that the highest mean comes first.

```r
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
> are 611 answers, 293 for alpro and 318 for Weihenstephan.

> [!HINT]
> A limit of 10 euros separates the serious prices per litre from the 20
> outliers. Because `filter()` with this comparison also drops all rows
> without a price, you need no `na.rm = TRUE` afterwards. To check: 284
> answers remain for alpro and 307 for Weihenstephan.

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
> Without the outliers, the limit for alpro is 2.19 euros on average and 2
> euros in the median, for Weihenstephan 1.99 and 1.99 euros. Those who saw
> alpro would therefore pay around 20 cents more on average. The price
> classes show that this does not depend on a few people: for Weihenstephan,
> 182 of the 307 answers lie below 2 euros, for alpro only 129 of 284, and in
> the top class alpro leads with 86 answers against 57. The whole
> distribution is shifted upwards.
>
> The fifth task shows whether diet could be behind it. Vegans and
> vegetarians give higher prices on average, 2.60 and 2.40 euros, than
> omnivores and flexitarians with around 2.05 euros each. If you count with
> `count(milk_brand, diet)`, you see that chance has spread the large groups
> almost evenly, 177 to 187 omnivores and 84 to 83 flexitarians. Only among
> the vegans did Weihenstephan get more, 14 to 3, which tends to raise
> Weihenstephan's mean and so does not explain the difference to alpro. With
> around 300 answers per brand, chance largely evens out such differences;
> whether the difference of 20 cents is more than chance only a test can
> tell. With the outliers, by the way, the mean for alpro would be 9.07 euros
> and for Weihenstephan 7.25 euros, while the median would stay at 2 and 1.99
> euros.

## For the quick ones

Which share of the plausible answers lies below 2 euros for each brand?
Create a column with `mutate()` that holds `TRUE` or `FALSE`, and compute
its mean per brand: the mean of `TRUE` and `FALSE` is the share of `TRUE`,
as you know from the lesson [[r-vectors]].

Does the result hold if you draw the limit differently? A litre for 0 euros
is hardly meant seriously either, and two people gave exactly that. Repeat
the second task only with prices above 50 cents and at most 5 euros, and
compare mean and median with your first result.
