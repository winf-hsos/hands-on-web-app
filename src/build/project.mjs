// A project's text is one Markdown body. Headings with an id mark its parts:
//
//   ## Phase 1: Light on {#start}          a phase (id listed under phases)
//   ### Challenge 0: First light {#c0}     a challenge of that phase
//   ## What you need                       an ordinary section, no id
//
// splitProject() cuts the body along these headings, so that the page can
// show phases and challenges as their own blocks, each with its linked items.

const HEADING = /^(#{2,3})\s+(.*?)\s*(?:\{#([a-z0-9-]+)\})?\s*$/;

export function splitProject(body) {
  const out = { intro: [], sections: [], phases: [] };
  let target = out.intro;
  let phase = null;
  let fenced = false;
  for (const line of body.split(/\r?\n/)) {
    if (/^(```|~~~)/.test(line)) fenced = !fenced;
    const match = !fenced && line.match(HEADING);
    if (match) {
      const [, hashes, title, id] = match;
      if (hashes === '##' && id) {
        phase = { id, title, md: [], challenges: [] };
        out.phases.push(phase);
        target = phase.md;
        continue;
      }
      if (hashes === '###' && id) {
        const challenge = { id, title, md: [] };
        if (phase) phase.challenges.push(challenge);
        else out.orphans = [...(out.orphans ?? []), id];
        target = challenge.md;
        continue;
      }
      if (hashes === '##') {
        phase = null;
        const section = { title, md: [] };
        out.sections.push(section);
        target = section.md;
        continue;
      }
    }
    target.push(line);
  }
  const join = (lines) => lines.join('\n').trim();
  return {
    intro: join(out.intro),
    sections: out.sections.map((s) => ({ ...s, md: join(s.md) })),
    phases: out.phases.map((p) => ({ ...p, md: join(p.md), challenges: p.challenges.map((c) => ({ ...c, md: join(c.md) })) })),
    orphans: out.orphans ?? [],
  };
}
