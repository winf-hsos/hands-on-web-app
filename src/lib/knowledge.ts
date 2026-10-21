// Joins lead files and translations into one record per folder and checks
// everything that spans more than one file (docs/knowledge-schema.md, §12).
// Any error stops the build; warnings are printed once.
import { getCollection, type CollectionEntry } from 'astro:content';
import { knowledgeIndex } from '../markdown/knowledge-index.mjs';
import { vocabulary, type Lang } from './vocabulary';

export const LANGS: Lang[] = ['de', 'en'];

type Section = 'content' | 'paths' | 'courses' | 'pages';
type Entry<S extends Section> = CollectionEntry<S>;
type LeadData<S extends Section> = Exclude<Entry<S>['data'], { translation_of: unknown }>;

export interface Doc<S extends Section> {
  id: string;
  section: S;
  lead: LeadData<S>;
  leadLang: Lang;
  entries: Partial<Record<Lang, Entry<S>>>;
}

export type Item = Doc<'content'>;
export type Path = Doc<'paths'>;
export type Course = Doc<'courses'>;
export type Step = { id: string; optional: boolean };

export interface Localized<S extends Section> {
  entry: Entry<S>;
  /** Language the text is actually in; differs from the requested one if a translation is missing. */
  lang: Lang;
  missing: boolean;
  stale: boolean;
  title: string;
  summary: string;
  data: Entry<S>['data'];
}

const isLead = (data: object) => 'type' in data || 'kind' in data;

async function load<S extends Section>(section: S): Promise<Doc<S>[]> {
  const entries = (await getCollection(section)) as Entry<S>[];
  const byId = new Map<string, Partial<Record<Lang, Entry<S>>>>();
  for (const entry of entries) {
    const [id, lang] = entry.id.split('/') as [string, Lang];
    byId.set(id, { ...byId.get(id), [lang]: entry });
  }
  const docs: Doc<S>[] = [];
  for (const [id, files] of byId) {
    const leads = LANGS.filter((l) => files[l] && isLead(files[l]!.data as object));
    if (leads.length !== 1) {
      errors.push(`${section}/${id}: expected exactly one lead file (with type or kind), found ${leads.length}`);
      continue;
    }
    docs.push({ id, section, entries: files, leadLang: leads[0], lead: files[leads[0]]!.data as LeadData<S> });
  }
  return docs.sort((a, b) => a.id.localeCompare(b.id));
}

const errors: string[] = [];
const warnings: string[] = [];

export interface Knowledge {
  items: Item[];
  paths: Path[];
  courses: Course[];
  pages: Doc<'pages'>[];
  item: Map<string, Item>;
  path: Map<string, Path>;
}

let loaded: Promise<Knowledge> | undefined;

export function knowledge(): Promise<Knowledge> {
  loaded ??= (async () => {
    const [items, paths, courses, pages] = await Promise.all([
      load('content'),
      load('paths'),
      load('courses'),
      load('pages'),
    ]);
    const k: Knowledge = {
      items,
      paths,
      courses,
      pages,
      item: new Map(items.map((i) => [i.id, i])),
      path: new Map(paths.map((p) => [p.id, p])),
    };
    validate(k);
    if (warnings.length) console.warn(`\n[knowledge] ${warnings.length} warning(s):\n  ${warnings.join('\n  ')}\n`);
    if (errors.length) throw new Error(`Knowledge base has ${errors.length} error(s):\n  ${errors.join('\n  ')}`);
    return k;
  })();
  return loaded;
}

export const steps = (list: (string | { item: string; optional: boolean })[]): Step[] =>
  list.map((s) => (typeof s === 'string' ? { id: s, optional: false } : { id: s.item, optional: s.optional }));

