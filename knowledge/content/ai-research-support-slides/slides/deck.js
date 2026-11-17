// Drawings of "ai as a copilot in empirical research".
// Every figure is 1680 units wide, the width of a figure on the 1920 canvas,
// so text sizes come out as written (20, 32, 48, 80). Figures are 660 high on
// slides with a punchline and 804 without.
//
// Colors: gray for context and tools, white for what you read first, blue
// for work an AI does (and for links), green for the step in which you check
// a result, yellow for what is current, red only for an error and for the
// measured loss outside the frontier.
//
// Sources:
// - Kinds of AI: selection after the overview of the university library
//   Duisburg-Essen, "KI-Tools" (as of November 2026),
//   https://www.uni-due.de/ub/ki-tools.php, plus HAWKI of Osnabrück
//   University of Applied Sciences.
// - Phases: Döring (2023), Forschungsmethoden und Evaluation, 6th ed.,
//   section 1.3.1 (p. 23) and chapters 5 to 13, one per phase.
// - Dell'Acqua et al. (2023), HBS Working Paper 24-013: 758 BCG consultants,
//   GPT-4. Inside the frontier 12.2 % more tasks, 25.1 % faster, more than
//   40 % higher quality; outside it 19 percentage points less often correct.
//   The growing frontier is a schematic picture of the idea, not a measurement.
// - Walters & Wilder (2023), Scientific Reports 13, 14045: 636 references;
//   fabricated 55 % (GPT-3.5) and 18 % (GPT-4); of the real ones, 43 % and
//   24 % had substantive errors.
// - Topaz et al. (2026), The Lancet 407, 1779–1781 (figures as reported by
//   Retraction Watch, 7 May 2026): papers with at least one fabricated
//   reference, 1 in 2,828 (2023), 1 in 458 (2025), 1 in 277 (first seven
//   weeks of 2026).
// - Rao, Wong & Callison-Burch (2026), arXiv 2604.03173: cited links that do
//   not resolve and were never archived, 10.7 % for two deep research agents
//   and 4.8 % for eight models with web search (pooled).
const d = window.draw;
const C = () => d.colors();
const put = (id, svg) => { const e = document.getElementById(id); if (e) e.innerHTML = svg; };

// Bootstrap Icons 1.11.3 (MIT, (c) The Bootstrap Authors): "person-fill",
// "person-check-fill", "robot", "chat-dots", "database", "search",
// "file-earmark-text", "folder2-open", "terminal", "globe", "arrow-repeat"
const ICON_PERSON_FILL = '<path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>';
const ICON_PERSON_CHECK_FILL = '<path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/><path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>';
const ICON_ROBOT = '<path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.760 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.340.346-4.235.346s-3.390-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.020.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.710a.25.25 0 0 0 .404.062l.932-.970a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.980.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.700a.25.25 0 0 0-.182-.135"/><path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5"/>';
const ICON_CHAT_DOTS = '<path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/><path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2"/>';
const ICON_DATABASE = '<path d="M4.318 2.687C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4c0-.374.356-.875 1.318-1.313M13 5.698V7c0 .374-.356.875-1.318 1.313C10.766 8.729 9.464 9 8 9s-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777A5 5 0 0 0 13 5.698M14 4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.710 6.427 16 8 16s3.022-.289 4.096-.777C13.125 14.755 14 14.007 14 13zm-1 4.698V10c0 .374-.356.875-1.318 1.313C10.766 11.729 9.464 12 8 12s-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.710 6.427 10 8 10s3.022-.289 4.096-.777A5 5 0 0 0 13 8.698m0 3V13c0 .374-.356.875-1.318 1.313C10.766 14.729 9.464 15 8 15s-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.710 6.427 13 8 13s3.022-.289 4.096-.777c.324-.147.633-.323.904-.525"/>';
const ICON_SEARCH = '<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>';
const ICON_FILE_TEXT = '<path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/><path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>';
const ICON_FOLDER = '<path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7z"/>';
const ICON_TERMINAL = '<path d="M6 9a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3A.5.5 0 0 1 6 9M3.854 4.146a.5.5 0 1 0-.708.708L4.793 6.5 3.146 8.146a.5.5 0 1 0 .708.708l2-2a.5.5 0 0 0 0-.708z"/><path d="M2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/>';
const ICON_GLOBE = '<path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z"/>';
const ICON_ARROW_REPEAT = '<path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"/><path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/>';

