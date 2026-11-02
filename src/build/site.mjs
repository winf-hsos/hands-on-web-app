// The validated knowledge base as the templates need it, for one area of the
// site: lookups, the text of a doc in a language (with fallback), relations
// in both directions, durations and URLs. Lookups cover the whole knowledge
// base, lists only the area; a link to a doc of another area leads there.
import { renderMarkdown } from './markdown.mjs';
import { stepsOf, pathSteps, courseSteps } from './validate.mjs';
import { splitProject } from './project.mjs';
import { exerciseScript } from './exercise-script.mjs';
import { hasType } from './types.mjs';

// Courses are called modules on the site (Nicolas, 2026-11-01) and live under
// /modules/; the knowledge base keeps `courses`, since `module:` already names
// the module of the module handbook.
const SECTION_PATH = { content: 'items', paths: 'paths', courses: 'modules', projects: 'projects' };

/** The areas a doc belongs to; without `areas` it is Computer Science. */
export const areasOf = (doc) => doc.lead.areas ?? ['cs'];

// `base` is '' for the published site and '/drafts' for the one with drafts
// (build/drafts.mjs); `hidden` holds the drafts the published site leaves out.
// Without an area the site spans all of them, as the entrance needs it.
export function createSite({ vocabulary, sections, hidden = new Map() }, area, base = '') {
  /** Address of a page of this area: link('de', 'items') is /cs/de/items/. */
  const link = (lang, first, ...parts) => `${base}/${[area, lang, SECTION_PATH[first] ?? first, ...parts].filter(Boolean).join('/')}/`.replace(/\/+/g, '/');
  const inArea = (doc) => !area || areasOf(doc).includes(area);
  const item = new Map(sections.content.map((d) => [d.id, d]));
  const path = new Map(sections.paths.map((d) => [d.id, d]));
  const course = new Map(sections.courses.map((d) => [d.id, d]));
  const page = new Map(sections.pages.map((d) => [d.id, d]));
  const project = new Map(sections.projects.map((d) => [d.id, d]));
  const byId = new Map([...item, ...path, ...course, ...project]);

  const docUrl = (doc, lang) => `${base}/${area && inArea(doc) ? area : areasOf(doc)[0]}/${lang}/${SECTION_PATH[doc.section]}/${doc.id}/`;

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

  /** An exercise as a script with comments to download (build/exercise-script.mjs), or null. */
  const script = (doc, lang) => {
    if (!hasType(doc.lead, 'exercise')) return null;
    const text = localize(doc, lang);
    const titleOf = (id) => {
      const target = byId.get(id) ?? hidden.get(id);
      return target ? localize(target, lang).title : null;
    };
    return exerciseScript({ id: doc.id, title: text.title, body: text.file.body, lang, url: docUrl(doc, lang), titleOf });
  };

  /** Markdown written in `textLang`, with links pointing to pages in `lang`. */
  const markdown = (md, lang, textLang = lang, quiz = false, sourceMap = false) =>
    renderMarkdown(md, {
      lang: textLang,
      quiz,
      sourceMap,
      resolve: (id) => {
        const target = byId.get(id);
        if (target) return { url: docUrl(target, lang), title: localize(target, lang).title };
        // a draft on the published site: its text without the link
        return hidden.has(id) ? { url: null, title: localize(hidden.get(id), lang).title } : null;
      },
    });

  const rendered = new Map();
  function body(doc, lang) {
    const text = localize(doc, lang);
    const key = `${doc.section}/${doc.id}/${text.lang}/${lang}`;
    // on the site with drafts the blocks carry their place in the source, for the editor
    if (!rendered.has(key)) rendered.set(key, markdown(text.file.body, lang, text.lang, hasType(doc.lead, 'quiz'), base !== ''));
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
      const minutes = item.get(s.id).lead.duration ?? 0;
      if (s.optional) optional += minutes;
      else required += minutes;
    }
    return { required, optional };
  }

  /** The project text in `lang`, cut into intro, sections, phases and challenges. */
  const projectText = (doc, lang) => splitProject(localize(doc, lang).file.body);

  /** Where an item is linked in projects: [{ project, anchor, title }]. */
  function inProjects(itemId, lang) {
    const refs = [];
    for (const doc of sections.projects) {
      const text = projectText(doc, lang);
      doc.lead.phases.forEach((phase, p) => {
        if (phase.challenge === itemId || (phase.items ?? []).includes(itemId)) refs.push({ project: doc, anchor: phase.id, title: text.phases[p].title });
        (phase.challenges ?? []).forEach((challenge, c) => {
          if ((challenge.items ?? []).includes(itemId))
            refs.push({ project: doc, anchor: challenge.id, title: text.phases[p].challenges[c].title });
        });
      });
    }
    return refs;
  }

  return {
    vocabulary,
    area,
    base,
    drafts: base !== '',
    link,
    home: sections.pages.find((p) => p.lead.area === area),
    items: sections.content.filter(inArea),
    // the content shown in the list of all items and on the map; an item that
    // belongs to one project (`project:`) is found there and in search only
    listed: sections.content.filter((d) => inArea(d) && !d.lead.project),
    paths: sections.paths.filter(inArea),
    courses: sections.courses.filter(inArea),
    projects: sections.projects.filter(inArea),
    project,
    item,
    path,
    course,
    page,
    url: docUrl,
    localize,
    body,
    markdown,
    script,
    projectText,
    inProjects,
    relations,
    duration,
    steps: stepsOf,
    pathSteps: (doc) => pathSteps(doc.lead),
    courseSteps: (doc) => courseSteps(doc.lead, path),
  };
}
