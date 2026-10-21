// A tagged template for HTML: interpolated values are escaped unless they
// are already HTML (the result of html`` or raw()). Arrays are joined, and
// null, undefined and false render as nothing, so conditions can be inline.

class Html {
  constructor(text) {
    this.text = text;
  }
  toString() {
    return this.text;
  }
}

export const raw = (text) => new Html(String(text));

const escape = (text) =>
  String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function render(value) {
  if (value === null || value === undefined || value === false) return '';
  if (value instanceof Html) return value.text;
  if (Array.isArray(value)) return value.map(render).join('');
  return escape(value);
}

export function html(strings, ...values) {
  let out = strings[0];
  values.forEach((value, i) => {
    out += render(value) + strings[i + 1];
  });
  return new Html(out);
}

/** Attribute value for a JSON payload in a data attribute or script tag. */
export const json = (value) => raw(JSON.stringify(value).replace(/</g, '\\u003c'));
