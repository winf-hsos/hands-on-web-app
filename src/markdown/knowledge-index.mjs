// A light index of the knowledge base for the Markdown plugins, which run
// before Astro's collections are available: for every folder its kind, its
// lead type and its title per language.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';

const ROOT = join(process.cwd(), 'knowledge');
const SECTIONS = { content: 'items', paths: 'paths', courses: 'courses' };

function frontMatter(file) {
  const text = readFileSync(file, 'utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? yaml.load(match[1]) : {};
}

let cache;

/** @returns {Map<string, {section: string, type?: string, titles: Record<string, string>}>} */
export function knowledgeIndex() {
  if (cache) return cache;
  cache = new Map();
  for (const [folder, section] of Object.entries(SECTIONS)) {
    const dir = join(ROOT, folder);
    if (!existsSync(dir)) continue;
    for (const id of readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)) {
      const entry = { section, titles: {} };
      for (const lang of ['de', 'en']) {
        const file = join(dir, id, `${lang}.md`);
        if (!existsSync(file)) continue;
        const data = frontMatter(file);
        entry.titles[lang] = data.title;
        if (data.type) entry.type = data.type;
      }
      cache.set(id, entry);
    }
  }
  return cache;
}

/** Folder id and language of a Markdown file inside the knowledge base. */
export function locate(path) {
  const match = String(path ?? '').replace(/\\/g, '/').match(/knowledge\/[^/]+\/([^/]+)\/(de|en)\.md$/);
  return match ? { id: match[1], lang: match[2] } : null;
}
