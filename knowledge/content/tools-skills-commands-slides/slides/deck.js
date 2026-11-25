// Drawings of the deck "tools, skills and commands". The figure area is 1680 x 804, or 1680 x 660 on
// slides with a punchline; sizes 20, 32, 48 and 80 come out as written.
// The quantities are those of real runs of the experiment (OpenCode with gpt-6-luna, and three local
// models in LM Studio) against the reference that `python tools/farm_shop.py solution` prints.
const d = window.draw;
const el = (id) => document.getElementById(id);
const W = 1680, H = 804, HP = 660;
const c = d.colors();

// ------------------------------------------------------------ the naked agent

// The agent of the farm shop: a person, the agent with its role, and three groups of tools, all off.
function figSetup() {
  const parts = [];
  parts.push(d.label(130, 0, "owner", { size: 32, color: c.light, anchor: "middle", centerY: 300 }));
  parts.push(d.arrow(230, 300, 470, 300, { color: c.light, width: 3, head: 16 }));
  parts.push(d.box(490, 170, 640, 260, "", { border: c.blue, width: 3, rx: 12 }));
  parts.push(d.label(810, 0, "agent “shop”", { size: 48, anchor: "middle", centerY: 240 }));
  parts.push(d.label(810, 0, "a language model with one role:\n“you are the assistant of the\nlindenhof farm shop”", { size: 20, color: c.light, anchor: "middle", centerY: 340 }));
  const groups = [["shop", "products, stock, sales"], ["orders", "send an order"], ["till", "till, cash box, cash book"]];
  groups.forEach(([name, what], i) => {
    const y = 90 + i * 150;
    parts.push(d.line(1130, 300, 1250, y + 55, { color: c.dark, width: 2, dashed: true }));
    parts.push(d.box(1250, y, 430, 110, "", { border: c.dark, dashed: true }));
    parts.push(d.label(1280, 0, name, { size: 32, color: c.gray, mono: true, centerY: y + 38 }));
    parts.push(d.label(1280, 0, what, { size: 20, color: c.gray, centerY: y + 80 }));
  });
  parts.push(d.label(1465, 0, "all switched off", { size: 32, color: c.gray, anchor: "middle", centerY: 560 }));
  parts.push(d.label(810, 0, "no files, no shell, no web: everything opencode brings along is denied", { size: 32, color: c.light, anchor: "middle", centerY: 680 }));
  return d.svg(W, H, ...parts);
}

// A short chat: the person right, the agent left, a tool call with its result in the middle in gray.
function chat(rows, h, gap = 90) {
  const parts = [];
  let y = 40;
  rows.forEach(([who, text, col]) => {
    const lines = text.split("\n").length;
    const bh = 60 + lines * 42;
    const tool = who === "tool";
    const x = who === "you" ? 560 : tool ? 280 : 0, w = 1120;
    parts.push(d.label(who === "you" ? 1680 : x, y - 8, who, { size: 20, color: c.gray, anchor: who === "you" ? "end" : "start" }));
    parts.push(d.box(x, y + 10, w, bh, "", { border: col || (who === "you" ? c.light : tool ? c.dark : c.blue), dashed: tool, rx: 14 }));
    parts.push(d.label(x + 36, 0, text, { size: 32, color: tool ? c.light : c.white, mono: tool, centerY: y + 10 + bh / 2, keepCase: true }));
    y += bh + gap;
  });
  return d.svg(W, h, ...parts);
}

// ------------------------------------------------------------ tables of quantities

// Quantities per product from several runs next to the shop's rules. A cell that differs from the
// rules is yellow, a match is white, the rules themselves are light gray.
function quantities(cols, rows, h) {
  const x0 = 360, cw = (W - x0) / cols.length, rh = 78, top = 30;
  const parts = [];
  cols.forEach((col, j) => parts.push(d.label(x0 + j * cw + cw / 2, 0, col, { size: 32, color: j === cols.length - 1 ? c.light : c.gray, anchor: "middle", centerY: top + 30 })));
  parts.push(d.line(0, top + 70, W, top + 70, { color: c.dark }));
  rows.forEach(([name, ...vals], i) => {
    const cy = top + 70 + rh * i + rh / 2 + 6;
    parts.push(d.label(0, 0, name, { size: 32, color: c.light, centerY: cy }));
    const ref = vals[vals.length - 1];
    vals.forEach((v, j) => {
      const last = j === vals.length - 1;
      const col = last ? c.light : (String(v) === String(ref) ? c.white : c.yellow);
      parts.push(d.label(x0 + j * cw + cw / 2, 0, String(v), { size: 32, color: col, anchor: "middle", centerY: cy, mono: typeof v === "number" }));
    });
  });
  return d.svg(W, h, ...parts);
}

