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
// - Tools: selection after the overview of the university library
//   Duisburg-Essen, "KI-Tools" (as of November 2026),
//   https://www.uni-due.de/ub/ki-tools.php, plus HAWKI of Osnabrück
//   University of Applied Sciences, Napkin and Gamma.
// - Level 4: the committee chaired by David Gross on OpenAI's Lean proof of
//   the existence half of the Yang-Mills problem, November 2026, as reported
//   by Science and others: "We do not claim to fully understand the proof
//   yet."
// - Phases: Döring (2023), Forschungsmethoden und Evaluation, 6th ed.,
//   section 1.3.1 (p. 23) and chapters 5 to 13, one per phase.
// - Dell'Acqua et al. (2023), HBS Working Paper 24-013: 758 BCG consultants,
//   GPT-4. Inside the frontier 12.2 % more tasks, 25.1 % faster, more than
//   40 % higher quality; outside it 19 percentage points less often correct.
//   The growing frontier is a schematic picture of the idea, not a
//   measurement; 2027 is a hypothesis, as in Kokotajlo et al. (2025), AI 2027,
//   https://ai-2027.com, and Amodei at Davos (January 2025).
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

// Bootstrap Icons "diagram-3" 1.11.3 (MIT, (c) The Bootstrap Authors)
const ICON_DIAGRAM_3 = '<path fill-rule="evenodd" d="M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H14a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 2 7h5.5V6A1.5 1.5 0 0 1 6 4.5zM8.5 5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5zM0 11.5A1.5 1.5 0 0 1 1.5 10h1A1.5 1.5 0 0 1 4 11.5v1A1.5 1.5 0 0 1 2.5 14h-1A1.5 1.5 0 0 1 0 12.5zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm4.5.5A1.5 1.5 0 0 1 7.5 10h1a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm4.5.5a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"/>';
// Bootstrap Icons "easel" 1.11.3 (MIT, (c) The Bootstrap Authors)
const ICON_EASEL = '<path d="M8 0a.5.5 0 0 1 .473.337L9.046 2H14a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1.85l1.323 3.837a.5.5 0 1 1-.946.326L11.092 11H8.5v3a.5.5 0 0 1-1 0v-3H4.908l-1.435 4.163a.5.5 0 1 1-.946-.326L3.85 11H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h4.954L7.527.337A.5.5 0 0 1 8 0M2 3v7h12V3z"/>';
// Bootstrap Icons "file-earmark-pdf" 1.11.3 (MIT, (c) The Bootstrap Authors)
const ICON_FILE_EARMARK_PDF = '<path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/><path d="M4.603 14.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.86.86 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.7 11.7 0 0 0-1.997.406 11.3 11.3 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.8.8 0 0 1-.58.029m1.379-1.901q-.25.115-.459.238c-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361q.016.032.026.044l.035-.012c.137-.056.355-.235.635-.572a8 8 0 0 0 .45-.606m1.64-1.33a13 13 0 0 1 1.01-.193 12 12 0 0 1-.51-.858 21 21 0 0 1-.5 1.05zm2.446.45q.226.245.435.41c.24.19.407.253.498.256a.1.1 0 0 0 .07-.015.3.3 0 0 0 .094-.125.44.44 0 0 0 .059-.2.1.1 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a4 4 0 0 0-.612-.053zM8.078 7.8a7 7 0 0 0 .2-.828q.046-.282.038-.465a.6.6 0 0 0-.032-.198.5.5 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822q.036.167.09.346z"/>';
// Bootstrap Icons "tools" 1.11.3 (MIT, (c) The Bootstrap Authors)
const ICON_TOOLS = '<path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3q0-.405-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708M3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026z"/>';

// A label that is a link: blue, opens in a new tab, and a click on it does
// not advance the slide (stagekit skips clicks on a).
const link = (x, cy, text, url, o = {}) =>
  `<a href="${url}" target="_blank" rel="noopener">${d.label(x, 0, text, { size: 32, color: C().blue, keepCase: true, ...o, centerY: cy })}</a>`;

