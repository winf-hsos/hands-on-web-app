// The page background, one scene per area on a faint grid of dots. The
// canvas sits behind everything and is masked in the middle (site.css), so
// the text column stays calm.
//
// Computer science: the grid is a memory field. Now and then a bit flips to
// 1 and back, and a byte travels along a row like a packet on a wire.
// Data science: the grid is chart paper. Small, pale charts and data frames
// appear at the sides, move a little while they live, and fade away again.

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

function readColors() {
  const style = getComputedStyle(document.documentElement);
  const dark = style.colorScheme.includes('dark');
  colors = {
    grid: style.getPropertyValue('--ink').trim(),
    bit: style.getPropertyValue('--accent').trim(),
    gridAlpha: dark ? 0.11 : 0.09,
    bitAlpha: dark ? 0.55 : 0.45,
    // charts are larger than bits, so they stay paler
    lineAlpha: dark ? 0.3 : 0.24,
    fillAlpha: dark ? 0.16 : 0.12,
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
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const clamp01 = (t) => Math.min(1, Math.max(0, t));

function grid() {
  ctx.globalAlpha = colors.gridAlpha;
  ctx.fillStyle = colors.grid;
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const [x, y] = point(c, r);
      ctx.fillRect(x - 1, y - 1, 2, 2);
    }
  }
}

// --- computer science: bits and bytes -------------------------------------------------

