# Charts of the deck "misleading charts" as SVG in the dark slide palette of
# the Hands-on Data Science decks (style.toml next to the deck). Every chart
# is drawn by exactly the code that the lesson misleading-charts shows, plus
# theme_slide() and a few colour defaults, which only set the colours and
# sizes of the slides.
#
# Unlike scripts/data-visualisation-figures.R, this script reads the survey
# from the knowledge base (knowledge/media/datasets/), not from dist/, so it
# runs without a build.
#
# Usage (from the repository root):
#   Rscript scripts/misleading-charts-figures.R
#
# Input:  knowledge/media/datasets/milk_survey_compact.csv
# Output: knowledge/content/misleading-charts-slides/slides/img/fig-*.svg
#
# The two famous cases are typed in by hand with their original numbers:
# the top tax rate from a Fox Business chart (Cavuto, July 2012: 35 % now,
# 39.6 % from 1 January 2013, value axis from 34 %; described by Media Matters
# and FlowingData) and the firearm murders in Florida from the Reuters chart
# on the "Stand Your Ground" law (February 2014, inverted y-axis; data of the
# Florida Department of Law Enforcement, 1990 to 2012).

suppressPackageStartupMessages({
  library(tidyverse)
  library(svglite)
})

survey <- read_csv("knowledge/media/datasets/milk_survey_compact.csv", show_col_types = FALSE)
out <- "knowledge/content/misleading-charts-slides/slides/img"
dir.create(out, showWarnings = FALSE, recursive = TRUE)

# Colours of the slides: light grey for marks and text, dark grey for the
# grid, blue only where something is meant to stand out.
light <- "#B6BEC6"
gray <- "#7D868F"
dark <- "#4A5259"
blue <- "#3D8FC4"
group1 <- "#FB923C"
group2 <- "#C084FC"

update_geom_defaults("bar", list(fill = light))
update_geom_defaults("col", list(fill = light))
update_geom_defaults("area", list(fill = light))
update_geom_defaults("line", list(colour = light))
update_geom_defaults("vline", list(colour = gray, linewidth = 1))
update_geom_defaults("point", list(colour = light, size = 3))
update_geom_defaults("text", list(colour = light, size = 32 / .pt, family = "Arial"))
update_geom_defaults("boxplot", list(fill = NA, colour = light, linewidth = 1.2))

theme_slide <- function() {
  theme_minimal(base_size = 32, base_family = "Arial") +
    theme(
      text = element_text(colour = light),
      axis.text = element_text(colour = light),
      axis.title = element_text(colour = light),
      panel.grid.major = element_line(colour = dark, linewidth = 0.6),
      panel.grid.minor = element_blank(),
      legend.text = element_text(colour = light),
      legend.title = element_text(colour = light),
      plot.caption = element_text(colour = gray),
      plot.background = element_rect(fill = NA, colour = NA),
      panel.background = element_rect(fill = NA, colour = NA),
      legend.position = "right"
    )
}

# Two charts stand side by side on a slide, 800 x 600 each.
save <- function(plot, name, width = 800, height = 600, extra = NULL) {
  svglite(file.path(out, paste0(name, ".svg")), width = width / 72, height = height / 72, bg = "transparent")
  print(plot + theme_slide() + extra)
  invisible(dev.off())
}


# --- two famous cases ------------------------------------------------------

# The top tax rate, value axis from 34 %
save(
  tribble(
    ~when, ~top_rate,
    "Now", 35,
    "Jan 1, 2013", 39.6
  ) |>
    ggplot() +
    aes(x = fct_inorder(when), y = top_rate) +
    geom_col() +
    coord_cartesian(ylim = c(34, 42)) +
    labs(x = NULL, y = "top tax rate (%)"),
  "fig-tax-cut"
)
save(
  tribble(
    ~when, ~top_rate,
    "Now", 35,
    "Jan 1, 2013", 39.6
  ) |>
    ggplot() +
    aes(x = fct_inorder(when), y = top_rate) +
    geom_col() +
    labs(x = NULL, y = "top tax rate (%)"),
  "fig-tax-full"
)

# Firearm murders in Florida, with the y-axis upside down and the right way up
save(
  tibble(
    year = 1990:2012,
    firearm_murders = c(873, 806, 789, 800, 739, 687, 668, 634, 589, 460, 499, 502,
                        552, 586, 555, 521, 740, 825, 780, 695, 669, 691, 721)
  ) |>
    ggplot() +
    aes(x = year, y = firearm_murders) +
    geom_area() +
    geom_vline(xintercept = 2005) +
    annotate("text", x = 2004.5, y = 950, label = "2005: \"Stand Your Ground\"", hjust = 1) +
    scale_y_reverse() +
    labs(x = NULL, y = "murders using firearms"),
  "fig-florida-reversed"
)
save(
  tibble(
    year = 1990:2012,
    firearm_murders = c(873, 806, 789, 800, 739, 687, 668, 634, 589, 460, 499, 502,
                        552, 586, 555, 521, 740, 825, 780, 695, 669, 691, 721)
  ) |>
    ggplot() +
    aes(x = year, y = firearm_murders) +
    geom_area() +
    geom_vline(xintercept = 2005) +
    annotate("text", x = 2004.5, y = 950, label = "2005: \"Stand Your Ground\"", hjust = 1) +
    labs(x = NULL, y = "murders using firearms"),
  "fig-florida-normal"
)

