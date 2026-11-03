import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quizAnki, quizCsv, quizQuestions } from '../src/build/quiz-export.mjs';

const body = `
Vorweg ein Satz, der zu keiner Frage gehört.

## Welcher Ordner, siehe [[files-and-folders]]? {#folder}

\`\`\`text
C:\\Users\\anna\\uni
\`\`\`

- [ ] \`anna\`
- [x] \`uni\`, der letzte
  Ordner
  > Der Teil vor dem Dateinamen.

> Ein **Pfad** liest sich von links nach rechts.

## Welche sind absolut? (mehrere richtig)

- [x] \`C:\\\`
- [x] \`/\`
- [ ] \`..\`; "relativ"
`;

const titleOf = (id) => (id === 'files-and-folders' ? 'Dateien und Ordner' : null);

test('a quiz body becomes questions with options, reasons and explanation', () => {
  const [first, second] = quizQuestions(body);
  assert.equal(first.title, 'Welcher Ordner, siehe [[files-and-folders]]?');
  assert.deepEqual(first.code, ['C:\\Users\\anna\\uni']);
  assert.deepEqual(first.options, [
    { text: '`anna`', correct: false, reason: '' },
    { text: '`uni`, der letzte Ordner', correct: true, reason: 'Der Teil vor dem Dateinamen.' },
  ]);
  assert.equal(first.explanation, 'Ein **Pfad** liest sich von links nach rechts.');
  assert.deepEqual(
    second.options.map((o) => o.correct),
    [true, true, false],
  );
});

test('the CSV has one row per question and a 0/1 mark per option', () => {
  const { name, text } = quizCsv({ id: 'paths-quiz', body, lang: 'de', titleOf });
  assert.equal(name, 'paths-quiz.csv');
  assert.ok(text.startsWith('\uFEFF'));
  const lines = text.slice(1).split('\r\n');
  assert.equal(
    lines[0],
    'nummer;frage;antwort_1;richtig_1;begruendung_1;antwort_2;richtig_2;begruendung_2;antwort_3;richtig_3;begruendung_3;erklaerung',
  );
  // a line break inside a cell stays a plain \n in its quotes
  assert.equal(
    lines[1],
    '1;"Welcher Ordner, siehe Dateien und Ordner?\n\nC:\\Users\\anna\\uni";anna;0;;uni, der letzte Ordner;1;Der Teil vor dem Dateinamen.;;;;Ein Pfad liest sich von links nach rechts.',
  );
  assert.equal(lines[2], '2;Welche sind absolut? (mehrere richtig);C:\\;1;;/;1;;"..; ""relativ""";0;;');
  assert.equal(quizCsv({ id: 'q', body, lang: 'en' }).text.split('\r\n')[0], '\uFEFFnumber,question,option_1,correct_1,reason_1,option_2,correct_2,reason_2,option_3,correct_3,reason_3,explanation');
});

test('the Anki file has the options on the front and the correct ones on the back', () => {
  const { name, text } = quizAnki({ id: 'paths-quiz', body, lang: 'de', titleOf });
  assert.equal(name, 'paths-quiz-anki.txt');
  const lines = text.trimEnd().split('\n');
  assert.deepEqual(lines.slice(0, 4), ['#separator:tab', '#html:true', '#tags:paths-quiz', '#columns:Vorderseite\tRückseite']);
  assert.equal(lines.length, 6);
  const [front, back] = lines[4].split('\t');
  assert.equal(
    front,
    '<p>Welcher Ordner, siehe Dateien und Ordner?</p><pre><code>C:\\Users\\anna\\uni</code></pre><ol type=A><li><code>anna</code></li><li><code>uni</code>, der letzte Ordner</li></ol>',
  );
  assert.equal(back, '<ul><li><b><code>uni</code>, der letzte Ordner</b><br>Der Teil vor dem Dateinamen.</li></ul><p>Ein Pfad liest sich von links nach rechts.</p>');
  assert.match(lines[5], /^"<p>Welche sind absolut\?.*<li><code>\.\.<\/code>; ""relativ""<\/li>/);
});
