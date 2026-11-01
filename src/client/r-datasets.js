// The tables an R block can use by name, and the file in /media/datasets/
// each one is read from. r-engine.js loads them; the build reads their column
// names for the suggestions in the editor (complete.js).
export const DATASETS = { survey: 'milk_survey.csv', rewe: 'rewe_products.csv', monty_hall: 'lets_make_a_deal.csv' };

// Tables that come as a plain data.frame instead of a tibble: the Monty Hall
// project teaches base R, where `table[, 1]` gives a vector, not a table.
export const PLAIN = new Set(['monty_hall']);
