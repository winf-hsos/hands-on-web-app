// One function per kind of page. Each returns { path, title, … } for the
// layout; the build writes them out. Overview first, details on request:
// what is not needed to choose or to read sits in a disclosure.
import { html, raw, json } from '../build/html.mjs';
import { t, count, formatDate, isoDay } from '../build/i18n.mjs';
import { url } from '../build/site.mjs';
import { itemRow, progressBar, more, facts, icons } from './parts.mjs';

const typeLabel = (site, item, lang) => site.vocabulary.types[item.lead.type][lang];

// --- start page -------------------------------------------------------------

export function home(site, lang) {
  const doc = site.page.get('home');
  const text = site.localize(doc, lang);
  const featured = doc.lead.featured_path ? site.path.get(doc.lead.featured_path) : undefined;
  const samples = (doc.lead.samples ?? []).map((id) => site.item.get(id));
  return {
    path: url(lang),
    title: text.title,
    description: text.summary,
    scripts: ['map'],
    content: html`
      <section class="hero">
        <div class="hero-text">
          <h1 class="hero-title">${text.title}</h1>
          <p class="lead">${text.summary}</p>
          <ul class="ways">
            ${featured &&
            html`<li><a class="way way-main" href="${site.url(featured, lang)}">
              <span class="way-title">${t(lang, 'start_here')}</span>
              <span class="way-text">${site.localize(featured, lang).title}</span></a></li>`}
            <li><a class="way" href="${url(lang, 'items')}">
              <span class="way-title">${t(lang, 'browse')}</span>
              <span class="way-text">${t(lang, 'browse_text')}</span></a></li>
            <li><a class="way" href="${url(lang, 'learning')}#course">
              <span class="way-title">${t(lang, 'course_code')}</span>
              <span class="way-text">${t(lang, 'course_code_text')}</span></a></li>
          </ul>
        </div>
        ${mapFigure(site, lang, 'hero-map')}
      </section>
      ${samples.length > 0 &&
      html`<section class="section">
        <h2>${t(lang, 'samples')}</h2>
        <ul class="rows">${samples.map((item) => itemRow(site, item, lang))}</ul>
      </section>`}
      ${more(t(lang, 'how_it_works'), html`<div class="prose">${raw(site.body(doc, lang))}</div>`)}
    `,
  };
}

// --- content list ------------------------------------------------------------

export function items(site, lang) {
  const { vocabulary } = site;
  const used = (key) => new Set(site.items.flatMap((i) => [i.lead[key]].flat()));
  const types = Object.entries(vocabulary.types).filter(([key]) => used('type').has(key));
  const topics = Object.entries(vocabulary.topics).filter(([key]) => used('topics').has(key));
  const sorted = site.items
    .slice()
    .sort((a, b) => site.localize(a, lang).title.localeCompare(site.localize(b, lang).title, lang));
  const select = (name, label, options) =>
    html`<label class="field"><span>${label}</span><select name="${name}">${options.map(
      ([value, text]) => html`<option value="${value}">${text}</option>`,
    )}</select></label>`;
  return {
    path: url(lang, 'items'),
    title: t(lang, 'nav_items'),
    current: 'items',
    scripts: ['list'],
    content: html`
      <h1>${t(lang, 'nav_items')}</h1>
      <form class="finder" id="finder" data-one="${t(lang, 'results_one')}" data-many="${t(lang, 'results_many')}">
        <div class="finder-search">
          ${icons.search}
          <input type="search" name="q" placeholder="${t(lang, 'search_placeholder')}" autocomplete="off" aria-label="${t(lang, 'search')}">
        </div>
        <fieldset class="chips">
          <legend class="visually-hidden">${t(lang, 'nav_items')}</legend>
          <label class="chip"><input type="radio" name="type" value="" checked><span>${t(lang, 'all')}</span></label>
          ${types.map(([key, label]) => html`<label class="chip"><input type="radio" name="type" value="${key}"><span>${label[lang]}</span></label>`)}
        </fieldset>
        ${more(
          t(lang, 'more_filters'),
          html`<div class="fields">
            ${select('topic', t(lang, 'topics'), [['', t(lang, 'all')], ...topics.map(([k, v]) => [k, v[lang]])])}
            ${select('level', t(lang, 'level'), [['', t(lang, 'all')], ...Object.entries(vocabulary.levels).map(([k, v]) => [k, v[lang]])])}
            ${select('progress', t(lang, 'progress'), [['', t(lang, 'all')], ['open', t(lang, 'open')], ['done', t(lang, 'done')]])}
            ${select('sort', t(lang, 'sort'), [['title', t(lang, 'sort_title')], ['duration', t(lang, 'sort_duration')], ['level', t(lang, 'sort_level')]])}
          </div>`,
          { className: 'finder-more' },
        )}
      </form>
      <p class="count" aria-live="polite"><span id="count">${count(lang, sorted.length, 'results')}</span></p>
      <ul class="rows" id="rows">
        ${sorted.map((item) =>
          itemRow(site, item, lang, {
            data: {
              id: item.id,
              type: item.lead.type,
              topics: item.lead.topics.join(' '),
              level: item.lead.level,
              duration: item.lead.duration,
            },
          }),
        )}
      </ul>
      <p class="empty" id="empty" hidden>${t(lang, 'no_results')} <button type="button" class="text-button" id="reset">${t(lang, 'reset')}</button></p>
    `,
  };
}

