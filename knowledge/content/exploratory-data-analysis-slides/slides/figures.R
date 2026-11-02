# Figures of the deck "exploratory data analysis", drawn from the full
# survey "mds12 Schoko/Milch" (2,811 people, 606 columns).
#
# The code that each slide offers to copy (its figcode) is the plain ggplot2
# call below; this script adds only the slide design: theme_stagekit() from
# stagekit, the colours of theme.css, readable labels and the group sizes.
#
# Usage, from the repository root:
#   Rscript knowledge/content/exploratory-data-analysis-slides/slides/figures.R
# It writes the SVGs and the PNG to img/ next to this script and prints the
# numbers the slides quote.

suppressMessages(library(tidyverse))

here <- "knowledge/content/exploratory-data-analysis-slides/slides"
stagekit_r <- Sys.getenv("STAGEKIT_R", "C:/code/stagekit/tools/r/theme_stagekit.R")
source(stagekit_r)

# The colours of the deck, read from the :root block of theme.css
read_theme_colors <- function(css_file) {
  css <- readLines(css_file, encoding = "UTF-8")
  root <- css[seq(which(css == ":root {"), which(css == "}")[1])]
  hits <- regmatches(root, regexec("--([a-z-]+): (#[0-9a-f]{6});", root))
  hits <- hits[lengths(hits) == 3]
  setNames(vapply(hits, `[`, "", 3), gsub("-", "_", vapply(hits, `[`, "", 2)))
}
colors <- read_theme_colors(file.path(here, "theme.css"))
img <- function(name) file.path(here, "img", name)

survey <- read_csv("knowledge/media/datasets/mds12_schoko_milch.csv", show_col_types = FALSE) |>
  rename(
    age = Q002alter,
    organic_share = v032bioanteil,
    price_too_expensive = U017pvonwzuteuer2,
    no_oat_milk = m073haferpro1_nohafer
  ) |>
  mutate(diet = factor(v041nofleisch, levels = 0:4,
    labels = c("omnivore", "flexitarian", "vegetarian", "vegan", "pescetarian")))

thousands <- function(x) format(x, big.mark = ",", trim = TRUE)
bars <- function(...) geom_histogram(..., fill = colors[["gray_light"]], colour = colors[["bg"]], linewidth = 0.5)

# ---- missing cells: the whole table as a picture (PNG, 1 pixel per cell) ----
# Rows are sorted by the two subsamples, chocolate (275 people) and milk
# (234), then by how much a person answered, so the parts asked only of a
# subsample show up as blocks.
present <- !is.na(as.matrix(read_csv("knowledge/media/datasets/mds12_schoko_milch.csv",
                                     show_col_types = FALSE, col_types = cols(.default = "c"))))
cat("cells:", length(present), " missing share:", round(1 - mean(present), 3),
    " rows without a gap:", sum(rowSums(!present) == 0), "\n")
answered <- colSums(present)
chocolate <- present[, which(answered == 275)[1]]
milk <- present[, which(answered == 234)[1]]
row_order <- order(!chocolate, !milk, -rowSums(present))
grid <- present[row_order, ]
picture <- matrix(ifelse(grid, colors[["gray_light"]], colors[["gray_dark"]]), nrow = nrow(grid))
png(img("missing-cells.png"), width = ncol(grid), height = nrow(grid), bg = colors[["bg"]])
par(mar = c(0, 0, 0, 0), xaxs = "i", yaxs = "i")
plot.new()
rasterImage(as.raster(picture), 0, 0, 1, 1, interpolate = FALSE)
invisible(dev.off())

# ---- variation: age ----
age_plot <- ggplot(survey, aes(x = age)) +
  bars(binwidth = 5) +
  labs(x = "age", y = "respondents") +
  theme_stagekit(colors)
save_slide_svg(age_plot, img("age-histogram.svg"), 1680, 660)
cat("age:", range(survey$age), " median:", median(survey$age), "\n")

# ---- unusual values: the price at which a litre of milk is too expensive ----
prices <- survey |> filter(!is.na(price_too_expensive))
price_axis <- labs(x = "too expensive from (euro per litre)", y = "answers")
price_full <- ggplot(prices, aes(x = price_too_expensive)) +
  bars(binwidth = 10) +
  price_axis +
  theme_stagekit(colors)
# the zoomed picture draws only the bars it shows; coord_cartesian() would
# otherwise write all 10,000 bars of width 0.1 into the SVG
price_zoom <- ggplot(filter(prices, price_too_expensive < 5.1), aes(x = price_too_expensive)) +
  bars(binwidth = 0.1) +
  coord_cartesian(xlim = c(0, 5)) +
  price_axis +
  theme_stagekit(colors)
