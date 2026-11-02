// The rules of the knowledge base, each broken once on purpose.
// Usage: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadKnowledge } from '../src/build/load.mjs';
import { validate } from '../src/build/validate.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'knowledge');

/** A fresh copy of the real knowledge base, changed by `change`. */
function check(change = () => {}) {
  const knowledge = loadKnowledge(ROOT);
  const find = (section, id) => knowledge.sections[section].find((d) => d.id === id);
  change({ ...knowledge, find });
  return validate(knowledge);
}

const lead = (doc) => doc.files.de.data;

test('the knowledge base as it is has no errors', () => {
  assert.deepEqual(check().errors, []);
});

test('a label with an unquoted comma in the vocabulary is an error', () => {
  const { errors } = check(({ vocabulary }) => {
    vocabulary.topics['questions-and-measurement'] = { de: 'Fragen', 'Designs und Messung': null, en: 'Questions' };
  });
  assert.deepEqual(errors, ['vocabulary.yaml: topics questions-and-measurement: "Designs und Messung" has no value; put a label with a comma in quotes']);
});

test('a missing required field is named', () => {
  const { errors } = check(({ find }) => delete lead(find('content', 'command-line-navigating')).level);
  assert.deepEqual(errors, ['content/command-line-navigating/de.md: level is missing']);
});

