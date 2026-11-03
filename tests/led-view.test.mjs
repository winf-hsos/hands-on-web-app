import { test } from 'node:test';
import assert from 'node:assert/strict';

globalThis.matchMedia ??= () => ({ matches: false });
const { segments, ticks } = await import('../src/client/led-view.js');

test('a colour lasts until the next one, the last until the program ends', () => {
  assert.deepEqual(segments([[0, 255, 0, 0], [1, 0, 0, 255]], 2), [
    { from: 0, to: 1, rgb: [255, 0, 0] },
    { from: 1, to: 2, rgb: [0, 0, 255] },
  ]);
});

test('two colours at the same moment keep the first as an instant', () => {
  assert.deepEqual(segments([[0, 255, 0, 0], [0, 0, 0, 255]], 2), [
    { from: 0, to: 0, rgb: [255, 0, 0] },
    { from: 0, to: 2, rgb: [0, 0, 255] },
  ]);
});

test('a colour set as the program ends still shows', () => {
  assert.deepEqual(segments([[0, 255, 0, 0], [1, 0, 0, 255]], 1).at(-1), { from: 1, to: 1, rgb: [0, 0, 255] });
});

test('off is a gap, not a bar', () => {
  assert.deepEqual(segments([[0, 255, 0, 0], [1, 0, 0, 0]], 2).map((s) => s.rgb), [[255, 0, 0], null]);
});

test('the time axis counts whole seconds, fewer on long runs', () => {
  assert.deepEqual(ticks(2), { span: 2, ticks: [0, 1, 2] });
  assert.deepEqual(ticks(0), { span: 1, ticks: [0, 1] });
  assert.deepEqual(ticks(6.5).span, 7);
  assert.deepEqual(ticks(20).ticks, [0, 5, 10, 15, 20]);
});
