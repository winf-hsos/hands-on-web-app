// Runs R with webR for runner.js, with the same small interface as the
// Python worker: run(code, onMessage) reports output, then { type: 'done' }.
// webR brings its own worker. It starts on the first click: R itself, then
// dplyr from the packages the site serves (vendor/webr-repo, never Posit's
// server). Data sets and ggplot2 come only when a block needs them: a block
// that names `rewe` loads the REWE products first, one that draws loads
// ggplot2, and its plots come back as images. A block that names the file
// itself, as in read.csv("lets_make_a_deal.csv"), finds it in its working
// directory. A file the block writes there, with write.csv() or saveRDS(),
// comes back as { type: 'file' }, so that the box can offer it for download.
//
// Every block runs in an environment of its own (.hocs_run), so a block
// cannot break the next one by overwriting `survey`; what a block assigns is
// gone afterwards.

import { DATASETS, PLAIN } from './r-datasets.js';

const { webr: base, webrRepo, datasets } = document.body.dataset;

const DRAWS = /\b(ggplot|geom_\w+|qplot)\s*\(/;
// size of a plot in pixels, as wide as it appears in the box (webR draws it
// at twice the resolution, so it stays sharp)
const PLOT = { width: 640, height: 400 };

let started = null;
let webR = null;
const loaded = new Set();

async function start() {
  const { WebR, ChannelType } = await import(`${base}webr.js`);
  webR = new WebR({ baseUrl: base, repoUrl: new URL(webrRepo, location.origin).href, channelType: ChannelType.PostMessage, interactive: false });
  await webR.init();
  await webR.installPackages(['dplyr'], { quiet: true, repos: [new URL(webrRepo, location.origin).href] });
  await webR.evalRVoid(`
    options(width = 76, crayon.enabled = FALSE, cli.num_colors = 1, warn = 1)
    suppressPackageStartupMessages(library(dplyr))
    # one expression after the other, printing what is visible, as the R
    # console does; an error is written as a message and ends the run
    .hocs_run <- function(code) {
      env <- new.env(parent = globalenv())
      exprs <- tryCatch(parse(text = code), error = function(e) {
        message("Error: ", conditionMessage(e))
        NULL
      })
      if (is.null(exprs)) return(invisible(FALSE))
      for (e in exprs) {
        ok <- tryCatch({
          r <- withVisible(eval(e, env))
          if (r$visible) print(r$value)
          TRUE
        }, error = function(err) {
          call <- conditionCall(err)
          message("Error", if (!is.null(call)) paste0(" in ", deparse(call)[1]), ": ", conditionMessage(err))
          FALSE
        })
        if (!ok) return(invisible(FALSE))
      }
      invisible(TRUE)
    }
  `);
  return webR;
}

/** Loads what `code` uses and has not been loaded yet: data sets by name or file, ggplot2 for plots. */
async function prepare(r, code) {
  for (const [name, file] of Object.entries(DATASETS)) {
    const byName = new RegExp(`\\b${name}\\b`).test(code);
    if (!byName && !code.includes(file)) continue;
    if (!loaded.has(file)) {
      const csv = await fetch(`${datasets}${file}`).then((response) => response.arrayBuffer());
      await r.FS.writeFile(`${HOME}/${file}`, new Uint8Array(csv));
      loaded.add(file);
    }
    if (!byName || loaded.has(name)) continue;
    const table = `read.csv("${file}", na.strings = c("", "NA"), stringsAsFactors = FALSE)`;
    await r.evalRVoid(`${name} <- ${PLAIN.has(name) ? table : `tibble::as_tibble(${table})`}`);
    loaded.add(name);
  }
  if (!loaded.has('ggplot2') && DRAWS.test(code)) {
    await r.installPackages(['ggplot2'], { quiet: true, repos: [new URL(webrRepo, location.origin).href] });
    await r.evalRVoid('suppressPackageStartupMessages(library(ggplot2)); theme_set(theme_gray(base_size = 14))');
    loaded.add('ggplot2');
  }
}

const HOME = '/home/web_user';

/**
 * The files in the working directory, each with its time and size, to see
 * afterwards what a block wrote; without Rplots.pdf, which the graphics device
 * leaves behind, not the block.
 */
async function listFiles(r) {
  const lines = await r.evalRString(`paste(list.files(), as.numeric(file.mtime(list.files())), file.size(list.files()), sep = "\\t", collapse = "\\n")`);
  return new Map(lines.split('\n').filter(Boolean).map((line) => [line.split('\t')[0], line]).filter(([name]) => name !== 'Rplots.pdf'));
}

/** Whether R has been started before, so the status can say "running". */
export const isReady = () => webR !== null && started !== null;

export async function run(code, onMessage) {
  let r;
  try {
    started ??= start();
    r = await started;
    await prepare(r, code);
  } catch (error) {
    started = null;
    webR = null;
    loaded.clear();
    onMessage({ type: 'done', status: 'failed', message: String(error?.message ?? error) });
    return;
  }
  const shelter = await new r.Shelter();
  try {
    const before = await listFiles(r);
    // messages, warnings and errors come as text on stderr
    const result = await shelter.captureR(`.hocs_run(${JSON.stringify(code)})`, { captureStreams: true, captureConditions: false, captureGraphics: PLOT });
    let failed = false;
    for (const item of result.output) {
      const error = item.type !== 'stdout' && /^Error\b/.test(item.data);
      failed ||= error;
      onMessage({ type: 'output', kind: item.type === 'stdout' ? 'out' : error ? 'err' : 'note', text: `${item.data}\n` });
    }
    for (const image of result.images) onMessage({ type: 'image', image });
    for (const [name, line] of await listFiles(r)) {
      if (before.get(name) !== line) onMessage({ type: 'file', name, bytes: await r.FS.readFile(`${HOME}/${name}`) });
    }
    onMessage({ type: 'done', status: failed ? 'error' : 'ok' });
  } catch (error) {
    onMessage({ type: 'output', kind: 'err', text: `Error: ${String(error?.message ?? error).replace(/^Error:\s*/, '')}\n` });
    onMessage({ type: 'done', status: 'error' });
  } finally {
    shelter.purge();
  }
}

/** Ends R, and with it a program that runs too long; the next click starts it again. */
export function stop() {
  webR?.close();
  webR = null;
  started = null;
  loaded.clear();
}
