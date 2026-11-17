// Drawings of "what is an ai agent?".
// Every figure is 1680 units wide, the width of a figure on the 1920 canvas,
// so text sizes come out as written (20, 32, 48, 80). Figures are 660 high on
// slides with a punchline and 804 without.
//
// Chatbot and agent, the anatomy of an agent and the harness follow the deck
// "ai agents" (ai-agents-slides); here the example is a research paper in
// Quarto instead of a knowledge base on the history of AI.
//
// Colors: gray for context, white for what is new on a step, blue for the
// language model, yellow for the loop and for what happens now, green and
// red only for measured gains and losses.
//
// Numbers on the METR slide: Becker et al. (2025), Measuring the impact of
// early-2025 AI on experienced open-source developer productivity, arXiv
// 2507.09089: 16 developers, 246 tasks. They expected AI to speed them up by
// 24 %, afterwards estimated a speed-up of 20 %, and took 19 % longer with AI.
const d = window.draw;
const $ = (id) => document.getElementById(id);
const C = () => d.colors();
const put = (id, svg) => { const e = $(id); if (e) e.innerHTML = svg; };

// Bootstrap Icons 1.11.3 (MIT)
const ICON_ARROW_REPEAT = '<path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"/><path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/>';
const ICON_FOLDER2_OPEN = '<path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7z"/>';

/* ------------------------------------------------------------------ */
/* chatbot vs. agent (one build step)                                   */
/* ------------------------------------------------------------------ */
function figChatAgent(step) {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const bw = 220, bh = 100;

  // top: the chatbot. After the answer it is your turn again.
  const y1 = 40;
  labels.push(d.label(0, 0, "chatbot", { size: 48, color: c.white, centerY: y1 + bh / 2 }));
  const xs1 = [360, 760, 1160];
  ["you", "LLM", "answer"].forEach((t, i) => {
    boxes.push(d.box(xs1[i], y1, bw, bh, t, { border: i === 1 ? c.blue : c.light, color: c.white, keepCase: i === 1 }));
  });
  labels.push(d.label(670, 0, "prompt", { size: 20, color: c.gray, anchor: "middle", centerY: y1 + bh / 2 - 26 }));
  wires.push(d.arrow(xs1[0] + bw, y1 + bh / 2, xs1[1] - 4, y1 + bh / 2, { color: c.gray, width: 3 }));
  wires.push(d.arrow(xs1[1] + bw, y1 + bh / 2, xs1[2] - 4, y1 + bh / 2, { color: c.gray, width: 3 }));
  const ry = y1 + bh + 50;
  wires.push(d.line(xs1[2] + bw / 2, y1 + bh, xs1[2] + bw / 2, ry, { color: c.gray, width: 3 }));
  wires.push(d.line(xs1[2] + bw / 2, ry, xs1[0] + bw / 2, ry, { color: c.gray, width: 3 }));
  wires.push(d.arrow(xs1[0] + bw / 2, ry, xs1[0] + bw / 2, y1 + bh + 4, { color: c.gray, width: 3 }));
  labels.push(d.label(870, 0, "you copy, run, paste back", { size: 32, color: c.gray, anchor: "middle", centerY: ry + 32 }));

  if (step < 1) return d.svg(1680, 640, ...d.layers(wires, boxes, labels));

  // bottom: the agent. The loop runs between model and tools.
  const y2 = 400;
  labels.push(d.label(0, 0, "agent", { size: 48, color: c.white, centerY: y2 + bh / 2 }));
  const xs2 = [360, 760, 1160, 1460];
  boxes.push(d.box(xs2[0], y2, bw, bh, "you", { border: c.light, color: c.white }));
  boxes.push(d.box(xs2[1], y2, bw, bh, "LLM", { border: c.blue, color: c.white, keepCase: true }));
  boxes.push(d.box(xs2[2], y2, bw, bh, "tools", { border: c.yellow, color: c.white }));
  labels.push(d.label(670, 0, "goal", { size: 20, color: c.gray, anchor: "middle", centerY: y2 + bh / 2 - 26 }));
  wires.push(d.arrow(xs2[0] + bw, y2 + bh / 2, xs2[1] - 4, y2 + bh / 2, { color: c.gray, width: 3 }));
  wires.push(d.arrow(xs2[1] + bw, y2 + 30, xs2[2] - 4, y2 + 30, { color: c.yellow, width: 3 }));
  wires.push(d.arrow(xs2[2], y2 + 70, xs2[1] + bw + 4, y2 + 70, { color: c.yellow, width: 3 }));
  labels.push(d.icon(1034, y2 + bh + 16, 64, ICON_ARROW_REPEAT, { color: c.yellow }));
  labels.push(d.label(1066, 0, "until the goal is reached", { size: 32, color: c.yellow, anchor: "middle", centerY: y2 + bh + 124 }));
  wires.push(d.arrow(xs2[2] + bw, y2 + bh / 2, xs2[3] + 20, y2 + bh / 2, { color: c.gray, width: 3 }));
  labels.push(d.label(xs2[3] + 36, 0, "result", { size: 32, color: c.white, centerY: y2 + bh / 2 }));
  return d.svg(1680, 640, ...d.layers(wires, boxes, labels));
}
function showChatAgent(slide, step) { put("fig-chat-agent", figChatAgent(step || 0)); }

