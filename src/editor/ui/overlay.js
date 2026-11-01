// The editor banner on every page of the site as the editor serves it
// (scripts/editor.mjs). It says that this is the editor, and on the page of a
// content item, learning path, course or project it offers "Bearbeiten" and,
// with one click, "Freigeben" or "Zurück zum Entwurf". A release changes the
// file only; the site on the web shows it after the next push.

const MARK = '<svg class="mark" width="26" height="14" viewBox="0 0 26 14" aria-hidden="true"><rect x="0.5" y="0.5" width="11" height="13" rx="2.5" fill="currentColor"/><rect x="14.5" y="0.5" width="11" height="13" rx="2.5" fill="none" stroke="currentColor"/></svg>';
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

async function api(method, path, body) {
  const response = await fetch(path, {
    method,
    headers: { 'Content-Type': 'application/json', 'X-Editor': '1' },
    body: body ? JSON.stringify(body) : undefined,
  });
  return response.json().catch(() => ({ ok: false, errors: ['Der Editor hat nicht lesbar geantwortet.'] }));
}

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

/** One line on what is not on the web yet; the dialogs for it are in the forms. */
function gitText(git) {
  if (!git?.available) return '';
  if (git.changes.length) return `${plural(git.changes.length, 'Änderung', 'Änderungen')} nicht gesichert`;
  if (git.ahead) return `${plural(git.ahead, 'Commit', 'Commits')} nicht veröffentlicht`;
  return 'Alles veröffentlicht';
}

/** Where the badge stands: a draft, released but not on the web yet, or live. */
function statusBadge(doc) {
  if (doc.status === 'draft') return '<span class="ed-banner-badge is-draft">Entwurf</span>';
  if (doc.status === 'archived') return '<span class="ed-banner-badge">Archiviert</span>';
  if (doc.status === 'published' && doc.pending) return '<span class="ed-banner-badge is-pending" title="Wird beim nächsten Veröffentlichen live">Freigegeben, noch nicht live</span>';
  if (doc.status === 'published') return '<span class="ed-banner-badge is-live">Live</span>';
  return '';
}

function docPart(doc) {
  if (!doc) return '<span class="ed-banner-note">Ansicht mit allen Entwürfen</span>';
  const errors = doc.errors
    ? `<span class="ed-banner-badge is-error" title="${esc(doc.problems.join('\n'))}">${plural(doc.errors, 'Fehler', 'Fehler')}</span>`
    : '';
  const release =
    doc.status === 'draft'
      ? '<button type="button" class="ed-banner-button is-primary" data-status="published">Freigeben</button>'
      : doc.status === 'published'
        ? '<button type="button" class="ed-banner-button" data-status="draft">Zurück zum Entwurf</button>'
        : '';
  return `${statusBadge(doc)}${errors}
    <a class="ed-banner-button" href="/edit/?doc=${doc.section}/${doc.id}">Bearbeiten</a>${release}`;
}

/** The same page with drafts, or as the public sees it. */
function viewSwitch() {
  const drafts = location.pathname.startsWith('/drafts/');
  const href = drafts ? location.pathname.slice('/drafts'.length) : `/drafts${location.pathname}`;
  return `<a class="ed-banner-link" href="${href}${location.search}${location.hash}">${drafts ? 'Ohne Entwürfe ansehen' : 'Mit Entwürfen ansehen'}</a>`;
}

async function render(banner) {
  const { doc, git } = await api('GET', `/api/page?path=${encodeURIComponent(location.pathname)}`);
  banner.innerHTML = `
    <a class="ed-banner-brand" href="/edit/" title="Alle Inhalte im Editor">${MARK}Editor</a>
    <span class="ed-banner-doc">${docPart(doc)}</span>
    <span class="ed-banner-message" role="status"></span>
    <span class="ed-banner-spacer"></span>
    ${viewSwitch()}
    <a class="ed-banner-link" href="/edit/">${esc(gitText(git))}</a>`;
  banner.querySelector('[data-status]')?.addEventListener('click', async (e) => {
    const button = e.currentTarget;
    button.disabled = true;
    const result = await api('PUT', `/api/status/${doc.section}/${doc.id}`, { status: button.dataset.status });
    const message = banner.querySelector('.ed-banner-message');
    if (!result.ok) {
      button.disabled = false;
      message.classList.add('is-error');
      message.textContent = `Nicht geändert: ${(result.errors ?? []).join(' · ')}`;
      return;
    }
    // The preview rebuilds and reloads the page by itself; until then the banner says what happened.
    await render(banner);
    banner.querySelector('.ed-banner-message').textContent =
      button.dataset.status === 'published' ? 'Freigegeben, live nach dem nächsten Veröffentlichen' : 'Wieder ein Entwurf';
  });
}

// only on the page itself, not in the decks and demonstrators it embeds
if (window.top === window) {
  const banner = document.createElement('div');
  banner.className = 'ed-banner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Editor');
  // the editor banner takes the place of the drafts banner, which says less
  document.querySelector('.drafts-banner')?.remove();
  document.body.prepend(banner);
  render(banner);
}
