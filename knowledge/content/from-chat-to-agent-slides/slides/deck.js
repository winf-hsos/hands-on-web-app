// Drawings of the deck "from chat to agent". The figure area is 1680 x 804, or 1680 x 660 on slides
// with a punchline; sizes 20, 32, 48 and 80 come out as written. Box widths are checked against the
// longest line: characters x size x 0.6, plus 20 on each side. Boxes at the edge of the area are inset by
// 2, half the stroke, so that their frame is not cut off.
// Numbers and tool calls are those of real runs (OpenCode 2.4.1 with gpt-6-luna and with gemma-4-e2b in
// LM Studio 0.4.28), read in the session and in the server log of LM Studio.
const d = window.draw;
const el = (id) => document.getElementById(id);
const W = 1680, H = 804, HP = 660;
const c = d.colors();

// Bootstrap Icons 1.11.3 (MIT, (c) The Bootstrap Authors), from stagekit/tools/icon.py
const ICON_PERSON = '<path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>';
const ICON_CLOUD = '<path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>';
const ICON_LAPTOP = '<path d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5"/>';

// Parts that appear in a later build step are named groups; each step shows the next one.
function steps(id, names) {
  const a = d.anim(id, { back: "play" });
  names.forEach((n) => a.step(a.show(n, { dur: 450 })));
}

// ------------------------------------------------------------ chat and agent

// A chat passes once through the model, an agent loops between the model and its tools.
function figChatAgent() {
  const chat = [], agent = [];
  // chat: you -> model -> text
  chat.push(d.arrow(150, 205, 280, 205, { color: c.light, width: 3 }));
  chat.push(d.arrow(480, 270, 480, 400, { color: c.light, width: 3 }));
  chat.push(d.label(0, 0, "chat", { size: 48, centerY: 50 }));
  chat.push(d.icon(20, 150, 110, ICON_PERSON, { color: c.light }));
  chat.push(d.label(75, 0, "you", { size: 20, color: c.gray, anchor: "middle", centerY: 290 }));
  // "language model": 14 x 32 x 0.6 = 269, box 380
  chat.push(d.box(290, 140, 380, 130, "", { border: c.light }));
  chat.push(d.label(480, 0, "language model", { size: 32, anchor: "middle", centerY: 205 }));
  // "an answer as text": 17 x 19.2 = 327, box 380
  chat.push(d.box(290, 410, 380, 110, "", { border: c.dark, dashed: true }));
  chat.push(d.label(480, 0, "an answer as text", { size: 32, color: c.light, anchor: "middle", centerY: 465 }));
  chat.push(d.label(480, 0, "one question, one answer", { size: 32, color: c.gray, anchor: "middle", centerY: 650 }));

  // agent: you -> model <-> tools, as often as needed
  agent.push(d.arrow(1010, 205, 1140, 205, { color: c.light, width: 3 }));
  agent.push(d.arrow(1270, 270, 1270, 430, { color: c.blue, width: 3 }));
  agent.push(d.arrow(1410, 430, 1410, 270, { color: c.blue, width: 3 }));
  agent.push(d.label(860, 0, "agent", { size: 48, centerY: 50 }));
  agent.push(d.icon(880, 150, 110, ICON_PERSON, { color: c.light }));
  agent.push(d.label(935, 0, "you", { size: 20, color: c.gray, anchor: "middle", centerY: 290 }));
  agent.push(d.box(1150, 140, 380, 130, "", { border: c.light }));
  agent.push(d.label(1340, 0, "language model", { size: 32, anchor: "middle", centerY: 205 }));
  agent.push(d.label(1255, 0, "call", { size: 20, color: c.blue, anchor: "end", centerY: 350 }));
  agent.push(d.label(1425, 0, "result", { size: 20, color: c.blue, centerY: 350 }));
  // "files · shell · web": 18 x 12 = 216, box 380
  agent.push(d.box(1150, 430, 380, 130, "", { border: c.blue }));
  agent.push(d.label(1340, 0, "tools", { size: 32, anchor: "middle", centerY: 478 }));
  agent.push(d.label(1340, 0, "files · shell · web", { size: 20, color: c.gray, anchor: "middle", centerY: 528 }));
  // 33 x 19.2 = 634, centred at 1340: 1023 to 1657
  agent.push(d.label(1340, 0, "calls tools and reads the results\nuntil the job is done", { size: 32, color: c.gray, anchor: "middle", centerY: 670 }));

  el("fig-chat-agent").innerHTML = d.svg(W, H, ...chat, d.g("agent", agent.join("")));
  steps("fig-chat-agent", ["agent"]);
}

