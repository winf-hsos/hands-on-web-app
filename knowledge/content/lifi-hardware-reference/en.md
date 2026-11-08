---
title: "Looking up `lifi_hardware`: every function and two devices"
summary: >-
  Every function of the course module at a glance, how to find out which UID belongs to which device, how a script addresses one of two devices on purpose, and how a single script works with both at once.
translation_of: de
based_on: 2026-11-08
---

This page is for looking things up. Why the course module exists, how to
install it and what its measurement log records is explained in the
introduction [[lifi-hardware]]; this page says what each function does and,
above all, how to work when two devices hang on the same laptop. Everything
refers to version 0.6.0. One line tells you which version you have:

```python static
import lifi_hardware
print(lifi_hardware.__version__)
```

## Every name at a glance

The course module offers three ways to your device. The easy way through
`led` and `sensor` is enough for one device, `LifiDevice` puts the connection
in your own hands and is the way for two devices in one script, and `sender`,
`receiver` and `run_test` are built for the test of [[lifi-challenge-1]].

| Name | What it is |
|---|---|
| `led`, `sensor` | LED and sensor of the one device; they connect by themselves on first use |
| `use_device(uid)` | chooses the device for `led` and `sensor` when two are plugged in |
| `find_devices()` | the UIDs of the master bricks of all complete devices on this laptop, as a list (from 0.5.0) |
| `LifiDevice.connect(...)` | connects to one device and returns it as an object with `.led` and `.sensor` |
| `Reading` | one reading with the four values `r`, `g`, `b` and `c` |
| `sender`, `receiver` | the two devices in the test of Challenge 1, each with `.led` and `.sensor` |
| `run_test(...)` | runs the test of Challenge 1 |

## The LED

| Call | What it does |
|---|---|
| `led.set_color(r, g, b)` | sets the colour, each value from 0 to 255; the LED keeps it until another command comes |
| `led.off()` | switches the LED off, the same as `set_color(0, 0, 0)` |
| `led.color` | the colour that is really shining right now, as `(r, g, b)` read from the hardware |
| `led.uid` | the UID of the LED bricklet |
| `led.raw` | the Tinkerforge object underneath, for anything the course module does not offer |

## The sensor

| Call | What it does |
|---|---|
| `sensor.read()` | fetches the newest finished reading as `Reading(r, g, b, c)`, each value from 0 to 65535; it does not wait for a new one |
| `sensor.set_integration_time(ms)` | how long one reading collects light; allowed are 2.4, 24, 101, 154 and 700 |
| `sensor.set_gain(factor)` | the gain; allowed are 1, 4, 16 and 60 |
| `sensor.integration_time`, `sensor.gain` | look up the current setting |
| `sensor.set_light(on)` | the white lighting LED on the sensor; it stays off for the light link |
| `sensor.uid`, `sensor.raw` | the UID of the sensor bricklet and the Tinkerforge object underneath |

Any value other than the allowed ones leads to a `ValueError` that names the
allowed values. You can use a `Reading` in two ways: unpack it straight into
four variables, or reach the single values by their names.

```python static
r, g, b, c = sensor.read()

reading = sensor.read()
print(reading.c)          # only the clear channel
```

## The connection in your own hands: `LifiDevice`

`LifiDevice.connect()` looks for the device, connects and returns an object
that holds the LED and the sensor. Everything in the brackets is optional:

| Option | Default | Meaning |
|---|---|---|
| `master` | none | the UID of the master brick, that is, which device is meant |
| `log_file` | `"lifi_log.jsonl"` | file for the measurement log; `None` switches it off |
| `server` | the course server | where the log is uploaded; `None` switches the upload off |
| `host`, `port` | `"localhost"`, `4223` | where the Brick Daemon runs; this stays as it is |

The object has the parts `.led` and `.sensor`, which work exactly like `led`
and `sensor` above, plus `.master_uid` and `.close()`. `close()` switches the
LED off and closes the connection. With `with`, Python does that for you at
the end of the block, even if your code inside it stops with an error:

```python static
from lifi_hardware import LifiDevice

with LifiDevice.connect() as lifi:
    lifi.led.set_color(255, 0, 0)
    print(lifi.sensor.read())
```

## Which UID belongs to which device?

Every device has a main board, the master brick, and its UID is the name by
which the course module knows the device. It always takes the LED and the
sensor from the same master brick, so that a device is never made of the LED
of one and the sensor of the other. `find_devices()` tells you which devices
hang on your laptop right now:

```python static
from lifi_hardware import find_devices

print(find_devices())     # for example ['64SK5w', '6Bq3Xa']
```

The list does not yet tell you which of the two devices on your table carries
which UID. The quickest way to find out is to let each device light up
briefly, one after the other; `log_file=None` and `server=None` keep this small
test out of your measurement log and your cockpit.

```python static
import time
from lifi_hardware import LifiDevice, find_devices

for uid in find_devices():
    with LifiDevice.connect(master=uid, log_file=None, server=None) as lifi:
        print("Now lit:", uid)
        lifi.led.set_color(255, 255, 255)
        time.sleep(3)
```