function validate(k: Knowledge) {
  const all: Doc<Section>[] = [...k.items, ...k.paths, ...k.courses];
  const codes = new Map<number, string>();
  for (const doc of all) {
    const code = (doc.lead as { code: number }).code;
    if (codes.has(code)) errors.push(`${doc.section}/${doc.id}: code ${code} is already used by ${codes.get(code)}`);
    codes.set(code, `${doc.section}/${doc.id}`);
  }
  const accessCodes = new Map<string, string>();
  for (const c of k.courses) {
    if (accessCodes.has(c.lead.access_code)) errors.push(`courses/${c.id}: access code ${c.lead.access_code} is already used`);
    accessCodes.set(c.lead.access_code, c.id);
  }

  const needItem = (where: string, id: string) => {
    if (!k.item.has(id)) errors.push(`${where}: unknown item "${id}"`);
  };

  for (const item of k.items) {
    for (const [relation, targets] of Object.entries(item.lead.relations ?? {})) {
      for (const target of targets ?? []) {
        needItem(`content/${item.id} relations.${relation}`, target);
        if (target === item.id) errors.push(`content/${item.id}: relation ${relation} points to itself`);
      }
    }
  }
  for (const path of k.paths) {
    for (const s of steps(path.lead.steps)) needItem(`paths/${path.id} steps`, s.id);
    for (const r of path.lead.requires) {
      if (!k.item.has(r) && !k.path.has(r)) errors.push(`paths/${path.id} requires: unknown item or path "${r}"`);
    }
  }
  for (const course of k.courses) {
    course.lead.units.forEach((unit, n) => {
      for (const s of steps(unit.items)) needItem(`courses/${course.id} units[${n}]`, s.id);
    });
  }
  for (const page of k.pages) {
    if (page.lead.featured_path && !k.path.has(page.lead.featured_path))
      errors.push(`pages/${page.id}: unknown featured_path "${page.lead.featured_path}"`);
    for (const s of page.lead.samples) needItem(`pages/${page.id} samples`, s);
  }

  // [[links]] in every body
  const index = knowledgeIndex();
  for (const doc of [...all, ...k.pages]) {
    for (const [lang, entry] of Object.entries(doc.entries)) {
      for (const m of entry?.body?.matchAll(/\[\[([a-z0-9-]+)(?:\|[^\]]+)?\]\]/g) ?? []) {
        if (!index.has(m[1])) errors.push(`${doc.section}/${doc.id}/${lang}.md: link to unknown id [[${m[1]}]]`);
      }
    }
  }

  // No cycles in `requires`: otherwise no item of the cycle could be read first.
  const state = new Map<string, 'open' | 'done'>();
  const visit = (id: string, trail: string[]) => {
    if (state.get(id) === 'done') return;
    if (state.get(id) === 'open') {
      errors.push(`requires has a cycle: ${[...trail.slice(trail.indexOf(id)), id].join(' -> ')}`);
      return;
    }
    state.set(id, 'open');
    for (const next of k.item.get(id)?.lead.relations?.requires ?? []) visit(next, [...trail, id]);
    state.set(id, 'done');
  };
  for (const item of k.items) visit(item.id, []);

  // Quizzes need a correct answer per question.
  for (const item of k.items.filter((i) => i.lead.type === 'quiz')) {
    for (const [lang, entry] of Object.entries(item.entries)) {
      const questions = (entry?.body ?? '').split(/^## /m).slice(1);
      questions.forEach((q, n) => {
        if (!/^\s*[-*] \[x\]/im.test(q)) errors.push(`content/${item.id}/${lang}.md: question ${n + 1} has no correct answer`);
      });
    }
  }

  // Warnings: drafts inside something already published
  const published = [
    ...k.paths.filter((p) => p.lead.status === 'published').map((p) => [`paths/${p.id}`, steps(p.lead.steps)] as const),
    ...k.courses
      .filter((c) => c.lead.status === 'published')
      .map((c) => [`courses/${c.id}`, c.lead.units.flatMap((u) => steps(u.items))] as const),
  ];
  for (const [where, list] of published) {
    for (const s of list) {
      if (k.item.get(s.id)?.lead.status === 'draft') warnings.push(`${where}: contains draft item ${s.id}`);
    }
  }

  // Warnings: translations
  for (const doc of [...all, ...k.pages]) {
    for (const lang of LANGS) {
      const entry = doc.entries[lang];
      if (!entry) {
        warnings.push(`${doc.section}/${doc.id}: no ${lang} version`);
        continue;
      }
      const data = entry.data as { based_on?: Date };
      if (data.based_on && data.based_on < (doc.lead as { updated: Date }).updated)
        warnings.push(`${doc.section}/${doc.id}/${lang}.md: translation is older than its lead file`);
    }
  }
}

export function localize<S extends Section>(doc: Doc<S>, lang: Lang): Localized<S> {
  const own = doc.entries[lang];
  const entry = (own ?? doc.entries[doc.leadLang])!;
  const data = entry.data as { title: string; summary: string; based_on?: Date };
  return {
    entry,
    lang: own ? lang : doc.leadLang,
    missing: !own,
    stale: !!data.based_on && data.based_on < (doc.lead as { updated: Date }).updated,
    title: data.title,
    summary: data.summary,
    data: entry.data,
  };
}

export interface RelationGroup {
  key: string;
  label: string;
  items: Item[];
}

/** Outgoing relations and computed inverse ones, labelled for `lang`. */
export function relationsOf(item: Item, k: Knowledge, lang: Lang): { before: RelationGroup[]; after: RelationGroup[]; other: RelationGroup[] } {
  const groups = new Map<string, RelationGroup>();
  const add = (key: string, label: string, target: Item | undefined) => {
    if (!target) return;
    const g = groups.get(key) ?? { key, label, items: [] };
    if (!g.items.includes(target)) g.items.push(target);
    groups.set(key, g);
  };
  for (const [rel, targets] of Object.entries(item.lead.relations ?? {})) {
    for (const t of targets ?? []) add(rel, vocabulary.relations[rel][lang], k.item.get(t));
  }
  for (const other of k.items) {
    for (const [rel, targets] of Object.entries(other.lead.relations ?? {})) {
      if (!targets?.includes(item.id)) continue;
      const def = vocabulary.relations[rel];
      if (def.symmetric) add(rel, def[lang], other);
      else add(`${rel}:inverse`, def.inverse?.[lang] ?? def[lang], other);
    }
  }
  const all = [...groups.values()];
  return {
    before: all.filter((g) => g.key === 'requires'),
    after: all.filter((g) => g.key === 'requires:inverse'),
    other: all.filter((g) => g.key !== 'requires' && g.key !== 'requires:inverse'),
  };
}

export const durationOf = (list: Step[], k: Knowledge) => {
  let required = 0;
  let optional = 0;
  for (const s of list) {
    const minutes = k.item.get(s.id)?.lead.duration ?? 0;
    if (s.optional) optional += minutes;
    else required += minutes;
  }
  return { required, optional };
};
