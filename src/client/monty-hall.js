// The game with three doors, to play on the page: pick a door, the host
// opens another one with a goat behind it, then stay or switch. Every round
// is recorded, and the record is shown as R code (one vector per column, the
// same columns as the data set lets_make_a_deal.csv), ready to be copied into
// an R box. The rounds are kept in this browser, so a reload keeps them.
//
// Written with ```monty-hall in Markdown (remark-knowledge.mjs); the labels
// come from the page (data-monty-hall-labels on <body>).
import { addCopyButton } from './copy.js';
import { keys } from './demo-frame.js';

const L = JSON.parse(document.body.dataset.montyHallLabels ?? '{}');
const KEY = 'hocs-monty-hall';
const DOORS = [1, 2, 3];

const pick = (options) => options[Math.floor(Math.random() * options.length)];
const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k]);

function stored() {
  try {
    const rounds = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(rounds) ? rounds : [];
  } catch {
    return [];
  }
}

function store(rounds) {
  try {
    localStorage.setItem(KEY, JSON.stringify(rounds));
  } catch {
    // private window or storage switched off: the rounds last until reload
  }
}

/** The rounds as R vectors, one per column. */
function asR(rounds) {
  if (rounds.length === 0) return `# ${L.none}`;
  const numbers = (key) => `c(${rounds.map((r) => r[key]).join(', ')})`;
  return [
    `prize_door <- ${numbers('prize_door')}`,
    `contestant_choice <- ${numbers('contestant_choice')}`,
    `monty_opens <- ${numbers('monty_opens')}`,
    `decision <- c(${rounds.map((r) => `"${r.decision}"`).join(', ')})`,
  ].join('\n');
}

function setup(box) {
  let rounds = stored();
  let round = null; // { prize_door, contestant_choice, monty_opens, decision }

  box.innerHTML = `
    <p class="mh-status" aria-live="polite"></p>
    <div class="mh-doors">${DOORS.map(
      (d) => `<button type="button" class="mh-door" data-door="${d}"><span class="mh-number">${d}</span><span class="mh-behind" aria-hidden="true"></span></button>`,
    ).join('')}</div>
    <div class="mh-actions">
      <button type="button" class="button" data-act="stay" hidden></button>
      <button type="button" class="button" data-act="switch" hidden></button>
      <button type="button" class="button" data-act="next" hidden>${L.next}</button>
    </div>
    <p class="mh-score"></p>
    <div class="mh-record">
      <p class="mh-record-head"><span>${L.record}</span><button type="button" class="mh-reset">${L.reset}</button></p>
      <div class="code-block"><pre class="code"><code></code></pre></div>
    </div>`;
  const status = box.querySelector('.mh-status');
  const doors = [...box.querySelectorAll('.mh-door')];
  const act = (name) => box.querySelector(`[data-act="${name}"]`);
  const score = box.querySelector('.mh-score');
  const code = box.querySelector('.mh-record code');
  addCopyButton(box.querySelector('.mh-record .code-block'), () => code.textContent);

  const other = () => DOORS.find((d) => d !== round.contestant_choice && d !== round.monty_opens);

  function showRecord() {
    code.textContent = asR(rounds);
    const tally = (decision) => {
      const games = rounds.filter((r) => r.decision === decision);
      const won = games.filter((r) => (r.prize_door === r.contestant_choice) === (decision === 'stay')).length;
      return games.length ? fill(L.tally, { decision: L[decision + 'ed'], won, games: games.length }) : '';
    };
    const played = rounds.length === 1 ? L.round : fill(L.rounds, { n: rounds.length });
    score.textContent = rounds.length ? [played, tally('stay'), tally('switch')].filter(Boolean).join(' ') : '';
  }

  // what each door shows and whether it can be clicked, at every step
  function showDoors() {
    for (const door of doors) {
      const d = Number(door.dataset.door);
      const open = round.decision ? true : d === round.monty_opens;
      const car = d === round.prize_door;
      door.dataset.open = String(open);
      door.dataset.chosen = String(d === (round.decision === 'switch' ? other() : round.contestant_choice) && Boolean(round.contestant_choice));
      door.querySelector('.mh-behind').textContent = open ? (car ? '🚗' : '🐐') : '';
      door.disabled = Boolean(round.decision) || d === round.monty_opens;
      door.setAttribute('aria-label', fill(open ? (car ? L.doorCar : L.doorGoat) : L.door, { d }));
    }
  }

  function start() {
    round = { prize_door: pick(DOORS) };
    status.textContent = L.choose;
    for (const name of ['stay', 'switch', 'next']) act(name).hidden = true;
    showDoors();
  }

  function choose(d) {
    round.contestant_choice = d;
    round.monty_opens = pick(DOORS.filter((x) => x !== d && x !== round.prize_door));
    status.textContent = fill(L.opened, { d: round.monty_opens });
    act('stay').textContent = fill(L.stay, { d });
    act('switch').textContent = fill(L.switch, { d: other() });
    act('stay').hidden = act('switch').hidden = false;
    showDoors();
    act('stay').focus();
  }

  function decide(decision) {
    round.decision = decision;
    const final = decision === 'stay' ? round.contestant_choice : other();
    status.textContent = fill(final === round.prize_door ? L.won : L.lost, { d: round.prize_door });
    rounds = [...rounds, round];
    store(rounds);
    act('stay').hidden = act('switch').hidden = true;
    act('next').hidden = false;
    showDoors();
    showRecord();
    act('next').focus();
  }

  for (const door of doors) {
    door.addEventListener('click', () => {
      const d = Number(door.dataset.door);
      if (!round.contestant_choice) choose(d);
      else if (!round.decision) decide(d === round.contestant_choice ? 'stay' : 'switch');
    });
  }
  act('stay').addEventListener('click', () => decide('stay'));
  act('switch').addEventListener('click', () => decide('switch'));
  act('next').addEventListener('click', start);
  box.querySelector('.mh-reset').addEventListener('click', () => {
    rounds = [];
    store(rounds);
    showRecord();
    start();
  });

  // the doors by number, so that a round can be played from the keyboard
  keys(
    box,
    [
      ['1 – 3', L.keyDoors],
      [L.nextKey, L.keyNext],
    ],
    (key) => {
      const door = /^\d$/.test(key) && doors[Number(key) - 1];
      if (door) door.click();
      else if (key.toUpperCase() === L.nextKey && !act('next').hidden) start();
      else return false;
      return true;
    },
  );

  showRecord();
  start();
}

for (const box of document.querySelectorAll('[data-monty-hall]')) setup(box);
