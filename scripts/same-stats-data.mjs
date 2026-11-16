// Writes the point clouds of the demonstrator "Same numbers, different
// pictures" (client/same-stats.js) to src/client/same-stats-data.js.
//
// The method is the one of Matejka and Fitzmaurice (2017), "Same Stats,
// Different Graphs": a start cloud of points is nudged, one point at a time,
// towards a target shape, and a nudge is only kept if the means, standard
// deviations and the correlation stay the same to two decimals. Every shape
// starts from the same cloud, so point i of one shape belongs to point i of
// every other, and the demonstrator can move each point from one picture to
// the next. The shapes are our own; the original Datasaurus data are not used.
//
// Coordinates are kept in hundredths as integers, so that the values the
// check sees are exactly the values that are stored and shown.
//
// Usage: node scripts/same-stats-data.mjs

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const N = 142;
// deliberately crooked values, so that they look measured and not chosen
const MEAN_X = 48.26;
const MEAN_Y = 51.83;
const SD_X = 19.64;
const SD_Y = 20.37;
const R = -0.06;
const ITERATIONS = 2_500_000;
const LOW = 0;
const HIGH = 10_000; // hundredths: the plot runs from 0 to 100

// --- a seeded generator, so that the file is the same on every run ----------
let state = 20171106;
const random = () => {
  state = (1664525 * state + 1013904223) >>> 0;
  return state / 4294967296;
};
const gauss = () => Math.sqrt(-2 * Math.log(Math.max(random(), 1e-12))) * Math.cos(2 * Math.PI * random());

// --- statistics on hundredths, kept as running sums -------------------------
function sums(xs, ys) {
  let sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0;
  for (let i = 0; i < xs.length; i++) {
    sx += xs[i]; sy += ys[i];
    sxx += xs[i] * xs[i]; syy += ys[i] * ys[i]; sxy += xs[i] * ys[i];
  }
  return { sx, sy, sxx, syy, sxy };
}

/** Means, sample standard deviations and Pearson's r, in plot units.
    client/same-stats.js computes them in exactly the same way. */
function stats({ sx, sy, sxx, syy, sxy }, n = N) {
  const mx = sx / n, my = sy / n;
  const vx = (sxx - n * mx * mx) / (n - 1);
  const vy = (syy - n * my * my) / (n - 1);
  const cov = (sxy - n * mx * my) / (n - 1);
  return [mx / 100, my / 100, Math.sqrt(vx) / 100, Math.sqrt(vy) / 100, cov / Math.sqrt(vx * vy)];
}
const key = (s) => s.map((v) => v.toFixed(2)).join(' ');

// --- the start cloud: random, then set to the wanted statistics exactly -----
function startCloud() {
  const a = Array.from({ length: N }, gauss);
  const b = Array.from({ length: N }, gauss);
  const standard = (v) => {
    const m = v.reduce((s, x) => s + x, 0) / v.length;
    const sd = Math.sqrt(v.reduce((s, x) => s + (x - m) ** 2, 0) / (v.length - 1));
    return v.map((x) => (x - m) / sd);
  };
  const za = standard(a);
  // remove from b what it shares with a, then mix in the wanted correlation
  const r = za.reduce((s, x, i) => s + x * b[i], 0) / (N - 1);
  const zo = standard(b.map((x, i) => x - r * za[i]));
  const zb = zo.map((z, i) => R * za[i] + Math.sqrt(1 - R * R) * z);
  return {
    xs: za.map((z) => Math.round((MEAN_X + SD_X * z) * 100)),
    ys: zb.map((z) => Math.round((MEAN_Y + SD_Y * z) * 100)),
  };
}

// --- target shapes: a function that gives the distance of a point to it -----
const segment = (x1, y1, x2, y2) => (x, y) => {
  const dx = x2 - x1, dy = y2 - y1;
  const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
};
const ring = (cx, cy, r) => (x, y) => Math.abs(Math.hypot(x - cx, y - cy) - r);
const nearest = (parts) => (x, y) => Math.min(...parts.map((p) => p(x, y)));

function star(cx, cy, outer, inner) {
  const corners = Array.from({ length: 10 }, (_, i) => {
    const angle = Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 ? inner : outer;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });
  return nearest(corners.map(([x, y], i) => segment(x, y, ...corners[(i + 1) % 10])));
}

