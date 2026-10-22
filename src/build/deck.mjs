// Where a slides item keeps its stagekit deck. The deck is the one HTML file
// in slides/: decks made since 2026-09-24 are named after their title
// (cutting-the-lifi-project.html), as stagekit requires; a deck still called
// index.html works, but its PDF would download as index.pdf. The PDF
// comes from stagekit's export, export/<deck>.pdf, or, for decks taken over
// before that, slides.pdf.
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/** The deck's HTML file name, or an error message. */
export function deckFile(itemDir) {
  const dir = join(itemDir, 'slides');
  if (!existsSync(dir)) return { error: 'missing; a slides item keeps its stagekit deck in slides/' };
  const html = readdirSync(dir).filter((f) => f.endsWith('.html'));
  if (html.length === 1) return { file: html[0] };
  if (!html.length) return { error: 'has no deck (an .html file)' };
  return { error: `has ${html.length} .html files; a deck folder holds exactly one` };
}

/** The deck's PDF as a path inside slides/, if there is one. */
export function deckPdf(itemDir, file) {
  const name = file.replace(/\.html$/, '');
  for (const candidate of [`export/${name}.pdf`, 'slides.pdf']) {
    if (existsSync(join(itemDir, 'slides', candidate))) return candidate;
  }
  return null;
}

/**
 * Files of a deck folder that stay in the knowledge base but never go on the
 * site: the script (skript.md, the text a learning assistant reads), drafts
 * and other Markdown, the generator's original photos, and the export's frames.
 */
export const isUnpublished = (relative) =>
  /\.md$/i.test(relative) ||
  /^img[\\/]original([\\/]|$)/.test(relative) ||
  (/^export[\\/]/.test(relative) && !relative.endsWith('.pdf'));
