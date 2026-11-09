---
title: "Exercise: A new data set"
summary: >-
  Fourteen questions about some 9,400 products from the REWE online shop: load
  the data set, get to know it and find the answers with one, two, three or
  more verbs of dplyr, just as an exam asks you to.
objectives:
  intro: "In this exercise you apply all the verbs of dplyr to a data set you do not know yet, and afterwards you can:"
  goals:
    - "load a data set with `read_csv()` and get an overview of its columns, types and values with `glimpse()`"
    - "answer a question with a single verb such as `count()` or `summarize()`"
    - "break a question down into two, three or more steps and combine them into a pipe with `filter()`, `select()`, `arrange()`, `mutate()`, `group_by()` and `summarize()`"
    - "detect duplicates with `distinct()` and `n_distinct()` and make sure that every product counts only once"
    - "check a result for plausibility and explain where conspicuous values come from"
translation_of: de
based_on: 2026-11-09
---

So far you knew the survey before you transformed it. In this exercise you
get a data set you have never seen, and you first have to load it and get
to know it before you can ask it questions. This is exactly what an exam
asks of you as well: a new data set, a few questions, and you decide which
verbs you need.

The data set contains some 9,400 products from the
[[rewe-products|REWE online shop]] with name, brand, category, origin, price,
organic label and nutritional values per 100 g. The questions are ordered by
how many verbs their solution needs, from one to four and more. Try each one
on your own first; you can expand the solution if you get stuck or want to
compare.

## Part 1: Load and get to know

1. Load the data set on your computer in Positron into a table called
   `rewe`. The file is at
   `https://hands-on-computer-science.de/media/datasets/rewe_products.csv`.

> [!SOLUTION]
> ```r static
> library(tidyverse)
> rewe <- read_csv("https://hands-on-computer-science.de/media/datasets/rewe_products.csv")
> ```
>
> `read_csv()` also reads a CSV file directly from the web. Empty fields
> become `NA`, and it recognises the columns `bio`, `vegan` and `vegetarian`
> as logical values. In the boxes on this page the table `rewe` is already
> there, and dplyr is loaded.

2. How many rows and columns does `rewe` have? Which columns contain text,
   which numbers and which logical values?

```r
rewe
```

> [!SOLUTION]
> ```r
> glimpse(rewe)
> ```
>
> The table has 9,438 rows and 22 columns. Name, brand, categories and
> origin are text (`<chr>`), price and nutritional values are decimal
> numbers (`<dbl>`), and `bio`, `vegan` and `vegetarian` are logical values
> (`<lgl>`). Even the first rows show that some products lack nutritional
> values.

## Part 2: One verb

3. Which product categories are there, and how many rows belong to each?
   The largest category should be on top.

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   count(product_category, sort = TRUE)
> ```
>
> There are twelve categories plus 8 rows without a category. The largest
> are `Nahrungsmittel` (food) with 2,480 and `Frische und Kühlung` (fresh
> and chilled) with 2,096 rows, the smallest is `Tier` (pets) with 231.

4. How many rows are labelled as organic?

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   count(bio)
> ```
>
> 770 of the 9,438 rows carry the organic label, a little over 8 percent.

5. How many different products and how many different brands does the table
   contain? Every product has its own `product_id`.

```r
rewe
```

> [!HINT]
> A single `summarize()` with two calls of `n_distinct()` answers both.
> Remember that `n_distinct()` counts an `NA` as a value of its own.

> [!SOLUTION]
> ```r
> rewe |>
>   summarize(
>     n = n(),
>     n_products = n_distinct(product_id),
>     n_brands = n_distinct(brand, na.rm = TRUE)
>   )
> ```
>
> The 9,438 rows are only 7,959 different products; almost 1,500 rows are
> duplicates that appear in the table exactly like this once before. There
> are 1,208 brands, and without `na.rm = TRUE` it would be 1,209, because the
> `NA` of the products without a brand counts as well. The duplicates will
> matter again in parts 4 and 5.

## Part 3: Two verbs

6. Which products of the brand `ja!` belong to the category `Obst und
   Gemüse` (fruit and vegetables)? Show only name and price.

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   filter(brand == "ja!", product_category == "Obst und Gemüse") |>
>   select(product_name, price)
> ```
>
> There are seven rows, and all of them are dried fruit and nuts such as
> pine nuts, sultanas and soft dates, but no fresh fruit. The cranberries
> appear twice, one of the duplicates from task 5.

7. Which brands are there in the sub-category `Milch und Milchersatz` (milk
   and milk substitutes), and which one has the most rows there?

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   filter(product_sub_category == "Milch und Milchersatz") |>
>   count(brand, sort = TRUE)
> ```
>
> There are 21 brands. Alpro leads with 22 rows ahead of Weihenstephan with
> 9, exactly the two brands from the survey's price experiment. If you only
> want to know which brands there are, `distinct(brand)` instead of
> `count()` is enough.

8. Which products contain the most protein per 100 g? Show name, category
   and protein content, the highest value on top.

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   arrange(desc(protein_in_gram)) |>
>   select(product_name, product_category, protein_in_gram)
> ```
>
> Low-carb pasta leads with 65.1 g, twice because it appears twice in the
> table, followed by soy granules with 52 g and soy fettuccine with 44.9 g.
> The order of `arrange()` and `select()` does not matter here; `select()`
> just must not remove the column that `arrange()` is supposed to sort by
> afterwards.

## Part 4: Three verbs

9. How expensive is a product in each category on average? Compute the
   number of rows, the mean and the median price per category, and sort the
   most expensive category to the top.

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   group_by(product_category) |>
>   summarize(
>     n = n(),
>     mean_price = mean(price),
>     median_price = median(price)
>   ) |>
>   arrange(desc(median_price))
> ```
>
> The most expensive is `Wein, Spirituosen und Tabak` (wine, spirits and
> tobacco) with a median of 4.85 euros, the cheapest `Tier` with 0.89 euros.
> `Baby und Kind` (baby and child) stands out: the mean is 3.18 euros, the
> median only 1.29 euros. Many cheap jars and a few expensive bulk packs of
> nappies and infant formula at up to 20 euros pull the mean up, while the
> median is not affected by them.

