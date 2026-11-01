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
  const { errors } = check(({ find }) => delete lead(find('content', 'knock-code')).level);
  assert.deepEqual(errors, ['content/knock-code/de.md: level is missing']);
});

test('an unknown type lists the known ones', () => {
  const { errors } = check(({ find }) => (lead(find('content', 'knock-code')).type = 'experimnt'));
  assert.match(errors[0], /type: "experimnt" is not a known type \(lesson, /);
});

test('an unknown field is an error, so typos in field names do not go unnoticed', () => {
  const { errors } = check(({ find }) => (lead(find('content', 'knock-code')).duratoin = 5));
  assert.deepEqual(errors, ['content/knock-code/de.md: unknown field duratoin']);
});

test('codes are unique', () => {
  const { errors } = check(({ find }) => (lead(find('content', 'knock-code')).code = 4821));
  assert.deepEqual(errors, ['content/knock-code: code 4821 is already used by content/code-as-agreement']);
});

test('relations, path steps, course items and links must point to existing ids', () => {
  const { errors } = check(({ find }) => {
    lead(find('content', 'knock-code')).relations.requires = ['nowhere'];
    lead(find('paths', 'codes-in-one-hour')).steps.push('nowhere-path');
    lead(find('courses', 'dup-2026-27-ws')).sections[1].items.push('nowhere-course');
    find('content', 'knock-code').files.de.body += '\n[[nowhere-link]]\n';
  });
  assert.deepEqual(errors.sort(), [
    'content/knock-code relations.requires: unknown item "nowhere"',
    'content/knock-code/de.md: link to unknown id [[nowhere-link]]',
    'courses/dup-2026-27-ws sections[2]: unknown item "nowhere-course"',
    'paths/codes-in-one-hour steps: unknown item "nowhere-path"',
  ]);
});

test('a cycle in requires is an error', () => {
  const { errors } = check(({ find }) => {
    lead(find('content', 'code-as-agreement')).relations = { requires: ['knock-code'] };
  });
  assert.deepEqual(errors, ['requires has a cycle: code-as-agreement -> knock-code -> code-as-agreement']);
});

test('a quiz question needs a correct answer', () => {
  const { errors } = check(({ find }) => {
    const file = find('content', 'code-systems-quiz').files.de;
    file.body = file.body.replace('- [x] Drei', '- [ ] Drei');
  });
  assert.deepEqual(errors, ['content/code-systems-quiz/de.md: question 2 has no correct answer (- [x] …)']);
});

test('a folder needs exactly one lead file', () => {
  const { errors } = check(({ find }) => delete find('content', 'knock-code').files.en.data.translation_of);
  assert.match(errors[0], /content\/knock-code: expected exactly one lead file/);
});

test('an outdated translation is a warning, not an error', () => {
  const { errors, warnings } = check(({ find }) => (lead(find('content', 'knock-code')).updated = new Date('2027-01-01')));
  assert.deepEqual(errors, []);
  assert.ok(warnings.includes('content/knock-code/en.md: translation is older than its lead file'));
});

test('projects have no topics: an old topics line is a warning, not an error', () => {
  const { errors, warnings } = check(({ find }) => (lead(find('projects', 'lifi')).topics = ['solving-problems']));
  assert.deepEqual(errors, []);
  assert.ok(warnings.includes('projects/lifi/de.md: projects have no topics; remove the line'));
});

test('project phases and challenges must match the headings in every language', () => {
  const { errors } = check(({ find }) => {
    const file = find('projects', 'lifi').files.en;
    file.body = file.body.replace('{#challenge-2}', '{#challenge-two}');
  });
  assert.equal(errors.length, 1);
  assert.match(errors[0], /^projects\/lifi\/en\.md: headings with \{#id\} do not match/);
});

test('items linked in a project must exist', () => {
  const { errors } = check(({ find }) => {
    lead(find('projects', 'lifi')).phases[0].challenges[0].items = ['nowhere'];
  });
  assert.deepEqual(errors, ['projects/lifi challenge-0: unknown item "nowhere"']);
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
    lead(find('content', 'knock-code')).file = 'mds12_schoko_milch.csv';
  });
  assert.deepEqual(errors, [
    'content/knock-code: file: only a dataset has a file',
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
    lead(find('paths', 'codes-in-one-hour')).sections = [{ title: { de: 'A', en: 'A' }, steps: ['knock-code'] }];
  });
  assert.deepEqual(errors.sort(), [
    'paths/codes-in-one-hour: needs either steps or sections, not both',
    'paths/python-for-beginners steps: unknown item "nowhere-section"',
  ]);
});

test('a section of a path needs a title in both languages', () => {
  const { errors } = check(({ find }) => {
    lead(find('paths', 'python-for-beginners')).sections.push({ title: { de: 'Teil 2' }, steps: ['python-functions'] });
  });
  assert.deepEqual(errors, ['paths/python-for-beginners/de.md: sections: title: expected { de: …, en: … }']);
});

test('course sections have no release dates', () => {
  const { errors } = check(({ find }) => (lead(find('courses', 'dup-2026-27-ws')).sections[1].available_from = new Date('2026-11-16')));
  assert.deepEqual(errors, ['courses/dup-2026-27-ws/de.md: sections: unknown field available_from (allowed: title, items, or path alone)']);
});

test('a course section can be a learning path, which must exist', () => {
  const { errors } = check(({ find }) => (lead(find('courses', 'dup-2026-27-ws')).sections[0].path = 'python-for-nobody'));
  assert.deepEqual(errors, ['courses/dup-2026-27-ws sections[1]: unknown path "python-for-nobody"']);
});

test('a course names a known institution, and its logo must exist', () => {
  const unknown = check(({ find }) => (lead(find('courses', 'dup-2026-27-ws')).institution = 'uni-nowhere'));
  assert.match(unknown.errors[0], /^courses\/dup-2026-27-ws\/de\.md: institution: "uni-nowhere" is not a known institution/);
  const noLogo = check(({ vocabulary }) => (vocabulary.institutions['hs-osnabrueck'].logo = 'missing.svg'));
  assert.deepEqual(noLogo.errors, ['vocabulary.yaml: institution hs-osnabrueck: logo missing.svg is not in knowledge/media/']);
});

test('a course belongs to one module or several, and a module description is a full URL', () => {
  assert.deepEqual(check(({ find }) => (lead(find('courses', 'eda-2026-27-ws')).module = ['ea', 'wmg'])).errors, []);
  const unknown = check(({ find }) => (lead(find('courses', 'eda-2026-27-ws')).module = ['ea', 'xyz']));
  assert.match(unknown.errors[0], /^courses\/eda-2026-27-ws\/de\.md: module: "xyz" is not a known module/);
  const empty = check(({ find }) => (lead(find('courses', 'eda-2026-27-ws')).module = []));
  assert.match(empty.errors[0], /module: expected at least 1 entry/);
  const badUrl = check(({ vocabulary }) => (vocabulary.modules.ea.handbook = '44m0123'));
  assert.deepEqual(badUrl.errors, ['vocabulary.yaml: module ea: handbook is not a full URL']);
});

test('areas: an item names known areas, and every area has one start page', () => {
  const unknown = check(({ find }) => (lead(find('content', 'knock-code')).areas = ['xs']));
  assert.match(unknown.errors[0], /^content\/knock-code\/de\.md: areas: "xs" is not a known area/);
  const homeless = check(({ find }) => delete lead(find('pages', 'home-ds')).area);
  assert.deepEqual(homeless.errors, ['pages: area ds needs exactly one start page (a page with area: ds), found 0']);
});

test('a course may have a subtitle and, while it is being written, no sections', () => {
  const { errors } = check(({ find }) => {
    const eda = find('courses', 'eda-2026-27-ws');
    eda.files.en.data.subtitle = 'Part of a module';
    lead(eda).sections = [];
  });
  assert.deepEqual(errors, []);
});