// A label that is a link: blue, opens in a new tab, and a click on it does
// not advance the slide (stagekit skips clicks on a).
const link = (x, cy, text, url, o = {}) =>
  `<a href="${url}" target="_blank" rel="noopener">${d.label(x, 0, text, { size: 32, color: C().blue, keepCase: true, ...o, centerY: cy })}</a>`;

/* ------------------------------------------------------------------ */
/* Three kinds of AI, one column each, appearing one by one. Each       */
/* column: symbol and name, one sentence, a small schematic of how the  */
/* kind works (y 220..440), and the tools as links.                     */
/* Column 520 wide; text at 32 px holds 23 characters per line.         */
/* ------------------------------------------------------------------ */
const KINDS = [
  { name: "chatbots", icon: ICON_CHAT_DOTS, what: "answer in a chat, on\nalmost any topic", tools: [
    ["ChatGPT", "https://chatgpt.com"], ["Claude", "https://claude.ai"], ["Gemini", "https://gemini.google.com"],
    ["Chat AI (GWDG)", "https://chat-ai.academiccloud.de"], ["HAWKI (HS Osnabrück)", "https://hawki.hs-osnabrueck.de"]] },
  { name: "research tools", icon: ICON_SEARCH, what: "do one job in research\nand do it well", tools: [
    ["Consensus", "https://consensus.app"], ["Elicit", "https://elicit.com"], ["SciSpace", "https://scispace.com"],
    ["Research Rabbit", "https://www.researchrabbit.ai"], ["Litmaps", "https://www.litmaps.com"], ["NotebookLM", "https://notebooklm.google.com"]] },
  { name: "agents", icon: ICON_ROBOT, what: "act on their own, on\nalmost any task", tools: [
    ["OpenCode", "https://opencode.ai"], ["Claude Code", "https://www.anthropic.com/claude-code"], ["Codex", "https://openai.com/codex"]] },
];

// chatbot: you ask (white), the model answers (blue), and so on
function schemaChat(x) {
  const c = C(), out = [];
  const rows = [["you", "your question", 228], ["ai", "an answer", 298], ["you", "a follow-up", 368]];
  rows.forEach(([who, t, y]) => {
    if (who === "you") {
      out.push(d.icon(x + 32, y + 8, 40, ICON_PERSON_FILL, { color: c.light }));
      out.push(d.box(x + 88, y, 290, 56, t, { border: c.light, size: 32 }));
    } else {
      out.push(d.box(x + 142, y, 290, 56, t, { border: null, fill: c.blue, size: 32 }));
      out.push(d.icon(x + 448, y + 8, 40, ICON_ROBOT, { color: c.blue }));
    }
  });
  out.push(d.label(x + 32, 0, "works with what you type or upload", { size: 20, color: c.gray, centerY: 452 }));
  return out;
}

// research tool: a database of papers, a search, a list of studies
function schemaResearch(x) {
  const c = C(), wires = [], parts = [];
  parts.push(d.icon(x + 32, 264, 72, ICON_DATABASE, { color: c.light }));
  wires.push(d.arrow(x + 116, 300, x + 168, 300, { color: c.gray, head: 12 }));
  parts.push(d.icon(x + 180, 268, 64, ICON_SEARCH, { color: c.blue }));
  wires.push(d.arrow(x + 256, 300, x + 300, 300, { color: c.gray, head: 12 }));
  [0, 1, 2].forEach((k) => {
    const y = 230 + k * 50;
    parts.push(d.box(x + 312, y, 176, 40, "", { border: c.light }));
    parts.push(d.icon(x + 322, y + 8, 24, ICON_FILE_TEXT, { color: c.light }));
    parts.push(d.label(x + 356, 0, "study " + (k + 1), { size: 20, color: c.white, centerY: y + 20 }));
  });
  parts.push(d.label(x + 32, 0, "works with a database of papers\nand with your PDFs", { size: 20, color: c.gray, centerY: 432, lineHeight: 1.3, keepCase: true }));
  return [...wires, ...parts];
}

// agent: works in a loop with your files, programs and the web
function schemaAgent(x) {
  const c = C(), wires = [], parts = [];
  const tools = [[ICON_FOLDER, "files", 226], [ICON_TERMINAL, "programs", 282], [ICON_GLOBE, "the web", 338]];
  tools.forEach(([ic, t, y]) => {
    parts.push(d.icon(x + 32, y, 40, ic, { color: c.light }));
    parts.push(d.label(x + 84, 0, t, { size: 20, color: c.light, centerY: y + 20 }));
    wires.push(d.line(x + 190, y + 20, x + 318, 302, { color: c.gray, width: 2 }));
  });
  parts.push(d.icon(x + 322, 258, 88, ICON_ROBOT, { color: c.blue }));
  parts.push(d.icon(x + 424, 282, 40, ICON_ARROW_REPEAT, { color: c.gray }));
  parts.push(d.label(x + 32, 0, "works with your files, programs\nand the web, in a loop", { size: 20, color: c.gray, centerY: 432, lineHeight: 1.3 }));
  return [...wires, ...parts];
}

