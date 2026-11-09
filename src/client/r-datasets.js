// The tables an R block can use by name, and the file in /media/datasets/
// each one is read from. r-engine.js loads them; the build reads their column
// names for the suggestions in the editor (complete.js).
export const DATASETS = { survey: 'milk_survey_compact.csv', rewe: 'rewe_products.csv', monty_hall: 'lets_make_a_deal.csv', corpus: 'farm_corpus.csv', tokens: 'farm_corpus_tokens.csv', cards: 'meaning_cards.csv', vectors: 'meaning_vectors.csv', word_vectors: 'word_vectors.csv' };

// Tables that come as a plain data.frame instead of a tibble. None at the
// moment: the Monty Hall project, which taught base R with them, now works
// with tibbles too.
export const PLAIN = new Set();
