// The frame around every page.
import { html, raw } from '../build/html.mjs';
import { t, runnerLabels, demoLabels, copyLabels, montyHallLabels, byteSwitchboardLabels, photoDigitiserLabels, audioDigitiserLabels, questionGameLabels, prefixTrapLabels, hexViewerLabels, noisySensorLabels, distinguishabilityLabLabels, nextWordLabels, wordGuessLabels, meaningMapLabels, wordArithmeticLabels, dataTableLabels, shellDemoLabels, demoFrameLabels, focusLabels, figureLabels, modelLabels } from '../build/i18n.mjs';
import { icons, mark } from './parts.mjs';
import { plainText } from '../client/code-terms.js';
import { DRAFTS_BASE } from '../build/drafts.mjs';

// `?drafts` on a page of the published site leads to the same page on the
// site with drafts (build/drafts.mjs); that site is not for search engines.
const draftsSwitch = (drafts) =>
  drafts
    ? raw('<meta name="robots" content="noindex">')
    : raw(`<script>if(new URLSearchParams(location.search).has('drafts'))location.replace('${DRAFTS_BASE}'+location.pathname+location.search+location.hash)</script>`);

/** The search dialog behind the search button and `/` (client/site.js). */
const searchDialog = (lang) => html`<dialog class="search" aria-label="${t(lang, 'search')}">
    <form method="dialog" class="search-form" role="search">
      ${icons.search}
      <input type="search" name="q" placeholder="${t(lang, 'search_placeholder')}" autocomplete="off" spellcheck="false" aria-label="${t(lang, 'search')}">
      <button class="tool" value="close" aria-label="${t(lang, 'search_close')}">${icons.close}</button>
    </form>
    <ol class="search-results" role="listbox"></ol>
    <p class="search-hint">${t(lang, 'search_hint')}</p>
  </dialog>`;

/** The licence of the content under every page (Nicolas, 2026-10-23). */
const footer = (lang) => html`<footer class="site-foot">
    <p>${t(lang, 'foot_by')} <a rel="license" href="https://creativecommons.org/licenses/by/4.0/deed.${lang}">CC BY 4.0</a>${t(lang, 'foot_rest')}</p>
  </footer>`;

