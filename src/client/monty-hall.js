// The game with three doors, to play on the page: pick a door, the host
// opens another one with a goat behind it, then stay or switch. Every round
// is recorded: a bar per decision shows how often it won, and on request the
// record appears as R code (one vector per column, the same columns as the
// data set lets_make_a_deal.csv), ready to be copied into an R box. The
// rounds are kept in this browser, so a reload keeps them.
//
// Nothing moves while playing: the status, the buttons and the statistics
// have places of a fixed size, and the doors swing open in place.
//
// Written with ```monty-hall in Markdown (remark-knowledge.mjs); the labels
// come from the page (data-monty-hall-labels on <body>).
import { addCopyButton } from './copy.js';
import { keys } from './demo-frame.js';

const L = JSON.parse(document.body.dataset.montyHallLabels ?? '{}');
const KEY = 'hocs-monty-hall';
const DOORS = [1, 2, 3];
const DECISIONS = ['stay', 'switch'];

const pick = (options) => options[Math.floor(Math.random() * options.length)];
const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k]);
const wins = (r) => (r.prize_door === r.contestant_choice) === (r.decision === 'stay');

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
    <div class="mh-stage">
      <div class="mh-play">
        <div class="mh-doors">${DOORS.map(
          (d) => `<button type="button" class="mh-door" data-door="${d}"><span class="mh-behind" aria-hidden="true"></span><span class="mh-panel" aria-hidden="true">${d}</span></button>`,
        ).join('')}</div>
        <div class="mh-actions">
          <button type="button" class="button" data-act="stay"></button>
          <button type="button" class="button" data-act="switch"></button>
          <button type="button" class="button" data-act="next">${L.next}</button>
        </div>
      </div>
      <div class="mh-stats">
        <p class="mh-stats-head"></p>
        ${DECISIONS.map(
          (decision) => `<div class="mh-stat" data-decision="${decision}">
            <span class="mh-stat-label">${L[decision + 'ed']}</span>
            <span class="mh-stat-value"></span>
            <span class="mh-bar" aria-hidden="true"><span class="mh-bar-fill"></span></span>
          </div>`,
        ).join('')}
        <p class="mh-tools">
          <button type="button" class="mh-link" data-act="code" aria-expanded="false">${L.showCode}</button>
          <button type="button" class="mh-link" data-act="reset">${L.reset}</button>
        </p>
      </div>
    </div>
    <div class="mh-record" hidden>
      <div class="code-block"><pre class="code"><code></code></pre></div>
    </div>`;
  const status = box.querySelector('.mh-status');
  const doors = [...box.querySelectorAll('.mh-door')];
  const act = (name) => box.querySelector(`[data-act="${name}"]`);
  const record = box.querySelector('.mh-record');
  const code = record.querySelector('code');
  addCopyButton(record.querySelector('.code-block'), () => code.textContent);

  const other = () => DOORS.find((d) => d !== round.contestant_choice && d !== round.monty_opens);
  const final = () => (round.decision === 'switch' ? other() : round.contestant_choice);

  // only the buttons of the current step can be seen; the others keep their place
  function showActions(...names) {
    for (const name of ['stay', 'switch', 'next']) {
      const shown = names.includes(name);
      act(name).classList.toggle('is-gone', !shown);
      act(name).disabled = !shown;
    }
  }

  function showStats() {
    code.textContent = asR(rounds);
    box.querySelector('.mh-stats-head').textContent = rounds.length === 1 ? L.round : fill(L.rounds, { n: rounds.length });
    for (const decision of DECISIONS) {
      const games = rounds.filter((r) => r.decision === decision);
      const won = games.filter(wins).length;
      const row = box.querySelector(`.mh-stat[data-decision="${decision}"]`);
      row.querySelector('.mh-stat-value').textContent = games.length
        ? fill(L.tally, { won, games: games.length, rate: Math.round((100 * won) / games.length) })
        : '–';
      row.querySelector('.mh-bar-fill').style.width = `${games.length ? (100 * won) / games.length : 0}%`;
    }
  }

  // what each door shows and whether it can be clicked, at every step
  function showDoors() {
    for (const door of doors) {
      const d = Number(door.dataset.door);
      const open = round.decision ? true : d === round.monty_opens;
      const car = d === round.prize_door;
      door.dataset.open = String(open);
      door.dataset.chosen = String(Boolean(round.contestant_choice) && d === final());
      // the door the player ends with opens last
      door.style.setProperty('--delay', round.decision && d === final() ? '0.45s' : '0s');
      door.querySelector('.mh-behind').textContent = open ? (car ? '🚗' : '🐐') : '';
      door.disabled = Boolean(round.decision) || d === round.monty_opens;
      door.setAttribute('aria-label', fill(open ? (car ? L.doorCar : L.doorGoat) : L.door, { d }));
    }
  }

  function start() {
    round = { prize_door: pick(DOORS) };
    status.textContent = L.choose;
    showActions();
    showDoors();
  }

  function choose(d) {
    round.contestant_choice = d;
    round.monty_opens = pick(DOORS.filter((x) => x !== d && x !== round.prize_door));
    status.textContent = fill(L.opened, { d: round.monty_opens });
    act('stay').textContent = fill(L.stay, { d });
    act('switch').textContent = fill(L.switch, { d: other() });
    showActions('stay', 'switch');
    showDoors();
    act('stay').focus({ preventScroll: true });
  }

  function decide(decision) {
    round.decision = decision;
    status.textContent = fill(final() === round.prize_door ? L.won : L.lost, { d: round.prize_door });
    rounds = [...rounds, round];
    store(rounds);
    showActions('next');
    showDoors();
    showStats();
    act('next').focus({ preventScroll: true });
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
  act('code').addEventListener('click', () => {
    record.hidden = !record.hidden;
    act('code').textContent = record.hidden ? L.showCode : L.hideCode;
    act('code').setAttribute('aria-expanded', String(!record.hidden));
  });
  act('reset').addEventListener('click', () => {
    rounds = [];
    store(rounds);
    showStats();
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
      else if (key.toUpperCase() === L.nextKey && round.decision) start();
      else return false;
      return true;
    },
  );

  showStats();
  start();
}

for (const box of document.querySelectorAll('[data-monty-hall]')) setup(box);
