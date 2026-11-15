// Runnable code blocks: every `.runner` on the page becomes a small editor
// with a Run button and an output area (client/runner-box.js).
import { setup } from './runner-box.js';

for (const box of document.querySelectorAll('.runner[data-runner]')) setup(box);
