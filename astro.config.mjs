import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import { remarkKnowledge } from './src/markdown/remark-knowledge.mjs';

export default defineConfig({
  // Placeholder until the address is decided (TODO.md).
  site: 'https://hands-on-computer-science.de',
  trailingSlash: 'always',
  markdown: {
    // The remark pipeline, because the knowledge conventions are remark plugins.
    processor: unified({ remarkPlugins: [remarkKnowledge] }),
  },
});