/* ------------------------------------------------------------------ */
/* inside an agent: one drawing, seven stages                           */
/*   0 goal + LLM · 1 tools · 2 loop · 3 context · 4 plan              */
/*   5 instructions · 6 everything (gray, only the loop yellow)        */
/* Every stage draws all earlier ones in the same place; the new part  */
/* is bright, the known parts are gray.                                 */
/* ------------------------------------------------------------------ */
function figAnatomy(stage) {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const all = stage >= 6;
  const col = (s) => (all ? c.gray : s === stage ? c.white : c.gray);
  const rim = (s) => (all ? c.dark : s === stage ? c.blue : c.dark);

  const L = { x: 660, y: 190, w: 320, h: 140 };
  labels.push(d.label(L.x + L.w / 2, 0, "goal: “give us feedback on the introduction of our paper”",
    { size: 32, color: col(0), anchor: "middle", centerY: 40 }));
  wires.push(d.arrow(L.x + L.w / 2, 70, L.x + L.w / 2, L.y - 4, { color: c.gray, width: 3 }));
  boxes.push(d.box(L.x, L.y, L.w, L.h, "LLM", { border: rim(0), color: col(0), size: 48, keepCase: true, width: 3 }));

  // 1 tools on the right, and the files they work on
  if (stage >= 1) {
    const tools = ["read", "edit", "write", "bash", "web search"];
    const tx = 1210, tw = 250, th = 64, tg = 18, ty = 130;
    const bus = 1160;
    wires.push(d.line(bus, ty + th / 2, bus, ty + 4 * (th + tg) + th / 2, { color: c.gray, width: 3 }));
    tools.forEach((t, i) => {
      const y = ty + i * (th + tg);
      wires.push(d.line(bus, y + th / 2, tx, y + th / 2, { color: c.gray, width: 3 }));
      boxes.push(d.box(tx, y, tw, th, t, { border: rim(1), color: col(1), mono: true }));
    });
    wires.push(d.arrow(L.x + L.w, 235, bus - 4, 235, { color: stage === 2 || all ? c.yellow : c.gray, width: 3 }));
    labels.push(d.label(1070, 0, "calls", { size: 20, color: col(1), anchor: "middle", centerY: 212 }));
    labels.push(d.icon(1520, 260, 110, ICON_FOLDER2_OPEN, { color: col(1) }));
    labels.push(d.label(1575, 0, "paper/", { size: 32, color: col(1), anchor: "middle", centerY: 410, mono: true }));
    labels.push(d.label(1575, 0, "_introduction.qmd", { size: 20, color: col(1), anchor: "middle", centerY: 450, mono: true, keepCase: true }));
  }

  // 2 the loop: results go back into the model
  if (stage >= 2) {
    const loop = stage === 2 || all ? c.yellow : c.gray;
    wires.push(d.arrow(1160, 290, L.x + L.w + 4, 290, { color: loop, width: 3 }));
    labels.push(d.label(1070, 0, "results", { size: 20, color: loop, anchor: "middle", centerY: 313 }));
    labels.push(d.icon(1030, 340, 80, ICON_ARROW_REPEAT, { color: loop }));
    labels.push(d.label(L.x + L.w / 2, 0, "think → act → observe", { size: 32, color: loop, anchor: "middle", centerY: 385 }));
  }

  // 3 the context window below the model, filling up with what it read
  if (stage >= 3) {
    const K = { x: 660, y: 450, w: 320, h: 180 };
    boxes.push(d.box(K.x, K.y, K.w, K.h, "", { border: rim(3) }));
    labels.push(d.label(K.x + K.w / 2, 0, "context window", { size: 32, color: col(3), anchor: "middle", centerY: K.y + 45 }));
    boxes.push(d.box(K.x + 30, K.y + 85, K.w - 60, 36, "", { border: c.gray, rx: 4 }));
    boxes.push(d.box(K.x + 30, K.y + 85, (K.w - 60) * 0.3, 36, "", { border: null, fill: stage === 3 ? c.yellow : c.gray, rx: 4 }));
    labels.push(d.label(K.x + K.w / 2, 0, "fills with every file it reads", { size: 20, color: col(3), anchor: "middle", centerY: K.y + 150 }));
  }

  // 4 the plan, top left
  if (stage >= 4) {
    const P = { x: 20, y: 90, w: 400, h: 200 };
    boxes.push(d.box(P.x, P.y, P.w, P.h, "", { border: rim(4) }));
    labels.push(d.label(P.x + 30, 0, "plan", { size: 32, color: col(4), centerY: P.y + 40 }));
    ["☑ read paper.qmd", "☐ read the introduction", "☐ write the feedback"].forEach((t, i) => {
      labels.push(d.label(P.x + 30, 0, t, { size: 20, color: col(4), centerY: P.y + 90 + i * 36 }));
    });
    wires.push(d.arrow(L.x, 220, P.x + P.w + 4, 220, { color: c.gray, width: 3 }));
    labels.push(d.label(540, 0, "writes", { size: 20, color: col(4), anchor: "middle", centerY: 197 }));
  }

  // 5 instructions in text files, below the plan
  if (stage >= 5) {
    const S = { x: 20, y: 320, w: 400, h: 90 };
    boxes.push(d.box(S.x, S.y, S.w, S.h, "AGENTS.md · commands", { border: rim(5), color: col(5), mono: true, keepCase: true, size: 20 }));
    wires.push(d.arrow(S.x + S.w, 365, L.x - 4, 300, { color: c.gray, width: 3 }));
    labels.push(d.label(540, 0, "loads", { size: 20, color: col(5), anchor: "middle", centerY: 362 }));
    labels.push(d.label(20, 0, "what it should know about\nyour project and how it\nshould give feedback", { size: 20, color: col(5), centerY: 480 }));
  }

  return d.svg(1680, 680, ...d.layers(wires, boxes, labels));
}
function showAnatomy(slide, step) {
  const el = slide.querySelector(".figure[data-stage]");
  if (el) el.innerHTML = figAnatomy(+el.dataset.stage + (step || 0));
}

