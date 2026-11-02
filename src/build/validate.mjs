// The rules of docs/knowledge-schema.md as code. Every rule that fails adds
// a line naming file and field; the build stops if there is any error and
// prints warnings without stopping. Each doc gets `lead` and `leadLang`.

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { iconExists } from './icons.mjs';
import { splitProject } from './project.mjs';
import { deckFile } from './deck.mjs';
import { datasetInfo } from './dataset.mjs';
import { figureFile, figureRefs, figureRules, FIGURE_FILE } from './figures.mjs';
import { shellScenario } from './remark-knowledge.mjs';
import { scenarioProblems } from '../client/shell-model.js';

const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// --- field checks: each returns an error message or nothing --------------

const text = (v) => (typeof v === 'string' && v.trim() ? null : 'expected text');
const date = (v) => (v instanceof Date && !isNaN(v) ? null : 'expected a date like 2026-10-21');
const bool = (v) => (typeof v === 'boolean' ? null : 'expected true or false');
const int = (min, max) => (v) =>
  Number.isInteger(v) && v >= min && v <= max ? null : `expected a whole number from ${min} to ${max}`;
const id = (v) => (typeof v === 'string' && ID.test(v) ? null : `"${v}" is not an id (kebab case, like place-value-systems)`);
const oneOf = (keys, what) => (v) => (keys.includes(v) ? null : `"${v}" is not a known ${what} (${keys.join(', ')})`);
const list = (check, min = 0) => (v) => {
  if (!Array.isArray(v)) return 'expected a list';
  if (v.length < min) return `expected at least ${min} entr${min === 1 ? 'y' : 'ies'}`;
  return v.map(check).find(Boolean) ?? null;
};
// one entry or a list of them, as in `module: ea` or `module: [ea, wmg]`
const oneOrMore = (check) => (v) => (Array.isArray(v) ? list(check, 1)(v) : check(v));
const url = (v) => {
  try {
    new URL(v);
    return null;
  } catch {
    return 'expected a full URL';
  }
};
// what a learner takes away: a sentence that leads into a list of goals (Nicolas, 2026-11-01)
const objectives = (v) => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return 'expected intro and goals';
  const extra = Object.keys(v).find((k) => !['intro', 'goals'].includes(k));
  if (extra) return `unknown field ${extra} (allowed: intro, goals)`;
  const intro = text(v.intro);
  if (intro) return `intro: ${intro}`;
  const goals = list(text, 1)(v.goals);
  return goals ? `goals: ${goals}` : null;
};
const step = (v) =>
  typeof v === 'string'
    ? id(v)
    : v && typeof v === 'object' && !Array.isArray(v)
      ? id(v.item) ?? (v.optional === undefined ? null : bool(v.optional)) ??
        (Object.keys(v).every((k) => k === 'item' || k === 'optional') ? null : 'a step has only item and optional')
      : 'expected an id or { item, optional }';
const label = (v) =>
  v && typeof v === 'object' && !text(v.de) && !text(v.en) ? null : 'expected { de: …, en: … }';

