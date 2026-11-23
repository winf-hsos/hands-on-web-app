// Drawings of the Shelf Life deck for the students. The figure area is 1680 x 804; sizes 20, 32, 48 and 80 come out as written.
const d = window.draw;
const el = (id) => document.getElementById(id);
const W = 1680, H = 804;

// A projector screenshot (1920 x 1080) fills the figure height: 1430 x 804, centred.
const S = 804 / 1080, X0 = Math.round((W - 1920 * S) / 2);
const fit = ([x, y, w, h]) => ({ x: Math.round(X0 + x * S), y: Math.round(y * S), width: Math.round(w * S), height: Math.round(h * S) });

// screen(id, file, closeups): the screenshot, then one closeup per step (rectangle in screenshot pixels),
// and back to the whole screen at the end when there is more than one closeup.
function screen(id, file, closeups = []) {
  const parts = [d.image(X0, 0, Math.round(1920 * S), H, file)];
  const views = closeups.map(([rect, caption], i) => {
    const c = d.closeup(W, H, fit(rect), caption, { zoom: 1.5 });
    parts.push(d.g(`spot${i}`, c.shade), d.g(`line${i}`, c.outline), d.g(`cap${i}`, c.caption));
    return c.view;
  });
  el(id).innerHTML = d.svg(W, H, ...parts);
  if (!closeups.length) return;
  // back: "play" -- zooming out again is the reverse of zooming in and tells nothing wrong
  const a = d.anim(id, { back: "play" });
  views.forEach((view, i) => {
    const out = i ? [a.hide(`spot${i - 1}`, { dur: 300 }), a.hide(`line${i - 1}`, { dur: 300 }), a.hide(`cap${i - 1}`, { dur: 300 })] : [];
    a.step(...out, a.camera(view, { dur: 1400 }),
           a.par(a.show(`spot${i}`, { dur: 600 }), a.draw(`line${i}`, { dur: 600 })), a.show(`cap${i}`, { dur: 300 }));
  });
  if (views.length > 1) {
    const k = views.length - 1;
    a.step(a.hide(`spot${k}`, { dur: 300 }), a.hide(`line${k}`, { dur: 300 }), a.hide(`cap${k}`, { dur: 300 }),
           a.camera([0, 0, W, H], { dur: 1400 }));
  }
}

// one round of the loop in its order, all three lines from the same entry: the quote, the tool call, the result
screen("fig-why", "img/screens/06-why.png", [
  [[1294, 905, 500, 26], "reason: why,\nin its own words"],
  [[1294, 882, 230, 26], "act: the tool\nit calls"],
  [[1294, 928, 345, 24], "observe: what\ncame back"],
]);
screen("fig-room", "img/screens/10-open.png", [
  [[1285, 85, 625, 445], "the agent: its goal,\nits tools, its thoughts"],
  [[280, 215, 690, 375], "the shelf: quantity, price\nand date label per batch"],
]);
screen("fig-night", "img/screens/15-night-monday.png");
screen("fig-ranking", "img/screens/20-ranking.png", [
  [[146, 465, 1630, 215], "points, meals, spoiled food\nand money left per student"],
]);

// What one sushi box earns or costs on each way out of the shop: shelf price 5.49, bought at half of it.
// Bars grow up (green, the shop earns) or down (red, the shop pays) from one zero line; no bar for 50 % off.
{
  const c = d.colors();
  // in cents, as the game shows them: shelf 5.49, bought at 2.75, marked down 4.12, 2.75 and 1.65
  const cost = 275;
  const ways = [
    ["full price", 549], ["25 % off", 412], ["50 % off", 275], ["70 % off", 165],
    ["food bank", 0], ["cashier", 0], ["bin", 0],
  ];
  // seven columns 220 wide, 240 apart: 0 + 6 x 240 + 220 = 1660; zero line at y 470, 80 px per euro
  const zero = 470, k = 80, bw = 160;
  const intro = d.label(0, 48, "a sushi box costs €5.49 on the shelf; the shop bought it for €2.75\nand pays that as soon as the box leaves the shelf, whichever way", { size: 32 });
  const parts = [intro, d.line(0, zero, 1680, zero, { color: c.gray })];
  ways.forEach(([name, takings], i) => {
    const x = i * 240, cx = x + 110, v = (takings - cost) / 100;
    const h = Math.abs(v) * k, col = v > 0 ? c.green : c.red;
    const sign = v > 0 ? "+" : v < 0 ? "−" : "±";
    const bar = Math.abs(v) < 0.01 ? "" :
      d.box(cx - bw / 2, v > 0 ? zero - h : zero, bw, h, "", { border: col, fill: col, rounded: false });
    const vy = v >= 0 ? zero - h - 20 : zero + h + 48;
    parts.push(d.g(`bar${i}`, bar + d.label(cx, vy, `${sign}€${Math.abs(v).toFixed(2)}`, { size: 32, color: Math.abs(v) < 0.01 ? c.gray : col, anchor: "middle" }) +
      d.label(cx, 790, name, { size: 32, color: c.light, anchor: "middle" })));
  });
  el("fig-money").innerHTML = d.svg(W, H, ...parts);
  // first the four prices, then the three ways that bring in nothing
  const a = d.anim("fig-money", { back: "play" });
  a.step(a.show("bar4", { dur: 400 }), a.show("bar5", { dur: 400 }), a.show("bar6", { dur: 400 }));
}