// OpenCode on the laptop with two providers: OpenAI outside the laptop, LM Studio on it.
function figProviders() {
  const parts = [], props = [];
  parts.push(d.line(940, 210, 940, 380, { color: c.light, width: 3 }));
  parts.push(d.line(462, 380, 1238, 380, { color: c.light, width: 3 }));
  parts.push(d.box(600, 4, 1076, 500, "", { border: c.dark, dashed: true, rx: 18, fill: "none" }));
  // the two places: a laptop at the top left of its frame, a cloud above the model at OpenAI
  parts.push(d.icon(630, 18, 56, ICON_LAPTOP, { color: c.gray }));
  parts.push(d.label(700, 0, "your laptop", { size: 20, color: c.gray, centerY: 46 }));
  parts.push(d.icon(172, 170, 120, ICON_CLOUD, { color: c.gray }));
  // "OpenCode": 8 x 48 x 0.6 = 230, box 360
  parts.push(d.box(760, 90, 360, 120, "", { border: c.blue, width: 3 }));
  parts.push(d.label(940, 0, "OpenCode", { size: 48, anchor: "middle", centerY: 150, keepCase: true }));
  // "gpt-6-luna": 10 x 28.8 = 288, box 460
  parts.push(d.box(2, 310, 460, 140, "", { border: c.light }));
  parts.push(d.label(232, 0, "gpt-6-luna", { size: 48, mono: true, anchor: "middle", centerY: 362, keepCase: true }));
  parts.push(d.label(232, 0, "at OpenAI, in the cloud", { size: 20, color: c.gray, anchor: "middle", centerY: 418, keepCase: true }));
  // "in LM Studio at 127.0.0.1:1234": 30 x 12 = 360, "gemma-4-e2b": 11 x 28.8 = 317, box 420
  parts.push(d.box(1238, 310, 420, 140, "", { border: c.light }));
  parts.push(d.label(1448, 0, "gemma-4-e2b", { size: 48, mono: true, anchor: "middle", centerY: 362, keepCase: true }));
  parts.push(d.label(1448, 0, "in LM Studio at 127.0.0.1:1234", { size: 20, color: c.gray, anchor: "middle", centerY: 418, keepCase: true }));
  // "your text leaves the laptop": 27 x 19.2 = 518
  ["larger and stronger", "costs money per token", "your text leaves the laptop"].forEach((t, i) =>
    props.push(d.label(2, 0, t, { size: 32, color: c.white, centerY: 590 + i * 64 })));
  // "small, 4.4 GB on disk": 21 x 19.2 = 403, column 440
  ["small, 4.4 GB on disk", "free and private", "slower, more mistakes"].forEach((t, i) =>
    props.push(d.label(1238, 0, t, { size: 32, color: c.white, centerY: 590 + i * 64, keepCase: true })));
  el("fig-providers").innerHTML = d.svg(W, H, ...parts, d.g("props", props.join("")));
  steps("fig-providers", ["props"]);
}

// ------------------------------------------------------------ the folder

// One request for "hi", drawn to scale in characters: system prompt, tool descriptions, and the two
// characters typed. Scale: 1628 units for 43,000 characters; the hi gets a small box of its own, since
// to scale it would be a tenth of a unit wide.
function figRequest() {
  const k = 1628 / 43000;
  const xSys = 2, wSys = Math.round(25000 * k);            // 947
  const xTools = xSys + wSys, wTools = Math.round(18000 * k); // 681, ends at 1630
  const hi = [], sys = [], tools = [];
  hi.push(d.box(1642, 280, 34, 120, "", { border: c.yellow, width: 3 }));
  // "your hi: 2 characters": 21 x 19.2 = 403
  hi.push(d.label(1676, 0, "your hi: 2 characters", { size: 32, color: c.yellow, anchor: "end", centerY: 470 }));
  // 59 x 12 = 708
  hi.push(d.label(2, 0, "one request to the model, drawn to scale except for your hi", { size: 20, color: c.gray, centerY: 470 }));
  sys.push(d.box(xSys, 280, wSys, 120, "", { border: c.light }));
  sys.push(d.label(xSys + wSys / 2, 0, "system prompt", { size: 32, anchor: "middle", centerY: 170 }));
  sys.push(d.label(xSys + wSys / 2, 0, "how the agent works, with your AGENTS.md: about 25,000 characters", { size: 20, color: c.gray, anchor: "middle", centerY: 220, keepCase: true }));
  tools.push(d.box(xTools, 280, wTools, 120, "", { border: c.blue }));
  tools.push(d.label(xTools + wTools / 2, 0, "tool descriptions", { size: 32, anchor: "middle", centerY: 170 }));
  // 55 x 12 = 660, under a box of 697
  tools.push(d.label(xTools + wTools / 2, 0, "14 tools with their parameters: about 18,000 characters", { size: 20, color: c.gray, anchor: "middle", centerY: 220 }));
  el("fig-request").innerHTML = d.svg(W, HP, ...hi, d.g("sys", sys.join("")), d.g("tools", tools.join("")));
  steps("fig-request", ["sys", "tools"]);
}

