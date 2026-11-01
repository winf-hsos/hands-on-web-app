---
title: Packages
summary: >-
  Packages extend R with new functions: install once, load in every script.
  Plus the tidyverse and what is already prepared on this platform.
objectives:
  intro: "This lesson shows you how to extend R with packages, and afterwards you can:"
  goals:
    - "explain what a package is and that most R packages live in the official repository CRAN"
    - "install a package once with `install.packages()` and load it with `library()` at the start of every script"
    - "trace the message that R cannot find a function back to a package that is installed but not loaded"
    - "describe the `tidyverse` as a family of packages and place `dplyr`, `ggplot2`, `readr` and `tidyr` within it"
    - "explain why `library()` belongs in your own scripts even though `dplyr` is already loaded on this platform"
translation_of: de
based_on: 2026-11-01
---

R comes with many functions out of the box, but far from all you need for
analysing data. **Packages** supply the rest: collections of functions that
others have written and published. There are more than twenty thousand of
them for R, most in the official repository CRAN.

## Installing and loading

You only need to install a package on your computer once. After that you
load it with `library()` in every script that uses it:

```r static
install.packages("dplyr")  # once
library(dplyr)             # at the start of every script
```

When installing, the name goes in quotation marks; when loading, it does not.
If a package is installed but not loaded, R does not know its functions and
reports that it cannot find the function.

## The tidyverse

Many packages for data analysis follow the same ideas and fit together.
Together they are called the **tidyverse**: dplyr for transforming, ggplot2
for charts, readr for reading data, tidyr for tidying and a few more. With
`install.packages("tidyverse")` and `library(tidyverse)` you get them all at
once.

## On this platform

In the R boxes here, dplyr is already loaded, so that every example runs
without preamble. That is a shortcut of this site: on your own computer,
`library()` belongs at the start of every script, so that it still runs
tomorrow and on another computer. An environment in which to write R there
is [[positron]].

## Key points

- Packages extend R with functions.
- `install.packages("name")` once, `library(name)` in every script.
- The tidyverse is a family of packages for data analysis, to which dplyr
  belongs.
