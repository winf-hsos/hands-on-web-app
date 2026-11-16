---
title: Which chart fits?
summary: >-
  A few questions about the variables lead to the chart that fits a question
  about survey data, with a sketch, the pitfalls and a template for R and
  ggplot2, which can also be filled straight away with columns of the milk
  survey.
translation_of: de
based_on: 2026-11-15
---

**Goal:** Find the chart that answers a question about survey data, and get an
R template that you only need to fill with your columns.

**How to use it:** At the top stand all ten charts the questions choose
between. Answer the questions by clicking one of the large buttons or with the
number keys: with every answer the charts that no longer fit step back, your
answers collect below them, and "Back" takes the last one back. A click on one
of the ten charts shows you the answers that lead to it. At the end you see the
chart that fits in large, the reason why it fits, what to watch out for, and
the R code with a button to copy it. Below, you can instead choose one or two
columns of the milk survey: the demo then shows how the questions turn out for
them and fills the code with their names, so that it runs in every R code box
on the platform.

Which chart fits depends above all on the **level of measurement** of the
variables. Categories without an order may be sorted by frequency, categories
with an order keep the order of their scale, and numbers are shown as a
distribution. With **one** variable the question is how the answers are
spread; with **two** variables it is how they are related, and then the
combination of the two scales decides the chart.

```which-chart
```