// ------------------------------------------------------------ small and large

// What the two models did in one session: the small one wrote the file eight times and compiled three
// times, the large one read, edited and compiled once.
function figAttempts() {
  const small = [], large = [];
  const seq = ["write", "typst", "write", "write", "write", "write", "write", "typst", "write", "write", "typst"];
  const bw = 138, gap = 15.6;   // 11 boxes from 2 to 1676
  small.push(d.label(2, 0, "gemma-4-e2b", { size: 32, mono: true, color: c.light, centerY: 40, keepCase: true }));
  seq.forEach((s, i) => {
    const x = 2 + i * (bw + gap), compile = s === "typst";
    small.push(d.box(x, 80, bw, 90, "", { border: compile ? c.red : c.dark }));
    small.push(d.label(x + bw / 2, 0, s, { size: 32, mono: true, color: compile ? c.white : c.light, anchor: "middle", centerY: 125, keepCase: true }));
    if (compile) small.push(d.mark(x + bw / 2, 205, false));
  });
  // 57 x 19.2 = 1094
  small.push(d.label(2, 0, "“It seems there is an issue with compiling the Typst file\ncontent through the provided tools.”", { size: 32, color: c.white, centerY: 300, keepCase: true }));
  small.push(d.label(2, 0, "its last answer, after eight versions of the file, all of them in Markdown", { size: 20, color: c.gray, centerY: 380, keepCase: true }));

  large.push(d.label(2, 0, "gpt-6-luna", { size: 32, mono: true, color: c.light, centerY: 450, keepCase: true }));
  // "Fix the error.": 14 x 19.2 = 269, box 330
  large.push(d.box(2, 490, 330, 90, "", { border: c.light }));
  large.push(d.label(167, 0, "Fix the error.", { size: 32, anchor: "middle", centerY: 535, keepCase: true }));
  large.push(d.arrow(340, 535, 395, 535, { color: c.light, width: 3 }));
  [["read", c.dark], ["edit", c.dark], ["typst", c.green]].forEach(([s, col], i) => {
    const x = 402 + i * (bw + gap);
    large.push(d.box(x, 490, bw, 90, "", { border: col }));
    large.push(d.label(x + bw / 2, 0, s, { size: 32, mono: true, color: i === 2 ? c.white : c.light, anchor: "middle", centerY: 535, keepCase: true }));
  });
  large.push(d.mark(402 + 2 * (bw + gap) + bw / 2, 615, true));
  // "flyer.pdf, in about 15 seconds": 30 x 19.2 = 576, from 900
  large.push(d.label(900, 0, "flyer.pdf, in about 15 seconds", { size: 32, color: c.green, centerY: 535 }));
  el("fig-attempts").innerHTML = d.svg(W, HP, ...small, d.g("large", large.join("")));
  steps("fig-attempts", ["large"]);
}

// ------------------------------------------------------------ the context window

// The request for "hi" against two context windows, drawn to scale in tokens: 1320 units for 32,768.
function figWindow() {
  const k = 1320 / 32768, x0 = 340;
  const req = Math.round(10581 * k), small = Math.round(8192 * k), large = Math.round(32768 * k); // 426, 330, 1320
  const parts = [], big = [];
  parts.push(d.label(2, 0, "a plain hi", { size: 32, color: c.light, centerY: 100 }));
  parts.push(d.box(x0, 60, req, 80, "", { border: c.light }));
  // "10,581 tokens": 13 x 19.2 = 250, box 426
  parts.push(d.label(x0 + req / 2, 0, "10,581 tokens", { size: 32, anchor: "middle", centerY: 100 }));

  // "window of 8,192": 15 x 19.2 = 288, column 320
  parts.push(d.label(2, 0, "window of 8,192", { size: 32, color: c.light, centerY: 290 }));
  parts.push(d.box(x0, 258, req, 64, "", { border: c.light }));
  parts.push(`<rect x="${x0 + small}" y="258" width="${req - small}" height="64" fill="${c.red}"/>`);
  parts.push(d.box(x0, 250, small, 80, "", { border: c.red, width: 3, fill: "none" }));
  parts.push(d.label(x0 + req + 40, 0, "does not fit, so there is no answer, only an error", { size: 32, color: c.red, centerY: 290 }));

  big.push(d.label(2, 0, "window of 32,768", { size: 32, color: c.light, centerY: 480 }));
  big.push(d.box(x0, 448, req, 64, "", { border: c.light }));
  big.push(d.box(x0, 440, large, 80, "", { border: c.green, width: 3, fill: "none" }));
  // 52 x 12 = 624, from 806 to 1430, inside the frame that ends at 1660
  big.push(d.label(x0 + req + 40, 0, "room for the conversation and the files the agent reads", { size: 20, color: c.gray, centerY: 480 }));
  el("fig-window").innerHTML = d.svg(W, HP, ...parts, d.g("big", big.join("")));
  steps("fig-window", ["big"]);
}

