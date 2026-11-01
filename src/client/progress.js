// Progress lives in local storage only (docs/knowledge-schema.md, §11).
// Items are recorded by id; for transfer they are encoded by their stable
// four-digit code and compressed, so that the link fits into a QR code.

const KEY = 'hocs-progress';
const EPOCH = Date.UTC(2026, 0, 1);
const DAY = 86_400_000;

const empty = () => ({ v: 1, items: {}, courses: [] });

export function load() {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    if (stored?.v === 1) return { ...empty(), ...stored };
  } catch {}
  return empty();
}

export function save(progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {}
  document.dispatchEvent(new CustomEvent('progress-change', { detail: progress }));
}

export const today = () => new Date().toISOString().slice(0, 10);

export function update(id, change) {
  const progress = load();
  change((progress.items[id] ??= {}));
  save(progress);
}

export const isDone = (progress, id) => !!progress.items[id]?.done;

export function merge(into, from) {
  const min = (a, b) => (a && b ? (a < b ? a : b) : a ?? b);
  for (const [id, incoming] of Object.entries(from.items)) {
    const own = (into.items[id] ??= {});
    own.seen = min(own.seen, incoming.seen);
    own.done = min(own.done, incoming.done);
    if (incoming.quiz) {
      own.quiz ??= {};
      for (const [q, ok] of Object.entries(incoming.quiz)) own.quiz[q] = own.quiz[q] || ok;
    }
  }
  into.courses = [...new Set([...into.courses, ...from.courses])];
  return into;
}

let index;
/** Titles, codes and URLs of everything, for search and transfer; fetched once. */
export function loadIndex() {
  index ??= fetch(document.body.dataset.index)
    .then((r) => r.json())
    .then((data) => {
      renameCourses(data.courses);
      return data;
    });
  return index;
}

/** Courses recorded under an id they had before (`formerly`) get their present one. */
function renameCourses(courses) {
  const now = new Map(courses.flatMap((c) => (c.formerly ?? []).map((old) => [old, c.id])));
  const progress = load();
  if (!progress.courses.some((id) => now.has(id))) return;
  progress.courses = [...new Set(progress.courses.map((id) => now.get(id) ?? id))];
  save(progress);
}

// --- transfer -------------------------------------------------------------

const toDay = (iso) => (iso ? Math.round((Date.parse(iso) - EPOCH) / DAY) : null);
const fromDay = (n) => (n === null ? undefined : new Date(EPOCH + n * DAY).toISOString().slice(0, 10));

async function pipe(bytes, stream) {
  const out = new Response(new Blob([bytes]).stream().pipeThrough(stream));
  return new Uint8Array(await out.arrayBuffer());
}

const base64url = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unbase64url = (text) => Uint8Array.from(atob(text.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

export async function encode(progress, data) {
  const codeOf = new Map(data.items.map((i) => [i.id, i.code]));
  const courseCode = new Map(data.courses.map((c) => [c.id, c.code]));
  const compact = {
    v: 1,
    i: Object.entries(progress.items)
      .filter(([id]) => codeOf.has(id))
      .map(([id, p]) => [codeOf.get(id), toDay(p.seen), toDay(p.done), p.quiz ?? null]),
    c: progress.courses.map((c) => courseCode.get(c)).filter(Boolean),
  };
  return base64url(await pipe(new TextEncoder().encode(JSON.stringify(compact)), new CompressionStream('deflate-raw')));
}

export async function decode(text, data) {
  const bytes = await pipe(unbase64url(text), new DecompressionStream('deflate-raw'));
  const compact = JSON.parse(new TextDecoder().decode(bytes));
  if (compact.v !== 1) throw new Error('unknown version');
  const idOf = new Map(data.items.map((i) => [i.code, i.id]));
  const courseOf = new Map(data.courses.map((c) => [c.code, c.id]));
  const progress = empty();
  for (const [code, seen, done, quiz] of compact.i) {
    const id = idOf.get(code);
    if (!id) continue; // an item removed since: ignore rather than fail
    progress.items[id] = { seen: fromDay(seen), done: fromDay(done), ...(quiz ? { quiz } : {}) };
  }
  progress.courses = compact.c.map((c) => courseOf.get(c)).filter(Boolean);
  return progress;
}
