// Names of functions and packages are code wherever they stand on the site
// (Nicolas, 2026-10-30): select(), dplyr::filter(), df.query(), dplyr,
// ggplot2. codeParts() splits a plain text into pieces that are code and
// pieces that are not. The build applies it to every page it writes
// (build/code-terms.mjs); pages that draw titles in the browser use it
// themselves. Text in backticks counts as code as well, for titles and
// summaries, which are not Markdown.

// Packages the content talks about; a word in this list is always code. Only
// names that cannot be ordinary words: "base" or "stats" would be.
export const PACKAGES = [
  'dplyr', 'ggplot2', 'tidyverse', 'tidyr', 'readr', 'readxl', 'stringr', 'forcats', 'lubridate', 'purrr',
  'tibble', 'janitor', 'skimr', 'knitr', 'rmarkdown', 'shiny',
  'pandas', 'numpy', 'matplotlib', 'seaborn', 'scipy', 'polars',
];

// A call without arguments, optionally with its package (dplyr::filter()) or
// as a method (df.query()), or a package name. Not inside another word, a
// path or a URL; a hyphen after a package is allowed ("dplyr-Verben").
const TERM = new RegExp(
  String.raw`(?<![\w.$\/\-])(?:(?:[A-Za-z][\w.]*::)?[A-Za-z_][\w.]*\(\)|(?:${PACKAGES.join('|')})(?![\w\/]))`,
  'g',
);

/** Splits a text into [{ text, code }] pieces; empty input gives []. */
export function codeParts(text) {
  const parts = [];
  const push = (value, code) => {
    if (!value) return;
    const last = parts[parts.length - 1];
    if (last && last.code === code) last.text += value;
    else parts.push({ text: value, code });
  };
  String(text ?? '').split(/(`[^`]+`)/).forEach((piece) => {
    if (/^`[^`]+`$/.test(piece)) return push(piece.slice(1, -1), true);
    let last = 0;
    for (const match of piece.matchAll(TERM)) {
      push(piece.slice(last, match.index), false);
      push(match[0], true);
      last = match.index + match[0].length;
    }
    push(piece.slice(last), false);
  });
  return parts;
}

/** The text without backticks, for places that take no markup (a title attribute, say). */
export const plainText = (text) => String(text ?? '').replace(/`([^`]+)`/g, '$1');
