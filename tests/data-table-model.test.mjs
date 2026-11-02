// The table demonstrator without the page (client/data-table-model.js): cells
// under a type, the type R would infer, R names, the CSV export, and the RDS
// export, which is read back here by a small reader for the part of R's
// serialization format it writes. That R itself reads the files was checked
// with readRDS() when the encoder was written.
// Usage: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gunzipSync } from 'node:zlib';
import { columnType, fits, gzip, inferType, isSnakeCase, isSyntactic, levels, readCode, suggestName, toCsv, toRds } from '../src/client/data-table-model.js';

const table = {
  columns: [
    { name: 'runde', type: 'integer' },
    { name: 'tuer', type: '' },
    { name: 'gewonnen', type: 'logical' },
    { name: 'entscheidung', type: 'factor' },
    { name: 'dauer', type: 'double' },
    { name: 'notiz', type: 'character' },
  ],
  rows: [
    ['1', '2', 'TRUE', 'wechseln', '3,5', 'Tür "zwei", ok'],
    ['2', '', 'F', 'bleiben', '', ''],
    ['x', '3', 'NA', 'wechseln', 'abc', 'Ziege 🐐'],
  ],
};

// --- a reader for what toRds() writes ------------------------------------------

function readRds(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let at = 0;
  const int = () => ((at += 4), view.getInt32(at - 4));
  const text = (n) => new TextDecoder().decode(bytes.subarray(at, (at += n)));
  assert.equal(text(2), 'X\n');
  const header = { version: int(), writer: int(), reader: int() };
  header.encoding = text(int());

  function item() {
    const flags = int();
    const type = flags & 0xff;
    const hasAttr = Boolean(flags & (1 << 9));
    if (type === 254) return null;
    if (type === 9) {
      const n = int();
      return n === -1 ? null : text(n);
    }
    if (type === 1) return { symbol: item() };
    if (type === 2) {
      const tag = item().symbol;
      const value = item();
      return { [tag]: value, ...(item() ?? {}) };
    }
    const n = int();
    let value;
    if (type === 10 || type === 13) value = Array.from({ length: n }, () => int()).map((v) => (v === -2147483648 ? null : type === 10 ? v === 1 : v));
    else if (type === 14)
      value = Array.from({ length: n }, () => {
        const hi = view.getUint32(at);
        const lo = view.getUint32(at + 4);
        const x = view.getFloat64(at);
        at += 8;
        return hi === 0x7ff00000 && lo === 1954 ? null : x;
      });
    else if (type === 16 || type === 19) value = Array.from({ length: n }, item);
    else throw new Error(`unexpected type ${type}`);
    return { type, value, attributes: hasAttr ? item() : null };
  }
  return { header, data: item(), rest: bytes.length - at };
}

// --- types ----------------------------------------------------------------------

test('a cell fits its type, a missing one always; the decimal comma counts as a point', () => {
  assert.ok(fits('3,5', 'double') && fits('3.5', 'double') && fits('-1e3', 'double'));
  assert.ok(fits('42', 'integer') && !fits('4.2', 'integer') && !fits('3000000000', 'integer'));
  assert.ok(fits('TRUE', 'logical') && fits('F', 'logical') && !fits('ja', 'logical'));
  assert.ok(fits('', 'integer') && fits('NA', 'logical') && fits('irgendwas', 'character') && fits('x', ''));
});

test('without a type a column gets the one read.csv() would infer', () => {
  assert.equal(inferType(['TRUE', '', 'F']), 'logical');
  assert.equal(inferType(['1', '2', 'NA']), 'integer');
  assert.equal(inferType(['1', '2,5']), 'double');
  assert.equal(inferType(['1', 'zwei']), 'character');
  assert.equal(inferType(['', '']), 'logical');
  assert.equal(columnType(table, 1), 'integer');
  assert.equal(columnType(table, 3), 'factor');
});

test('the levels of a factor come in the order they first appear', () => {
  assert.deepEqual(levels(['wechseln', 'bleiben', '', 'wechseln', 'NA']), ['wechseln', 'bleiben']);
});