Write the UID on a note on the device afterwards, then you only have to do
this once. The Brick Viewer shows it as well, in the row "Master Brick".

## Addressing one particular device

If two devices hang on the laptop and a script does not say which one it
means, it stops at the first use of `led` or `sensor` with an error message
that names both UIDs. That is on purpose: a program that happens to catch the
wrong device would spoil measurement series without you noticing. You choose
the device in one of three ways, and after that everything works as usual.

**In the script with `use_device()`.** The call has to come before the first
use of `led` or `sensor`, best right below the import. If it comes later,
`led` and `sensor` are already connected to a device, and you get an error
message that says exactly that.

```python static
from lifi_hardware import led, sensor, use_device

use_device("64SK5w")
led.set_color(255, 0, 0)
```

**From outside with the environment variable `LIFI_MASTER`.** Then the script
stays unchanged, and you decide at the start which device it uses. That is
handy when the same script is to run once on one device and once on the
other. In the Windows terminal (PowerShell) it looks like this:

```powershell
$env:LIFI_MASTER = "64SK5w"
python measure.py
```

On the Mac both go on one line:

```zsh
LIFI_MASTER=64SK5w python3 measure.py
```

In PowerShell the variable holds until you close the terminal, and only in
that one terminal; on the Mac it holds only for this one call.

**With `LifiDevice.connect(master=...)`.** This is the way when you hold the
connection in your own hands anyway, and the only one with which a script
uses two devices at once.

A typical case for the first two ways is two scripts in two terminals, one
sending and one receiving. Each names its own device, and both run at the
same time. Because both programs would otherwise write their log into the
same `lifi_log.jsonl`, where the lines of both devices get mixed, it is best
to start them from two different folders.

## Two devices in one script

A single script that sends with the LED of one device and measures with the
sensor of the other has one big advantage: it knows exactly when the colour
changed. With two programs or two laptops you do not know that, and exactly
this uncertainty makes calibration and measurement series harder. For trials
on your link, such as how much a colour scatters or which integration time
pays off, a script with both devices is therefore the most convenient set-up.

For this you connect twice with `LifiDevice.connect()`, once with the UID of
each device. Both connections live side by side, and each device gets its own
measurement log, so that the lines do not get mixed. A `with` with two
connections closes both at the end.

```python static
import time
from lifi_hardware import LifiDevice

SENDING = "64SK5w"      # UID of the device whose LED sends
RECEIVING = "6Bq3Xa"    # UID of the device whose sensor measures

with LifiDevice.connect(master=SENDING, log_file="lifi_log_tx.jsonl") as tx, \
     LifiDevice.connect(master=RECEIVING, log_file="lifi_log_rx.jsonl") as rx:

    pause = 2 * rx.sensor.integration_time / 1000    # in seconds

    for color in [(255, 0, 0), (0, 255, 0), (0, 0, 255)]:
        tx.led.set_color(*color)
        time.sleep(pause)
        print(color, rx.sensor.read())
```

`tx` and `rx` are the usual short names for transmitter and receiver. You can
call them anything you like, just not `sender` and `receiver`, because those
are the two names the course module offers for the test of Challenge 1.

The pause after the change of colour is the part that is missing most often.
The sensor measures at its own pace, and `read()` fetches the newest finished
reading without waiting. Right after `set_color()` that is still a reading
from before, and the reading in progress has spent part of its time
collecting the old light. Only the reading after it sees nothing but the new
colour. So if you wait two integration times, you are sure to read a value of
the new colour. If you change the integration time, the pause in the example
grows with it by itself.

With both devices in one script you may of course also read both sensors or
switch both LEDs, for example to check a link in both directions. Each device
uploads its log as usual, as long as you do not switch the upload off.

## And the test of Challenge 1?

For the test of [[lifi-challenge-1]] you do not have to write any of this
yourself. `sender` and `receiver` find the devices by themselves: if both
hang on the same laptop, the course module lights one LED and asks whether
this device sends or receives, and then, as in the example above, keeps one
log per device, `lifi_log_<UID>.jsonl`. What your file for the test looks
like is in [[lifi-hardware]].

## When an error message comes

The messages of the course module are in English and usually already say what
to do. The most common ones:

| Message starts with | What is going on |
|---|---|
| `2 devices found, with the master bricks …` | Two devices hang on the laptop and the script chose neither; the message already suggests the right call. |
| `Not found at master brick …` | The UID matches no device, usually a typo; the message names the UIDs that are there. |
| `led and sensor are already connected to master brick …` | `use_device()` came only after the first use of `led` or `sensor`. |
| `Not found: RGB LED Bricklet 2.0` or `Color Bricklet 2.0` | The device is not plugged in, a cable between the boards is loose, or the Brick Daemon is not running. |
| `There is no integration time of …` or `There is no gain of …` | A value the sensor does not know; the message names the allowed ones. |

If the message does not help, it is worth looking at the source code in the
[GitHub repository](https://github.com/winf-hsos/lifi-hardware): each of these
messages stands there at the place where it arises, and the code around it
shows what the course module checked before.
