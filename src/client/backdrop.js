// The page background: a faint grid of bits, like a memory field. Now and
// then a bit flips to 1 and back, and a byte travels along a row like a
// packet on a wire. The canvas sits behind everything and is masked in the
// middle (site.css), so the text column stays calm.

const SPACING = 26;
const FPS = 24;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const canvas = document.createElement('canvas');
canvas.className = 'backdrop';
canvas.setAttribute('aria-hidden', 'true');
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');

let width = 0;
let height = 0;
let cols = 0;
let rows = 0;
let colors = {};
let flips = [];
let packets = [];

function readColors() {
  const style = getComputedStyle(document.documentElement);
  const dark = style.colorScheme.includes('dark');
  colors = {
    grid: style.getPropertyValue('--ink').trim(),
    bit: style.getPropertyValue('--accent').trim(),
    gridAlpha: dark ? 0.11 : 0.09,
    bitAlpha: dark ? 0.55 : 0.45,
  };
}

function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  width = innerWidth;
  height = innerHeight;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  cols = Math.ceil(width / SPACING) + 1;
  rows = Math.ceil(height / SPACING) + 1;
}

const random = (n) => Math.floor(Math.random() * n);
const point = (c, r) => [c * SPACING + SPACING / 2, r * SPACING + SPACING / 2];

function cell(c, r, strength) {
  const [x, y] = point(c, r);
  const size = 2 + 5 * strength;
  ctx.globalAlpha = colors.bitAlpha * strength;
  ctx.fillStyle = colors.bit;
  ctx.beginPath();
  ctx.roundRect(x - size / 2, y - size / 2, size, size, 1.5);
  ctx.fill();
}

// A flipped bit: fades in, stays a while, fades out.
function newFlip(now) {
  return { c: random(cols), r: random(rows), start: now, hold: 2000 + random(4000) };
}

function flipStrength(f, now) {
  const t = now - f.start;
  if (t < 900) return t / 900;
  if (t < 900 + f.hold) return 1;
  return Math.max(0, 1 - (t - 900 - f.hold) / 1400);
}

// A byte on the move: eight bits, ones bright and zeros faint, with a trail.
function newPacket(now) {
  const byte = Array.from({ length: 8 }, () => Math.random() < 0.5);
  const fromLeft = Math.random() < 0.5;
  return { r: random(rows), byte, fromLeft, start: now, speed: 9 + Math.random() * 5 };
}

function drawPacket(p, now) {
  const head = ((now - p.start) / 1000) * p.speed;
  for (let i = 0; i < 8; i++) {
    const along = head - i;
    for (let trail = 0; trail < 3; trail++) {
      const pos = Math.floor(along) - trail;
      if (pos < 0 || pos >= cols + 8) continue;
      const c = p.fromLeft ? pos : cols - 1 - pos;
      const fade = trail === 0 ? 1 : 0.35 / trail;
      cell(c, p.r, (p.byte[i] ? 0.9 : 0.25) * fade);
    }
  }
  return head - 10 < cols;
}

function draw(now) {
  ctx.clearRect(0, 0, width, height);
  ctx.globalAlpha = colors.gridAlpha;
  ctx.fillStyle = colors.grid;
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const [x, y] = point(c, r);
      ctx.fillRect(x - 1, y - 1, 2, 2);
    }
  }
  flips = flips.filter((f) => {
    const s = flipStrength(f, now);
    if (s > 0) cell(f.c, f.r, s);
    return s > 0 || now - f.start < 900;
  });
  packets = packets.filter((p) => drawPacket(p, now));
  ctx.globalAlpha = 1;
}

let last = 0;
let nextPacket = 0;
let scheduled = false;
function schedule() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame((now) => {
    scheduled = false;
    frame(now);
  });
}

function frame(now) {
  if (now - last >= 1000 / FPS) {
    last = now;
    const target = Math.round((cols * rows) / 140);
    while (flips.length < target) flips.push(newFlip(now - random(800)));
    if (now >= nextPacket) {
      packets.push(newPacket(now));
      nextPacket = now + 4000 + random(5000);
    }
    draw(now);
  }
  if (!document.hidden) schedule();
}

readColors();
resize();
if (reduceMotion) {
  // A still picture: a few set bits, nothing moves.
  const now = performance.now();
  flips = Array.from({ length: Math.round((cols * rows) / 140) }, () => ({ ...newFlip(now - 900), hold: Infinity }));
  draw(now);
} else {
  nextPacket = performance.now() + 1500;
  schedule();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) schedule();
  });
}

const redraw = () => reduceMotion && draw(performance.now());
addEventListener('resize', () => {
  resize();
  flips = flips.filter((f) => f.c < cols && f.r < rows);
  redraw();
});
// The theme can change by button or by the system setting.
new MutationObserver(() => {
  readColors();
  redraw();
}).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  readColors();
  redraw();
});
