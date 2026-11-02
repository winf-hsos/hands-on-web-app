---
title: "The LiFi device"
summary: >-
  What your device is made of, what you may build around it, and how you work with it as a team or on your own.
objectives:
  intro: "Here you get to know the device of the LiFi project and can then:"
  goals:
    - "name the three parts of the device and what each does"
    - "say which optics you may build yourselves and which you may not"
    - "split the work in a team by sender and receiver"
    - "address two devices on one laptop separately"
translation_of: de
based_on: 2026-11-02
---

Inside the 3D-printed case are three parts from Tinkerforge:

| Part | Job |
|---|---|
| Master Brick | controls everything and connects to the laptop via USB-C |
| RGB LED Bricklet 2.0 | the sender, each colour from 0 to 255 |
| Color Bricklet 2.0 | the receiver, measures red, green, blue and unfiltered light (C), each from 0 to 65535 |

LED and sensor sit side by side at the front, separated by a wall so that a
device does not see its own light. The small white lamp on the sensor stays
off; it only adds stray light. The sensor's integration time and gain can be
set; both change how sensitive and how fast it measures.

The only thing you build yourselves is your optics between the devices.
Anything that does not itself produce or measure light is allowed, such as
tubes, cardboard, paint, foil, mirrors, lenses or 3D-printed parts. Extra
sensors, further light sources, lasers or swapping the LED or sensor are not
allowed.

Each person gets a fully assembled device, so a team has both ends of the link.
That matters more than it sounds: whoever builds only the sender has to guess
what the receiver sees, and you can look. Each person works on their own
laptop with their own device; split the work by the two ends and swap roles
now and then, so that both of you know both sides. When one side does not
work, the answer is usually on the other.

**On your own works too.** If you take on the project without a partner,
connect both devices to one laptop and run the sender and the receiver as two
programs. Each program then says which device it means, by the UID of the
master brick, which the Brick Viewer shows:

```python static
from lifi_hardware import led, sensor, use_device

use_device("abc123")  # replace with the UID of your master brick
led.set_color(255, 0, 0)
```

You lose the partner, not the project. Only the interop test in challenge 3
needs another team; on your own, you hand your protocol description to someone
who does not know your code, or to an AI assistant in a fresh session, and ask
them to describe the receiver they would build. The gaps show up just the same.
