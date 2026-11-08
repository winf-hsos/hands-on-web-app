---
type: quiz
code: 8283
formerly: [measurement-and-experiments-quiz]
title: "Quiz: signal and noise"
summary: >-
  Eighteen questions on what a sensor really returns, noise and averaging, the
  ratio of distance to spread, how many symbols fit into a link, what each way
  of improving it costs, and what makes a measurement series evidence. Every
  answer comes with its reason.
level: 1
duration: 20
topics: [transferring-information]
modules: [dup]
relations:
  checks: [signal-and-noise]
  see_also: [signal-and-noise-slides]
status: draft
updated: 2026-11-08
---

## Which statements about the values of a colour sensor that reads the light of an LED are true? (Several answers may be correct.) {#me-005}

- [ ] It delivers three values, red, green and blue, matching the three lamps inside the LED.
  > There are four: besides red, green and blue there is the clear channel, which measures without a filter. The symmetry with the LED is tempting, but the sensor is a different part with its own logic.
- [x] Besides red, green and blue there is a fourth, unfiltered channel (clear).
  > Correct: clear measures all incoming light without a colour filter and is therefore more sensitive than the three colour channels.
- [x] The measured values do not simply match the RGB numbers the sender puts into its LED.
  > Correct: overlapping colour filters, distance and ambient light shift the values. A transmitted (255, 0, 0) never arrives as (255, 0, 0).
- [ ] With the LED off, all channels read zero, because without a sender no light reaches the sensor.
  > No: the sender is not the only light source. Ambient light is always present, and that is exactly why the control measurement is needed as a baseline.

> The sensor returns four numbers, `r`, `g`, `b` and `c`, and none of them is the number that was sent.

## A sender puts (255, 0, 0) into its LED, but the sensor reads r=203, g=41, b=57. How do you deal with that? {#me-007}

- [ ] Complain about the sensor: an intact sensor should read (255, 0, 0) when (255, 0, 0) is sent.
  > The sensor is fine. Overlapping colour filters, distance and ambient light ensure that readings never equal the transmitted numbers.
- [x] Measure how each transmitted colour arrives, and match future readings to these learned patterns.
  > Exactly: calibrate and classify. Do not try to compute back what was sent; learn each colour's typical arrival pattern and match new readings to the nearest one.
- [ ] Derive a conversion formula that computes the exact transmitted RGB numbers back from the readings.
  > Tempting but fragile: the distortion depends on distance, ambient light and noise, and changes with them. The back-computation that works today fails tomorrow.
- [ ] Turn the LED brighter until the readings match the transmitted values.
  > The numbers live in different worlds: drive values of the LED against readings of the sensor. No brightness makes them coincide.

> Calibrate, then classify: references of known colours, and every new reading goes to the nearest of them.

## Before measuring the colours of an LED with a colour sensor, you take a control measurement: readings while the LED is switched off. What for? {#me-003}

- [ ] To check whether the sensor responds at all, before time goes into the real measurements.
  > A quick function check comes for free, but it would not need a recorded series. The purpose lies in the values themselves: they are the reference for everything that follows.
- [ ] So that the sensor adjusts to the ambient light and afterwards subtracts it from the readings by itself.
  > The sensor learns nothing and subtracts nothing; it keeps delivering raw values including room light. Relating the readings to the baseline is your job, in your program and in your interpretation.
- [x] To know what the sensor measures from ambient light anyway; only against that can the readings with the LED on be interpreted.
  > Exactly: the sensor never reads zero, because room light is always there. The control measurement is the baseline every colour reading is compared against, and it reveals when the surroundings change.
- [ ] To see how much the readings scatter without light; once the LED is on, the noise disappears in the signal anyway.
  > Recording the spread is right, the conclusion is not: noise does not vanish once there is a signal, it still sits on every reading. And the main purpose remains the baseline every colour reading is read against.

> Every reading contains ambient light, the light of the LED and noise; the control reading measures the first part, so that the second can be read off.

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

## Why do you decide before a measurement series what result you expect, instead of just measuring and then having a look? {#me-010}

- [ ] Because the sensor settings can only be chosen sensibly once it is clear beforehand which values are supposed to come out.
  > The settings follow the setup and the ambient light, not the hoped-for result. The sensor measures with any setting; the problem arises later, when interpreting the values.
- [ ] So the series can be stopped as soon as the expected result is reached, avoiding superfluous repetitions.
  > That would be exactly the bias to avoid: stopping as soon as it fits collects evidence for your own hopes. The number of repetitions is fixed beforehand and carried through.