save_slide_svg(price_full, img("price-full.svg"), 1200, 660)
save_slide_svg(price_zoom, img("price-zoom.svg"), 1200, 660)
p <- prices$price_too_expensive
cat("price answers:", length(p), " median:", median(p), " mean:", round(mean(p), 2), " max:", max(p), "\n")
cat("above 20:", sort(p[p > 20]), "\n")
kept <- p[p <= 20]
cat("after: n", length(kept), " median:", median(kept), " mean:", round(mean(kept), 2), "\n")

# ---- covariation: organic share by diet ----
diets <- survey |> filter(!is.na(diet), !is.na(organic_share))
sizes <- diets |> count(diet)
diet_labels <- setNames(paste0(sizes$diet, "\nn = ", thousands(sizes$n)), sizes$diet)
organic_plot <- ggplot(diets, aes(x = diet, y = organic_share)) +
  geom_boxplot(aes(fill = diet == "vegan", colour = diet == "vegan"), linewidth = 0.8,
               width = 0.6, outlier.size = 3,
               whisker.colour = colors[["gray_light"]], staple.colour = colors[["gray_light"]],
               outlier.colour = colors[["gray_light"]]) +
  scale_fill_manual(values = c(`FALSE` = colors[["gray_dark"]], `TRUE` = colors[["yellow"]])) +
  # on the yellow box the lines are black, so its median stays visible;
  # whiskers and outliers stay grey, because black would vanish on the slide
  scale_colour_manual(values = c(`FALSE` = colors[["gray_light"]], `TRUE` = colors[["bg"]])) +
  scale_x_discrete(labels = diet_labels) +
  scale_y_continuous(breaks = 1:5, labels = c("1 never", "2", "3 half", "4", "5 only")) +
  labs(x = NULL, y = "organic share") +
  theme_stagekit(colors)
save_slide_svg(organic_plot, img("organic-by-diet.svg"), 1680, 660)
print(diets |> group_by(diet) |> summarise(n = n(), median = median(organic_share), mean = round(mean(organic_share), 2)))

# ---- covariation: oat milk by age (the milk subsample) ----
oat <- survey |>
  filter(!is.na(no_oat_milk)) |>
  mutate(age_group = cut(age, c(17, 29, 44, 59, 80), labels = c("18 to 29", "30 to 44", "45 to 59", "60 to 80")),
         open = no_oat_milk == 0)
oat_shares <- oat |> group_by(age_group) |> summarise(n = n(), open = mean(open))
print(oat_shares)
cat("oat milk subsample:", nrow(oat), "\n")
oat_labels <- setNames(paste0(oat_shares$age_group, "\nn = ", oat_shares$n), oat_shares$age_group)
oat_plot <- ggplot(oat, aes(x = age_group, fill = open)) +
  geom_bar(position = "fill", width = 0.6) +
  geom_text(data = oat_shares, aes(x = age_group, y = open / 2, label = paste0(round(100 * open), " %")),
            inherit.aes = FALSE, colour = colors[["bg"]], size = stagekit_text_size(32), family = "Arial") +
  scale_fill_manual(values = c(`TRUE` = colors[["yellow"]], `FALSE` = colors[["gray_dark"]])) +
  scale_y_continuous(labels = function(x) paste0(round(100 * x), " %")) +
  scale_x_discrete(labels = oat_labels) +
  labs(x = "age", y = "share of respondents") +
  theme_stagekit(colors)
save_slide_svg(oat_plot, img("oat-milk-by-age.svg"), 1680, 660)

# ---- chance: how many pairs of columns look related when nothing is ----
# Shuffling each column on its own destroys every real relation but keeps
# the values and the gaps. Of the pairs that can be tested (both columns
# numeric and at least 30 people with both values), about 5 % still pass a
# test at 5 %; the slide rounds the three runs below to "about 7,000".
numbers <- as.matrix(Filter(function(x) is.numeric(x) && sum(!is.na(x)) >= 30 && n_distinct(x, na.rm = TRUE) > 1,
                            read_csv("knowledge/media/datasets/mds12_schoko_milch.csv", show_col_types = FALSE)))
both <- crossprod(!is.na(numbers))
passing <- function(m) {
  r <- suppressWarnings(cor(m, use = "pairwise.complete.obs"))
  ok <- upper.tri(r) & !is.na(r) & both >= 30 & abs(r) < 1
  t <- r[ok] * sqrt((both[ok] - 2) / (1 - r[ok]^2))
  c(pairs = sum(ok), passing = sum(2 * pt(-abs(t), both[ok] - 2) < 0.05))
}
cat("pairs of all 606 columns:", choose(606, 2), "\n")
set.seed(2026)
for (run in 1:3) {
  shuffled <- apply(numbers, 2, function(x) { i <- which(!is.na(x)); x[i] <- x[sample(i)]; x })
  cat("shuffled run", run, ":", passing(shuffled), "\n")
}