// --- one item ----------------------------------------------------------------

export function item(site, doc, lang) {
  const text = site.localize(doc, lang);
  const lead = doc.lead;
  const { before, after, other } = site.relations(doc, lang);
  const inPaths = site.paths.filter((p) => site.steps(p.lead.steps).some((s) => s.id === doc.id));
  const link = (target) => html`<a href="${site.url(target, lang)}">${site.localize(target, lang).title}</a>`;
  const isQuiz = lead.type === 'quiz';
  const v = site.vocabulary;
  return {
    path: site.url(doc, lang),
    title: text.title,
    description: text.summary,
    scripts: isQuiz ? ['quiz'] : [],
    content: html`
      <article class="page item" data-item-page="${doc.id}" style="--topic: ${site.topicColor(doc)}">
        <header class="page-head">
          <p class="kicker"><span class="dot"></span><span>${typeLabel(site, doc, lang)}</span><span>${lead.duration} ${t(lang, 'minutes')}</span>${lead.optional && html`<span>${t(lang, 'optional')}</span>`}</p>
          <h1 style="view-transition-name: t-${doc.id}" lang="${text.lang}">${text.title}</h1>
          <p class="lead" lang="${text.lang}">${text.summary}</p>
          ${before.length > 0 && html`<p class="before">${t(lang, 'before')} ${before.map((b, i) => html`${i > 0 && ', '}${link(b)}`)}</p>`}
        </header>
        ${text.missing && html`<p class="notice">${t(lang, 'missing_translation')}</p>`}
        ${text.stale && html`<p class="notice">${t(lang, 'stale_translation')}</p>`}
        <div class="prose" lang="${text.lang}" ${isQuiz && raw(`data-check="${t(lang, 'check_answer')}" data-correct="${t(lang, 'correct')}" data-wrong="${t(lang, 'wrong')}" data-again="${t(lang, 'try_again')}"`)}>
          ${raw(site.body(doc, lang))}
        </div>
        ${lead.url && html`<p><a class="button button-quiet" href="${lead.url}" rel="noopener">${new URL(lead.url).host}</a></p>`}
        <div class="finish">
          <button type="button" class="button done-toggle" data-mark-done aria-pressed="false" data-open="${t(lang, 'mark_done')}" data-done="${t(lang, 'marked_done')}">
            ${icons.check}<span>${t(lang, 'mark_done')}</span>
          </button>
        </div>
        ${after.length > 0 &&
        html`<section class="section">
          <h2>${t(lang, 'next')}</h2>
          <ul class="rows">${after.map((a) => itemRow(site, a, lang, { summary: false }))}</ul>
        </section>`}
        ${other.length > 0 &&
        more(
          t(lang, 'more'),
          other.map(
            (group) => html`<h3>${group.label}</h3><ul class="rows">${group.items.map((r) => itemRow(site, r, lang, { summary: false }))}</ul>`,
          ),
        )}
        ${more(
          t(lang, 'details'),
          facts([
            [t(lang, 'level'), v.levels[lead.level][lang]],
            [t(lang, 'topics'), lead.topics.map((k) => v.topics[k][lang]).join(', ')],
            lead.modules?.length && [t(lang, 'modules'), lead.modules.map((k) => v.modules[k][lang]).join(', ')],
            lead.when && [t(lang, 'when'), lead.when],
            lead.born && [t(lang, 'lived'), lead.died ? `${lead.born}–${lead.died}` : `${t(lang, 'born')} ${lead.born}`],
            inPaths.length > 0 && [t(lang, 'in_paths'), inPaths.map((p, i) => html`${i > 0 && ', '}<a href="${site.url(p, lang)}">${site.localize(p, lang).title}</a>`)],
            [t(lang, 'code'), html`<code>${lead.code}</code>`],
            [t(lang, 'updated'), formatDate(lead.updated, lang)],
            [t(lang, 'status'), t(lang, lead.status)],
          ]),
        )}
      </article>
    `,
  };
}

// --- learning paths ----------------------------------------------------------