function figKinds(step) {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const W = 520, G = 60;
  const schemas = [schemaChat, schemaResearch, schemaAgent];
  KINDS.forEach((k, i) => {
    if (i > step) return;
    const x = i * (W + G), now = i === step;
    // inset by 2 for the stroke width of 2
    boxes.push(d.box(x + 2, 2, W - 4, 800, "", { border: now ? c.white : c.dark, width: 2 }));
    labels.push(d.icon(x + 32, 32, 48, k.icon, { color: c.blue }));
    labels.push(d.label(x + 100, 0, k.name, { size: 48, color: c.white, centerY: 56 }));
    labels.push(d.label(x + 32, 0, k.what, { size: 32, color: c.light, centerY: 152, lineHeight: 1.3 }));
    labels.push(...schemas[i](x));
    labels.push(d.label(x + 32, 0, "for example", { size: 20, color: c.gray, centerY: 500 }));
    k.tools.forEach(([t, url], j) => labels.push(link(x + 32, 544 + j * 44, t, url)));
  });
  return d.svg(1680, 804, ...d.layers(wires, boxes, labels));
}
function showKinds(slide, step) { put("fig-kinds", figKinds(step || 0)); }

/* ------------------------------------------------------------------ */
/* The nine phases of an empirical study after Döring (2023), in three  */
/* rows of three. Step 1 marks the middle row, which a secondary        */
/* analysis takes over from the people who ran the survey.              */
/* ------------------------------------------------------------------ */
function figPhases(step) {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const W = 520, G = 60, H = 110;
  const rows = [
    { y: 60, title: "plan", phases: ["research topic", "state of research", "study design"] },
    { y: 310, title: "collect data", phases: ["operationalization", "sampling", "data collection"] },
    { y: 560, title: "analyze and report", phases: ["data preparation", "data analysis", "presentation"] },
  ];
  let n = 0;
  rows.forEach((r, ri) => {
    const other = step >= 1 && ri === 1;
    labels.push(d.label(0, 0, r.title, { size: 32, color: c.gray, centerY: r.y - 30 }));
    r.phases.forEach((t, i) => {
      n += 1;
      const x = i * (W + G);
      boxes.push(d.box(x + 2, r.y, W - 4, H, "", { border: other ? c.dark : c.light, dashed: other }));
      labels.push(d.label(x + 32, 0, String(n), { size: 32, color: c.gray, mono: true, centerY: r.y + H / 2 }));
      labels.push(d.label(x + 90, 0, t, { size: 32, color: other ? c.gray : c.white, centerY: r.y + H / 2 }));
      if (i) wires.push(d.arrow(x - G + 6, r.y + H / 2, x - 4, r.y + H / 2, { color: c.gray, width: 3 }));
    });
  });
  if (step >= 1) labels.push(d.label(0, 0, "in a secondary analysis, the people who ran the survey did these", { size: 32, color: c.gray, centerY: 450 }));
  return d.svg(1680, 700, ...d.layers(wires, boxes, labels));
}
function showPhases(slide, step) { put("fig-phases", figPhases(step || 0)); }

/* ------------------------------------------------------------------ */
/* Three levels of AI use as timelines. Each level is a row of lanes:   */
/* you, the ai (an agent on level 3) and, on level 3, its tools. Time   */
/* runs from left to right; a bar is a stretch of work, a short arrow   */
/* a handover. Each build-up step plays one level from left to right:   */
/*   1  you work and ask the ai in between,                             */
/*   2  you give a task, the ai drafts, you check,                      */
/*   3  you give a goal, the agent works with its tools in a loop until */
/*      the goal is reached, and you check the result.                  */
/* Geometry: the timeline runs from x 440 to 1676 (100 units = 1236);   */
/* lanes are 56 high, 80 apart. Bar labels at 32 px fit when            */
/* chars * 19.2 + 24 <= width; agent and tool bars use 20 px (12 per    */
/* character). Bars of you: dark with a light frame; ai and agent:      */
/* blue; tools: gray, an error red; your check: green frame and symbol. */
/* ------------------------------------------------------------------ */
const TL = { x0: 440, x1: 1676, lh: 56, step: 80 };
const tx = (t) => TL.x0 + t * (TL.x1 - TL.x0) / 100;
const ROWS = [
  { y: 14, name: "ai advises", lanes: ["you", "ai"] },
  { y: 204, name: "ai drafts,\nyou review", lanes: ["you", "ai"] },
  { y: 394, name: "ai does it,\nyou check", lanes: ["you", "agent", "tools"] },
];
const laneY = (r, l) => ROWS[r].y + l * TL.step;

