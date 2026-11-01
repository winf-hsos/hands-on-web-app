// One function per kind of page. Each returns { path, title, … } for the
// layout; the build writes them out. Overview first, details on request:
// what is not needed to choose or to read sits in a disclosure.
import { html, raw, json } from '../build/html.mjs';
import { t, count, formatDate } from '../build/i18n.mjs';
import { itemRow, progressBar, more, facts, icons, typeIcon, viewSwitch, draftTag, editable } from './parts.mjs';
import { iconSvg, iconShapes } from '../build/icons.mjs';
import { deckFile, deckPdf } from '../build/deck.mjs';
import { datasetInfo, loadingCode } from '../build/dataset.mjs';
import { highlight } from '../client/highlight.js';
import { areasOf } from '../build/site.mjs';
import { figureFile } from '../build/figures.mjs';

const typeLabel = (site, item, lang) => site.vocabulary.types[item.lead.type][lang];

// --- start page -------------------------------------------------------------

export function home(site, lang) {
  const doc = site.home;
  const text = site.localize(doc, lang);
  const featured = doc.lead.featured_path ? site.path.get(doc.lead.featured_path) : undefined;
  const samples = (doc.lead.samples ?? []).map((id) => site.item.get(id));
  // "Hands-on" on the first line, the name of the area whole on the second
  const [first, ...rest] = text.title.split(' ');
  return {
    path: site.link(lang),
    title: text.title,
    description: text.summary,
    scripts: ['map'],
    content: html`
      <section class="hero">
        <div class="hero-text">
          <h1 class="hero-title" lang="${text.lang}"${editable(site, 'title')}><span>${first}</span> <span>${rest.join(' ')}</span></h1>
          <p class="lead" lang="${text.lang}"${editable(site, 'summary')}>${text.summary}</p>
          <ul class="ways">
            ${featured &&
            html`<li><a class="way way-main" href="${site.url(featured, lang)}">
              <span class="way-title">${t(lang, 'start_here')}</span>
              <span class="way-text">${site.localize(featured, lang).title}</span></a></li>`}
            <li><a class="way" href="${site.link(lang, 'items')}">
              <span class="way-title">${t(lang, 'browse')}</span>
              <span class="way-text">${t(lang, 'browse_text')}</span></a></li>
            <li><a class="way" href="${site.link(lang, 'courses')}">
              <span class="way-title">${t(lang, 'nav_courses')}</span>
              <span class="way-text">${t(lang, 'course_code_text')}</span></a></li>
          </ul>
        </div>
        ${site.items.length > 0 ? mapFigure(site, lang, 'hero-map') : html`<p class="hero-empty">${t(lang, 'area_empty')}</p>`}
      </section>
      ${samples.length > 0 &&
      html`<section class="section">
        <h2>${t(lang, 'samples')}</h2>
        <ul class="rows">${samples.map((item) => itemRow(site, item, lang))}</ul>
      </section>`}
      ${more(t(lang, 'how_it_works'), html`<div class="prose" lang="${text.lang}">${raw(site.body(doc, lang))}</div>`)}
    `,
  };
}

// --- content list ------------------------------------------------------------

export function items(site, lang) {
  return {
    path: site.link(lang, 'items'),
    title: t(lang, 'nav_items'),
    current: 'items',
    back: 'home',
    scripts: ['list'],
    content: html`<h1>${t(lang, 'nav_items')}</h1>${finder(site, lang)}`,
  };
}

/**
 * Search, filters and the list of all items of a site (client/list.js). On
 * the entrance (`areas`) every row carries the colour of its area, half and
 * half for an item in two.
 */
