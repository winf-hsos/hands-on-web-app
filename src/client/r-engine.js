// Runs R with webR for runner.js, with the same small interface as the
// Python worker: run(code, onMessage) reports output, then { type: 'done' }.
// webR brings its own worker. It starts on the first click: R itself, then
// dplyr from the packages the site serves (vendor/webr-repo, never Posit's
// server). Every block behaves as after library(tidyverse) (Nicolas,
// 2026-11-10), but the other packages of its core come only when a block
// calls one of their functions (r-packages.js): pivot_longer() loads tidyr,
// ggplot() loads ggplot2, and its plots come back as images. Data sets come
// the same way: a block that names `rewe` loads the REWE products first, and
// a page can say which file a name means (r_datasets, as on the self-study
// pages, where `survey` is the full survey). A block that names the file
// itself, as in read.csv("lets_make_a_deal.csv"), finds it in its working
// directory. A file the block writes there, with write.csv() or saveRDS(),
// comes back as { type: 'file' }, so that the box can offer it for download.
//
// Every block runs in an environment of its own (.hocs_run), so a block
// cannot break the next one by overwriting `survey`; what a block assigns is
// gone afterwards.

import { DATASETS, PLAIN } from './r-datasets.js';
import { CORE, EXPORTS } from './r-packages.js';

const { webr: base, webrRepo, datasets } = document.body.dataset;

// size of a plot in pixels, as wide as it appears in the box (webR draws it
// at twice the resolution, so it stays sharp)
const PLOT = { width: 640, height: 400 };

let started = null;
let webR = null;
// files written and packages attached, and the file each table name was read from
const loaded = new Set();
const tables = new Map();

