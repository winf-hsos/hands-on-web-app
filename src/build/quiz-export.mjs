// A quiz as files to download (Nicolas, 2026-11-03), to learn with outside the
// page: a CSV with one row per question, its options and a 0/1 mark for each
// correct one, and a text file Anki imports as cards with the question and the
// options on the front and the correct options with the explanation on the back.
import { plain } from './exercise-script.mjs';

const LABELS = {
  de: { number: 'nummer', question: 'frage', option: 'antwort', correct: 'richtig', reason: 'begruendung', explanation: 'erklaerung', front: 'Vorderseite', back: 'Rückseite' },
  en: { number: 'number', question: 'question', option: 'option', correct: 'correct', reason: 'reason', explanation: 'explanation', front: 'Front', back: 'Back' },
};
// German spreadsheets expect a semicolon, since the comma is their decimal mark
const SEPARATOR = { de: ';', en: ',' };

/**
 * The questions of a quiz body, as quiz() in build/remark-knowledge.mjs reads
 * them: each `##` section is one question, its task list the options, a
 * blockquote inside an option that option's reason and a blockquote after the
 * list the explanation. Text and code before the options belong to the question.
 */
export function quizQuestions(body) {
  return body
    .split(/^## /m)
    .slice(1)
    .map((block) => {
      const lines = block.split(/\r?\n/);
      const id = lines[0].match(/\{#([\w-]+)\}\s*$/)?.[1] ?? null;
      const question = { title: lines[0].replace(/\s*\{#[\w-]+\}\s*$/, '').trim(), text: [], code: [], options: [], explanation: [] };
      // the question below its heading as Markdown, paragraphs and code blocks in their order
      const parts = [];
      let paragraph = null;
      let option = null;
      for (let i = 1; i < lines.length; i += 1) {
        const line = lines[i];
        if (!line.trim()) {
          paragraph = null;
          continue;
        }
        const fence = line.match(/^\s*```\s*(\S*)/);
        if (fence) {
          const code = [];
          for (i += 1; i < lines.length && !/^\s*```/.test(lines[i]); i += 1) code.push(lines[i]);
          question.code.push(code.join('\n'));
          if (!question.options.length) parts.push(`\`\`\`${fence[1]}\n${code.join('\n')}\n\`\`\``);
          paragraph = null;
          continue;
        }
        if (!question.options.length && !/^[-*] \[[ xX]\]/.test(line) && !line.startsWith('>')) {
          if (paragraph === null) parts.push((paragraph = []));
          paragraph.push(line.trim());
        }
        const start = line.match(/^[-*] \[([ xX])\]\s+(.*)$/);
        if (start) {
          option = { text: [start[2]], correct: start[1] !== ' ', reason: [] };
          question.options.push(option);
        } else if (option && /^\s+>/.test(line)) option.reason.push(line.replace(/^\s+> ?/, ''));
        else if (option && /^\s+\S/.test(line)) (option.reason.length ? option.reason : option.text).push(line.trim());
        else if (line.startsWith('>')) {
          option = null;
          question.explanation.push(line.replace(/^> ?/, ''));
        } else (question.options.length ? question.explanation : question.text).push(line.trim());
      }
      const join = (parts) => parts.join(' ').replace(/\s+/g, ' ').trim();
      return {
        id,
        title: question.title,
        body: parts.map((p) => (Array.isArray(p) ? p.join(' ') : p)),
        text: join(question.text),
        code: question.code,
        options: question.options.map((o) => ({ text: join(o.text), correct: o.correct, reason: join(o.reason) })),
        explanation: join(question.explanation),
      };
    });
}

/** A line of Markdown as plain text for a spreadsheet: no marks, no backticks. */
const text = (line, titleOf) => plain(line, titleOf).replace(/`([^`]+)`/g, '$1');

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** A line of Markdown as HTML for a card, with its code marked as code. */
const card = (line, titleOf) =>
  escapeHtml(plain(line, titleOf))
    .replace(/`([^`]+)`/g, '<code>$1</code>');

/** One field of a CSV or of Anki's text format, quoted where it has to be. */
const field = (value, separator) => {
  const s = String(value);
  return new RegExp(`["\\n\\r${separator === '\t' ? '\\t' : separator}]`).test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** The question with its code below it, as one cell. */
const questionCell = (q, titleOf) => [text(q.title, titleOf), q.text && text(q.text, titleOf), ...q.code].filter(Boolean).join('\n\n');

/** The CSV of a quiz: { name, text }, with a byte order mark so that Excel reads UTF-8. */
export function quizCsv({ id, body, lang, titleOf = () => null }) {
  const questions = quizQuestions(body);
  const labels = LABELS[lang];
  const sep = SEPARATOR[lang];
  const most = Math.max(...questions.map((q) => q.options.length));
  const reasons = questions.some((q) => q.options.some((o) => o.reason));
  const head = [labels.number, labels.question];
  for (let n = 1; n <= most; n += 1) head.push(`${labels.option}_${n}`, `${labels.correct}_${n}`, ...(reasons ? [`${labels.reason}_${n}`] : []));
  head.push(labels.explanation);
  const rows = questions.map((q, k) => {
    const row = [k + 1, questionCell(q, titleOf)];
    for (let n = 0; n < most; n += 1) {
      const o = q.options[n];
      row.push(o ? text(o.text, titleOf) : '', o ? (o.correct ? 1 : 0) : '', ...(reasons ? [o ? text(o.reason, titleOf) : ''] : []));
    }
    row.push(text(q.explanation, titleOf));
    return row;
  });
  return { name: `${id}.csv`, text: `﻿${[head, ...rows].map((row) => row.map((v) => field(v, sep)).join(sep)).join('\r\n')}\r\n` };
}

/** The quiz as notes for Anki's text import: { name, text }, one card per question. */
export function quizAnki({ id, body, lang, titleOf = () => null }) {
  const labels = LABELS[lang];
  const pre = (code) => `<pre><code>${escapeHtml(code).replace(/\n/g, '<br>')}</code></pre>`;
  const cards = quizQuestions(body).map((q) => {
    const front = [
      `<p>${card(q.title, titleOf)}</p>`,
      q.text && `<p>${card(q.text, titleOf)}</p>`,
      ...q.code.map(pre),
      `<ol type=A>${q.options.map((o) => `<li>${card(o.text, titleOf)}</li>`).join('')}</ol>`,
    ];
    const back = [
      `<ul>${q.options
        .filter((o) => o.correct)
        .map((o) => `<li><b>${card(o.text, titleOf)}</b>${o.reason ? `<br>${card(o.reason, titleOf)}` : ''}</li>`)
        .join('')}</ul>`,
      q.explanation && `<p>${card(q.explanation, titleOf)}</p>`,
    ];
    return [front, back].map((side) => field(side.filter(Boolean).join(''), '\t')).join('\t');
  });
  const head = ['#separator:tab', '#html:true', `#tags:${id}`, `#columns:${labels.front}\t${labels.back}`];
  return { name: `${id}-anki.txt`, text: `${[...head, ...cards].join('\n')}\n` };
}
