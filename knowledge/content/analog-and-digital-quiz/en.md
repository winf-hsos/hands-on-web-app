---
type: quiz
code: 6866
title: "Quiz: Analog and digital"
summary: >-
  Fifteen questions on what makes something digital, why more levels bring
  the boundaries closer, what digitising costs and what it buys. Every answer
  comes with its reason.
objectives:
  intro: "This quiz lets you check in fifteen questions whether you can:"
  goals:
    - "tell analog from digital by the one criterion that counts: stepless, or finitely many separated states"
    - "explain why the same noise becomes a problem when the number of regions grows"
    - "say where a link that sends data with light turns from digital to analog and back"
    - "tell sampling from quantising and recognise their traces in a picture"
    - "work out the size of a picture as points times bits per point and judge what fits into a budget"
level: 1
duration: 20
topics: [representing-information, transferring-information]
modules: [dup]
relations:
  checks: [analog-and-digital]
status: published
updated: 2026-11-03
---

## What does it mean for a quantity to be "analog"? {#ad-001}

- [x] It changes continuously: between any two values there are always more.
  > Exactly: continuous means there is no smallest step. The brightness of light is such a quantity, and a light sensor looks at exactly such a world.
- [ ] It comes from a device that works without a computer or program, such as an amplifier or a record player.
  > Whether a computer is involved decides nothing. An amplifier works without a program and still continuously, and conversely a computer can measure continuous quantities. The only question is whether the quantity is continuous or has finitely many states.
- [ ] It belongs to an older, mechanical technology, as with analog photography or the vinyl record.
  > That is the everyday meaning, not the technical term. Technically the only question is whether the quantity is continuous or has finitely many states.
- [ ] It can only be determined roughly: its value is never exact, only ever an estimate.
  > An analog quantity can be arbitrarily precise; it even has infinitely many intermediate values. The problem is not its precision but that a computer cannot handle it as it is.

> Analog means stepless, with another value between any two; age, mechanics and the absence of a computer have nothing to do with it.

## What characterises a digital system? {#ad-002}

- [ ] It works electronically: its states are represented by current or voltage.
  > Electricity is just the usual carrier, not the defining feature. You can be digital with light flashes, flags or paper notes, and a split-flap display is digital without a single chip.
- [x] It knows only finitely many, clearly separated states.
  > That is the definition. Everything else about digital follows from the two words "finite" and "separated".
- [ ] It is automatically more precise than an analog system.
  > On the contrary: crossing into digital deliberately throws precision away. What improves is not precision but reliability.
- [ ] It stores information as characters and text, so that a person could in principle read it.
  > What is stored are states, usually sequences of two states. Whether they mean text, picture or sound is a question of coding, which is a separate step.

> Digital means finitely many states with nothing valid in between, whatever carries them.

## A signal carries the same noise three times; only the number of regions it is divided into grows from two to four to eight. Why do the readings still become less reliable the more regions there are? {#ad-003}

- [ ] Because the noise grows with every additional boundary: each boundary adds its own disturbances to the signal.
  > No, the noise is identical in all three cases. What changes is the other side of the comparison.
- [x] Because the distance between regions shrinks until the same disturbance reaches into the neighbouring region.
  > Exactly: the noise does not grow, the safety margin shrinks. The distance between regions is the reserve against disturbance, and it is spread over ever more boundaries.
- [ ] Because the sensor measures less precisely at fine steps: it can no longer resolve small differences between neighbouring regions cleanly.
  > The sensor knows nothing about the regions; it just delivers values. The regions are drawn afterwards, in the program.
- [ ] Because more regions cost more computing time and readings get lost.
  > Comparing against seven boundaries instead of one makes no measurable difference to the computer. The problem is geometric, not computational.

> Not the noise grows but the margin shrinks, because the same range is cut into more and narrower regions.

## Digitising splits a continuous range of values into finitely many regions. Which statements are true? {#ad-004}

- [x] All values within the same region count as one and the same state afterwards.
  > That is the core: differences within a region are deliberately given up so that the differences between regions count.
