// Writes the questions of a quiz from the question pools (Nicolas, 2026-11-09,
// 02 - Lehrinhalte/Fragenpools/Konzept.md). The pools lie in OneDrive, which
// the build on GitHub cannot reach, so this tool runs here and writes the body
// of de.md and en.md of every quiz whose lead file lists its questions:
//
//   questions: [hcs-001, hcs-002, …]
//
// The front matter and any text before the first question stay as they are;
// the questions themselves come from the pool, in the order of the list, so
// that a question is changed in the pool and nowhere else. A question that is
// not public (`public: true`), is an exam variant or is retired is refused, since
// it must never reach the site. When a body changes, the lead's `updated` and
// the translation's `based_on` become today.
//
// Usage: node scripts/pool-to-quiz.mjs [--check] [--pools <folder>] [quiz-id …]
//   --check   only report which quizzes differ from the pool; exit code 1 if any
//   --pools   the folder holding the pools (default: Fragenpools in OneDrive, or HOCS_POOLS)
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { SEVERAL_SENTENCE } from '../src/build/quiz-json.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = join(ROOT, 'knowledge', 'content');
const DEFAULT_POOLS = process.env.HOCS_POOLS ?? join(homedir(), 'OneDrive - HSOS', '01 - Hochschule', '02 - Lehrinhalte', 'Fragenpools');
const LANGS = ['de', 'en'];

// the sentence after a question with several answers; the pool says it with `type: multiple`
export const SEVERAL = { de: '(Mehrere richtige Antworten möglich.)', en: '(Several answers may be correct.)' };
// languages whose code on the page can run and is shown as a static box in a quiz
const STATIC = new Set(['python', 'r']);

const oneLine = (text) => String(text).trim().replace(/\s*\n\s*/g, ' ');
// the local date, since a quiz changed shortly after midnight is changed today
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Every question of every pool below `folder`, by id: { question, pool }. */
export function loadPools(folder) {
  const questions = new Map();
  for (const name of readdirSync(folder, { withFileTypes: true })) {
    const pool = join(folder, name.name);
    if (!name.isDirectory() || !existsSync(join(pool, 'pool.toml'))) continue;
    const dir = join(pool, 'questions');
    for (const concept of readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory())) {
      for (const file of readdirSync(join(dir, concept.name)).filter((f) => f.endsWith('.yaml'))) {
        const question = yaml.load(readFileSync(join(dir, concept.name, file), 'utf8'));
        if (questions.has(question.id)) throw new Error(`question ${question.id} is in two pools: ${questions.get(question.id).pool} and ${pool}`);
        questions.set(question.id, { question, pool });
      }
    }
  }
  return questions;
}

/** Why a question may not go onto the site, or null. */
export function refusal(q) {
  if (q.public !== true) return `${q.id} is not public (public: ${q.public}); questions only for exams stay in the pool`;
  if (q.variant_of) return `${q.id} is an exam variant of ${q.variant_of}`;
  if (q.status === 'retired') return `${q.id} is retired`;
  if (!['single', 'multiple'].includes(q.type)) return `${q.id} has type ${q.type}; a quiz only takes single and multiple`;
  return null;
}

/** The images of a question: [{ name, file }] with the file in the pool. */
function imagesOf(q, pool) {
  const names = q.images ?? (q.image ? [q.image] : []);
  return names.map((name) => {
    const ext = ['.svg', '.png', '.jpg'].find((e) => existsSync(join(pool, 'images', name + e)));
    if (!ext) throw new Error(`${q.id}: image ${name} is missing in ${join(pool, 'images')}`);
    return { name: name + ext, file: join(pool, 'images', name + ext) };
  });
}

/** One question of the pool as Markdown of a quiz body (docs/knowledge-schema.md, section 7). */
export function questionMarkdown(q, lang, images = []) {
  const need = (field, value) => {
    if (value === undefined || value === null || value === '') throw new Error(`${q.id}: ${field} has no ${lang} text`);
    return value;
  };
  // some imported stems still end in the sentence on several answers; it is added once, from the type
  const stem = String(need('stem', q.stem?.[lang])).replace(new RegExp(SEVERAL_SENTENCE.source, 'gi'), '').trim();
  const [first, ...rest] = stem.split(/\n\s*\n/);
  const heading = [oneLine(first), q.type === 'multiple' ? SEVERAL[lang] : null, `{#${q.id}}`].filter(Boolean).join(' ');
  const out = [`## ${heading}`, ''];
  for (const paragraph of rest) out.push(oneLine(paragraph), '');
  for (const image of images) out.push(`![](media/${image.name})`, '');
  if (q.code) {
    const code = typeof q.code === 'string' ? q.code : need('code', q.code[lang]);
    const language = q.code_language ?? 'python';
    out.push(`\`\`\`${language}${STATIC.has(language) ? ' static' : ''}`, code.replace(/\n+$/, ''), '```', '');
  }
  for (const option of q.options) {
    out.push(`- [${option.correct ? 'x' : ' '}] ${oneLine(need(`option ${option.id}`, option.text?.[lang]))}`);
    if (option.feedback?.[lang]) out.push(`  > ${oneLine(option.feedback[lang])}`);
  }
  if (q.takeaway?.[lang]) out.push('', `> ${oneLine(q.takeaway[lang])}`);
  return out.join('\n');
}