/* ------------------------------------------------------------------ */
/* Three kinds of AI, one column each, appearing one by one. Each       */
/* column, centered: symbol, name, one sentence, a schematic of how the */
/* kind works (y 318..740) and a gray line under it.                    */
/* Columns 540 wide, 30 apart; text at 32 px holds 26 characters, at 48 */
/* px 17 ("specialized tools" is 490 wide).                             */
/* ------------------------------------------------------------------ */
const COL_W = 540, COL_G = 30;
const colX = (i) => i * (COL_W + COL_G);
const KINDS = [
  { name: "chatbots", icon: ICON_CHAT_DOTS, what: "answer your questions\nin a chat window", note: "question in, answer out, in the browser" },
  { name: "specialized tools", icon: ICON_TOOLS, what: "use ai for one\nspecific job", note: "often better at it than a chatbot" },
  { name: "agents", icon: ICON_ROBOT, what: "get a goal and reach it\non their own", note: "in a loop until the goal is reached" },
];

// an arc of the circle (cx, cy, r) from angle a0 to a1 in degrees,
// clockwise (0 right, 90 down), with an arrowhead at a1 along the tangent
function arc(cx, cy, r, a0, a1, o = {}) {
  const c = C(), col = o.color || c.light, w = o.width || 3, head = o.head || 14;
  const rad = (a) => (a * Math.PI) / 180;
  const P = (a) => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))];
  const back = (head / r) * 180 / Math.PI;
  const [x0, y0] = P(a0), [xb, yb] = P(a1 - back), [x2, y2] = P(a1);
  const large = a1 - back - a0 > 180 ? 1 : 0;
  const tx = -Math.sin(rad(a1)), ty = Math.cos(rad(a1));
  const bx = x2 - tx * head, by = y2 - ty * head, px = -ty * head * 0.45, py = tx * head * 0.45;
  const f = (v) => +v.toFixed(1);
  return `<path d="M${f(x0)},${f(y0)} A${r},${r} 0 ${large} 1 ${f(xb)},${f(yb)}" fill="none" stroke="${col}" stroke-width="${w}"/>` +
    `<polygon points="${f(x2)},${f(y2)} ${f(bx + px)},${f(by + py)} ${f(bx - px)},${f(by - py)}" fill="${col}"/>`;
}
// a pill with text, centered at cx, cy
const pill = (cx, cy, t, o) => {
  const w = t.length * 19.2 + 40;
  return d.box(cx - w / 2, cy - 24, w, 48, t, { rx: 24, size: 32, ...o });
};

// chatbot: a browser window with a chat, your questions and its answers
function schemaChat(x) {
  const c = C(), wires = [], parts = [];
  parts.push(d.box(x + 50, 320, 440, 370, "", { border: c.light, rx: 14 }));
  parts.push(d.line(x + 51, 360, x + 489, 360, { color: c.dark, width: 2 }));
  [0, 1, 2].forEach((k) => parts.push(`<circle cx="${x + 76 + k * 20}" cy="340" r="6" fill="${c.gray}"/>`));
  parts.push(d.label(x + 148, 0, "browser", { size: 20, color: c.gray, centerY: 340 }));
  [["you", "your question", 384], ["ai", "an answer", 456], ["you", "a follow-up", 528], ["ai", "an answer", 600]].forEach(([who, t, y]) => {
    const w = t.length * 19.2 + 48;
    if (who === "you") {
      parts.push(d.box(x + 430 - w, y, w, 56, t, { border: c.light, size: 32, rx: 28 }));
      parts.push(d.icon(x + 440, y + 10, 36, ICON_PERSON_FILL, { color: c.light }));
    } else {
      parts.push(d.icon(x + 66, y + 10, 36, ICON_ROBOT, { color: c.blue }));
      parts.push(d.box(x + 112, y, w, 56, t, { border: null, fill: c.blue, size: 32, rx: 28 }));
    }
  });
  return { wires, parts };
}

