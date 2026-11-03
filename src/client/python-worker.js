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

# --- a simulated LED --------------------------------------------------------
# A program that imports lifi_hardware gets a stand-in for the course module:
# led.set_color() notes the colour with the time on a clock of its own, and
# time.sleep() moves that clock on instead of waiting, so a program of ten
# seconds is done at once and the page plays it back in real time
# (client/led-view.js). A loop without end stops after _LED_LIMIT seconds.

import json, time, types

_LED_LIMIT = 20
_led = None          # {"clock": seconds, "events": [[t, r, g, b], ...]} while a program uses the LED
_real_sleep = time.sleep

class _LedLimit(BaseException):
    pass

def _sleep(seconds):
    if _led is None:
        return _real_sleep(seconds)
    if not isinstance(seconds, (int, float)) or isinstance(seconds, bool):
        raise TypeError(f"time.sleep() needs a number of seconds, not {type(seconds).__name__}")
    if seconds < 0:
        raise ValueError("time.sleep() cannot wait a negative number of seconds")
    _led["clock"] += seconds
    if _led["clock"] > _LED_LIMIT:
        _led["clock"] = _LED_LIMIT
        raise _LedLimit()

time.sleep = _sleep

class _Led:
    def set_color(self, r, g, b):
        for value in (r, g, b):
            if not isinstance(value, int) or isinstance(value, bool) or not 0 <= value <= 255:
                raise ValueError(f"set_color() needs three whole numbers from 0 to 255, not {value!r}")
        events = _led["events"]
        if len(events) > 20000:
            raise _LedLimit()
        events.append([_led["clock"], r, g, b])
    def off(self):
        self.set_color(0, 0, 0)

def _use_device(uid):
    pass

def _lifi_hardware():
    module = types.ModuleType("lifi_hardware")
    module.led = _Led()
    module.use_device = _use_device
    return module

def _run(code, answers):
    global _answers, _led
    _answers = list(answers)
    sys.stdout, sys.stderr = _Stream("out"), _Stream("err")
    # so that tracebacks can quote the line of the program
    linecache.cache["program.py"] = (len(code), None, code.splitlines(True), "program.py")
    _led = {"clock": 0, "events": []} if "lifi_hardware" in code else None
    if _led is not None:
        sys.modules["lifi_hardware"] = _lifi_hardware()
    try:
        exec(compile(code, "program.py", "exec"), {"__name__": "__main__"})
    except _NeedInput:
        _led = None
        return "input"
    except SystemExit:
        return _led_done("ok")
    except _LedLimit:
        return _led_done("ok", limited=True)
    except SyntaxError as error:
        traceback.print_exception(type(error), error, None)
        return _led_done("error")
    except BaseException as error:
        # skip the frame of _run itself, show only the learner's program
        traceback.print_exception(type(error), error, error.__traceback__.tb_next)
        return _led_done("error")
    return _led_done("ok")

def _led_done(status, limited=False):
    """Hands what the LED did to the page, and returns the status of the run."""
    global _led
    if _led is not None:
        _emit_led(json.dumps({"events": _led["events"], "end": _led["clock"], "status": status, "limited": limited}))
        _led = None
    return status
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
  py.globals.set('_emit_led', (run) => postMessage({ id: current, type: 'led', run: JSON.parse(run) }));
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
