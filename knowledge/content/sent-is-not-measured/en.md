---
title: Sent is not measured
summary: >-
  Set the LED to pure red and read what the sensor makes of it, then change
  the light, a hand and the distance, and end up facing the question of how to
  work back from four numbers to the colour that was sent.
objectives:
  intro: "In this experiment you compare the colour you send to the LED with what the sensor measures from it, and afterwards you can:"
  goals:
    - "write down an expectation before measuring and compare it with the readings afterwards"
    - "explain why the sensor reports values in `g`, `b` and `c` as well when the LED shows pure red `(255, 0, 0)`"
    - "carry out a measurement series in which you change exactly one condition at a time and read each condition five times"
    - "describe how the ceiling light, a hand in the beam and the distance change the four values, and how much they vary even without any change"
    - "argue why you cannot simply calculate back from the readings to the colour that was sent"
translation_of: de
based_on: 2026-11-01
---

You give the LED a colour whose numbers you know exactly and read what the
sensor makes of it. Something different comes out from what you put in, and
that leads to the question this experiment ends with.

## What you need

- two devices with an RGB LED and a colour sensor, or one device and a white
  sheet of paper
- a program that sets the LED to a colour and prints the sensor's four
  readings; the measuring program from Challenge 0 of the LiFi project will do
- a ruler, paper and pen

## Setup

Place the two devices about five centimetres apart so that the LED of one
shines into the sensor of the other. With only one device, hold the white
sheet about five centimetres in front of it so that the LED's light falls back
into its own sensor. Write down the distance and whether the ceiling light is
on.

## Before: your expectation

The LED gets pure red, that is `(255, 0, 0)`. Write down, **before** you
measure, which four numbers you think the sensor will report: `r`, `g`, `b`
and `c`, the channel without a colour filter.

## Round 1: pure red

Set the LED to `(255, 0, 0)` and read the four values five times in a row
without changing anything. Enter all five readings in the measurement table,
not just the nicest one.

## Round 2: one change after the other

Change exactly one condition at a time, read five times again and put
everything back before the next change:

1. Ceiling light off.
2. A hand halfway between the LED and the sensor.
3. Double the distance, to about ten centimetres.

> [!TIP]
> Before each change, write down which of the four values you think will
> change the most. Afterwards you can see whether you already understand the
> sensor or are only watching it.

## Measurement table

Each cell takes the five readings, separated by commas.

| Condition | r | g | b | c |
|---|---|---|---|---|
| Expectation | | | | |
| Red, starting point | | | | |
| Ceiling light off | | | | |
| Hand in between | | | | |
| Double distance | | | | |

## Evaluation

- How far apart were your expectation and the measurement? Why do green and
  blue show any values at all, although the LED only shines red?
- Which of the four values reacted most strongly to the ceiling light, and
  which to the distance?
- How much do the five readings of one condition vary, although you changed
  nothing while taking them?
- And the question that remains: how do you want to work back from four such
  numbers to the colour that was sent, when the same colour gives different
  numbers in every light and at every distance?

How you can still decide reliably with numbers like these, and why a single
reading is never enough for it, is shown in the lesson
[[measurement-and-experiments]].
