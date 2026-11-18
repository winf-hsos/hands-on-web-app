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
// Numbers on the time-horizon slide: METR, Time Horizon 1.1, raw data
// https://metr.org/assets/benchmark_results_1_1.yaml (the page
// https://metr.org/time-horizons/ was last updated on 8 September 2026).
// Per model the release date and the task length, measured as the time a
// human expert needs, at which the agent succeeds 50 % and 80 % of the time,
// in minutes. METR: measurements above 16 h are unreliable with its tasks.
const d = window.draw;
const $ = (id) => document.getElementById(id);
const C = () => d.colors();
const put = (id, svg) => { const e = $(id); if (e) e.innerHTML = svg; };

// Bootstrap Icons 1.11.3 (MIT)
const ICON_ARROW_REPEAT = '<path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"/><path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/>';
const ICON_TOOLS = '<path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3q0-.405-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708M3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026z"/>';
const ICON_WARNING = '<path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.960 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z"/><path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>';
const ICON_SHIELD_CHECK = '<path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.750-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/><path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.500 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>';
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

  // bottom: the agent, as wide as the chatbot. The loop runs between the
  // model and the tools below it, and at the end there is a result.
  const y2 = 330, ty = y2 + bh + 100;
  labels.push(d.label(0, 0, "agent", { size: 48, color: c.white, centerY: y2 + bh / 2 }));
  boxes.push(d.box(xs1[0], y2, bw, bh, "you", { border: c.light, color: c.white }));
  boxes.push(d.box(xs1[1], y2, bw, bh, "LLM", { border: c.blue, color: c.white, keepCase: true }));
  boxes.push(d.box(xs1[2], y2, bw, bh, "result", { border: c.light, color: c.white }));
  boxes.push(d.box(xs1[1], ty, bw, bh, "tools", { border: c.yellow, color: c.white }));
  labels.push(d.label(670, 0, "goal", { size: 20, color: c.gray, anchor: "middle", centerY: y2 + bh / 2 - 26 }));
  wires.push(d.arrow(xs1[0] + bw, y2 + bh / 2, xs1[1] - 4, y2 + bh / 2, { color: c.gray, width: 3 }));
  wires.push(d.arrow(xs1[1] + bw, y2 + bh / 2, xs1[2] - 4, y2 + bh / 2, { color: c.gray, width: 3 }));
  wires.push(d.arrow(xs1[1] + 80, y2 + bh, xs1[1] + 80, ty - 4, { color: c.yellow, width: 3 }));
  wires.push(d.arrow(xs1[1] + 140, ty, xs1[1] + 140, y2 + bh + 4, { color: c.yellow, width: 3 }));
  labels.push(d.icon(xs1[1] + bw + 40, y2 + bh + 18, 64, ICON_ARROW_REPEAT, { color: c.yellow }));
  labels.push(d.label(xs1[1] + bw + 124, 0, "until the goal is reached", { size: 32, color: c.yellow, centerY: y2 + bh + 50 }));
  return d.svg(1680, 640, ...d.layers(wires, boxes, labels));
}
function showChatAgent(slide, step) { put("fig-chat-agent", figChatAgent(step || 0)); }

