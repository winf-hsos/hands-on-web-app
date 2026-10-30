// The editor in the browser: list, forms, Markdown with preview, dialogs.
// All changes go through the local server, which checks them with the
// rules of the build before writing anything.
import yaml from 'js-yaml';

const SECTIONS = [
  ['content', 'Inhalte'],
  ['paths', 'Lernpfade'],
  ['courses', 'Kurse'],
  ['projects', 'Projekte'],
  ['pages', 'Seiten'],
];
const KIND_ICON = { paths: 'path', courses: 'course', projects: 'project', pages: 'page' };
const STATUS = [
  ['', 'Alle'],
  ['draft', 'Entwurf'],
  ['published', 'Veröffentlicht'],
  ['archived', 'Archiviert'],
];
const LANG_NAME = { de: 'Deutsch', en: 'Englisch' };
const TYPE_FIELDS = {
  source: ['authors', 'year', 'publisher', 'isbn', 'buy', 'url'],
  paper: ['authors', 'year', 'venue', 'doi', 'url'],
  tool: ['url', 'license'],
  demo: ['url'],
  story: ['when'],
  person: ['born', 'died'],
  slides: ['deck_lang'],
  dataset: ['file', 'authors', 'year', 'license'],
};
const FIELD_LABEL = {
  authors: 'Von (durch Komma getrennt)',
  year: 'Jahr',
  publisher: 'Verlag',
  isbn: 'ISBN',
  buy: 'Link zum Kauf',
  url: 'Link',
  venue: 'Erschienen in',
  doi: 'DOI',
  license: 'Lizenz',
  when: 'Zeit (z. B. „um 1838“)',
  born: 'Geboren (Jahr)',
  died: 'Gestorben (Jahr)',
  deck_lang: 'Sprache der Folien (de oder en)',
  file: 'Datei in media/datasets/ (z. B. daten.csv)',
};
const NUMBER_FIELDS = new Set(['year', 'born', 'died', 'duration', 'level']);
// Fields the forms handle; everything else of a lead file appears as YAML.
const HANDLED = {
  common: ['type', 'kind', 'code', 'title', 'summary', 'goal', 'audience', 'status', 'updated', 'translation_of', 'based_on'],
  content: ['level', 'duration', 'topics', 'modules', 'relations', ...Object.keys(FIELD_LABEL)],
  paths: ['level', 'requires', 'steps'],
  courses: ['access_code', 'module', 'semester'],
  projects: ['level', 'topics', 'modules', 'items'],
  pages: ['featured_path', 'samples'],
};

const $ = (selector, root = document) => root.querySelector(selector);
const today = () => new Date().toISOString().slice(0, 10);
const clone = (x) => JSON.parse(JSON.stringify(x));
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

let state = { section: 'content', status: '', filter: '' };
let doc = null; // { section, id, lead, files, url } as saved
let work = null; // the same, being edited
let lang = null;

// --- server -----------------------------------------------------------------