// specialized tools: one job each
const JOBS = [[ICON_SEARCH, "finds studies"], [ICON_FILE_TEXT, "reads your PDFs"], [ICON_DIAGRAM_3, "draws a diagram"], [ICON_EASEL, "builds slides"]];
function schemaTools(x) {
  const c = C(), wires = [], parts = [];
  JOBS.forEach(([ic, t], k) => {
    const y = 330 + k * 88;
    parts.push(d.box(x + 50, y, 440, 72, "", { border: c.gray, rx: 14 }));
    parts.push(d.icon(x + 80, y + 16, 40, ic, { color: c.blue }));
    parts.push(d.label(x + 144, 0, t, { size: 32, color: c.light, centerY: y + 36, keepCase: true }));
  });
  return { wires, parts };
}

// agent: your goal goes in, then plan, act and check in a loop, with
// your files, programs and the web as its tools
function schemaAgent(x) {
  const c = C(), wires = [], parts = [];
  const cx = x + COL_W / 2, cy = 536, r = 104;
  parts.push(d.box(cx - 110, 318, 220, 56, "your goal", { border: c.light, size: 32 }));
  wires.push(d.arrow(cx, 378, cx, 404, { color: c.light, width: 2, head: 12 }));
  wires.push(arc(cx, cy, r, -52, 4), arc(cx, cy, r, 58, 122), arc(cx, cy, r, 176, 228));
  parts.push(pill(cx, cy - r, "plan", { border: null, fill: c.blue }));
  parts.push(pill(cx + 90, cy + 52, "act", { border: null, fill: c.blue }));
  parts.push(pill(cx - 90, cy + 52, "check", { border: null, fill: c.blue }));
  parts.push(d.icon(cx - 30, cy - 34, 60, ICON_ROBOT, { color: c.blue }));
  [[ICON_FOLDER, "your files", -170], [ICON_TERMINAL, "programs", 0], [ICON_GLOBE, "the web", 170]].forEach(([ic, t, dx]) => {
    wires.push(d.line(cx, 646, cx + dx, 674, { color: c.gray, width: 2 }));
    parts.push(d.icon(cx + dx - 18, 676, 36, ic, { color: c.light }));
    parts.push(d.label(cx + dx, 0, t, { size: 20, color: c.light, anchor: "middle", centerY: 730 }));
  });
  return { wires, parts };
}

function figKinds(step) {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const schemas = [schemaChat, schemaTools, schemaAgent];
  KINDS.forEach((k, i) => {
    if (i > step) return;
    const x = colX(i), cx = x + COL_W / 2, now = i === step;
    // inset by 2 for the stroke width of 2
    boxes.push(d.box(x + 2, 2, COL_W - 4, 800, "", { border: now ? c.white : c.dark, width: 2, rx: 16 }));
    labels.push(d.icon(cx - 32, 30, 64, k.icon, { color: c.blue }));
    labels.push(d.label(cx, 0, k.name, { size: 48, color: c.white, anchor: "middle", centerY: 142 }));
    labels.push(d.label(cx, 0, k.what, { size: 32, color: c.light, anchor: "middle", centerY: 228, lineHeight: 1.3 }));
    const s = schemas[i](x);
    wires.push(...s.wires);
    labels.push(...s.parts);
    labels.push(d.label(cx, 0, k.note, { size: 20, color: c.gray, anchor: "middle", centerY: 772 }));
  });
  return d.svg(1680, 804, ...d.layers(boxes, wires, labels));
}
function showKinds(slide, step) { put("fig-kinds", figKinds(step || 0)); }

