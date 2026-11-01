# Drawings on content pages

A content item can show drawings: a diagram, a schema, a process that plays
in steps. They are drawn with stagekit's `draw.js` and `anim.js`, the same
functions the slide decks use, so that a drawing looks the same everywhere,
follows stagekit's design rules, and can go into a deck on the same subject
without being drawn again.

## Where a drawing lives

```
knowledge/content/<item>/
  de.md, en.md     ![What the drawing shows](figure:folder-tree "Caption below it")
  figures.js       figure('folder-tree', { draw(lang) { … }, animate(a, lang) { … } })
```

- `figures.js` is a plain script (no module) that registers its drawings with
  `figure(name, spec)`. `spec.draw(lang)` returns the SVG as a string, built
  with `window.draw` (stagekit) and `window.figureParts` (this platform);
  `spec.animate(a, lang)`, if there is one, adds the segments of the
  animation to `a`, an animation of `anim.js`.
- The text shows a drawing with `![description](figure:name "caption")`, alone
  in its paragraph. The description is what a screen reader says and should
  say what the drawing shows; the caption is optional and stands below it.
- The build copies `figures.js` next to the item's page. A page with drawings
  loads `draw.js`, `anim.js`, `client/figure-parts.js` and the item's
  `figures.js`, and `client/figures.js` draws them in place.
- Texts in a drawing come in both languages: `const t = figureParts.say(lang)`
  and then `t('Ordner', 'Folder')`.

The build stops (`src/build/validate.mjs`) when a text names a drawing that
`figures.js` does not register, when a size is not one of stagekit's four, and
when `figures.js` holds a colour value of its own.

## The rules

They are stagekit's rules for drawings (`docs/design-rules.md` in the stagekit
repository), applied to a page. The ones that matter most:

- **The canvas is 1600 units wide**, `d.svg(1600, h, …)`, and the page shows
  it **as wide as the text column** (44rem, about 680 px of drawing), never
  wider (decision of Nicolas, 2026-11-01). A deck can put the same drawing on
  a slide (1680 wide) without changing anything. On a phone the drawing keeps
  560 px and scrolls sideways.
- **Four sizes**, `size: 32 | 48 | 80`, and no other on a page. At the width
  of the text, 48 units read like the text and 32 like a caption, while 20
  would be too small to read. What a drawing is about, values and boxes in
  48; headings, notes and the lines of a terminal in 32. If text does not fit, the layout
  changes, not the size; widths are counted beforehand as characters × size ×
  0.6 plus 20 on each side, and the count stands as a comment next to the box.
- **Colours only from the theme, and colour is meaning.** stagekit's eight
  names (`--bg`, `--white`, `--gray-light`, `--gray`, `--gray-dark`, `--blue`,
  `--green`, `--yellow`, `--red`) are defined by `site.css` from the colours of
  the page: `--bg` is the page, `--white` the text, **`--blue` the colour of the
  area** (computer science, data science, AI), in light and in dark. Blue
  points to something; yellow means 1 or "current", the step or place a
  drawing is at; green and red judge, through `d.verdict` and `d.mark`. No
  hex values in `figures.js`; the drawing follows the page when it turns light
  or dark, because it is drawn again then.
- **Code type for everything the computer reads:** commands, paths, file
  names, bits, identifiers (`mono: true`, and `keepCase: true` so that a deck
  with lowercase text leaves them as they are). Other text is written in
  normal case; a deck lowercases English text by itself.
- **Lines behind boxes** (`d.layers(lines, boxes, labels)`), labels centred on
  what they label (`centerY`), several lines in a box left-aligned, frames
  inset by half their stroke from the edge of the canvas.
- **Processing is drawn with `d.ipo`**, judging with `d.verdict`, a passage of
  text is highlighted with `d.highlight`.
- **Animations show processes, not effects, and only where the still picture
  would miss the point** (Nicolas, 2026-11-01). A structure, a comparison or a
  concept such as a variable or a loop is a still picture, even if it could
  be made to move; at most a snapshot shows where a process stands (the loop
  at its third onion). Animate only what is a process in time and is
  understood through its course: a command moves through the folder tree,
  a file is copied, a function takes a parameter and returns a cup. Several
  calls of the same kind may run one after the other in one segment. Every
  resting state must make sense as a still picture; a segment lasts at most
  about three seconds, or a little longer when it holds two calls; what moves
  has a name (`d.g`) and a path. On the page nothing moves until the reader presses play; each
  press plays the next segment, a second button goes one step back, and with
  reduced motion the buttons jump from state to state. **The start state
  already shows the scene**, since it is what a reader sees first.

## When an item gets a drawing

A drawing earns its place when the subject has a structure, a process or a
comparison that words describe only slowly: a tree of folders, the way a
command takes through a program, two variants side by side. It does not when
it would only repeat the text or decorate it. One to three drawings per item
are plenty; a lesson without one is fine.

## Parts of this platform

`src/client/figure-parts.js` holds parts that recur across items and look the
same in each: `folder`, `file`, `tree` (a folder tree) and `terminal` (a
terminal window with prompt and output). A new part goes there when a second
item needs it, not into one item's `figures.js`. Parts that would help every
deck belong in stagekit itself; that is a request to the stagekit agent, who
alone changes stagekit.

## Reusing a drawing in a deck

A deck in `slides/` of an item loads the same files after stagekit's own:

```html
<script src="../../stagekit/draw.js"></script>
<script src="../../stagekit/anim.js"></script>
<script src="figure-parts.js"></script>   <!-- a copy of src/client/figure-parts.js -->
<script src="../figures.js"></script>
<script src="deck.js"></script>
<script src="../../stagekit/stagekit.js"></script>
```

and `deck.js` puts a drawing on a slide:

```js
const f = window.figures['folder-tree'];
document.getElementById('fig-tree').innerHTML = f.draw('en');
f.animate?.(window.draw.anim('fig-tree'));
```

Each segment is then a build-up step of the slide, as for any animation in a
deck. Not built yet: the site copies a deck to `/decks/<id>/` without the
item's `figures.js`, so the first deck that reuses a drawing also needs the
build to copy that file next to it.
