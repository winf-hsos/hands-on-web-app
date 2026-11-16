# Charts of the deck "data visualisation with R and ggplot2" as SVG in the
# dark slide palette of the Hands-on Data Science decks (style.toml next to
# the deck). Every chart is drawn by exactly the code that
# the slide shows, plus theme_slide(), which only sets the colours and sizes
# of the slides.
#
# Usage (from the repository root, after npm run build):
#   Rscript scripts/data-visualisation-figures.R
#
# Input:  dist/media/datasets/milk_survey_compact.csv
# Output: knowledge/content/data-visualisation-slides/slides/img/fig-*.svg

suppressPackageStartupMessages({
  library(tidyverse)
  library(svglite)
})

survey <- read_csv("dist/media/datasets/milk_survey_compact.csv", show_col_types = FALSE)
out <- "knowledge/content/data-visualisation-slides/slides/img"
dir.create(out, showWarnings = FALSE, recursive = TRUE)

# Colours of the slides: light grey for marks and text, dark grey for the
# grid, blue only where something is meant to stand out, the group colours
# only to tell groups apart.
light <- "#B6BEC6"
gray <- "#7D868F"
dark <- "#4A5259"
blue <- "#3D8FC4"
group1 <- "#FB923C"
group2 <- "#C084FC"

update_geom_defaults("bar", list(fill = light))
update_geom_defaults("col", list(fill = light))
update_geom_defaults("point", list(colour = light, size = 3))
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
      strip.text = element_text(colour = light, size = 32),
      plot.background = element_rect(fill = NA, colour = NA),
      panel.background = element_rect(fill = NA, colour = NA),
      legend.position = "right"
    )
}

save <- function(plot, name, width = 1680, height = 760, extra = NULL) {
  svglite(file.path(out, paste0(name, ".svg")), width = width / 72, height = height / 72, bg = "transparent")
  print(plot + theme_slide() + extra)
  invisible(dev.off())
}


# --- one variable ----------------------------------------------------------

# Slide 7: nominal, sorted by frequency
save(
  survey |>
    filter(!is.na(diet)) |>
    ggplot() +
    aes(y = fct_rev(fct_infreq(diet))) +
    geom_bar() +
    labs(x = "Number of respondents", y = NULL),
  "fig-diet"
)

# Slide 8: the same ordinal column as text and as a factor
save(
  survey |>
    filter(!is.na(milk_freq)) |>
    ggplot() +
    aes(x = milk_freq) +
    geom_bar() +
    labs(x = "How often milk is drunk at home", y = "Number of respondents"),
  "fig-milk-text"
)
save(
  survey |>
    filter(!is.na(milk_freq)) |>
    mutate(milk_freq = factor(milk_freq, levels = c("daily", "weekly", "monthly", "rarely"))) |>
    ggplot() +
    aes(x = milk_freq) +
    geom_bar() +
    labs(x = "How often milk is drunk at home", y = "Number of respondents"),
  "fig-milk-factor"
)

# Slide 9: a rating scale as bars
save(
  survey |>
    filter(!is.na(eco_conscious)) |>
    ggplot() +
    aes(x = eco_conscious) +
    geom_bar() +
    labs(x = "\"I would call myself eco-conscious\" (-2 to +2)", y = "Number of respondents"),
  "fig-eco"
)

# Slide 10: a histogram
save(
  survey |>
    ggplot() +
    aes(x = age) +
    geom_histogram(binwidth = 5, fill = light, colour = "black") +
    labs(x = "Age in years", y = "Number of respondents"),
  "fig-age-hist"
)

# Slide 11: one outlier hides everything, then filtered
save(
  survey |>
    filter(!is.na(price_too_expensive)) |>
    ggplot() +
    aes(x = price_too_expensive) +
    geom_histogram(bins = 30, fill = light, colour = "black") +
    labs(x = "Too expensive from (€)", y = "Number of respondents"),
  "fig-price-all"
)
save(
  survey |>
    filter(price_too_expensive <= 10) |>
    ggplot() +
    aes(x = price_too_expensive) +
    geom_histogram(binwidth = 0.25, fill = light, colour = "black") +
    labs(x = "Too expensive from (€)", y = "Number of respondents"),
  "fig-price-filtered"
)