/* ------------------------------------------------------------------ */
/* inside an agent: one drawing, seven stages                           */
/*   0 goal + LLM · 1 tools · 2 loop · 3 context · 4 plan              */
/*   5 instructions · 6 everything (gray, only the loop yellow)        */
/*   7 everything in full color, to see it as a whole                  */
/* Every stage draws all earlier ones in the same place; the new part  */
/* is bright, the known parts are gray.                                 */
/* ------------------------------------------------------------------ */
function figAnatomy(stage) {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const all = stage >= 6, full = stage >= 7;
  const col = (s) => (full ? c.white : all ? c.gray : s === stage ? c.white : c.gray);
  const rim = (s) => (full ? (s === 0 ? c.blue : c.light) : all ? c.dark : s === stage ? c.blue : c.dark);

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
    labels.push(d.icon(1295, 552, 80, ICON_FOLDER2_OPEN, { color: col(1) }));
    labels.push(d.label(1335, 0, "paper/", { size: 32, color: col(1), anchor: "middle", centerY: 664, mono: true }));
    labels.push(d.label(1335, 0, "_introduction.qmd", { size: 20, color: col(1), anchor: "middle", centerY: 700, mono: true, keepCase: true }));
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
    boxes.push(d.box(K.x + 30, K.y + 85, (K.w - 60) * 0.3, 36, "", { border: null, fill: stage === 3 ? c.yellow : full ? c.light : c.gray, rx: 4 }));
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
    boxes.push(d.box(S.x, S.y, S.w, S.h, "AGENTS.md · skills · commands", { border: rim(5), color: col(5), mono: true, keepCase: true, size: 20 }));
    wires.push(d.arrow(S.x + S.w, 365, L.x - 4, 300, { color: c.gray, width: 3 }));
    labels.push(d.label(540, 0, "loads", { size: 20, color: col(5), anchor: "middle", centerY: 362 }));
    labels.push(d.label(20, 0, "what it should know about your\nproject, how you want certain\nthings done, and what you\noften need", { size: 20, color: col(5), centerY: 480 }));
  }

  return d.svg(1680, 720, ...d.layers(wires, boxes, labels));
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
  ["runs the loop", "carries out the tool calls", "manages the context window", "loads AGENTS.md, skills and commands", "asks you for permission"].forEach((t, i) => {
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
/* the left, marked with a tools icon. Step n shows rows 0..n; the     */
/* newest row is yellow.                                                */
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
    if (tool) parts.push(d.icon(0, y + 8, 44, ICON_TOOLS, { color: c.blue }));
    parts.push(d.label(70, 0, who, { size: 32, color: tool ? c.blue : c.gray, mono: tool, centerY: y + 30 }));
    parts.push(d.label(260, 0, t, { size: 32, color: now ? c.yellow : c.light, mono: tool, keepCase: tool, centerY: y + 30 + (t.includes("\n") ? 21 : 0) }));
  });
  return d.svg(1680, 804, ...parts);
}
function showRun(slide, step) { put("fig-run", figRun(step || 0)); }

/* ------------------------------------------------------------------ */
/* How long the tasks are that agents finish: METR's time horizon, on a */
/* log scale, at 50 % success (blue) and at 80 % success (light).       */
/* ------------------------------------------------------------------ */
const HORIZON = [
  // model, release as a decimal year, 50 % and 80 % horizon in minutes
  ["GPT-4", 2023.20, 4.0, 0.9],
  ["GPT-4o", 2024.36, 7.0, 1.3],
  ["Claude 3.5 Sonnet", 2024.81, 20.5, 2.6],
  ["Claude 3.7 Sonnet", 2025.15, 60.4, 12.1],
  ["o3", 2025.29, 119.7, 30.0],
  ["GPT-5", 2025.60, 203.0, 38.3],
  ["Claude Opus 4.5", 2025.90, 293.0, 49.4],
  ["Claude Opus 4.6", 2026.10, 718.8, 69.9],
  ["Claude Mythos Preview", 2026.27, 1044.8, 185.9],
];
function figHorizon() {
  const c = C();
  const wires = [], marks = [], labels = [];
  const X0 = 160, PX = 360, Y0 = 600, H = 540, LO = 0.5, HI = 2000;
  const xOf = (t) => X0 + (t - 2023) * PX;
  const yOf = (m) => Y0 - (Math.log(m / LO) / Math.log(HI / LO)) * H;
  const XE = xOf(2026.5);
  labels.push(d.label(0, 0, "length of the task, as the time a human expert needs", { size: 20, color: c.gray, centerY: 20 }));
  [[1, "1 min"], [4, "4 min"], [15, "15 min"], [60, "1 h"], [240, "4 h"], [960, "16 h"]].forEach(([m, t]) => {
    wires.push(d.line(X0, yOf(m), XE, yOf(m), { color: c.dark, width: 1 }));
    labels.push(d.label(X0 - 20, 0, t, { size: 20, color: c.gray, anchor: "end", centerY: yOf(m) }));
  });
  wires.push(d.line(X0, Y0, XE, Y0, { color: c.gray, width: 2 }));
  [2023, 2024, 2025, 2026].forEach((yr) => {
    wires.push(d.line(xOf(yr), Y0, xOf(yr), Y0 + 10, { color: c.gray, width: 2 }));
    labels.push(d.label(xOf(yr), 0, String(yr), { size: 20, color: c.gray, anchor: "middle", centerY: Y0 + 34 }));
  });
  const series = (k, color) => {
    const pts = HORIZON.map((r) => [xOf(r[1]), yOf(r[k])]);
    marks.push(`<polyline points="${pts.map((q) => q.join(",")).join(" ")}" fill="none" stroke="${color}" stroke-width="3"/>`);
    pts.forEach(([x, y]) => marks.push(`<circle cx="${x}" cy="${y}" r="8" fill="${color}"/>`));
    return pts[pts.length - 1];
  };
  const [x80, y80] = series(3, c.light);
  const [x50, y50] = series(2, c.blue);
  // the first and the last model with their values
  const [, t0, m50] = HORIZON[0];
  labels.push(d.label(xOf(t0), 0, "GPT-4: 4 min", { size: 20, color: c.gray, anchor: "middle", centerY: yOf(m50) - 34, keepCase: true }));
  labels.push(d.label(xOf(2025.15), 0, "Claude 3.7 Sonnet: 1 h", { size: 20, color: c.gray, anchor: "end", centerY: yOf(60.4) - 30, keepCase: true }));
  labels.push(d.label(x50 + 30, 0, "Claude Mythos Preview", { size: 20, color: c.gray, centerY: y50 - 42, keepCase: true }));
  labels.push(d.label(x50 + 30, 0, "17 h", { size: 32, color: c.blue, centerY: y50 }));
  labels.push(d.label(x50 + 30, 0, "solved half the time", { size: 20, color: c.blue, centerY: y50 + 32 }));
  labels.push(d.label(x80 + 30, 0, "3 h", { size: 32, color: c.light, centerY: y80 }));
  labels.push(d.label(x80 + 30, 0, "solved 4 out of 5 times", { size: 20, color: c.light, centerY: y80 + 32 }));
  return d.svg(1680, 660, ...wires, ...marks, ...labels);
}