// labels per phase: level 1 [you, ai, you], level 2 [task, ai, check],
// level 3 [goal, agent x3, tools x2]; a tool label starting with "!" is an error
const LEVELS = {
  general: {
    l1: ["you do the work", "ai advises", "you go on"],
    l2: ["a task", "ai makes a draft", "you review"],
    l3: ["a goal", ["plans", "acts", "reports"], ["files, web", "programs"]],
  },
  question: {
    l1: ["you draft a question", "fitting columns", "you sharpen it"],
    l2: ["the data", "suggests five questions", "you pick one"],
    l3: ["a topic", ["reads", "drafts", "tests"], ["codebook", "data"]],
  },
  literature: {
    l1: ["you search the library", "search terms", "you read studies"],
    l2: ["a topic", "finds and summarizes", "you read the best"],
    l3: ["a topic", ["searches", "reads", "writes"], ["browser", "pdfs"]],
  },
  analysis: {
    l1: ["you write the r code", "explains errors", "you run it"],
    l2: ["a task", "writes the r code", "you run and check"],
    l3: ["question", ["writes", "fixes", "reports"], ["!error", "runs r"]],
  },
  figures: {
    l1: ["you draw the chart", "suggestions", "you improve it"],
    l2: ["a sketch", "writes ggplot2 code", "you fix the labels"],
    l3: ["question", ["plans", "draws", "inserts"], ["data", "r"]],
  },
  writing: {
    l1: ["you write a section", "feedback", "you revise"],
    l2: ["your notes", "drafts the section", "you rewrite it"],
    l3: ["sources", ["outlines", "writes", "revises"], ["pdfs", "data"]],
  },
};

function bar(name, row, lane, t0, t1, text, kind) {
  const c = C();
  const x = tx(t0) + 2, w = tx(t1) - tx(t0) - 4, y = laneY(row, lane);
  if (kind === "check") {
    return d.g(name,
      d.box(x, y, w, TL.lh, "", { border: c.green, width: 3, fill: "none" }),
      d.icon(x + 18, y + 10, 36, ICON_PERSON_CHECK_FILL, { color: c.green }),
      d.label(x + 68, 0, text, { size: 32, color: c.white, centerY: y + TL.lh / 2 }));
  }
  const style = {
    you: { border: c.light, fill: c.dark, size: 32 },
    ai: { border: null, fill: c.blue, size: 32 },
    agent: { border: null, fill: c.blue, size: 20 },
    tool: { border: null, fill: c.gray, size: 20 },
    error: { border: null, fill: c.red, size: 20 },
  }[kind];
  return d.g(name, d.box(x, y, w, TL.lh, text, { ...style, color: c.white }));
}
// a handover: a short arrow from one lane to another at time t
function hand(name, row, from, to, t) {
  const c = C(), x = tx(t);
  const down = to > from;
  const y1 = down ? laneY(row, from) + TL.lh + 3 : laneY(row, from) - 3;
  const y2 = down ? laneY(row, to) - 3 : laneY(row, to) + TL.lh + 3;
  return d.g(name, d.arrow(x, y1, x, y2, { color: c.light, width: 2, head: 10 }));
}