# Slide 12: the same prices as a boxplot, with the parts named
price <- survey |> filter(price_too_expensive <= 10) |> pull(price_too_expensive)
q <- quantile(price, c(0.25, 0.5, 0.75))
save(
  survey |>
    filter(price_too_expensive <= 10) |>
    ggplot() +
    aes(x = price_too_expensive) +
    geom_boxplot(width = 0.4, outlier.size = 3) +
    annotate("text", x = q[2], y = 0.32, label = "median", colour = blue, size = 32 / .pt, family = "Arial") +
    annotate("text", x = (q[1] + q[3]) / 2, y = -0.32, label = "middle half", colour = blue, size = 32 / .pt, family = "Arial") +
    annotate("text", x = max(price), y = 0.15, label = "unusual values", colour = blue, size = 32 / .pt, family = "Arial", hjust = 1) +
    scale_y_continuous(limits = c(-0.45, 0.45), breaks = NULL) +
    labs(x = "Too expensive from (€)", y = NULL),
  "fig-price-box"
)

# --- two variables ---------------------------------------------------------

# Slide 14: two categories, stacked to 100 %
save(
  survey |>
    filter(!is.na(diet)) |>
    ggplot() +
    aes(y = fct_infreq(diet), fill = shops_organic) +
    geom_bar(position = "fill") +
    scale_fill_manual(values = c(`FALSE` = dark, `TRUE` = blue)) +
    labs(x = "Share of respondents", y = NULL, fill = "Shops in an\norganic store"),
  "fig-diet-organic"
)

# Slide 15: a number by group
save(
  survey |>
    filter(price_too_expensive <= 10) |>
    ggplot() +
    aes(x = milk_brand, y = price_too_expensive) +
    geom_boxplot(width = 0.5, outlier.size = 3) +
    labs(x = "Brand shown", y = "Too expensive from (€)"),
  "fig-price-brand"
)

# Slide 16: two numbers
save(
  survey |>
    filter(price_too_expensive <= 10) |>
    ggplot() +
    aes(x = age, y = price_too_expensive) +
    geom_point(alpha = 0.6) +
    labs(x = "Age in years", y = "Too expensive from (€)"),
  "fig-age-price"
)

# Slide 17: points that pile up, then counted
save(
  survey |>
    ggplot() +
    aes(x = eco_conscious, y = prefers_organic) +
    geom_point() +
    labs(x = "Eco-conscious (-2 to +2)", y = "Prefers organic (-2 to +2)"),
  "fig-eco-organic-point"
)
save(
  survey |>
    ggplot() +
    aes(x = eco_conscious, y = prefers_organic) +
    geom_count(colour = light) +
    scale_size_area(max_size = 22) +
    labs(x = "Eco-conscious (-2 to +2)", y = "Prefers organic (-2 to +2)", size = "Respondents"),
  "fig-eco-organic-count"
)

# Slide 18: what to avoid, small charts side by side
diet_counts <- survey |>
  filter(!is.na(diet)) |>
  count(diet)
save(
  diet_counts |>
    ggplot() +
    aes(x = "", y = n, fill = diet) +
    geom_col(width = 1, colour = "black") +
    coord_polar(theta = "y") +
    scale_fill_manual(values = c(light, gray, dark, group1, group2)) +
    labs(x = NULL, y = NULL, fill = NULL),
  "fig-avoid-pie", width = 800, height = 600,
  extra = theme(axis.text = element_blank(), panel.grid.major = element_blank())
)
save(
  diet_counts |>
    ggplot() +
    aes(x = n, y = fct_reorder(diet, n)) +
    geom_col() +
    labs(x = "Number of respondents", y = NULL),
  "fig-avoid-bars", width = 800, height = 600
)
milk_daily <- survey |>
  filter(!is.na(milk_freq)) |>
  group_by(gender) |>
  summarise(pct_daily = 100 * mean(milk_freq == "daily"))