// The ReAct loop: three nodes in a triangle on the left, the sentence for each node on the right.
// Each step lights one node in yellow and adds its sentence.
{
  const c = d.colors();
  const nodes = [
    ["reason", 210, 60, "the language model reads the situation\nand writes down what to do and why"],
    ["act", 420, 430, "it calls one of its tools, such as\nlooking at the shelf or cutting a price"],
    ["observe", 0, 430, "it reads what the tool returned and\nstarts the next round until the job is done"],
  ];
  const nw = 260, nh = 110;
  const wires = [
    d.arrow(420, 176, 530, 420, { color: c.gray }),   // reason -> act
    d.arrow(410, 485, 270, 485, { color: c.gray }),   // act -> observe
    d.arrow(150, 420, 260, 176, { color: c.gray }),   // observe -> reason
  ];
  const boxes = nodes.map(([name, x, y]) => d.box(x, y, nw, nh, name, { border: c.blue, size: 48 }));
  const lights = nodes.map(([name, x, y], i) => d.g(`on${i}`, d.box(x, y, nw, nh, name, { border: c.yellow, color: c.yellow, size: 48, width: 4 })));
  // sentences at x 780: 900 wide, the longest line has 43 characters, 43 x 32 x 0.6 = 826
  const rows = nodes.map(([name, , , text], i) => {
    const y = 90 + i * 260;
    return d.g(`row${i}`, d.label(780, y, name, { size: 48, color: c.blue }) + d.label(780, y + 62, text, { size: 32 }));
  });
  el("fig-react").innerHTML = d.svg(W, H, ...wires, ...boxes, ...lights,
    d.label(340, 370, "ReAct", { size: 32, color: c.gray, anchor: "middle", keepCase: true }), ...rows);
  const a = d.anim("fig-react", { back: "play" });
  nodes.forEach((_, i) => {
    const off = i ? [a.hide(`on${i - 1}`, { dur: 300 })] : [];
    a.step(...off, a.show(`on${i}`, { dur: 400 }), a.show(`row${i}`, { dur: 500 }));
  });
}

// Two players: the agent on the left, the students on the right, six students walking to the shop.
{
  const c = d.colors();
  const agent = d.label(0, 60, "the agent", { size: 48, color: c.blue }) +
    d.label(0, 130, "runs the shop alone every\nevening from 8 to 10 pm", { size: 32 }) +
    d.label(0, 250, "its goal: earn good money and\nwaste as little food as possible", { size: 32, color: c.gray }) +
    d.image(228, 340, 204, 460, "img/game/agent.webp");
  // six students, 360 high in the files and about 200 wide, shown 330 high in boxes 210 wide, 146 apart:
  // they overlap a little like a group walking, 740 + 5 x 146 + 210 = 1680
  const you = d.label(740, 60, "you", { size: 48, color: c.blue }) +
    d.label(740, 130, "each phone is one student\nwith €28 for the whole week", { size: 32 }) +
    d.label(740, 250, "regular customers, played by\nthe computer, shop there too", { size: 32, color: c.gray }) +
    [1, 4, 2, 5, 3, 6].map((n, i) => d.image(740 + i * 146, 464, 210, 330, `img/game/customer${n}.webp`)).join("");
  el("fig-roles").innerHTML = d.svg(W, H, agent, d.line(690, 20, 690, 790, { color: c.dark }), you);
}

