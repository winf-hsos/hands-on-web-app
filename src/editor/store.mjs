// Reading and writing the knowledge base for the editor. Every change is
// checked with the same rules as the build before anything touches the
// disk, and files are written the way a person would write them, so that
// they stay pleasant to read and to diff.
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { loadKnowledge, LANGS, SECTIONS } from '../build/load.mjs';
import { validate, referencesOf } from '../build/validate.mjs';

const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// --- writing front matter ------------------------------------------------------

const ORDER = {
  content: ['type', 'code', 'title', 'summary', 'authors', 'year', 'publisher', 'isbn', 'buy', 'url', 'doi', 'venue', 'license', 'when', 'born', 'died', 'file', 'level', 'duration', 'topics', 'modules', 'relations', 'access', 'status', 'updated'],
  paths: ['kind', 'code', 'title', 'summary', 'goal', 'audience', 'level', 'requires', 'steps', 'sections', 'status', 'updated'],
  courses: ['kind', 'code', 'access_code', 'module', 'institution', 'semester', 'title', 'subtitle', 'summary', 'sections', 'status', 'updated'],
  projects: ['kind', 'code', 'title', 'summary', 'level', 'topics', 'modules', 'items', 'phases', 'status', 'updated'],
  pages: ['kind', 'title', 'summary', 'featured_path', 'samples', 'updated'],
  translation: ['title', 'subtitle', 'summary', 'goal', 'audience', 'translation_of', 'based_on'],
};
const PROSE = new Set(['summary', 'goal', 'audience']);

const isScalar = (v) => v === null || ['string', 'number', 'boolean'].includes(typeof v) || v instanceof Date;
const day = (d) => d.toISOString().slice(0, 10);

function scalar(value) {
  if (value instanceof Date) return day(value);
  if (typeof value !== 'string') return String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  // js-yaml knows when a string needs quotes; it is asked for a flow scalar.
  return yaml.dump(value, { flowLevel: 0, lineWidth: -1, quotingType: '"' }).trim();
}

function folded(text, indent) {
  const words = text.trim().split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    if (line && line.length + word.length + 1 > 80 - indent) {
      lines.push(line);
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  const pad = ' '.repeat(indent);
  return `>-\n${lines.map((l) => pad + l).join('\n')}`;
}

function value(v, indent, key) {
  const pad = ' '.repeat(indent + 2);
  // Prose that does not fit on the line is folded, as people write it.
  if (typeof v === 'string' && PROSE.has(key) && indent + key.length + 2 + scalar(v).length > 80) return ` ${folded(v, indent + 2)}`;
  if (isScalar(v)) return ` ${scalar(v)}`;
  if (Array.isArray(v)) {
    if (!v.length) return ' []';
    if (v.every(isScalar)) {
      const flow = `[${v.map(scalar).join(', ')}]`;
      if (flow.length + indent + (key?.length ?? 0) < 100) return ` ${flow}`;
    }
    return v
      .map((item) => {
        if (isScalar(item)) return `\n${pad}- ${scalar(item)}`;
        const body = block(item, indent + 4).replace(/^\s+/, '');
        return `\n${pad}- ${body}`;
      })
      .join('');
  }
  // { de: …, en: … } labels stay on one line, as people write them
  const keys = Object.keys(v);
  if (keys.length && keys.every((k) => LANGS.includes(k)) && keys.every((k) => isScalar(v[k])))
    return ` { ${keys.map((k) => `${k}: ${scalar(v[k])}`).join(', ')} }`;
  return `\n${block(v, indent + 2)}`;
}

function block(object, indent, order = []) {
  const pad = ' '.repeat(indent);
  const keys = [...order.filter((k) => k in object), ...Object.keys(object).filter((k) => !order.includes(k))];
  return keys
    .filter((k) => object[k] !== undefined)
    .map((k) => `${pad}${k}:${value(object[k], indent, k)}`)
    .join('\n');
}

/**
 * Writes a file. With `previous` (the file as it is on disk), every
 * top-level field whose value did not change keeps its exact lines, so a
 * change of one field is a change of one field in the diff, too.
 */
export function serialize(section, data, body, isLead, previous = '') {
  const order = isLead ? ORDER[section] : ORDER.translation;
  const text = body.replace(/^(\r?\n)+/, '');
  // a file without text (a slides item, say) ends right after the front matter
  const end = !text.trim() ? '' : `\n${text.endsWith('\n') ? text : `${text}\n`}`;
  const old = previous.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n/);
  if (!old) return `---\n${block(data, 0, order)}\n---\n${end}`;

  // the old front matter cut into top-level fields with their own lines
  const blocks = [];
  for (const line of old[1].split('\n')) {
    const key = line.match(/^([A-Za-z_][\w-]*):/)?.[1];
    if (key) blocks.push({ key, lines: [line] });
    else if (blocks.length) blocks.at(-1).lines.push(line);
  }
  const oldData = yaml.load(old[1]) ?? {};
  const fresh = (key) => block({ [key]: data[key] }, 0);
  const out = blocks
    .filter((b) => data[b.key] !== undefined) // removed fields drop out
    .map((b) => ({ key: b.key, text: same(oldData[b.key], data[b.key]) ? b.lines.join('\n') : fresh(b.key) }));
  // new fields go before the first field that comes after them in the canonical order
  const rank = (key) => (order.includes(key) ? order.indexOf(key) : order.length);
  for (const key of Object.keys(data)) {
    if (data[key] === undefined || out.some((o) => o.key === key)) continue;
    const at = out.findIndex((o) => rank(o.key) > rank(key));
    out.splice(at < 0 ? out.length : at, 0, { key, text: fresh(key) });
  }
  return `---\n${out.map((o) => o.text).join('\n')}\n---\n${end}`;
}