function figLevels(topic) {
  const c = C();
  const L = LEVELS[topic] || LEVELS.general;
  const statics = [], bars = [], hands = [];
  // left column: level number and name, lane names
  ROWS.forEach((r, i) => {
    const h = (r.lanes.length - 1) * TL.step + TL.lh, cy = r.y + h / 2;
    statics.push(d.label(0, 0, String(i + 1), { size: 48, color: c.gray, centerY: cy }));
    statics.push(d.label(56, 0, r.name, { size: 32, color: c.white, centerY: cy, lineHeight: 1.3 }));
    r.lanes.forEach((ln, l) => statics.push(d.label(420, 0, ln, { size: 20, color: c.gray, anchor: "end", centerY: laneY(i, l) + TL.lh / 2 })));
    if (i) statics.push(d.line(0, r.y - 34, 1676, r.y - 34, { color: c.dark, width: 2 }));
  });
  // level 1: you work, ask, get advice, go on
  bars.push(bar("a1", 0, 0, 0, 40, L.l1[0], "you"));
  hands.push(hand("a2", 0, 0, 1, 40.5));
  bars.push(bar("a3", 0, 1, 41, 67, L.l1[1], "ai"));
  hands.push(hand("a4", 0, 1, 0, 67.5));
  bars.push(bar("a5", 0, 0, 68, 100, L.l1[2], "you"));
  // level 2: you give a task, the ai drafts, you check
  bars.push(bar("b1", 1, 0, 0, 20, L.l2[0], "you"));
  hands.push(hand("b2", 1, 0, 1, 20.5));
  bars.push(bar("b3", 1, 1, 21, 63, L.l2[1], "ai"));
  hands.push(hand("b4", 1, 1, 0, 63.5));
  bars.push(bar("b5", 1, 0, 64, 100, L.l2[2], "check"));
  // level 3: a goal, then agent and tools in turns, then your check
  const [goal, acts, tools] = L.l3;
  bars.push(bar("c1", 2, 0, 0, 16, goal, "you"));
  hands.push(hand("c2", 2, 0, 1, 16.5));
  // agent and tools take turns: agent 17-29, tool 30-42, agent 43-55,
  // tool 56-68, agent 69-79 (12 units = 148 px, 11 characters at 20 px;
  // the last agent bar 10 units, 8 characters)
  for (let k = 0; k < 3; k++) {
    const t = 17 + k * 26;
    bars.push(bar("ca" + k, 2, 1, t, k < 2 ? t + 12 : t + 10, acts[k], "agent"));
    if (k < 2) {
      const err = tools[k].startsWith("!");
      hands.push(hand("cd" + k, 2, 1, 2, t + 12.5));
      bars.push(bar("ct" + k, 2, 2, t + 13, t + 25, tools[k].replace("!", ""), err ? "error" : "tool"));
      hands.push(hand("cu" + k, 2, 2, 1, t + 25.5));
    }
  }
  hands.push(hand("c3", 2, 1, 0, 79.5));
  bars.push(bar("c4", 2, 0, 80, 100, "you check", "check"));
  // loop label under the tools lane
  const loopLabel = d.g("loop",
    d.icon(tx(17), 626, 36, ICON_ARROW_REPEAT, { color: c.gray }),
    d.label(tx(17) + 48, 0, "in a loop until the goal is reached", { size: 32, color: c.gray, centerY: 644 }));
  // time axis and legend
  statics.push(d.arrow(TL.x0, 712, TL.x1 - 2, 712, { color: c.dark, width: 2, head: 12 }));
  statics.push(d.label(TL.x1 - 2, 0, "time", { size: 20, color: c.gray, anchor: "end", centerY: 738 }));
  const leg = [["you work", c.dark, c.light], ["ai works", c.blue, null], ["tools", c.gray, null], ["you check", "none", c.green]];
  let lx = TL.x0;
  leg.forEach(([t, fill, border]) => {
    statics.push(d.box(lx, 770, 28, 20, "", { fill, border, width: border === c.green ? 3 : 2, rx: 3 }));
    statics.push(d.label(lx + 40, 0, t, { size: 20, color: c.gray, centerY: 780 }));
    lx += 40 + t.length * 12 + 48;
  });
  const svg = d.svg(1680, 804, ...statics, ...hands, ...bars, loopLabel);

  // animation: one step per level, played from left to right
  const id = "fig-levels-" + topic;
  return { svg, id, play: (a) => {
    const S = (n) => a.show(n, { dur: 220 });
    const D = (n) => a.draw(n, { dur: 160 });
    a.step(S("a1"), D("a2"), S("a3"), D("a4"), S("a5"));
    a.step(S("b1"), D("b2"), S("b3"), D("b4"), S("b5"));
    a.step(S("c1"), D("c2"), a.par(S("loop"), S("ca0")),
      D("cd0"), S("ct0"), D("cu0"), S("ca1"), D("cd1"), S("ct1"), D("cu1"), S("ca2"),
      D("c3"), S("c4"));
  } };
}

