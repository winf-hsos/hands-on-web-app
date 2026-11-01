// What a learner types on a page, kept in this browser only (local storage),
// per page: the code in the boxes (runner.js) and the cells of result tables
// (tables.js). It never leaves the browser, also not with the progress link.
// A page with drafts shares its entries with the same page without them.

const page = location.pathname.replace(/^\/drafts(?=\/)/, '');

/** The entries of one store on this page: get(id), set(id, value), remove(id). */
export function savedOnPage(store) {
  const read = () => {
    try {
      return JSON.parse(localStorage.getItem(store) ?? '{}') ?? {};
    } catch {
      return {};
    }
  };
  const write = (change) => {
    try {
      const all = read();
      change((all[page] ??= {}));
      if (!Object.keys(all[page]).length) delete all[page];
      localStorage.setItem(store, JSON.stringify(all));
    } catch {}
  };
  return {
    get: (id) => read()[page]?.[id],
    set: (id, value) => write((entries) => (entries[id] = value)),
    remove: (id) => write((entries) => delete entries[id]),
  };
}

/** A short, stable name for a text, so that a saved entry belongs to exactly that text. */
export function fingerprint(text) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) hash = Math.imul(hash ^ text.charCodeAt(i), 0x01000193);
  return (hash >>> 0).toString(36);
}