test('an unknown type lists the known ones', () => {
  const { errors } = check(({ find }) => (lead(find('content', 'command-line-navigating')).type = 'experimnt'));
  assert.match(errors[0], /type: "experimnt" is not a known type \(lesson, /);
});

test('an item may have several types, each of them known, and a slides type wants its deck', () => {
  const unknown = check(({ find }) => (lead(find('content', 'command-line-navigating')).type = ['lesson', 'experimnt']));
  assert.match(unknown.errors[0], /type: "experimnt" is not a known type/);
  const { errors } = check(({ find }) => (lead(find('content', 'command-line-files')).type = ['lesson', 'slides']));
  assert.deepEqual(errors, ['content/command-line-files/slides: missing; a slides item keeps its stagekit deck in slides/']);
});

test('an unknown field is an error, so typos in field names do not go unnoticed', () => {
  const { errors } = check(({ find }) => (lead(find('content', 'command-line-navigating')).duratoin = 5));
  assert.deepEqual(errors, ['content/command-line-navigating/de.md: unknown field duratoin']);
});

test('codes are unique', () => {
  const { errors } = check(({ find }) => (lead(find('content', 'command-line-navigating')).code = 1512));
  assert.deepEqual(errors, ['content/command-line-navigating: code 1512 is already used by content/command-line-files']);
});

test('relations, path steps, course items and links must point to existing ids', () => {
  const { errors } = check(({ find }) => {
    lead(find('content', 'command-line-navigating')).relations.requires = ['nowhere'];
    lead(find('paths', 'the-command-line')).steps.push('nowhere-path');
    lead(find('courses', 'digitalisation-and-programming')).sections.push({ title: { de: 'A', en: 'A' }, items: ['nowhere-course'] });
    find('content', 'command-line-navigating').files.de.body += '\n[[nowhere-link]]\n';
  });
  assert.deepEqual(errors.sort(), [
    'content/command-line-navigating relations.requires: unknown item "nowhere"',
    'content/command-line-navigating/de.md: link to unknown id [[nowhere-link]]',
    'courses/digitalisation-and-programming sections[4]: unknown item "nowhere-course"',
    'paths/the-command-line steps: unknown item "nowhere-path"',
  ]);
});

test('a cycle in requires is an error', () => {
  const { errors } = check(({ find }) => {
    lead(find('content', 'command-line')).relations = { requires: ['command-line-navigating'] };
  });
  assert.deepEqual(errors, ['requires has a cycle: command-line -> command-line-navigating -> command-line']);
});

test('a quiz question needs a correct answer', () => {
  const { errors } = check(({ find }) => {
    const file = find('content', 'command-line-quiz').files.de;
    file.body = file.body.replace('- [x] `uni`', '- [ ] `uni`');
  });
  assert.deepEqual(errors, ['content/command-line-quiz/de.md: question 1 has no correct answer (- [x] …)']);
});

test('a folder needs exactly one lead file', () => {
  const { errors } = check(({ find }) => delete find('content', 'command-line-navigating').files.en.data.translation_of);
  assert.match(errors[0], /content\/command-line-navigating: expected exactly one lead file/);
});

test('an outdated translation is a warning, not an error', () => {
  const { errors, warnings } = check(({ find }) => (lead(find('content', 'command-line-navigating')).updated = new Date('2027-01-01')));
  assert.deepEqual(errors, []);
  assert.ok(warnings.includes('content/command-line-navigating/en.md: translation is older than its lead file'));
});

test('projects have no topics: an old topics line is a warning, not an error', () => {
  const { errors, warnings } = check(({ find }) => (lead(find('projects', 'lifi')).topics = ['solving-problems']));
  assert.deepEqual(errors, []);
  assert.ok(warnings.includes('projects/lifi/de.md: projects have no topics; remove the line'));
});

test('objectives are a sentence and a list; missing ones are a warning', () => {
  const broken = check(({ find }) => (lead(find('content', 'command-line-navigating')).objectives = { intro: 'Du kannst danach:', goals: [] }));
  assert.deepEqual(broken.errors, ['content/command-line-navigating/de.md: objectives: goals: expected at least 1 entry']);
  const missing = check(({ find }) => delete lead(find('content', 'command-line-navigating')).objectives);
  assert.deepEqual(missing.errors, []);
  assert.ok(missing.warnings.includes('content/command-line-navigating/de.md: no objectives (what you learn)'));
});

test('project phases and challenges must match the headings in every language', () => {
  const { errors } = check(({ find }) => {
    const file = find('projects', 'lifi').files.en;
    file.body = file.body.replace('{#word}', '{#words}');
  });
  assert.equal(errors.length, 1);
  assert.match(errors[0], /^projects\/lifi\/en\.md: headings with \{#id\} do not match/);
});

test('items linked in a project must exist', () => {
  const { errors } = check(({ find }) => {
    lead(find('projects', 'lifi')).phases[2].items = ['nowhere'];
  });
  assert.deepEqual(errors, ['projects/lifi word: unknown item "nowhere"']);
});

test('the challenge of a phase must be a challenge item', () => {
  const { errors } = check(({ find }) => {
    lead(find('projects', 'lifi')).phases[2].challenge = 'first-light';
  });
  assert.deepEqual(errors.sort(), [
    'content/lifi-challenge-2: belongs to project lifi, which does not link it',
    'projects/lifi word: challenge first-light has type slides, not challenge',
  ]);
});

test('an item of one project must be linked by it', () => {
  const { errors } = check(({ find }) => {
    lead(find('content', 'first-light')).project = 'lifi';
    lead(find('content', 'morse-code')).project = 'monty-hall';
    lead(find('content', 'problem-decomposition')).project = 'nowhere';
  });
  assert.deepEqual(errors.sort(), [
    'content/morse-code: belongs to project monty-hall, which does not link it',
    'content/problem-decomposition: unknown project "nowhere"',
  ]);
});

test('every item but a challenge states its duration', () => {
  const { errors } = check(({ find }) => {
    delete lead(find('content', 'first-light')).duration;
    delete lead(find('content', 'lifi-challenge-0')).duration;
  });
  assert.deepEqual(errors, ['content/first-light: duration is missing']);
});

test('nothing visible may point to archived content', () => {
  const { errors } = check(({ find }) => (lead(find('content', 'nand-gate')).status = 'archived'));
  assert.deepEqual(errors.sort(), [
    'content/petzold-code de.md [[link]]: points to archived "nand-gate"',
    'content/petzold-code en.md [[link]]: points to archived "nand-gate"',
    'content/petzold-code relations.see_also: points to archived "nand-gate"',
    'content/logic-gates de.md [[link]]: points to archived "nand-gate"',
    'content/logic-gates en.md [[link]]: points to archived "nand-gate"',
  ].sort());
});

test('archived content may point to anything', () => {
  const { errors } = check(({ find }) => {
    const gates = lead(find('content', 'bill-gates'));
    gates.status = 'archived';
    gates.relations = { see_also: ['nand-gate'] };
  });
  assert.deepEqual(errors, []);
});

test('a slides item needs its deck and every file the deck loads', () => {
  const { errors } = check(({ find }) => {
    const item = find('content', 'problem-decomposition');
    item.dir = item.dir.replace('problem-decomposition', 'no-such-folder');
  });
  assert.deepEqual(errors, ['content/problem-decomposition/slides: missing; a slides item keeps its stagekit deck in slides/']);
});

test('a dataset names a CSV that exists, and nothing else has a file', () => {
  const { errors } = check(({ find }) => {
    lead(find('content', 'milk-chocolate-survey')).file = 'no_such_file.csv';
    lead(find('content', 'command-line-navigating')).file = 'mds12_schoko_milch.csv';
  });
  assert.deepEqual(errors, [
    'content/command-line-navigating: file: only a dataset has a file',
    'content/milk-chocolate-survey: file: media/datasets/no_such_file.csv does not exist',
  ]);
});

test('recordings must be YouTube links', () => {
  const { errors } = check(({ find }) => {
    lead(find('content', 'problem-decomposition')).recordings = [{ title: 'Part 1', url: 'https://example.com/video' }];
  });
  assert.equal(errors.length, 1);
  assert.match(errors[0], /recordings: url: expected a YouTube link/);
});

test('a path has either steps or sections, and steps in sections are checked like any other', () => {
  const { errors } = check(({ find }) => {
    lead(find('paths', 'python-for-beginners')).sections[0].steps.push('nowhere-section');
    lead(find('paths', 'the-command-line')).sections = [{ title: { de: 'A', en: 'A' }, steps: ['command-line'] }];
  });
  assert.deepEqual(errors.sort(), [
    'paths/python-for-beginners steps: unknown item "nowhere-section"',
    'paths/the-command-line: needs either steps or sections, not both',
  ]);
});

test('a section of a path needs a title in both languages', () => {
  const { errors } = check(({ find }) => {
    lead(find('paths', 'python-for-beginners')).sections.push({ title: { de: 'Teil 2' }, steps: ['python-functions'] });
  });
  assert.deepEqual(errors, ['paths/python-for-beginners/de.md: sections: title: expected { de: …, en: … }']);
});

test('course sections have no release dates', () => {
  const { errors } = check(({ find }) => (lead(find('courses', 'digitalisation-and-programming')).sections.push({ title: { de: 'A', en: 'A' }, items: ['command-line'], available_from: new Date('2026-11-16') })));
  assert.deepEqual(errors, ['courses/digitalisation-and-programming/de.md: sections: unknown field available_from (allowed: title, items, or path or project alone)']);
});

test('a course section can be a learning path, which must exist', () => {
  const { errors } = check(({ find }) => (lead(find('courses', 'digitalisation-and-programming')).sections[0].path = 'python-for-nobody'));
  assert.deepEqual(errors, ['courses/digitalisation-and-programming sections[1]: unknown path "python-for-nobody"']);
});

test('a course section can be a project, which must exist', () => {
  const { errors } = check(({ find }) => (lead(find('courses', 'digitalisation-and-programming')).sections[2].project = 'lifi-nowhere'));
  assert.deepEqual(errors, ['courses/digitalisation-and-programming sections[3]: unknown project "lifi-nowhere"']);
});

test('a course names a known institution, and its logo must exist', () => {
  const unknown = check(({ find }) => (lead(find('courses', 'digitalisation-and-programming')).institution = 'uni-nowhere'));
  assert.match(unknown.errors[0], /^courses\/digitalisation-and-programming\/de\.md: institution: "uni-nowhere" is not a known institution/);
  const noLogo = check(({ vocabulary }) => (vocabulary.institutions['hs-osnabrueck'].logo = 'missing.svg'));
  assert.deepEqual(noLogo.errors, ['vocabulary.yaml: institution hs-osnabrueck: logo missing.svg is not in knowledge/media/']);
});

test('a course belongs to one module or several, and a module description is a full URL', () => {
  assert.deepEqual(check(({ find }) => (lead(find('courses', 'exploratory-data-analysis')).module = ['ea', 'wmg'])).errors, []);
  const unknown = check(({ find }) => (lead(find('courses', 'exploratory-data-analysis')).module = ['ea', 'xyz']));
  assert.match(unknown.errors[0], /^courses\/exploratory-data-analysis\/de\.md: module: "xyz" is not a known module/);
  const empty = check(({ find }) => (lead(find('courses', 'exploratory-data-analysis')).module = []));
  assert.match(empty.errors[0], /module: expected at least 1 entry/);
  const badUrl = check(({ vocabulary }) => (vocabulary.modules.ea.handbook = '44m0123'));
  assert.deepEqual(badUrl.errors, ['vocabulary.yaml: module ea: handbook is not a full URL']);
});

test('areas: an item names known areas, and every area has one start page', () => {
  const unknown = check(({ find }) => (lead(find('content', 'command-line-navigating')).areas = ['xs']));
  assert.match(unknown.errors[0], /^content\/command-line-navigating\/de\.md: areas: "xs" is not a known area/);
  const homeless = check(({ find }) => delete lead(find('pages', 'home-ds')).area);
  assert.deepEqual(homeless.errors, ['pages: area ds needs exactly one start page (a page with area: ds), found 0']);
});

test('a course may have a subtitle and, while it is being written, no sections', () => {
  const { errors } = check(({ find }) => {
    const eda = find('courses', 'exploratory-data-analysis');
    eda.files.en.data.subtitle = 'Part of a module';
    lead(eda).sections = [];
  });
  assert.deepEqual(errors, []);
});

test('the scenario of a folder tree and command line is checked', () => {
  const { errors } = check(({ find }) => {
    const body = find('content', 'command-line-demo').files.de;
    body.body = body.body.replace('tree:\n', 'start: Fotos\ntree:\n');
  });
  assert.deepEqual(errors, ['content/command-line-demo/de.md: shell-demo: start: Fotos is not a folder of the tree']);
});