// What each model did with a question: a cell is [text, ok]; a wrong move is yellow, a right one white,
// a partly right one (ok = null) light gray.
function outcomes(cols, rows, h, x0 = 520, rh = 92) {
  const cw = (W - x0) / cols.length, top = 30;
  const parts = [];
  cols.forEach((col, j) => parts.push(d.label(x0 + j * cw + cw / 2, 0, col, { size: 32, color: c.gray, anchor: "middle", centerY: top + 30 })));
  parts.push(d.line(0, top + 70, W, top + 70, { color: c.dark }));
  rows.forEach(([name, ...cells], i) => {
    const cy = top + 70 + rh * i + rh / 2 + 6;
    parts.push(d.label(0, 0, name, { size: 32, color: c.light, centerY: cy }));
    cells.forEach(([text, ok], j) => parts.push(d.label(x0 + j * cw + cw / 2, 0, text, { size: 20, color: ok === null ? c.light : ok ? c.white : c.yellow, anchor: "middle", centerY: cy, mono: /^[a-z_]+_[a-z_]+$/.test(text), lineHeight: 1.3 })));
  });
  return d.svg(W, h, ...parts);
}

// ------------------------------------------------------------ skills

// The context of the agent as a stack of cards; the skill is only a name and a description until the
// agent loads it, then its whole text follows (step 1).
function figSkill() {
  const cards = [
    ["system", "you are the assistant of the lindenhof farm shop", c.dark],
    ["tools", "shop_products · shop_stock · shop_sales", c.dark],
    ["skills", "weekly-order: how the lindenhof farm shop works out its weekly order", c.blue],
    ["you", "please place this week's order with our suppliers.", c.dark],
  ];
  const parts = [];
  cards.forEach(([what, text, border], i) => {
    const y = 20 + i * 104;
    parts.push(d.box(0, y, W, 86, "", { border }));
    parts.push(d.label(30, 0, what, { size: 20, color: c.gray, centerY: y + 43 }));
    parts.push(d.label(170, 0, text, { size: 32, color: what === "skills" ? c.white : c.light, centerY: y + 43, mono: what === "tools" }));
  });
  const y = 20 + 4 * 104;
  const loaded = d.box(0, y, W, 290, "", { border: c.yellow, width: 3 }) +
    d.label(30, 0, "skill", { size: 20, color: c.yellow, centerY: y + 43 }) +
    d.label(170, 0, "weekly-order, loaded:", { size: 32, color: c.yellow, centerY: y + 43 }) +
    d.label(170, 0, "1. sales of the last four weeks, average per week = units / 4\n2. target = average × 1.5, perishable (7 days or less) × 1.0\n3. need = target − stock · 4. round up to whole packs\n5. one order per supplier, never the own farm · 6. show the table first", { size: 32, color: c.white, centerY: y + 172, lineHeight: 1.25 });
  parts.push(d.g("loaded", loaded));
  el("fig-skill").innerHTML = d.svg(W, H, ...parts);
  const a = d.anim("fig-skill", { back: "play" });
  a.step(a.show("loaded", { dur: 500 }));
}

// ------------------------------------------------------------ commands

// What OpenCode makes of one typed line: the file's template with $ARGUMENTS replaced.
function figCommand() {
  const parts = [];
  parts.push(d.label(0, 0, "you type", { size: 20, color: c.gray, centerY: 30 }));
  parts.push(d.label(0, 0, "/weekly-order Bee Garden", { size: 48, color: c.yellow, mono: true, keepCase: true, centerY: 90 }));
  parts.push(d.arrow(200, 140, 200, 230, { color: c.light, width: 3, head: 16 }));
  parts.push(d.label(230, 0, "opencode reads .opencode/commands/weekly-order.md and fills in the rest of the line", { size: 20, color: c.gray, centerY: 185, keepCase: false }));
  parts.push(d.box(0, 250, W, 300, "", { border: c.light }));
  parts.push(d.label(40, 0, "work out this week's order with the skill weekly-order,\nfor these suppliers:", { size: 32, color: c.light, centerY: 325 }));
  parts.push(d.highlight(40, 180, 425, 32, { color: c.yellow, opacity: 0.25 }));
  parts.push(d.label(40, 0, "Bee Garden", { size: 32, color: c.yellow, centerY: 425, keepCase: true }));
  parts.push(d.label(40, 0, "show me the table first and place one order per supplier only after i have agreed.", { size: 32, color: c.light, centerY: 500 }));
  parts.push(d.arrow(200, 560, 200, 640, { color: c.light, width: 3, head: 16 }));
  parts.push(d.label(0, 0, "the agent loads the skill, calls the tools and shows its table", { size: 32, color: c.white, centerY: 700 }));
  return d.svg(W, H, ...parts);
}

