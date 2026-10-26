// The map: every topic is a large node, its items sit as small nodes in a
// ring around it. An item with two or more topics sits between them and is
// linked to each, so shared items become the bridges between topics, and
// topics that share items are drawn close to each other. Item titles show
// on hover or when a topic is chosen, so that the overview stays calm. On
// load the items fly out of their topics once; after that the map is still.
import { load, isDone } from './progress.js';

const NS = 'http://www.w3.org/2000/svg';
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ITEM_R = 10;
const TOPIC_R = 22;
const GAP = 46; // free space between the rings of two topics

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

/** Radius of the ring of items around each topic, from how many it holds alone. */
function rings(topics, items) {
  return topics.map((t) => {
    const alone = items.filter((i) => i.topics.length === 1 && i.topics[0] === t.id).length;
    return Math.max(TOPIC_R + 30, (alone * (ITEM_R * 2 + 10)) / (2 * Math.PI * 0.8));
  });
}

/**
 * Topic centres in pixels: rings must not overlap, topics that share items
 * pull towards each other, and everything stays inside the box.
 */
function placeTopics(topics, items, ring, width, height) {
  const n = topics.length;
  const shared = topics.map((a) => topics.map((b) => (a === b ? 0 : items.filter((i) => i.topics.includes(a.id) && i.topics.includes(b.id)).length)));
  // closest two topics may come: their rings, a gap, and room for a name
  const apart = (i, j) => ring[i] + ring[j] + GAP + 24;
  const pos = topics.map((t, i) => {
    const random = seeded(t.id);
    const angle = (i / n) * 2 * Math.PI + random() * 0.4;
    return { x: Math.cos(angle) * 200, y: Math.sin(angle) * 200 };
  });
  for (let step = 0; step < 300; step++) {
    const cool = 1 - step / 300;
    const move = pos.map(() => ({ x: 0, y: 0 }));
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = pos[j].x - pos[i].x;
        const dy = pos[j].y - pos[i].y;
        const d = Math.max(Math.hypot(dx, dy), 1);
        // topics that share items pull together; the others only keep some
        // distance, so that groups without shared items stay close as well
        const f = shared[i][j] ? (d - apart(i, j)) * 0.04 * Math.min(shared[i][j], 3) : -Math.max(0, apart(i, j) * 1.3 - d) * 0.05;
        move[i].x += (dx / d) * f;
        move[i].y += (dy / d) * f;
        move[j].x -= (dx / d) * f;
        move[j].y -= (dy / d) * f;
      }
      move[i].x -= pos[i].x * 0.03;
      move[i].y -= pos[i].y * 0.03;
    }
    pos.forEach((p, i) => {
      p.x += move[i].x * cool;
      p.y += move[i].y * cool;
    });
    // rings never overlap: push every pair that is too close apart
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = pos[j].x - pos[i].x;
        const dy = pos[j].y - pos[i].y;
        const d = Math.max(Math.hypot(dx, dy), 0.01);
        const short = apart(i, j) - d;
        if (short <= 0) continue;
        pos[i].x -= (dx / d) * short * 0.5;
        pos[i].y -= (dy / d) * short * 0.5;
        pos[j].x += (dx / d) * short * 0.5;
        pos[j].y += (dy / d) * short * 0.5;
      }
    }
  }

  // Fill the box: spread the centres as far as the box allows (rings keep
  // their size), then centre everything. A name needs room above its ring.
  const reach = (i) => ring[i] + ITEM_R + 6;
  const extent = (s) => {
    const xs = pos.flatMap((p, i) => [p.x * s - reach(i), p.x * s + reach(i)]);
    const ys = pos.flatMap((p, i) => [p.y * s - reach(i) - 24, p.y * s + reach(i)]);
    return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
  };
  const fits = (k) => {
    const e = extent(k);
    return e.x1 - e.x0 <= width - 16 && e.y1 - e.y0 <= height - 8;
  };
  // at 1 the rings keep their distance; wider if there is room, narrower
  // only where the box is too small for that (a phone, the start page)
  let s = 1;
  if (fits(1)) while (s < 2.5 && fits(s + 0.02)) s += 0.02;
  else while (s > 0.4 && !fits(s)) s -= 0.02;
  const e = extent(s);
  const ox = (width - (e.x1 - e.x0)) / 2 - e.x0;
  const oy = (height - (e.y1 - e.y0)) / 2 - e.y0;
  return pos.map((p) => ({ x: p.x * s + ox, y: p.y * s + oy }));
}

