// Progress lives in local storage only (docs/knowledge-schema.md, §11).
// Items are recorded by id; for transfer they are encoded by their stable
// four-digit code and compressed, so that the link fits into a QR code.

export interface ItemProgress {
  /** Days are ISO dates (YYYY-MM-DD); finer timestamps would say more about a person than needed. */
  seen?: string;
  done?: string;
  quiz?: Record<string, 0 | 1>;
}

export interface Progress {
  v: 1;
  items: Record<string, ItemProgress>;
  courses: string[];
}

export interface SiteData {
  lang: 'de' | 'en';
  items: { id: string; code: number; title: string; url: string }[];
  paths: { id: string; code: number; title: string; url: string }[];
  courses: { id: string; code: number; access: string; title: string; url: string }[];
  labels: { done: string; of: string };
}

const KEY = 'hocs-progress';
const EPOCH = Date.UTC(2026, 0, 1);
const DAY = 86_400_000;

export const siteData = (): SiteData => JSON.parse(document.getElementById('site-data')!.textContent!);

const empty = (): Progress => ({ v: 1, items: {}, courses: [] });

export function load(): Progress {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    if (stored?.v === 1) return { ...empty(), ...stored };
  } catch {}
  return empty();
}

export function save(progress: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {}
  document.dispatchEvent(new CustomEvent('progress-change', { detail: progress }));
}

export const today = () => new Date().toISOString().slice(0, 10);

export function update(id: string, change: (p: ItemProgress) => void) {
  const progress = load();
  const item = (progress.items[id] ??= {});
  change(item);
  save(progress);
}

export const isDone = (progress: Progress, id: string) => !!progress.items[id]?.done;

export function merge(into: Progress, from: Progress): Progress {
  const min = (a?: string, b?: string) => (a && b ? (a < b ? a : b) : a ?? b);
  for (const [id, incoming] of Object.entries(from.items)) {
    const own = (into.items[id] ??= {});
    own.seen = min(own.seen, incoming.seen);
    own.done = min(own.done, incoming.done);
    if (incoming.quiz) {
      own.quiz ??= {};
      for (const [q, ok] of Object.entries(incoming.quiz)) own.quiz[q] = (own.quiz[q] || ok) as 0 | 1;
    }
  }
  into.courses = [...new Set([...into.courses, ...from.courses])];
  return into;
}

// --- transfer -------------------------------------------------------------

const toDay = (iso?: string) => (iso ? Math.round((Date.parse(iso) - EPOCH) / DAY) : null);
const fromDay = (n: number | null) => (n === null ? undefined : new Date(EPOCH + n * DAY).toISOString().slice(0, 10));

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream) {
  const out = new Response(new Blob([bytes as BlobPart]).stream().pipeThrough(stream));
  return new Uint8Array(await out.arrayBuffer());
}

const base64url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unbase64url = (text: string) =>
  Uint8Array.from(atob(text.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

export async function encode(progress: Progress, data: SiteData): Promise<string> {
  const codeOf = new Map(data.items.map((i) => [i.id, i.code]));
  const courseCode = new Map(data.courses.map((c) => [c.id, c.code]));
  const compact = {
    v: 1,
    i: Object.entries(progress.items)
      .filter(([id]) => codeOf.has(id))
      .map(([id, p]) => [codeOf.get(id), toDay(p.seen), toDay(p.done), p.quiz ?? null]),
    c: progress.courses.map((c) => courseCode.get(c)).filter(Boolean),
  };
  const bytes = new TextEncoder().encode(JSON.stringify(compact));
  return base64url(await pipe(bytes, new CompressionStream('deflate-raw')));
}

export async function decode(text: string, data: SiteData): Promise<Progress> {
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
  progress.courses = compact.c.map((c: number) => courseOf.get(c)).filter(Boolean);
  return progress;
}