// How you score: dinner, then breakfast (step 1), then cooking, spoiled food and the budget (step 2).
// Inside a box the products are alternatives, so an "or" stands between them; boxes are joined by "+".
{
  const c = d.colors();
  const group = (x, y, w, h, items, caption) => {
    const iw = 140, gap = Math.min(90, (w - 40 - items.length * iw) / (items.length - 1));
    const x0 = x + (w - items.length * iw - (items.length - 1) * gap) / 2;
    return d.box(x, y, w, h, "", { border: c.dark }) +
      items.map((item, i) => d.image(Math.round(x0 + i * (iw + gap)), y + 20, iw, h - 40, `img/game/${item}.webp`)).join("") +
      items.slice(1).map((_, i) => d.label(Math.round(x0 + (i + 1) * (iw + gap) - gap / 2), 0, "or",
        { size: 32, color: c.light, anchor: "middle", centerY: y + h / 2 })).join("") +
      d.label(x + w / 2, y + h + 44, caption, { size: 32, color: c.gray, anchor: "middle" });
  };
  const plus = (x, cy) => d.label(x, 0, "+", { size: 48, color: c.light, anchor: "middle", centerY: cy });
  // dinner: 620 + 70 + 460 + 70 + 460 = 1680
  const dinner = d.label(0, 48, "dinner", { size: 48, color: c.blue }) +
    d.label(200, 48, "= 3 points", { size: 48, color: c.green }) +
    group(0, 80, 620, 180, ["beef", "sushi", "eggs"], "one main") + plus(655, 170) +
    group(690, 80, 460, 180, ["rolls", "pasta"], "one side") + plus(1185, 170) +
    group(1220, 80, 460, 180, ["salad", "berries"], "one fresh item");
  const breakfast = d.label(0, 438, "breakfast", { size: 48, color: c.blue }) +
    d.label(280, 438, "= 1 point", { size: 48, color: c.green }) +
    group(0, 470, 400, 180, ["yoghurt", "milk"], "yoghurt or milk") + plus(435, 560) +
    group(470, 470, 400, 180, ["rolls", "berries"], "rolls or strawberries");
  // notes from x 1120: 560 wide, the longest line has 28 characters, 28 x 32 x 0.6 = 538
  const notes = d.label(1120, 450, "at 22:00 you cook\nwith what expires first", { size: 32 }) +
    d.label(1120, 580, "whatever spoils in your\nfridge costs a point", { size: 32, color: c.red }) +
    d.label(1120, 710, "€28 for six evenings is just\nunder €5 per evening", { size: 32 });
  el("fig-score").innerHTML = d.svg(W, H, dinner, d.g("breakfast", breakfast), d.g("notes", notes));
  const a = d.anim("fig-score", { back: "play" });
  a.step(a.show("breakfast", { dur: 600 }));
  a.step(a.show("notes", { dur: 600 }));
}

// Three phones side by side: 390 x 844 screens, shown 323 x 700. Three steps: a tap on Buy in the left phone,
// then a closeup of tonight's meals on the same phone, then a closeup of the final ranking on the right phone.
{
  const c = d.colors(), w = 323, h = 700, y = 4, kx = w / 390, ky = h / 844;
  const phones = [["11-phone-shop", "a tap buys one item"], ["15b-phone-night", "tonight's meals"], ["19-phone-week", "end of the week"]];
  const left = (i) => 340 + i * 500 - w / 2;
  // a rectangle in phone css pixels to figure coordinates
  const on = (i, [x, py, rw, rh]) => ({ x: Math.round(left(i) + x * kx), y: Math.round(y + py * ky), width: Math.round(rw * kx), height: Math.round(rh * ky) });
  const parts = phones.map(([file, caption], i) => {
    const x = left(i), cx = x + w / 2;
    return d.box(x - 6, y - 4, w + 12, h + 8, "", { border: c.dark, rx: 28 }) +   // 4 inset from the top edge
           d.image(x, y, w, h, `img/screens/${file}.png`) +
           d.label(cx, 770, caption, { size: 32, color: c.gray, anchor: "middle" });
  });
  // the tap: a finger-sized ring on the Buy button of the sushi box (css 211..366 x 591..628)
  const tx = Math.round(left(0) + 288 * kx), ty = Math.round(y + 610 * ky);
  parts.push(d.g("tap", `<circle cx="${tx}" cy="${ty}" r="30" fill="${c.white}" fill-opacity="0.35" stroke="${c.yellow}" stroke-width="5"/>`));
  const meals = d.closeup(W, H, on(0, [12, 252, 366, 137]), "your meals fill up\nas you shop", { zoom: 1.5 });
  const rank = d.closeup(W, H, on(2, [12, 376, 366, 224]), "the student with the\nmost points wins", { zoom: 1.5 });
  parts.push(d.g("mealsShade", meals.shade), d.g("mealsLine", meals.outline), d.g("mealsCap", meals.caption),
             d.g("rankShade", rank.shade), d.g("rankLine", rank.outline), d.g("rankCap", rank.caption));
  el("fig-phones").innerHTML = d.svg(W, H, ...parts);
  const a = d.anim("fig-phones", { back: "play" });
  a.step(a.show("tap", { dur: 200 }), a.pulse("tap", { times: 2 }));
  a.step(a.hide("tap", { dur: 200 }), a.camera(meals.view, { dur: 1200 }),
         a.par(a.show("mealsShade", { dur: 600 }), a.draw("mealsLine", { dur: 600 })), a.show("mealsCap", { dur: 300 }));
  a.step(a.hide("mealsShade", { dur: 300 }), a.hide("mealsLine", { dur: 300 }), a.hide("mealsCap", { dur: 300 }),
         a.camera(rank.view, { dur: 1400 }),
         a.par(a.show("rankShade", { dur: 600 }), a.draw("rankLine", { dur: 600 })), a.show("rankCap", { dur: 300 }));
}

