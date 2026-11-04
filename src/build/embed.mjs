// Material embedded in a lesson (Konzept.md, "Lektionen und Material",
// Nicolas, 2026-11-04). A lesson names its material where its text talks
// about it, with a line of its own:
//
//   ![Fragespiel](item:question-game)
//
// The text in brackets is only for the reader of the Markdown file; the page
// shows the material as its type wants (templates/pages.mjs). These lines are
// the one place that says which material a lesson holds: the material's page
// names its lessons from them, and a lesson's row in a list names its
// material.

const EMBED = /^!\[([^\]\n]*)\]\(item:([a-z0-9-]+)\)[ \t]*$/;
const FENCE = /^ {0,3}(`{3,}|~{3,})/;

/**
 * The body cut at its embed lines: [{ md, offset }] for text, with the place
 * where it starts in the body, and [{ embed, label }] for material. Lines in
 * fenced code stay text, so that an example of the syntax stays an example.
 */
export function splitEmbeds(body) {
  const parts = [];
  let fence = null;
  let start = 0;
  let offset = 0;
  for (const line of body.split('\n')) {
    const end = offset + line.length + 1;
    const opener = line.match(FENCE)?.[1];
    if (fence) {
      if (opener && opener[0] === fence[0] && opener.length >= fence.length && !line.trim().slice(opener.length)) fence = null;
    } else if (opener) {
      fence = opener;
    } else {
      const match = line.replace(/\r$/, '').match(EMBED);
      if (match) {
        if (offset > start) parts.push({ md: body.slice(start, offset), offset: start });
        parts.push({ embed: match[2], label: match[1] });
        start = Math.min(end, body.length);
      }
    }
    offset = end;
  }
  if (start < body.length) parts.push({ md: body.slice(start), offset: start });
  return parts.filter((p) => p.embed || p.md.trim());
}

/** The ids a body embeds, in order and each once. */
export const embedsIn = (body) => [...new Set(splitEmbeds(body).filter((p) => p.embed).map((p) => p.embed))];
