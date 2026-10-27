// Runs R with webR for runner.js, with the same small interface as the
// Python worker: run(code, onMessage) reports output, then { type: 'done' }.
// webR brings its own worker. It starts on the first click: R itself, then
// dplyr from the packages the site serves (vendor/webr-repo, never Posit's
// server), then the survey excerpt, loaded as `survey`.
//
// Every block runs in an environment of its own (.hocs_run), so a block
// cannot break the next one by overwriting `survey`; what a block assigns is
// gone afterwards.

const { webr: base, webrRepo, datasets } = document.body.dataset;

let started = null;
let webR = null;

async function start() {
  const { WebR, ChannelType } = await import(`${base}webr.js`);
  webR = new WebR({ baseUrl: base, repoUrl: new URL(webrRepo, location.origin).href, channelType: ChannelType.PostMessage, interactive: false });
  await webR.init();
  await webR.installPackages(['dplyr'], { quiet: true, repos: [new URL(webrRepo, location.origin).href] });
  const csv = await fetch(`${datasets}milk_survey.csv`).then((r) => r.arrayBuffer());
  await webR.FS.writeFile('/home/web_user/milk_survey.csv', new Uint8Array(csv));
  await webR.evalRVoid(`
    options(width = 76, crayon.enabled = FALSE, cli.num_colors = 1, warn = 1)
    suppressPackageStartupMessages(library(dplyr))
    survey <- tibble::as_tibble(read.csv("milk_survey.csv", na.strings = "", stringsAsFactors = FALSE))
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

/** Whether R has been started before, so the status can say "running". */
export const isReady = () => webR !== null && started !== null;

export async function run(code, onMessage) {
  let r;
  try {
    started ??= start();
    r = await started;
  } catch (error) {
    started = null;
    webR = null;
    onMessage({ type: 'done', status: 'failed', message: String(error?.message ?? error) });
    return;
  }
  const shelter = await new r.Shelter();
  try {
    // messages, warnings and errors come as text on stderr
    const result = await shelter.captureR(`.hocs_run(${JSON.stringify(code)})`, { captureStreams: true, captureConditions: false });
    let failed = false;
    for (const item of result.output) {
      const error = item.type !== 'stdout' && /^Error\b/.test(item.data);
      failed ||= error;
      onMessage({ type: 'output', kind: item.type === 'stdout' ? 'out' : error ? 'err' : 'note', text: `${item.data}\n` });
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
}