// A session as a stack of messages that fills the context window, and the same session after /compact.
function figCompact() {
  const left = [], right = [];
  const card = (arr, x, y, h, text, border, size = 20) => {
    arr.push(d.box(x, y, 620, h, "", { border }));
    arr.push(d.label(x + 24, 0, text, { size, color: c.light, centerY: y + h / 2 }));
  };
  const limit = (arr, x) => arr.push(d.line(x, 610, x + 620, 610, { color: c.red, width: 3, dashed: true }));
  card(left, 2, 30, 100, "system prompt and tools", c.dark, 32);
  ["you", "agent", "tool call", "result", "you", "agent", "tool call", "result"].forEach((t, i) =>
    card(left, 2, 140 + i * 56, 46, t, c.dark));
  limit(left, 2);
  left.push(d.label(2, 0, "limit of the context window", { size: 20, color: c.red, centerY: 640 }));

  right.push(d.arrow(680, 330, 990, 330, { color: c.blue, width: 3 }));
  right.push(d.label(835, 0, "/compact", { size: 32, mono: true, color: c.blue, anchor: "middle", centerY: 290 }));
  card(right, 1056, 30, 100, "system prompt and tools", c.dark, 32);
  // "a summary of the session": 24 x 19.2 = 461, box 620
  card(right, 1056, 140, 110, "a summary of the session", c.green, 32);
  ["you", "agent"].forEach((t, i) => card(right, 1056, 260 + i * 56, 46, t, c.dark));
  limit(right, 1056);
  el("fig-compact").innerHTML = d.svg(W, HP, ...left, d.g("after", right.join("")));
  steps("fig-compact", ["after"]);
}

// ------------------------------------------------------------ commands and browser

// The desktop app with the session on the left and its browser on the right.
function figBrowser() {
  const parts = [];
  parts.push(d.box(2, 2, 1676, 760, "", { border: c.dark, rx: 14, fill: "none" }));
  parts.push(d.line(2, 76, 1678, 76, { color: c.dark, width: 2 }));
  parts.push(d.line(780, 76, 780, 762, { color: c.dark, width: 2 }));
  parts.push(d.label(32, 0, "OpenCode", { size: 20, color: c.gray, centerY: 40, keepCase: true }));
  // the prompt: longest line 33 x 19.2 = 634, box 680
  parts.push(d.box(60, 104, 690, 170, "", { border: c.light, rx: 14 }));
  parts.push(d.label(84, 0, "Open hands-on-computer-science.de\nin the browser and tell me what\nthe start page offers.", { size: 32, centerY: 189, keepCase: true }));
  // two tool calls: the name in the code font, what it did next to it
  [["skill", "loads the instructions for the browser"], ["execute", "runs a script that drives the browser"]].forEach(([name, what], i) => {
    const y = 300 + i * 90;
    parts.push(d.box(30, y, 720, 70, "", { border: c.dark, dashed: true, rx: 10 }));
    parts.push(d.label(54, 0, name, { size: 32, mono: true, color: c.blue, centerY: y + 35, keepCase: true }));
    parts.push(d.label(240, 0, what, { size: 20, color: c.gray, centerY: y + 35 }));
  });
  // the answer: 32 x 19.2 = 614, box 720
  parts.push(d.box(30, 500, 720, 140, "", { border: c.blue, rx: 14 }));
  parts.push(d.label(54, 0, "answers with the three areas\nof the site and what they offer", { size: 32, color: c.light, centerY: 570 }));
  // the browser: address bar and a sketched page
  parts.push(d.box(820, 104, 820, 64, "", { border: c.dark, rx: 32 }));
  parts.push(d.label(852, 0, "hands-on-computer-science.de", { size: 20, mono: true, color: c.gray, centerY: 136, keepCase: true }));
  parts.push(d.label(820, 0, "Hands-on Computer Science", { size: 48, centerY: 250, keepCase: true }));
  [0, 1, 2].forEach((i) => {
    const x = 820 + i * 285;
    parts.push(d.box(x, 330, 250, 330, "", { border: c.dark, rx: 12 }));
    parts.push(`<rect x="${x + 30}" y="370" width="150" height="24" rx="6" fill="${c.dark}"/>`);
    [0, 1, 2, 3].forEach((j) => parts.push(`<rect x="${x + 30}" y="${430 + j * 44}" width="${190 - (j % 2) * 50}" height="14" rx="4" fill="${c.dark}"/>`));
  });
  return d.svg(W, H, ...parts);
}

// ------------------------------------------------------------ draw

figChatAgent();
figProviders();
figRequest();
figAttempts();
figWindow();
figCompact();
el("fig-browser").innerHTML = figBrowser();