function heart(cx, cy, size) {
  // the classic heart curve, as many short segments
  const points = Array.from({ length: 73 }, (_, i) => {
    const t = (i / 72) * 2 * Math.PI;
    const x = 16 * Math.sin(t) ** 3;
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    return [cx + (x * size) / 16, cy + (y * size) / 16];
  });
  return nearest(points.slice(0, -1).map(([x, y], i) => segment(x, y, ...points[i + 1])));
}

const SHAPES = {
  circle: ring(50, 50, 28),
  bullseye: nearest([ring(50, 50, 34), ring(50, 50, 14)]),
  star: star(50, 50, 42, 18),
  heart: heart(50, 48, 34),
  cross: nearest([segment(18, 18, 82, 82), segment(18, 82, 82, 18)]),
  'h-lines': nearest([20, 40, 60, 80].map((y) => segment(10, y, 90, y))),
  'v-lines': nearest([20, 40, 60, 80].map((x) => segment(x, 10, x, 90))),
  slant: nearest([-30, 0, 30].map((d) => segment(10, 10 + d, 90 - d, 90))),
};

// --- simulated annealing towards one shape ---------------------------------
function anneal(start, distance) {
  const xs = [...start.xs], ys = [...start.ys];
  const s = sums(xs, ys);
  const target = key(stats(s));
  for (let step = 0; step < ITERATIONS; step++) {
    const temperature = 0.4 - (0.39 * step) / ITERATIONS;
    const i = Math.floor(random() * N);
    const nx = Math.round(xs[i] + gauss() * 20); // about 0.2 plot units
    const ny = Math.round(ys[i] + gauss() * 20);
    if (nx < LOW || nx > HIGH || ny < LOW || ny > HIGH) continue;
    const before = distance(xs[i] / 100, ys[i] / 100);
    const after = distance(nx / 100, ny / 100);
    if (after >= before && random() >= temperature * 0.05) continue;
    const t = {
      sx: s.sx - xs[i] + nx, sy: s.sy - ys[i] + ny,
      sxx: s.sxx - xs[i] * xs[i] + nx * nx, syy: s.syy - ys[i] * ys[i] + ny * ny,
      sxy: s.sxy - xs[i] * ys[i] + nx * ny,
    };
    if (key(stats(t)) !== target) continue;
    xs[i] = nx; ys[i] = ny;
    Object.assign(s, t);
  }
  return { xs, ys };
}

let cloud = startCloud();
while ([...cloud.xs, ...cloud.ys].some((v) => v < 300 || v > 9700)) cloud = startCloud();
const target = key(stats(sums(cloud.xs, cloud.ys)));
const edge = stats(sums(cloud.xs, cloud.ys)).some((v) => Math.abs(((Math.abs(v) * 100) % 1) - 0.5) < 0.2);
if (edge) throw new Error('a statistic of the start cloud lies near a rounding edge; change the seed');
const shapes = { cloud };
for (const [name, distance] of Object.entries(SHAPES)) {
  shapes[name] = anneal(cloud, distance);
  const got = key(stats(sums(shapes[name].xs, shapes[name].ys)));
  if (got !== target) throw new Error(`${name}: ${got} instead of ${target}`);
  const mean = shapes[name].xs.reduce((sum, x, i) => sum + distance(x / 100, shapes[name].ys[i] / 100), 0) / N;
  console.log(`${name.padEnd(9)} mean distance to the shape ${mean.toFixed(2)}`);
}
console.log(`all shapes: ${target}`);

const lines = Object.entries(shapes).map(
  ([name, { xs, ys }]) => `  '${name}': [${xs.map((x, i) => `${x},${ys[i]}`).join(',')}],`,
);
const out = join(import.meta.dirname, '..', 'src', 'client', 'same-stats-data.js');
writeFileSync(
  out,
  `// Written by scripts/same-stats-data.mjs, do not edit by hand.
// Point clouds of the demonstrator "Same numbers, different pictures"
// (client/same-stats.js): ${N} points per shape as x,y pairs in hundredths of
// the plot (0 to 10000). Point i of every shape comes from point i of the
// cloud, and all shapes share the statistics ${target}
// (means, standard deviations of x and y, correlation).
export const SHAPES = {
${lines.join('\n')}
};
`,
);
console.log(`written to ${out}`);
