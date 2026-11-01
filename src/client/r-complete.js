// What the R editors suggest (complete.js shows it): columns of the table a
// pipe works on, names assigned in the block, the data sets, constants such
// as pi and TRUE, and the functions of the packages the page uses, or
// everything of a package after `package::` (r-context.js decides what fits).
import { suggest } from './r-context.js';

const { rCompletions } = document.body.dataset;
let data = null;

export const loadR = () => (data ??= fetch(rCompletions).then((r) => r.json()));

// base R always; dplyr and ggplot2 where the page or the block uses them
function packagesIn(text, functions) {
  return Object.keys(functions).filter(
    (group) => group === 'base' || functions[group].some(([name]) => new RegExp(`\\b${name.replace('.', '\\.')}\\(`).test(text)),
  );
}

export async function findR(editor, force) {
  const { functions, constants, tables } = await loadR();
  const pageCode = [...document.querySelectorAll('.runner[data-lang="r"] textarea')].map((t) => t.value).join('\n');
  const groups = packagesIn(pageCode, functions);
  // a table is offered by name only where the page uses it
  const offered = Object.keys(tables).filter((name) => new RegExp(`\\b${name}\\b`).test(pageCode));
  const known = Object.values(functions).flat();
  return suggest(editor.value, editor.selectionStart, { tables, functions: groups.flatMap((g) => functions[g]), known, constants, offered, force });
}