// Let's open the shop: three things to do, each with a checkbox centred on its text. Every step ticks the
// current box in green and shows the next one; the last step ticks the last box.
{
  const c = d.colors();
  // Bootstrap Icons "square" and "check-square" 1.11.3 (MIT, (c) The Bootstrap Authors)
  const BOX = '<path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>';
  const TICK = BOX + '<path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>';
  // text at 48 from x 110: 1570 wide, the longest line has 42 characters, 42 x 48 x 0.6 = 1210
  const todos = [
    ["scan the QR code on the projector\nand choose a nickname", { keepCase: true }],
    ["while you shop, watch the agent: what does\nit do with food that cannot wait?", {}],
    ["and would you let it run your shop?", {}],
  ];
  const rows = [], ticks = [];
  todos.forEach(([text, o], i) => {
    const cy = 140 + i * 250;   // the middle of the row: box and text block are both centred on it
    rows.push(d.g(`todo${i}`, d.icon(0, cy - 32, 64, BOX, { color: c.blue }) + d.label(110, 0, text, { size: 48, centerY: cy, ...o })));
    ticks.push(d.g(`tick${i}`, d.icon(0, cy - 32, 64, TICK, { color: c.green })));
  });
  el("fig-go").innerHTML = d.svg(W, H, ...rows, ...ticks);
  const a = d.anim("fig-go", { back: "play" });
  a.step(a.show("tick0", { dur: 300 }), a.show("todo1", { dur: 500 }));
  a.step(a.show("tick1", { dur: 300 }), a.show("todo2", { dur: 500 }));
  a.step(a.show("tick2", { dur: 300 }));
}

// What can happen to food that cannot wait: five ways in a row, from best to worst.
{
  const c = d.colors();
  const ways = [
    ["sell", "at full price", c.green],
    ["mark down", "25, 50 or\n70 % off", c.white],
    ["food bank", "booked by 21:00,\nup to 15 kg,\nno use-by goods", c.white],
    ["cashier", "takes home up\nto 5 items\na night", c.white],
    ["bin", "what is left\nand will\nnot keep", c.red],
  ];
  // boxes 296 wide (longest title "mark down": 9 x 48 x 0.6 = 259 + 2 x 18), 345 apart, 2 inset at both edges:
  // 2 + 4 x 345 + 296 = 1678; rule lines at most 15 characters: 15 x 32 x 0.6 = 288 < 296
  const wires = [d.arrow(2, 190, 1676, 190, { color: c.gray })], boxes = [], labels = [
    d.label(2, 150, "best", { size: 32, color: c.gray }),
    d.label(1678, 150, "worst", { size: 32, color: c.gray, anchor: "end" }),
  ];
  ways.forEach(([title, rule, color], i) => {
    const x = 2 + i * 345;
    if (i) wires.push(d.arrow(x - 45, 345, x - 4, 345, { color: c.gray }));
    boxes.push(d.box(x, 290, 296, 110, title, { border: color, size: 48 }));
    labels.push(d.label(x, 470, rule, { size: 32, color: c.light }));
  });
  el("fig-ladder").innerHTML = d.svg(W, H, ...wires, ...boxes, ...labels);
}