/* ------------------------------------------------------------------ */
/* The jagged frontier as a closed shape: inside it the model does a    */
/* task well, outside it badly. A deep notch at the bottom holds a      */
/* task that looks like those inside but lies outside.                  */
/* 24 corners, one every 15 degrees, stretched 1.5 wide and 0.95 high.  */
/* ------------------------------------------------------------------ */
function jagged(cx, cy, sx, sy, radii) {
  const n = radii.length;
  return radii.map((r, k) => {
    const a = (k / n) * 2 * Math.PI;
    return [cx + r * Math.cos(a) * sx, cy + r * Math.sin(a) * sy];
  });
}
const pointsAttr = (pts) => pts.map((p) => p.map((v) => +v.toFixed(1)).join(",")).join(" ");

const FRONTIER_RADII = [300, 250, 305, 240, 295, 260, 100, 260, 300, 245, 310, 250, 300, 240, 295, 255, 305, 245, 300, 250, 310, 240, 295, 260];
function figFrontier() {
  const c = C();
  const parts = [];
  const pts = jagged(470, 330, 1.5, 0.95, FRONTIER_RADII);
  parts.push(`<polygon points="${pointsAttr(pts)}" fill="${c.dark}" fill-opacity="0.45" stroke="${c.light}" stroke-width="3" stroke-linejoin="round"/>`);
  parts.push(d.label(230, 0, "inside the frontier", { size: 48, color: c.white, centerY: 205 }));
  ["12.2 % more tasks done", "25.1 % faster", "over 40 % higher quality"].forEach((t, i) => {
    parts.push(d.label(230, 0, t, { size: 32, color: c.green, centerY: 280 + i * 46 }));
  });
  parts.push(d.label(230, 0, "with ai than without", { size: 20, color: c.gray, centerY: 410 }));
  // the notch: a task that looks alike but lies outside
  parts.push(`<circle cx="470" cy="500" r="12" fill="${c.yellow}"/>`);
  parts.push(d.label(470, 0, "a task that looks alike", { size: 20, color: c.yellow, anchor: "middle", centerY: 610 }));
  parts.push(d.label(1080, 0, "outside the frontier", { size: 48, color: c.white, centerY: 190 }));
  parts.push(d.label(1080, 0, "19 percentage points\nless often correct", { size: 32, color: c.red, centerY: 295, lineHeight: 1.3 }));
  parts.push(d.label(1080, 0, "with ai than without", { size: 20, color: c.gray, centerY: 415 }));
  return d.svg(1680, 660, ...parts);
}