- [x] Without an expectation set beforehand, almost any result can be interpreted as a success afterwards.
  > Exactly: measuring first and deciding afterwards what counts as "good" silently bends the interpretation towards the hoped-for result. An expectation written down beforehand turns the measurement into an honest yes-or-no test.
- [ ] Because a record without a written expectation does not count as a measurement series, only as a collection of single values.
  > What makes a measurement series is repetition and recorded conditions, not the expectation. It serves not the form but the protection against fooling yourself.

> The expectation written down beforehand protects you from reading your own hopes into the data afterwards.

## Between two measurement series, a group changes both the distance between sender and sensor and the integration time. The second series is clearly better. What do they know now? {#me-002}

- [ ] That both changes helped, otherwise the second series would not be so clearly better.
  > How clear the improvement is says nothing about how it splits: it may have been one change alone, and the other may even have hurt without anyone noticing.
- [x] That it got better, but not what caused it.
  > Exactly the problem: two quantities changed at once can no longer be separated in the result. That is why you change one quantity per series.
- [ ] That the distance was decisive, since it has the stronger physical effect.
  > That is a guess dressed up as a result. How strongly each quantity acts was precisely the open question.
- [ ] That the series is unusable and has to be repeated before anything can be said at all.
  > That is stricter than necessary: the series does show that the combination helps. It just does not tell which part did what; two clean follow-up series with one change each will.

> Change exactly one quantity per series, otherwise a difference cannot be put down to its cause.

## What belongs in the record of a measurement series? (Several answers may be correct.) {#me-008}

- [x] What was changed and what stayed constant.
  > Correct: without this you cannot later say what a difference was due to.
- [x] The setup: distance, ambient light, sensor settings.
  > Correct: only with the conditions is a measurement repeatable and comparable with others.
- [x] All readings, including the inconvenient ones.
  > Correct: recording only the nice values is not measuring but collecting evidence for one's own hopes. Outliers are often the most interesting information.
- [x] How many times the measurement was repeated.
  > Correct: whether a result rests on 5 or on 50 repetitions decides how much weight it can bear.

> The record holds the conditions, the changed quantity, the number of repetitions and every value, so that someone else could repeat the series.

## A receiver is supposed to tell red from blue. In a test it is right 5 times out of 5, and someone says: "Done, it works." What is the catch? {#me-009}

- [ ] Nothing, five hits without a single miss are solid proof that the distinction works.
  > With two colours, pure guessing gets five hits in a row with a probability of about three percent. In a room full of groups that happens somewhere all the time.
- [x] Five hits can still be luck with two colours; only many repetitions separate skill from chance.
  > Exactly: guessing hits 50 percent per trial. 5 out of 5 happens by chance in roughly one run in 32; 50 out of 50 practically never. That is why receivers are tested with long series.
- [ ] The test should have used more than two colours.
  > The task was red against blue; more colours are a different, later task. The catch is the small number of trials, not the number of colours.
- [ ] Five hits only show that the threshold happens to fit; what matters is how far the mean of the readings sits from the threshold.
  > The margin to the threshold is a useful quantity, but a mean from a few readings is itself just one draw. The catch remains the small number of trials, not where the threshold sits.

> The chance of five hits in a row by guessing is 0.5⁵ = 1/32, the chance of fifty is 1 in 2⁵⁰.

## An AI assistant suggested increasing the sensor's gain, "that improves recognition". Your clean measurement series shows the opposite: the recognition rate drops. What do you do? (Several answers may be correct.) {#me-012}

- [x] Document the measurement series including its conditions.
  > Correct: without recorded conditions the contradiction can neither be retraced nor repeated later.
- [ ] Distrust the measurement; the AI knows such sensors better than you.
  > The wrong way round: the AI knows sensors of this kind, but not your setup. The measurement on the real device is the ground truth no language model has access to.
- [x] Briefly check that the series was clean: one quantity changed, enough repetitions, a control measurement in place.
  > Correct: before filing a suggestion as refuted, your own measurement deserves scrutiny. Only a clean series can carry the contradiction.
- [x] Add the case to a log of mistakes: suggestion, measurement, outcome.
  > Correct: that is exactly what such a log is for. Documented cases in which a measurement refuted a suggestion are among the things you learn most from.
- [ ] Keep the higher gain anyway, since a single contradicting measurement series carries less weight than a well-reasoned recommendation.
  > The weighting is upside down: a rationale says why something should hold, the clean series shows what holds in your setup. Deciding against your own clean measurement means giving up on measuring.

> Check your own series first; if it was clean, it outweighs the suggestion, and the case goes into the log of mistakes.

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
