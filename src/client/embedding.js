// The small text embedding model of the demonstrators on embeddings
// (client/meaning-map.js, client/word-arithmetic.js), loaded once for all of
// them on a page, and the few calculations they share. The model
// (all-MiniLM-L6-v2, 8 bits, about 23 MB) and transformers.js come from the
// site itself (scripts/fetch-embedding-model.mjs, scripts/build.mjs), whose
// places stand on <body>; nothing typed leaves the browser.
const { embedder: BASE, models: MODELS } = document.body.dataset;
export const MODEL = 'Xenova/all-MiniLM-L6-v2';

export const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
export const format = (x) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(2);
export const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k]);

let loading = null;
/**
 * The embedding and the tokens of a text, loaded on the first call; later
 * calls, from any demonstrator of the page, get the same model. `progress`
 * receives the loading events of transformers.js.
 */
export function embedder(progress) {
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
  })().catch((error) => {
    loading = null; // a later click tries again
    throw error;
  });
  return loading;
}

/** A progress function for embedder() that reports megabytes loaded of all files. */
export function megabytes(report) {
  const files = new Map();
  return (p) => {
    if (p.status !== 'progress' || !p.total) return;
    files.set(p.file, [p.loaded, p.total]);
    const [done, total] = [...files.values()].reduce((s, [a, b]) => [s[0] + a, s[1] + b], [0, 0]);
    report(Math.round(done / 1e6), Math.round(total / 1e6));
  };
}

/**
 * The first two principal components of the vectors, by power iteration, as
 * a function that projects any vector onto them. The projection is linear,
 * so that a parallelogram stays a parallelogram.
 */
export function components(vectors) {
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
    // the same picture on every computer: the point furthest out lies on the positive side
    const scores = centred.map((v) => dot(v, axis));
    const far = scores.reduce((best, s) => (Math.abs(s) > Math.abs(best) ? s : best), 0);
    found.push(far < 0 ? axis.map((x) => -x) : axis);
  }
  return (v) => found.map((axis) => dot(v.map((x, k) => x - mean[k]), axis));
}

/** An SVG element with its attributes. */
export const svgEl = (name, attributes) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', name);
  for (const [k, v] of Object.entries(attributes)) el.setAttribute(k, v);
  return el;
};
