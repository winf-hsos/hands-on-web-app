---
type: quiz
code: 8283
title: "Quiz: signal and noise"
summary: >-
  Fourteen questions on noise, averaging, the ratio of distance to spread,
  how many symbols fit into a link and what each way of improving the ratio
  costs. Every answer comes with its reason.
level: 1
duration: 20
topics: [transferring-information]
modules: [dup]
relations:
  checks: [signal-and-noise]
  see_also: [signal-and-noise-slides]
status: draft
updated: 2026-11-04
---

## You measure the same colour ten times in a row without changing anything, and get ten slightly different numbers. What does that mean? {#sn-001}

- [ ] The sensor is faulty: an intact sensor returns the same numbers for the same colour.
  > A perfectly working sensor behaves the same way. Every measurement contains fluctuation; that is physics, not a fault.
- [x] That is normal: every measurement fluctuates, and this fluctuation is called noise.
  > Exactly. Noise is not only an external disturbance but a property of every measurement. The interesting question is not whether there is noise, but how much.
- [ ] The program has a bug, because a computer returns the same output for the same input.
  > True for the program, not for the measurement: the input here is the light at the sensor, and that is never exactly the same twice. Even a correct program passes on fluctuating values.
- [ ] The LED flickers imperceptibly, and the sensor reflects that flicker in its values.
  > The LED holds its value. Even with perfectly constant light the readings scatter, because sensor, light and surroundings are never exactly the same.

> Noise is part of every measurement, so the question is never whether readings scatter, but how much.

## A noisy raw signal is averaged over windows of 4, 12 and 32 readings, and the averaged values get calmer the longer the window. What does that show? {#sn-002}

- [ ] That the averaged values come from a more precise sensor than the raw signal.
  > The sensor is the same for every window. The only thing that changes is how many readings go into one value.
- [ ] That noise fades away by itself over time because the sensor first has to settle.
  > The raw signal is equally noisy throughout, from the first moment to the last. Only the values derived from it become calmer, and that is due to the longer windows, not to elapsed time.
- [x] That longer measurement windows smooth the fluctuation: each value lies closer to the true level.
  > Exactly: over a longer window the outliers average out. The price is that longer windows give fewer values, and so fewer symbols per second.
- [ ] That with a long enough measurement any alphabet can be transmitted safely.
  > Smoothing helps but costs time, and a residual fluctuation never disappears. Wanting arbitrarily many symbols means arbitrarily long measurements, and then the transmission is uselessly slow.

> Averaging calms the values and costs readings per second; the spread falls with the square root of the window.

## Two groups build the same light link, with the same sensor and the same LED. One reaches a safe alphabet of 16 colours, the other only 4. What mainly explains the difference? {#sn-003}

- [ ] The quality of the code that draws the boundaries between colours and assigns the readings.
  > The code decides where the boundaries lie, not how far the readings scatter. Clean code alone does not enlarge an alphabet.
- [ ] The gain: the first group set it higher, and more gain yields finer gradations.
  > Gain lifts signal and noise together: the distance between symbols grows, but so does the scatter. The decisive ratio stays the same, and with too much gain the sensor saturates.
- [x] The ratio of the distance between symbols to the scatter of the readings: whoever reduces the scatter fits in more symbols.
  > Exactly: the size of the alphabet measures nothing but this ratio. The scatter shrinks through shielding against ambient light, clean optics, a fixed distance and longer measurement windows.
- [ ] The first group chose brighter colours.
  > Brightness alone helps little if the values still scatter widely. What counts is the distance between symbols relative to the scatter, not the absolute level.

> The size of an alphabet is decided by the ratio d/s of the distance between symbols to the spread of the readings.

## Longer measurement windows give calmer values. So why not simply set the integration time to its maximum? {#sn-004}

- [ ] Because with a long window so much light accumulates that every colour reaches the maximum value and nothing can be told apart.
  > Saturation can happen, but it is no argument against long windows as such: lower gain or more distance avoids it. The real price is paid in a different currency: time.
- [x] Because every measurement costs time: longer windows mean fewer symbols per second and thus less throughput.
  > Exactly, and this is the central trade-off of every link with a sensor: signal quality against symbol rate. That is why the integration time is a setting worth measuring, not one fixed once and forgotten.
- [ ] Because a long measurement accumulates more stray light, which makes the values less precise.
  > Stray light does accumulate, but so does the useful light, and the fluctuation averages out over the longer window. The values become calmer, not less precise; that is the very reason for longer windows, only slower.
- [ ] Because with long integration times the sensor no longer distinguishes colours.
  > The colour channels keep working regardless of the window length. What changes is only how calm the values are and how much time they cost.

> Calm readings are paid for in time, and time per symbol is what the throughput of a link is made of.

## Two colours produce overlapping measurement series: colour A scatters from 180 to 240, colour B from 220 to 280. Which measures address the root of the problem? (Several answers may be correct.) {#sn-005}

- [x] Replace one of the two colours with one that lies further away.
  > Correct: this increases the distance between symbols, the numerator of the decisive ratio.