/* ------------------------------------------------------------------ */
/* The frontier grows: a schematic, not a measurement. The same jagged  */
/* shape is scaled about its own centre (as anim.js does) by 1, 1.6 and */
/* 2.5; tasks sit along rays from that centre, at a multiple m of the   */
/* distance to the edge, so a task is inside once the scale exceeds m.  */
/* Two tasks sit in deep notches at the top and the bottom and stay     */
/* outside, however far the frontier grows. Tasks that have just come   */
/* inside turn yellow, earlier ones white, those outside stay gray.     */
/* ------------------------------------------------------------------ */
const GROW_RADII = [1, 0.86, 0.97, 0.84, 0.95, 0.88, 0.42, 0.88, 0.98, 0.85, 1, 0.87, 0.96, 0.84, 0.97, 0.86, 0.95, 0.88, 0.48, 0.88, 0.97, 0.85, 1, 0.86].map((v) => v * 120);
const GROW_SCALES = [1, 1.6, 2.5];
const GROW_YEARS = ["2023", "2025", "2026"];
// [label, angle in degrees (0 right, 90 down), m, step it comes inside, label to the left]
const GROW_TASKS = [
  ["polish text", 180, 0.55, 0, true],
  ["explain an error", 0, 0.55, 0, false],
  ["write r code", 205, 1.3, 1, true],
  ["summarize a paper", -25, 1.3, 1, false],
  ["run an analysis", 155, 1.95, 2, true],
  ["search literature", 25, 1.95, 2, false],
];
// distance from b along angle a to the first edge of the polygon
function rayToEdge(pts, b, a) {
  const dx = Math.cos(a), dy = Math.sin(a);
  let best = Infinity;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length];
    const ex = x2 - x1, ey = y2 - y1, den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-9) continue;
    const t = ((x1 - b.x) * ey - (y1 - b.y) * ex) / den;
    const u = ((x1 - b.x) * dy - (y1 - b.y) * dx) / den;
    if (t > 0 && u >= 0 && u <= 1) best = Math.min(best, t);
  }
  return best;
}
// a dark outline behind the letters, so an edge of the frontier passing
// behind a label does not run through its text
const halo = (svgText) => svgText.replace("<text ", `<text paint-order="stroke" stroke="${C().bg}" stroke-width="10" stroke-linejoin="round" `);
function figGrowth() {
  const c = C();
  const pts = jagged(840, 330, 2.2, 0.9, GROW_RADII);
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const b = { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (Math.min(...ys) + Math.max(...ys)) / 2 };
  const parts = [];
  parts.push(d.g("frontier", `<polygon points="${pointsAttr(pts)}" fill="${c.dark}" fill-opacity="0.45" stroke="${c.light}" stroke-width="3" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`));
  GROW_YEARS.forEach((y, i) => parts.push(d.g("year" + i, d.label(0, 0, y, { size: 48, color: c.white, centerY: 40 }))));
  GROW_TASKS.forEach(([t, deg, m, k, left], i) => {
    const a = (deg * Math.PI) / 180, r = rayToEdge(pts, b, a) * m;
    const x = b.x + r * Math.cos(a), y = b.y + r * Math.sin(a);
    const col = k === 0 ? c.white : c.gray;
    parts.push(d.g("dot" + i, `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" fill="${col}"/>`));
    parts.push(d.g("lab" + i, halo(d.label(left ? x - 22 : x + 22, 0, t, { size: 32, color: col, anchor: left ? "end" : "start", centerY: y }))));
  });
  // the two notches, at 270 degrees (top) and 90 degrees (bottom)
  [["judge what matters", -90, 34], ["cite only real sources", 90, 630]].forEach(([t, deg, ly]) => {
    const a = (deg * Math.PI) / 180, tip = rayToEdge(pts, b, a) * GROW_SCALES[2];
    const y = b.y + (tip + 56) * Math.sin(a);
    const y1 = deg < 0 ? ly + 22 : ly - 22;
    parts.push(d.line(b.x, y1, b.x, y + (deg < 0 ? -14 : 14), { color: c.gray, width: 2, dashed: true }));
    parts.push(`<circle cx="${b.x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" fill="${c.gray}"/>`);
    parts.push(d.label(b.x, 0, t, { size: 32, color: c.light, anchor: "middle", centerY: ly }));
  });
  return d.svg(1680, 660, ...parts);
}
function playGrowth(a) {
  const turn = (k, col) => GROW_TASKS.map(([, , , kk], i) => [i, kk]).filter(([, kk]) => kk === k)
    .flatMap(([i]) => [a.color("dot" + i, col, { part: "fill", dur: 400 }), a.color("lab" + i, col, { part: "text", dur: 400 })]);
  for (let s = 1; s < GROW_SCALES.length; s++) {
    a.step(
      a.par(a.scale("frontier", GROW_SCALES[s], { dur: 1600 }), a.swap("year" + (s - 1), "year" + s, { dur: 600 }), ...turn(s - 1, "white")),
      a.par(...turn(s, "yellow")));
  }
}

/* ------------------------------------------------------------------ */
/* Invented references in 2023: share of fabricated references per     */
/* model, bars from 0 to 100 %; the real ones with errors as gray text. */
/* ------------------------------------------------------------------ */
function figReferences() {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const X = 300, Wf = 1100;   // 0 % at X, 100 % at X + Wf
  const rows = [["GPT-3.5", 55, 43], ["GPT-4", 18, 24]];
  labels.push(d.label(X, 0, "references that do not exist", { size: 32, color: c.gray, centerY: 50 }));
  rows.forEach(([m, f, e], i) => {
    const y = 110 + i * 230;
    labels.push(d.label(0, 0, m, { size: 48, color: c.white, centerY: y + 50, keepCase: true }));
    boxes.push(d.box(X, y, Wf * f / 100, 100, "", { border: null, fill: c.blue, rx: 4 }));
    labels.push(d.label(X + Wf * f / 100 + 24, 0, f + " %", { size: 48, color: c.white, centerY: y + 50 }));
    labels.push(d.label(X, 0, `of the real ones, ${e} % had errors in authors, year or pages`, { size: 32, color: c.gray, centerY: y + 150 }));
  });
  wires.push(d.line(X, 90, X, 560, { color: c.gray, width: 2 }));
  return d.svg(1680, 660, ...d.layers(wires, boxes, labels));
}