/* ------------------------------------------------------------------ */
/* the harness: everything except the model                             */
/* ------------------------------------------------------------------ */
function figHarness() {
  const c = C();
  const wires = [], boxes = [], labels = [];
  labels.push(d.label(840, 0, "AI agent  =  LLM  +  harness", { size: 48, color: c.white, anchor: "middle", centerY: 40, keepCase: true }));
  const H = { x: 80, y: 130, w: 900, h: 440 };
  boxes.push(d.box(H.x, H.y, H.w, H.h, "", { border: c.yellow, width: 3 }));
  labels.push(d.label(H.x + 40, 0, "harness", { size: 48, color: c.yellow, centerY: H.y + 60 }));
  labels.push(d.label(H.x + H.w - 40, 0, "e.g. OpenCode, Claude Code, Codex", { size: 20, color: c.gray, anchor: "end", centerY: H.y + 60, keepCase: true }));
  ["runs the loop", "carries out the tool calls", "manages the context window", "loads plans, AGENTS.md and commands", "asks you for permission"].forEach((t, i) => {
    labels.push(d.label(H.x + 40, 0, t, { size: 32, color: i === 4 ? c.white : c.light, centerY: H.y + 140 + i * 60 }));
  });
  const M = { x: 1260, y: 280, w: 340, h: 140 };
  boxes.push(d.box(M.x, M.y, M.w, M.h, "LLM", { border: c.blue, color: c.white, size: 48, keepCase: true, width: 3 }));
  labels.push(d.label(M.x + M.w / 2, 0, "only turns text into text", { size: 20, color: c.gray, anchor: "middle", centerY: M.y + M.h + 36 }));
  wires.push(d.arrow(H.x + H.w, 320, M.x - 4, 320, { color: c.gray, width: 3 }));
  wires.push(d.arrow(M.x, 380, H.x + H.w + 4, 380, { color: c.gray, width: 3 }));
  labels.push(d.label((H.x + H.w + M.x) / 2, 0, "prompt", { size: 20, color: c.gray, anchor: "middle", centerY: 296 }));
  labels.push(d.label((H.x + H.w + M.x) / 2, 0, "tool call or answer", { size: 20, color: c.gray, anchor: "middle", centerY: 404 }));
  return d.svg(1680, 620, ...d.layers(wires, boxes, labels));
}