function bitScene() {
  let flips = [];
  let packets = [];
  let nextPacket = 0;

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
  const newFlip = (now) => ({ c: random(cols), r: random(rows), start: now, hold: 2000 + random(4000) });
  function flipStrength(f, now) {
    const t = now - f.start;
    if (t < 900) return t / 900;
    if (t < 900 + f.hold) return 1;
    return Math.max(0, 1 - (t - 900 - f.hold) / 1400);
  }

  // A byte on the move: eight bits, ones bright and zeros faint, with a trail.
  function newPacket(now) {
    const byte = Array.from({ length: 8 }, () => Math.random() < 0.5);
    return { r: random(rows), byte, fromLeft: Math.random() < 0.5, start: now, speed: 9 + Math.random() * 5 };
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

  const target = () => Math.round((cols * rows) / 140);
  return {
    start(now) {
      nextPacket = now + 1500;
    },
    still(now) {
      // a still picture: a few set bits, nothing moves
      flips = Array.from({ length: target() }, () => ({ ...newFlip(now - 900), hold: Infinity }));
    },
    step(now) {
      while (flips.length < target()) flips.push(newFlip(now - random(800)));
      if (now >= nextPacket) {
        packets.push(newPacket(now));
        nextPacket = now + 4000 + random(5000);
      }
    },
    draw(now) {
      flips = flips.filter((f) => {
        const s = flipStrength(f, now);
        if (s > 0) cell(f.c, f.r, s);
        return s > 0 || now - f.start < 900;
      });
      packets = packets.filter((p) => drawPacket(p, now));
    },
    resized() {
      flips = flips.filter((f) => f.c < cols && f.r < rows);
    },
  };
}

// --- data science: small charts and data frames ---------------------------------------

function chartScene() {
  let charts = [];
  const KINDS = ['bars', 'line', 'scatter', 'table', 'donut'];

  // Where a chart may sit: in the margins beside the content, sized to fit
  // them; on a narrow screen anywhere, where the mask keeps it faint.
  // Charts do not overlap.
  function place() {
    const main = document.querySelector('main')?.getBoundingClientRect();
    const margin = main ? Math.max(0, main.left + 8) : 0;
    const w = Math.min(150, margin - 32);
    const roomy = w >= 90;
    const cw = roomy ? w : 130;
    const ch = Math.round(cw * 0.64);
    for (let attempt = 0; attempt < 30; attempt++) {
      const left = Math.random() < 0.5;
      const x = roomy ? (left ? 16 + Math.random() * (margin - cw - 32) : width - margin + 16 + Math.random() * (margin - cw - 32)) : 12 + Math.random() * (width - cw - 24);
      const y = 80 + Math.random() * Math.max(1, height - ch - 110);
      const free = charts.every((c) => Math.abs(c.x - x) > Math.max(c.w, cw) + 24 || Math.abs(c.y - y) > Math.max(c.h, ch) + 32);
      if (free) return { x, y, w: cw, h: ch };
    }
    return null;
  }

  const walk = (n, from = 0.5) => {
    let v = from;
    return Array.from({ length: n }, () => (v = clamp01(v + (Math.random() - 0.5) * 0.35)));
  };

  // the kind shown least at the moment, so that the charts vary
  const nextKind = () => KINDS.map((k) => [k, charts.filter((c) => c.kind === k).length + Math.random()]).sort((a, b) => a[1] - b[1])[0][0];

  function newChart(now, kind = nextKind()) {
    const at = place();
    if (!at) return null;
    const chart = { ...at, kind, start: now, life: 15000 + random(10000) };
    if (kind === 'bars') {
      chart.from = Array.from({ length: 6 }, () => 0);
      chart.to = Array.from({ length: 6 }, () => 0.2 + Math.random() * 0.8);
      chart.changed = now;
    } else if (kind === 'line') {
      chart.values = walk(16);
      chart.shifted = now;
    } else if (kind === 'scatter') {
      const slope = 0.4 + Math.random() * 0.5;
      chart.points = Array.from({ length: 26 }, () => {
        const x = Math.random();
        return [x, clamp01(0.15 + slope * x + (Math.random() - 0.5) * 0.35)];
      });
      chart.slope = slope;
    } else if (kind === 'donut') {
      chart.from = [0.25, 0.25, 0.25, 0.25];
      chart.to = shares();
      chart.changed = now;
    }
    return chart;
  }

  function shares() {
    const raw = Array.from({ length: 4 }, () => 0.3 + Math.random());
    const sum = raw.reduce((a, b) => a + b, 0);
    return raw.map((v) => v / sum);
  }

  // fade in for a second, live, fade out for one and a half
  function presence(c, now) {
    const t = now - c.start;
    if (t < 0) return 0;
    if (t < 1200) return ease(t / 1200);
    if (t < c.life) return 1;
    return Math.max(0, 1 - (t - c.life) / 1500);
  }

  const stroke = (alpha, colour = colors.bit) => {
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = colour;
    ctx.lineWidth = 1.25;
  };
  const fill = (alpha, colour = colors.bit) => {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = colour;
  };

  function axes(c, a) {
    stroke(colors.lineAlpha * 0.7 * a, colors.grid);
    ctx.beginPath();
    ctx.moveTo(c.x, c.y);
    ctx.lineTo(c.x, c.y + c.h);
    ctx.lineTo(c.x + c.w, c.y + c.h);
    ctx.stroke();
  }

  // Bars grow towards new values every few seconds.
  function bars(c, now, a) {
    if (now - c.changed > 3600) {
      c.from = c.to;
      c.to = c.to.map(() => 0.15 + Math.random() * 0.85);
      c.changed = now;
    }
    const k = ease(clamp01((now - c.changed) / 1600));
    axes(c, a);
    const gap = 6;
    const bw = (c.w - gap * (c.to.length + 1)) / c.to.length;
    c.to.forEach((to, i) => {
      const v = c.from[i] + (to - c.from[i]) * k;
      const h = v * (c.h - 6);
      const x = c.x + gap + i * (bw + gap);
      fill(colors.fillAlpha * a);
      ctx.fillRect(x, c.y + c.h - h, bw, h);
      stroke(colors.lineAlpha * a);
      ctx.beginPath();
      ctx.moveTo(x, c.y + c.h - h);
      ctx.lineTo(x + bw, c.y + c.h - h);
      ctx.stroke();
    });
  }

  // A time series that scrolls on like a ticker, one value at a time.
  function line(c, now, a) {
    const every = 1400;
    while (now - c.shifted > every) {
      c.values = [...c.values.slice(1), clamp01(c.values.at(-1) + (Math.random() - 0.5) * 0.35)];
      c.shifted += every;
    }
    const shift = (now - c.shifted) / every;
    axes(c, a);
    const step = c.w / (c.values.length - 2);
    const xy = (v, i) => [c.x + (i - shift) * step, c.y + c.h - 6 - v * (c.h - 12)];
    ctx.save();
    ctx.beginPath();
    ctx.rect(c.x, c.y - 4, c.w, c.h + 4);
    ctx.clip();
    stroke(colors.lineAlpha * 1.3 * a);
    ctx.beginPath();
    c.values.forEach((v, i) => ctx[i ? 'lineTo' : 'moveTo'](...xy(v, i)));
    ctx.stroke();
    ctx.restore();
    const [lx, ly] = xy(c.values.at(-2), c.values.length - 2);
    fill(colors.lineAlpha * 1.6 * a);
    ctx.beginPath();
    ctx.arc(lx, ly, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Points appear one after another, then the regression line.
  function scatter(c, now, a) {
    const shown = Math.floor((now - c.start - 600) / 220);
    axes(c, a);
    c.points.slice(0, Math.max(0, shown)).forEach(([px, py]) => {
      fill(colors.lineAlpha * 1.2 * a);
      ctx.beginPath();
      ctx.arc(c.x + 4 + px * (c.w - 8), c.y + c.h - 4 - py * (c.h - 8), 2.2, 0, Math.PI * 2);
      ctx.fill();
    });
    const lineIn = clamp01((shown - c.points.length) / 6);
    if (lineIn > 0) {
      stroke(colors.lineAlpha * 1.2 * a * lineIn, colors.grid);
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(c.x, c.y + c.h - 4 - 0.15 * (c.h - 8));
      ctx.lineTo(c.x + c.w, c.y + c.h - 4 - Math.min(1, 0.15 + c.slope) * (c.h - 8));
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // A data frame: header, rows of values as short strokes, and a highlight
  // that walks down the rows as if a loop went through them.
  function table(c, now, a) {
    const columns = 4;
    const rowsShown = 6;
    const rh = c.h / (rowsShown + 1);
    const cw = c.w / columns;
    const current = Math.floor((now - c.start) / 650) % rowsShown;
    fill(colors.fillAlpha * 0.9 * a, colors.grid);
    ctx.fillRect(c.x, c.y, c.w, rh);
    fill(colors.fillAlpha * 1.3 * a);
    ctx.fillRect(c.x, c.y + rh * (current + 1), c.w, rh);
    stroke(colors.lineAlpha * 0.6 * a, colors.grid);
    ctx.strokeRect(c.x + 0.5, c.y + 0.5, c.w, c.h);
    for (let i = 1; i < columns; i++) {
      ctx.beginPath();
      ctx.moveTo(c.x + i * cw + 0.5, c.y);
      ctx.lineTo(c.x + i * cw + 0.5, c.y + c.h);
      ctx.stroke();
    }
    c.cells ??= Array.from({ length: rowsShown * columns }, () => 0.3 + Math.random() * 0.55);
    stroke(colors.lineAlpha * 0.9 * a, colors.grid);
    for (let r = 0; r < rowsShown; r++) {
      for (let k = 0; k < columns; k++) {
        const y = c.y + rh * (r + 1.5);
        const x = c.x + k * cw + 6;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + (cw - 12) * c.cells[r * columns + k], y);
        ctx.stroke();
      }
    }
  }

  // A ring of four shares that slowly shift.
  function donut(c, now, a) {
    if (now - c.changed > 4200) {
      c.from = c.to;
      c.to = shares();
      c.changed = now;
    }
    const k = ease(clamp01((now - c.changed) / 1800));
    const r = c.h / 2 - 4;
    const cx = c.x + c.w / 2;
    const cy = c.y + c.h / 2;
    let angle = -Math.PI / 2;
    c.to.forEach((to, i) => {
      const share = c.from[i] + (to - c.from[i]) * k;
      const end = angle + share * Math.PI * 2;
      stroke(colors.lineAlpha * (0.6 + i * 0.35) * a);
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.arc(cx, cy, r, angle + 0.04, end - 0.04);
      ctx.stroke();
      angle = end;
    });
    ctx.lineWidth = 1.25;
  }

  const DRAW = { bars, line, scatter, table, donut };
  // a few at a time: about one for every 170 pixels of height, at most five
  const target = () => Math.max(2, Math.min(5, Math.round(height / 170)));

  return {
    start() {},
    still(now) {
      // a still picture: some charts, nothing moves
      charts = [];
      for (let i = 0; i < target(); i++) {
        const c = newChart(now - 20000, KINDS[i % KINDS.length]);
        if (c) charts.push({ ...c, life: Infinity });
      }
    },
    step(now) {
      charts = charts.filter((c) => presence(c, now) > 0 || now - c.start < 1200);
      if (charts.length < target()) {
        // a new chart now and then, not all at once
        const c = newChart(now + random(2500));
        if (c) charts.push(c);
      }
    },
    draw(now) {
      for (const c of charts) {
        const a = presence(c, now);
        if (a > 0) DRAW[c.kind](c, now, a);
      }
    },
    resized() {
      charts = charts.filter((c) => c.x + c.w < width && c.y + c.h < height);
    },
  };
}

// --- running the scene ----------------------------------------------------------------

const scene = document.documentElement.dataset.area === 'ds' ? chartScene() : bitScene();

function draw(now) {
  ctx.clearRect(0, 0, width, height);
  grid();
  scene.draw(now);
  ctx.globalAlpha = 1;
}

let last = 0;
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
    scene.step(now);
    draw(now);
  }
  if (!document.hidden) schedule();
}

readColors();
resize();
if (reduceMotion) {
  scene.still(performance.now());
  draw(performance.now());
} else {
  scene.start(performance.now());
  schedule();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) schedule();
  });
}

const redraw = () => reduceMotion && draw(performance.now());
addEventListener('resize', () => {
  resize();
  scene.resized();
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
