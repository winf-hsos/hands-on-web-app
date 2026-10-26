// Runs Python with Pyodide, away from the page so that a long or endless
// program cannot freeze it (runner.js ends this worker to stop a program).
//
// input() cannot wait for the page here, because a worker has no way to
// block for an answer without special server headers. Instead a program runs
// with the answers known so far; when it asks for one more, it stops and
// reports "input". The page asks the learner and runs the program again from
// the start with one answer more. Programs at this level are deterministic,
// so the second run prints exactly what the first one did.

const PRELUDE = `
import sys, builtins, traceback, linecache

class _Stream:
    def __init__(self, kind):
        self.kind = kind
    def write(self, text):
        if text:
            _emit(self.kind, text)
        return len(text)
    def flush(self):
        pass
    def isatty(self):
        return False

class _NeedInput(BaseException):
    pass

_answers = []

def _input(prompt=""):
    sys.stdout.write(str(prompt))
    if not _answers:
        raise _NeedInput()
    answer = _answers.pop(0)
    _emit("in", answer + "\\n")
    return answer

builtins.input = _input

def _run(code, answers):
    global _answers
    _answers = list(answers)
    sys.stdout, sys.stderr = _Stream("out"), _Stream("err")
    # so that tracebacks can quote the line of the program
    linecache.cache["program.py"] = (len(code), None, code.splitlines(True), "program.py")
    try:
        exec(compile(code, "program.py", "exec"), {"__name__": "__main__"})
    except _NeedInput:
        return "input"
    except SystemExit:
        return "ok"
    except SyntaxError as error:
        traceback.print_exception(type(error), error, None)
        return "error"
    except BaseException as error:
        # skip the frame of _run itself, show only the learner's program
        traceback.print_exception(type(error), error, error.__traceback__.tb_next)
        return "error"
    return "ok"
`;

const LIMIT = 200_000;
let python;
let current;
let written = 0;

function emit(kind, text) {
  if (written > LIMIT) return;
  written += text.length;
  postMessage({ id: current, type: 'output', kind, text: written > LIMIT ? `${text}\n…\n` : text });
}

async function start(base) {
  const { loadPyodide } = await import(`${base}pyodide.mjs`);
  const py = await loadPyodide({ indexURL: base });
  py.globals.set('_emit', emit);
  py.runPython(PRELUDE);
  return py;
}

self.onmessage = async ({ data }) => {
  current = data.id;
  written = 0;
  try {
    python ??= start(data.base);
    const py = await python;
    const status = py.globals.get('_run')(data.code, data.answers);
    postMessage({ id: data.id, type: 'done', status });
  } catch (error) {
    postMessage({ id: data.id, type: 'done', status: 'failed', message: String(error?.message ?? error) });
  }
};