function shapes(vocabulary) {
  const types = Object.keys(vocabulary.types ?? {});
  const topics = Object.keys(vocabulary.topics ?? {});
  const modules = Object.keys(vocabulary.modules ?? {});
  const institutions = Object.keys(vocabulary.institutions ?? {});
  const areas = Object.keys(vocabulary.areas ?? {});
  const inAreas = list(oneOf(areas, 'area'), 1);
  const relationKeys = Object.keys(vocabulary.relations ?? {});
  const relations = (v) => {
    if (!v || typeof v !== 'object' || Array.isArray(v)) return 'expected relation: [ids]';
    for (const [key, targets] of Object.entries(v)) {
      if (!relationKeys.includes(key)) return `"${key}" is not a known relation (${relationKeys.join(', ')})`;
      const problem = list(id)(targets);
      if (problem) return `${key}: ${problem}`;
    }
    return null;
  };
  const status = oneOf(['draft', 'published', 'archived'], 'status');
  // A recording of one part of a slide deck, on YouTube.
  const recording = (v) => {
    if (!v || typeof v !== 'object' || Array.isArray(v)) return 'expected { title, url }';
    const extra = Object.keys(v).find((k) => !['title', 'url', 'slide'].includes(k));
    if (extra) return `unknown field ${extra} (allowed: title, url, slide)`;
    if (text(v.title)) return `title: ${text(v.title)}`;
    if (url(v.url) || !/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(v.url)) return 'url: expected a YouTube link (https://www.youtube.com/… or https://youtu.be/…)';
    return v.slide === undefined ? null : int(1, 999)(v.slide);
  };
  // A section of a course (a "Modul" on the site): a heading in both languages
  // and its items, a whole learning path, which brings its own title and
  // steps, or a project with its phases. Sections have no release dates;
  // everything is always available (Nicolas, 2026-10-26).
  const courseSection = (v) => {
    if (!v || typeof v !== 'object' || Array.isArray(v)) return 'expected { title, items }, { path } or { project }';
    for (const key of ['path', 'project']) {
      if (!(key in v)) continue;
      const extra = Object.keys(v).find((k) => k !== key);
      if (extra) return `unknown field ${extra} (a section with a ${key} has nothing else)`;
      return id(v[key]) && `${key}: ${id(v[key])}`;
    }
    const extra = Object.keys(v).find((k) => !['title', 'items'].includes(k));
    if (extra) return `unknown field ${extra} (allowed: title, items, or path or project alone)`;
    return (label(v.title) && `title: ${label(v.title)}`) ?? (list(step, 1)(v.items) && `items: ${list(step, 1)(v.items)}`) ?? null;
  };
  // A part of a learning path: a heading in both languages and its steps.
  const pathSection = (v) => {
    if (!v || typeof v !== 'object' || Array.isArray(v)) return 'expected { title, steps }';
    const extra = Object.keys(v).find((k) => !['title', 'steps'].includes(k));
    if (extra) return `unknown field ${extra} (allowed: title, steps)`;
    return (label(v.title) && `title: ${label(v.title)}`) ?? (list(step, 1)(v.steps) && `steps: ${list(step, 1)(v.steps)}`) ?? null;
  };
  const part = (allowed) => (v) => {
    if (!v || typeof v !== 'object' || Array.isArray(v)) return `expected { ${allowed.join(', ')} }`;
    const extra = Object.keys(v).find((k) => !allowed.includes(k));
    if (extra) return `unknown field ${extra} (allowed: ${allowed.join(', ')})`;
    return id(v.id) ?? (v.items === undefined ? null : list(id)(v.items));
  };
  const challenge = part(['id', 'items']);
  const phase = (v) =>
    part(['id', 'challenge', 'items', 'challenges'])(v) ??
    (v.challenge === undefined ? null : id(v.challenge) && `challenge: ${id(v.challenge)}`) ??
    (v.challenges === undefined ? null : list(challenge)(v.challenges));
  const translation = {
    required: { title: text, summary: text, translation_of: oneOf(['de', 'en'], 'language'), based_on: date },
    optional: {},
  };
  return {
    content: {
      lead: {
        required: {
          type: oneOf(types, 'type'),
          code: int(1000, 9999),
          title: text,
          summary: text,
          level: int(1, 4),
          topics: list(oneOf(topics, 'topic'), 1),
          status,
          updated: date,
        },
        optional: {
          duration: int(1, 600),
          modules: list(oneOf(modules, 'module')),
          relations,
          access: oneOf(['public', 'code'], 'access'),
          url,
          buy: url,
          isbn: (v) => (typeof v === 'string' && /^(\d{9}[\dX]|97[89]\d{10})$/.test(v.replace(/-/g, '')) ? null : 'expected an ISBN like 978-0-13-790910-0'),
          license: text,
          authors: list(text, 1),
          year: int(1000, 2100),
          doi: text,
          publisher: text,
          venue: text,
          when: text,
          born: int(1000, 2100),
          died: int(1000, 2100),
          deck_lang: oneOf(['de', 'en'], 'language'),
          recordings: list(recording, 1),
          file: text,
          areas: inAreas,
          objectives,
          project: id,
        },
      },
      translation: { required: translation.required, optional: { objectives } },
    },
    paths: {
      lead: {
        required: {
          kind: oneOf(['path'], 'kind'),
          code: int(1000, 9999),
          title: text,
          summary: text,
          goal: text,
          audience: text,
          level: int(1, 4),
          status,
          updated: date,
        },
        // either a flat list of steps or parts with headings, see pathSteps
        optional: { requires: list(id), steps: list(step, 1), sections: list(pathSection, 1), areas: inAreas },
      },
      translation: { required: { ...translation.required, goal: text, audience: text }, optional: {} },
    },
    courses: {
      lead: {
        required: {
          kind: oneOf(['course'], 'kind'),
          code: int(1000, 9999),
          // the module or modules the course belongs to; their descriptions come from vocabulary.yaml
          module: oneOrMore(oneOf(modules, 'module')),
          title: text,
          summary: text,
          // may be empty while the content of a new course is being written
          sections: list(courseSection),
          status,
          updated: date,
        },
        // a subtitle and where the course is taught
        // access codes are not used for now, courses are listed under "Kurse" (Nicolas, 2026-11-01)
        optional: {
          subtitle: text,
          institution: oneOf(institutions, 'institution'),
          areas: inAreas,
          // earlier ids; their addresses lead to the course (scripts/build.mjs)
          formerly: list(id),
          access_code: (v) => (typeof v === 'string' && /^[A-Z0-9-]{4,16}$/.test(v) ? null : 'expected upper case letters, digits and hyphens'),
        },
      },
      translation: { required: translation.required, optional: { subtitle: text } },
    },
    projects: {
      lead: {
        required: {
          kind: oneOf(['project'], 'kind'),
          code: int(1000, 9999),
          title: text,
          summary: text,
          level: int(1, 4),
          phases: list(phase, 1),
          status,
          updated: date,
        },
        // projects have no topics (Nicolas, 2026-11-01); an old `topics` line
        // is ignored with a warning instead of breaking the build
        optional: { modules: list(oneOf(modules, 'module')), items: list(id), areas: inAreas, topics: () => null },
      },
      translation,
    },
    pages: {
      lead: {
        required: { kind: oneOf(['page'], 'kind'), title: text, summary: text, updated: date },
        // a page with `area` is the start page of that area
        optional: { featured_path: id, samples: list(id), area: oneOf(areas, 'area') },
      },
      translation,
    },
  };
}

