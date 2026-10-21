// Markdown to HTML with the knowledge conventions. Raw HTML in the source is
// dropped on purpose: nothing on the site comes from anywhere but Markdown.
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { remarkKnowledge } from './remark-knowledge.mjs';

export function renderMarkdown(body, options) {
  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkKnowledge, options)
    .use(remarkRehype)
    .use(rehypeStringify)
    .processSync(body);
  return String(file);
}