- [ ] With enough steps, the difference to the analog quantity disappears completely.
  > It gets smaller but never disappears: finitely many steps remain finitely many. And finer steps are paid for with a shrinking margin against noise.
- [ ] Digitising cleans the signal of disturbances, because afterwards only the region counts and no longer the exact value.
  > Digitising itself cleans nothing; a disturbance that is large enough lands in the neighbouring region. It only becomes robust if the regions are further apart than the disturbance.
- [x] The original exact value cannot be recovered from the digital version.
  > Correct: which of the infinitely many values in the region it was can no longer be determined after the assignment. Digitising is a one-way street.
- [ ] Digitising only works for signals such as light and sound that can be described as waves.
  > It works for anything measurable: temperature, pressure, key travel, mouse movement. Everywhere the same two steps apply: measure, then assign to a region.

> Inside a region every difference is given up for good, and that is exactly what makes the differences between regions reliable.

## Digital technology throws information away when digitising and is still more reliable than analog. Why? {#ad-005}

- [x] Because the few states are far apart: a small disturbance does not change the state and vanishes without trace at the next reading.
  > Exactly: the discarded precision is the price, the purchased distance is the reserve. As long as the disturbance stays smaller than the distance, every reading erases it completely.
- [ ] Because digital components do not produce noise: they only switch between on and off, and no disturbance arises in doing so.
  > Digital circuits are noisy too; physics makes no exception. The difference is that noise below the distance between the states has no consequences.
- [ ] Because less information is transferred, so fewer errors can happen.
  > Sounds plausible but is not the mechanism. A quiet analog signal also carries little information and is still fragile. What matters is the distance between states, not the amount.
- [ ] Because computers automatically detect and remove errors as soon as a value does not fit its surroundings.
  > Error detection exists, but it is a separate, additional ingredient that works with redundancy and checksums. The basic robustness comes earlier, from the distance between the states.

> Digital is reliable because it throws precision away: disturbances smaller than the distance between states vanish at every reading.

## A program reads a brightness value from a sensor and then compares it with a threshold. In terms of digitising, what does the comparison `value > 250` do? {#ad-007}

```python static
value = sensor.read()

if value > 250:
    symbol = "bright"
else:
    symbol = "dark"
```

- [ ] It converts the analog light into a digital value, since only after the comparison is there a genuine digital state.
  > That has already happened: `sensor.read()` delivered the value, and the conversion sits in the sensor. From here on, it is numbers only.
- [ ] It measures the brightness a second time, as a check, so that an outlier from the first measurement does not slip through.
  > A comparison measures nothing; it only decides about a value that is already there. Measuring happens exclusively in the line above.
- [x] It draws the boundary that reduces many possible numbers to two meaningful states: this is where an alphabet is made.
  > Exactly: the sensor delivers hundreds of possible values, and only the boundary turns them into symbols. Where it lies and how many boundaries there are is a design decision.
- [ ] It increases the precision of the measured value, because a fluctuating number becomes an unambiguous result.
  > The opposite: many distinguishable values become two. Exactly this deliberate coarsening buys the robustness.

> The sensor digitises the light into numbers; the threshold is the decision that turns numbers into symbols.

## A music cassette audibly loses quality with every dubbing; a copied file is identical even after the thousandth copy. Why? {#ad-008}

- [ ] Because files are stored compressed, so less data can break during copying.
  > Compression is a different topic, and it tends to make data more sensitive to errors, not less. An uncompressed file also copies perfectly.
- [x] Digital copying reads states and sets them afresh; small disturbances below the distance between states vanish completely each time.
  > Exactly: every digital copy is a rebirth from clean states. The cassette copies the continuous waveform with all its noise and adds its own on top, every generation.
- [ ] Because computers copy far faster than a cassette deck, there is hardly any time for disturbances to creep in.
  > Speed has nothing to do with it. A slow digital copy is just as perfect as a fast one.
- [ ] Because files are not rewritten when copied, only linked; no second version actually comes into being.
  > Links exist, but a real copy is a real second sequence of states, and it is still identical. That is precisely the point.

