// The folder tree and command line of the demonstrator (client/shell-model.js):
// the commands of the path "Die Kommandozeile" in PowerShell and zsh, their
// messages, the way a path takes, Tab, and the check of a scenario.
// Usage: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createShell, scenarioProblems, words } from '../src/client/shell-model.js';

const tree = {
  Desktop: {},
  Documents: { uni: { 'notizen.txt': 'Zwei Ideen\n' } },
  'Meine Fotos': { 'urlaub.jpg': '' },
  'hallo.py': 'print("Hallo!")\n',
};
const shell = (platform, lang = 'de') => createShell({ tree }, { platform, lang, now: new Date(2026, 10, 2, 9, 14) });
const text = (result) => result.output.map((o) => o.text).join('\n');

test('cd moves through the tree, and the prompt shows where you are', () => {
  const win = shell('windows');
  assert.equal(win.prompt(), 'PS C:\\Users\\anna> ');
  win.run('cd Documents\\uni');
  assert.equal(win.prompt(), 'PS C:\\Users\\anna\\Documents\\uni> ');
  win.run('cd ..');
  win.run('cd /Users/anna/Documents/uni'); // PowerShell takes the slash as well
  assert.deepEqual(win.cwd, ['Users', 'anna', 'Documents', 'uni']);
  win.run('cd ~');
  assert.deepEqual(win.cwd, ['Users', 'anna']);

  const mac = shell('mac');
  mac.run('cd documents/UNI'); // names do not depend on case on either system
  assert.equal(mac.prompt(), 'anna@MacBook uni % ');
  assert.equal(text(mac.run('pwd')), '/Users/anna/Documents/uni');
  mac.run('cd ../../..');
  assert.equal(mac.prompt(), 'anna@MacBook Users % ');
});

test('a wrong name or a blank without quotes gets the message of the real shell', () => {
  const win = shell('windows');
  assert.equal(text(win.run('cd Dokumente')), 'Set-Location : Der Pfad "C:\\Users\\anna\\Dokumente" kann nicht gefunden werden, da er nicht vorhanden ist.');
  assert.equal(text(shell('windows', 'en').run('cd Dokumente')), "Set-Location : Cannot find path 'C:\\Users\\anna\\Dokumente' because it does not exist.");
  assert.match(text(win.run('cd Meine Fotos')), /Positionsparameter .* "Fotos"/);
  assert.equal(win.run('cd "Meine Fotos"').output.length, 0);
  assert.match(text(win.run('touch a.txt')), /^touch : Die Benennung "touch" wurde nicht/);

  const mac = shell('mac');
  assert.equal(text(mac.run('cd Dokumente')), 'cd: no such file or directory: Dokumente');
  assert.equal(text(mac.run('cd Meine Fotos')), 'cd: string not in pwd: Meine');
  mac.run('cd Meine\\ Fotos');
  assert.equal(mac.prompt(), 'anna@MacBook Meine Fotos % ');
  assert.equal(text(mac.run('python hallo.py')), 'zsh: command not found: python');
});

test('ls lists folders and files as PowerShell and zsh do', () => {
  const lines = text(shell('windows').run('ls')).split('\n');
  assert.equal(lines[1], '    Verzeichnis: C:\\Users\\anna');
  assert.equal(lines[4], 'Mode                 LastWriteTime         Length Name');
  assert.equal(lines[6], 'd-----        02.11.2026     09:14                Desktop');
  assert.equal(lines.at(-2), '-a----        02.11.2026     09:14             16 hallo.py');
  assert.equal(text(shell('mac').run('ls')), 'Desktop      Documents    Meine Fotos  hallo.py');
});

