// Reads the knowledge base from disk: every folder of every section with its
// de.md and en.md, split into front matter and body. Nothing is checked here
// except that the files can be parsed; validate.mjs does the rest.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import yaml from 'js-yaml';

export const LANGS = ['de', 'en'];
export const SECTIONS = ['content', 'paths', 'courses', 'projects', 'pages'];

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

export function loadKnowledge(root) {
  const problems = [];
  const rel = (file) => relative(root, file).replace(/\\/g, '/');

  let vocabulary = {};
  try {
    vocabulary = yaml.load(readFileSync(join(root, 'vocabulary.yaml'), 'utf8')) ?? {};
  } catch (error) {
    problems.push(`vocabulary.yaml: ${error.message}`);
  }

  const sections = {};
  for (const section of SECTIONS) {
    sections[section] = [];
    const dir = join(root, section);
    if (!existsSync(dir)) continue;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const doc = { section, id: entry.name, dir: join(dir, entry.name), files: {} };
      for (const lang of LANGS) {
        const file = join(dir, entry.name, `${lang}.md`);
        if (!existsSync(file)) continue;
        const text = readFileSync(file, 'utf8').replace(/^﻿/, '');
        const match = text.match(FRONT_MATTER);
        if (!match) {
          problems.push(`${rel(file)}: no front matter between --- lines`);
          continue;
        }
        try {
          const data = yaml.load(match[1]) ?? {};
          doc.files[lang] = { lang, data, body: match[2], path: rel(file) };
        } catch (error) {
          problems.push(`${rel(file)}: front matter is not valid YAML (${error.reason ?? error.message})`);
        }
      }
      sections[section].push(doc);
    }
    sections[section].sort((a, b) => a.id.localeCompare(b.id));
  }
  return { vocabulary, sections, problems };
}