> Reading a state and setting it afresh erases every disturbance smaller than the distance between states, which is why digital copies do not age.

## What does it mean to "digitise" a signal? {#ad-009}

- [x] To represent it by a finite sequence of numbers.
  > Exactly. That is all the word contains: measure, and assign the measurements to finitely many states. What the numbers mean is settled afterwards by coding.
- [ ] To put it into a form that can be transmitted over the internet.
  > Transmission is a separate step and usually presupposes the numeric form. Digitising happens before, at the crossing from the world to numbers.
- [ ] To shrink it so it needs less storage.
  > That is compression, a different topic. Digitising can even make the data huge; think of uncompressed video.
- [ ] To record it with an electronic device rather than a mechanical one.
  > A cassette recorder is electronic too and still records in analog form, with the voltage as a continuous magnetisation. A signal only becomes digital once it is turned into finitely many numbers.

> Digitising means nothing more than representing a signal by a finite sequence of numbers.

## A link sends data with light: a program sets the brightness of an LED with numbers from 0 to 255, and a colour sensor at the other end turns the light back into numbers. Where is the boundary between analog and digital? {#ad-010}

- [ ] Already at the sender: because the LED is driven with numbers from 0 to 255, its light is digital too.
  > The control is digital, the light itself is not: its brightness is continuous, depends on distance and angle, and ambient light adds to it. Between the two devices the link is analog.
- [ ] Only in the program at the receiving end, when it compares the reading with a threshold.
  > By then the value has long been a number. The comparison reduces many numbers to a few symbols, which matters, but it was digital before that.
- [x] In the colour sensor: it turns the continuous light into numbers, and from there on everything computes with numbers.
  > Exactly. The whole link runs digital, analog, digital: the sender turns numbers into light, the light travels continuously and disturbed through the room, and the sensor turns it back into numbers. The analog middle is the part no program controls, and that is where the reliability of the link is decided.
- [ ] Nowhere: the whole link is digital because there are computers at both ends.
  > The computers at the ends do not change the physics in between. Whoever forgets the analog middle will later be surprised by every disturbance.

> Digital, analog, digital: the boundaries sit at the LED and in the sensor, and the middle belongs to physics.

## Which of these things work digitally in the sense of this concept, that is, with finitely many clearly separated states? {#ad-011}

- [ ] A continuously variable light dimmer
  > Continuous is the opposite of digital: between two brightness levels there is always a third.
- [x] A light switch with on and off
  > Two states, and nothing in between counts: digital in its purest form, with no computer involved. Half-pressed is not a valid state; the switch snaps into one of the two.
- [ ] A dial thermometer
  > The needle moves continuously; every intermediate position is possible and valid. Only reading it against a scale of regions digitises it.
- [x] A die
  > Six states, and nothing valid in between: a die on its edge tips into one position. Exactly this snapping into separated states is what digital means.
- [ ] An hourglass
  > The sand level falls continuously. You may quibble about individual grains, but what is read off is the continuous level.

> Whatever snaps into one of finitely many states is digital, with or without a chip.

## You design an alphabet of colours for a link that sends data with light and decide how many colours it has. What is the core of this decision? {#ad-012}

- [x] A trade-off: more colours carry more per reading but push the regions closer together, and how many are safe is decided by measurements.
  > Exactly: there is no generally correct number, only the correct number for a given setup, its light and its noise. That is why the best-measured alphabet wins, not the boldest.
- [ ] More colours pay off, because each reading then carries more bits and the transmission gets correspondingly faster.
  > Only as long as every reading is still correct. Beyond a certain tightness, recognition errors cost more time than the larger alphabet saves.
- [ ] Two colours are the safe choice, because the largest distance brings the fewest errors and an error costs more than a little speed.
  > Using only two colours despite a large margin gives away speed. Caution has a price too, and only measurement shows whether it is justified.
- [ ] The number is a matter of taste as long as calibration is done properly: calibration puts the boundaries where they are safe.
  > Calibration moves the boundaries to the right places, but it does not widen the distance between them. No amount of calibration helps against regions that are too narrow.

> The size of an alphabet is a trade-off between speed and margin, and the wobble of the readings decides it.

