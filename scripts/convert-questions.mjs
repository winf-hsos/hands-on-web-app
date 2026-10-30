// Converts questions from a question pool in the format of the skill
// multiple-choice-pruefung (one YAML file per question, German and English,
// a reason per option) into the body of a quiz item (docs/knowledge-schema.md,
// section 7). Prints the questions of one language, in the order given, so
// that they can be pasted into de.md and en.md and rewritten where needed.
// Questions that are not public (oeffentlich: false) are refused, since they
// belong to an exam.
//
// Usage: node scripts/convert-questions.mjs <pool-folder> <de|en> [id …]
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';

const [folder, lang, ...ids] = process.argv.slice(2);
if (!folder || !['de', 'en'].includes(lang)) {
  console.error('usage: node scripts/convert-questions.mjs <pool-folder> <de|en> [id …]');
  process.exit(1);
}

const files = readdirSync(folder).filter((f) => f.endsWith('.yaml')).sort();
const questions = files.map((f) => yaml.load(readFileSync(join(folder, f), 'utf8')));
const chosen = ids.length ? ids.map((id) => questions.find((q) => q.id === id) ?? fail(`no question ${id}`)) : questions;

function fail(message) {
  console.error(message);
  process.exit(1);
}

// a reason sits in the option as a blockquote, indented to belong to it
const quote = (text) => text.trim().split('\n').map((line) => `  > ${line}`.trimEnd()).join('\n');
const oneLine = (text) => text.trim().replace(/\s*\n\s*/g, ' ');

const out = [];
for (const q of chosen) {
  if (q.oeffentlich !== true) fail(`${q.id} is not public (oeffentlich: ${q.oeffentlich}); exam questions stay in the pool`);
  const right = [q.richtig].flat().map(String);
  out.push(`## ${oneLine(q.frage[lang])} {#${q.id}}`, '');
  for (const option of q.optionen) {
    out.push(`- [${right.includes(String(option.kennung)) ? 'x' : ' '}] ${oneLine(option.text[lang])}`);
    if (option.begruendung?.[lang]) out.push(quote(option.begruendung[lang]));
  }
  out.push('');
}
process.stdout.write(out.join('\n'));
