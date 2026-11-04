// Small pieces shared by several pages.
import { html, raw } from '../build/html.mjs';
import { t } from '../build/i18n.mjs';
import { iconSvg } from '../build/icons.mjs';
import { typesOf } from '../build/types.mjs';

const svg = (body, size = 20) =>
  raw(
    `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`,
  );

export const icons = {
  search: svg('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>'),
  theme: svg('<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 0 0 16z" fill="currentColor"/>'),
  check: svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>', 16),
  close: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
  chevron: svg('<path d="m6 9 6 6 6-6"/>', 16),
  download: svg('<path d="M12 4v11m-4.5-4.5L12 15l4.5-4.5M5 19.5h14"/>', 18),
  list: svg('<path d="M3 5h.01M3 12h.01M3 19h.01M8 5h13M8 12h13M8 19h13"/>', 18),
  cards: svg('<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>', 18),
};

/** List or cards for the `.switchable` list on the page (client/view.js). */
export const viewSwitch = (lang) =>
  html`<div class="view-switch" role="group" aria-label="${t(lang, 'view')}">
    <button type="button" data-view="list" aria-pressed="true" title="${t(lang, 'view_list')}" aria-label="${t(lang, 'view_list')}">${icons.list}</button>
    <button type="button" data-view="cards" aria-pressed="false" title="${t(lang, 'view_cards')}" aria-label="${t(lang, 'view_cards')}">${icons.cards}</button>
  </div>`;

/** Two cells, one set and one not: the smallest picture of a bit. */
export const mark = raw(
  '<svg class="mark" width="26" height="14" viewBox="0 0 26 14" aria-hidden="true"><rect x="0.5" y="0.5" width="11" height="13" rx="2.5" fill="currentColor"/><rect x="14.5" y="0.5" width="11" height="13" rx="2.5" fill="none" stroke="currentColor"/></svg>',
);

/** The icon of an item's first type. */
export const typeIcon = (site, item) => raw(iconSvg(site.vocabulary.types[typesOf(item.lead)[0]].icon));

/** The names of an item's types, "Lektion · Folien" for two. */
export const typeLabel = (site, item, lang) => typesOf(item.lead).map((type) => site.vocabulary.types[type][lang]).join(' · ');

/**
 * What a lesson holds, for its row: "Folien · Quiz · 2 Demos", from the
 * material it embeds (build/embed.mjs), so that a list of lessons still shows
 * where the slides and the quizzes are.
 */
export function materialMarks(site, item, lang) {
  const counts = new Map();
  for (const m of site.embedsOf?.(item) ?? []) {
    const type = typesOf(m.lead)[0];
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  if (!counts.size) return '';
  const label = (type, n) => {
    if (n === 1) return site.vocabulary.types[type][lang];
    let many;
    try {
      many = t(lang, `material_many_${type}`);
    } catch {
      many = site.vocabulary.types[type][lang];
    }
    return `${n} ${many}`;
  };
  return html`<span class="row-material">${[...counts].map(([type, n]) => label(type, n)).join(' · ')}</span>`;
}

/** "Draft" beside a title, only on the site with drafts. */
export const draftTag = (site, doc, lang) => site.drafts && doc.lead.status === 'draft' && html`<span class="draft-tag">${t(lang, 'draft')}</span>`;

/** One item as a row: type icon, title, type and duration, one quiet line of summary. */
export function itemRow(site, item, lang, { optional = false, summary = true, topics = false, areas, number, data = {} } = {}) {
  const text = site.localize(item, lang);
  const lead = item.lead;
  const attributes = Object.entries(data).map(([key, value]) => html` data-${key}="${value}"`);
  // the colour of its area as a mark, half and half for two (the entrance)
  const mark = areas && html` style="--mark-a: var(--${areas[0]}); --mark-b: var(--${areas[1] ?? areas[0]})"`;
  return html`<li class="row${areas ? ' has-area' : ''}" data-progress-id="${item.id}"${mark}${attributes}>
    ${number !== undefined && html`<span class="row-step" aria-hidden="true"><span>${number}</span>${icons.check}</span>`}
    <a class="row-link" href="${site.url(item, lang)}">
      ${typeIcon(site, item)}
      <span class="row-head">
        <span class="row-title" style="view-transition-name: t-${item.id}" lang="${text.lang}">${text.titleHtml}</span>
        <span class="row-meta">
          <span>${typeLabel(site, item, lang)}</span>
          ${materialMarks(site, item, lang)}
          ${lead.duration && html`<span>${lead.duration} ${t(lang, 'minutes')}</span>`}
          ${optional && html`<span class="row-optional">${t(lang, 'optional')}</span>`}
          ${draftTag(site, item, lang)}
        </span>
      </span>
      ${summary && html`<span class="row-summary" lang="${text.lang}">${text.summary}</span>`}
      ${topics && html`<span class="row-topics">${lead.topics.map((key) => html`<span class="topic-tag">${site.vocabulary.topics[key][lang]}</span>`)}</span>`}
    </a>
    ${number === undefined && html`<span class="row-done" title="${t(lang, 'done')}">${icons.check}</span>`}
  </li>`;
}

export const progressBar = (ids, lang) =>
  html`<div class="meter" data-progress-ids="${ids.join(' ')}" data-of="${t(lang, 'of')}" data-done="${t(lang, 'done')}">
    <div class="meter-track"><div class="meter-fill"></div></div>
    <span class="meter-label"></span>
  </div>`;

/**
 * Marks a part of a page that the editor changes in place when it is clicked
 * (src/editor/ui/inline.js): the name of its field in the front matter. Only
 * on the site with drafts; the published pages stay without it.
 */
export const editable = (site, field) => site.drafts && raw(` data-field="${field}"`);

/** A disclosure for everything that is detail rather than overview. */
export const more = (summary, content, { open = false, className = '', attributes = '' } = {}) =>
  html`<details class="more ${className}" ${open && raw('open')}${attributes}>
    <summary>${summary}</summary>
    <div class="more-body">${content}</div>
  </details>`;

/** Rows of term and value; a third entry adds attributes to the row, such as editable(). */
export const facts = (rows) =>
  html`<dl class="facts">${rows.filter(Boolean).map(([term, value, attributes = '']) => html`<div${attributes}><dt>${term}</dt><dd>${value}</dd></div>`)}</dl>`;