const FRONT = /^(---\r?\n[\s\S]*?\r?\n---\r?\n?)([\s\S]*)$/;

/** The quizzes that list their questions: [{ id, dir, lead, files: { lang: path } }]. */
function listedQuizzes() {
  const quizzes = [];
  for (const id of readdirSync(CONTENT)) {
    const dir = join(CONTENT, id);
    const files = Object.fromEntries(LANGS.filter((l) => existsSync(join(dir, `${l}.md`))).map((l) => [l, join(dir, `${l}.md`)]));
    const data = Object.fromEntries(Object.entries(files).map(([l, f]) => [l, yaml.load(readFileSync(f, 'utf8').match(FRONT)?.[1].replace(/^---|---\s*$/g, '') ?? '')]));
    const lead = Object.keys(data).find((l) => data[l] && !('translation_of' in data[l]));
    if (lead && data[lead].questions) quizzes.push({ id, dir, lead, list: data[lead].questions, files });
  }
  return quizzes;
}

/** Writes (or with `check`, compares) one quiz; returns true if its body differs from the pool. */
function syncQuiz(quiz, pool, { check }) {
  const chosen = quiz.list.map((id) => {
    const found = pool.get(id);
    if (!found) throw new Error(`${quiz.id}: question ${id} is in no pool`);
    const why = refusal(found.question);
    if (why) throw new Error(`${quiz.id}: ${why}`);
    return found;
  });
  const images = chosen.flatMap(({ question, pool: p }) => imagesOf(question, p));
  const texts = {};
  let differs = false;
  for (const [lang, path] of Object.entries(quiz.files)) {
    const text = readFileSync(path, 'utf8');
    const eol = text.includes('\r\n') ? '\r\n' : '\n';
    const [, front, body] = text.match(FRONT);
    const intro = body.split(/^## /m)[0].trim();
    const questions = chosen.map(({ question, pool: p }) => questionMarkdown(question, lang, imagesOf(question, p)));
    const fresh = `${[intro, ...questions].filter(Boolean).join('\n\n')}\n`.replace(/\n/g, eol);
    texts[lang] = { path, front, fresh, eol };
    if (fresh !== body.replace(/^\r?\n/, '')) differs = true;
  }
  if (!differs || check) return differs;
  for (const [lang, { path, front, fresh, eol }] of Object.entries(texts)) {
    const field = lang === quiz.lead ? 'updated' : 'based_on';
    const dated = front.replace(new RegExp(`^${field}: .*$`, 'm'), `${field}: ${today()}`);
    writeFileSync(path, `${dated}${eol}${fresh}`);
  }
  if (images.length) {
    mkdirSync(join(quiz.dir, 'media'), { recursive: true });
    for (const image of images) copyFileSync(image.file, join(quiz.dir, 'media', image.name));
  }
  return true;
}

function main() {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const at = args.indexOf('--pools');
  const folder = at >= 0 ? args[at + 1] : DEFAULT_POOLS;
  const only = args.filter((a, k) => !a.startsWith('--') && !(at >= 0 && k === at + 1));
  if (!existsSync(folder)) {
    console.error(`no pools at ${folder}; pass --pools <folder> or set HOCS_POOLS`);
    process.exit(1);
  }
  const pool = loadPools(folder);
  const quizzes = listedQuizzes().filter((q) => !only.length || only.includes(q.id));
  for (const id of only) if (!quizzes.some((q) => q.id === id)) throw new Error(`${id} is no quiz with a list of questions`);
  const changed = quizzes.filter((quiz) => syncQuiz(quiz, pool, { check }));
  const verb = check ? 'differs from the pool' : 'written from the pool';
  for (const quiz of changed) console.log(`${quiz.id}: ${verb} (${quiz.list.length} questions)`);
  console.log(`${quizzes.length} quizzes with a list, ${changed.length} ${check ? 'differ' : 'changed'}.`);
  if (check && changed.length) process.exit(1);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