/* ------------------------------------------------------------------ */
/* Tools to try, in the same three columns: one card per tool with its  */
/* name as a link and what it is for. Cards 100 high, 12 apart; a line  */
/* at 20 px holds 40 characters.                                        */
/* ------------------------------------------------------------------ */
const TOOLS = [
  { name: "chatbots", items: [
    ["ChatGPT", "https://chatgpt.com", "by OpenAI"],
    ["Claude", "https://claude.ai", "by Anthropic"],
    ["Gemini", "https://gemini.google.com", "by Google"],
    ["Chat AI", "https://chat-ai.academiccloud.de", "by the GWDG, free for universities"],
    ["HAWKI", "https://hawki.hs-osnabrueck.de", "the chat of HS Osnabrück"]] },
  { name: "specialized tools", items: [
    ["Consensus", "https://consensus.app", "finds studies and sums up what they say"],
    ["Elicit", "https://elicit.com", "searches papers and pulls out their data"],
    ["Research Rabbit", "https://www.researchrabbit.ai", "maps papers that cite each other"],
    ["NotebookLM", "https://notebooklm.google.com", "answers questions about your PDFs"],
    ["Napkin", "https://www.napkin.ai", "turns a text into a diagram"],
    ["Gamma", "https://gamma.app", "turns an outline into slides"]] },
  { name: "agents", items: [
    ["Claude Code", "https://www.anthropic.com/claude-code", "by Anthropic"],
    ["Codex", "https://openai.com/codex", "by OpenAI"],
    ["Antigravity", "https://antigravity.google", "by Google, as app, IDE and CLI"],
    ["OpenCode", "https://opencode.ai", "open source, works with many models"],
    ["Bionic", "https://lmstudio.ai/bionic", "by LM Studio, open models, also local"]] },
];
function figTools() {
  const c = C();
  const boxes = [], labels = [];
  TOOLS.forEach((g, i) => {
    const x = colX(i), cx = x + COL_W / 2;
    labels.push(d.label(cx, 0, g.name, { size: 48, color: c.white, anchor: "middle", centerY: 44 }));
    g.items.forEach(([t, url, what], j) => {
      const y = 104 + j * 112;
      boxes.push(d.box(x + 2, y, COL_W - 4, 100, "", { border: c.dark, rx: 12 }));
      labels.push(link(x + 28, y + 36, t, url));
      labels.push(d.label(x + 28, 0, what, { size: 20, color: c.gray, keepCase: true, centerY: y + 74 }));
    });
  });
  return d.svg(1680, 804, ...d.layers(boxes, labels));
}

/* ------------------------------------------------------------------ */
/* The nine phases of an empirical study after Döring (2023), in three  */
/* rows of three. On the task slide the same grid comes again, more     */
/* compact, with the four levels of AI use as a legend beneath.         */
/* ------------------------------------------------------------------ */
const LEVEL_NAMES = ["answers questions", "writes documents", "acts in your files", "works on its own"];
function figPhases(task) {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const W = 520, G = 60, H = task ? 100 : 110;
  const ys = task ? [50, 230, 410] : [60, 310, 560];
  const rows = [
    { title: "plan", phases: ["research topic", "state of research", "study design"] },
    { title: "collect data", phases: ["operationalization", "sampling", "data collection"] },
    { title: "analyze and report", phases: ["data preparation", "data analysis", "presentation"] },
  ];
  let n = 0;
  rows.forEach((r, ri) => {
    const y = ys[ri];
    labels.push(d.label(0, 0, r.title, { size: 32, color: c.gray, centerY: y - 30 }));
    r.phases.forEach((t, i) => {
      n += 1;
      const x = i * (W + G);
      boxes.push(d.box(x + 2, y, W - 4, H, "", { border: c.light }));
      labels.push(d.label(x + 32, 0, String(n), { size: 32, color: c.gray, mono: true, centerY: y + H / 2 }));
      labels.push(d.label(x + 90, 0, t, { size: 32, color: c.white, centerY: y + H / 2 }));
      if (i) wires.push(d.arrow(x - G + 6, y + H / 2, x - 4, y + H / 2, { color: c.gray, width: 3 }));
    });
  });
  if (task) {
    labels.push(d.label(0, 0, "four levels of ai use", { size: 20, color: c.gray, centerY: 560 }));
    LEVEL_NAMES.forEach((t, i) => {
      const x = i * 420;
      boxes.push(d.box(x + 2, 584, 40, 40, "", { border: c.blue, rx: 20 }));
      labels.push(d.label(x + 22, 0, String(i + 1), { size: 20, color: c.white, anchor: "middle", centerY: 604 }));
      labels.push(d.label(x + 56, 0, t, { size: 20, color: c.light, centerY: 604 }));
    });
  }
  return d.svg(1680, task ? 660 : 700, ...d.layers(wires, boxes, labels));
}