el("fig-setup").innerHTML = figSetup();
el("fig-naked").innerHTML = chat([
  ["you", "please place this week's order with our suppliers."],
  ["agent", "sure, what items and quantities should i order,\nand from which suppliers?"],
], HP);
el("fig-tools-only").innerHTML = quantities(["run 1", "run 2", "shop's rules"], [
  ["weeks looked at", 1, 1, 4],
  ["milk", 30, 36, 36],
  ["yoghurt", 18, 18, 30],
  ["butter", 10, 20, 20],
  ["carrots", 10, 20, 20],
  ["eggs (own farm)", 23, "–", "–"],
], HP);
el("fig-with-skill").innerHTML = quantities(["run 3", "run 4", "shop's rules"], [
  ["weeks looked at", 4, 4, 4],
  ["milk", 36, 36, 36],
  ["yoghurt", 30, 30, 30],
  ["butter", 20, 20, 20],
  ["carrots", 20, 20, 20],
  ["eggs (own farm)", "–", "–", "–"],
], HP);
el("fig-choice").innerHTML = outcomes(["gpt-6-luna", "gemma 4 e4b", "gemma 4 e2b"], [
  ["honey on the shelf?", ["shop_stock", true], ["asks back", false], ["shop_stock", true]],
  ["cash taken on a day?", ["till_register_log", true], ["till_register_log", true], ["till_cash_count\n(counts the change too)", false]],
  ["milk sold in two weeks?", ["shop_sales", true], ["shop_sales", true], ["shop_sales", true]],
  ["is the cash box right?", ["log and count,\nasks for the change", true], ["count only", false], ["count only", false]],
  ["order 12 jars of honey", ["place_order,\nreports the rejection", true], ["place_order,\nreports success", false], ["no tool,\n“i will place an order”", false]],
], HP);
// the weekly order with the skill written by hand, on the two small models; gemma 4 e2b never got to a table
el("fig-local").innerHTML = quantities(["gemma 4 e4b", "gemma 4 e2b", "shop's rules"], [
  ["skill loaded", "yes", "no", "yes"],
  ["weeks looked at", 5, "–", 4],
  ["milk", 43, "–", 36],
  ["yoghurt", 36, "–", 30],
  ["butter", 24, "–", 20],
  ["jam", 2, "–", 0],
], HP);
figSkill();
el("fig-command").innerHTML = figCommand();
el("fig-phantom").innerHTML = chat([
  ["you", "order 12 jars of honey from bee garden."],
  ["tool", "orders_place_order(supplier=\"Bee Garden\", honey × 12)\n→ rejected by the person"],
  ["agent", "i've placed an order for 12 jars of honey from bee garden.\nplease let me know if you need anything else!", c.yellow],
], HP, 50);
// the same tasks on the small models before and after the coach rewrote skills and commands
el("fig-briefed").innerHTML = outcomes(["e4b before", "e4b after", "e2b before", "e2b after"], [
  ["/weekly-order", ["5 weeks,\n6 of 9 wrong", false], ["4 weeks,\n1 of 9 wrong", null], ["no table,\nempty order", false], ["all 9 right,\nlists own farm", null]],
  ["/daily-closing", ["right", true], ["right", true], ["right", true], ["182.10,\nno cash book", false]],
  ["honey on the shelf", ["asks back", false], ["shop_stock", true], ["shop_stock", true], ["shop_stock", true]],
  ["cash taken", ["till_register_log", true], ["till_register_log", true], ["till_cash_count", false], ["till_cash_count", false]],
  ["milk sold", ["shop_sales", true], ["“no access”", false], ["shop_sales", true], ["shop_sales", true]],
  ["cash box right?", ["count only", false], ["count only", false], ["count only", false], ["count only", false]],
  ["order honey", ["reports success", false], ["reports success", false], ["no tool", false], ["reports rejection", true]],
], HP, 430, 76);
