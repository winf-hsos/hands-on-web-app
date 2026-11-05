// A map of meaning (Nicolas, 2026-11-05, for the experiment on text
// embeddings): a small embedding model runs in the browser and turns every
// text into 384 numbers. The texts of the block, numbered like the printed
// cards, appear as dots on a map, the shadow of those 384 numbers on two
// (the first two principal components of the cards). A search ranks the cards
// by how similar their numbers are to those of the query and shows next to it
// what a search for the same words would have found; the query lands on the
// map with lines to its three nearest cards. Two texts of one's own can be
// compared directly, and the first numbers of the query are shown, so that it
// is visible what the model makes of a text. Under the query and under both
// texts of the comparison stand the tokens the model cuts them into, with the
// two markers it adds at the start and the end.
//
// An empty block is the map without cards: only the comparison and the
// tokens, for single words before the experiment goes on to whole texts.
//
// The model (all-MiniLM-L6-v2, 8 bits, about 23 MB) and transformers.js come
// from the site itself (scripts/fetch-embedding-model.mjs, scripts/build.mjs)
// and are loaded only on a click; nothing typed leaves the browser.
//
// Written with ```meaning-map in Markdown, one text per line in the block
// (remark-knowledge.mjs passes them as data-meaning-map); the labels and the
// places of the runtime and the model come from <body>.
import { keys, steady } from './demo-frame.js';

const L = JSON.parse(document.body.dataset.meaningMapLabels ?? '{}');
const { embedder: BASE, models: MODELS } = document.body.dataset;
const MODEL = 'Xenova/all-MiniLM-L6-v2';
const SHOWN = 5; // results in the list
const LINES = 3; // lines from the query to its nearest cards
const DIGITS = 10; // numbers of the query shown
const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k]);
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const format = (x) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(2);