/* ------------------------------------------------------------------ */
/* Four levels of AI use, one row each, appearing one by one; each      */
/* level adds something to the one above it ("also"). Every row has     */
/* the same places: your work (a folder), you, and on the right the     */
/* chat or what comes out.                                              */
/*   1  you ask in the chat and carry the answer into your work,        */
/*   2  from a prompt in the chat the AI writes a document,             */
/*   3  an agent works inside your folder; you give the goal and        */
/*      feedback, it shows results, in a loop,                          */
/*   4  the agent works on its own, and nobody checks the result.      */
/* Rows 200 apart, 160 high; the current number is yellow. Places:      */
/* folder x 500..610, you x 760..816, the right place x 940..1676.      */
/* ------------------------------------------------------------------ */
const LEVELS = [
  "ai answers\nquestions",
  "ai also writes\ndocuments",
  "ai also acts\nin your files",
  "ai also works\non its own",
];
function figLevels(step) {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const bubble = (y, t, mine) => {
    const w = t.length * 17 + 60;
    return d.box(mine ? 1652 - w : 964, y, w, 46, t, mine ? { border: c.light, size: 32, rx: 23 } : { border: null, fill: c.blue, size: 32, rx: 23 });
  };
  for (let i = 0; i <= Math.min(step, 3); i++) {
    const y0 = i * 200, cy = y0 + 90, now = i === step, agent = i >= 2;
    if (i) wires.push(d.line(0, y0 - 15, 1676, y0 - 15, { color: c.dark, width: 2 }));
    labels.push(d.label(0, 0, String(i + 1), { size: 48, color: now ? c.yellow : c.gray, centerY: cy }));
    labels.push(d.label(56, 0, LEVELS[i], { size: 32, color: now ? c.white : c.light, centerY: cy, lineHeight: 1.3 }));
    // your work: a folder, with the agent inside from level 3 on
    labels.push(d.icon(500, y0 + 8, 110, ICON_FOLDER, { color: c.light }));
    labels.push(d.label(555, 0, "your work", { size: 20, color: c.gray, anchor: "middle", centerY: y0 + 148 }));
    if (agent) labels.push(d.icon(533, y0 + 53, 44, ICON_ROBOT, { color: c.blue }));
    if (i === 3) labels.push(d.icon(616, y0 + 8, 28, ICON_ARROW_REPEAT, { color: c.blue }));
    // you, not in the last row: there nobody takes part any more
    if (i < 3) {
      labels.push(d.icon(760, cy - 38, 56, ICON_PERSON_FILL, { color: c.light }));
      labels.push(d.label(788, 0, "you", { size: 20, color: c.gray, anchor: "middle", centerY: y0 + 148 }));
    }
    if (i < 2) {
      // you carry the result into your work by hand
      wires.push(d.arrow(748, cy - 10, 622, cy - 10, { color: c.light, width: 2, head: 12 }));
      // the chat: a window apart from your work
      boxes.push(d.box(940, y0 + 10, 736, 160, "", { border: c.light, rx: 14 }));
      labels.push(d.line(941, y0 + 46, 1675, y0 + 46, { color: c.dark, width: 2 }));
      [0, 1, 2].forEach((k) => labels.push(`<circle cx="${962 + k * 18}" cy="${y0 + 28}" r="5" fill="${c.gray}"/>`));
      labels.push(d.label(1016, 0, "chat", { size: 20, color: c.gray, centerY: y0 + 28 }));
      wires.push(d.arrow(828, cy - 26, 934, cy - 26, { color: c.light, width: 2, head: 12 }));
      wires.push(d.arrow(934, cy + 6, 828, cy + 6, { color: c.blue, width: 2, head: 12 }));
    }
    if (i === 0) {
      labels.push(bubble(y0 + 58, "which test fits my data?", true));
      labels.push(bubble(y0 + 114, "a t-test for two groups", false));
    }
    if (i === 1) {
      // a prompt goes in, a document comes out
      labels.push(bubble(y0 + 58, "write a draft of my methods section", true));
      labels.push(d.icon(964, y0 + 112, 48, ICON_FILE_TEXT, { color: c.blue }));
      labels.push(d.label(1022, 0, "methods.docx", { size: 32, color: c.blue, keepCase: true, centerY: y0 + 136 }));
    }
    if (i === 2) {
      // you and the agent in a loop: goal and feedback in, results out
      wires.push(d.arrow(748, cy - 26, 622, cy - 26, { color: c.light, width: 2, head: 12 }));
      wires.push(d.arrow(622, cy + 6, 748, cy + 6, { color: c.blue, width: 2, head: 12 }));
      labels.push(d.label(940, 0, "you: the goal and feedback", { size: 32, color: c.light, centerY: y0 + 46 }));
      labels.push(d.label(940, 0, "agent: the work and results", { size: 32, color: c.blue, centerY: y0 + 94 }));
      labels.push(d.icon(940, y0 + 128, 28, ICON_ARROW_REPEAT, { color: c.gray }));
      labels.push(d.label(980, 0, "in a loop until it fits", { size: 20, color: c.gray, centerY: y0 + 142 }));
    }
    if (i === 3) {
      // straight from the agent to a result, past where you used to be
      wires.push(d.arrow(622, cy - 10, 916, cy - 10, { color: c.blue, width: 2, head: 12 }));
      labels.push(d.label(788, 0, "nobody checks", { size: 20, color: c.gray, anchor: "middle", centerY: cy - 38 }));
      labels.push(d.icon(940, cy - 42, 64, ICON_FILE_TEXT, { color: c.light }));
      labels.push(d.label(1020, 0, "a result", { size: 32, color: c.light, centerY: cy - 24 }));
      labels.push(d.label(1020, 0, "perhaps because nobody can follow it any more", { size: 20, color: c.gray, centerY: cy + 14 }));
    }
  }
  return d.svg(1680, 804, ...d.layers(wires, boxes, labels));
}
function showLevels(slide, step) { put("fig-levels", figLevels(step || 0)); }