export function finder(site, lang, { areas = false } = {}) {
  const { vocabulary } = site;
  const used = (key) => new Set(site.items.flatMap((i) => [i.lead[key]].flat()));
  const types = Object.entries(vocabulary.types).filter(([key]) => used('type').has(key));
  const topics = Object.entries(vocabulary.topics).filter(([key]) => used('topics').has(key));
  const sorted = site.items
    .slice()
    .sort((a, b) => site.localize(a, lang).title.localeCompare(site.localize(b, lang).title, lang));
  // Where each item is linked, for the path and project filters.
  const pathsOf = new Map(site.items.map((i) => [i.id, []]));
  for (const path of site.paths) for (const s of site.pathSteps(path)) pathsOf.get(s.id)?.push(path.id);
  const projectsOf = new Map(site.items.map((i) => [i.id, [...new Set(site.inProjects(i.id, lang).map((r) => r.project.id))]]));
  const linked = (docs, of) => docs.filter((d) => [...of.values()].some((ids) => ids.includes(d.id)));
  const choices = (docs) => [['', t(lang, 'all')], ...docs.map((d) => [d.id, site.localize(d, lang).title])];
  const select = (name, label, options, { hidden = false } = {}) =>
    html`<label class="field" ${hidden && raw('hidden')}><span>${label}</span><select name="${name}">${options.map(
      ([value, text]) => html`<option value="${value}">${text}</option>`,
    )}</select></label>`;
  const paths = linked(site.paths, pathsOf);
  const projects = linked(site.projects, projectsOf);
  // Headings for the groups of the list, in vocabulary order.
  const groups = {
    type: types.map(([key, v]) => ({ key, label: v[lang], icon: iconSvg(v.icon, 'icon') })),
    topic: topics.map(([key, v]) => ({ key, label: v[lang] })),
    level: Object.entries(vocabulary.levels).map(([key, v]) => ({ key, label: v[lang] })),
  };
  return html`
      <form class="finder" id="finder" data-one="${t(lang, 'results_one')}" data-many="${t(lang, 'results_many')}">
        <div class="finder-search">
          ${icons.search}
          <input type="search" name="q" placeholder="${t(lang, 'search_placeholder')}" autocomplete="off" aria-label="${t(lang, 'search')}">
        </div>
        <fieldset class="chips">
          <legend class="visually-hidden">${t(lang, 'nav_items')}</legend>
          ${types.map(([key, label]) => html`<label class="chip"><input type="radio" name="type" value="${key}"><span>${raw(iconSvg(label.icon))}${label[lang]}</span></label>`)}
        </fieldset>
        ${more(
          t(lang, 'more_filters'),
          html`<div class="fields">
            ${select('course', t(lang, 'course'), [['', t(lang, 'all')]], { hidden: true })}
            ${paths.length > 0 && select('path', t(lang, 'path'), choices(paths))}
            ${projects.length > 0 && select('project', t(lang, 'project'), choices(projects))}
            ${select('topic', t(lang, 'topics'), [['', t(lang, 'all')], ...topics.map(([k, v]) => [k, v[lang]])])}
            ${select('level', t(lang, 'level'), [['', t(lang, 'all')], ...Object.entries(vocabulary.levels).map(([k, v]) => [k, v[lang]])])}
            ${select('progress', t(lang, 'progress'), [['', t(lang, 'all')], ['open', t(lang, 'open')], ['done', t(lang, 'done')]])}
            ${select('sort', t(lang, 'sort'), [['title', t(lang, 'sort_title')], ['duration', t(lang, 'sort_duration')], ['level', t(lang, 'sort_level')]])}
          </div>`,
          { className: 'finder-more' },
        )}
      </form>
      <div class="list-bar">
        <p class="count" aria-live="polite">
          <span id="count">${count(lang, sorted.length, 'results')}</span>
          <button type="button" class="clear-filters" id="clear-filters" hidden>${icons.close}${t(lang, 'reset_short')}</button>
        </p>
        <div class="list-tools">
          <label class="group-by"><span>${t(lang, 'group')}</span>
            <select name="group" form="finder">
              ${['type', 'topic', 'level', 'none'].map((g) => html`<option value="${g}">${t(lang, `group_${g}`)}</option>`)}
            </select>
          </label>
          ${viewSwitch(lang)}
        </div>
      </div>
      <script type="application/json" id="groups">${raw(JSON.stringify(groups).replace(/</g, '\u003c'))}</script>
      <ul class="rows switchable" id="rows">
        ${sorted.map((item) =>
          itemRow(site, item, lang, {
            topics: true,
            areas: areas && areasOf(item),
            data: {
              id: item.id,
              type: item.lead.type,
              topics: item.lead.topics.join(' '),
              topic: item.lead.topics[0],
              level: item.lead.level,
              duration: item.lead.duration,
              paths: pathsOf.get(item.id).join(' '),
              projects: projectsOf.get(item.id).join(' '),
            },
          }),
        )}
      </ul>
      <p class="empty" id="empty" hidden>${t(lang, 'no_results')} <button type="button" class="text-button" id="reset">${t(lang, 'reset')}</button></p>
    `;
}

// --- one item ----------------------------------------------------------------

