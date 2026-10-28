---
title: "Self-assessment: Exploratory data analysis with R"
summary: >-
  Thirteen tasks on real product data: getting an overview, transforming,
  visualising and looking closely. This is how you check whether you are
  ready for exploratory data analysis.
translation_of: de
based_on: 2026-10-27
---

## What this is about

With this self-assessment you check whether you master the basics that
exploratory data analysis starts with. If you have worked through the *Whole
game* part of [[r-for-data-science]], or the paths [[getting-started-with-r]]
and [[data-transformation-with-r]], most tasks should come easily. Try each
one on your own first; you can open the solution if you get stuck or want to
compare.

In every box the table `rewe` is ready, with a good 9,400 products from the
[[rewe-products|REWE online shop]]: name, category, origin, price, organic
label and nutrition values per 100 g. dplyr and ggplot2 are loaded. On the
first click, loading takes a few seconds, and again for the first chart.
Categories, countries and product names are in German.

## Part 1: Overview

**Task 1.** Get an overview of `rewe`: which columns are there, what type do
they have, and what do the values look like?

```r
rewe
```

> [!SOLUTION]
> ```r
> glimpse(rewe)
> ```
>
> `glimpse()` shows all 22 columns one below the other, with type and first
> values. The nutrition values are decimal numbers, `bio` is a logical value,
> and `product_id` and `gtin` are numbers although nobody calculates with
> them.

**Task 2.** The table has 9,438 rows. How many different products does it
contain? Each product has its own `product_id`.

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   distinct(product_id) |>
>   nrow()
> ```
>
> There are 7,959 products; almost 1,500 rows are duplicates. For every count
> in the following tasks this means that some products count twice. For a
> self-assessment that is fine; in a real analysis you would remove the
> duplicates with `distinct()` first.

## Part 2: Transforming

**Task 3.** Show the ten most expensive products, with name and price only.

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   arrange(desc(price)) |>
>   select(product_name, price) |>
>   head(10)
> ```
>
> At the very top are a cast-iron casserole and cigarettes, no food at all.
> Some products appear twice; these are the duplicates from task 2.

**Task 4.** Which countries do the products come from? Show each country with
the number of its products, the most frequent first.

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   count(country_of_origin, sort = TRUE)
> ```
>
> Most products come from Germany, by a wide margin. In second place is `NA`:
> for about a fifth, the origin is missing.

**Task 5.** Calculate a new column `fat_unsat_in_gram`, the fat content
without the saturated fatty acids, and show it with name, fat and saturated
fat.

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   mutate(fat_unsat_in_gram = fat_in_gram - fat_sat_in_gram) |>
>   select(product_name, fat_in_gram, fat_sat_in_gram, fat_unsat_in_gram)
> ```
>
> Where one of the two values is missing, the new column is `NA` too.

**Task 6.** Which products have more than 99 g of fat per 100 g? Show only
name and fat.

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   filter(fat_in_gram > 99) |>
>   select(product_name, fat_in_gram)
> ```
>
> There are seven rows: oil, lard and vegetable fat.

**Task 7.** Keep only the columns that hold numbers.

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   select(where(is.numeric))
> ```
>
> `where()` selects columns by a property of their content, here by type.
> `product_id` and `gtin` are included too, because R takes them for numbers.

**Task 8.** `product_id` and `gtin` are numbers nobody calculates with.
Convert both to text.

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   mutate(
>     product_id = as.character(product_id),
>     gtin = as.character(gtin)
>   ) |>
>   select(product_id, gtin, product_name)
> ```
>
> It is shorter with `mutate(across(c(product_id, gtin), as.character))`;
> `across()` applies a function to several columns.

## Part 3: Visualising

**Task 9.** Show in a bar chart how many products there are in each category.

```r
rewe |>
  ggplot() +
  aes()
```

> [!SOLUTION]
> ```r
> rewe |>
>   ggplot() +
>   aes(y = product_category) +
>   geom_bar()
> ```
>
> With the categories on the y axis, long names stay readable.

**Task 10.** Show in a histogram how the energy content in kcal is
distributed across all products.

```r
rewe |>
  ggplot() +
  aes()
```

> [!SOLUTION]
> ```r
> rewe |>
>   ggplot() +
>   aes(x = energy_in_kcal) +
>   geom_histogram(binwidth = 50)
> ```
>
> The warning about removed rows refers to the products without nutrition
> values. Look at the x axis: it reaches far beyond what any food can have.
> Task 13 is about that.

**Task 11.** Compare the fat content of the categories with box plots.

```r
rewe |>
  ggplot() +
  aes()
```

> [!SOLUTION]
> ```r
> rewe |>
>   ggplot() +
>   aes(x = fat_in_gram, y = product_category) +
>   geom_boxplot()
> ```

**Task 12.** Show with stacked bars what share of the products in each
category is organic.

```r
rewe |>
  ggplot() +
  aes()
```

> [!SOLUTION]
> ```r
> rewe |>
>   ggplot() +
>   aes(y = product_category, fill = bio) +
>   geom_bar(position = "fill")
> ```
>
> `position = "fill"` stretches every bar to full length, so that the shares
> become comparable even though the categories differ in size.

## Part 4: Looking closely

**Task 13.** A food has at most about 900 kcal per 100 g; not even pure fat
has more. Find the products that have more, and show name, energy and fat.
What has probably happened there?

```r
rewe
```

> [!SOLUTION]
> ```r
> rewe |>
>   filter(energy_in_kcal > 900) |>
>   select(product_name, energy_in_kcal, fat_in_gram)
> ```
>
> Five products, among them pasta with 1,521 kcal and 2 g of fat. That cannot
> be right, but 1,521 kilojoules would be just right for pasta, about 360
> kcal. Presumably the value in kilojoules was entered as kilocalories. You
> only find such errors if you look at the distribution and ask what is
> possible at all; that is exactly what exploratory data analysis is about.

## Where to go next

If you managed almost everything without the solutions, you are well
prepared. Where you got stuck, these help:

- **Tasks 1 to 8:** the path [[data-transformation-with-r]] and the
  *Transform* part of [[r-for-data-science]].
- **Tasks 9 to 12:** the *Visualize* part of [[r-for-data-science]] and, for
  the question of which chart fits, [[fundamentals-of-data-visualization]].
- **Task 13:** there is no recipe here, only the habit of distrusting every
  result at first.