/* ------------------------------------------------------------------ */
/* The four levels at a glance: where the AI works, your part, and what */
/* each level adds. Two lines per cell at most; the last column on a    */
/* dark band, as in the table of AI use.                                */
/* ------------------------------------------------------------------ */
const LEVEL_COLS = [0, 500, 900, 1320];
const LEVEL_ROWS = [
  ["level", "works in", "your part", "new on this level"],
  ["1  answers questions", "the chat", "ask, carry the\nanswer over", "the basis"],
  ["2  writes documents", "the chat", "prompt, carry the\ndocument over", "documents"],
  ["3  acts in your files", "your folder,\nwith tools", "set the goal,\ngive feedback", "tools, your files,\na loop"],
  ["4  works on its own", "your folder,\nwith tools", "none: nobody\nchecks the result", "no human\nin the loop"],
];
function figLevelsTable() {
  const c = C();
  const wires = [], boxes = [], labels = [];
  const top = 20, rh = 124;
  boxes.push(d.box(LEVEL_COLS[3] - 24, top, 1680 - LEVEL_COLS[3] + 22, rh * LEVEL_ROWS.length - 10, "", { border: null, fill: c.dark, rx: 6 }));
  LEVEL_ROWS.forEach((row, r) => {
    const cy = top + rh / 2 + r * rh;
    row.forEach((t, k) => {
      const head = r === 0;
      const color = head ? c.gray : k === 3 ? c.white : c.light;
      labels.push(d.label(LEVEL_COLS[k], 0, t, { size: head ? 20 : 32, color, centerY: cy, lineHeight: 1.3 }));
    });
    if (r < LEVEL_ROWS.length - 1) wires.push(d.line(0, cy + rh / 2, 1680, cy + rh / 2, { color: r === 0 ? c.gray : c.dark, width: 2 }));
  });
  return d.svg(1680, 660, ...d.layers(boxes, wires, labels));
}

