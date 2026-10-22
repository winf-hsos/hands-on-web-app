# stagekit runtime

The browser runtime of stagekit (MIT, Nicolas Meseth), needed to show slide
decks of type `slides`. Copied from the stagekit repository at commit
aa98a53 (2026-10-08). The build publishes this
folder as `/stagekit/`, so a deck at `/decks/<id>/index.html` finds it under
`../../stagekit/`, exactly as in the folders where decks are made.

To update: copy `stagekit.js`, `stagekit.css`, `draw.js` and `fonts/` again
and note the commit here.
