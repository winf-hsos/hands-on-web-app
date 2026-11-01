---
title: Believed and measured
summary: >-
  Turn a suggestion of the AI assistant about the optics into a prediction
  with a number, measure before and after with exactly one change, and record
  the result in two lines: what you believed and what you measured.
objectives:
  intro: "In this experiment you test a suggestion of the AI assistant on your own link, and afterwards you can:"
  goals:
    - "turn a general suggestion into a prediction that says which quantity changes in which direction and roughly by how much"
    - "carry out a control measurement before the change and then change exactly one quantity"
    - "decide with the mean, the spread `s` and the ratio `d/s` whether the measurement supports the prediction"
    - "record the result in the two lines \"We believed\" and \"We measured\" for the log of mistakes"
translation_of: de
based_on: 2026-11-01
---

If you ask an AI assistant how your link can tell more colours apart, you get
suggestions that all sound plausible: paint the inside of a tube matt black,
put an aperture in front of the sensor, raise the gain. None of them has been
tested on your setup, because the assistant knows neither your room nor your
distance nor your light. In this experiment you take one such suggestion at
its word, write down beforehand what it is supposed to achieve, and let the
measurement decide.

## What you need

- two devices with an RGB LED and a colour sensor, on two laptops or both on
  one
- your setup from Challenge 1 with the position of both devices marked
- the sending and the receiving program from [[measuring-your-noise]]
- two colours from your alphabet that lie close together
- your AI assistant
- the material for the one change you want to test, for example black paper,
  cardboard or tape

## Setup

Place the devices as you used them in Challenge 1 and mark their position.
Apart from the one change you test, everything stays the same: the distance,
the light in the room and the program. In the receiving program window 1 is
enough for this experiment, so set `WINDOWS = [1]`; then a measurement takes
only a few seconds.

## Step 1: get a suggestion

Describe your setup to the assistant in two or three sentences and ask what
you can change about the optics so that the readings scatter less or the
colours lie further apart. Pick **one** suggestion from its answers that you
can carry out with exactly one change, and copy it word for word.

## Step 2: write down beforehand what you believe

Turn the suggestion into a prediction that a measurement can refute. It names
the quantity that is supposed to change, the direction and roughly the amount,
for example: "With the matt black tube the spread `s` of colour A halves, and
`d/s` rises from 5 to 10." A sentence like "it will get better" cannot be
refuted and is therefore no use.

## Step 3: the control measurement

Without the change, measure both colours three times each in a row with the
receiving program and enter the mean and the spread `s` of every measurement
in the table. The three runs show you how much the values vary from one run to
the next even without any change; a difference smaller than this variation
proves nothing afterwards.

## Step 4: exactly one change

Now carry out the suggestion, and only that, without moving the devices. Then
measure both colours three times each again.

| Run | mean A | s of A | mean B | s of B |
|---|---|---|---|---|
| before 1 | | | | |
| before 2 | | | | |
| before 3 | | | | |
| after 1 | | | | |
| after 2 | | | | |
| after 3 | | | | |

The program in the browser works out the distance `d`, the larger spread `s`
and the ratio `d/s` from the values of one run. Replace the placeholders with
your own values, once with a run before and once with a run after.

```python
# replace the placeholders with the values of one run before and one run after the change
runs = {
    "before": {"mean_a": 640, "s_a": 9.1, "mean_b": 700, "s_b": 10.4},
    "after": {"mean_a": 610, "s_a": 4.8, "mean_b": 668, "s_b": 5.5},
}

for name, run in runs.items():
    d = abs(run["mean_b"] - run["mean_a"])
    s = max(run["s_a"], run["s_b"])
    print(f"{name}: distance d {d:.0f}, spread s {s:.1f}, d/s {d / s:.1f}")
```

## Step 5: the two lines

Write the result down in two lines, the first with your prediction from
step 2 and the second with what the measurement showed, both with numbers.

| Line | your text |
|---|---|
| Suggestion of the assistant | |
| We believed: | |
| We measured: | |

> [!TIP]
> An example from a log of mistakes: "We believed: more gain gives us more
> colours." and "We measured: the scatter grew with it, and we lost two
> symbols." The gain raises the signal and the noise alike, so it hardly
> changes `d/s`, and near the ceiling the sensor may even saturate.

## Evaluation

- Did the measurement support your prediction, refute it, or neither, because
  the difference was smaller than the variation between the three runs of the
  control measurement?
- Did the change alter the distance `d`, the spread `s` or both, and what
  happened to the ratio `d/s`?
- Without the control measurement, would you have known whether the change
  had any effect at all?
- What would the assistant have needed to know about your setup to be right,
  and could it have known that?
- If the measurement refutes the suggestion, the two lines belong in your log
  of mistakes; if it supports it, the change belongs with its numbers in your
  measurement log and in the description of your solution.

Why almost every measure against noise has a price and only a few, among them
better optics, cost nothing but craft is shown in the slides
[[signal-and-noise-slides]] and the lesson [[signal-and-noise]]. Why a clean
measurement series beats a plausible explanation is shown in the slides
[[measuring-and-experimenting]].

> [!NOTE]
> With a whole group, every team tests a different suggestion, and a list with
> two columns, "We believed" and "We measured", grows on the board. At the end
> the group counts how many of the suggestions survived the measurement and
> for which ones the assistant would have needed to know something about the
> setup that it could not know.