async function start() {
  const { WebR, ChannelType } = await import(`${base}webr.js`);
  webR = new WebR({ baseUrl: base, repoUrl: new URL(webrRepo, location.origin).href, channelType: ChannelType.PostMessage, interactive: false });
  await webR.init();
  await webR.installPackages(['dplyr'], { quiet: true, repos: [new URL(webrRepo, location.origin).href] });
  await webR.evalRVoid(`
    options(width = 76, crayon.enabled = FALSE, cli.num_colors = 1, warn = 1)
    suppressPackageStartupMessages(library(dplyr))
    # library(tidyverse) in a block copied from Positron does nothing here,
    # since its packages come by themselves when a block needs them
    library <- function(package, ..., character.only = FALSE) {
      name <- if (character.only) package else as.character(substitute(package))
      if (identical(name, "tidyverse")) return(invisible(NULL))
      base::library(name, character.only = TRUE, ...)
    }
    # The check of a test (client/test.js): runs the learner's code quietly in
    # an environment of its own and compares the value of the answer with the
    # checksum of the right one, as the self-test of the course folder does
    # (check_answers.R): numbers rounded to one decimal, text in lower case,
    # MD5 of "number:value". Returns a code and a detail for the page.
    .hocs_md5 <- function(number, x) {
      value <- if (is.numeric(x)) format(round(x, 1), nsmall = 1, trim = TRUE) else tolower(trimws(as.character(x)))
      file <- tempfile()
      on.exit(unlink(file))
      writeBin(charToRaw(enc2utf8(paste0(number, ":", value))), file)
      unname(tools::md5sum(file))
    }
    .hocs_check_plot <- function(p, counts, rows, defaults) {
      if (!requireNamespace("ggplot2", quietly = TRUE) || !ggplot2::is_ggplot(p)) return(c("not_plot", ""))
      layer <- tryCatch(ggplot2::layer_data(p, 1), error = function(e) NULL)
      if (is.null(layer)) return(c("plot_error", ""))
      values <- c(layer$y, layer$x)
      values <- values[is.finite(values)]
      if (!(nrow(layer) == rows && all(counts %in% round(values)))) return(c("plot_wrong", ""))
      labels <- tryCatch(ggplot2::get_labs(p), error = function(e) p$labels)
      named <- function(l) !is.null(l) && !(as.character(l)[1] %in% c(defaults, "count", "n", ""))
      if (!named(labels$x) || !named(labels$y)) return(c("plot_labels", ""))
      c("correct", "")
    }
    .hocs_check <- function(code, name, number, expected = "", counts = NULL, rows = NA, defaults = character()) {
      env <- new.env(parent = globalenv())
      exprs <- tryCatch(parse(text = code), error = function(e) e)
      if (inherits(exprs, "error")) return(c("error", conditionMessage(exprs)))
      for (e in exprs) {
        problem <- tryCatch({
          suppressWarnings(suppressMessages(eval(e, env)))
          NULL
        }, error = function(err) conditionMessage(err))
        if (!is.null(problem)) return(c("error", problem))
      }
      if (!exists(name, envir = env, inherits = FALSE)) return(c("missing", ""))
      answer <- get(name, envir = env)
      if (is.null(answer) || length(answer) == 0 || (is.character(answer) && !nzchar(trimws(answer[1])))) return(c("empty", ""))
      if (!is.null(counts)) return(.hocs_check_plot(answer, counts, rows, defaults))
      if (is.data.frame(answer)) {
        if (nrow(answer) != 1 || ncol(answer) != 1) return(c("table", paste(nrow(answer), ncol(answer))))
        answer <- answer[[1]]
      }
      if (length(answer) > 1) return(c("many", length(answer)))
      if (identical(.hocs_md5(number, answer), expected)) return(c("correct", ""))
      if (is.numeric(answer) && identical(.hocs_md5(number, answer * 100), expected)) return(c("share", ""))
      c("wrong", "")
    }
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

/** The packages of the core tidyverse that `code` needs: those of the functions it calls, and those it names in library(). */
export function packagesFor(code) {
  const wanted = new Set();
  for (const [, space, name] of code.matchAll(/(?:\b([A-Za-z][\w.]*)::)?\b([A-Za-z.][\w.]*)\s*\(/g)) {
    if (space) {
      if (CORE.includes(space)) wanted.add(space);
    } else if (Object.hasOwn(EXPORTS, name)) EXPORTS[name].forEach((p) => wanted.add(p));
  }
  for (const [, name] of code.matchAll(/\b(?:library|require)\(\s*["']?([\w.]+)["']?\s*[,)]/g)) if (CORE.includes(name)) wanted.add(name);
  return [...wanted];
}

/** Loads what `code` uses and has not been loaded yet: data sets by name or file, packages by their functions. */
async function prepare(r, code, aliases = {}) {
  for (const [name, file] of Object.entries({ ...DATASETS, ...aliases })) {
    const byName = new RegExp(`\\b${name}\\b`).test(code);
    if (!byName && !code.includes(file)) continue;
    if (!loaded.has(file)) {
      const csv = await fetch(`${datasets}${file}`).then((response) => response.arrayBuffer());
      await r.FS.writeFile(`${HOME}/${file}`, new Uint8Array(csv));
      loaded.add(file);
    }
    // a name is read again when this page means another file by it
    if (!byName || tables.get(name) === file) continue;
    const table = `read.csv("${file}", na.strings = c("", "NA"), stringsAsFactors = FALSE)`;
    await r.evalRVoid(`${name} <- ${PLAIN.has(name) ? table : `tibble::as_tibble(${table})`}`);
    tables.set(name, file);
  }
  const missing = packagesFor(code).filter((p) => !loaded.has(p));
  if (missing.length) {
    await r.installPackages(missing, { quiet: true, repos: [new URL(webrRepo, location.origin).href] });
    await r.evalRVoid(`suppressPackageStartupMessages({ ${missing.map((p) => `library(${p})`).join('; ')} })`);
    if (missing.includes('ggplot2')) await r.evalRVoid('theme_set(theme_gray(base_size = 14))');
    missing.forEach((p) => loaded.add(p));
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

export async function run(code, onMessage, { datasets: aliases } = {}) {
  let r;
  try {
    started ??= start();
    r = await started;
    await prepare(r, code, aliases);
  } catch (error) {
    started = null;
    webR = null;
    loaded.clear();
    tables.clear();
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

/**
 * Checks the answer of a test task (client/test.js): runs `code` quietly and
 * compares what it leaves in `check.name` with the right answer. Resolves to
 * { result, detail }, where result is correct, wrong, share, empty, missing,
 * table, many, error or, for a plot, not_plot, plot_error, plot_wrong or
 * plot_labels; failed when R could not start.
 */
export async function check(code, task, { datasets: aliases } = {}) {
  let r;
  try {
    started ??= start();
    r = await started;
    await prepare(r, code, aliases);
  } catch (error) {
    started = null;
    webR = null;
    loaded.clear();
    tables.clear();
    return { result: 'failed', detail: String(error?.message ?? error) };
  }
  const plot = task.plot
    ? `, counts = c(${task.plot.counts.join(', ')}), rows = ${task.plot.rows}, defaults = c(${(task.plot.defaults ?? []).map((d) => JSON.stringify(d)).join(', ')})`
    : '';
  const call = `.hocs_check(${JSON.stringify(code)}, ${JSON.stringify(task.name)}, ${task.number}, ${JSON.stringify(task.md5 ?? '')}${plot})`;
  try {
    const [result, detail = ''] = (await r.evalRString(`paste(${call}, collapse = "\\t")`)).split('\t');
    return { result, detail };
  } catch (error) {
    return { result: 'error', detail: String(error?.message ?? error) };
  }
}

/** Ends R, and with it a program that runs too long; the next click starts it again. */
export function stop() {
  webR?.close();
  webR = null;
  started = null;
  loaded.clear();
  tables.clear();
}
