// The rules of docs/knowledge-schema.md as code. Every rule that fails adds
// a line naming file and field; the build stops if there is any error and
// prints warnings without stopping. Each doc gets `lead` and `leadLang`.

import { iconExists } from './icons.mjs';
import { splitProject } from './project.mjs';

const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// --- field checks: each returns an error message or nothing --------------

const text = (v) => (typeof v === 'string' && v.trim() ? null : 'expected text');
const date = (v) => (v instanceof Date && !isNaN(v) ? null : 'expected a date like 2026-10-21');
const bool = (v) => (typeof v === 'boolean' ? null : 'expected true or false');
const int = (min, max) => (v) =>
  Number.isInteger(v) && v >= min && v <= max ? null : `expected a whole number from ${min} to ${max}`;
const id = (v) => (typeof v === 'string' && ID.test(v) ? null : `"${v}" is not an id (kebab case, like code-as-agreement)`);
const oneOf = (keys, what) => (v) => (keys.includes(v) ? null : `"${v}" is not a known ${what} (${keys.join(', ')})`);
const list = (check, min = 0) => (v) => {
  if (!Array.isArray(v)) return 'expected a list';
  if (v.length < min) return `expected at least ${min} entr${min === 1 ? 'y' : 'ies'}`;
  return v.map(check).find(Boolean) ?? null;
};
const url = (v) => {
  try {
    new URL(v);
    return null;
  } catch {
    return 'expected a full URL';
  }
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
  const unit = (v) => {
    if (!v || typeof v !== 'object') return 'expected { title, available_from, items }';
    return (
      (label(v.title) && `title: ${label(v.title)}`) ??
      (v.available_from !== undefined && date(v.available_from) ? `available_from: ${date(v.available_from)}` : null) ??
      (list(step, 1)(v.items) && `items: ${list(step, 1)(v.items)}`) ??
      null
    );
  };
  const part = (allowed) => (v) => {
    if (!v || typeof v !== 'object' || Array.isArray(v)) return `expected { ${allowed.join(', ')} }`;
    const extra = Object.keys(v).find((k) => !allowed.includes(k));
    if (extra) return `unknown field ${extra} (allowed: ${allowed.join(', ')})`;
    return id(v.id) ?? (v.items === undefined ? null : list(id)(v.items));
  };
  const challenge = part(['id', 'items']);
  const phase = (v) => part(['id', 'items', 'challenges'])(v) ?? (v.challenges === undefined ? null : list(challenge)(v.challenges));
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
          duration: int(1, 600),
          topics: list(oneOf(topics, 'topic'), 1),
          status,
          updated: date,
        },
        optional: {
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
        },
      },
      translation,
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
          steps: list(step, 1),
          status,
          updated: date,
        },
        optional: { requires: list(id) },
      },
      translation: { required: { ...translation.required, goal: text, audience: text }, optional: {} },
    },
    courses: {
      lead: {
        required: {
          kind: oneOf(['course'], 'kind'),
          code: int(1000, 9999),
          access_code: (v) =>
            typeof v === 'string' && /^[A-Z0-9-]{4,16}$/.test(v) ? null : 'expected upper case letters, digits and hyphens',
          module: oneOf(modules, 'module'),
          semester: text,
          title: text,
          summary: text,
          units: list(unit, 1),
          status,
          updated: date,
        },
        optional: {},
      },
      translation,
    },
    projects: {
      lead: {
        required: {
          kind: oneOf(['project'], 'kind'),
          code: int(1000, 9999),
          title: text,
          summary: text,
          level: int(1, 4),
          topics: list(oneOf(topics, 'topic'), 1),
          phases: list(phase, 1),
          status,
          updated: date,
        },
        optional: { modules: list(oneOf(modules, 'module')), items: list(id) },
      },
      translation,
    },
    pages: {
      lead: {
        required: { kind: oneOf(['page'], 'kind'), title: text, summary: text, updated: date },
        optional: { featured_path: id, samples: list(id) },
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
  for (const s of stepsOf(lead.steps)) add(s.id, 'steps');
  for (const r of lead.requires ?? []) add(r, 'requires');
  (lead.units ?? []).forEach((unit, n) => stepsOf(unit.items).forEach((s) => add(s.id, `units[${n + 1}]`)));
  for (const i of lead.items ?? []) add(i, 'items');
  for (const phase of lead.phases ?? []) {
    for (const part of [phase, ...(phase.challenges ?? [])]) for (const i of part.items ?? []) add(i, part.id);
  }
  if (lead.featured_path) add(lead.featured_path, 'featured_path');
  for (const s of lead.samples ?? []) add(s, 'samples');
  for (const file of Object.values(doc.files)) {
    for (const m of file.body.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g)) add(m[1], `${file.lang}.md [[link]]`);
  }
  return refs;
}

export const stepsOf = (list = []) =>
  list.map((s) => (typeof s === 'string' ? { id: s, optional: false } : { id: s.item, optional: !!s.optional }));

export function validate({ vocabulary, sections, problems }) {
  const errors = [...problems];
  const warnings = [];
  for (const key of ['types', 'relations', 'levels', 'topics', 'modules']) {
    if (!vocabulary[key]) errors.push(`vocabulary.yaml: ${key} is missing`);
  }
  for (const [type, def] of Object.entries(vocabulary.types ?? {})) {
    if (!def.icon) errors.push(`vocabulary.yaml: type ${type} has no icon`);
    else if (!iconExists(def.icon)) errors.push(`vocabulary.yaml: type ${type}: there is no Lucide icon "${def.icon}" (see lucide.dev/icons)`);
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
  for (const course of courses) {
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
    for (const s of stepsOf(path.lead.steps)) needItem(`paths/${path.id} steps`, s.id);
    for (const r of path.lead.requires ?? []) {
      if (!items.has(r) && !pathIds.has(r)) errors.push(`paths/${path.id} requires: unknown item or path "${r}"`);
    }
  }
  for (const course of courses) {
    course.lead.units.forEach((unit, n) => {
      for (const s of stepsOf(unit.items)) needItem(`courses/${course.id} units[${n + 1}]`, s.id);
    });
  }
  for (const project of projects) {
    const where = `projects/${project.id}`;
    for (const i of project.lead.items ?? []) needItem(`${where} items`, i);
    const seen = new Set();
    for (const phase of project.lead.phases) {
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
    }
  }
  const published = [
    ...paths.filter((p) => p.lead.status === 'published').map((p) => [`paths/${p.id}`, stepsOf(p.lead.steps)]),
    ...courses
      .filter((c) => c.lead.status === 'published')
      .map((c) => [`courses/${c.id}`, c.lead.units.flatMap((u) => stepsOf(u.items))]),
  ];
  for (const [where, list] of published) {
    for (const s of list) if (items.get(s.id)?.lead.status === 'draft') warnings.push(`${where}: contains draft item ${s.id}`);
  }

  return { errors, warnings };
}
