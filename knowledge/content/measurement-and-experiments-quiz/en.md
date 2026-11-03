---
type: quiz
code: 7212
title: "Quiz: measuring and experimenting"
summary: >-
  Twelve questions on what a sensor really returns, why readings scatter,
  what a control reading and the integration time are for, and what makes a
  measurement series evidence. Every answer comes with its reason.
objectives:
  intro: "This quiz lets you check in twelve questions whether you can:"
  goals:
    - "explain why only a measurement on the setup itself decides how it behaves, and not an explanation or a suggestion"
    - "explain why a colour sensor returns four values that never match what was sent, and why you calibrate instead of calculating back"
    - "explain what a control reading with the LED switched off and a shorter integration time do to the readings"
    - "name what makes a measurement series and what belongs in its record"
    - "tell a lucky streak from a reliable result by the number of repetitions"
level: 1
duration: 15
topics: [transferring-information]
modules: [dup]
relations:
  checks: [measurement-and-experiments]
status: published
updated: 2026-11-01
---

## An AI assistant suggests doubling a sensor's integration time, "then the readings will get better". Why is this advice not enough? {#me-001}

- [ ] Because the suggestion comes from general knowledge about sensors; only confirmation by an expert makes it reliable.
  > A second opinion is still just an opinion. Even the most knowledgeable person does not know this particular setup; only measuring on it makes the suggestion reliable.
- [ ] Because the assistant does not explain why a longer window yields calmer readings; with a sound explanation the advice would be sufficient.
  > A sound explanation is no substitute for a measurement. It says why something should happen, not whether it happens in this setup and how strongly. That is precisely the fallacy of mistaking reasoning for measuring.
- [x] Because nothing but the setup itself knows how the setup behaves; a measurement decides that.
  > Exactly: the physical channel is the ground truth no language model has access to. Whether "better" is true only shows in a measurement series before and after the change.
- [ ] Because "better" can only be judged once the assistant also predicts which values the sensor will deliver after the change.
  > A prediction is still just a claim, merely with numbers attached. Whether it holds is decided by the same measurement series that would have to test the original suggestion anyway.

> A suggestion, an explanation and a prediction are all claims, and only a measurement on the setup itself turns one of them into evidence.

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

## You measure the same red LED five times in a row and get these red components: 198, 205, 201, 195, 206. What follows? {#me-004}

- [ ] The sensor is broken, otherwise the same value would appear five times.
  > Spread is the normal case of any real measurement: noise from sensor, light and surroundings. Five identical values would be more suspicious.
- [x] Readings scatter; if you need a stable value, average over several measurements.
  > Exactly: single values jump, the average (about 201 here) sits still. That is why you read several times and average instead of trusting one reading. And the scatter itself is a result: it belongs in the record, because later it decides how many colours can be told apart.
- [ ] The LED slowly gets weaker while being measured.
  > The values go up and down, not steadily downhill. That is noise, not a trend.
- [ ] Only the last value counts, since the sensor had settled by then.
  > The last value is just one more draw from the same spread. It is no truer than the other four.

> A single reading is a draw; the mean of several is stable, and the spread around it is a result of its own.

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

## A sensor can read the same light with long, medium or short reading windows. To transmit faster, a group shortens the sensor's integration time drastically. What should it expect? {#me-006}

- [ ] The readings stay as calm as before and arrive more often; the window only sets how often the sensor delivers a new value.
  > The rate part is right, the calm part is not: the window also sets how much light one reading averages over. Shorter means less light per reading, so the noise hits harder.
- [ ] The readings get calmer because the sensor has less time to be noisy.
  > The other way round: a short window averages over less light, so the noise hits harder, and single short readings cross into the neighbouring level.
- [x] More readings per second, but with more spread; single readings may cross into the wrong level.
  > Exactly the trade-off: short windows for a high symbol rate against long windows for calm readings. Where the limit of a setup lies, only a measurement series can tell.
- [ ] The readings scatter more, but the number of readings per second drops too.
  > Half right, half wrong: the spread increases, but a shorter window allows more readings per second, not fewer. Otherwise there would be no trade-off.

> Longer is calmer and shorter is faster: the integration time trades calm readings against speed.

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

## What makes a measurement series, as opposed to a single measurement? {#me-011}

- [ ] That the measuring is done with special care: a steady setup, a properly configured sensor, and every value written down immediately.
  > Care is part of it but does not make a series: a single careful measurement is still one draw. The difference lies in repetition, recorded conditions and the single changed quantity.
- [x] Several measurements under equal, recorded conditions, with at most one quantity changed on purpose.
  > Exactly: repetition captures the spread, the recorded conditions make it repeatable, and the single changed quantity makes differences interpretable.
- [ ] As many measurements as possible at as many different settings as possible, so that every relationship can be read from the data afterwards.
  > Measuring a lot by itself yields a pile of data. If several quantities changed between two values at once, no relationship can be attributed cleanly afterwards; hence one quantity per series.
- [ ] The same measurement at different times of day, so that random fluctuations cancel out on average.
  > Repeating is right, but at different times of day the ambient light changes without plan. The conditions then shift along, and nobody knows whether a difference comes from chance or from the light.

> Repetition, recorded conditions and one changed quantity turn single readings into a measurement series.

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