## When digitising a photo, the continuous image becomes 64 × 64 points with 256 brightness levels each. Which of the two steps is the sampling? {#ad-013}

- [ ] Rounding each brightness to one of the 256 agreed levels.
  > That is the second cut, quantising: it slices the value. Sampling slices the axis, here the area of the image.
- [ ] Converting the finished level values into binary numbers.
  > The binary representation comes after both cuts; it no longer changes how many points and levels there are.
- [x] Slicing the continuous image area into the 64 × 64 measurement points.
  > Exactly: sampling slices the axis, area or time, into finitely many measurement points, and how finely is the resolution. Quantising then slices the measured value into levels.
- [ ] Storing the image points in a file with header data.
  > Storing merely packages what sampling and quantising produced before. Both cuts have long happened by then.

> Sampling cuts the axis into points, quantising cuts the value into levels.

## A greyscale picture is digitised with 100 × 100 points and 8 bits per point. How large is the resulting file? {#ad-014}

- [ ] 80,000 bytes, because 100 · 100 · 8 makes 80,000.
  > The arithmetic is right, but its result is bits, not bytes. Only dividing by 8 turns it into the file size in bytes.
- [x] 10,000 bytes, because 100 · 100 · 8 = 80,000 bits, and 8 bits make one byte.
  > Exactly: points times bits per point gives the size in bits, and divided by 8 the size in bytes. This one calculation carries every estimate of a file size.
- [ ] 30,000 bytes, because every point needs three colour channels of one byte each.
  > The three channels belong to colour images with 24 bits per point. Here greyscale with 8 bits is agreed, so one byte per point.
- [ ] 1,250 bytes, because the 100 · 100 bits are further divided by 8.
  > The colour depth got lost here: 100 · 100 only counts the points, but each point carries 8 bits, not one.

> Points times bits per point gives bits, and eight bits make a byte.

## A digitised photo shows clearly visible blocks, but the colours within the blocks look natural and finely graded. Which step of digitising was too coarse? {#ad-015}

- [x] The sampling: too few points for the area.
  > Exactly: blocks are visible sampling points. The colour depth was evidently sufficient, otherwise you would see stripes in the gradients or hard jumps in colour.
- [ ] The quantising: too few levels per colour channel.
  > Quantising that is too coarse looks different, as stripes in smooth gradients or hard jumps in colour, not as blocks. The blocks come from the sampling.
- [ ] The transfer: noise accumulated while copying the file.
  > Digital copies add no noise, which is precisely their advantage. Accumulated noise would look grainy and irregular anyway, not neatly block-shaped.
- [ ] Both steps equally: blocks always arise from the interplay.
  > The two cuts leave separate traces, and that is exactly how you recognise them: blocks point to sampling, stripes to quantising. This picture shows only blocks.

> Blocks mean too few points, hard patches in soft shading mean too few levels.

## Why not simply digitise a picture at the highest resolution and with 24 bits of colour depth before sending it over a slow link that carries 30 bits per second? {#ad-016}

- [ ] Because a colour sensor at the receiving end measures only three channels, so at most 3 bits per point can arrive.
  > The three channels of a sensor do not limit how many bits per point can be transferred, since the bits are sent one after another as symbols anyway. The limit lies elsewhere.
- [ ] Because large files pick up more noise in transfer than small ones.
  > The error probability per symbol depends on the channel, not on the file size. A large file merely offers more opportunities; above all it costs one thing, time.
- [ ] Because more than 8 bits of colour depth cannot be displayed on the receiver's screen.
  > Ordinary screens display exactly those 24 bits, 8 per channel. Displayability is not the problem; the price of every kept bit on the way there is.
- [x] Because every point and every level costs bits, and at 30 bits per second a large picture would take hours.
  > Exactly: points times bits per point gives the file size, and the rate of the link turns it into time; 256 × 256 points in full colour would take more than 14 hours. Digitising therefore means weighing which detail is worth the time.

> On a slow link every kept bit costs time, so the resolution and the colour depth are a trade-off, not a matter of "as fine as possible".
