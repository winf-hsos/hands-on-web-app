// Material embedded in a lesson: the embed lines, their check, and the page.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { splitEmbeds, embedsIn } from '../src/build/embed.mjs';
import { loadKnowledge } from '../src/build/load.mjs';
import { validate } from '../src/build/validate.mjs';
import { createSite } from '../src/build/site.mjs';
import { item as itemPage } from '../src/templates/pages.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'knowledge');

function check(change = () => {}) {
  const knowledge = loadKnowledge(ROOT);
  const find = (id) => knowledge.sections.content.find((d) => d.id === id);
  change(find);
  return { ...validate(knowledge), knowledge };
}

test('a body is cut at its embed lines, and each text part keeps its place in the source', () => {
  const body = 'Intro.\n\n![Folien](item:some-slides)\n\nMiddle text.\n![Quiz](item:some-quiz)\n';
  const parts = splitEmbeds(body);
  assert.deepEqual(
    parts.map((p) => p.embed ?? 'text'),
    ['text', 'some-slides', 'text', 'some-quiz'],
  );
  for (const part of parts.filter((p) => p.md)) assert.equal(body.slice(part.offset, part.offset + part.md.length), part.md);
  assert.deepEqual(embedsIn(body), ['some-slides', 'some-quiz']);
});

test('an embed line in fenced code, or one with text around it, stays text', () => {
  const body = '```markdown\n![Folien](item:some-slides)\n```\n\nSee ![this](item:other) inline.\n';
  assert.deepEqual(embedsIn(body), []);
  assert.equal(splitEmbeds(body).length, 1);
});

test('an embed must name an existing item that is not a lesson, the same in every language', () => {
  const unknown = check((find) => (find('symbols-and-information').files.en.body += '\n![x](item:nowhere)\n'));
  assert.ok(unknown.errors.includes('content/symbols-and-information/en.md: embeds unknown item ![…](item:nowhere)'));
  assert.ok(unknown.errors.some((e) => /^content\/symbols-and-information\/de\.md: embeds .*every language embeds the same material/.test(e)));
  const lesson = check((find) => {
    for (const file of Object.values(find('symbols-and-information').files)) file.body += '\n![x](item:analog-and-digital)\n';
  });
  assert.ok(lesson.errors.some((e) => e.includes('embeds the lesson "analog-and-digital"')));
});

test('material in a lesson has no objectives of its own; a warning says so', () => {
  const { errors, warnings } = check((find) => {
    find('question-game').files.de.data.objectives = { intro: 'Danach kannst du:', goals: ['etwas'] };
  });
  assert.deepEqual(errors, []);
  assert.ok(warnings.includes('content/question-game/de.md: has objectives, but is material of a lesson, whose objectives count'));
});

test('a lesson page shows its material in place, and the material names its lesson', () => {
  const { knowledge } = check();
  const site = createSite(knowledge, 'cs');
  const lesson = String(itemPage(site, site.item.get('symbols-and-information'), 'de').content);
  const order = ['symbols-and-information-slides', 'question-game', 'symbols-and-information-quiz'].map((id) => lesson.indexOf(`data-embedded="${id}"`));
  assert.ok(order.every((at, i) => at > 0 && (i === 0 || at > order[i - 1])), `embeds in order: ${order}`);
  assert.match(lesson, /data-quiz-id="symbols-and-information-quiz"/);
  assert.match(lesson, /data-mark-also="symbols-and-information-slides question-game"/);
  assert.doesNotMatch(lesson.slice(lesson.indexOf('data-embedded="question-game"')), /<strong>Ziel:<\/strong>/);
  const material = String(itemPage(site, site.item.get('question-game'), 'de').content);
  assert.match(material, /class="before in-lessons">Teil der Lektion <a href="\/cs\/de\/items\/symbols-and-information\/">/);
});