export function paths(site, lang) {
  return {
    path: url(lang, 'paths'),
    title: t(lang, 'nav_paths'),
    current: 'paths',
    content: html`
      <h1>${t(lang, 'nav_paths')}</h1>
      <ul class="rows">
        ${site.paths.map((p) => {
          const text = site.localize(p, lang);
          const steps = site.steps(p.lead.steps);
          return html`<li class="row row-path">
            <a class="row-link" href="${site.url(p, lang)}">
              <span class="row-head">
                <span class="row-title" style="view-transition-name: t-${p.id}">${text.title}</span>
                <span class="row-meta"><span>${count(lang, steps.length, 'steps')}</span><span>${site.duration(steps).required} ${t(lang, 'minutes')}</span></span>
              </span>
              <span class="row-summary">${text.summary}</span>
            </a>
            ${progressBar(steps.filter((s) => !s.optional).map((s) => s.id), lang)}
          </li>`;
        })}
      </ul>
    `,
  };
}

export function path(site, doc, lang) {
  const text = site.localize(doc, lang);
  const steps = site.steps(doc.lead.steps);
  const time = site.duration(steps);
  const requirement = (id) => site.item.get(id) ?? site.path.get(id);
  return {
    path: site.url(doc, lang),
    title: text.title,
    description: text.summary,
    current: 'paths',
    content: html`
      <article class="page">
        <header class="page-head">
          <p class="kicker"><span>${t(lang, 'path')}</span><span>${time.required} ${t(lang, 'minutes')}</span></p>
          <h1 style="view-transition-name: t-${doc.id}" lang="${text.lang}">${text.title}</h1>
          <p class="lead" lang="${text.lang}">${text.data.goal}</p>
          ${progressBar(steps.filter((s) => !s.optional).map((s) => s.id), lang)}
        </header>
        ${text.missing && html`<p class="notice">${t(lang, 'missing_translation')}</p>`}
        <ol class="rows trail">
          ${steps.map((s, i) => itemRow(site, site.item.get(s.id), lang, { optional: s.optional, summary: false, number: i + 1 }))}
        </ol>
        ${more(
          t(lang, 'about_path'),
          html`<div class="prose" lang="${text.lang}">${raw(site.body(doc, lang))}</div>
          ${facts([
            [t(lang, 'audience'), text.data.audience],
            [t(lang, 'level'), site.vocabulary.levels[doc.lead.level][lang]],
            (doc.lead.requires ?? []).length > 0 && [
              t(lang, 'requires'),
              doc.lead.requires.map((id, i) => html`${i > 0 && ', '}<a href="${site.url(requirement(id), lang)}">${site.localize(requirement(id), lang).title}</a>`),
            ],
            time.optional > 0 && [t(lang, 'optional'), `${time.optional} ${t(lang, 'minutes')}`],
            [t(lang, 'code'), html`<code>${doc.lead.code}</code>`],
            [t(lang, 'status'), t(lang, doc.lead.status)],
          ])}`,
        )}
      </article>
    `,
  };
}

// --- courses -------------------------------------------------------------------

export function course(site, doc, lang) {
  const text = site.localize(doc, lang);
  const required = doc.lead.units.flatMap((u) => site.steps(u.items).filter((s) => !s.optional).map((s) => s.id));
  return {
    path: site.url(doc, lang),
    title: text.title,
    description: text.summary,
    current: 'learning',
    scripts: ['course'],
    content: html`
      <article class="page" data-course="${doc.id}">
        <header class="page-head">
          <p class="kicker"><span>${t(lang, 'course')}</span><span>${doc.lead.semester}</span></p>
          <h1 lang="${text.lang}">${text.title}</h1>
          <p class="lead" lang="${text.lang}">${text.summary}</p>
          ${progressBar(required, lang)}
        </header>
        ${doc.lead.units.map((unit) => {
          const from = unit.available_from;
          return html`<details class="unit" open ${from && raw(`data-from="${isoDay(from)}"`)}>
            <summary>
              <span class="unit-title">${unit.title[lang]}</span>
              ${from && html`<span class="unit-date">${t(lang, 'available_from')} ${formatDate(from, lang)}</span>`}
            </summary>
            <ol class="rows trail">
              ${site.steps(unit.items).map((s, i) => itemRow(site, site.item.get(s.id), lang, { optional: s.optional, summary: false, number: i + 1 }))}
            </ol>
          </details>`;
        })}
        ${more(t(lang, 'about_course'), html`<div class="prose" lang="${text.lang}">${raw(site.body(doc, lang))}</div>`)}
      </article>
    `,
  };
}

// --- map -----------------------------------------------------------------------