/** Labels for client/quiz.js, as data attributes on the quiz text. */
const quizLabels = (lang) =>
  html`data-check="${t(lang, 'check_answer')}" data-correct="${t(lang, 'correct')}" data-wrong="${t(lang, 'wrong')}" data-again="${t(lang, 'try_again')}" data-labels="${JSON.stringify(
    Object.fromEntries(['next', 'back', 'finish', 'position', 'result', 'score', 'open', 'restart'].map((k) => [k, t(lang, `quiz_${k}`)])),
  )}"`;

/** What a learner takes away from an item: a sentence and the goals (Nicolas, 2026-11-01). */
function objectivesBlock(site, text, lang) {
  const o = text.data.objectives;
  return (
    o &&
    html`<section class="prose objectives" lang="${text.lang}"${editable(site, 'objectives')}>
      <h2>${t(lang, 'objectives')}</h2>
      <p>${o.intro}</p>
      <ul>${o.goals.map((goal) => html`<li>${goal}</li>`)}</ul>
    </section>`
  );
}

/** The topics of an item, each a link to the content of that topic. */
const topicTags = (site, topics, lang) =>
  html`<p class="topic-tags"${editable(site, 'topics')}><span class="visually-hidden">${t(lang, 'topics')}:</span>${topics.map(
    (key) => html`<a class="topic-tag" href="${site.link(lang, 'items')}?topic=${key}">${site.vocabulary.topics[key][lang]}</a>`,
  )}</p>`;

/** The browser modules a rendered text needs: code boxes and demonstrators. */
const scriptsFor = (body) =>
  [
    body.includes('data-runner') && 'runner',
    body.includes('data-verb-demo') && 'verb-demo',
    body.includes('data-monty-hall') && 'monty-hall',
    body.includes('data-byte-switchboard') && 'byte-switchboard',
    body.includes('data-shell-demo') && 'shell-demo',
    body.includes('data-figure') && 'figures',
    body.includes('data-fillable') && 'tables',
  ].filter(Boolean);

