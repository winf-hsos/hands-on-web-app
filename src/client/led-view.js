// What the simulated LED of a program did (python-worker.js), shown below
// the program: the LED itself, and a timeline in which every colour is a bar
// as long as it lasted. The run is played back in real time, so a program
// that waits one second shows its colour for one second; the timeline grows
// with it, and "Play again" repeats it. The colours are the LED's own, since
// they stand for light. When the program ends, the LED goes off, as the
// course module switches it off on the device.

const reduced = matchMedia('(prefers-reduced-motion: reduce)');

/**
 * The colours of a run as segments from the start to the end of the program:
 * `{ from, to, rgb }`, with `rgb` null where the LED is off. Two colours set
 * at the same moment both stay in, the first with `from === to`: on the
 * device it lasts a few milliseconds, too short for an eye but not nothing.
 */
export function segments(events, end) {
  const out = [];
  let from = 0;
  let rgb = null;
  for (const [t, r, g, b] of events) {
    if (t > from || rgb) out.push({ from, to: t, rgb });
    from = t;
    rgb = r || g || b ? [r, g, b] : null;
  }
  if (end > from || rgb) out.push({ from, to: Math.max(end, from), rgb });
  return out.filter((s) => s.rgb || s.to > s.from);
}

/** Where the ticks of the time axis stand: whole seconds, fewer when the run is long. */
export function ticks(total) {
  const span = Math.max(1, Math.ceil(total - 1e-9));
  const step = span <= 8 ? 1 : span <= 16 ? 2 : 5;
  const out = [];
  for (let t = 0; t <= span; t += step) out.push(t);
  if (out.at(-1) !== span) out.push(span);
  return { span, ticks: out };
}

const colour = (rgb) => (rgb ? `rgb(${rgb.join(' ')})` : '');

/** Shows `run` ({ events, end, status, limited }) in `view`, which it fills anew. */
export function showLed(view, run, L, lang) {
  view.stop?.();
  const segs = segments(run.events, run.end);
  const { span, ticks: marks } = ticks(run.end);
  const at = (t) => `${(t / span) * 100}%`;
  const seconds = (t) => `${(Math.round(t * 100) / 100).toLocaleString(lang)} s`;

  const lamp = Object.assign(document.createElement('span'), { className: 'led-lamp' });
  const clock = Object.assign(document.createElement('span'), { className: 'led-clock' });
  const bars = Object.assign(document.createElement('div'), { className: 'led-bars' });
  for (const s of segs) {
    if (!s.rgb) continue;
    const bar = document.createElement('span');
    bar.className = s.to > s.from ? 'led-bar' : 'led-bar is-instant';
    bar.style.left = at(s.from);
    if (s.to > s.from) bar.style.width = `calc(${at(s.to - s.from)} - 2px)`;
    bar.style.background = colour(s.rgb);
    bars.append(bar);
  }
  const head = Object.assign(document.createElement('span'), { className: 'led-head' });
  const axis = Object.assign(document.createElement('div'), { className: 'led-axis' });
  for (const t of marks) {
    const mark = Object.assign(document.createElement('span'), { textContent: seconds(t) });
    mark.style.left = at(t);
    axis.append(mark);
  }
  const track = Object.assign(document.createElement('div'), { className: 'led-track' });
  track.append(bars, head);
  const note = Object.assign(document.createElement('p'), { className: 'led-note' });
  const again = Object.assign(document.createElement('button'), { type: 'button', className: 'button button-quiet led-again', textContent: L.led_again });
  const timeline = Object.assign(document.createElement('div'), { className: 'led-timeline' });
  timeline.append(track, axis);
  const device = Object.assign(document.createElement('div'), { className: 'led-device' });
  device.append(lamp, clock);
  const row = Object.assign(document.createElement('div'), { className: 'led-row' });
  row.append(device, timeline);
  view.replaceChildren(row, note, again);
  view.hidden = false;
  view.setAttribute('aria-label', L.led_label);

  const ended = run.limited ? L.led_limited : run.status === 'error' ? L.led_error : L.led_ended;
  // the colour the LED shows at time t; at the end the program is over and the LED off
  const shows = (t) => {
    if (t >= run.end) return null;
    let rgb = null;
    for (const [when, r, g, b] of run.events) if (when <= t) rgb = r || g || b ? [r, g, b] : null;
    return rgb;
  };
  const paint = (t) => {
    const rgb = shows(t);
    lamp.style.background = colour(rgb);
    lamp.style.setProperty('--glow', rgb ? colour(rgb) : 'transparent');
    lamp.classList.toggle('is-on', Boolean(rgb));
    clock.textContent = seconds(Math.min(t, run.end));
    const done = Math.min(t / span, 1) * 100;
    bars.style.clipPath = `inset(0 ${100 - done}% 0 0)`;
    head.style.left = `${done}%`;
  };
  const finish = () => {
    paint(run.end + 1);
    head.style.left = at(run.end);
    bars.style.clipPath = '';
    note.textContent = ended.replace('{t}', seconds(run.end));
    again.hidden = run.end === 0;
    view.classList.remove('is-playing');
  };

  let frame = 0;
  const play = () => {
    cancelAnimationFrame(frame);
    note.textContent = '';
    again.hidden = true;
    if (reduced.matches || run.end === 0) return finish();
    view.classList.add('is-playing');
    const start = performance.now();
    const tick = (now) => {
      const t = (now - start) / 1000;
      if (t >= run.end) return finish();
      paint(t);
      frame = requestAnimationFrame(tick);
    };
    paint(0);
    frame = requestAnimationFrame(tick);
  };
  view.stop = () => cancelAnimationFrame(frame);
  again.addEventListener('click', play);
  play();
}
