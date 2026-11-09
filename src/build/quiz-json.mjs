// Every quiz of the site as JSON (Nicolas, 2026-11-09; form agreed with
// Classroom Live, docs/knowledge-schema.md, section 7): `/quizzes.json` lists
// the quizzes, `/quizzes/<code>.json` holds one with its questions, so that the
// live quiz in Classroom Live can run a quiz of the platform in a session.
// Built from the same Markdown as the page, so the two never differ; only
// public questions reach the knowledge base (scripts/pool-to-quiz.mjs).
import { quizQuestions } from './quiz-export.mjs';
import { SITE_ORIGIN } from './exercise-script.mjs';
import { isoDay } from './i18n.mjs';

export const QUIZ_INDEX_FORMAT = 'hocs-quiz-index/1';
export const QUIZ_FORMAT = 'hocs-quiz/1';

// the sentence that says a question has several answers; in the JSON the type says it
export const SEVERAL_SENTENCE = /\s*\((?:Mehrere richtige Antworten möglich|Several answers may be correct|More than one answer may be correct|mehrere richtig|several are right|several correct)\.?\)/i;

/** Markdown for another program: wiki links as their titles, relative images and links as full addresses. */
function portable(markdown, pageUrl, titleOf) {
  return markdown
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, (_, id) => titleOf(id) ?? id)
    .replace(/(\]\()(?![a-z]+:|\/|#)([^)\s]+)/g, (_, open, path) => `${open}${SITE_ORIGIN}${pageUrl}${path}`)
    .replace(/(\]\()(\/[^)\s]*)/g, (_, open, path) => `${open}${SITE_ORIGIN}${path}`);
}

/**
 * One quiz as the object of `/quizzes/<code>.json`. `texts` holds, per language
 * of the quiz, { title, body, url } with the page address; `lead` is the
 * language whose marks of correct options count.
 */
export function quizJson({ doc, area, texts, lead, titleOf = () => null }) {
  const langs = Object.keys(texts);
  const parsed = Object.fromEntries(langs.map((lang) => [lang, quizQuestions(texts[lang].body)]));
  const count = parsed[lead].length;
  for (const lang of langs)
    if (parsed[lang].length !== count) throw new Error(`${doc.id}: ${lang} has ${parsed[lang].length} questions, ${lead} has ${count}`);
  const perLang = (pick) => {
    const out = {};
    for (const lang of langs) {
      const value = pick(lang);
      if (value) out[lang] = value;
    }
    return Object.keys(out).length ? out : undefined;
  };
  const questions = parsed[lead].map((q, n) => {
    const correct = q.options.map((o) => o.correct);
    const several = langs.some((lang) => SEVERAL_SENTENCE.test(parsed[lang][n].title));
    const stem = perLang((lang) => {
      const p = parsed[lang][n];
      return portable([p.title.replace(SEVERAL_SENTENCE, '').trim(), ...p.body].join('\n\n'), texts[lang].url, titleOf);
    });
    const options = q.options.map((o, k) => {
      const option = { key: String.fromCharCode(97 + k), text: perLang((lang) => portable(parsed[lang][n].options[k]?.text ?? '', texts[lang].url, titleOf)), correct: correct[k] };
      const reason = perLang((lang) => portable(parsed[lang][n].options[k]?.reason ?? '', texts[lang].url, titleOf));
      if (reason) option.reason = reason;
      return option;
    });
    const question = { id: q.id ?? `q${n + 1}`, type: several || correct.filter(Boolean).length > 1 ? 'multiple' : 'single', stem, options };
    const explanation = perLang((lang) => portable(parsed[lang][n].explanation, texts[lang].url, titleOf));
    if (explanation) question.explanation = explanation;
    return question;
  });
  return {
    format: QUIZ_FORMAT,
    code: doc.lead.code,
    slug: doc.id,
    area,
    status: doc.lead.status,
    title: perLang((lang) => texts[lang].title),
    updated: doc.lead.updated instanceof Date ? isoDay(doc.lead.updated) : String(doc.lead.updated),
    page: perLang((lang) => `${SITE_ORIGIN}${texts[lang].url}`),
    questions,
  };
}

/** The entry of one quiz in `/quizzes.json`. */
export function quizIndexEntry(quiz, doc, jsonUrl) {
  return {
    code: quiz.code,
    slug: quiz.slug,
    area: quiz.area,
    title: quiz.title,
    modules: doc.lead.modules ?? [],
    questions: quiz.questions.length,
    updated: quiz.updated,
    url: `${SITE_ORIGIN}${jsonUrl}`,
    page: quiz.page,
  };
}
