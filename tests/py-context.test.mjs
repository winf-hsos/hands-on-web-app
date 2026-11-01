// What the Python editor suggests where: own names first, built-in functions,
// methods after a dot by the type the code shows, modules, and nothing inside
// strings and comments.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { suggest } from '../src/client/py-context.js';

/** Suggestions with the cursor at §, as "kind:name". */
function at(code, options = {}) {
  const cursor = code.indexOf('§');
  const result = suggest(code.replace('§', ''), cursor, options);
  return result?.items.map((i) => `${i.kind}:${i.name}`) ?? null;
}

test('own names come before built-in functions and keywords', () => {
  assert.deepEqual(at('price = 3\npr§'), ['variable:price', 'function:print']);
  assert.deepEqual(at('def format_duration(seconds):\n    return ""\nfo§'), ['function:format_duration', 'keyword:for']);
});

test('parameters and loop names count as variables', () => {
  assert.deepEqual(at('def area(width, height):\n    return wi§'), ['variable:width', 'keyword:with']);
  assert.deepEqual(at('for letter in "abc":\n    print(le§)'), ['variable:letter', 'function:len']);
});

test('after a dot come the methods of the type the code shows', () => {
  assert.ok(at('name = input("Name? ")\nname.up§').includes('method:upper'));
  assert.deepEqual(at('items = []\nitems.ap§'), ['method:append']);
  assert.deepEqual(at('"a,b".sp§'), ['method:split']);
  // the type carries over: a stripped text is still text
  assert.deepEqual(at('name = input()\nname = name.strip()\nname.ti§'), ['method:title']);
});

test('after a dot with an unknown type come the methods of text, lists and dictionaries', () => {
  const found = at('thing.§', { force: true });
  assert.ok(found.includes('method:upper') && found.includes('method:append') && found.includes('method:keys'));
});

test('a module offers its functions and constants', () => {
  assert.deepEqual(at('import math\nmath.sq§'), ['function:sqrt']);
  assert.deepEqual(at('import math\nmath.p§'), ['function:pow', 'constant:pi']);
});

test('names from other editors on the page count too', () => {
  assert.deepEqual(at('tot§', { pageCode: 'total = 0' }), ['variable:total']);
});

test('nothing inside strings, comments, numbers, or before two letters', () => {
  assert.equal(at('print("pr§'), null);
  assert.equal(at('# pr§'), null);
  assert.equal(at('x = 12§'), null);
  assert.equal(at('p§'), null);
  assert.ok(at('p§', { force: true }).length > 0);
});
