// The frame around every page.
import { html, raw } from '../build/html.mjs';
import { t, runnerLabels } from '../build/i18n.mjs';
import { url } from '../build/site.mjs';
import { icons, mark } from './parts.mjs';

export function layout({ lang, path, title, description, current, content, scripts = [], asset, pyodide, total = 0 }) {
  const other = lang === 'de' ? 'en' : 'de';
  const otherPath = path.replace(/^\/(de|en)\//, `/${other}/`);
  const nav = [
    ['items', t(lang, 'nav_items')],
    ['paths', t(lang, 'nav_paths')],
    ['projects', t(lang, 'nav_projects')],
    ['map', t(lang, 'nav_map')],
  ];
  const full = title === 'Hands-on Computer Science' ? title : `${title} – Hands-on Computer Science`;
  return html`<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${full}</title>
  ${description && html`<meta name="description" content="${description}">`}
  <link rel="alternate" hreflang="${other}" href="${otherPath}">
  <link rel="icon" href="${asset('favicon.svg')}" type="image/svg+xml">
  <link rel="preload" href="${asset('fonts/sans.woff2')}" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${asset('site.css')}">
  <script>try{const d=document.documentElement.dataset,m=localStorage.getItem('hocs-theme'),v=localStorage.getItem('hocs-view');if(m)d.theme=m;if(v)d.view=v}catch{}</script>
  <script type="importmap">${raw(JSON.stringify({ imports: { minisearch: asset('vendor/minisearch.js'), 'qrcode-generator': asset('vendor/qrcode.mjs') } }))}</script>
</head>
<body data-lang="${lang}" data-index="${url(lang)}index.json" data-total="${total}"${scripts.includes('runner') && html` data-python-worker="${asset('client/python-worker.js')}" data-pyodide="${pyodide}" data-runner-labels="${JSON.stringify(runnerLabels[lang])}"`}>
  <a class="skip" href="#main">${t(lang, 'skip')}</a>
  <header class="bar">
    <a class="wordmark" href="${url(lang)}">${mark}<span>Hands-on Computer Science</span></a>
    <nav class="nav" aria-label="${t(lang, 'nav_items')}">
      ${nav.map(([key, label]) => html`<a href="${url(lang, key)}" ${current === key && raw('aria-current="page"')}>${label}</a>`)}
    </nav>
    <div class="tools">
      <button class="tool search-open" type="button" aria-haspopup="dialog">
        ${icons.search}<span class="tool-label">${t(lang, 'search')}</span><kbd>/</kbd>
      </button>
      <a class="tool learning-link" href="${url(lang, 'learning')}" ${current === 'learning' && raw('aria-current="page"')}>
        <span class="ring" aria-hidden="true"></span><span class="tool-label">${t(lang, 'nav_learning')}</span>
      </a>
      <a class="tool lang" href="${otherPath}" hreflang="${other}" lang="${other}" title="${t(lang, 'other_language')}">${other.toUpperCase()}</a>
      <button class="tool theme" type="button" title="${t(lang, 'theme')}" aria-label="${t(lang, 'theme')}">${icons.theme}</button>
    </div>
  </header>
  <main id="main">${content}</main>
  <dialog class="search" aria-label="${t(lang, 'search')}">
    <form method="dialog" class="search-form" role="search">
      ${icons.search}
      <input type="search" name="q" placeholder="${t(lang, 'search_placeholder')}" autocomplete="off" spellcheck="false" aria-label="${t(lang, 'search')}">
      <button class="tool" value="close" aria-label="${t(lang, 'search_close')}">${icons.close}</button>
    </form>
    <ol class="search-results" role="listbox"></ol>
    <p class="search-hint">${t(lang, 'search_hint')}</p>
  </dialog>
  <script type="module" src="${asset('client/site.js')}"></script>
  ${scripts.map((name) => html`<script type="module" src="${asset(`client/${name}.js`)}"></script>`)}
</body>
</html>
`;
}