/** Item positions: on the ring of their only topic, or between their topics. */
function placeItems(topics, items, ring, centre) {
  const index = new Map(topics.map((t, i) => [t.id, i]));
  const at = new Map();
  topics.forEach((t, ti) => {
    const alone = items.filter((i) => i.topics.length === 1 && i.topics[0] === t.id);
    // spread over the ring but leave the top free for the topic's name
    const from = -Math.PI / 2 + 0.55;
    const span = 2 * Math.PI - 1.1;
    alone.forEach((item, k) => {
      const angle = from + (alone.length === 1 ? span / 2 : (k / (alone.length - 1)) * span);
      at.set(item.id, { x: centre[ti].x + Math.cos(angle) * ring[ti], y: centre[ti].y + Math.sin(angle) * ring[ti] });
    });
  });
  // shared items: in the middle of their topics, side by side if several share them
  const groups = new Map();
  for (const item of items.filter((i) => i.topics.length > 1)) {
    const key = [...item.topics].sort().join('+');
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  for (const group of groups.values()) {
    const ids = group[0].topics.filter((t) => index.has(t));
    const cs = ids.map((t) => centre[index.get(t)]);
    const [a, b] = cs;
    const len = Math.max(Math.hypot(b.x - a.x, b.y - a.y), 1);
    // between two topics: in the middle of the free space between their
    // rings; between more: at their centre
    let mx = cs.reduce((sum, c) => sum + c.x, 0) / cs.length;
    let my = cs.reduce((sum, c) => sum + c.y, 0) / cs.length;
    if (cs.length === 2) {
      const ra = ring[index.get(ids[0])];
      const rb = ring[index.get(ids[1])];
      const along = ra + (len - ra - rb) / 2;
      mx = a.x + ((b.x - a.x) / len) * along;
      my = a.y + ((b.y - a.y) / len) * along;
    }
    // side by side, perpendicular to the line between the first two topics
    const px = -(b.y - a.y) / len;
    const py = (b.x - a.x) / len;
    group.forEach((item, k) => {
      const offset = (k - (group.length - 1) / 2) * (ITEM_R * 2 + 8);
      at.set(item.id, { x: mx + px * offset, y: my + py * offset });
    });
  }
  return at;
}

function mount(figure) {
  const svg = figure.querySelector('svg');
  const { topics, items } = JSON.parse(figure.querySelector('.map-data').textContent);
  const el = (tag, attrs = {}) => {
    const node = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    return node;
  };
  const go = (url) => (location.href = url);

  // one link per item and topic it belongs to
  const links = items.flatMap((i) => i.topics.map((t) => ({ item: i.id, topic: t })));
  const linkEls = links.map(() => {
    const line = el('line', { class: 'map-link' });
    svg.append(line);
    return line;
  });

  const topicEls = topics.map((t) => {
    const g = el('g', { class: 'map-node map-topic', tabindex: '0', role: 'link', 'aria-label': `${t.title} (${t.count})` });
    g.append(
      el('circle', { r: TOPIC_R }),
      Object.assign(el('text', { class: 'map-count', 'text-anchor': 'middle', dy: '0.35em' }), { textContent: t.count }),
      Object.assign(el('text', { class: 'map-topic-name', 'text-anchor': 'middle' }), { textContent: t.title }),
    );
    g.addEventListener('click', () => go(t.url));
    g.addEventListener('keydown', (e) => e.key === 'Enter' && go(t.url));
    return g;
  });
  const itemEls = items.map((item) => {
    const g = el('g', { class: 'map-node map-item', tabindex: '0', role: 'link', 'aria-label': item.title });
    const icon = el('svg', { class: 'map-icon', x: -6, y: -6, width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    icon.innerHTML = item.icon; // shapes from the icon set, built into the page
    g.append(el('circle', { r: ITEM_R }), icon, Object.assign(el('text', { dy: '0.35em' }), { textContent: item.title }));
    g.addEventListener('click', () => go(item.url));
    g.addEventListener('keydown', (e) => e.key === 'Enter' && go(item.url));
    return g;
  });
  // items above links, topics above items
  svg.append(...itemEls, ...topicEls);

  // Hover or focus: a topic keeps its items, an item keeps its topics.
  const focus = (keepTopics, keepItems) => {
    figure.classList.add('is-focused');
    topicEls.forEach((g, i) => g.classList.toggle('is-near', keepTopics.has(topics[i].id)));
    itemEls.forEach((g, i) => g.classList.toggle('is-near', keepItems.has(items[i].id)));
    linkEls.forEach((l, i) => l.classList.toggle('is-near', keepItems.has(links[i].item) && keepTopics.has(links[i].topic)));
  };
  const off = () => figure.classList.remove('is-focused');
  const hover = (g, on) => {
    g.addEventListener('pointerenter', on);
    g.addEventListener('pointerleave', off);
    g.addEventListener('focus', on);
    g.addEventListener('blur', off);
  };
  topicEls.forEach((g, i) => hover(g, () => focus(new Set([topics[i].id]), new Set(items.filter((it) => it.topics.includes(topics[i].id)).map((it) => it.id)))));
  itemEls.forEach((g, i) => hover(g, () => focus(new Set(items[i].topics), new Set([items[i].id]))));

  let first = true;
  function draw() {
    const box = svg.getBoundingClientRect();
    if (!box.width || !box.height) return;
    // A small box (the start page, a phone) gets the layout of a wider one,
    // scaled down as a whole, so that rings and names keep their distances.
    const zoom = Math.min(1, box.width / 640);
    const width = box.width / zoom;
    const height = box.height / zoom;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    const ring = rings(topics, items);
    const centre = placeTopics(topics, items, ring, width, height);
    const at = placeItems(topics, items, ring, centre);
    const topicAt = new Map(topics.map((t, i) => [t.id, centre[i]]));
    const move = (g, p) => (g.style.transform = `translate(${p.x}px, ${p.y}px)`);

    topicEls.forEach((g, i) => {
      move(g, centre[i]);
      g.querySelector('.map-topic-name').setAttribute('y', -ring[i] - ITEM_R - 8);
    });
    itemEls.forEach((g, i) => {
      const p = at.get(items[i].id);
      move(g, p);
      // titles point away from their topic, so they do not cross the ring
      const home = topicAt.get(items[i].topics[0]);
      const left = items[i].topics.length === 1 && p.x < home.x - 1;
      const text = g.querySelector('text');
      text.setAttribute('x', left ? -ITEM_R - 5 : ITEM_R + 5);
      text.setAttribute('text-anchor', left ? 'end' : 'start');
    });
    links.forEach((l, i) => {
      const a = at.get(l.item);
      const b = topicAt.get(l.topic);
      linkEls[i].setAttribute('x1', a.x);
      linkEls[i].setAttribute('y1', a.y);
      linkEls[i].setAttribute('x2', b.x);
      linkEls[i].setAttribute('y2', b.y);
    });

    if (first && !reduceMotion) {
      // The one orchestrated moment: topics appear, then their items fly out.
      topicEls.forEach((g, i) => g.animate([{ opacity: 0, transform: `translate(${centre[i].x}px, ${centre[i].y}px) scale(0.6)` }, { opacity: 1, transform: `translate(${centre[i].x}px, ${centre[i].y}px)` }], { duration: 400, delay: i * 60, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', fill: 'backwards' }));
      itemEls.forEach((g, i) => {
        const from = topicAt.get(items[i].topics[0]);
        const to = at.get(items[i].id);
        g.animate([{ opacity: 0, transform: `translate(${from.x}px, ${from.y}px)` }, { opacity: 1, transform: `translate(${to.x}px, ${to.y}px)` }], { duration: 650, delay: 250 + i * 25, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', fill: 'backwards' });
      });
      linkEls.forEach((l) => l.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: 700, fill: 'backwards' }));
    }
    first = false;
  }
  draw();
  new ResizeObserver(() => {
    if (!first) draw();
  }).observe(svg);

  const mark = (progress) => itemEls.forEach((g, i) => g.classList.toggle('is-done', isDone(progress, items[i].id)));
  mark(load());
  document.addEventListener('progress-change', (e) => mark(e.detail));

  return { topics, items, topicEls, itemEls, links, linkEls };
}

for (const figure of document.querySelectorAll('[data-map]')) {
  const map = mount(figure);
  // Topic chips on the map page dim everything outside the chosen topic and
  // name its items; ?topic=… in the address chooses one, and choosing one
  // updates it.
  const chips = document.getElementById('map-topics');
  if (!chips) continue;
  const choose = (topic) => {
    figure.classList.toggle('has-topic', !!topic);
    map.topicEls.forEach((g, i) => g.classList.toggle('is-dim', !!topic && map.topics[i].id !== topic));
    map.itemEls.forEach((g, i) => {
      const inside = !!topic && map.items[i].topics.includes(topic);
      g.classList.toggle('is-dim', !!topic && !inside);
      g.classList.toggle('is-chosen', inside);
    });
    map.linkEls.forEach((l, i) => l.classList.toggle('is-dim', !!topic && map.links[i].topic !== topic));
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