export function layout({ site, lang, path, title, description, current, content, scripts = [], figures, asset, pyodide, webr, embedder, total = 0, entrances = [] }) {
  const other = lang === 'de' ? 'en' : 'de';
  const otherPath = path.replace(/\/(de|en)\//, `/${other}/`);
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
  ${draftsSwitch(site.drafts)}
  <title>${full}</title>
  ${description && html`<meta name="description" content="${plainText(description)}">`}
  <link rel="alternate" hreflang="${other}" href="${otherPath}">
  <link rel="icon" href="${asset(['ai', 'ds'].includes(site.area) ? `favicon-${site.area}.svg` : 'favicon.svg')}" type="image/svg+xml">
  <link rel="preload" href="${asset('fonts/sans.woff2')}" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${asset('site.css')}">
  <script>try{const d=document.documentElement.dataset,m=localStorage.getItem('hocs-theme'),u=new URLSearchParams(location.search).get('view'),v=['list','cards'].includes(u)?u:localStorage.getItem('hocs-view');if(m)d.theme=m;if(v)d.view=v}catch{}</script>
  <script type="importmap">${raw(JSON.stringify({ imports: { minisearch: asset('vendor/minisearch.js'), 'qrcode-generator': asset('vendor/qrcode.mjs') } }))}</script>
</head>
<body data-lang="${lang}" data-index="${link(lang)}index.json" data-total="${total}" data-label-mark-done="${t(lang, 'mark_done')}" data-marked-done="${t(lang, 'marked_done')}" data-mark-undone="${t(lang, 'mark_undone')}"${scripts.includes('runner') && html` data-python-worker="${asset('client/python-worker.js')}" data-pyodide="${pyodide}" data-webr="${webr?.base}" data-webr-repo="${webr?.repo}" data-r-completions="${asset('r-completions.json')}" data-datasets="/media/datasets/" data-runner-labels="${JSON.stringify(runnerLabels[lang])}"`}${scripts.includes('verb-demo') && html` data-datasets="/media/datasets/" data-verb-demo-labels="${JSON.stringify(demoLabels[lang])}"`}${scripts.includes('monty-hall') && html` data-monty-hall-labels="${JSON.stringify(montyHallLabels[lang])}"`}${scripts.includes('byte-switchboard') && html` data-byte-switchboard-labels="${JSON.stringify(byteSwitchboardLabels[lang])}"`}${scripts.includes('photo-digitiser') && html` data-photo-digitiser-labels="${JSON.stringify(photoDigitiserLabels[lang])}"`}${scripts.includes('audio-digitiser') && html` data-audio-digitiser-labels="${JSON.stringify(audioDigitiserLabels[lang])}"`}${scripts.includes('question-game') && html` data-question-game-labels="${JSON.stringify(questionGameLabels[lang])}"`}${scripts.includes('prefix-trap') && html` data-prefix-trap-labels="${JSON.stringify(prefixTrapLabels[lang])}"`}${scripts.includes('hex-viewer') && html` data-hex-viewer-labels="${JSON.stringify(hexViewerLabels[lang])}"`}${scripts.includes('noisy-sensor') && html` data-noisy-sensor-labels="${JSON.stringify(noisySensorLabels[lang])}"`}${scripts.includes('distinguishability-lab') && html` data-distinguishability-lab-labels="${JSON.stringify(distinguishabilityLabLabels[lang])}"`}${scripts.includes('next-word') && html` data-datasets="/media/datasets/" data-next-word-labels="${JSON.stringify(nextWordLabels[lang])}"`}${scripts.includes('word-guess') && html` data-datasets="/media/datasets/" data-word-guess-labels="${JSON.stringify(wordGuessLabels[lang])}"`}${(scripts.includes('meaning-map') || scripts.includes('word-arithmetic')) && html` data-embedder="${embedder?.base}" data-models="${embedder?.models}"`}${scripts.includes('meaning-map') && html` data-meaning-map-labels="${JSON.stringify(meaningMapLabels[lang])}"`}${scripts.includes('word-arithmetic') && html` data-word-arithmetic-labels="${JSON.stringify(wordArithmeticLabels[lang])}"`}${scripts.includes('data-table') && html` data-data-table-labels="${JSON.stringify(dataTableLabels[lang])}"`}${scripts.includes('shell-demo') && html` data-shell-demo-labels="${JSON.stringify(shellDemoLabels[lang])}"`}${figures && html` data-figure-labels="${JSON.stringify(figureLabels[lang])}"`}${scripts.includes('model') && html` data-model-labels="${JSON.stringify(modelLabels[lang])}"`}${['runner', 'tables', 'quiz'].some((s) => scripts.includes(s)) && html` data-focus-labels="${JSON.stringify(focusLabels[lang])}"`}${String(content).includes('data-demo=') && html` data-demo-frame-labels="${JSON.stringify(demoFrameLabels[lang])}"`}${(String(content).includes('<pre') || scripts.includes('monty-hall') || scripts.includes('data-table')) && html` data-copy-labels="${JSON.stringify(copyLabels[lang])}"`}>
  <a class="skip" href="#main">${t(lang, 'skip')}</a>
  ${site.drafts && html`<p class="drafts-banner">${t(lang, 'drafts_view')} <a href="/${site.area}/${lang}/">${t(lang, 'drafts_leave')}</a></p>`}
  <header class="bar">
    <details class="area-menu">
      <summary class="wordmark" title="${t(lang, 'switch_area')}">${mark}<span>${name}</span>${icons.chevron}</summary>
      <div class="area-menu-panel">
        ${entrances
          .filter((e) => e.key !== site.area)
          .map(
            (e) => html`<a class="area-option" href="${site.base}/${e.key}/${lang}/" data-area="${e.key}">
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
  <main id="main">${content}</main>
  ${footer(lang)}
  ${searchDialog(lang)}
  ${figures && html`<script defer src="${asset('stagekit/draw.js')}"></script>
  <script defer src="${asset('stagekit/anim.js')}"></script>
  <script defer src="${asset('client/figure-parts.js')}"></script>
  <script defer src="${figures}"></script>`}
  <script type="module" src="${asset('client/site.js')}"></script>
  ${scripts.map((name) => html`<script type="module" src="${asset(`client/${name}.js`)}"></script>`)}
</body>
</html>
`;
}

/**
 * The entrance at /de/ and /en/: one card per area, each in its own accent
 * colour, with the summary of its start page; below them the content of all
 * areas, searchable and filtered as on the pages of an area (`finder`).
 */
export function chooser({ lang, areas, asset, base = '', finder }) {
  const other = lang === 'de' ? 'en' : 'de';
  return html`<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${draftsSwitch(base !== '')}
  <title>Hands-on · ${t(lang, 'choose_area')}</title>
  <link rel="icon" href="${asset('favicon.svg')}" type="image/svg+xml">
  <link rel="stylesheet" href="${asset('site.css')}">
  <script>try{const d=document.documentElement.dataset,m=localStorage.getItem('hocs-theme'),u=new URLSearchParams(location.search).get('view'),v=['list','cards'].includes(u)?u:localStorage.getItem('hocs-view');if(m)d.theme=m;if(v)d.view=v}catch{}</script>
  <script type="importmap">${raw(JSON.stringify({ imports: { minisearch: asset('vendor/minisearch.js'), 'qrcode-generator': asset('vendor/qrcode.mjs') } }))}</script>
</head>
<body data-lang="${lang}" data-index="${base}/${lang}/index.json" data-label-mark-done="${t(lang, 'mark_done')}" data-marked-done="${t(lang, 'marked_done')}" data-mark-undone="${t(lang, 'mark_undone')}">
  ${base !== '' && html`<p class="drafts-banner">${t(lang, 'drafts_view')} <a href="/${lang}/">${t(lang, 'drafts_leave')}</a></p>`}
  <main id="main" class="chooser">
    <p class="chooser-tools">
      <button class="tool search-open" type="button" aria-haspopup="dialog">
        ${icons.search}<span class="tool-label">${t(lang, 'search')}</span><kbd>/</kbd>
      </button>
      <a class="tool lang" href="${base}/${other}/" hreflang="${other}" lang="${other}">${other.toUpperCase()}</a>
      <button class="tool theme" type="button" title="${t(lang, 'theme')}" aria-label="${t(lang, 'theme')}">${icons.theme}</button>
    </p>
    <h1 class="chooser-title">${mark}<span>${t(lang, 'choose_area')}</span></h1>
    <ul class="chooser-areas">
      ${areas.map(
        (a) => html`<li><a class="area-card" href="${base}/${a.key}/${lang}/" data-area="${a.key}">
          <span class="area-name">${a.name}</span>
          <span class="area-summary">${a.summary}</span>
          <span class="area-go" aria-hidden="true">→</span>
        </a></li>`,
      )}
    </ul>
    ${finder && html`<section class="chooser-items">
      <h2>${t(lang, 'all_items')}</h2>
      ${finder}
    </section>`}
  </main>
  ${footer(lang)}
  ${searchDialog(lang)}
  <script type="module" src="${asset('client/site.js')}"></script>
  ${finder && html`<script type="module" src="${asset('client/list.js')}"></script>`}
</body>
</html>
`;
}
