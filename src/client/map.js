// The map of all items and their relations, drawn as SVG with a small
// force layout (Fruchterman–Reingold). On load the nodes visibly settle
// into place once; after that the map is still. Hovering a node brings out
// its neighbours, a click opens the item.
import { load, isDone } from './progress.js';

const NS = 'http://www.w3.org/2000/svg';
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Deterministic start positions, so the map looks the same on every visit.
function seeded(text) {
  let h = 2166136261;
  for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

/** Positions in the unit square [0,1]², one step at a time. */
function* layout(nodes, links, aspect) {
  const n = nodes.length;
  const k = Math.sqrt(aspect / n) * 0.9;
  const pos = nodes.map((node) => {
    const random = seeded(node.id);
    return { x: 0.3 + random() * 0.4, y: 0.3 + random() * 0.4 };
  });
  const index = new Map(nodes.map((node, i) => [node.id, i]));
  const edges = links.map((l) => [index.get(l.source), index.get(l.target)]).filter(([a, b]) => a !== undefined && b !== undefined);
  let temperature = 0.12;
  for (let step = 0; step < 260; step++) {
    const disp = pos.map(() => ({ x: 0, y: 0 }));
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let dx = (pos[i].x - pos[j].x) * aspect;
        let dy = pos[i].y - pos[j].y;
        const d = Math.max(Math.hypot(dx, dy), 0.01);
        const f = (k * k) / d;
        dx = (dx / d) * f;
        dy = (dy / d) * f;
        disp[i].x += dx;
        disp[i].y += dy;
        disp[j].x -= dx;
        disp[j].y -= dy;
      }
    }
    for (const [a, b] of edges) {
      const dx = (pos[a].x - pos[b].x) * aspect;
      const dy = pos[a].y - pos[b].y;
      const d = Math.max(Math.hypot(dx, dy), 0.01);
      const f = (d * d) / k;
      disp[a].x -= (dx / d) * f;
      disp[a].y -= (dy / d) * f;
      disp[b].x += (dx / d) * f;
      disp[b].y += (dy / d) * f;
    }
    for (let i = 0; i < n; i++) {
      // a gentle pull to the middle keeps loose items on the map
      disp[i].x += (0.5 - pos[i].x) * aspect * 0.4 * k;
      disp[i].y += (0.5 - pos[i].y) * 0.4 * k;
      const d = Math.max(Math.hypot(disp[i].x, disp[i].y), 1e-9);
      const move = Math.min(d, temperature);
      pos[i].x = Math.min(1, Math.max(0, pos[i].x + ((disp[i].x / d) * move) / aspect));
      pos[i].y = Math.min(1, Math.max(0, pos[i].y + (disp[i].y / d) * move));
    }
    temperature *= 0.975;
    yield pos;
  }
}

function fit(pos) {
  const xs = pos.map((p) => p.x);
  const ys = pos.map((p) => p.y);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  return pos.map((p) => ({ x: x1 > x0 ? (p.x - x0) / (x1 - x0) : 0.5, y: y1 > y0 ? (p.y - y0) / (y1 - y0) : 0.5 }));
}