async function api(method, path, body) {
  const response = await fetch(path, {
    method,
    headers: { 'Content-Type': 'application/json', 'X-Editor': '1' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({ ok: false, errors: ['The server sent no readable answer.'] }));
  return { status: response.status, ...data };
}

async function refresh() {
  const next = await api('GET', '/api/state');
  Object.assign(state, { list: next.docs, vocabulary: next.vocabulary, icons: next.icons, git: next.git, errors: next.errors, site: next.site });
  $('#site').href = `${next.site}/drafts/cs/de/`;
  renderList();
  renderGit();
}

const iconOf = (d) => state.icons[d.section === 'content' ? d.kind : KIND_ICON[d.section]] ?? '';
const titleOf = (d) => d.titles?.[d.lead] ?? d.titles?.de ?? d.titles?.en ?? d.id;
const findDoc = (id) => state.list.find((d) => d.id === id);

// --- list -------------------------------------------------------------------

function chips(container, options, current, onPick) {
  container.innerHTML = options
    .map(([value, label]) => `<label class="chip"><input type="radio" name="${container.id}" value="${value}" ${value === current ? 'checked' : ''}><span>${esc(label)}</span></label>`)
    .join('');
  container.onchange = (e) => onPick(e.target.value);
}

function matches(d, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  return [d.id, String(d.code ?? ''), ...Object.values(d.titles)].some((s) => String(s).toLowerCase().includes(q));
}

function renderList() {
  const counts = Object.fromEntries(SECTIONS.map(([s]) => [s, state.list.filter((d) => d.section === s).length]));
  chips($('#sections'), SECTIONS.map(([s, l]) => [s, `${l} ${counts[s]}`]), state.section, (s) => ((state.section = s), renderList()));
  chips($('#status-filter'), STATUS, state.status, (s) => ((state.status = s), renderList()));
  const docs = state.list
    .filter((d) => d.section === state.section && (!state.status || d.status === state.status) && matches(d, state.filter))
    .sort((a, b) => titleOf(a).localeCompare(titleOf(b), 'de'));
  $('#docs').innerHTML =
    docs
      .map(
        (d) => `<li class="${d.status === 'archived' ? 'is-archived' : ''}"><button type="button" data-id="${d.id}" data-section="${d.section}" ${doc?.id === d.id && doc?.section === d.section ? 'aria-current="true"' : ''}>
          ${iconOf(d)}<span class="d-title">${esc(titleOf(d))}</span>
          <span>${d.errors ? `<span class="d-flag is-error" title="${esc(d.problems.join('\n'))}">${d.errors} Fehler</span>` : ''}</span>
          <span class="d-meta"><span>${d.code ?? ''}</span><span>${statusLabel(d.status)}</span>${Object.keys(d.titles).length < 2 ? '<span>nur ' + esc(d.lead?.toUpperCase()) + '</span>' : ''}</span>
        </button></li>`,
      )
      .join('') || '<li class="muted">Nichts gefunden.</li>';
  const others = state.errors.length - state.list.reduce((n, d) => n + d.errors, 0);
  $('#global').textContent = others > 0 ? `${others} Fehler außerhalb einzelner Dokumente, siehe Bau.` : '';
}

const statusLabel = (s) => ({ draft: 'Entwurf', published: 'veröffentlicht', archived: 'archiviert' })[s] ?? '';

$('#docs').addEventListener('click', (e) => {
  const button = e.target.closest('button[data-id]');
  if (button) open(button.dataset.section, button.dataset.id);
});
$('#filter').addEventListener('input', (e) => ((state.filter = e.target.value), renderList()));

function renderGit() {
  const box = $('#git');
  if (!state.git?.available) return (box.innerHTML = '');
  const { changes, remote, ahead } = state.git;
  const n = changes.length;
  box.innerHTML =
    (n
      ? `<span>${n} ungesicherte ${n === 1 ? 'Änderung' : 'Änderungen'} in Git</span><button type="button" class="text-button" id="commit">Sichern</button>`
      : '<span>Alles in Git gesichert</span>') +
    (remote && ahead ? `<button type="button" class="text-button" id="publish">Veröffentlichen (${ahead})</button>` : '');
  $('#commit')?.addEventListener('click', commit);
  $('#publish')?.addEventListener('click', publish);
}

// --- open and render a document ----------------------------------------------

const dirty = () => work && JSON.stringify(work.files) !== JSON.stringify(doc.files);

async function open(section, id, { force = false } = {}) {
  if (!force && dirty() && !(await confirmDialog('Ungespeicherte Änderungen', '<p>Die Änderungen an diesem Dokument gehen verloren.</p>', 'Verwerfen'))) return;
  const loaded = await api('GET', `/api/doc/${section}/${id}`);
  if (loaded.status !== 200) return message('error', 'Konnte das Dokument nicht laden.', loaded.errors);
  doc = loaded;
  work = clone({ section: doc.section, id: doc.id, lead: doc.lead, files: doc.files });
  lang = doc.lead;
  renderDoc();
  renderList();
  // Problems the check already finds in this document are shown right away,
  // not only when saving.
  const problems = state.list.find((d) => d.section === section && d.id === id)?.problems ?? [];
  if (problems.length) message('error', 'Die Prüfung meldet für dieses Dokument:', problems);
}

const leadData = () => work.files[work.lead].data;

function renderDoc() {
  const d = leadData();
  const kindLabel = work.section === 'content' ? state.vocabulary.types[d.type]?.de : SECTIONS.find(([s]) => s === work.section)[1].replace(/e$/, '');
  $('#doc').innerHTML = `
    <div class="ed-head">
      <div style="flex:1 1 20rem">
        <h1 id="doc-title">${esc(d.title)}</h1>
        <p class="ed-ident"><span>${esc(kindLabel ?? '')}</span><span>Kennung <code>${work.id}</code></span>${d.code ? `<span>Code <code>${d.code}</code></span>` : ''}<span>Original: ${LANG_NAME[work.lead]}</span>${d.updated ? `<span>Stand ${d.updated}</span>` : ''}</p>
      </div>
      <div class="ed-buttons">
        <span class="ed-dirty" id="dirty"></span>
        ${'status' in d ? `<label class="ed-field"><select id="status">${STATUS.slice(1).map(([v, l]) => `<option value="${v}" ${d.status === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>` : ''}
        <button type="button" class="button" id="save">Speichern</button>
        ${'status' in d ? `<button type="button" class="text-button" id="archive">${d.status === 'archived' ? 'Wiederherstellen' : 'Archivieren'}</button>` : ''}
        ${work.section !== 'pages' ? '<button type="button" class="text-button danger" id="delete">Löschen</button>' : ''}
        <a class="text-button" href="${doc.url?.[lang] ?? '#'}" target="_blank" rel="noopener" id="view">Ansehen</a>
      </div>
    </div>
    <div class="ed-messages" id="messages"></div>
    <section class="ed-section"><h2>Gemeinsame Angaben</h2><div class="ed-grid" id="shared"></div></section>
    <div class="ed-tabs" role="tablist" id="tabs"></div>
    <div class="ed-lang" id="lang"></div>`;
  renderShared();
  renderTabs();
  renderLang();
  $('#save').onclick = save;
  $('#archive')?.addEventListener('click', toggleArchive);
  $('#delete')?.addEventListener('click', remove);
  $('#status')?.addEventListener('change', (e) => ((leadData().status = e.target.value), changed()));
  changed();
}

function changed() {
  const isDirty = dirty();
  $('#dirty').textContent = isDirty ? 'Nicht gespeichert' : '';
  $('#doc-title').textContent = leadData().title;
}

addEventListener('beforeunload', (e) => {
  if (dirty()) e.preventDefault();
});

// --- shared fields (lead file) -----------------------------------------------

function field(label, input, { wide = false, hint } = {}) {
  return `<label class="ed-field ${wide ? 'ed-wide' : ''}"><span>${label}</span>${input}${hint ? `<small>${hint}</small>` : ''}</label>`;
}
const select = (key, options, value) =>
  `<select data-key="${key}">${options.map(([v, l]) => `<option value="${esc(v)}" ${String(v) === String(value) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
const input = (key, value, type = 'text') => `<input data-key="${key}" type="${type}" value="${esc(value ?? '')}">`;
const multi = (key, entries, values = []) =>
  `<div class="chips" data-multi="${key}">${entries.map(([k, l]) => `<label class="chip"><input type="checkbox" value="${k}" ${values.includes(k) ? 'checked' : ''}><span>${esc(l)}</span></label>`).join('')}</div>`;
const linkList = (key, label, { steps = false } = {}) =>
  `<div class="ed-field ed-wide"><span class="ed-label">${label}</span><ul class="ed-links" data-links="${key}" data-steps="${steps}"></ul><button type="button" class="text-button ed-add" data-add="${key}">+ hinzufügen</button></div>`;

function renderShared() {
  const d = leadData();
  const v = state.vocabulary;
  const levels = Object.entries(v.levels).map(([k, l]) => [k, `${k} – ${l.de}`]);
  const html = [];
  if (work.section === 'content') {
    html.push(field('Typ', select('type', Object.entries(v.types).map(([k, l]) => [k, l.de]), d.type)));
    html.push(field('Niveau', select('level', levels, d.level)));
    html.push(field('Dauer in Minuten', input('duration', d.duration, 'number')));
    html.push(field('Themen', multi('topics', Object.entries(v.topics).map(([k, l]) => [k, l.de]), d.topics), { wide: true }));
    html.push(field('Module', multi('modules', Object.entries(v.modules).map(([k, l]) => [k, l.de]), d.modules ?? []), { wide: true }));
    for (const key of TYPE_FIELDS[d.type] ?? []) {
      const value = key === 'authors' ? (d.authors ?? []).join(', ') : d[key];
      html.push(field(FIELD_LABEL[key], input(key, value, NUMBER_FIELDS.has(key) ? 'number' : 'text')));
    }
    for (const [rel, def] of Object.entries(v.relations)) html.push(linkList(`relations.${rel}`, def.de));
  }
  if (work.section === 'paths') {
    html.push(field('Niveau', select('level', levels, d.level)));
    // A path in sections keeps its structure in the YAML field below.
    if (!d.sections) html.push(linkList('steps', 'Schritte, in dieser Reihenfolge', { steps: true }));
    html.push(linkList('requires', 'Voraussetzungen'));
  }
  if (work.section === 'courses') {
    html.push(field('Kurs-Code für Studierende', input('access_code', d.access_code), { hint: 'Großbuchstaben, Ziffern, Bindestrich' }));
    html.push(field('Modul', multi('module', Object.entries(v.modules).map(([k, l]) => [k, l.de]), [].concat(d.module ?? [])), { wide: true }));
    html.push(field('Semester', input('semester', d.semester), { hint: 'z. B. 2026-27 - WS' }));
  }
  if (work.section === 'projects') {
    html.push(field('Niveau', select('level', levels, d.level)));
    html.push(field('Themen', multi('topics', Object.entries(v.topics).map(([k, l]) => [k, l.de]), d.topics), { wide: true }));
    html.push(field('Module', multi('modules', Object.entries(v.modules).map(([k, l]) => [k, l.de]), d.modules ?? []), { wide: true }));
    html.push(linkList('items', 'Inhalte zum ganzen Projekt'));
  }
  if (work.section === 'pages') {
    html.push(field('Hervorgehobener Lernpfad', select('featured_path', [['', '–'], ...state.list.filter((x) => x.section === 'paths').map((p) => [p.id, titleOf(p)])], d.featured_path)));
    html.push(linkList('samples', 'Zum Reinschauen'));
  }
  const extra = extraFields();
  if (Object.keys(extra).length || ['courses', 'projects'].includes(work.section)) {
    const hint =
      work.section === 'projects'
        ? 'Phasen und Challenges mit ihren Kennungen. Jede Kennung braucht im Text eine Überschrift mit {#kennung}, in beiden Sprachen.'
        : work.section === 'courses'
          ? 'Abschnitte mit Titel (de/en) und Inhalten, oder ein Lernpfad als Abschnitt: - path: kennung'
          : work.section === 'paths'
            ? 'Teile des Pfads mit Titel (de/en) und ihren Schritten.'
            : 'Weitere Kopfdaten';
    html.push(field('Struktur (YAML)', `<textarea class="ed-yaml" id="yaml" spellcheck="false">${esc(Object.keys(extra).length ? yaml.dump(extra, { lineWidth: -1 }) : '')}</textarea><small id="yaml-error" class="form-error"></small>`, { wide: true, hint }));
  }
  const box = $('#shared');
  box.innerHTML = html.join('');
  for (const ul of box.querySelectorAll('[data-links]')) renderLinks(ul);
  box.oninput = sharedInput;
  box.onchange = sharedInput;
  box.onclick = sharedClick;
}

function extraFields() {
  const d = leadData();
  const handled = new Set([...HANDLED.common, ...(HANDLED[work.section] ?? [])]);
  return Object.fromEntries(Object.entries(d).filter(([k]) => !handled.has(k)));
}

function sharedInput(e) {
  const d = leadData();
  const t = e.target;
  if (t.id === 'yaml') {
    try {
      const parsed = t.value.trim() ? yaml.load(t.value) : {};
      if (parsed && typeof parsed !== 'object') throw new Error('Erwartet werden Felder mit Werten.');
      for (const k of Object.keys(extraFields())) delete d[k];
      Object.assign(d, parsed ?? {});
      $('#yaml-error').textContent = '';
    } catch (error) {
      $('#yaml-error').textContent = `YAML nicht lesbar: ${error.message.split('\n')[0]}`;
    }
    return changed();
  }
  const multiBox = t.closest('[data-multi]');
  if (multiBox) {
    const values = [...multiBox.querySelectorAll('input:checked')].map((i) => i.value);
    if (values.length || multiBox.dataset.multi === 'topics') d[multiBox.dataset.multi] = values;
    else delete d[multiBox.dataset.multi];
    return changed();
  }
  const key = t.dataset.key;
  if (!key) return;
  let value = t.value;
  if (key === 'authors') value = value.split(',').map((s) => s.trim()).filter(Boolean);
  else if (NUMBER_FIELDS.has(key) && value !== '') value = Number(value);
  if (value === '' || (Array.isArray(value) && !value.length)) delete d[key];
  else d[key] = value;
  if (key === 'type' && e.type === 'change') renderShared(); // other fields per type
  changed();
}

// relations, steps and other lists of linked documents
function getList(key) {
  const d = leadData();
  if (key.startsWith('relations.')) return d.relations?.[key.slice(10)] ?? [];
  return d[key] ?? [];
}
function setList(key, list) {
  const d = leadData();
  if (key.startsWith('relations.')) {
    const rel = key.slice(10);
    d.relations ??= {};
    if (list.length) d.relations[rel] = list;
    else delete d.relations[rel];
    if (!Object.keys(d.relations).length) delete d.relations;
  } else if (list.length || key === 'steps') d[key] = list;
  else delete d[key];
}

function renderLinks(ul) {
  const key = ul.dataset.links;
  const steps = ul.dataset.steps === 'true';
  ul.innerHTML = getList(key)
    .map((entry, i) => {
      const id = typeof entry === 'string' ? entry : entry.item;
      const target = findDoc(id);
      return `<li data-index="${i}">${target ? iconOf(target) : ''}<span>${esc(target ? titleOf(target) : `${id} (fehlt)`)}</span>
        ${steps ? `<label><input type="checkbox" data-optional ${typeof entry === 'object' && entry.optional ? 'checked' : ''}> freiwillig</label><button type="button" data-move="-1" title="nach oben">↑</button><button type="button" data-move="1" title="nach unten">↓</button>` : ''}
        <button type="button" data-remove title="entfernen">✕</button></li>`;
    })
    .join('');
}

async function sharedClick(e) {
  const add = e.target.closest('[data-add]');
  if (add) {
    const key = add.dataset.add;
    const sections = ['steps', 'samples', 'items'].includes(key) || key.startsWith('relations.') ? ['content'] : key === 'requires' ? ['content', 'paths'] : ['content'];
    const id = await pick('Inhalt wählen', sections, getList(key).map((x) => (typeof x === 'string' ? x : x.item)).concat(work.id));
    if (!id) return;
    setList(key, [...getList(key), id]);
    renderLinks($(`[data-links="${key}"]`));
    return changed();
  }
  const li = e.target.closest('.ed-links li');
  if (!li) return;
  const ul = li.parentElement;
  const key = ul.dataset.links;
  const list = clone(getList(key));
  const i = Number(li.dataset.index);
  if (e.target.matches('[data-remove]')) list.splice(i, 1);
  else if (e.target.matches('[data-move]')) {
    const j = i + Number(e.target.dataset.move);
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
  } else if (e.target.matches('[data-optional]')) {
    const id = typeof list[i] === 'string' ? list[i] : list[i].item;
    list[i] = e.target.checked ? { item: id, optional: true } : id;
  } else return;
  setList(key, list);
  renderLinks(ul);
  changed();
}

// --- language tabs and text --------------------------------------------------

function renderTabs() {
  $('#tabs').innerHTML = ['de', 'en']
    .map((l) => {
      const file = work.files[l];
      const note = !file ? 'fehlt' : l === work.lead ? 'Original' : stale(l) ? 'veraltet' : 'Übersetzung';
      return `<button type="button" role="tab" data-lang="${l}" aria-selected="${l === lang}">${LANG_NAME[l]}<small>${note}</small></button>`;
    })
    .join('');
  $('#tabs').onclick = (e) => {
    const b = e.target.closest('[data-lang]');
    if (!b) return;
    lang = b.dataset.lang;
    $('#view').href = doc.url?.[lang] ?? '#';
    renderTabs();
    renderLang();
  };
}

const stale = (l) => {
  const f = work.files[l];
  return f && l !== work.lead && f.data.based_on && f.data.based_on < leadData().updated;
};

function renderLang() {
  const box = $('#lang');
  const file = work.files[lang];
  if (!file) {
    box.innerHTML = `<p>Es gibt noch keine ${LANG_NAME[lang].toLowerCase()}e Fassung.</p>
      <button type="button" class="button" id="translate">${LANG_NAME[lang]}e Fassung anlegen</button>
      <p class="muted">Sie beginnt als Kopie des Originals und gilt als veraltet, bis du sie übersetzt und als aktuell markiert hast.</p>`;
    $('#translate').onclick = createTranslation;
    return;
  }
  const d = file.data;
  const isLead = lang === work.lead;
  const pathFields = work.section === 'paths';
  box.innerHTML = `
    ${stale(lang) ? `<p class="notice">Diese Fassung folgt dem Original vom ${d.based_on}; das Original hat den Stand ${leadData().updated}.</p>` : ''}
    <div class="ed-grid">
      ${field('Titel', `<input data-text="title" value="${esc(d.title)}">`, { wide: true })}
      ${field('Kurzbeschreibung', `<textarea data-text="summary" rows="2">${esc(d.summary)}</textarea>`, { wide: true, hint: 'Ein bis zwei Sätze, erscheint in Listen und in der Suche.' })}
      ${pathFields ? field('Ziel', `<textarea data-text="goal" rows="2">${esc(d.goal)}</textarea>`, { wide: true }) : ''}
      ${pathFields ? field('Für wen', `<input data-text="audience" value="${esc(d.audience)}">`, { wide: true }) : ''}
    </div>
    <div class="ed-split">
      <div>
        <div class="ed-toolbar">
          <button type="button" data-insert="link">Verknüpfen</button>
          <button type="button" data-insert="NOTE">Hinweis</button>
          <button type="button" data-insert="TIP">Tipp</button>
          <button type="button" data-insert="WARNING">Achtung</button>
          ${leadData().type === 'quiz' ? '<button type="button" data-insert="question">Frage</button>' : ''}
          ${work.section === 'projects' ? '<button type="button" data-insert="phase">Phase</button><button type="button" data-insert="challenge">Challenge</button>' : ''}
        </div>
        <textarea class="ed-body" id="body" spellcheck="true" lang="${lang}">${esc(file.body.replace(/^\n+/, ''))}</textarea>
      </div>
      <div class="ed-preview prose" id="preview" lang="${lang}"></div>
    </div>
    ${isLead
      ? `<label class="ed-check"><input type="checkbox" id="touch" checked> Beim Speichern den Stand auf heute setzen (bei inhaltlichen Änderungen)</label>`
      : `<label class="ed-check"><input type="checkbox" id="current"> Diese Fassung entspricht dem aktuellen Original</label>`}`;
  box.oninput = (e) => {
    const t = e.target;
    if (t.dataset.text) file.data[t.dataset.text] = t.value;
    if (t.id === 'body') {
      file.body = t.value;
      schedulePreview();
    }
    changed();
  };
  box.onclick = toolbar;
  preview();
}

let previewTimer;
const schedulePreview = () => {
  clearTimeout(previewTimer);
  previewTimer = setTimeout(preview, 300);
};
async function preview() {
  const file = work.files[lang];
  if (!file || !$('#preview')) return;
  const result = await api('POST', '/api/preview', { markdown: file.body, lang, quiz: leadData().type === 'quiz' });
  // The preview is rendered by the site's own Markdown pipeline, which drops raw HTML.
  $('#preview').innerHTML = result.html ?? '';
}

async function toolbar(e) {
  const kind = e.target.dataset?.insert;
  if (!kind) return;
  const area = $('#body');
  let text;
  if (kind === 'link') {
    const id = await pick('Verknüpfen mit', ['content', 'paths', 'projects'], [work.id]);
    if (!id) return;
    const selected = area.value.slice(area.selectionStart, area.selectionEnd);
    text = selected ? `[[${id}|${selected}]]` : `[[${id}]]`;
  } else if (kind === 'question') text = '\n## Frage?\n\n- [ ] Falsche Antwort\n- [x] Richtige Antwort\n\n> Erklärung, warum.\n';
  else if (kind === 'phase') text = '\n## Neue Phase {#neue-phase}\n\nWorum es in dieser Phase geht.\n';
  else if (kind === 'challenge') text = '\n### Challenge: Titel {#neue-challenge}\n\n**Ziel:** …\n';
  else text = `\n> [!${kind}]\n> Text\n`;
  area.setRangeText(text, area.selectionStart, area.selectionEnd, 'end');
  area.focus();
  area.dispatchEvent(new Event('input', { bubbles: true }));
}

function createTranslation() {
  const lead = work.files[work.lead];
  const updated = new Date(`${leadData().updated}T00:00:00Z`);
  updated.setUTCDate(updated.getUTCDate() - 1);
  const data = { title: lead.data.title, summary: lead.data.summary };
  if (work.section === 'paths') Object.assign(data, { goal: lead.data.goal, audience: lead.data.audience });
  Object.assign(data, { translation_of: work.lead, based_on: updated.toISOString().slice(0, 10) });
  work.files[lang] = { data, body: lead.body };
  renderTabs();
  renderLang();
  changed();
}

// --- saving, archiving, deleting ---------------------------------------------

function message(kind, title, lines = []) {
  const box = $('#messages');
  if (!box) return alert([title, ...lines].join('\n'));
  box.insertAdjacentHTML(
    'beforeend',
    `<div class="ed-msg ${kind === 'error' ? 'is-error' : kind === 'warning' ? 'is-warning' : ''}"><strong>${esc(title)}</strong>${lines.length ? `<ul>${lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}</div>`,
  );
}

async function save() {
  $('#messages').innerHTML = '';
  const files = clone(work.files);
  const lead = files[work.lead];
  const leadChanged = JSON.stringify(lead) !== JSON.stringify(doc.files[work.lead]);
  // A changed original gets today's date, unless the box on its tab says otherwise.
  const touch = $('#touch') ? $('#touch').checked : true;
  if (leadChanged && touch && 'updated' in lead.data) lead.data.updated = today();
  const current = $('#current')?.checked;
  if (current && lang !== work.lead && files[lang]) files[lang].data.based_on = lead.data.updated;
  // send only what changed; unchanged files stay exactly as they are
  const changedFiles = Object.fromEntries(Object.entries(files).filter(([l, f]) => JSON.stringify(f) !== JSON.stringify(doc.files[l])));
  if (!Object.keys(changedFiles).length) return message('ok', 'Nichts zu speichern.'), true;
  const result = await api('PUT', `/api/doc/${work.section}/${work.id}`, { files: changedFiles });
  if (!result.ok) return message('error', 'Nicht gespeichert, weil die Wissensbasis sonst Fehler hätte:', result.errors), false;
  doc = { ...result.doc, url: doc.url };
  work = clone({ section: doc.section, id: doc.id, lead: doc.lead, files: doc.files });
  await refresh();
  renderDoc();
  message('ok', 'Gespeichert. Die Seite in der Vorschau baut sich gerade neu.');
  if (result.warnings?.length) message('warning', 'Hinweise:', result.warnings);
  if (result.elsewhere?.length) message('warning', 'Fehler an anderer Stelle der Wissensbasis:', result.elsewhere);
  return true;
}

async function toggleArchive() {
  const d = leadData();
  const archiving = d.status !== 'archived';
  if (archiving) {
    const ok = await confirmDialog(
      'Archivieren?',
      '<p>Der Inhalt verschwindet von der Seite. Die Datei bleibt erhalten, Kennung und Code bleiben reserviert, und der Fortschritt von Lernenden geht nicht verloren. Wiederherstellen ist jederzeit möglich.</p><p>Was noch auf ihn verweist, muss vorher gelöst werden; der Editor zeigt es dir.</p>',
      'Archivieren',
    );
    if (!ok) return;
  }
  const before = d.status;
  d.status = archiving ? 'archived' : 'draft';
  if (!(await save())) {
    d.status = before;
    $('#status').value = before;
    changed();
  }
}

async function remove() {
  const ok = await confirmDialog(
    'Endgültig löschen?',
    `<p><strong>${esc(leadData().title)}</strong> wird mit allen Sprachfassungen gelöscht. Kennung und Code werden frei, und der Fortschritt, den Lernende bei diesem Inhalt haben, geht verloren.</p><p>Rückgängig machen lässt sich das nur über Git, solange die letzte Fassung gesichert ist. Wenn der Inhalt nur von der Seite verschwinden soll, ist Archivieren der bessere Weg.</p>`,
    'Löschen',
    true,
  );
  if (!ok) return;
  const result = await api('DELETE', `/api/doc/${work.section}/${work.id}`);
  if (!result.ok) return message('error', 'Nicht gelöscht, weil noch etwas darauf verweist:', result.errors);
  doc = work = null;
  $('#doc').innerHTML = '<div class="ed-empty"><h1>Gelöscht</h1><p class="lead">Der Inhalt ist entfernt.</p></div>';
  await refresh();
}

async function commit() {
  const files = state.git.changes.map((f) => `<li><code>${esc(f)}</code></li>`).join('');
  const ok = await confirmDialog(
    'In Git sichern',
    `<p>Diese Änderungen in <code>knowledge/</code> werden als ein Commit gesichert, nur auf diesem Rechner:</p><ul>${files}</ul><label class="ed-field"><span>Beschreibung</span><input id="commit-message" value="Update knowledge base"></label>`,
    'Sichern',
  );
  if (!ok) return;
  const result = await api('POST', '/api/commit', { message: $('#commit-message')?.value });
  await refresh();
  if (!result.ok) message('error', 'Nicht gesichert:', result.errors ?? [result.output]);
}

// A push to GitHub publishes: the site is built there and is up to date a
// minute or two later (.github/workflows/pages.yml).
async function publish() {
  const { ahead, changes } = state.git;
  const unsaved = changes.length
    ? `<p>${changes.length} ${changes.length === 1 ? 'Änderung ist' : 'Änderungen sind'} noch nicht gesichert und ${changes.length === 1 ? 'geht' : 'gehen'} nicht mit; sichere sie vorher, wenn sie dazugehören.</p>`
    : '';
  const ok = await confirmDialog(
    'Veröffentlichen',
    `<p>${ahead} gesicherte ${ahead === 1 ? 'Änderung geht' : 'Änderungen gehen'} zu GitHub, und die Seite ist nach ein bis zwei Minuten aktuell. Auf der Seite erscheint nur, was den Status „Veröffentlicht“ hat; Entwürfe sind dort nur mit <code>?drafts</code> zu sehen.</p>${unsaved}`,
    'Veröffentlichen',
  );
  if (!ok) return;
  const result = await api('POST', '/api/publish');
  await refresh();
  if (result.ok) message('ok', 'Veröffentlicht. GitHub baut die Seite jetzt neu.');
  else message('error', 'Nicht veröffentlicht:', result.errors ?? [result.output]);
}

// --- dialogs --------------------------------------------------------------------

function confirmDialog(title, html, okLabel, danger = false) {
  const dialog = $('#confirm');
  $('#confirm-title').textContent = title;
  $('#confirm-text').innerHTML = html;
  $('#confirm-ok').textContent = okLabel;
  $('#confirm-ok').classList.toggle('danger', danger);
  dialog.returnValue = '';
  dialog.showModal();
  // Buttons answer directly; the close event (Escape) is only the fallback,
  // because browsers deliver it with the next rendered frame.
  return new Promise((resolve) => {
    let answered = false;
    const answer = (ok) => {
      if (answered) return;
      answered = true;
      resolve(ok);
    };
    $('#confirm-ok').onclick = () => answer(true);
    dialog.querySelector('button[value="cancel"]').onclick = () => answer(false);
    dialog.addEventListener('close', () => answer(dialog.returnValue === 'ok'), { once: true });
  });
}

function pick(title, sections, exclude = []) {
  const dialog = $('#picker');
  $('#picker-title').textContent = title;
  const filter = $('#picker-filter');
  filter.value = '';
  const candidates = state.list.filter((d) => sections.includes(d.section) && !exclude.includes(d.id) && d.status !== 'archived');
  const render = () =>
    ($('#picker-list').innerHTML = candidates
      .filter((d) => matches(d, filter.value))
      .map((d) => `<li><button type="button" data-id="${d.id}">${iconOf(d)}<span class="d-title">${esc(titleOf(d))}</span><span></span><span class="d-meta"><span>${d.code ?? ''}</span><span>${d.id}</span></span></button></li>`)
      .join(''));
  render();
  filter.oninput = render;
  dialog.returnValue = '';
  dialog.showModal();
  filter.focus();
  return new Promise((resolve) => {
    $('#picker-list').onclick = (e) => {
      const b = e.target.closest('[data-id]');
      if (!b) return;
      resolve(b.dataset.id);
      dialog.close();
    };
    dialog.querySelector('button[value="cancel"]').onclick = () => resolve(null);
    dialog.addEventListener('close', () => resolve(null), { once: true });
  });
}

// --- creating -----------------------------------------------------------------

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

$('#new').addEventListener('click', () => createDialog());

function createDialog(section = state.section === 'pages' ? 'content' : state.section) {
  const v = state.vocabulary;
  const form = $('#create-form');
  const items = state.list.filter((d) => d.section === 'content' && d.status !== 'archived');
  const opt = (pairs, value) => pairs.map(([k, l]) => `<option value="${esc(k)}" ${k === value ? 'selected' : ''}>${esc(l)}</option>`).join('');
  form.innerHTML = `
    <h2>Neu anlegen</h2>
    <div class="ed-grid">
      ${field('Art', `<select name="section">${opt(SECTIONS.filter(([s]) => s !== 'pages').map(([s, l]) => [s, l]), section)}</select>`)}
      ${field('Sprache des Originals', `<select name="lang">${opt([['de', 'Deutsch'], ['en', 'Englisch']], 'de')}</select>`)}
      ${field('Titel', '<input name="title" required>', { wide: true })}
      ${field('Kennung', '<input name="id" required pattern="[a-z0-9]+(-[a-z0-9]+)*">', { wide: true, hint: 'Englisch, kleingeschrieben mit Bindestrichen, z. B. logic-gates. Sie bleibt für immer gleich.' })}
      ${field('Kurzbeschreibung', '<textarea name="summary" rows="2" required></textarea>', { wide: true })}
      ${section === 'content' ? field('Typ', `<select name="type">${opt(Object.entries(v.types).map(([k, l]) => [k, l.de]), 'lesson')}</select>`) : ''}
      ${['content', 'projects'].includes(section) ? field('Thema', `<select name="topic">${opt(Object.entries(v.topics).map(([k, l]) => [k, l.de]))}</select>`) : ''}
      ${['paths', 'courses'].includes(section) ? field('Erster Inhalt', `<select name="first">${opt(items.map((d) => [d.id, titleOf(d)]))}</select>`, { hint: 'Weitere fügst du danach hinzu.' }) : ''}
      ${section === 'courses' ? field('Modul', `<select name="module">${opt(Object.entries(v.modules).map(([k, l]) => [k, l.de]))}</select>`) + field('Semester', '<input name="semester" required placeholder="2026-27 - WS">') + field('Kurs-Code', '<input name="access" required pattern="[A-Z0-9-]{4,16}" placeholder="LICHT-26">') : ''}
    </div>
    <p class="form-error" id="create-error"></p>
    <p class="ed-actions"><button class="text-button" value="cancel" formnovalidate>Abbrechen</button><button class="button" value="ok">Anlegen</button></p>`;
  const idInput = form.elements.id;
  let idTouched = false;
  idInput.oninput = () => (idTouched = true);
  form.elements.title.oninput = (e) => !idTouched && (idInput.value = slug(e.target.value));
  form.elements.section.onchange = (e) => createDialog(e.target.value);
  $('#create').showModal();
  form.onsubmit = async (e) => {
    if (e.submitter?.value !== 'ok') return;
    e.preventDefault();
    const f = Object.fromEntries(new FormData(form));
    const { code } = await api('GET', '/api/code');
    const base = { title: f.title.trim(), summary: f.summary.trim() };
    let data;
    let body = '';
    if (f.section === 'content') {
      data = { type: f.type, code, ...base, level: 1, duration: 10, topics: [f.topic], status: 'draft', updated: today() };
      body = f.type === 'quiz' ? '## Erste Frage?\n\n- [ ] Falsch\n- [x] Richtig\n\n> Warum.\n' : '## Worum es geht\n\nText …\n';
    } else if (f.section === 'paths') {
      data = { kind: 'path', code, ...base, goal: base.summary, audience: f.lang === 'de' ? 'Alle Interessierten' : 'Everyone interested', level: 1, steps: [f.first], status: 'draft', updated: today() };
    } else if (f.section === 'courses') {
      data = { kind: 'course', code, access_code: f.access, module: f.module, semester: f.semester, ...base, sections: [{ title: { de: 'Abschnitt 1', en: 'Section 1' }, items: [f.first] }], status: 'draft', updated: today() };
    } else {
      data = { kind: 'project', code, ...base, level: 1, topics: [f.topic], phases: [{ id: 'phase-1' }], status: 'draft', updated: today() };
      body = f.lang === 'de' ? 'Worum es im Projekt geht.\n\n## Erste Phase {#phase-1}\n\nWorum es in dieser Phase geht.\n' : 'What the project is about.\n\n## First phase {#phase-1}\n\nWhat this phase is about.\n';
    }
    const result = await api('POST', `/api/doc/${f.section}/${f.id}`, { files: { [f.lang]: { data, body } } });
    if (!result.ok) return ($('#create-error').textContent = result.errors.join(' · '));
    $('#create').close();
    state.section = f.section;
    await refresh();
    await open(f.section, f.id, { force: true });
    message('ok', 'Angelegt, als Entwurf. Ergänze jetzt den Text.');
  };
}

// --- keyboard ---------------------------------------------------------------------

addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's' && work) {
    e.preventDefault();
    save();
  }
});

await refresh();
const wanted = new URLSearchParams(location.search);
if (wanted.get('doc')) {
  const [section, id] = wanted.get('doc').split('/');
  open(section, id);
}
