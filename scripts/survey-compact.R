# Builds the compact milk survey from the raw download of the survey
# "mds12 Schoko/Milch" by Prof. Ulrich Enneking (Hochschule Osnabrueck): every
# respondent, but only 21 questions, with readable English names and labelled
# values instead of codes. The code is the solution of the exercise
# dplyr-exercise-compact-survey, where learners build this table themselves.
# The first eleven columns are those of the 30-row excerpt `survey`, so code
# from the lessons runs on this table unchanged.
#
# Dropped on purpose: income, education, employment and the two people who
# chose "diverse" as gender (too few to analyse, easy to single out).
#
# Usage, from the root of the repository:
#   Rscript scripts/survey-compact.R
# writes knowledge/media/datasets/milk_survey_compact.csv and .rds.

library(tidyverse)

dir <- "knowledge/media/datasets"
raw <- read_csv(file.path(dir, "mds12_schoko_milch.csv"), show_col_types = FALSE)

states <- c(
  "Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen",
  "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen",
  "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen",
  "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen"
)

survey <- raw |>
  filter(q004geschlecht %in% c(1, 2)) |>
  select(
    age = Q002alter,
    gender = q004geschlecht,
    state = q003land,
    town_size = d044stadt,
    household_size = d042hhzahl,
    diet = v041nofleisch,
    organic_share = v032bioanteil,
    milk_freq = v007freq3_mi,
    milk_brand = AB1619pvonw2f,
    price_weihenstephan = u017pvonwzuteuer1,
    price_alpro = u017pvonwzuteuer2,
    shops_discounter = v008ort_1discount,
    shops_organic = v008ort_7bioladen,
    eco_conscious = p030green_5umweltbewusst,
    prefers_organic = p031bio_1lieberbio,
    loves_meat = p033meat_1fan,
    loves_cooking = p035koch_2hobby,
    rated_brand = AX010midiff7f,
    brand_quality = B010midiff7_1quali,
    brand_buy = B010midiff7_14kauf,
    tiktok = d216medien_18tiktok
  ) |>
  mutate(
    id = row_number(),
    gender = factor(gender, levels = 1:2, labels = c("male", "female")),
    state = factor(state, levels = 1:16, labels = states),
    town_size = factor(
      town_size,
      levels = 1:6,
      labels = c("city", "large town", "town", "small town", "very small town", "village")
    ),
    diet = factor(
      diet,
      levels = 0:4,
      labels = c("omnivore", "flexitarian", "vegetarian", "vegan", "pescetarian")
    ),
    milk_freq = factor(
      milk_freq,
      levels = 4:1,
      labels = c("daily", "weekly", "monthly", "rarely")
    ),
    tiktok = factor(
      tiktok,
      levels = 4:0,
      labels = c("daily", "weekly", "monthly", "rarely", "never")
    ),
    price_too_expensive = case_when(
      milk_brand == "Weihenstephan" ~ price_weihenstephan,
      milk_brand == "alpro" ~ price_alpro
    ),
    shops_discounter = shops_discounter == 1,
    shops_organic = shops_organic == 1,
    rated_brand = if_else(rated_brand == "Berchtesgardener Land", "Berchtesgadener Land", rated_brand)
  ) |>
  select(
    id, age, gender, state, town_size, household_size, diet,
    organic_share, milk_freq, milk_brand, price_too_expensive,
    shops_discounter:tiktok
  )

write_csv(survey, file.path(dir, "milk_survey_compact.csv"))
saveRDS(survey, file.path(dir, "milk_survey_compact.rds"))
cat(nrow(survey), "rows,", ncol(survey), "columns
")