/* ------------------------------------------------------------------ */
/* The jagged frontier as a closed shape in the middle: inside it the   */
/* model does a task well, everything around it is outside. 24 corners, */
/* one every 15 degrees (0 right, 90 down) around (840, 330), stretched */
/* 1.8 wide. The same shape opens the next slide, where it grows year   */
/* by year and changes its form: some corners move far out, others      */
/* shift sideways or stay, and the notches move with them. The shapes   */
/* are a simplified picture of the idea, not a measurement; 2027 is a   */
/* hypothesis. Each shape: [shift of the angle in degrees, distance].   */
/* ------------------------------------------------------------------ */
const F = { cx: 840, cy: 330, hx: 1.8 };
const FRONTIER_YEARS = ["2023", "2025", "2026", "2027?"];
const FRONTIER_SHAPES = [
  // 2023
  [230, 205, 232, 198, 226, 205, 140, 205, 228, 196, 232, 204, 230, 206, 228, 198, 226, 204, 214, 204, 230, 200, 232, 206],
  // 2025: far out to the upper left and upper right
  [300, 260, 300, 230, 270, 220, 150, 225, 265, 225, 290, 270, 320, [-3, 360], 410, 300, 270, 240, 225, 245, 280, 300, [4, 420], 370],
  // 2026: out to the left, the right and the bottom corners
  [420, 400, 420, 260, 300, 250, 150, 250, 300, 280, 420, 400, 420, 380, [6, 420], 320, 300, 250, 225, 260, 280, 330, 440, [-5, 400]],
  // 2027?: around everything
  [455, 430, 450, 400, 360, 320, 305, 325, 355, 410, 440, 420, 455, 430, 400, 330, 300, 290, 300, 320, 355, 410, 445, 425],
];
function frontierPoints(s) {
  return FRONTIER_SHAPES[s].map((v, k) => {
    const [shift, r] = Array.isArray(v) ? v : [0, v];
    const a = ((k * 15 + shift) * Math.PI) / 180;
    return [F.cx + r * Math.cos(a) * F.hx, F.cy + r * Math.sin(a)];
  });
}
const pointsAttr = (pts) => pts.map((p) => p.map((v) => +v.toFixed(1)).join(",")).join(" ");
// the frontier, blue because inside it the AI does the work; with `from`
// it morphs from that shape to this one (only when stepping forward live)
function frontierPolygon(pts, from) {
  const c = C();
  const morph = from ? `<animate attributeName="points" from="${pointsAttr(from)}" to="${pointsAttr(pts)}" dur="1.8s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.42 0 0.58 1"/>` : "";
  return `<polygon points="${pointsAttr(pts)}" fill="${c.blue}" fill-opacity="0.2" stroke="${c.blue}" stroke-width="3" stroke-linejoin="round">${morph}</polygon>`;
}
// a dark outline behind the letters, so an edge of the frontier passing
// behind a label does not run through its text
const halo = (svgText) => svgText.replace(/<text /g, `<text paint-order="stroke" stroke="${C().bg}" stroke-width="10" stroke-linejoin="round" `);
const dot = (x, y, col, r = 10) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/>`;

function figFrontier() {
  const c = C();
  const parts = [frontierPolygon(frontierPoints(0))];
  parts.push(d.label(F.cx, 0, "inside the frontier", { size: 48, color: c.white, anchor: "middle", centerY: 245 }));
  ["12.2 % more tasks done", "25.1 % faster", "over 40 % higher quality"].forEach((t, i) => {
    parts.push(d.label(F.cx, 0, t, { size: 32, color: c.green, anchor: "middle", centerY: 310 + i * 46 }));
  });
  parts.push(d.label(F.cx, 0, "with ai than without", { size: 20, color: c.gray, anchor: "middle", centerY: 444 }));
  // the notch: a task that looks alike but lies outside
  parts.push(dot(F.cx, 500, c.yellow, 12));
  parts.push(d.label(F.cx, 0, "a task that looks alike", { size: 32, color: c.yellow, anchor: "middle", centerY: 600 }));
  // outside: everything around the shape
  parts.push(d.label(0, 0, "outside\nthe frontier", { size: 48, color: c.white, centerY: 300 }));
  parts.push(d.label(1290, 0, "19 percentage points\nless often correct", { size: 32, color: c.red, centerY: 300, lineHeight: 1.3 }));
  parts.push(d.label(1290, 0, "with ai than without", { size: 20, color: c.gray, centerY: 376 }));
  return d.svg(1680, 660, ...parts);
}

/* ------------------------------------------------------------------ */
/* The frontier moves: tasks as dots, each coming inside in one year    */
/* (step 0: 2023). Outside gray, just come inside yellow, inside white. */
/* [label, x, y, step it comes inside, where the label sits]            */
/* ------------------------------------------------------------------ */
const GROW_TASKS = [
  ["polish text", 600, 340, 0, "right"],
  ["explain an error", 1080, 420, 0, "left"],
  ["write r code", 250, 180, 1, "below"],
  ["summarize a paper", 1440, 180, 1, "below"],
  ["run an analysis", 200, 470, 2, "below"],
  ["search literature", 1470, 470, 2, "below"],
  ["judge what matters", 840, 60, 3, "right"],
  ["cite only real sources", 840, 500, 3, "far below"],
];
const PRINT = /[?&]print/.test(location.search);
function figGrowth(step, from) {
  const c = C();
  const parts = [frontierPolygon(frontierPoints(step), from === undefined ? null : frontierPoints(from))];
  parts.push(d.label(F.cx, 0, "inside the frontier", { size: 48, color: c.white, anchor: "middle", centerY: 245 }));
  parts.push(d.label(0, 0, FRONTIER_YEARS[step], { size: 48, color: step === 3 ? c.yellow : c.white, centerY: 40 }));
  if (step === 3) parts.push(d.label(170, 0, "a hypothesis: ai can do everything\nhumans can, and better", { size: 20, color: c.yellow, centerY: 40, lineHeight: 1.3 }));
  GROW_TASKS.forEach(([t, x, y, k, at]) => {
    const col = k > step ? c.gray : (k === step && step > 0 ? c.yellow : c.white);
    parts.push(dot(x, y, col));
    const o = { size: 32, color: col, centerY: y };
    const lab = at === "right" ? d.label(x + 22, 0, t, o)
      : at === "left" ? d.label(x - 22, 0, t, { ...o, anchor: "end" })
      : d.label(x, 0, t, { ...o, anchor: "middle", centerY: y + (at === "below" ? 42 : 100) });
    parts.push(halo(lab));
  });
  return d.svg(1680, 660, ...parts);
}
let growthShown = null;
function showGrowth(slide, step) {
  step = step || 0;
  // morph only when stepping forward live, never in print or export
  const from = !PRINT && growthShown === step - 1 ? step - 1 : undefined;
  put("fig-growth", figGrowth(step, from));
  growthShown = step;
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
  labels.push(d.label(X + 24, 0, "share of references that do not exist", { size: 32, color: c.gray, centerY: 50 }));
  rows.forEach(([m, f, e], i) => {
    const y = 110 + i * 230;
    labels.push(d.label(0, 0, m, { size: 48, color: c.white, centerY: y + 50, keepCase: true }));
    boxes.push(d.box(X, y, Wf * f / 100, 100, "", { border: null, fill: c.blue, rx: 4 }));
    labels.push(d.label(X + Wf * f / 100 + 24, 0, f + " %", { size: 48, color: c.white, centerY: y + 50 }));
    labels.push(d.label(X + 24, 0, `of the real ones, ${e} % had errors in authors, year or pages`, { size: 32, color: c.gray, centerY: y + 150 }));
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
put("fig-tools", figTools());
put("fig-phases", figPhases(false));
put("fig-phases-task", figPhases(true));
put("fig-levels", figLevels(0));
put("fig-levels-table", figLevelsTable());
put("fig-frontier", figFrontier());
put("fig-growth", figGrowth(0));
put("fig-references", figReferences());
put("fig-refs-2026", figRefs2026());
put("fig-use-table", figUseTable());
Object.assign(window, { showKinds, showLevels, showGrowth });
