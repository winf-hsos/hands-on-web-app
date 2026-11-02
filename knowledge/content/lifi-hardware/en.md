---
title: "The course module lifi_hardware"
summary: >-
  What the Python module lifi_hardware takes off your hands and what it deliberately leaves visible, how you address LED and sensor with it, and what its measurement log records.
objectives:
  intro: "Here you get to know the course module you address the LiFi device with, and can then:"
  goals:
    - "explain what the course module hides from you and which two settings it deliberately leaves visible"
    - "set a colour, fetch a reading and adjust the sensor with led and sensor"
    - "explain why the sensor delivers a new value at most once per integration time"
    - "address two devices on one laptop separately"
    - "say what the measurement log records, what of it is uploaded and how you switch that off"
translation_of: de
based_on: 2026-11-02
---

In Python, a module is a piece of finished program code that you pull into
your own program with a single `import` line and then use. Practically every
Python program works this way: for maths, random numbers or timing nobody
writes the code themselves, they import the module that does it. The word has
nothing to do with the "module" in your study programme, by the way, although
it is unfortunately used for both.

`lifi_hardware` is such a Python module, written for the LiFi project. It holds
the code that talks to your LiFi device, and you work with it for the whole
project.

The hardware itself comes from Tinkerforge, and Tinkerforge ships its own
programming interface. You could work with that directly, but at least at the
start you will not, and there is a reason for that.

## Why the course module exists

This is what a program looks like that sets a colour and fetches one reading
through the Tinkerforge interface:

```python static
from tinkerforge.ip_connection import IPConnection
from tinkerforge.bricklet_rgb_led_v2 import BrickletRGBLEDV2
from tinkerforge.bricklet_color_v2 import BrickletColorV2

HOST = "localhost"
PORT = 4223
UID_LED = "ABC"       # printed on the part, or shown in the Brick Viewer
UID_SENSOR = "XYZ"

ipcon = IPConnection()
led = BrickletRGBLEDV2(UID_LED, ipcon)
sensor = BrickletColorV2(UID_SENSOR, ipcon)
ipcon.connect(HOST, PORT)

led.set_rgb_value(255, 0, 0)
r, g, b, c = sensor.get_color()
print(r, g, b, c)

ipcon.disconnect()
```

The same with the course module:

```python static
from lifi_hardware import led, sensor

led.set_color(255, 0, 0)
print(sensor.read())
```

The difference is not just a few lines. The upper version contains at least
five things you cannot possibly understand in your first days: what an IP
connection is, why a program on your own laptop needs a network address, what
a port is, what a UID is and where you get one, and why you have to disconnect
at the end.

None of that is the subject of this project; it would be ballast you carry
along without learning anything from it. The course module takes that part off
your hands and leaves exactly what this is actually about: making light,
measuring light, and the two settings with which you influence the
measurement.

**What it does not take off your hands.** It does not hide everything, and
that is deliberate. The two settings of the sensor stay visible, because the
most important trade-off of the project hangs on them; whoever never sees them
cannot tune their throughput.

## Installing and updating

In your course, the setup installs the course module for you. By hand, it is
one command in a terminal (on a Mac `pip3` if `pip` is not found):

```bash
pip install https://github.com/winf-hsos/lifi-hardware/archive/refs/heads/main.zip
```

