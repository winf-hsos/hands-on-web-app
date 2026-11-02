---
title: "The team cockpit"
summary: >-
  The cockpit shows your light link live in the browser, at the top what your LED sends and below it what your sensor measures, and it is your most important tool for finding faults.
objectives:
  intro: "Here you get to know the team cockpit and can then:"
  goals:
    - "open the cockpit for your team and say where its data comes from"
    - "read the status line, the sender band and the sensor curves"
    - "move through the timeline, from a few seconds of signal to an overview of days"
    - "jump straight to the crashes of your program and see what was sent and measured just before"
    - "check in order why no data arrives"
translation_of: de
based_on: 2026-11-02
---

The team cockpit shows your light link live in the browser: at the top what
your LED sends, below it what your sensor measures, both on the same time axis.
It is your most important tool for finding faults, because most problems can
be seen here at a glance. If the sender band changes correctly but the curves
do not move, something is wrong with alignment or distance. If the curves jump
in step with the colours but your program still recognises nothing, the fault
is in your thresholds or your timing.

## Opening it

The cockpit is at
[lifi.hsos.uber.space/cockpit](https://lifi.hsos.uber.space/cockpit).

The first time you open it, it asks for your team name. After that the name is
part of the address (something like `.../cockpit?team=team-07`), so you can
bookmark the page or share the link within your team. "switch team" at the top
right changes the team.

The data arrives by itself: as soon as your program uses the course module
[[lifi-hardware]], it sends its measurement log to the course server, and the
cockpit shows it. You do not have to configure anything. What is uploaded, and
how you switch that off, is described there as well.

## The status line

At the top are six values that update continuously:

- whether data is arriving right now ("live") or when it last did,
- the current LED colour with a swatch,
- the latest reading with its four channels r, g, b and c,
- the readings per second,
- the gain and integration time you have set,
- the last error, in case your program crashed.

## Reading the timeline

The large area is a timeline that reaches from seconds to the whole time of
the project. What it shows depends on how far you zoom in.

**Zoomed in close**, up to a window of about 15 minutes, you see the raw
signal: at the top the sender band, in which every block has exactly the colour
the LED showed at that moment, and below it the four sensor channels as curves.
The channel c, the light line, measures all the light and is the most
sensitive. Dashed vertical marks show where a session started or ended and
where settings were changed; red marks are crashes of your program.

**Zoomed far out**, the same area becomes an activity overview: blue bars show
when and how much you worked (the taller and brighter, the more readings), and
red strokes above them mark periods with errors. That way you can find the
spot where something interesting happened even days later.

Below the area there is always an axis with time and date, and above it the
visible period and its length, so you never have to guess where you are.

## Moving and zooming

The controls work the way you know them from video editors or map apps:

- **Scroll wheel** zooms in and out, around the point the mouse is on.
- **Double-click** on a blue activity bar jumps straight into its period;
  anywhere else it zooms in strongly around the point you clicked.
- **Drag** with the mouse button held down moves the window in time.
- **Hover** shows details: over the sender band the exact RGB values and since
  when the colour has been on, over the curves the nearest reading with all
  four values and its timestamp, over marks what they mean.
- The buttons **30 s / 5 min / 1 h / 24 h / all** jump to fixed windows,
  **+ / −** zoom step by step.

As soon as you zoom or drag into the past, the view stops following the time.
The green button **"● live"** brings you back to the present, where the right
edge moves along with the clock again.

## Finding your errors quickly

Next to the zoom buttons you find **errors: show · hide · only**.

- **show** is the normal view: errors appear as red marks among everything
  else.
- **hide** removes the error marks, for when you want to look at the signal
  alone.
- **only** dims everything else. Zoomed out, every period with an error
  becomes a tall red bar, so even a single crash in a whole afternoon stands
  out at once.

The two arrow buttons **‹** and **›** jump to the previous and the next error,
across your whole timeline. The error lands in the middle of a 40-second
window, so you see what your LED sent and what your sensor measured just
before your program failed. Hover over an arrow to see which error comes next.
Your choice of show, hide or only is remembered in your browser.

## When nothing arrives

If the status says "no data yet" for good, check these in order:

1. Is your program running right now, and does it use `lifi_hardware`?
2. Is the team name in the address correct?
3. Does your laptop have internet?

Without a network your program carries on completely normally, by the way;
only the cockpit stays empty, and everything that matters is still in your
local log file `lifi_log.jsonl`. If your device has not been assigned to a
team yet, say so in your course; that takes a minute.