export function item(site, doc, lang) {
  const text = site.localize(doc, lang);
  const lead = doc.lead;
  const { before, after, other } = site.relations(doc, lang);
  const inPaths = site.paths.filter((p) => site.pathSteps(p).some((s) => s.id === doc.id));
  const link = (target) => html`<a href="${site.url(target, lang)}">${site.localize(target, lang).title}</a>`;
  const isQuiz = lead.type === 'quiz';
  const v = site.vocabulary;
  const body = site.body(doc, lang);
  return {
    path: site.url(doc, lang),
    title: text.title,
    description: text.summary,
    back: 'items',
    scripts: [isQuiz && 'quiz', ...scriptsFor(body)].filter(Boolean),
    // the item's own drawings, next to its page (docs/figures.md)
    figures: body.includes('data-figure') && `figures.js?v=${figureFile(doc)?.hash}`,
    content: html`
      <article class="page item" data-item-page="${doc.id}">
        <header class="page-head">
          <p class="kicker"${editable(site, 'kicker')}>${typeIcon(site, doc)}<span>${typeLabel(site, doc, lang)}</span><span>${lead.duration} ${t(lang, 'minutes')}</span></p>
          <h1 style="view-transition-name: t-${doc.id}" lang="${text.lang}"${editable(site, 'title')}>${text.title}</h1>
          <p class="lead" lang="${text.lang}"${editable(site, 'summary')}>${text.summary}</p>
          ${topicTags(site, lead.topics, lang)}
          ${before.length > 0 && html`<p class="before"${editable(site, 'relations')}>${t(lang, 'before')} ${before.map((b, i) => html`${i > 0 && ', '}${link(b)}`)}</p>`}
        </header>
        ${text.missing && html`<p class="notice">${t(lang, 'missing_translation')}</p>`}
        ${text.stale && html`<p class="notice">${t(lang, 'stale_translation')}</p>`}
        ${objectivesBlock(site, text, lang)}
        ${scriptBlock(site, doc, lang)}
        ${lead.type === 'slides' && slidesBlock(site, doc, lang)}
        ${lead.type === 'dataset' && datasetBlock(doc, lang)}
        <div class="prose" lang="${text.lang}" ${isQuiz && quizLabels(lang)}>
          ${raw(body)}
        </div>
        ${(lead.url || lead.buy) &&
        html`<p class="links">
          ${lead.url && html`<a class="button button-quiet" href="${lead.url}" rel="noopener">${new URL(lead.url).host.replace(/^www\./, '')}</a>`}
          ${lead.buy && html`<a class="button button-quiet" href="${lead.buy}" rel="noopener">${t(lang, 'buy_at')} ${new URL(lead.buy).host.replace(/^www\./, '')}</a>`}
        </p>`}
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
          { attributes: editable(site, 'relations') },
        )}
        ${more(
          t(lang, 'details'),
          facts([
            [t(lang, 'level'), v.levels[lead.level][lang], editable(site, 'level')],
            lead.modules?.length && [t(lang, 'modules'), lead.modules.map((k) => v.modules[k][lang]).join(', '), editable(site, 'modules')],
            lead.authors && [t(lang, 'authors'), lead.authors.join(', '), editable(site, 'authors')],
            lead.year && [t(lang, 'year'), lead.year, editable(site, 'year')],
            lead.publisher && [t(lang, 'publisher'), lead.publisher, editable(site, 'publisher')],
            lead.isbn && [t(lang, 'isbn'), lead.isbn, editable(site, 'isbn')],
            lead.venue && [t(lang, 'venue'), lead.venue, editable(site, 'venue')],
            lead.doi && [t(lang, 'doi'), html`<a href="https://doi.org/${lead.doi}" rel="noopener">${lead.doi}</a>`, editable(site, 'doi')],
            lead.license && [t(lang, 'license'), lead.license, editable(site, 'license')],
            lead.when && [t(lang, 'when'), lead.when, editable(site, 'when')],
            lead.born && [t(lang, 'lived'), lead.died ? `${lead.born}–${lead.died}` : `${t(lang, 'born')} ${lead.born}`],
            site.inProjects(doc.id, lang).length > 0 && [
              t(lang, 'in_projects'),
              site.inProjects(doc.id, lang).map(
                (ref, i) =>
                  html`${i > 0 && ', '}<a href="${site.url(ref.project, lang)}${ref.anchor && `#${ref.anchor}`}">${site.localize(ref.project, lang).title}${ref.title && html` (${ref.title})`}</a>`,
              ),
            ],
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

/** An exercise as a script to download, next to its page (build/exercise-script.mjs). */
function scriptBlock(site, doc, lang) {
  const script = site.script(doc, lang);
  return (
    script &&
    html`<p class="script-file">
      <a class="button button-quiet" href="${script.name}" download="${script.name}">${icons.download}<span>${t(lang, 'script_download')}</span></a>
      <span class="script-note"><code>${script.name}</code> ${t(lang, 'script_note')}</span>
    </p>`
  );
}

/** A data set: its file to download, how big it is, and the lines that load it. */
function datasetBlock(doc, lang) {
  const { file } = doc.lead;
  const { bytes, rows, columns } = datasetInfo(doc.dir, file);
  const number = (n, digits = 0) => n.toLocaleString(lang === 'de' ? 'de-DE' : 'en-GB', { maximumFractionDigits: digits });
  const size = bytes < 1e6 ? `${number(bytes / 1e3)} kB` : `${number(bytes / 1e6, 1)} MB`;
  const code = loadingCode(file);
  return html`<section class="dataset prose">
      <div class="dataset-file">
        <a class="button" href="/media/datasets/${file}" download="${file}">${icons.download}<span>${t(lang, 'dataset_download')}</span></a>
        <p class="dataset-facts"><code>${file}</code><span>${number(rows)} ${t(lang, 'dataset_rows')}</span><span>${number(columns)} ${t(lang, 'dataset_columns')}</span><span>${size}</span></p>
      </div>
      <p>${t(lang, 'dataset_load')}</p>
      ${['r', 'python'].map(
        (l) => html`<p class="dataset-lang">${l === 'r' ? 'R' : 'Python'}</p>
          <pre class="code"><code class="language-${l}">${raw(highlight(code[l], l))}</code></pre>`,
      )}
    </section>`;
}

/** A stagekit deck embedded in the page, with full screen, a window of its own and the PDF. */
function slidesBlock(site, doc, lang) {
  const lead = doc.lead;
  const { file } = deckFile(doc.dir);
  const src = `/decks/${doc.id}/${file}`;
  const pdf = deckPdf(doc.dir, file);
  return html`<figure class="deck">
      <div class="deck-frame">
        <iframe src="${src}" title="${site.localize(doc, lang).title}" loading="lazy" allowfullscreen></iframe>
      </div>
      <figcaption class="deck-actions">
        <button type="button" class="button button-quiet" data-fullscreen=".deck-frame iframe">${t(lang, 'fullscreen')}</button>
        <a class="button button-quiet" href="${src}" target="_blank" rel="noopener">${t(lang, 'new_window')}</a>
        ${pdf && html`<a class="button button-quiet" href="/decks/${doc.id}/${pdf}" download="${pdf.split('/').pop()}">${t(lang, 'pdf')}</a>`}
        ${lead.deck_lang && lead.deck_lang !== lang && html`<span class="muted">${t(lang, lead.deck_lang === 'en' ? 'slides_in_english' : 'slides_in_german')}</span>`}
      </figcaption>
    </figure>
    ${lead.recordings?.length > 0 &&
    html`<section class="section"><h2>${t(lang, 'recordings')}</h2>
      <ul class="rows">${lead.recordings.map(
        (r) => html`<li class="row"><a class="row-link" href="${r.url}" target="_blank" rel="noopener">
          <span class="row-head"><span class="row-title">${r.title}</span>${r.slide && html`<span class="row-meta">${t(lang, 'from_slide')} ${r.slide}</span>`}</span></a></li>`,
      )}</ul></section>`}`;
}

// --- learning paths ----------------------------------------------------------

const pathIcon = raw(iconSvg('route'));

export function paths(site, lang) {
  return {
    path: site.link(lang, 'paths'),
    title: t(lang, 'nav_paths'),
    current: 'paths',
    back: 'home',
    content: html`
      <h1>${t(lang, 'nav_paths')}</h1>
      <div class="list-bar">
        <p class="count">${count(lang, site.paths.length, 'paths')}</p>
        ${viewSwitch(lang)}
      </div>
      <ul class="rows switchable">
        ${site.paths.map((p) => {
          const text = site.localize(p, lang);
          const steps = site.pathSteps(p);
          return html`<li class="row row-path">
            <a class="row-link" href="${site.url(p, lang)}">
              ${pathIcon}
              <span class="row-head">
                <span class="row-title" style="view-transition-name: t-${p.id}">${text.title}</span>
                <span class="row-meta"><span>${count(lang, steps.length, 'steps')}</span><span>${site.duration(steps).required} ${t(lang, 'minutes')}</span>${draftTag(site, p, lang)}</span>
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
  const steps = site.pathSteps(doc);
  const time = site.duration(steps);
  // Steps are numbered through the whole path, also across its sections.
  let number = 0;
  const trail = (list) =>
    html`<ol class="rows trail">${site.steps(list).map((s) => itemRow(site, site.item.get(s.id), lang, { optional: s.optional, summary: false, number: ++number }))}</ol>`;
  const requirement = (id) => site.item.get(id) ?? site.path.get(id);
  return {
    path: site.url(doc, lang),
    title: text.title,
    description: text.summary,
    current: 'paths',
    back: 'paths',
    content: html`
      <article class="page">
        <header class="page-head">
          <p class="kicker"><span>${t(lang, 'path')}</span><span>${time.required} ${t(lang, 'minutes')}</span></p>
          <h1 style="view-transition-name: t-${doc.id}" lang="${text.lang}"${editable(site, 'title')}>${text.title}</h1>
          <p class="lead" lang="${text.lang}"${editable(site, 'goal')}>${text.data.goal}</p>
          ${progressBar(steps.filter((s) => !s.optional).map((s) => s.id), lang)}
        </header>
        ${text.missing && html`<p class="notice">${t(lang, 'missing_translation')}</p>`}
        ${doc.lead.sections
          ? doc.lead.sections.map((section) => html`<section class="path-section"><h2>${section.title[lang]}</h2>${trail(section.steps)}</section>`)
          : trail(doc.lead.steps)}
        ${more(
          t(lang, 'about_path'),
          html`<div class="prose" lang="${text.lang}">${raw(site.body(doc, lang))}</div>
          ${facts([
            [t(lang, 'audience'), text.data.audience, editable(site, 'audience')],
            [t(lang, 'level'), site.vocabulary.levels[doc.lead.level][lang], editable(site, 'level')],
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

// --- courses, called modules on the site --------------------------------------

const courseIcon = raw(iconSvg('graduation-cap'));

/** The English page of a page at hs-osnabrueck.de, which puts /en/ before the path. */
const inLanguage = (url, lang) => (lang === 'en' ? url.replace(/^(https:\/\/www\.hs-osnabrueck\.de)\/(?!en\/)/, '$1/en/') : url);

/** One card per handbook module of the course: logo and name of the institution, the
 *  module's name and its official description. Two or three modules stand
 *  side by side in smaller cards. */
function institutionBlock(site, doc, lang) {
  const where = site.vocabulary.institutions?.[doc.lead.institution];
  const modules = [].concat(doc.lead.module ?? []).map((key) => site.vocabulary.modules[key]);
  if (!where && !modules.length) return '';
  const card = (module) => html`<div class="institution">
    ${where && html`<a class="institution-logo" href="${inLanguage(where.url, lang)}" rel="noopener"><img src="/media/${where.logo}" alt="${where[lang]}" width="140" height="59"></a>`}
    <div class="institution-text">
      ${module && html`<span class="institution-module">${module[lang]}</span>`}
      ${where && html`<a class="institution-name" href="${inLanguage(where.url, lang)}" rel="noopener">${where[lang]}</a>`}
      ${module?.handbook && html`<a class="institution-handbook" href="${inLanguage(module.handbook, lang)}" rel="noopener">${t(lang, 'module_handbook')} ↗</a>`}
    </div>
  </div>`;
  return html`<div class="institutions${modules.length > 1 && ' is-several'}">${(modules.length ? modules : [null]).map(card)}</div>`;
}

/** All modules, open to everyone; opening one adds it to "My learning". */
export function courses(site, lang) {
  return {
    path: site.link(lang, 'courses'),
    title: t(lang, 'nav_courses'),
    current: 'courses',
    back: 'home',
    content: html`
      <h1>${t(lang, 'nav_courses')}</h1>
      <div class="list-bar">
        <p class="count">${count(lang, site.courses.length, 'courses')}</p>
        ${viewSwitch(lang)}
      </div>
      <ul class="rows switchable">
        ${site.courses.map((c) => {
          const text = site.localize(c, lang);
          const steps = site.courseSteps(c);
          return html`<li class="row row-path">
            <a class="row-link" href="${site.url(c, lang)}">
              ${courseIcon}
              <span class="row-head">
                <span class="row-title" lang="${text.lang}">${text.title}</span>
                <span class="row-meta">${c.lead.institution && html`<span>${site.vocabulary.institutions[c.lead.institution][lang]}</span>`}${c.lead.sections.length > 0 && html`<span>${count(lang, c.lead.sections.length, 'sections')}</span>`}${draftTag(site, c, lang)}</span>
              </span>
              ${text.data.subtitle && html`<span class="row-subtitle" lang="${text.lang}">${text.data.subtitle}</span>`}
              <span class="row-summary" lang="${text.lang}">${text.summary}</span>
            </a>
            ${steps.length > 0 && progressBar(steps.filter((s) => !s.optional).map((s) => s.id), lang)}
          </li>`;
        })}
      </ul>
    `,
  };
}

export function course(site, doc, lang) {
  const text = site.localize(doc, lang);
  const required = site.courseSteps(doc).filter((s) => !s.optional).map((s) => s.id);
  // Steps are numbered through each section, also across the parts of a path.
  let number = 0;
  const trail = (list) =>
    html`<ol class="rows trail">${site.steps(list).map((s) => itemRow(site, site.item.get(s.id), lang, { optional: s.optional, summary: false, number: ++number }))}</ol>`;
  const section = (title, body, meta) => {
    number = 0;
    return html`<details class="course-section" open>
      <summary><span class="course-section-title">${title}</span>${meta && html`<span class="course-section-meta">${meta}</span>`}</summary>
      ${body()}
    </details>`;
  };
  // A path in a module shows its own parts and links to the path page.
  const pathSection = (p) => {
    const ptext = site.localize(p, lang);
    const steps = site.pathSteps(p);
    return section(
      ptext.title,
      () => html`${p.lead.sections
          ? p.lead.sections.map((part) => html`<h3 class="course-path-part">${part.title[lang]}</h3>${trail(part.steps)}`)
          : trail(p.lead.steps)}
        <p class="course-path-link"><a href="${site.url(p, lang)}">${pathIcon}${t(lang, 'open_path')}</a></p>`,
      html`${t(lang, 'path')} · ${count(lang, steps.length, 'steps')}`,
    );
  };
  // A project in a module lists its phases, each linking into the project page.
  const projectSection = (p) => {
    const ptext = site.localize(p, lang);
    const phases = site.projectText(p, lang).phases;
    return section(
      ptext.title,
      () => html`<p class="course-project-summary" lang="${ptext.lang}">${ptext.summary}</p>
        <ol class="rows trail">${p.lead.phases.map((phase, i) => html`<li class="row">
          <span class="row-step" aria-hidden="true"><span>${i + 1}</span></span>
          <a class="row-link" href="${site.url(p, lang)}#${phase.id}">${projectIcon}<span class="row-head"><span class="row-title" lang="${ptext.lang}">${phases[i].title}</span></span></a>
        </li>`)}</ol>
        <p class="course-path-link"><a href="${site.url(p, lang)}">${projectIcon}${t(lang, 'open_project')}</a></p>`,
      html`${t(lang, 'project')} · ${count(lang, p.lead.phases.length, 'phases')}`,
    );
  };
  return {
    path: site.url(doc, lang),
    title: text.title,
    description: text.summary,
    current: 'courses',
    back: 'courses',
    scripts: ['course'],
    content: html`
      <article class="page" data-course="${doc.id}">
        <header class="page-head">
          <p class="kicker">${courseIcon}<span>${t(lang, 'course')}</span>${doc.lead.sections.length > 0 && html`<span>${count(lang, doc.lead.sections.length, 'sections')}</span>`}</p>
          <h1 lang="${text.lang}"${editable(site, 'title')}>${text.title}</h1>
          ${text.data.subtitle && html`<p class="subtitle" lang="${text.lang}"${editable(site, 'subtitle')}>${text.data.subtitle}</p>`}
          <p class="lead" lang="${text.lang}"${editable(site, 'summary')}>${text.summary}</p>
          ${institutionBlock(site, doc, lang)}
          ${required.length > 0 && progressBar(required, lang)}
        </header>
        ${doc.lead.sections.length === 0 && html`<p class="empty">${t(lang, 'course_empty')}</p>`}
        ${doc.lead.sections.map((s) =>
          s.path ? pathSection(site.path.get(s.path))
          : s.project ? projectSection(site.project.get(s.project))
          : section(s.title[lang], () => trail(s.items)))}
        ${more(t(lang, 'about_course'), html`<div class="prose" lang="${text.lang}">${raw(site.body(doc, lang))}</div>`)}
      </article>
    `,
  };
}

// --- projects ------------------------------------------------------------------

const projectIcon = raw(iconSvg('hammer'));

export function projects(site, lang) {
  return {
    path: site.link(lang, 'projects'),
    title: t(lang, 'nav_projects'),
    current: 'projects',
    back: 'home',
    content: html`
      <h1>${t(lang, 'nav_projects')}</h1>
      <div class="list-bar">
        <p class="count">${count(lang, site.projects.length, 'projects')}</p>
        ${viewSwitch(lang)}
      </div>
      <ul class="rows switchable">
        ${site.projects.map((p) => {
          const text = site.localize(p, lang);
          const challenges = p.lead.phases.flatMap((phase) => phase.challenges ?? []).length;
          return html`<li class="row">
            <a class="row-link" href="${site.url(p, lang)}">
              ${projectIcon}
              <span class="row-head">
                <span class="row-title" style="view-transition-name: t-${p.id}">${text.title}</span>
                <span class="row-meta">
                  <span>${count(lang, p.lead.phases.length, 'phases')}</span>
                  ${challenges > 0 && html`<span>${count(lang, challenges, 'challenges')}</span>`}
                  ${draftTag(site, p, lang)}
                </span>
              </span>
              <span class="row-summary">${text.summary}</span>
            </a>
          </li>`;
        })}
      </ul>
    `,
  };
}

export function project(site, doc, lang) {
  const text = site.localize(doc, lang);
  const parts = site.projectText(doc, lang);
  const md = (source) => raw(site.markdown(source, lang, text.lang));
  const related = (ids = []) =>
    ids.length > 0 &&
    html`<div class="related"><h4>${t(lang, 'related_content')}</h4>
      <ul class="rows">${ids.map((id) => itemRow(site, site.item.get(id), lang, { summary: false }))}</ul></div>`;
  const v = site.vocabulary;
  const lead = doc.lead;
  const content = html`
      <article class="page project">
        <header class="page-head">
          <p class="kicker">${projectIcon}<span>${t(lang, 'project')}</span><span>${count(lang, lead.phases.length, 'phases')}</span></p>
          <h1 style="view-transition-name: t-${doc.id}" lang="${text.lang}"${editable(site, 'title')}>${text.title}</h1>
          <p class="lead" lang="${text.lang}"${editable(site, 'summary')}>${text.summary}</p>
        </header>
        ${text.missing && html`<p class="notice">${t(lang, 'missing_translation')}</p>`}
        ${parts.intro && html`<div class="prose" lang="${text.lang}">${md(parts.intro)}</div>`}
        <ol class="phases">
          ${lead.phases.map((phase, p) => {
            const part = parts.phases[p];
            return html`<li class="phase" id="${phase.id}">
              <details class="phase-box">
                <summary>
                  <span class="phase-number" aria-hidden="true">${p + 1}</span>
                  <span class="phase-head">
                    <span class="phase-title">${part.title}</span>
                    ${part.challenges.length === 1 && html`<span class="phase-meta">${part.challenges[0].title}</span>`}
                    ${part.challenges.length > 1 && html`<span class="phase-meta">${count(lang, part.challenges.length, 'challenges')}</span>`}
                  </span>
                </summary>
                <div class="phase-body">
                  ${part.md && html`<div class="prose" lang="${text.lang}">${md(part.md)}</div>`}
                  ${related(phase.items)}
                  ${(phase.challenges ?? []).map((challenge, c) => {
                    const cpart = part.challenges[c];
                    return html`<details class="challenge" id="${challenge.id}">
                      <summary>${cpart.title}</summary>
                      <div class="challenge-body">
                        <div class="prose" lang="${text.lang}">${md(cpart.md)}</div>
                        ${related(challenge.items)}
                      </div>
                    </details>`;
                  })}
                </div>
              </details>
            </li>`;
          })}
        </ol>
        ${related(lead.items)}
        ${parts.sections.map((section) => more(section.title, html`<div class="prose" lang="${text.lang}">${md(section.md)}</div>`))}
        ${more(
          t(lang, 'details'),
          facts([
            [t(lang, 'level'), v.levels[lead.level][lang], editable(site, 'level')],
            lead.modules?.length && [t(lang, 'modules'), lead.modules.map((k) => v.modules[k][lang]).join(', '), editable(site, 'modules')],
            [t(lang, 'code'), html`<code>${lead.code}</code>`],
            [t(lang, 'updated'), formatDate(lead.updated, lang)],
            [t(lang, 'status'), t(lang, lead.status)],
          ]),
        )}
      </article>
  `;
  return {
    path: site.url(doc, lang),
    title: text.title,
    description: text.summary,
    current: 'projects',
    back: 'projects',
    // phases may hold code boxes and demonstrators like any item
    scripts: ['project', ...scriptsFor(String(content))],
    content,
  };
}

// --- map -----------------------------------------------------------------------

/** Topics with their number of items, and the items with their topics (client/map.js). */
function mapData(site, lang) {
  const inTopic = (key) => site.items.filter((i) => i.lead.topics.includes(key));
  return {
    topics: Object.entries(site.vocabulary.topics)
      .filter(([key]) => inTopic(key).length > 0)
      .map(([key, v]) => ({ id: key, title: v[lang], count: inTopic(key).length, url: `${site.link(lang, 'items')}?topic=${key}` })),
    items: site.items.map((i) => ({
      id: i.id,
      title: site.localize(i, lang).title,
      icon: iconShapes(site.vocabulary.types[i.lead.type].icon),
      topics: i.lead.topics,
      url: site.url(i, lang),
    })),
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
    path: site.link(lang, 'map'),
    title: t(lang, 'nav_map'),
    current: 'map',
    back: 'home',
    scripts: ['map'],
    content: html`
      <h1>${t(lang, 'nav_map')}</h1>
      <p class="lead">${t(lang, 'map_text')}</p>
      <fieldset class="chips" id="map-topics">
        <legend class="visually-hidden">${t(lang, 'topics')}</legend>
        <label class="chip"><input type="radio" name="topic" value="" checked><span>${t(lang, 'map_all')}</span></label>
        ${topics.map(([key, label]) => html`<label class="chip"><input type="radio" name="topic" value="${key}"><span>${label[lang]}</span></label>`)}
      </fieldset>
      ${site.items.length > 0 ? mapFigure(site, lang, 'map-full') : html`<p class="empty">${t(lang, 'area_empty')}</p>`}
      <noscript><ul>${site.items.map((i) => html`<li><a href="${site.url(i, lang)}">${site.localize(i, lang).title}</a></li>`)}</ul></noscript>
    `,
  };
}

// --- my learning: courses and progress ----------------------------------------

export function learning(site, lang) {
  return {
    path: site.link(lang, 'learning'),
    title: t(lang, 'nav_learning'),
    current: 'learning',
    back: 'home',
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
        <p><a href="${site.link(lang, 'courses')}">${t(lang, 'all_courses')}</a></p>
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