- [ ] Put the boundary exactly in the middle of the overlap.
  > That is the best boundary for a bad situation, but it does not remove the overlap: some measurements still land on the wrong side.
- [x] Increase the integration time so the scatter shrinks.
  > Correct, and this is the denominator of the same ratio. It costs symbol rate, so it is a trade-off, not a given.
- [x] Improve the optical setup: shield it, add a tube, fix the distance.
  > Correct: less stray light and a stable geometry lower the scatter without costing a single millisecond of symbol rate. The best kind of improvement.
- [ ] Add more colours to the alphabet so the overlap matters less.
  > That makes things worse: more colours mean smaller distances, and the overlap grows rather than shrinks.

> An overlap disappears only when the distance grows or the spread shrinks, not by moving the boundary.

## The function `read_stable()` reads a sensor ten times through `read_clear()` and returns the mean. Compared to a single reading, what does it achieve? {#sn-006}

```python static
def read_stable(n=10):
    values = [read_clear() for _ in range(n)]
    return sum(values) / n
```

- [ ] It makes the sensor more precise because the sensor collects ten times as much light.
  > The sensor itself is unchanged; it measures the same thing ten times. What improves is only what the program makes of the ten values.
- [x] It averages out the fluctuation: the returned value scatters less than a single reading, and the function takes ten times as long.
  > Exactly, and both halves belong together. Averaging is the same bargain as a longer integration time: calmer values for time. Whoever sees only the first half is surprised by the collapsed throughput.
- [ ] It removes outliers: a single stray value no longer matters in the average over ten readings.
  > An average damps outliers but does not discard them; one strong outlier noticeably drags it along. To really reject outliers, use the median.
- [ ] It ensures that the transmitted symbol is recognised reliably, because the average neutralises the fluctuation.
  > It improves the odds but guarantees nothing: if two symbols lie too close together, even a calm average will not help.

> Averaging in software is the same bargain as a longer integration time: calmer values for more time per value.

## Two ways to speed up a transmission: put more symbols into the alphabet, or measure faster. What do they have in common? {#sn-007}

- [ ] Both are free as long as the hardware keeps up, since they only change how the program interprets the readings.
  > Both cost the same thing: the safety margin between what arrives and what can still be told apart reliably.
- [ ] Both require a more sensitive sensor, because the existing hardware cannot resolve finer gradations.
  > A better sensor would shift the limit, but the structure of the problem stays. Even with the best hardware there is a wall; it just stands further out.
- [x] Both shrink the safety margin: once through the distance between symbols, once through more scatter per measurement. They end at the same wall.
  > Exactly: one way pushes the symbols together, the other makes the readings noisier. In both cases the same ratio shrinks, which is why the two together limit the throughput.
- [ ] Both only work if the ambient light stays constant.
  > Constant ambient light always helps but is not what the two ways share. Their common price is the shrinking safety margin.

> More symbols narrow the bands, faster symbols widen the clouds, and both spend the same margin.

## A group documents its colours with one mean each: red 210, orange 245, yellow 280. Why is that not enough to decide on the size of the alphabet? {#sn-008}

- [x] Because the means say nothing about how far the individual readings scatter around them.
  > Exactly: a gap of 35 is plenty if the values vary by ±5 and hopeless at ±30. Every colour therefore needs a measure of spread, at least the smallest and the largest observed value.
- [ ] Because a mean taken from too few measurements can by chance lie too high or too low.
  > True for small series, but it misses the point: even a reliable mean from a hundred readings says nothing about the spread. What is missing is not precision but the second number.
- [ ] Because three colours are too few for a usable alphabet; only from four upwards does each symbol carry two bits.
  > Three symbols are a valid alphabet carrying about one and a half bits. The question is not the count but whether the three are reliably separable.
- [ ] Because the values apparently come from the clear channel, which is unsuitable for colours.
  > The clear channel is a legitimate and often robust choice. With the colour channels the problem would be the same: without a measure of spread, no conclusion.

> A symbol is described by two numbers, its mean and its spread; the mean alone cannot say whether it is usable.

## What does it mean for two states to be "safely distinguishable"? {#sn-009}

- [ ] Their means are different, with a clear gap, when each colour is measured ten times.
  > Different means are the minimum condition but not enough: even with different means the series can overlap.
- [x] Their measurement series do not overlap: even the most extreme values of one still lie clearly on its side of the boundary.
  > Exactly, and it is an empirical finding, not a calculated one: you only see it after measuring often enough. Ten measurements per colour are the minimum for judging it.
- [ ] The receiver assigns them to the correct side of the boundary in at least half the attempts.
  > Half is exactly as good as guessing with two states. Safe means practically always, not better than chance.
- [ ] The two colours look clearly different to the human eye, say red against green.
  > The eye is not the receiver. Two colours that look clearly different to you can be close in sensor values, and the other way round.

> Safely distinguishable means that the clouds do not touch, not even at their outermost readings.

## Around the sensor you build a passive optical setup: tubes, apertures, mirrors, nothing with power. What does it achieve in measurement terms? (Several answers may be correct.) {#sn-010}

