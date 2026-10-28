// The tables an R block can use by name, and the file in /media/datasets/
// each one is read from. r-engine.js loads them; the build reads their column
// names for the suggestions in the editor (r-complete.js).
export const DATASETS = { survey: 'milk_survey.csv', rewe: 'rewe_products.csv' };