save(
  milk_daily |>
    ggplot() +
    aes(x = gender, y = pct_daily) +
    geom_col(width = 0.6) +
    coord_cartesian(ylim = c(55, 66)) +
    labs(x = NULL, y = "Drink milk daily (%)"),
  "fig-avoid-cut", width = 800, height = 600
)
save(
  milk_daily |>
    ggplot() +
    aes(x = gender, y = pct_daily) +
    geom_col(width = 0.6) +
    labs(x = NULL, y = "Drink milk daily (%)"),
  "fig-avoid-full", width = 800, height = 600
)

# --- a chart in layers -----------------------------------------------------

# Slide 22: the histogram of age, one layer at a time
layer_size <- c(width = 760, height = 620)
save(survey |> ggplot(), "fig-layer-1", layer_size[1], layer_size[2])
save(survey |> ggplot() + aes(x = age), "fig-layer-2", layer_size[1], layer_size[2])
save(
  survey |> ggplot() + aes(x = age) + geom_histogram(binwidth = 5, fill = light, colour = "black"),
  "fig-layer-3", layer_size[1], layer_size[2]
)
save(
  survey |>
    ggplot() +
    aes(x = age) +
    geom_histogram(binwidth = 5, fill = light, colour = "black") +
    labs(x = "Age in years", y = "Number of respondents"),
  "fig-layer-4", layer_size[1], layer_size[2]
)

# Slide 25: fill as an aesthetic, in counts
save(
  survey |>
    filter(!is.na(diet)) |>
    ggplot() +
    aes(y = fct_rev(fct_infreq(diet)), fill = shops_organic) +
    geom_bar() +
    scale_fill_manual(values = c(`FALSE` = dark, `TRUE` = blue)) +
    labs(x = "Number of respondents", y = NULL, fill = "Shops in an\norganic store"),
  "fig-diet-organic-count"
)

# Slide 36: same chart, other coordinates (one stacked bar, then bent into a pie)
save(
  survey |>
    filter(!is.na(diet)) |>
    ggplot() +
    aes(x = "", fill = diet) +
    geom_bar(width = 1),
  "fig-coord-bar", width = 800, height = 600,
  extra = list(
    scale_fill_manual(values = c(light, gray, dark, group1, group2)),
    labs(x = NULL, y = "Number of respondents", fill = NULL)
  )
)
save(
  survey |>
    filter(!is.na(diet)) |>
    ggplot() +
    aes(x = "", fill = diet) +
    geom_bar(width = 1) +
    coord_polar(theta = "y"),
  "fig-coord-pie", width = 800, height = 600,
  extra = list(
    scale_fill_manual(values = c(light, gray, dark, group1, group2)),
    labs(x = NULL, y = NULL, fill = NULL),
    theme(axis.text.y = element_blank())
  )
)

# Slide 27: small multiples
save(
  survey |>
    ggplot() +
    aes(x = age) +
    geom_histogram(binwidth = 5, fill = light, colour = "black") +
    facet_wrap(~ gender) +
    labs(x = "Age in years", y = "Number of respondents"),
  "fig-age-facet"
)

# Slide 28: labels for people
save(
  survey |>
    filter(!is.na(diet)) |>
    ggplot() +
    aes(y = fct_infreq(diet), fill = shops_organic) +
    geom_bar(position = "fill") +
    scale_x_continuous(labels = scales::percent) +
    scale_fill_manual(values = c(`FALSE` = dark, `TRUE` = blue), labels = c("no", "yes")) +
    labs(
      title = "Vegans shop in organic stores most often",
      x = "Share of respondents", y = NULL, fill = "Organic store",
      caption = "Source: milk survey, compact (n = 2,781 with a diet)"
    ),
  "fig-diet-organic-labelled"
)

cat("written to", out, "\n")