10. Which brands have the most different products? Sort the brand with the
    most to the top.

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   group_by(brand) |>
>   summarize(n_products = n_distinct(product_id)) |>
>   arrange(desc(n_products))
> ```
>
> REWE's own brands lead by far: REWE Beste Wahl with 697 products, ja! with
> 468 and REWE Bio with 285. Next comes not a brand but `NA` with 189
> products without a brand, which you can exclude with
> `filter(!is.na(brand))` before grouping. With `n()` instead of
> `n_distinct(product_id)` the duplicates would count twice.

## Part 5: Four verbs and more

11. How much sugar is in the sub-categories of `Süßes und Salziges` (sweet
    and savoury snacks)? Compute the number of products with a sugar value
    and the median sugar content per sub-category, the sweetest
    sub-category on top.

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   filter(product_category == "Süßes und Salziges", !is.na(sugar_in_gram)) |>
>   group_by(product_sub_category) |>
>   summarize(
>     n = n(),
>     median_sugar = median(sugar_in_gram)
>   ) |>
>   arrange(desc(median_sugar))
> ```
>
> In the median, sweets and chocolate consist of about half sugar, with 52
> and 49 g per 100 g, and sweet baked goods of a little over a third. Nuts
> come to 6 g and crisps to 2.6 g. Instead of excluding the rows without a
> value with `filter()`, you could write `median(sugar_in_gram, na.rm =
> TRUE)`; then `n` would also count the products without a value.

12. What share of the products in each category is organic? Count every
    product only once and sort the category with the highest share to the
    top.

```r
rewe
```

> [!HINT]
> `distinct()` without columns removes rows that are completely identical.
> And the mean of a column with `TRUE` and `FALSE` is the share of `TRUE`,
> because R counts `TRUE` as 1 and `FALSE` as 0.

> [!SOLUTION]
> ```r
> rewe |>
>   distinct() |>
>   group_by(product_category) |>
>   summarize(
>     n = n(),
>     share_bio = mean(bio)
>   ) |>
>   arrange(desc(share_bio))
> ```
>
> In `Baby und Kind` a little over half of the 225 products are organic, 53
> percent, far ahead of `Obst und Gemüse` with 17.5 percent. In `Küche und
> Haushalt` (kitchen and household) and `Tier` there is not a single organic
> product. Without `distinct()` the shares shift slightly, because some
> products count twice.

13. Which category has the highest share of duplicates? Compute per
    category the number of rows, the number of different products, the
    number of duplicates as the difference, and their share of the rows.

```r
rewe
```

> [!HINT]
> After `summarize()` you have one row per category with the two counts;
> you compute the difference and the share afterwards with `mutate()`.

> [!SOLUTION]
> ```r
> rewe |>
>   group_by(product_category) |>
>   summarize(
>     n = n(),
>     n_products = n_distinct(product_id)
>   ) |>
>   mutate(
>     duplicates = n - n_products,
>     share_duplicates = duplicates / n
>   ) |>
>   arrange(desc(share_duplicates))
> ```
>
> In `Tier` almost every fourth row is a duplicate, 54 of 231, in `Obst und
> Gemüse` only 21 of 312. The largest category, `Nahrungsmittel`, has the
> most duplicates in absolute numbers with 401. The duplicates are spread
> over all categories, and every analysis that counts products should remove
> them first.

14. One gram of fat provides about 9 kcal, one gram of protein and one gram
    of carbohydrates about 4 kcal each. Use this to compute the energy
    content of every product and its difference from `energy_in_kcal`. Show
    the products where the two values differ by more than 100 kcal, with
    name, both values and the difference, the largest on top.

```r
rewe
```

> [!HINT]
> `abs()` turns a negative number into a positive one, so a single
> comparison in `filter()` catches both directions.

> [!SOLUTION]
> ```r
> rewe |>
>   mutate(
>     kcal_calc = 9 * fat_in_gram + 4 * protein_in_gram + 4 * carbs_in_gram,
>     gap = energy_in_kcal - kcal_calc
>   ) |>
>   filter(abs(gap) > 100) |>
>   select(product_name, energy_in_kcal, kcal_calc, gap) |>
>   arrange(desc(gap))
> ```
>
> 42 rows remain, and three different causes lie behind the differences.
> At the top are pistachios with 2,546 kcal and pasta with 1,521 kcal,
> although their nutritional values add up to only about 600 and 350 kcal;
> here kilojoules were apparently entered as kilocalories. Then come spirits
> with just over 200 kcal but almost no fat, protein or carbohydrates,
> because their energy is in the alcohol, which the formula does not know.
> At the bottom are sugar-free sweets and chewing gums with less energy than
> computed, because their sugar substitutes count as carbohydrates but
> provide only about half as much energy. Only the first cause is an error
> in the data; the other two show that the formula is a simplification.

## What comes next

If you managed most of the tasks without the solution, you are ready for
the [[data-transformation-quiz|quiz]] at the end of the path. More tasks on
the same data, including charts, are in the
[[eda-self-assessment|self-assessment on exploratory data analysis]].