The same command also fetches a new version, for instance when a function is
added or a bug is fixed. The Tinkerforge library comes along automatically as
a dependency. The code itself lives in a public GitHub repository:
[github.com/winf-hsos/lifi-hardware](https://github.com/winf-hsos/lifi-hardware).

## The interface

To begin with, one line that brings in two objects is enough:

```python static
from lifi_hardware import led, sensor
```

Both connect to your device by themselves the first time you use them, with no
addresses, identifiers or configuration. When your program ends, the LED goes
off automatically and the connection is closed cleanly.

### The LED, the sender

```python static
led.set_color(r, g, b)   # each value 0 to 255
led.off()                # the same as led.set_color(0, 0, 0)
led.color                # the current colour as (r, g, b), read from the hardware
```

The hardware keeps a colour you have set until another command arrives; it
knows nothing about your program. If you use `led` and `sensor` as shown
above, the course module switches the LED off for you when your program ends,
and that includes an end by Ctrl+C or by an error. If you take the
`LifiDevice` route described further down, the LED stays on unless you close
the device yourself. `led.color` asks the hardware itself, not a remembered
value. That helps when you are hunting a fault and want to know what is really
shining right now.

### The sensor, the receiver

```python static
reading = sensor.read()          # Reading(r, g, b, c), each value 0 to 65535
r, g, b, c = sensor.read()       # unpacks straight into four variables

sensor.set_integration_time(ms)  # allowed: 2.4, 24, 101, 154 or 700
sensor.set_gain(factor)          # allowed: 1, 4, 16 or 60
sensor.integration_time          # look up the current setting
sensor.gain                      # look up the current setting
sensor.set_light(True)           # the sensor's white illumination LED
```

Four things you have to know about the sensor.

1. **It measures four channels, not three.** Red, green and blue are filtered;
   the fourth channel `c`, the clear channel, measures unfiltered and is
   therefore the most sensitive.
2. **The readings do not correspond to the RGB values you sent.** In between
   lie overlapping filters, the distance and the ambient light, and that is
   exactly why you calibrate.
3. **The sensor measures at its own pace,** one measurement per integration
   time. `read()` fetches the most recent finished measurement and does not
   wait. If you read more often than the sensor measures, you get the same
   value several times; new information arrives at most once per integration
   time. That is precisely why the integration time is a setting: calmer
   values against fewer measurements per second.
4. **The sensor always starts in the same state,** with gain 16, integration
   time 154 ms and the illumination LED off, so that measurement series are
   comparable. Which settings suit your link, only your own measurements can
   tell you.

The small white illumination LED on the sensor is meant for lighting objects
whose surface colour you want to measure. For your light link it only gets in
the way, so it is off at the start, and you leave it off. More about LED and
sensor is in [[lifi-device]].

### More control when you need it

If you want to decide yourself when to connect and disconnect, take the class
behind the two convenient objects:

```python static
from lifi_hardware import LifiDevice

lifi = LifiDevice.connect()      # finds LED and sensor by itself
lifi.led.set_color(255, 0, 0)
print(lifi.sensor.read())
lifi.close()                     # LED off, connection closed
```

The same works with the clean-up built in: the `with` form closes the device
for you at the end of the block, even if your code inside it fails.

```python static
with LifiDevice.connect() as lifi:
    lifi.led.set_color(255, 0, 0)
    print(lifi.sensor.read())
```

`connect()` also knows a few options, for example `log_file=None` (no
measurement log) and `server=None` (no upload, more on that in a moment).

### Two devices on one laptop

Your team has two devices, and sometimes it is handy to plug both into the
same laptop, one as the sender and one as the receiver. Then the course module
cannot know which one you mean, so each script tells it, by the UID of the
master brick. That is the short code of the main board, shown in the Brick
Viewer next to "Master Brick". Call `use_device()` before you use `led` or
`sensor` for the first time; after that everything works as usual:

```python static
from lifi_hardware import led, sensor, use_device

use_device("64SK5w")     # the UID of the master brick of this device
led.set_color(255, 0, 0)
```

Your second script names the other UID. If two devices are plugged in and a
script does not choose, you get an error message that lists both UIDs, so you
can copy the right one. The same choice works without changing the code
through the environment variable `LIFI_MASTER`, and with
`LifiDevice.connect(master="64SK5w")`. This needs version 0.4.0 of the course
module or newer.

## The measurement log and the cockpit

Everything your device does, the course module writes to a file called
`lifi_log.jsonl` in the folder your program runs in: every colour you set,
every reading, every change of a setting, one plain-text line per event. This
is the memory of your measurement series. It belongs to you, and it always
works, even without any internet.

In addition, the course module sends the same events to the course server.
That lets you see your own link live in the browser, in the
[team cockpit](https://lifi.hsos.uber.space/cockpit): at the top what your LED
sends, below it what your sensor measures, on a shared time axis. When the two
do not fit together, you are looking at your fault. The cockpit is your most
important tool for finding faults on the link.

> [!IMPORTANT]
> Full transparency applies: what is uploaded is exactly what is in your local
> file, not a line more. If your program crashes, the type of error goes along
> too, with a cleaned message from which file paths have been removed; your
> source code never goes along. The error then appears as a red mark in your
> cockpit. If you do not want the upload, you switch it off at any time and
> without any disadvantage, with `LifiDevice.connect(server=None)` or the
> environment variable `LIFI_SERVER=off`. The local log keeps running
> regardless.

## Look inside

The course module is not a magic trick but a manageable amount of Python code
that you can open and read, and from [[lifi-challenge-2]] at the latest you
should do that once. The source lies open in its
[GitHub repository](https://github.com/winf-hsos/lifi-hardware). In it you will
find the same Tinkerforge calls as in the first example above, plus a few
lines that look up your device's identifiers by themselves, so that you never
have to type a UID, unless two devices hang on the same laptop.

This is a pattern you will meet constantly in your studies: under every
convenient interface lies a less convenient one, and under that another. The
Tinkerforge interface in turn hides how the data actually travels over the USB
cable, and below that it goes on, down to single voltage levels on a wire.

If you ever need something the course module cannot do, you may reach one
level down at any time and use the Tinkerforge interface directly. The course
module leaves the door open on purpose: `led.raw` and `sensor.raw` are the
Tinkerforge objects underneath, with everything they can do. It is not
forbidden; you just do not have to do it on the first day.