# --- five tricks on the survey ---------------------------------------------

# 1 A cut axis: one cent becomes huge
save(
  survey |>
    filter(!is.na(price_too_expensive)) |>
    group_by(milk_brand) |>
    summarise(median_price = median(price_too_expensive)) |>
    ggplot() +
    aes(x = milk_brand, y = median_price) +
    geom_col() +
    coord_cartesian(ylim = c(1.98, 2.01)) +
    labs(x = "brand shown", y = "median: too expensive from (€)"),
  "fig-brand-cut"
)
save(
  survey |>
    filter(!is.na(price_too_expensive)) |>
    group_by(milk_brand) |>
    summarise(median_price = median(price_too_expensive), n = n()) |>
    ggplot() +
    aes(x = paste0(milk_brand, "\n(n = ", n, ")"), y = median_price) +
    geom_col() +
    geom_text(aes(label = format(median_price, nsmall = 2)), vjust = -0.5) +
    coord_cartesian(ylim = c(0, 2.2)) +
    labs(x = "brand shown", y = "median: too expensive from (€)"),
  "fig-brand-full"
)

# 2 Counts instead of shares
save(
  survey |>
    filter(shops_organic, !is.na(diet)) |>
    ggplot() +
    aes(y = fct_rev(fct_infreq(diet))) +
    geom_bar() +
    labs(x = "people who shop in an organic store", y = NULL),
  "fig-organic-count"
)
save(
  survey |>
    filter(!is.na(diet)) |>
    group_by(diet) |>
    summarise(share = 100 * mean(shops_organic), n = n()) |>
    ggplot() +
    aes(x = share, y = fct_reorder(paste0(diet, " (n = ", n, ")"), share)) +
    geom_col() +
    labs(x = "shop in an organic store (%)", y = NULL),
  "fig-organic-share"
)

# 3 Area instead of length: the radius grows with the value, then the area
save(
  survey |>
    filter(!is.na(milk_freq)) |>
    count(milk_freq) |>
    mutate(milk_freq = factor(milk_freq, levels = c(
      "daily", "weekly", "monthly", "rarely"
    ))) |>
    ggplot() +
    aes(x = milk_freq, y = 1, size = n) +
    geom_point() +
    scale_radius(limits = c(0, NA), range = c(0, 50)) +
    scale_y_continuous(breaks = NULL) +
    labs(x = "how often milk is drunk at home", y = NULL),
  "fig-milk-radius",
  extra = theme(legend.position = "none")
)
save(
  survey |>
    filter(!is.na(milk_freq)) |>
    count(milk_freq) |>
    mutate(milk_freq = factor(milk_freq, levels = c(
      "daily", "weekly", "monthly", "rarely"
    ))) |>
    ggplot() +
    aes(x = milk_freq, y = 1, size = n) +
    geom_point() +
    scale_size_area(max_size = 50) +
    scale_y_continuous(breaks = NULL) +
    labs(x = "how often milk is drunk at home", y = NULL),
  "fig-milk-area",
  extra = theme(legend.position = "none")
)

# 4 The silent outlier: means with the 999 € inside, then a boxplot that says
#   what it leaves out
save(
  survey |>
    filter(!is.na(price_too_expensive)) |>
    group_by(milk_brand) |>
    summarise(mean_price = mean(price_too_expensive)) |>
    ggplot() +
    aes(x = milk_brand, y = mean_price) +
    geom_col() +
    labs(x = "brand shown", y = "mean: too expensive from (€)"),
  "fig-brand-mean"
)
save(
  survey |>
    filter(price_too_expensive <= 10) |>
    ggplot() +
    aes(x = milk_brand, y = price_too_expensive) +
    geom_boxplot() +
    labs(
      x = "brand shown", y = "too expensive from (€)",
      caption = "left out: 20 of 611 answers above 10 €, up to 999 €"
    ),
  "fig-brand-box"
)

# 5 Angles instead of lengths
save(
  survey |>
    filter(!is.na(diet)) |>
    count(diet) |>
    ggplot() +
    aes(x = "", y = n, fill = diet) +
    geom_col() +
    coord_polar(theta = "y") +
    scale_fill_manual(values = c(light, gray, dark, group1, group2)) +
    labs(x = NULL, y = NULL, fill = NULL),
  "fig-diet-pie",
  extra = theme(axis.text = element_blank(), panel.grid.major = element_blank())
)
save(
  survey |>
    filter(!is.na(diet)) |>
    count(diet) |>
    ggplot() +
    aes(x = n, y = fct_reorder(diet, n)) +
    geom_col() +
    labs(x = "number of respondents", y = NULL),
  "fig-diet-bars"
)

cat("written to", out, "\n")