test('mkdir, touch, cp, mv and rm change the tree and say what changed', () => {
  const mac = shell('mac');
  const made = mac.run('mkdir archiv');
  assert.equal(made.added.length, 1);
  assert.equal(text(mac.run('mkdir archiv')), 'mkdir: archiv: File exists');
  mac.run('touch ideen.txt');
  mac.run('cp hallo.py archiv');
  const moved = mac.run('mv ideen.txt archiv/notiz.txt');
  assert.equal(moved.moved.length, 1);
  assert.equal(text(mac.run('ls archiv')), 'hallo.py   notiz.txt');
  assert.equal(text(mac.run('rm archiv')), 'rm: archiv: is a directory');
  const gone = mac.run('rm -r archiv');
  assert.equal(gone.removed.length, 3);
  assert.equal(text(mac.run('cp Documents Kopie')), 'cp: Documents is a directory (not copied).');

  const win = shell('windows');
  win.run('mkdir studium\\programmieren'); // New-Item makes the folders on the way
  assert.ok(win.resolve('studium/programmieren').node?.dir);
  assert.equal(win.run('rm studium').output[0].kind, 'note'); // PowerShell would ask first
  assert.equal(win.run('rm -Recurse studium').removed.length, 2);
  assert.equal(win.run('cp Documents Kopie').output[0].kind, 'note'); // only the empty folder
  assert.equal(win.resolve('Kopie').node.children.length, 0);
});

test('echo writes into a file, cat shows it, and python runs print with fixed text', () => {
  const win = shell('windows');
  win.run('echo "Kommandozeile üben" > ideen.txt');
  assert.equal(text(win.run('cat ideen.txt')), 'Kommandozeile üben');
  assert.equal(text(win.run('python hallo.py')), 'Hallo!');
  assert.equal(text(win.run('python x.py')), "python: can't open file 'C:\\\\Users\\\\anna\\\\x.py': [Errno 2] No such file or directory");
});

test('the way of a path is known while it is typed, and where it goes wrong', () => {
  const win = shell('windows');
  win.run('cd Documents');
  const [way] = win.preview('cd ..\\Meine Fotos');
  assert.deepEqual(way.steps.map((s) => s.move), ['start', 'up']);
  assert.deepEqual(way.problem, { kind: 'missing', name: 'Meine', path: ['Users', 'anna'] });
  const [ok] = win.preview('cd "..\\Meine Fotos"');
  assert.deepEqual(ok.steps.map((s) => s.move), ['start', 'up', 'down']);
  assert.equal(ok.problem, null);
  const [jump] = win.preview('cd C:\\Users');
  assert.deepEqual(jump.steps.map((s) => s.move), ['root', 'down']);
  const [fresh] = win.preview('mkdir neu');
  assert.equal(fresh.problem, null);
  assert.equal(fresh.missing, 'neu');
  assert.equal(win.relative(['Users', 'anna', 'Meine Fotos']), '"..\\Meine Fotos"');
});

test('Tab completes as each shell does', () => {
  const win = shell('windows');
  assert.equal(win.complete('cd Me').line, "cd '.\\Meine Fotos\\'");
  assert.equal(win.complete('cd D', 0).line, 'cd .\\Desktop\\');
  assert.equal(win.complete('cd D', 1).line, 'cd .\\Documents\\');
  const mac = shell('mac');
  assert.equal(mac.complete('cd Me').line, 'cd Meine\\ Fotos/');
  assert.deepEqual(mac.complete('cd D').matches, ['Desktop', 'Documents']);
  assert.equal(mac.complete('cat ha').line, 'cat hallo.py ');
});

test('words keep quoted names together, and zsh a name with a backslash', () => {
  assert.deepEqual(words('cd "Meine Fotos"', 'windows').map((w) => w.text), ['cd', 'Meine Fotos']);
  assert.deepEqual(words('cd Meine\\ Fotos', 'mac').map((w) => w.text), ['cd', 'Meine Fotos']);
  assert.deepEqual(words('cd Documents\\uni', 'windows').map((w) => w.text), ['cd', 'Documents\\uni']);
});

test('a scenario names files and folders and starts in one of its folders', () => {
  assert.deepEqual(scenarioProblems({ tree, start: '~/Documents/uni' }), []);
  assert.match(scenarioProblems({ tree, start: 'Fotos' })[0], /not a folder of the tree/);
  assert.match(scenarioProblems({ tree: { 'a:b': '' } })[0], /not a valid/);
  assert.match(scenarioProblems({ tree, colour: 'red' })[0], /unknown field/);
  assert.equal(createShell({ tree, start: 'Documents/uni' }, { platform: 'mac' }).prompt(), 'anna@MacBook uni % ');
});