- [ ] It amplifies the light of the LED, the way a higher gain at the sensor raises the readings.
  > Passive optics neither create nor amplify light. They can focus and guide it, but the LED gives no more than before. Their benefit lies elsewhere: less stray light and a fixed geometry.
- [x] It keeps out ambient light that would otherwise enter every measurement as a disturbance.
  > Correct, and in a room with ceiling lights it is the biggest lever. Less stray light means less scatter, at no cost in time.
- [x] It stabilises the geometry: distance and angle stay the same between measurements.
  > Correct: a shifted device moves all values, and carefully measured references no longer match. Reproducibility is half of a reliable link.
- [ ] It replaces calibration, because with a fixed tube the values can no longer drift.
  > On the contrary: after every change to the setup you calibrate again, because all levels shift. That is why both measurement series belong in the record, before and after.

> Shielding and a fixed geometry make the spread smaller without costing bits or speed.

## Another group recommends its settings for the same sensor: "Integration time 50 ms, gain 4x, that got us 8 colours." How do you handle that? {#sn-011}

- [ ] Adopt them, since with the same hardware the same settings give the same results.
  > The group has shown something about its own setup: its optics, its distance, its place in the room. Your values can differ considerably.
- [ ] Adopt only the gain, since that depends on the sensor; the integration time, however, depends on your own setup.
  > The split does not hold: the right gain also depends on how much light reaches the sensor, that is on distance, optics and room. Both values are someone else's results; they save time as a starting point but do not replace your own measurements.
- [x] Take them as a starting point and then measure yourself: try several settings and record the hit rate for each.
  > Exactly: the channel is the only reliable authority, and it differs for every setup. The same applies to the suggestions of an AI assistant; those are hypotheses too, not measurements.
- [ ] Set the gain higher than the other group, then you get more than 8 colours.
  > More gain also amplifies the noise and can drive the sensor into saturation. Whether it helps is decided by your measurements, not by the direction of the knob.

> Someone else's settings are a hypothesis about your link, and only your own measurement series tests it.

## Which statements about noise are true? (Several answers may be correct.) {#sn-012}

- [x] Noise can be reduced but never fully removed.
  > Correct: shielding, optics and longer windows push it down, but every measurement keeps a residual fluctuation.
- [x] How much the noise matters depends on the distance between symbols.
  > Correct, which is why the absolute scatter alone is never the answer. What counts is always the ratio of distance to scatter.
- [ ] Noise comes from ambient light; in a darkened room it disappears.
  > Ambient light is a large contribution but not the only one: sensor and electronics are noisy too, and a fluctuation remains even in the dark.
- [x] Measuring faster gives noisier values.
  > Correct, and this is the trade-off in one sentence: a shorter window collects less light and averages less, but fits more symbols into the same second.
- [ ] An error-correcting code makes it unnecessary to think about noise.
  > Error correction helps against the errors that still happen, and it costs extra bits. It does not replace a clean setup, it complements it.

> Noise can be made smaller but never zero, and how much it hurts depends on the distance between the symbols.

## You have measured a link. Its usable range runs from 40 to 840, and every colour scatters around its mean by ±25. How many symbols fit in safely? {#sn-013}

- [ ] 32: the range is 800 wide and the scatter is 25.
  > Here the scatter is counted once. A colour scatters in both directions, so its band is 50 wide, not 25. With 32 symbols neighbouring clouds would overlap.
- [x] 16: every symbol needs a band of 50 (±25), and 800 divided by 50 is 16.
  > Exactly: the usable range divided by the width of one band. And that is not a guess but a calculation you can do before trying anything out.
- [ ] 17: between 16 bands there are 17 boundaries.
  > You count the bands, not the boundaries. Incidentally, between 16 bands there are 15 boundaries, not 17.
- [ ] That cannot be calculated; you have to try the colours out.
  > You will still test in the end, but the number tells you beforehand where you can land. Calculating first saves you from trying alphabet sizes that could never have worked.

> The number of symbols is the usable range divided by the width of one band, and a band is twice the spread.

## You calibrated your colours by the window, in daylight. Later the link is used in the darkened part of the room, with the same device and the same setup. Which statements are true? (Several answers may be correct.) {#sn-014}

- [ ] The measured means still hold, because the LED sends the same colours as before.
  > The sensor does not measure the colour of the LED, it measures all the light that arrives. Without the daylight, that share is missing from every reading, and all the means drop.
- [x] The boundaries between the symbols have to be determined again.
  > The boundaries sit between the old means, and those no longer hold. A boundary that was in the middle by the window may sit beside all the clouds in the dark.
- [x] The scatter can change, because less ambient light usually means calmer readings.
  > In your favour, as it happens: daylight fluctuates, with clouds and with people walking past. In the dark the cloud gets narrower, so more symbols fit than by the window.
- [ ] The ratio of distance to scatter stays the same, because both shift by the same amount.
  > That would be convenient, but it is not true. The distance between two colours and the scatter depend on different things and change independently.
- [x] A fresh calibration where the link is used is needed; a single check reading is not enough.
  > A single reading says nothing about the scatter, and the scatter is what decides. Measure every colour several times again, as you did the first time.

> Means and spread belong to one place and one light, so a link is calibrated again where it is used.
