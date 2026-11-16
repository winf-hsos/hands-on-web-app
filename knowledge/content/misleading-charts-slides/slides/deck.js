/* Drawings of the deck "misleading charts".
 *
 * Font sizes only 20, 32, 48 and 80. Width estimate: 0.6 em per character.
 * Colours carry meaning: marks in gray_light, the word "honest" in blue
 * (the better version, as in the headers of the chart slides), the word
 * "misleading" in gray, never red.
 * The charts with data are not drawn here but by ggplot2:
 * scripts/misleading-charts-figures.R in the repository writes img/fig-*.svg.
 */

const d = window.draw;
const $ = (id) => document.getElementById(id);
const C = () => window.draw.colors();
const put = (id, svg) => { if ($(id)) $(id).innerHTML = svg; return svg; };

/* ------------------------------------------------------------------ */
/* Bars show length, points show position. Three panels of 440 from    */
/* x0 = 40, 640, 1240, the values of the tax example (35 and 39.6).   */
/* Baseline at y = 420, the axis maximum 42 at y = 100 (320 high).     */
/* Panel 1 bars from 0, panel 2 bars from 34, panel 3 points from 34.  */
/* Widths at 32 px: "no ink, only position" 21 x 19.2 = 403 < 440;     */
/* tick label "34 %" 77 wide, right-aligned at x0 + 50 (from x0 - 27). */
/* ------------------------------------------------------------------ */
function figInk() {
  const c = C();
  const base = 420, top = 100, hgt = base - top;
  const panels = [
    { title: "bars from 0", from: 0, tag: "honest", note: "1.13 times the ink", bars: true },
    { title: "bars from 34 %", from: 34, tag: "misleading", note: "5.6 times the ink", bars: true },
    { title: "points from 34 %", from: 34, tag: "honest", note: "no ink, only position", bars: false },
  ];
  const values = [35, 39.6];
  const parts = [];
  panels.forEach((p, i) => {
    const x0 = 40 + i * 600;
    const y = (v) => base - (v - p.from) / (42 - p.from) * hgt;
    const cx = [x0 + 150, x0 + 330];
    parts.push(d.label(x0 + 240, 0, p.title, { size: 32, anchor: "middle", centerY: 40 }));
    // the axis line, then the marks on it
    parts.push(d.line(x0 + 70, base, x0 + 430, base, { color: c.gray, width: 2 }));
    parts.push(d.label(x0 + 50, 0, `${p.from} %`, { size: 32, color: c.gray, anchor: "end", centerY: base }));
    values.forEach((v, k) => {
      if (p.bars) {
        parts.push(`<rect x="${cx[k] - 60}" y="${y(v)}" width="120" height="${base - y(v)}" fill="${c.light}"/>`);
      } else {
        parts.push(`<circle cx="${cx[k]}" cy="${y(v)}" r="16" fill="${c.light}"/>`);
      }
      parts.push(d.label(cx[k], 0, String(v), { size: 32, color: c.light, anchor: "middle", centerY: y(v) - (p.bars ? 26 : 42) }));
    });
    parts.push(d.label(x0 + 240, 0, p.tag, { size: 32, anchor: "middle", color: p.tag === "honest" ? c.blue : c.gray, centerY: 490 }));
    parts.push(d.label(x0 + 240, 0, p.note, { size: 32, anchor: "middle", color: c.light, centerY: 540 }));
  });
  return put("fig-ink", d.svg(1680, 580, ...parts));
}
window.figInk = figInk;

/* ------------------------------------------------------------------ */
/* Bubbles: the values 1 and 2, once with the radius by the value      */
/* (r 70 and 140, four times the area), once with the area by the      */
/* value (r 70 and 99). Panels of 800 at x0 = 0 and 880; circles at    */
/* x0 + 200 and x0 + 520, centre y = 280 (the largest from 140 to 420).*/
/* "twice the value, four times the ink" 35 x 19.2 = 672 < 800.        */
/* ------------------------------------------------------------------ */
function figBubbles() {
  const c = C();
  const panels = [
    { title: "radius by the value", radii: [70, 140], tag: "misleading", note: "twice the value, four times the ink" },
    { title: "area by the value", radii: [70, Math.round(70 * Math.SQRT2)], tag: "honest", note: "twice the value, twice the ink" },
  ];
  const parts = [];
  panels.forEach((p, i) => {
    const x0 = i * 880;
    parts.push(d.label(x0 + 400, 0, p.title, { size: 32, anchor: "middle", centerY: 40 }));
    p.radii.forEach((r, k) => {
      const cx = x0 + 200 + k * 320;
      parts.push(`<circle cx="${cx}" cy="280" r="${r}" fill="${c.light}"/>`);
      parts.push(d.label(cx, 0, `value ${k + 1}`, { size: 32, color: c.gray, anchor: "middle", centerY: 460 }));
    });
    parts.push(d.label(x0 + 400, 0, p.tag, { size: 32, anchor: "middle", color: p.tag === "honest" ? c.blue : c.gray, centerY: 520 }));
    parts.push(d.label(x0 + 400, 0, p.note, { size: 32, anchor: "middle", color: c.light, centerY: 570 }));
  });
  return put("fig-bubbles", d.svg(1680, 610, ...parts));
}
window.figBubbles = figBubbles;

/* Start: draw the pictures if the slides are there */
if ($("fig-ink")) figInk();
if ($("fig-bubbles")) figBubbles();