/* ------------------------------------------------------------------ */
/* Made-up references in 2026, two panels. Left: published biomedical  */
/* papers that cite at least one reference that does not exist, per    */
/* 10,000 papers (1 in 2,828 = 3.5; 1 in 458 = 21.8; 1 in 277 = 36.1). */
/* Right: cited links in AI answers that never existed.                 */
/* ------------------------------------------------------------------ */
function figRefs2026() {
  const c = C();
  const wires = [], boxes = [], labels = [];
  // left panel: x 0..780
  labels.push(d.label(0, 0, "biomedical papers citing a\nreference that does not exist", { size: 32, color: c.gray, centerY: 60, lineHeight: 1.3 }));
  const L = [["2023", 3.5, "1 in 2,828"], ["2025", 21.8, "1 in 458"], ["2026", 36.1, "1 in 277"]];
  const X1 = 140, S1 = 12;   // 12 units per paper in 10,000
  L.forEach(([y, v, t], i) => {
    const cy = 200 + i * 130;
    const now = i === 2;
    labels.push(d.label(0, 0, y, { size: 32, color: now ? c.white : c.light, centerY: cy }));
    boxes.push(d.box(X1, cy - 40, v * S1, 80, "", { border: null, fill: now ? c.yellow : c.gray, rx: 4 }));
    labels.push(d.label(X1 + v * S1 + 20, 0, t, { size: 32, color: now ? c.white : c.light, centerY: cy }));
  });
  wires.push(d.line(X1, 150, X1, 510, { color: c.gray, width: 2 }));
  labels.push(d.label(0, 0, "2026: the first seven weeks", { size: 20, color: c.gray, centerY: 560 }));
  // right panel: x 940..1680
  const X2 = 940, S2 = 50;   // 50 units per percent
  labels.push(d.label(X2, 0, "links in ai answers\nthat never existed", { size: 32, color: c.gray, centerY: 60, lineHeight: 1.3 }));
  const R = [["deep research agents", 10.7], ["models with web search", 4.8]];
  R.forEach(([t, v], i) => {
    const y = 160 + i * 180;
    labels.push(d.label(X2, 0, t, { size: 32, color: c.light, centerY: y }));
    boxes.push(d.box(X2, y + 30, v * S2, 80, "", { border: null, fill: c.gray, rx: 4 }));
    labels.push(d.label(X2 + v * S2 + 20, 0, v + " %", { size: 32, color: c.white, centerY: y + 70 }));
  });
  return d.svg(1680, 660, ...d.layers(wires, boxes, labels));
}

/* ------------------------------------------------------------------ */
/* A table for the appendix: one row per use of AI. Left-aligned        */
/* columns; the last column, how you checked, is the one that counts.   */
/* ------------------------------------------------------------------ */
const USE_COLS = [0, 380, 830, 1140];
const USE_ROWS = [
  ["tool and model", "what for", "section", "how checked"],
  ["agent (model)", "r code for figure 2", "results", "ran it, counted n by hand"],
  ["chatbot (model)", "search terms", "introduction", "searched the library"],
  ["research tool", "finding studies", "introduction", "read every study cited"],
  ["agent (model)", "feedback on structure", "methods", "took 2 of 5 points"],
];
function figUseTable() {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const top = 40, rh = 120;
  boxes.push(d.box(USE_COLS[3] - 30, top - 10, 1680 - USE_COLS[3] + 28, rh * USE_ROWS.length, "", { border: null, fill: c.dark, rx: 6 }));
  USE_ROWS.forEach((row, r) => {
    const cy = top + 50 + r * rh;
    row.forEach((t, k) => {
      const head = r === 0;
      const color = head ? (k === 3 ? c.white : c.gray) : (k === 3 ? c.white : c.light);
      labels.push(d.label(USE_COLS[k], 0, t, { size: 32, color, centerY: cy }));
    });
    if (r < USE_ROWS.length - 1) wires.push(d.line(0, cy + rh / 2, 1680, cy + rh / 2, { color: r === 0 ? c.gray : c.dark, width: 2 }));
  });
  return d.svg(1680, 660, ...d.layers(boxes, wires, labels));
}

// drawn at once, before stagekit.js builds the frames
put("fig-kinds", figKinds(0));
put("fig-phases", figPhases(0));
document.querySelectorAll(".figure[data-levels]").forEach((el) => {
  const f = figLevels(el.dataset.levels);
  el.id = f.id;
  el.innerHTML = f.svg;
  f.play(d.anim(f.id));
});
put("fig-frontier", figFrontier());
put("fig-growth", figGrowth());
if (document.getElementById("fig-growth")) playGrowth(d.anim("fig-growth"));
put("fig-references", figReferences());
put("fig-refs-2026", figRefs2026());
put("fig-use-table", figUseTable());
Object.assign(window, { showKinds, showPhases });