function checkFields(data, shape, where, errors) {
  for (const [field, check] of Object.entries(shape.required)) {
    if (data[field] === undefined || data[field] === null) errors.push(`${where}: ${field} is missing`);
    else {
      const problem = check(data[field]);
      if (problem) errors.push(`${where}: ${field}: ${problem}`);
    }
  }
  for (const [field, value] of Object.entries(data)) {
    if (field in shape.required) continue;
    if (!(field in shape.optional)) {
      errors.push(`${where}: unknown field ${field}`);
      continue;
    }
    const problem = shape.optional[field](value);
    if (problem) errors.push(`${where}: ${field}: ${problem}`);
  }
}

/**
 * Every place where `doc` points to another id: relations, steps, course
 * items, project links, start page samples and [[links]] in the text.
 * Used to protect archived and deleted content from dangling references.
 */
export function referencesOf(doc) {
  const lead = doc.lead ?? {};
  const refs = [];
  const add = (target, where) => refs.push({ target, where: `${doc.section}/${doc.id} ${where}` });
  for (const [relation, targets] of Object.entries(lead.relations ?? {})) for (const t of targets) add(t, `relations.${relation}`);
  for (const s of pathSteps(lead)) add(s.id, 'steps');
  for (const r of lead.requires ?? []) add(r, 'requires');
  if (lead.kind === 'course') {
    (lead.sections ?? []).forEach((section, n) => {
      if (section.path) add(section.path, `sections[${n + 1}]`);
      else if (section.project) add(section.project, `sections[${n + 1}]`);
      else stepsOf(section.items).forEach((s) => add(s.id, `sections[${n + 1}]`));
    });
  }
  for (const i of lead.items ?? []) add(i, 'items');
  for (const phase of lead.phases ?? []) {
    if (phase.challenge) add(phase.challenge, phase.id);
    for (const part of [phase, ...(phase.challenges ?? [])]) for (const i of part.items ?? []) add(i, part.id);
  }
  if (lead.project) add(lead.project, 'project');
  if (lead.featured_path) add(lead.featured_path, 'featured_path');
  for (const s of lead.samples ?? []) add(s, 'samples');
  for (const file of Object.values(doc.files)) {
    for (const m of file.body.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g)) add(m[1], `${file.lang}.md [[link]]`);
  }
  return refs;
}

