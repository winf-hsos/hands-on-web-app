import { test } from 'node:test';
import assert from 'node:assert/strict';
import { questionMarkdown, refusal } from '../scripts/pool-to-quiz.mjs';
import { quizJson } from '../src/build/quiz-json.mjs';
import { quizQuestions } from '../src/build/quiz-export.mjs';

const question = {
  id: 'hcs-099',
  type: 'multiple',
  public: true,
  status: 'draft',
  stem: { de: 'Welche Werte gibt es? (Mehrere richtige Antworten möglich.)\n\nDas Programm:\n', en: 'Which values are there?\n\nThe program:\n' },
  code: { de: 'print("kalt")\n', en: 'print("cold")\n' },
  code_language: 'python',
  options: [
    { id: 'a', correct: true, text: { de: '`1`', en: '`1`' }, feedback: { de: 'Ja.', en: 'Yes.' } },
    { id: 'b', correct: true, text: { de: '`2`', en: '`2`' } },
    { id: 'c', correct: false, text: { de: '`3`', en: '`3`' }, feedback: { de: 'Nein.', en: 'No.' } },
  ],
  takeaway: { de: 'Merksatz.', en: 'Takeaway.' },
};

test('a pool question becomes a quiz question with its id, code, reasons and takeaway', () => {
  const md = questionMarkdown(question, 'de');
  assert.equal(
    md,
    [
      '## Welche Werte gibt es? (Mehrere richtige Antworten möglich.) {#hcs-099}',
      '',
      'Das Programm:',
      '',
      '```python static',
      'print("kalt")',
      '```',
      '',
      '- [x] `1`',
      '  > Ja.',
      '- [x] `2`',
      '- [ ] `3`',
      '  > Nein.',
      '',
      '> Merksatz.',
    ].join('\n'),
  );
  assert.match(questionMarkdown(question, 'en'), /^## Which values are there\? \(Several answers may be correct\.\) \{#hcs-099\}/);
});

test('questions that must not reach the site are refused', () => {
  assert.equal(refusal(question), null);
  assert.match(refusal({ ...question, public: false }), /not public/);
  assert.match(refusal({ ...question, variant_of: 'hcs-001' }), /exam variant/);
  assert.match(refusal({ ...question, status: 'retired' }), /retired/);
});

test('a quiz becomes JSON for the live quiz, without the sentence on several answers', () => {
  const doc = { id: 'demo-quiz', leadLang: 'de', lead: { code: 1234, status: 'published', updated: new Date('2026-11-09'), modules: ['dup'] } };
  const texts = {
    de: { title: 'Quiz: Demo', body: questionMarkdown(question, 'de'), url: '/cs/de/items/demo-quiz/' },
    en: { title: 'Quiz: Demo', body: questionMarkdown(question, 'en'), url: '/cs/en/items/demo-quiz/' },
  };
  const quiz = quizJson({ doc, area: 'cs', texts, lead: 'de' });
  assert.equal(quiz.format, 'hocs-quiz/1');
  assert.equal(quiz.updated, '2026-11-09');
  assert.equal(quiz.page.en, 'https://hands-on-computer-science.de/cs/en/items/demo-quiz/');
  const [q] = quiz.questions;
  assert.equal(q.id, 'hcs-099');
  assert.equal(q.type, 'multiple');
  assert.equal(q.stem.de, 'Welche Werte gibt es?\n\nDas Programm:\n\n```python\nprint("kalt")\n```');
  assert.deepEqual(q.options.map((o) => [o.key, o.correct, o.reason?.en]), [['a', true, 'Yes.'], ['b', true, undefined], ['c', false, 'No.']]);
  assert.deepEqual(q.explanation, { de: 'Merksatz.', en: 'Takeaway.' });
});

test('the questions of a quiz body keep their ids and their text in order', () => {
  const [q] = quizQuestions(questionMarkdown(question, 'de'));
  assert.equal(q.id, 'hcs-099');
  assert.deepEqual(q.body, ['Das Programm:', '```python\nprint("kalt")\n```']);
});