test('names: what R accepts, the usual style, and a suggestion', () => {
  assert.ok(isSyntactic('prize_door') && isSyntactic('Prize.Door') && isSyntactic('.x'));
  assert.ok(!isSyntactic('2door') && !isSyntactic('prize door') && !isSyntactic('TRUE') && !isSyntactic('.2x') && !isSyntactic('tür'));
  assert.ok(isSnakeCase('prize_door') && !isSnakeCase('Prize.Door'));
  assert.equal(suggestName('Tür gewählt'), 'tuer_gewaehlt');
  assert.equal(suggestName('prizeDoor'), 'prize_door');
  assert.equal(suggestName('1. Wahl'), 'x1_wahl');
  assert.equal(suggestName('if'), 'if_');
  assert.equal(suggestName('  '), '');
});

// --- CSV ------------------------------------------------------------------------

test('CSV after RFC 4180: header row, quotes doubled, numbers with a point, missing cells empty', () => {
  assert.equal(
    toCsv(table),
    [
      'runde,tuer,gewonnen,entscheidung,dauer,notiz',
      '1,2,TRUE,wechseln,3.5,"Tür ""zwei"", ok"',
      '2,,FALSE,bleiben,,',
      'x,3,,wechseln,abc,Ziege 🐐',
      '',
    ].join('\r\n'),
  );
});

test('a column without a name is written as V and its number, as in R', () => {
  assert.equal(toCsv({ columns: [{ name: 'a', type: '' }, { name: ' ', type: '' }], rows: [] }), 'a,V2\r\n');
});

// --- RDS ------------------------------------------------------------------------

test('RDS: a data.frame in format version 3 with one vector of the right type per column', () => {
  const { header, data, rest } = readRds(toRds(table));
  assert.equal(rest, 0);
  assert.equal(header.version, 3);
  assert.equal(header.encoding, 'UTF-8');
  assert.equal(data.type, 19);
  assert.deepEqual(data.attributes.names.value, ['runde', 'tuer', 'gewonnen', 'entscheidung', 'dauer', 'notiz']);
  assert.deepEqual(data.attributes.class.value, ['data.frame']);
  assert.deepEqual(data.attributes['row.names'].value, [null, -3]);
  const [runde, tuer, gewonnen, entscheidung, dauer, notiz] = data.value;
  assert.deepEqual([runde.type, runde.value], [13, [1, 2, null]]);
  assert.deepEqual([tuer.type, tuer.value], [13, [2, null, 3]]);
  assert.deepEqual([gewonnen.type, gewonnen.value], [10, [true, false, null]]);
  assert.deepEqual([entscheidung.type, entscheidung.value], [13, [1, 2, 1]]);
  assert.deepEqual(entscheidung.attributes.levels.value, ['wechseln', 'bleiben']);
  assert.deepEqual(entscheidung.attributes.class.value, ['factor']);
  assert.deepEqual([dauer.type, dauer.value], [14, [3.5, null, null]]);
  assert.deepEqual([notiz.type, notiz.value], [16, ['Tür "zwei", ok', null, 'Ziege 🐐']]);
});

test('RDS: a table without rows has empty row names', () => {
  const { data } = readRds(toRds({ columns: [{ name: 'a', type: '' }], rows: [] }));
  assert.deepEqual(data.attributes['row.names'].value, []);
  assert.deepEqual(data.value[0].value, []);
});

test('RDS compressed with gzip holds the same bytes', async () => {
  const raw = toRds(table);
  const packed = await gzip(raw);
  assert.deepEqual([packed[0], packed[1]], [0x1f, 0x8b]);
  assert.deepEqual(new Uint8Array(gunzipSync(packed)), raw);
});

// --- R code ---------------------------------------------------------------------

test('the R code reads both files and turns factor columns of the CSV file into factors', () => {
  const words = { file: 'monty_hall_runden', object: 'runden', commentCsv: 'csv', commentFactor: 'fct', commentRds: 'rds' };
  const code = readCode(table, words);
  assert.match(code, /^runden <- read\.csv\("monty_hall_runden\.csv"\)$/m);
  assert.match(code, /^runden\$entscheidung <- factor\(runden\$entscheidung, levels = c\("wechseln", "bleiben"\)\)$/m);
  assert.match(code, /^runden <- readRDS\("monty_hall_runden\.rds"\)$/m);
  const odd = readCode({ columns: [{ name: 'Tür gewählt', type: 'factor' }], rows: [['1']] }, words);
  assert.match(odd, /read\.csv\("monty_hall_runden\.csv", check\.names = FALSE\)/);
  assert.match(odd, /runden\$`Tür gewählt` <- factor/);
});