export const stepsOf = (list = []) =>
  list.map((s) => (typeof s === 'string' ? { id: s, optional: false } : { id: s.item, optional: !!s.optional }));

/** All steps of a course, those of its learning paths included. */
export const courseSteps = (lead, pathById) =>
  (lead.sections ?? []).flatMap((s) => (s.path ? (pathById.has(s.path) ? pathSteps(pathById.get(s.path).lead) : []) : s.project ? [] : stepsOf(s.items ?? [])));

/** All steps of a path, whether it lists them flat or in sections. */
export const pathSteps = (lead) =>
  Array.isArray(lead.sections)
    ? lead.sections.flatMap((s) => (Array.isArray(s?.steps) ? stepsOf(s.steps) : []))
    : Array.isArray(lead.steps)
      ? stepsOf(lead.steps)
      : [];

export function validate({ vocabulary, sections, problems, media = [] }) {
  const errors = [...problems];
  const warnings = [];
  for (const key of ['types', 'relations', 'levels', 'topics', 'modules', 'areas']) {
    if (!vocabulary[key]) errors.push(`vocabulary.yaml: ${key} is missing`);
  }
  // `{ de: Fragen, Designs und Messung }` reads as de: Fragen plus an empty
  // field "Designs und Messung": a label with a comma needs quotes
  for (const [list, entries] of Object.entries(vocabulary)) {
    for (const [key, def] of Object.entries(entries ?? {})) {
      for (const [field, value] of Object.entries(def ?? {})) {
        if (value === null) errors.push(`vocabulary.yaml: ${list} ${key}: "${field}" has no value; put a label with a comma in quotes`);
      }
    }
  }
  for (const [type, def] of Object.entries(vocabulary.types ?? {})) {
    if (!def.icon) errors.push(`vocabulary.yaml: type ${type} has no icon`);
    else if (!iconExists(def.icon)) errors.push(`vocabulary.yaml: type ${type}: there is no Lucide icon "${def.icon}" (see lucide.dev/icons)`);
  }
  for (const [key, def] of Object.entries(vocabulary.modules ?? {})) {
    if (def?.handbook !== undefined && url(def.handbook)) errors.push(`vocabulary.yaml: module ${key}: handbook is not a full URL`);
  }
  for (const [key, def] of Object.entries(vocabulary.institutions ?? {})) {
    for (const field of ['de', 'en', 'url', 'logo']) if (!def?.[field]) errors.push(`vocabulary.yaml: institution ${key} has no ${field}`);
    if (def?.logo && !media.includes(def.logo)) errors.push(`vocabulary.yaml: institution ${key}: logo ${def.logo} is not in knowledge/media/`);
  }
  if (errors.length) return { errors, warnings };
  const shape = shapes(vocabulary);

  // Single files
  for (const [section, docs] of Object.entries(sections)) {
    for (const doc of docs) {
      const where = `${section}/${doc.id}`;
      if (!ID.test(doc.id)) errors.push(`${where}: folder name is not an id (kebab case)`);
      const files = Object.values(doc.files);
      if (!files.length) {
        errors.push(`${where}: folder has neither de.md nor en.md`);
        continue;
      }
      const leads = files.filter((f) => !('translation_of' in f.data));
      if (leads.length !== 1) {
        errors.push(`${where}: expected exactly one lead file (the one without translation_of), found ${leads.length}`);
        continue;
      }
      doc.lead = leads[0].data;
      doc.leadLang = leads[0].lang;
      if (section === 'projects' && 'topics' in doc.lead) warnings.push(`${leads[0].path}: projects have no topics; remove the line`);
      for (const file of files) {
        checkFields(file.data, file === leads[0] ? shape[section].lead : shape[section].translation, file.path, errors);
        if (file !== leads[0] && file.data.translation_of !== doc.leadLang)
          errors.push(`${file.path}: translation_of says ${file.data.translation_of}, but the lead file is ${doc.leadLang}.md`);
      }
    }
  }
  if (errors.length) return { errors, warnings };

  // Across files
  const { content, paths, courses, projects, pages } = sections;
  for (const area of Object.keys(vocabulary.areas)) {
    const homes = pages.filter((p) => p.lead.area === area);
    if (homes.length !== 1) errors.push(`pages: area ${area} needs exactly one start page (a page with area: ${area}), found ${homes.length}`);
  }
  const items = new Map(content.map((d) => [d.id, d]));
  const pathIds = new Set(paths.map((d) => d.id));
  const allIds = new Set([...items.keys(), ...pathIds, ...courses.map((d) => d.id), ...projects.map((d) => d.id)]);
  const needItem = (where, target) => {
    if (!items.has(target)) errors.push(`${where}: unknown item "${target}"`);
  };

  const codes = new Map();
  for (const doc of [...content, ...paths, ...courses, ...projects]) {
    const owner = codes.get(doc.lead.code);
    if (owner) errors.push(`${doc.section}/${doc.id}: code ${doc.lead.code} is already used by ${owner}`);
    codes.set(doc.lead.code, `${doc.section}/${doc.id}`);
  }
  const access = new Map();
  for (const course of courses.filter((c) => c.lead.access_code)) {
    const key = course.lead.access_code.replace(/-/g, '');
    if (access.has(key)) errors.push(`courses/${course.id}: access code ${course.lead.access_code} is already used by ${access.get(key)}`);
    access.set(key, course.id);
  }

  for (const item of content) {
    for (const [relation, targets] of Object.entries(item.lead.relations ?? {})) {
      for (const target of targets) {
        needItem(`content/${item.id} relations.${relation}`, target);
        if (target === item.id) errors.push(`content/${item.id}: relation ${relation} points to itself`);
      }
    }
  }
  for (const path of paths) {
    if ((path.lead.steps === undefined) === (path.lead.sections === undefined))
      errors.push(`paths/${path.id}: needs either steps or sections, not ${path.lead.steps ? 'both' : 'neither'}`);
    for (const s of pathSteps(path.lead)) needItem(`paths/${path.id} steps`, s.id);
    for (const r of path.lead.requires ?? []) {
      if (!items.has(r) && !pathIds.has(r)) errors.push(`paths/${path.id} requires: unknown item or path "${r}"`);
    }
  }
  for (const course of courses) {
    course.lead.sections.forEach((section, n) => {
      const where = `courses/${course.id} sections[${n + 1}]`;
      if (section.path) {
        if (!pathIds.has(section.path)) errors.push(`${where}: unknown path "${section.path}"`);
      } else if (section.project) {
        if (!projects.some((p) => p.id === section.project)) errors.push(`${where}: unknown project "${section.project}"`);
      } else for (const s of stepsOf(section.items)) needItem(where, s.id);
    });
  }
  for (const project of projects) {
    const where = `projects/${project.id}`;
    for (const i of project.lead.items ?? []) needItem(`${where} items`, i);
    const seen = new Set();
    for (const phase of project.lead.phases) {
      if (phase.challenge) {
        needItem(`${where} ${phase.id}`, phase.challenge);
        const item = items.get(phase.challenge);
        if (item && item.lead.type !== 'challenge') errors.push(`${where} ${phase.id}: challenge ${phase.challenge} has type ${item.lead.type}, not challenge`);
      }
      for (const part of [phase, ...(phase.challenges ?? [])]) {
        if (seen.has(part.id)) errors.push(`${where}: id ${part.id} is used twice`);
        seen.add(part.id);
        for (const i of part.items ?? []) needItem(`${where} ${part.id}`, i);
      }
    }
    // Structure and text must match: every phase a "## … {#id}", every
    // challenge a "### … {#id}" below its phase, in every language.
    for (const file of Object.values(project.files)) {
      const text = splitProject(file.body);
      const expected = project.lead.phases.map((p) => `${p.id}: ${(p.challenges ?? []).map((c) => c.id).join(' ')}`).join(' | ');
      const found = text.phases.map((p) => `${p.id}: ${p.challenges.map((c) => c.id).join(' ')}`).join(' | ');
      if (expected !== found)
        errors.push(`${file.path}: headings with {#id} do not match phases and challenges in the front matter (front matter: ${expected}; text: ${found})`);
      for (const orphan of text.orphans) errors.push(`${file.path}: challenge {#${orphan}} stands before any phase`);
    }
  }
  // An item of one project is missing from the list of all items, so that
  // project must exist and link it, or nothing leads to it.
  for (const item of content.filter((d) => d.lead.project)) {
    const project = projects.find((p) => p.id === item.lead.project);
    if (!project) {
      errors.push(`content/${item.id}: unknown project "${item.lead.project}"`);
      continue;
    }
    const linked = [...(project.lead.items ?? []), ...project.lead.phases.flatMap((p) => [p.challenge, ...(p.items ?? []), ...(p.challenges ?? []).flatMap((c) => c.items ?? [])])];
    if (!linked.includes(item.id)) errors.push(`content/${item.id}: belongs to project ${project.id}, which does not link it`);
  }
  for (const page of pages) {
    if (page.lead.featured_path && !pathIds.has(page.lead.featured_path))
      errors.push(`pages/${page.id}: unknown featured_path "${page.lead.featured_path}"`);
    for (const s of page.lead.samples ?? []) needItem(`pages/${page.id} samples`, s);
  }

  // [[links]] in bodies
  for (const doc of Object.values(sections).flat()) {
    for (const file of Object.values(doc.files)) {
      for (const m of file.body.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g)) {
        if (!allIds.has(m[1])) errors.push(`${file.path}: link to unknown id [[${m[1]}]]`);
      }
    }
  }

  // No cycle in `requires`, otherwise no item of the cycle could be read first.
  const state = new Map();
  const visit = (current, trail) => {
    if (state.get(current) === 'done') return;
    if (state.get(current) === 'open') {
      errors.push(`requires has a cycle: ${[...trail.slice(trail.indexOf(current)), current].join(' -> ')}`);
      return;
    }
    state.set(current, 'open');
    for (const next of items.get(current)?.lead.relations?.requires ?? []) visit(next, [...trail, current]);
    state.set(current, 'done');
  };
  for (const item of content) visit(item.id, []);

  // Slides: the deck exists and every file it loads is there.
  for (const item of content.filter((d) => d.lead.type === 'slides')) {
    const deck = join(item.dir, 'slides');
    const found = deckFile(item.dir);
    if (found.error) {
      errors.push(`content/${item.id}/slides: ${found.error}`);
      continue;
    }
    const where = `content/${item.id}/slides/${found.file}`;
    if (found.file === 'index.html') warnings.push(`content/${item.id}/slides: the deck is called index.html; name it after its title, as stagekit requires, so that its PDF is not index.pdf`);
    // the script is what a learning assistant reads instead of the slides
    if (!existsSync(join(deck, 'skript.md'))) warnings.push(`content/${item.id}/slides: no skript.md (the text to the slides, kept off the site)`);
    const html = readFileSync(join(deck, found.file), 'utf8');
    for (const [, tag, ref] of html.matchAll(/<(\w+)\b[^>]*?\s(?:src|href)="([^"#?]+)[^"]*"/g)) {
      // a link is followed, not loaded, and stagekit wants addresses on slides as links
      if (tag === 'a' && ref.startsWith('https://')) continue;
      if (/^(https?:|data:|mailto:)/.test(ref)) {
        errors.push(`${where}: loads ${ref} from elsewhere; everything a deck shows must be in the knowledge base`);
        continue;
      }
      // decks find the stagekit runtime two folders up, as where they are made
      const file = ref.startsWith('../../stagekit/') ? join(item.dir, '../../../vendor/stagekit', ref.slice(15)) : join(deck, ref);
      if (!existsSync(file)) errors.push(`${where}: ${ref} does not exist`);
    }
  }

  // Every item states its minutes of focused work, except a challenge, which
  // runs over weeks of a project.
  for (const item of content.filter((d) => d.lead.type !== 'challenge' && d.lead.duration === undefined))
    errors.push(`content/${item.id}: duration is missing`);

  // Datasets: `file` names a CSV in media/datasets/, and only datasets have one.
  for (const item of content) {
    const where = `content/${item.id}`;
    if (item.lead.type !== 'dataset') {
      if (item.lead.file !== undefined) errors.push(`${where}: file: only a dataset has a file`);
      continue;
    }
    if (typeof item.lead.file !== 'string') {
      errors.push(`${where}: file is missing (the name of its CSV in media/datasets/)`);
      continue;
    }
    const info = datasetInfo(item.dir, item.lead.file);
    if (info.error) errors.push(`${where}: file: ${info.error}`);
  }

  // Drawings (docs/figures.md): every figure:name in a text is registered in
  // the item's figures.js, and that file keeps stagekit's sizes and colours.
  for (const item of content) {
    const drawings = figureFile(item);
    for (const file of Object.values(item.files)) {
      for (const name of figureRefs(file.body)) {
        if (!drawings) errors.push(`${file.path}: figure:${name}, but the item has no ${FIGURE_FILE}`);
        else if (!drawings.names.includes(name)) errors.push(`${file.path}: figure:${name} is not registered in ${FIGURE_FILE} (figure('${name}', …))`);
      }
    }
    if (drawings) for (const problem of figureRules(drawings.source)) errors.push(`content/${item.id}/${FIGURE_FILE}: ${problem}`);
  }

  // Quizzes: every question needs options and at least one correct one.
  for (const item of content.filter((d) => d.lead.type === 'quiz')) {
    for (const file of Object.values(item.files)) {
      const questions = file.body.split(/^## /m).slice(1);
      if (!questions.length) errors.push(`${file.path}: a quiz needs at least one question (## heading)`);
      questions.forEach((q, n) => {
        if (!/^\s*[-*] \[[ x]\]/im.test(q)) errors.push(`${file.path}: question ${n + 1} has no options (- [ ] …)`);
        else if (!/^\s*[-*] \[x\]/im.test(q)) errors.push(`${file.path}: question ${n + 1} has no correct answer (- [x] …)`);
      });
    }
  }

  // Archived content is kept for its id and code, but nothing visible may point to it.
  const all = Object.values(sections).flat();
  const archived = new Set(all.filter((d) => d.lead?.status === 'archived').map((d) => d.id));
  for (const doc of all.filter((d) => d.lead?.status !== 'archived')) {
    for (const ref of referencesOf(doc)) {
      if (archived.has(ref.target)) errors.push(`${ref.where}: points to archived "${ref.target}"`);
    }
  }

  // Warnings
  for (const doc of Object.values(sections).flat()) {
    for (const lang of ['de', 'en']) {
      const file = doc.files[lang];
      if (!file) warnings.push(`${doc.section}/${doc.id}: no ${lang} version`);
      else if (file.data.based_on && file.data.based_on < doc.lead.updated)
        warnings.push(`${file.path}: translation is older than its lead file`);
      if (file && doc.section === 'content' && !file.data.objectives) warnings.push(`${file.path}: no objectives (what you learn)`);
    }
  }
  // A demo page says above the demonstrator what it is for and how to use it,
  // and ends with it (Nicolas, 2026-10-31).
  for (const item of content.filter((d) => d.lead.type === 'demo')) {
    for (const file of Object.values(item.files)) {
      const after = file.body.split(/^```[\w-]+\r?\n(?:[\s\S]*?\n)?```[ \t]*$/m)[1];
      if (after?.trim()) warnings.push(`${file.path}: text after the demonstrator; a demo page ends with it`);
    }
  }
  // The scenario of a folder tree and command line (client/shell-model.js).
  for (const item of content) {
    for (const file of Object.values(item.files)) {
      for (const [, text] of file.body.matchAll(/^```shell-demo[ \t]*\r?\n([\s\S]*?)^```[ \t]*$/gm)) {
        const scenario = shellScenario(text);
        const problems = scenario === null ? ['the scenario is not valid YAML'] : scenarioProblems(scenario);
        for (const problem of problems) errors.push(`${file.path}: shell-demo: ${problem}`);
      }
    }
  }
  const published = [
    ...paths.filter((p) => p.lead.status === 'published').map((p) => [`paths/${p.id}`, pathSteps(p.lead)]),
    ...courses
      .filter((c) => c.lead.status === 'published')
      .map((c) => [`courses/${c.id}`, courseSteps(c.lead, new Map(paths.map((p) => [p.id, p])))]),
  ];
  for (const [where, list] of published) {
    for (const s of list) if (items.get(s.id)?.lead.status === 'draft') warnings.push(`${where}: contains draft item ${s.id}`);
  }

  return { errors, warnings };
}