function mapData(site, lang) {
  return {
    nodes: site.items.map((i) => ({
      id: i.id,
      title: site.localize(i, lang).title,
      type: i.lead.type,
      topics: i.lead.topics,
      color: site.topicColor(i),
      url: site.url(i, lang),
    })),
    links: site.items.flatMap((i) =>
      Object.entries(i.lead.relations ?? {}).flatMap(([rel, targets]) =>
        targets.map((target) => ({ source: i.id, target, rel, label: site.vocabulary.relations[rel][lang] })),
      ),
    ),
  };
}

const mapFigure = (site, lang, className) =>
  html`<figure class="map ${className}" data-map>
    <svg class="map-canvas" role="img" aria-label="${t(lang, 'nav_map')}"></svg>
    <script type="application/json" class="map-data">${json(mapData(site, lang))}</script>
  </figure>`;

export function map(site, lang) {
  const topics = Object.entries(site.vocabulary.topics).filter(([key]) => site.items.some((i) => i.lead.topics.includes(key)));
  return {
    path: url(lang, 'map'),
    title: t(lang, 'nav_map'),
    current: 'map',
    scripts: ['map'],
    content: html`
      <h1>${t(lang, 'nav_map')}</h1>
      <p class="lead">${t(lang, 'map_text')}</p>
      <fieldset class="chips" id="map-topics">
        <legend class="visually-hidden">${t(lang, 'topics')}</legend>
        <label class="chip"><input type="radio" name="topic" value="" checked><span>${t(lang, 'map_all')}</span></label>
        ${topics.map(([key, label]) => html`<label class="chip" style="--topic: #${label.color}"><input type="radio" name="topic" value="${key}"><span><span class="dot"></span>${label[lang]}</span></label>`)}
      </fieldset>
      ${mapFigure(site, lang, 'map-full')}
      <noscript><ul>${site.items.map((i) => html`<li><a href="${site.url(i, lang)}">${site.localize(i, lang).title}</a></li>`)}</ul></noscript>
    `,
  };
}

// --- my learning: courses and progress ----------------------------------------

export function learning(site, lang) {
  return {
    path: url(lang, 'learning'),
    title: t(lang, 'nav_learning'),
    current: 'learning',
    scripts: ['learning'],
    content: html`
      <h1>${t(lang, 'nav_learning')}</h1>
      <div class="notice import" id="import" hidden>
        <p>${t(lang, 'import_offer')}</p>
        <p class="actions"><button type="button" class="button" id="import-yes">${t(lang, 'import_yes')}</button>
        <button type="button" class="text-button" id="import-no">${t(lang, 'import_no')}</button></p>
      </div>
      <p class="notice" id="import-result" hidden data-done="${t(lang, 'import_done')}" data-failed="${t(lang, 'import_failed')}"></p>

      <section class="section" id="course">
        <h2>${t(lang, 'my_courses')}</h2>
        <ul class="rows" id="my-courses" data-empty="${t(lang, 'no_courses')}" data-remove="${t(lang, 'remove')}"></ul>
        <form class="code-form" id="course-form">
          <label for="course-code">${t(lang, 'enter_code')}</label>
          <div class="code-row">
            <input id="course-code" autocomplete="off" autocapitalize="characters" spellcheck="false" required>
            <button class="button" type="submit">${t(lang, 'open_course')}</button>
          </div>
          <p class="form-error" id="course-error" hidden>${t(lang, 'code_unknown')}</p>
        </form>
      </section>

      <section class="section">
        <h2>${t(lang, 'done_items')}</h2>
        ${progressBar(site.items.map((i) => i.id), lang)}
        <ul class="rows" id="done-list" data-empty="${t(lang, 'nothing_done')}"></ul>
      </section>

      ${more(
        t(lang, 'take_along'),
        html`<p>${t(lang, 'take_along_text')}</p>
        <div class="share">
          <div class="qr" id="qr"></div>
          <div class="share-actions">
            <input id="share-link" readonly aria-label="Link">
            <button type="button" class="button" id="copy" data-done="${t(lang, 'copied')}">${t(lang, 'copy_link')}</button>
            <button type="button" class="text-button" id="export">${t(lang, 'export_file')}</button>
            <label class="text-button">${t(lang, 'import_file')}<input type="file" id="import-file" accept="application/json,.json" hidden></label>
            <button type="button" class="text-button danger" id="reset" data-confirm="${t(lang, 'reset_confirm')}">${t(lang, 'reset_progress')}</button>
          </div>
        </div>`,
        { className: 'take-along' },
      )}
    `,
  };
}

export function notFound() {
  return {
    path: '/de/',
    title: '404',
    content: html`<article class="page"><h1>404</h1>
      <p class="lead">${t('de', 'not_found')} <a href="/de/">${t('de', 'back_home')}</a></p>
      <p class="lead" lang="en">${t('en', 'not_found')} <a href="/en/">${t('en', 'back_home')}</a></p></article>`,
  };
}