/* ------------------------------------------------------------------ */
/* One run of an agent, as its log: every step a row with the tool on  */
/* the left. Step n shows rows 0..n; the newest row is yellow.          */
/* Text rows at 32 px hold at most 62 characters (1180 px from x 400).  */
/* ------------------------------------------------------------------ */
const RUN = [
  ["you", "give us feedback on the structure of our introduction"],
  ["read", "paper/paper.qmd"],
  ["read", "paper/sections/_introduction.qmd"],
  ["answer", "the research question stands in the second paragraph;\nmove it to the end of the introduction."],
  ["you", "please move it"],
  ["edit", "paper/sections/_introduction.qmd\nallow once · allow always · reject"],
];
function figRun(step) {
  const c = C();
  const parts = [];
  RUN.forEach(([who, t], i) => {
    if (i > step) return;
    const y = 30 + i * 120 + (i > 3 ? 40 : 0);
    const now = i === step;
    const tool = who !== "you" && who !== "answer";
    parts.push(d.label(0, 0, who, { size: 32, color: tool ? c.blue : c.gray, mono: tool, centerY: y + 30 }));
    parts.push(d.label(260, 0, t, { size: 32, color: now ? c.yellow : c.light, mono: tool, keepCase: tool, centerY: y + 30 + (t.includes("\n") ? 21 : 0) }));
  });
  return d.svg(1680, 804, ...parts);
}
function showRun(slide, step) { put("fig-run", figRun(step || 0)); }

/* ------------------------------------------------------------------ */
/* METR 2025: what developers expected, what they felt, what was        */
/* measured. Bars from a zero line; speed-up to the right.              */
/* ------------------------------------------------------------------ */
function figMetr() {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const Z = 900, S = 14;   // zero line at x = 900, 14 units per percent
  const rows = [
    ["expected before", 24, c.gray],
    ["felt afterwards", 20, c.gray],
    ["measured", -19, c.red],
  ];
  rows.forEach(([t, v, col], i) => {
    const y = 90 + i * 170;
    labels.push(d.label(0, 0, t, { size: 32, color: i === 2 ? c.white : c.light, centerY: y + 50 }));
    const x = v >= 0 ? Z : Z + v * S;
    boxes.push(d.box(x, y, Math.abs(v) * S, 100, "", { border: null, fill: col, rx: 4 }));
    const lab = (v > 0 ? v + " % faster" : -v + " % slower");
    labels.push(d.label(v >= 0 ? Z + v * S + 24 : Z + v * S - 24, 0, lab, { size: 32, color: i === 2 ? c.white : c.light, anchor: v >= 0 ? "start" : "end", centerY: y + 50 }));
  });
  wires.push(d.line(Z, 60, Z, 590, { color: c.light, width: 2 }));
  labels.push(d.label(Z, 0, "with ai compared with without", { size: 20, color: c.gray, anchor: "middle", centerY: 625 }));
  return d.svg(1680, 660, ...d.layers(wires, boxes, labels));
}

// drawn at once, before stagekit.js builds the frames
put("fig-chat-agent", figChatAgent(0));
document.querySelectorAll(".figure[data-stage]").forEach((el) => { el.innerHTML = figAnatomy(+el.dataset.stage); });
put("fig-harness", figHarness());
put("fig-run", figRun(0));
put("fig-metr", figMetr());
Object.assign(window, { showChatAgent, showAnatomy, showRun });
