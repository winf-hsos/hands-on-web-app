// The published site leaves out drafts and everything that points to them.
// Usage: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withoutDrafts } from '../src/build/drafts.mjs';

const doc = (section, id, lead) => ({ section, id, lead: { status: 'published', ...lead }, files: {} });

test('drafts and references to them are gone, the rest stays', () => {
  const knowledge = {
    vocabulary: {},
    sections: {
      content: [doc('content', 'a', {}), doc('content', 'b', { status: 'draft' }), doc('content', 'c', { relations: { builds_on: ['a', 'b'], see_also: ['b'] } })],
      paths: [
        doc('paths', 'p', { kind: 'path', requires: ['q'], sections: [{ title: {}, steps: ['a', { item: 'b', optional: true }] }, { title: {}, steps: ['b'] }] }),
        doc('paths', 'q', { kind: 'path', status: 'draft', steps: ['a'] }),
      ],
      courses: [doc('courses', 'k', { kind: 'course', sections: [{ path: 'q' }, { path: 'p' }, { title: {}, items: ['b'] }] })],
      projects: [doc('projects', 'x', { kind: 'project', items: ['a', 'b'], phases: [{ id: 'one', items: ['b'], challenges: [{ id: 'c1', items: ['a', 'b'] }] }] })],
      pages: [{ section: 'pages', id: 'home', lead: { kind: 'page', featured_path: 'q', samples: ['a', 'b'] }, files: {} }],
    },
  };
  const { sections, hidden } = withoutDrafts(knowledge);
  assert.deepEqual(sections.content.map((d) => d.id), ['a', 'c']);
  assert.deepEqual(sections.content[1].lead.relations, { builds_on: ['a'] });
  assert.deepEqual(sections.paths.map((d) => d.id), ['p']);
  assert.deepEqual(sections.paths[0].lead.requires, []);
  assert.deepEqual(sections.paths[0].lead.sections.map((s) => s.steps), [['a']]);
  assert.deepEqual(sections.courses[0].lead.sections, [{ path: 'p' }]);
  assert.deepEqual(sections.projects[0].lead.items, ['a']);
  assert.deepEqual(sections.projects[0].lead.phases, [{ id: 'one', items: [], challenges: [{ id: 'c1', items: ['a'] }] }]);
  assert.equal(sections.pages[0].lead.featured_path, undefined);
  assert.deepEqual(sections.pages[0].lead.samples, ['a']);
  assert.deepEqual([...hidden.keys()], ['b', 'q']);
  // the knowledge base itself is not changed
  assert.deepEqual(knowledge.sections.paths[0].lead.requires, ['q']);
});
