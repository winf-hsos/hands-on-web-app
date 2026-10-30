// The frame around every page.
import { html, raw } from '../build/html.mjs';
import { t, runnerLabels, backLabels, demoLabels, copyLabels, montyHallLabels } from '../build/i18n.mjs';
import { icons, mark } from './parts.mjs';
import { plainText } from '../client/code-terms.js';

export function layout({ site, lang, path, title, description, current, content, back, scripts = [], asset, pyodide, webr, total = 0, entrances = [] }) {
  const other = lang === 'de' ? 'en' : 'de';
  const otherPath = path.replace(/^\/([a-z]+)\/(de|en)\//, `/$1/${other}/`);
  const { areas } = site.vocabulary;
  const name = areas[site.area][lang];
  const link = site.link;
  const nav = [
    ['items', t(lang, 'nav_items')],
    ['paths', t(lang, 'nav_paths')],
    ['courses', t(lang, 'nav_courses')],
    ['projects', t(lang, 'nav_projects')],
    ['map', t(lang, 'nav_map')],
  ];
  // the tab title and the description take no markup, so backticks go
  const full = plainText(title === name ? title : `${title} – ${name}`);
  return html`<!doctype html>
<html lang="${lang}" data-area="${site.area}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${full}</title>
  ${description && html`<meta name="description" content="${plainText(description)}">`}
  <link rel="alternate" hreflang="${other}" href="${otherPath}">
  <link rel="icon" href="${asset('favicon.svg')}" type="image/svg+xml">
  <link rel="preload" href="${asset('fonts/sans.woff2')}" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${asset('site.css')}">
  <script>try{const d=document.documentElement.dataset,m=localStorage.getItem('hocs-theme'),u=new URLSearchParams(location.search).get('view'),v=['list','cards'].includes(u)?u:localStorage.getItem('hocs-view');if(m)d.theme=m;if(v)d.view=v}catch{}</script>
  <script type="importmap">${raw(JSON.stringify({ imports: { minisearch: asset('vendor/minisearch.js'), 'qrcode-generator': asset('vendor/qrcode.mjs') } }))}</script>
</head>
<body data-lang="${lang}" data-index="${link(lang)}index.json" data-total="${total}" data-marked-done="${t(lang, 'marked_done')}" data-mark-undone="${t(lang, 'mark_undone')}"${scripts.includes('runner') && html` data-python-worker="${asset('client/python-worker.js')}" data-pyodide="${pyodide}" data-webr="${webr?.base}" data-webr-repo="${webr?.repo}" data-r-completions="${asset('r-completions.json')}" data-datasets="/media/datasets/" data-runner-labels="${JSON.stringify(runnerLabels[lang])}"`}${scripts.includes('verb-demo') && html` data-datasets="/media/datasets/" data-verb-demo-labels="${JSON.stringify(demoLabels[lang])}"`}${scripts.includes('monty-hall') && html` data-monty-hall-labels="${JSON.stringify(montyHallLabels[lang])}"`}${(String(content).includes('<pre') || scripts.includes('monty-hall')) && html` data-copy-labels="${JSON.stringify(copyLabels[lang])}"`}>
  <a class="skip" href="#main">${t(lang, 'skip')}</a>
  <header class="bar">
    <details class="area-menu">
      <summary class="wordmark" title="${t(lang, 'switch_area')}">${mark}<span>${name}</span>${icons.chevron}</summary>
      <div class="area-menu-panel">
        ${entrances
          .filter((e) => e.key !== site.area)
          .map(
            (e) => html`<a class="area-option" href="/${e.key}/${lang}/" data-area="${e.key}">
              <span class="area-option-name"><span class="area-dot" aria-hidden="true"></span>${e.name}</span>
              <span class="area-option-text">${e.summary}</span>
            </a>`,
          )}
        <a class="area-home" href="${link(lang)}">${t(lang, 'area_home')}: ${name}</a>
      </div>
    </details>
    <nav class="nav" aria-label="${t(lang, 'nav_items')}">
      ${nav.map(([key, label]) => html`<a href="${link(lang, key)}" ${current === key && raw('aria-current="page"')}>${label}</a>`)}
    </nav>
    <div class="tools">
      <button class="tool search-open" type="button" aria-haspopup="dialog">
        ${icons.search}<span class="tool-label">${t(lang, 'search')}</span><kbd>/</kbd>
      </button>
      <a class="tool learning-link" href="${link(lang, 'learning')}" ${current === 'learning' && raw('aria-current="page"')}>
        <span class="ring" aria-hidden="true"></span><span class="tool-label">${t(lang, 'nav_learning')}</span>
      </a>
      <a class="tool lang" href="${otherPath}" hreflang="${other}" lang="${other}" title="${t(lang, 'other_language')}">${other.toUpperCase()}</a>
      <button class="tool theme" type="button" title="${t(lang, 'theme')}" aria-label="${t(lang, 'theme')}">${icons.theme}</button>
    </div>
  </header>
  <main id="main">${back && backLink(link, lang, back)}${content}</main>
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

/**
 * "Back to …": `back` names where to go without better knowledge (a key of
 * backLabels); client/site.js replaces it with the page the learner came from.
 */
const backLink = (link, lang, back) =>
  html`<p class="back"><a class="back-link" href="${link(lang, back === 'home' ? '' : back)}" data-back="${JSON.stringify(backLabels[lang])}"><span aria-hidden="true">←</span> <span class="back-label">${backLabels[lang][back]}</span></a></p>`;

/**
 * The entrance at /de/ and /en/: one card per area, each in its own accent
 * colour, with the summary of its start page.
 */
export function chooser({ lang, areas, asset }) {
  const other = lang === 'de' ? 'en' : 'de';
  return html`<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hands-on · ${t(lang, 'choose_area')}</title>
  <link rel="icon" href="${asset('favicon.svg')}" type="image/svg+xml">
  <link rel="stylesheet" href="${asset('site.css')}">
  <script>try{const m=localStorage.getItem('hocs-theme');if(m)document.documentElement.dataset.theme=m}catch{}</script>
</head>
<body>
  <main id="main" class="chooser">
    <p class="chooser-lang"><a class="tool lang" href="/${other}/" hreflang="${other}" lang="${other}">${other.toUpperCase()}</a></p>
    <h1 class="chooser-title">${mark}<span>${t(lang, 'choose_area')}</span></h1>
    <ul class="chooser-areas">
      ${areas.map(
        (a) => html`<li><a class="area-card" href="/${a.key}/${lang}/" data-area="${a.key}">
          <span class="area-name">${a.name}</span>
          <span class="area-summary">${a.summary}</span>
          <span class="area-go" aria-hidden="true">→</span>
        </a></li>`,
      )}
    </ul>
  </main>
</body>
</html>
`;
}
