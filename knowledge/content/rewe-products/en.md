---
title: Products from the REWE online shop
summary: >-
  A good 9,400 groceries and drugstore items with price, category, origin,
  organic label and nutrition values: real data with gaps, duplicates and a
  few values that cannot be right.
objectives:
  intro: "With this data set you practise exploratory data analysis on real product data with gaps, duplicates and faulty values, and with it you can:"
  goals:
    - "analyse products by category, origin, price and organic label"
    - "explain why many products lack nutrition values and why `vegan` and `vegetarian` are rarely given"
    - "find rows that occur more than once and count the distinct products by `product_id`"
    - "track down nutrition values that cannot be right"
translation_of: de
based_on: 2026-11-01
---

The data come from the online shop of REWE, a German supermarket chain, and
were collected for teaching; they are in the repository for the data
analytics courses linked below. Each row is a product with name, brand,
category in three levels, country of origin, price and, where given, its
nutrition values.

| Columns | Content |
|---|---|
| `product_id`, `gtin` | number in the shop and barcode |
| `product_name`, `brand` | name and brand |
| `product_category`, `product_sub_category`, `product_type` | category, coarse to fine, such as `Frische und Kühlung`, `Milch und Milchersatz`, `H-Milch` |
| `country_of_origin` | country of origin |
| `bio`, `vegan`, `vegetarian` | labels as `TRUE` or `FALSE`; `bio` means organic |
| `price`, `grammage` | price in euros and the package size as text |
| `energy_in_kcal` to `salt_in_gram` | nutrition values per 100 g or 100 ml |

The column names are in snake_case, as `janitor::clean_names()` makes them
from the names in the original file. Compared with the original, product
texts, ingredient lists, image links and an always empty column are left
out, so that the file loads quickly. Values such as categories and countries
are in German.

## What to watch out for

- **Not every product has nutrition values.** For drugstore items, household
  goods and pet supplies they are naturally missing, for some groceries too.
  `vegan` and `vegetarian` are given for only about one product in ten.
- **Some products appear more than once in the table**, identical in every
  column. A good 9,400 rows are just under 8,000 different products.
- **Not every value is right.** If you look at the nutrition values, you
  will find some that cannot be true.

This is exactly what makes the data suitable for exploratory data analysis;
the [[eda-self-assessment|self-assessment]] works with them.