function mount(figure) {
  const svg = figure.querySelector('svg');
  const { nodes, links } = JSON.parse(figure.querySelector('.map-data').textContent);
  const el = (tag, attrs = {}) => {
    const node = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    return node;
  };

  const linkEls = links.map((l) => {
    const line = el('line', { class: `map-link ${l.rel}` });
    line.append(Object.assign(el('title'), { textContent: l.label }));
    svg.append(line);
    return line;
  });
  const nodeEls = nodes.map((node) => {
    const g = el('g', { class: 'map-node', tabindex: '0', role: 'link', 'aria-label': node.title });
    g.style.setProperty('--node', node.color);
    const icon = el('svg', { class: 'map-icon', x: -7, y: -7, width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    icon.innerHTML = node.icon; // shapes from the icon set, built into the page
    g.append(el('circle', { r: 13 }), icon, Object.assign(el('text', { dy: '0.35em' }), { textContent: node.title }));
    g.addEventListener('click', () => (location.href = node.url));
    g.addEventListener('keydown', (e) => e.key === 'Enter' && (location.href = node.url));
    svg.append(g);
    return g;
  });

  // Hover or focus: the node, its relations and its neighbours stay, the rest fades.
  const near = (id) => new Set([id, ...links.filter((l) => l.source === id || l.target === id).flatMap((l) => [l.source, l.target])]);
  nodeEls.forEach((g, i) => {
    const on = () => {
      const keep = near(nodes[i].id);
      figure.classList.add('is-focused');
      nodeEls.forEach((n, j) => n.classList.toggle('is-near', keep.has(nodes[j].id)));
      linkEls.forEach((l, j) => l.classList.toggle('is-near', links[j].source === nodes[i].id || links[j].target === nodes[i].id));
    };
    const off = () => figure.classList.remove('is-focused');
    g.addEventListener('pointerenter', on);
    g.addEventListener('pointerleave', off);
    g.addEventListener('focus', on);
    g.addEventListener('blur', off);
  });

  let unit = [];
  function draw() {
    const { width, height } = svg.getBoundingClientRect();
    if (!width || !height || !unit.length) return;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    // room for labels: wide on the right, some on the other sides
    const pad = { left: 24, right: Math.min(170, width * 0.32), top: 24, bottom: 24 };
    const points = fit(unit).map((p) => ({
      x: pad.left + p.x * (width - pad.left - pad.right),
      y: pad.top + p.y * (height - pad.top - pad.bottom),
    }));
    const at = new Map(nodes.map((node, i) => [node.id, points[i]]));
    links.forEach((l, i) => {
      const a = at.get(l.source);
      const b = at.get(l.target);
      if (!a || !b) return;
      linkEls[i].setAttribute('x1', a.x);
      linkEls[i].setAttribute('y1', a.y);
      linkEls[i].setAttribute('x2', b.x);
      linkEls[i].setAttribute('y2', b.y);
    });
    nodeEls.forEach((g, i) => g.setAttribute('transform', `translate(${points[i].x} ${points[i].y})`));
  }
  nodeEls.forEach((g) => g.querySelector('text').setAttribute('x', 19));

  const { width, height } = svg.getBoundingClientRect();
  const steps = layout(nodes, links, width && height ? width / height : 1.4);
  if (reduceMotion) {
    for (const p of steps) unit = p;
    draw();
  } else {
    // The one orchestrated moment: nodes appear one after another while the
    // layout settles, for a little over a second.
    nodeEls.forEach((g, i) => g.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 80 + i * 40, fill: 'backwards' }));
    linkEls.forEach((l) => l.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: 400, fill: 'backwards' }));
    let finished = false;
    const frame = () => {
      if (finished) return;
      let next;
      for (let i = 0; i < 4; i++) next = steps.next();
      if (next.value) unit = next.value.map((p) => ({ ...p }));
      draw();
      if (next.done) finished = true;
      else requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    // A window in the background gets no animation frames: then show the
    // finished map instead of an empty one.
    setTimeout(() => {
      if (finished) return;
      finished = true;
      for (const p of steps) unit = p;
      draw();
    }, 2000);
  }
  new ResizeObserver(draw).observe(svg);

  const mark = (progress) => nodeEls.forEach((g, i) => g.classList.toggle('is-done', isDone(progress, nodes[i].id)));
  mark(load());
  document.addEventListener('progress-change', (e) => mark(e.detail));

  return { nodes, nodeEls };
}

for (const figure of document.querySelectorAll('[data-map]')) {
  const map = mount(figure);
  // Topic chips on the map page dim everything outside the chosen topic;
  // ?topic=… in the address chooses one, and choosing one updates it.
  const chips = document.getElementById('map-topics');
  if (!chips) continue;
  const choose = (topic) => {
    map.nodeEls.forEach((g, i) => g.classList.toggle('is-dim', !!topic && !map.nodes[i].topics.includes(topic)));
    const params = new URLSearchParams(location.search);
    if (topic) params.set('topic', topic);
    else params.delete('topic');
    history.replaceState(history.state, '', `${location.pathname}${params.size ? `?${params}` : ''}`);
  };
  chips.addEventListener('change', (e) => choose(e.target.value));
  const wanted = new URLSearchParams(location.search).get('topic');
  const chip = wanted && chips.querySelector(`input[value="${CSS.escape(wanted)}"]`);
  if (chip) {
    chip.checked = true;
    choose(wanted);
  }
}
