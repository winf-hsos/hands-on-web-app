// The validated knowledge base as the templates need it: lookups, the text
// of a doc in a language (with fallback), relations in both directions,
// durations and URLs.
import { renderMarkdown } from './markdown.mjs';
import { stepsOf } from './validate.mjs';

export const url = (lang, ...parts) => `/${[lang, ...parts].join('/')}/`.replace(/\/+/g, '/');

const SECTION_PATH = { content: 'items', paths: 'paths', courses: 'courses' };

export function createSite({ vocabulary, sections }) {
  const item = new Map(sections.content.map((d) => [d.id, d]));
  const path = new Map(sections.paths.map((d) => [d.id, d]));
  const course = new Map(sections.courses.map((d) => [d.id, d]));
  const page = new Map(sections.pages.map((d) => [d.id, d]));
  const byId = new Map([...item, ...path, ...course]);

  const docUrl = (doc, lang) => url(lang, SECTION_PATH[doc.section], doc.id);

  function localize(doc, lang) {
    const own = doc.files[lang];
    const file = own ?? doc.files[doc.leadLang];
    return {
      lang: file.lang,
      missing: !own,
      stale: !!own?.data.based_on && own.data.based_on < doc.lead.updated,
      title: file.data.title,
      summary: file.data.summary,
      data: file.data,
      file,
    };
  }

  const rendered = new Map();
  function body(doc, lang) {
    const text = localize(doc, lang);
    const key = `${doc.section}/${doc.id}/${text.lang}/${lang}`;
    if (!rendered.has(key)) {
      rendered.set(
        key,
        renderMarkdown(text.file.body, {
          lang: text.lang,
          quiz: doc.lead.type === 'quiz',
          resolve: (id) => {
            const target = byId.get(id);
            return target ? { url: docUrl(target, lang), title: localize(target, lang).title } : null;
          },
        }),
      );
    }
    return rendered.get(key);
  }

  /** Outgoing relations and the computed inverse ones. */
  function relations(doc, lang) {
    const groups = new Map();
    const add = (key, label, target) => {
      const group = groups.get(key) ?? { key, label, items: [] };
      if (!group.items.includes(target)) group.items.push(target);
      groups.set(key, group);
    };
    for (const [rel, targets] of Object.entries(doc.lead.relations ?? {})) {
      for (const target of targets) add(rel, vocabulary.relations[rel][lang], item.get(target));
    }
    for (const other of sections.content) {
      for (const [rel, targets] of Object.entries(other.lead.relations ?? {})) {
        if (!targets.includes(doc.id)) continue;
        const def = vocabulary.relations[rel];
        if (def.symmetric) add(rel, def[lang], other);
        else add(`${rel}:inverse`, def.inverse?.[lang] ?? def[lang], other);
      }
    }
    const all = [...groups.values()];
    return {
      before: all.find((g) => g.key === 'requires')?.items ?? [],
      after: all.find((g) => g.key === 'requires:inverse')?.items ?? [],
      other: all.filter((g) => g.key !== 'requires' && g.key !== 'requires:inverse'),
    };
  }

  function duration(steps) {
    let required = 0;
    let optional = 0;
    for (const s of steps) {
      const minutes = item.get(s.id).lead.duration;
      if (s.optional) optional += minutes;
      else required += minutes;
    }
    return { required, optional };
  }

  const topicColor = (doc) => `#${vocabulary.topics[doc.lead.topics[0]].color ?? '009EE3'}`;

  return {
    vocabulary,
    items: sections.content,
    paths: sections.paths,
    courses: sections.courses,
    item,
    path,
    course,
    page,
    url: docUrl,
    localize,
    body,
    relations,
    duration,
    steps: stepsOf,
    topicColor,
  };
}
