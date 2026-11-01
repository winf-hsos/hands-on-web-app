// Editing in place on the site pages the editor serves (Nicolas, 2026-11-01).
// The site with drafts marks what can be changed: `data-field` names a field
// of the front matter (templates/parts.mjs, editable()), `data-src` gives a
// block of the text its place in the Markdown source (build/remark-knowledge.mjs).
// A click on such a part turns it into an editor for exactly what it shows:
// a title or summary becomes editable text, a block of the text its Markdown,
// topics and modules a list to pick from, the relations a list of items. A
// change is saved at once (PATCH /api/doc, with the same checks as any save),
// and the page reloads with the result as soon as nothing is open any more.
// A click with Ctrl or Cmd still follows a link.

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// fields written as plain text in the file of the language shown
const TEXT = new Set(['title', 'summary', 'goal', 'subtitle', 'audience']);
// single values of the original, shown as one row of the details
const SCALAR = { year: 'number', publisher: 'text', isbn: 'text', venue: 'text', doi: 'text', license: 'text', when: 'text' };
// blocks that are themselves interactive get a button to edit them instead of a click
const WIDGETS = '.runner, .demo, .quiz-question, details';

export function enableInlineEditing({ doc, vocabulary, items, api, say, session }) {
  const pageLang = document.documentElement.lang || 'de';
  const shownLang = document.querySelector('h1[lang]')?.lang || pageLang;

  /** The document as it is on disk now; every editor starts from it. */
  async function load() {
    const source = await api('GET', `/api/doc/${doc.section}/${doc.id}`);
    if (!source.files) throw new Error((source.errors ?? []).join(' · ') || 'Konnte den Inhalt nicht laden.');
    return source;
  }

  async function save(lang, change) {
    say('Speichert …');
    const result = await api('PATCH', `/api/doc/${doc.section}/${doc.id}`, { lang, ...change });
    if (!result.ok) {
      say(`Nicht gespeichert: ${(result.errors ?? []).join(' · ')}`, true);
      return false;
    }
    say('Gespeichert, die Seite baut sich neu …');
    // the places of the blocks on this page are old now; nothing more until it has reloaded
    session.locked = true;
    return true;
  }

  // one editor at a time; while it is open the page does not reload
  function open() {
    session.editing = true;
    document.body.classList.add('ed-is-editing');
  }
  function close() {
    document.body.classList.remove('ed-is-editing');
    session.done();
  }

  // --- text fields: title, summary and the like ---------------------------------

  async function editText(el, key) {
    const target = el.matches('div') ? el.querySelector('dd') : el;
    // a title or summary names the language of its file; a row of the details does not
    const lang = el.matches('[lang]') ? el.lang : shownLang;
    const source = await load();
    const before = source.files[lang]?.data[key] ?? '';
    const shown = target.innerHTML;
    open();
    target.textContent = before;
    target.contentEditable = 'plaintext-only';
    target.classList.add('ed-inline-active');
    target.focus();
    getSelection().selectAllChildren(target);
    let finished = false;
    const finish = async (keep) => {
      if (finished) return;
      finished = true;
      target.contentEditable = 'false';
      target.classList.remove('ed-inline-active');
      const value = target.textContent.replace(/\s+/g, ' ').trim();
      if (!keep || value === before || (!(await save(lang, { data: { [key]: value || null } })))) target.innerHTML = shown;
      close();
    };
    target.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') e.preventDefault(), finish(true);
      if (e.key === 'Escape') finish(false);
    });
    target.addEventListener('blur', () => finish(true), { once: true });
  }

  // --- a block of the text, as Markdown ----------------------------------------------

  async function editBlock(block) {
    const [start, end] = block.dataset.src.split('-').map(Number);
    const lang = block.closest('.prose')?.lang || shownLang;
    const source = await load();
    const expected = source.files[lang].body.slice(start, end);
    open();
    const box = document.createElement('div');
    box.className = 'ed-inline-block';
    box.innerHTML = `<textarea class="ed-inline-source" spellcheck="true" aria-label="Markdown dieses Abschnitts"></textarea>
      <p class="ed-inline-actions">
        <button type="button" class="ed-banner-button is-primary" data-act="save">Speichern</button>
        <button type="button" class="ed-banner-button" data-act="cancel">Abbrechen</button>
        <span class="ed-inline-hint">Markdown · Strg+Enter speichert · Esc bricht ab · leer gespeichert ist der Abschnitt weg</span>
      </p>`;
    const area = box.querySelector('textarea');
    area.value = expected;
    const fit = () => ((area.style.height = 'auto'), (area.style.height = `${area.scrollHeight + 4}px`));
    area.addEventListener('input', fit);
    const display = block.style.display;
    block.style.display = 'none';
    block.after(box);
    fit();
    area.focus();
    const finish = async (keep) => {
      if (keep && area.value !== expected) {
        if (!(await save(lang, { body: { start, end, expected, text: area.value } }))) return;
        box.querySelector('.ed-inline-actions').innerHTML = '<span class="ed-inline-hint">Gespeichert, die Seite baut sich neu …</span>';
        area.readOnly = true;
      } else {
        box.remove();
        block.style.display = display;
      }
      close();
    };
    box.addEventListener('click', (e) => {
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (act) finish(act === 'save');
    });
    area.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) e.preventDefault(), finish(true);
      if (e.key === 'Escape') finish(false);
    });
  }

  // --- small forms in place: lists, a level, type and duration, single values ------

  /** A panel in place of `el` with the given inner HTML and Save and Cancel; `read` gives the change. */
  function panel(el, inner, read, lang) {
    open();
    const box = document.createElement('div');
    box.className = 'ed-inline-panel';
    box.innerHTML = `${inner}
      <p class="ed-inline-actions">
        <button type="button" class="ed-banner-button is-primary" data-act="save">Speichern</button>
        <button type="button" class="ed-banner-button" data-act="cancel">Abbrechen</button>
      </p>`;
    const display = el.style.display;
    el.style.display = 'none';
    el.after(box);
    box.querySelector('select, input')?.focus();
    const finish = async (keep) => {
      if (keep && !(await save(lang, { data: read(box) }))) return;
      if (keep) box.querySelector('.ed-inline-actions').innerHTML = '<span class="ed-inline-hint">Gespeichert, die Seite baut sich neu …</span>';
      else {
        box.remove();
        el.style.display = display;
      }
      close();
    };
    box.addEventListener('click', (e) => {
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (act) finish(act === 'save');
    });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') finish(false);
      if (e.key === 'Enter' && e.target.matches('input:not([list])')) e.preventDefault(), finish(true);
    });
    return box;
  }

  /** Chips for the chosen keys, each with a button to remove it, and a menu to add one. */
  function chooser(box, labels, chosen, name) {
    const draw = () => {
      box.querySelector('.ed-inline-chips').innerHTML =
        chosen.map((k) => `<span class="ed-inline-chip">${esc(labels[k] ?? k)}<button type="button" data-remove="${esc(k)}" aria-label="${esc(labels[k] ?? k)} entfernen">×</button></span>`).join('') ||
        '<span class="ed-inline-hint">keine</span>';
      box.querySelector('select').innerHTML =
        `<option value="">${esc(name)} hinzufügen …</option>` +
        Object.entries(labels)
          .filter(([k]) => !chosen.includes(k))
          .map(([k, label]) => `<option value="${esc(k)}">${esc(label)}</option>`)
          .join('');
    };
    box.addEventListener('click', (e) => {
      const k = e.target.closest('[data-remove]')?.dataset.remove;
      if (k) chosen.splice(chosen.indexOf(k), 1), draw();
    });
    box.querySelector('select').addEventListener('change', (e) => {
      if (e.target.value) chosen.push(e.target.value), draw();
    });
    draw();
  }

  async function editList(el, key, labels, name) {
    const source = await load();
    const lead = source.files[source.lead].data;
    const chosen = [...(lead[key] ?? [])];
    const box = panel(el, '<div class="ed-inline-chips"></div><select></select>', () => ({ [key]: chosen.length ? chosen : null }), source.lead);
    chooser(box, labels, chosen, name);
  }

  async function editLevel(el) {
    const source = await load();
    const lead = source.files[source.lead].data;
    const options = Object.entries(vocabulary.levels).map(([k, label]) => `<option value="${k}" ${String(lead.level) === k ? 'selected' : ''}>${esc(label)}</option>`).join('');
    panel(el, `<label class="ed-inline-label">Stufe <select>${options}</select></label>`, (box) => ({ level: Number(box.querySelector('select').value) }), source.lead);
  }

  async function editKicker(el) {
    const source = await load();
    const lead = source.files[source.lead].data;
    const types = Object.entries(vocabulary.types).map(([k, label]) => `<option value="${k}" ${lead.type === k ? 'selected' : ''}>${esc(label)}</option>`).join('');
    panel(
      el,
      `<label class="ed-inline-label">Art <select name="type">${types}</select></label>
       <label class="ed-inline-label">Dauer in Minuten <input name="duration" type="number" min="1" step="1" value="${esc(lead.duration)}"></label>`,
      (box) => ({ type: box.querySelector('[name=type]').value, duration: Number(box.querySelector('[name=duration]').value) }),
      source.lead,
    );
  }

  async function editScalar(el, key) {
    const source = await load();
    const lead = source.files[source.lead].data;
    const list = key === 'authors';
    const value = list ? (lead.authors ?? []).join(', ') : lead[key] ?? '';
    panel(
      el,
      `<label class="ed-inline-label">${esc(el.querySelector('dt')?.textContent ?? key)} <input type="${SCALAR[key] ?? 'text'}" value="${esc(value)}">${list ? '<span class="ed-inline-hint">durch Kommas getrennt</span>' : ''}</label>`,
      (box) => {
        const raw = box.querySelector('input').value.trim();
        if (!raw) return { [key]: null };
        if (list) return { authors: raw.split(',').map((s) => s.trim()).filter(Boolean) };
        return { [key]: SCALAR[key] === 'number' ? Number(raw) : raw };
      },
      source.lead,
    );
  }

  // --- relations to other items ------------------------------------------------------

  async function editRelations(el) {
    const source = await load();
    const lead = source.files[source.lead].data;
    const relations = Object.fromEntries(Object.keys(vocabulary.relations).map((k) => [k, [...(lead.relations?.[k] ?? [])]]));
    const title = Object.fromEntries(items.map((i) => [i.id, i.title]));
    const others = items.filter((i) => i.id !== doc.id);
    const groups = Object.entries(vocabulary.relations)
      .map(
        ([k, label]) => `<div class="ed-inline-relation" data-relation="${k}">
          <p class="ed-inline-label">${esc(label)}</p>
          <div class="ed-inline-chips"></div>
          <input list="ed-inline-items" placeholder="Inhalt suchen und mit Enter hinzufügen" aria-label="${esc(label)}: Inhalt hinzufügen">
        </div>`,
      )
      .join('');
    const box = panel(
      el,
      `<p class="ed-inline-hint">Verknüpfungen dieses Inhalts. Was andere Inhalte mit ihm verknüpfen, steht bei ihnen.</p>${groups}
       <datalist id="ed-inline-items">${others.map((i) => `<option value="${esc(i.title)}">${esc(i.id)}</option>`).join('')}</datalist>`,
      () => {
        const kept = Object.fromEntries(Object.entries(relations).filter(([, ids]) => ids.length));
        return { relations: Object.keys(kept).length ? kept : null };
      },
      source.lead,
    );
    const draw = (k) => {
      box.querySelector(`[data-relation="${k}"] .ed-inline-chips`).innerHTML = relations[k]
        .map((id) => `<span class="ed-inline-chip">${esc(title[id] ?? id)}<button type="button" data-unlink="${k} ${id}" aria-label="${esc(title[id] ?? id)} entfernen">×</button></span>`)
        .join('');
    };
    Object.keys(relations).forEach(draw);
    box.addEventListener('click', (e) => {
      const [k, id] = e.target.closest('[data-unlink]')?.dataset.unlink.split(' ') ?? [];
      if (k) relations[k].splice(relations[k].indexOf(id), 1), draw(k);
    });
    box.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || !e.target.matches('input[list]')) return;
      e.preventDefault();
      const k = e.target.closest('[data-relation]').dataset.relation;
      const typed = e.target.value.trim();
      const found = others.find((i) => i.title === typed || i.id === typed);
      if (!found) return say(`Kein Inhalt heißt „${typed}“.`, true);
      if (!relations[k].includes(found.id)) relations[k].push(found.id), draw(k);
      e.target.value = '';
    });
  }

  // --- what you learn: the sentence and the goals, in the language shown -----------------

  async function editObjectives(el) {
    const lang = el.lang || shownLang;
    const source = await load();
    const now = source.files[lang]?.data.objectives ?? {};
    panel(
      el,
      `<label class="ed-inline-label">Einleitender Satz <input name="intro" value="${esc(now.intro)}" style="width: 100%"></label>
       <label class="ed-inline-label">Lernziele, eines je Zeile <textarea name="goals" class="ed-inline-source" rows="5">${esc((now.goals ?? []).join('\n'))}</textarea></label>`,
      (box) => {
        const intro = box.querySelector('[name=intro]').value.trim();
        const goals = box.querySelector('[name=goals]').value.split('\n').map((g) => g.replace(/^\s*[-*]\s*/, '').trim()).filter(Boolean);
        return { objectives: intro || goals.length ? { intro, goals } : null };
      },
      lang,
    );
  }

  // --- what a click opens ----------------------------------------------------------------

  function editField(el) {
    const key = el.dataset.field;
    if (TEXT.has(key)) return editText(el, key);
    if (key === 'objectives') return editObjectives(el);
    if (key === 'topics') return editList(el, 'topics', vocabulary.topics, 'Thema');
    if (key === 'modules') return editList(el, 'modules', vocabulary.modules, 'Modul');
    if (key === 'level') return editLevel(el);
    if (key === 'kicker') return editKicker(el);
    if (key === 'relations') return editRelations(el);
    if (key in SCALAR || key === 'authors') return editScalar(el, key);
  }

  // Rows the page leaves out when they are empty, so that they can be filled.
  if (doc.section === 'content' || doc.section === 'projects') {
    const facts = document.querySelector('.facts');
    if (facts && !facts.querySelector('[data-field="modules"]')) {
      facts.querySelector('[data-field="level"]')?.insertAdjacentHTML('afterend', `<div data-field="modules" class="ed-inline-empty"><dt>${pageLang === 'en' ? 'Modules' : 'Module'}</dt><dd>–</dd></div>`);
    }
  }
  if (doc.section === 'content' && !document.querySelector('[data-field="objectives"]')) {
    document.querySelector('.page-head')?.insertAdjacentHTML('afterend', `<p class="ed-inline-empty" data-field="objectives" lang="${shownLang}">Was du lernst ergänzen</p>`);
  }
  if (doc.section === 'content' && !document.querySelector('[data-field="relations"]')) {
    document.querySelector('.finish')?.insertAdjacentHTML('afterend', '<p class="ed-inline-empty" data-field="relations">Mit anderen Inhalten verknüpfen</p>');
  }

  // A button over blocks that are interactive themselves, such as code boxes.
  const handle = document.createElement('button');
  handle.type = 'button';
  handle.className = 'ed-inline-handle';
  handle.textContent = 'Bearbeiten';
  handle.hidden = true;
  document.body.append(handle);
  let hovered = null;
  document.addEventListener('mouseover', (e) => {
    if (session.editing || e.target === handle) return;
    const block = e.target.closest('.prose > [data-src]');
    if (!block || !block.matches(WIDGETS)) return;
    hovered = block;
    const box = block.getBoundingClientRect();
    Object.assign(handle.style, { top: `${box.top + scrollY + 6}px`, left: `${box.right + scrollX - 6}px` });
    handle.hidden = false;
  });
  handle.addEventListener('click', () => {
    handle.hidden = true;
    if (session.locked) return say('Einen Moment, die Seite baut sich nach dem Speichern neu …');
    if (hovered && !session.editing) editBlock(hovered);
  });

  document.addEventListener(
    'click',
    (e) => {
      if (session.editing || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
      const block = e.target.closest('.prose > [data-src]');
      const field = !block && e.target.closest('[data-field]');
      if (!block && !field) return;
      if (block?.matches(WIDGETS)) return;
      // summaries open their details, inputs and buttons keep working
      const interactive = e.target.closest('button, input, textarea, select, summary, label, iframe, video, audio');
      if (interactive && (block ?? field).contains(interactive)) return;
      e.preventDefault();
      e.stopPropagation();
      if (session.locked) return say('Einen Moment, die Seite baut sich nach dem Speichern neu …');
      (block ? editBlock(block) : editField(field)).catch((error) => {
        say(error.message, true);
        close();
      });
    },
    true,
  );
  document.body.classList.add('ed-can-edit');
}
