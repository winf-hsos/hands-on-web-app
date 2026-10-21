// Prints an unused four-digit short code for a new item, path or course.
// Codes are random so that they imply no order (docs/knowledge-schema.md, §2).
// Usage: npm run new-code [-- <count>]
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..', 'knowledge');
const used = new Set();
for (const section of readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory())) {
  for (const folder of readdirSync(join(root, section.name), { withFileTypes: true }).filter((d) => d.isDirectory())) {
    for (const lang of ['de', 'en']) {
      const file = join(root, section.name, folder.name, `${lang}.md`);
      if (!existsSync(file)) continue;
      const match = readFileSync(file, 'utf8').match(/^code:\s*(\d{4})\s*$/m);
      if (match) used.add(Number(match[1]));
    }
  }
}

const count = Number(process.argv[2] ?? 1);
const fresh = new Set();
while (fresh.size < count) {
  const code = 1000 + Math.floor(Math.random() * 9000);
  if (!used.has(code)) fresh.add(code);
}
console.log([...fresh].join('\n'));
