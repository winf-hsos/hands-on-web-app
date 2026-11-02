// Drafts (`status: draft`) are not on the published site (Nicolas,
// 2026-10-30). The build writes the site twice: once from withoutDrafts(),
// which is what everybody sees, and once in full under /drafts/, which
// `?drafts` on any address leads to.

/** Where the full site with drafts lives. */
export const DRAFTS_BASE = '/drafts';

const isDraft = (doc) => doc.lead?.status === 'draft';

/**
 * The knowledge base without drafts and without anything that points to one:
 * steps, course sections, relations, requirements, project items and the
 * featured path and samples of a start page. `hidden` keeps the drafts, so
 * that a [[link]] to one can still show its text.
 */
export function withoutDrafts(knowledge) {
  const all = Object.values(knowledge.sections).flat();
  const hidden = new Map(all.filter(isDraft).map((d) => [d.id, d]));
  const keep = (id) => !hidden.has(id);
  const steps = (list) => list.filter((s) => keep(typeof s === 'string' ? s : s.item));
  const items = (part) => (part.items ? { ...part, items: part.items.filter(keep) } : part);

  function prune(lead) {
    const l = { ...lead };
    if (l.relations) {
      l.relations = Object.fromEntries(
        Object.entries(l.relations)
          .map(([relation, ids]) => [relation, ids.filter(keep)])
          .filter(([, ids]) => ids.length),
      );
    }
    if (l.requires) l.requires = l.requires.filter(keep);
    if (Array.isArray(l.steps)) l.steps = steps(l.steps);
    if (l.kind === 'path' && Array.isArray(l.sections)) {
      l.sections = l.sections.map((s) => ({ ...s, steps: steps(s.steps) })).filter((s) => s.steps.length);
    }
    if (l.kind === 'course') {
      l.sections = (l.sections ?? [])
        .filter((s) => (!s.path || keep(s.path)) && (!s.project || keep(s.project)))
        .map((s) => (s.path || s.project ? s : { ...s, items: steps(s.items) }))
        .filter((s) => s.path || s.project || s.items.length);
    }
    if (l.kind !== 'course' && l.items) l.items = l.items.filter(keep);
    if (l.phases) {
      l.phases = l.phases.map(({ challenge, ...p }) => ({
        ...items(p),
        ...(challenge && keep(challenge) && { challenge }),
        ...(p.challenges && { challenges: p.challenges.map(items) }),
      }));
    }
    if (l.featured_path && !keep(l.featured_path)) delete l.featured_path;
    if (l.samples) l.samples = l.samples.filter(keep);
    return l;
  }

  const sections = Object.fromEntries(
    Object.entries(knowledge.sections).map(([name, docs]) => [name, docs.filter((d) => !isDraft(d)).map((d) => ({ ...d, lead: prune(d.lead) }))]),
  );
  return { ...knowledge, sections, hidden };
}