// words too common to count as a keyword match
const STOP = new Set('a an the and or but of to in on at by for from with as is are was were be been has have had do does did not no it its this that these those i you he she we they my your his her our their me him us them so up out off all every still again when than then there here into over very just'.split(' '));
const words = (text) => new Set(text.toLowerCase().match(/[\p{L}\p{N}']+/gu)?.filter((w) => w.length > 1 && !STOP.has(w)) ?? []);

let loading = null;
/** The embedding and the tokens of a text, loaded once for all maps of the page. */
function embedder(progress) {
  loading ??= (async () => {
    const { pipeline, env } = await import(`${BASE}transformers.min.js`);
    env.allowRemoteModels = false;
    env.allowLocalModels = true;
    env.localModelPath = MODELS;
    env.backends.onnx.wasm.wasmPaths = BASE;
    env.backends.onnx.wasm.numThreads = 1;
    const extract = await pipeline('feature-extraction', MODEL, { dtype: 'q8', device: 'wasm', progress_callback: progress });
    return {
      embed: async (text) => Array.from((await extract(text, { pooling: 'mean', normalize: true })).data),
      tokens: (text) => ['[CLS]', ...extract.tokenizer.tokenize(text), '[SEP]'],
    };
  })();
  return loading;
}

/** The first two principal components of the vectors, by power iteration. */
function components(vectors) {
  const d = vectors[0].length;
  const mean = Array(d).fill(0);
  for (const v of vectors) v.forEach((x, k) => (mean[k] += x / vectors.length));
  const centred = vectors.map((v) => v.map((x, k) => x - mean[k]));
  const found = [];
  for (let c = 0; c < 2; c++) {
    let axis = Array.from({ length: d }, (_, k) => Math.sin(k * 7 + c * 3 + 1));
    for (let step = 0; step < 200; step++) {
      const scores = centred.map((v) => dot(v, axis));
      let next = Array(d).fill(0);
      centred.forEach((v, i) => v.forEach((x, k) => (next[k] += x * scores[i])));
      for (const other of found) {
        const q = dot(next, other);
        next = next.map((x, k) => x - q * other[k]);
      }
      const norm = Math.hypot(...next) || 1;
      axis = next.map((x) => x / norm);
    }
    // the same picture on every computer: the card furthest out lies on the positive side
    const scores = centred.map((v) => dot(v, axis));
    const far = scores.reduce((best, s) => (Math.abs(s) > Math.abs(best) ? s : best), 0);
    found.push(far < 0 ? axis.map((x) => -x) : axis);
  }
  return (v) => found.map((axis) => dot(v.map((x, k) => x - mean[k]), axis));
}

/**
 * The dots pushed apart where they would cover each other, so that every
 * number stays readable: a small change to the shadow, never more than the
 * size of a dot.
 */
function apart(points, gap = 8) {
  const p = points.map(([x, y]) => [x, y]);
  for (let round = 0; round < 80; round++) {
    let moved = false;
    for (let i = 0; i < p.length; i++) {
      for (let j = i + 1; j < p.length; j++) {
        const dx = p[j][0] - p[i][0];
        const dy = p[j][1] - p[i][1];
        const d = Math.hypot(dx, dy);
        if (d >= gap) continue;
        const [ux, uy] = d > 1e-6 ? [dx / d, dy / d] : [Math.cos(i + j), Math.sin(i + j)];
        const push = (gap - d) / 2;
        p[i] = [p[i][0] - ux * push, p[i][1] - uy * push];
        p[j] = [p[j][0] + ux * push, p[j][1] + uy * push];
        moved = true;
      }
    }
    if (!moved) break;
  }
  return p.map(([x, y]) => [Math.min(103, Math.max(-3, x)), Math.min(103, Math.max(-3, y))]);
}

function setup(box) {
  const texts = JSON.parse(box.dataset.meaningMap || '[]');
  const n = box.dataset.n ?? Math.random().toString(36).slice(2, 7);
  const cards = texts.length > 0; // an empty block compares words only
  const map = `
      <div class="mm-map-place">
        <svg class="mm-map" viewBox="-6 -6 112 112" role="img" aria-label="${L.map}"></svg>
        <p class="mm-hover" data-out="hover">${L.hover}</p>
        <p class="mm-caption">${L.caption}</p>
      </div>
      <div class="mm-side">
        <form class="mm-form" data-search>
          <label class="dg-label" for="mm-query-${n}">${L.search}</label>
          <input class="mm-input" id="mm-query-${n}" type="text" autocomplete="off" spellcheck="false" placeholder="${L.searchPlaceholder}">
          <button type="submit" class="button">${L.find}</button>
        </form>
        <p class="mm-tokens" data-out="tokens-q"></p>
        <ol class="mm-results" aria-live="polite"></ol>
        <p class="mm-keyword" data-out="keyword"></p>
        <p class="mm-numbers" data-out="numbers"></p>
      </div>`;
  box.innerHTML = `
    <div class="mm-start">
      <p>${cards ? L.intro : L.introWords}</p>
      <button type="button" class="button" data-load>${L.load}</button>
      <p class="mm-status" data-out="status" aria-live="polite"></p>
    </div>
    <div class="mm-main${cards ? '' : ' is-words'}" hidden>${cards ? map : ''}
      <form class="mm-form mm-compare" data-compare>
        <p class="dg-label">${cards ? L.compare : L.compareWords}</p>
        <input class="mm-input" type="text" autocomplete="off" spellcheck="false" aria-label="${L.textA}" placeholder="${cards ? L.textA : L.wordA}" data-a>
        <input class="mm-input" type="text" autocomplete="off" spellcheck="false" aria-label="${L.textB}" placeholder="${cards ? L.textB : L.wordB}" data-b>
        <button type="submit" class="button">${L.measure}</button>
        <p class="mm-similarity" data-out="similarity" aria-live="polite"></p>
        <p class="mm-tokens" data-out="tokens-a"></p>
        <p class="mm-tokens" data-out="tokens-b"></p>
      </form>
    </div>`;

  const $ = (selector) => box.querySelector(selector);
  const out = (name) => $(`[data-out="${name}"]`);
  const svg = $('.mm-map');
  const results = $('.mm-results');
  const show = {
    status: steady(out('status'), [L.ready, fill(L.loading, { done: 99, total: 99 }), fill(L.placing, { n: texts.length }), L.failed]),
    keyword: cards && steady(out('keyword'), [L.keywordHint, fill(L.keywordHits, { cards: texts.map((_, i) => i + 1).slice(0, 8).join(', ') }), L.keywordNone]),
    similarity: steady(out('similarity'), [L.compareHint, fill(L.similarity, { value: '−0.00' })]),
  };
  show.status(L.ready);
  if (cards) show.keyword(L.keywordHint);
  show.similarity(L.compareHint);

  let embed = null;
  let tokens = null;
  let vectors = [];
  let place = null;
  let points = [];

  const svgEl = (name, attributes) => {
    const el = document.createElementNS('http://www.w3.org/2000/svg', name);
    for (const [k, v] of Object.entries(attributes)) el.setAttribute(k, v);
    return el;
  };

  /** The tokens of a text as small chips after a short label. */
  function chips(place, label, text) {
    const list = tokens(text);
    place.replaceChildren(
      Object.assign(document.createElement('span'), { className: 'mm-token-label', textContent: fill(label, { n: list.length }) }),
      ...list.map((t) => Object.assign(document.createElement('span'), { className: `mm-token${t.startsWith('[') ? ' is-marker' : ''}`, textContent: t })),
    );
  }

  function draw(query) {
    svg.replaceChildren();
    const lines = svgEl('g', { class: 'mm-lines' });
    svg.append(lines);
    const nearest = query ? query.ranking.slice(0, LINES).map((r) => r.i) : [];
    points.forEach(([x, y], i) => {
      const g = svgEl('g', { class: `mm-dot${nearest.includes(i) ? ' is-near' : ''}`, tabindex: '0' });
      g.append(svgEl('circle', { cx: x, cy: y, r: 3.6 }));
      const label = svgEl('text', { x, y: y + 1.35, 'text-anchor': 'middle' });
      label.textContent = i + 1;
      const title = svgEl('title', {});
      title.textContent = `${i + 1}  ${texts[i]}`;
      g.append(label, title);
      svg.append(g);
    });
    if (!query) return;
    const [qx, qy] = query.point;
    for (const i of nearest) lines.append(svgEl('line', { x1: qx, y1: qy, x2: points[i][0], y2: points[i][1] }));
    const star = svgEl('g', { class: 'mm-query' });
    const r = 4.2;
    const corners = Array.from({ length: 10 }, (_, k) => {
      const a = (Math.PI / 5) * k - Math.PI / 2;
      const len = k % 2 ? r * 0.45 : r;
      return `${(qx + len * Math.cos(a)).toFixed(2)},${(qy + len * Math.sin(a)).toFixed(2)}`;
    });
    star.append(svgEl('polygon', { points: corners.join(' ') }));
    const title = svgEl('title', {});
    title.textContent = query.text;
    star.append(title);
    svg.append(star);
  }

  async function load() {
    $('[data-load]').disabled = true;
    const files = new Map();
    try {
      ({ embed, tokens } = await embedder((p) => {
        if (p.status !== 'progress' || !p.total) return;
        files.set(p.file, [p.loaded, p.total]);
        const [done, total] = [...files.values()].reduce((s, [a, b]) => [s[0] + a, s[1] + b], [0, 0]);
        show.status(fill(L.loading, { done: Math.round(done / 1e6), total: Math.round(total / 1e6) }));
      }));
      show.status(fill(L.placing, { n: texts.length }));
      vectors = [];
      for (const text of texts) vectors.push(await embed(text));
    } catch (error) {
      console.error(error);
      show.status(L.failed);
      $('[data-load]').disabled = false;
      return;
    }
    $('.mm-start').hidden = true;
    $('.mm-main').hidden = false;
    if (!cards) {
      $('[data-a]').focus();
      return;
    }
    place = components(vectors);
    const raw = vectors.map(place);
    const xs = raw.map((p) => p[0]);
    const ys = raw.map((p) => p[1]);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const scale = (p) => [((p[0] - x0) / (x1 - x0 || 1)) * 100, ((p[1] - y0) / (y1 - y0 || 1)) * 100];
    place = ((project) => (v) => scale(project(v)))(place);
    points = apart(vectors.map(place));
    draw(null);
    $('[data-search] input').focus();
  }

  async function search(text) {
    if (!embed || !text.trim()) return;
    const vector = await embed(text);
    chips(out('tokens-q'), L.tokens, text);
    const ranking = vectors.map((v, i) => ({ i, value: dot(vector, v) })).sort((a, b) => b.value - a.value);
    const asked = words(text);
    const shared = (i) => [...words(texts[i])].filter((w) => asked.has(w));
    results.replaceChildren(
      ...ranking.slice(0, SHOWN).map(({ i, value }) => {
        const li = Object.assign(document.createElement('li'), { className: 'mm-result' });
        const bar = Object.assign(document.createElement('span'), { className: 'mm-bar' });
        bar.style.setProperty('--share', Math.max(0, value).toFixed(3));
        li.append(
          Object.assign(document.createElement('span'), { className: 'mm-value', textContent: format(value) }),
          bar,
          Object.assign(document.createElement('span'), { className: 'mm-card', textContent: i + 1 }),
          Object.assign(document.createElement('span'), { className: 'mm-text', textContent: texts[i] }),
        );
        if (shared(i).length) li.append(Object.assign(document.createElement('span'), { className: 'mm-shared', textContent: fill(L.shared, { words: shared(i).join(', ') }) }));
        return li;
      }),
    );
    const hits = texts.map((_, i) => i).filter((i) => shared(i).length);
    show.keyword(hits.length ? fill(L.keywordHits, { cards: hits.map((i) => i + 1).join(', ') }) : L.keywordNone);
    out('numbers').textContent = fill(L.numbers, { n: vector.length, first: vector.slice(0, DIGITS).map(format).join('  ') });
    draw({ text, ranking, point: place(vector) });
  }

  async function compare(a, b) {
    if (!embed || !a.trim() || !b.trim()) return;
    const [va, vb] = [await embed(a), await embed(b)];
    show.similarity(fill(L.similarity, { value: format(dot(va, vb)) }));
    chips(out('tokens-a'), L.tokensA, a);
    chips(out('tokens-b'), L.tokensB, b);
  }

  $('[data-load]').addEventListener('click', load);
  $('[data-search]')?.addEventListener('submit', (e) => {
    e.preventDefault();
    search($('[data-search] input').value);
  });
  $('[data-compare]').addEventListener('submit', (e) => {
    e.preventDefault();
    compare($('[data-a]').value, $('[data-b]').value);
  });
  // a dot under the pointer or in focus shows its text below the map, the
  // star the query it stands for
  const hover = (e) => {
    const dot = e.target.closest?.('.mm-dot, .mm-query');
    out('hover').textContent = dot ? dot.querySelector('title').textContent : L.hover;
  };
  svg?.addEventListener('pointerover', hover);
  svg?.addEventListener('focusin', hover);
  svg?.addEventListener('pointerleave', () => (out('hover').textContent = L.hover));

  keys(box, [['L', L.keyLoad], ...(cards ? [['S', L.keySearch]] : []), ['C', L.keyCompare]], (key) => {
    const k = key.toLowerCase();
    if (k === 'l' && !embed) load();
    else if (k === 's' && embed && cards) $('[data-search] input').focus();
    else if (k === 'c' && embed) $('[data-a]').focus();
    else return false;
    return true;
  });
}

document.querySelectorAll('[data-meaning-map]').forEach((box, i) => {
  box.dataset.n = i;
  setup(box);
});
