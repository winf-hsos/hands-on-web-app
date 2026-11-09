import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exerciseScript, scriptLanguage, SITE_ORIGIN } from '../src/build/exercise-script.mjs';

const body = `
## Aufgabe

Rechne den Preis aus, siehe [[python-arithmetic|Rechnen]].

## So soll es aussehen

\`\`\`text
Preis: 12.5
\`\`\`

## Dein Programm

\`\`\`python
price = 10

# dein Code
\`\`\`

\`\`\`python
price = 10

# noch einmal
\`\`\`

> [!HINT]
> Multipliziere mit \`1.25\`.

> [!SOLUTION]
> \`\`\`python
> print(price * 1.25)
> \`\`\`
`;

const script = (source, lang = 'de') => exerciseScript({ id: 'tax', title: 'Übung: Steuer', body: source, lang, url: '/cs/de/items/tax/' });

test('an exercise becomes a script: task and hints as comments, code as code, no solution', () => {
  const { name, text } = script(body);
  assert.equal(name, 'tax.py');
  assert.ok(text.startsWith(`# Übung: Steuer\n# ${SITE_ORIGIN}/cs/de/items/tax/\n`));
  assert.match(text, /^# --- Aufgabe ---$/m);
  assert.match(text, /^# Rechne den Preis aus, siehe Rechnen\.$/m);
  assert.match(text, /^# {3}Preis: 12\.5$/m);
  assert.match(text, /^price = 10$/m);
  assert.match(text, /^# Tipp:\n# Multipliziere mit `1\.25`\.$/m);
  assert.doesNotMatch(text, /price \* 1\.25/);
});

test('the setup shared by several boxes appears only once', () => {
  const { text } = script(body);
  assert.equal(text.match(/^price = 10$/gm).length, 1);
  assert.match(text, /^# dein Code\n\n# noch einmal$/m);
});

test('an R script loads the packages and data sets its boxes use, from the site', () => {
  const { name, text } = script('```r\nsurvey |>\n  filter(age > 30)\n```\n', 'en');
  assert.equal(name, 'tax.R');
  assert.match(text, /^library\(dplyr\)$/m);
  assert.match(text, new RegExp(`^survey <- as_tibble\\(read\\.csv\\("${SITE_ORIGIN}/media/datasets/milk_survey_compact\\.csv"`, 'm'));
  assert.match(text, /^# The task and the hints are comments here/m);
});

test('exercises without Python or R boxes have no script', () => {
  assert.equal(scriptLanguage('```bash\nls\n```\n> ```python\n> x\n> ```\n'), null);
  assert.equal(script('```bash\nls\n```\n'), null);
});