/** Equal as data, with dates compared by day. */
const same = (a, b) => {
  const norm = (v) => JSON.stringify(v, (k, x) => (typeof x === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(x) ? x.slice(0, 10) : x));
  return norm(a) === norm(b);
};

// --- reading -----------------------------------------------------------------

export function createStore(root) {
  const load = () => loadKnowledge(root);
  const leadOf = (doc) => Object.values(doc.files).find((f) => !('translation_of' in f.data));
  /** The area a document is shown in first: a start page names it, everything else lists it in `areas`. */
  const areaOf = (data = {}) => data.area ?? data.areas?.[0] ?? 'cs';

  function list() {
    const knowledge = load();
    const { errors, warnings } = validate(knowledge);
    const docs = Object.values(knowledge.sections)
      .flat()
      .map((doc) => {
        const lead = leadOf(doc);
        const where = `${doc.section}/${doc.id}`;
        return {
          section: doc.section,
          id: doc.id,
          lead: lead?.lang,
          kind: lead?.data.type ?? lead?.data.kind,
          code: lead?.data.code,
          status: lead?.data.status,
          area: areaOf(lead?.data),
          updated: lead?.data.updated ? day(lead.data.updated) : undefined,
          titles: Object.fromEntries(Object.values(doc.files).map((f) => [f.lang, f.data.title])),
          // what the check says about this document, in its own words
          problems: errors.filter((e) => e.includes(where)),
          errors: errors.filter((e) => e.includes(where)).length,
        };
      });
    return { docs, vocabulary: knowledge.vocabulary, errors, warnings };
  }

  function find(knowledge, section, id) {
    if (!SECTIONS.includes(section) || !ID.test(id)) throw Object.assign(new Error('unknown document'), { status: 404 });
    const doc = knowledge.sections[section].find((d) => d.id === id);
    if (!doc) throw Object.assign(new Error('unknown document'), { status: 404 });
    return doc;
  }

  // Dates travel to the browser as days (YYYY-MM-DD), at any depth.
  const plain = (data) =>
    JSON.parse(JSON.stringify(data, (k, v) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/.test(v) ? v.slice(0, 10) : v)));
  const toJson = (doc) => ({
    section: doc.section,
    id: doc.id,
    lead: leadOf(doc)?.lang,
    files: Object.fromEntries(Object.values(doc.files).map((f) => [f.lang, { data: plain(f.data), body: f.body }])),
  });

  function read(section, id) {
    const knowledge = load();
    return toJson(find(knowledge, section, id));
  }

  // --- writing -----------------------------------------------------------------

  // Dates arrive from the browser as days and become dates again, as js-yaml
  // would read them from the file.
  const asDate = (v) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? new Date(`${v}T00:00:00Z`) : v);
  function revive(data) {
    const out = { ...data };
    for (const key of ['updated', 'based_on']) out[key] = asDate(out[key]);
    for (const key of Object.keys(out)) if (out[key] === undefined) delete out[key];
    return out;
  }

  /** Checks the knowledge base with `doc` replaced; returns errors that concern it. */
  /**
   * Compares the knowledge base before and after a change. Every error the
   * change introduces blocks it, wherever it shows up (archiving an item
   * shows up at the items pointing to it); errors that were there before
   * are reported but do not block.
   */
  function check(before, after, section, id) {
    const old = new Set(validate(before).errors);
    const { errors, warnings } = validate(after);
    const mine = (line) => line.includes(`${section}/${id}`) || line.includes(`"${id}"`);
    return { errors: errors.filter((e) => !old.has(e)), elsewhere: errors.filter((e) => old.has(e)), warnings: warnings.filter(mine) };
  }

  /**
   * Saves a document. `files` maps language to { data, body }; a language
   * with null is removed. Nothing is written if the result breaks a rule.
   */
  function save(section, id, files, { create = false } = {}) {
    const knowledge = load();
    if (!SECTIONS.includes(section) || !ID.test(id)) return { ok: false, errors: [`"${id}" is not a valid id (kebab case, like logic-gates)`] };
    let doc = knowledge.sections[section].find((d) => d.id === id);
    if (create && doc) return { ok: false, errors: [`${section}/${id} already exists`] };
    if (!create && !doc) return { ok: false, errors: [`${section}/${id} does not exist`] };
    if (!doc) {
      doc = { section, id, files: {} };
      knowledge.sections[section].push(doc);
    }
    for (const [lang, file] of Object.entries(files)) {
      if (!LANGS.includes(lang)) continue;
      if (file === null) delete doc.files[lang];
      else doc.files[lang] = { lang, data: revive(file.data), body: file.body ?? '', path: `${section}/${id}/${lang}.md` };
    }
    const result = check(load(), knowledge, section, id);
    if (result.errors.length) return { ok: false, ...result };

    const dir = join(root, section, id);
    mkdirSync(dir, { recursive: true });
    for (const lang of LANGS) {
      const file = doc.files[lang];
      const path = join(dir, `${lang}.md`);
      if (!file) {
        if (lang in files && existsSync(path)) rmSync(path);
        continue;
      }
      if (!(lang in files)) continue;
      const before = existsSync(path) ? readFileSync(path, 'utf8') : '';
      const text = serialize(section, file.data, file.body, !('translation_of' in file.data), before);
      // Keep the line endings a file already has, so that saving does not
      // turn every line into a change.
      writeFileSync(path, before.includes('\r\n') ? text.replace(/\r?\n/g, '\r\n') : text);
    }
    return { ok: true, ...result, doc: toJson(doc) };
  }

  /** Deletes a document for good, unless something still points to it. */
  function remove(section, id) {
    const knowledge = load();
    find(knowledge, section, id);
    const others = Object.values(knowledge.sections).flat().filter((d) => !(d.section === section && d.id === id));
    for (const d of others) d.lead = leadOf(d)?.data;
    const refs = others.flatMap((d) => referencesOf(d)).filter((r) => r.target === id);
    if (refs.length) return { ok: false, errors: refs.map((r) => `${r.where} still points to "${id}"`) };
    rmSync(join(root, section, id), { recursive: true, force: true });
    return { ok: true };
  }

  /** An unused four-digit code. */
  function newCode() {
    const used = new Set(
      Object.values(load().sections)
        .flat()
        .flatMap((d) => Object.values(d.files).map((f) => f.data.code))
        .filter(Boolean),
    );
    let code;
    do code = 1000 + Math.floor(Math.random() * 9000);
    while (used.has(code));
    return code;
  }

  return { list, read, save, remove, newCode, areaOf, sections: SECTIONS, existsDir: (s) => existsSync(join(root, s)) && readdirSync(join(root, s)) };
}