/* ------------------------------------------------------------------ */
/* Risks of working with an agent, each with what helps against it.    */
/* Texts at 32 px hold about 35 characters next to the icon.            */
/* ------------------------------------------------------------------ */
const RISKS = [
  ["deletes or overwrites files", "work in git or on a copy"],
  ["runs a harmful command", "approve every command it runs"],
  ["obeys orders hidden in a text", "read what it wants to do first"],
  ["code that runs but is wrong", "check one number by hand"],
  ["cites sources that do not exist", "open every reference you cite"],
  ["personal data leaves your computer", "keep personal data out"],
  ["settles for the easy analysis", "decide on the method yourself"],
  ["you no longer know your own paper", "read every change you accept"],
];
function figRisks() {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const W = 760, R = 920, TOP = 60, PITCH = 92, H = 72;
  labels.push(d.label(0, 0, "risk", { size: 20, color: c.gray, centerY: 20 }));
  labels.push(d.label(R, 0, "what helps", { size: 20, color: c.gray, centerY: 20 }));
  RISKS.forEach(([risk, help], i) => {
    const y = TOP + i * PITCH, cy = y + H / 2;
    boxes.push(d.box(1, y, W - 2, H, "", { border: c.dark, rx: 8 }));
    labels.push(d.icon(22, cy - 20, 40, ICON_WARNING, { color: c.yellow }));
    labels.push(d.label(84, 0, risk, { size: 32, color: c.light, centerY: cy }));
    wires.push(d.arrow(W + 16, cy, R - 16, cy, { color: c.gray, width: 2 }));
    boxes.push(d.box(R + 1, y, W - 2, H, "", { border: c.dark, rx: 8 }));
    labels.push(d.icon(R + 22, cy - 20, 40, ICON_SHIELD_CHECK, { color: c.green }));
    labels.push(d.label(R + 84, 0, help, { size: 32, color: c.white, centerY: cy }));
  });
  return d.svg(1680, 804, ...d.layers(wires, boxes, labels));
}

// drawn at once, before stagekit.js builds the frames
put("fig-chat-agent", figChatAgent(0));
document.querySelectorAll(".figure[data-stage]").forEach((el) => { el.innerHTML = figAnatomy(+el.dataset.stage); });
put("fig-harness", figHarness());
put("fig-run", figRun(0));
put("fig-horizon", figHorizon());
put("fig-risks", figRisks());
Object.assign(window, { showChatAgent, showAnatomy, showRun });
