# Script: drawing the line

These notes accompany the stagekit deck "drawing the line". They explain the contents of the slides for reading afterwards. Build-up steps and the segments of an animation count as frames of their own in the player and in the export; the references therefore refer to frames.

The core message is: a sensor delivers a stepless range of values, but a program needs states, and in between lies a decision nobody takes for you, namely how many boundaries there are and where they lie.

The running example is a link that transmits data with light: an LED sends, a colour sensor measures. Any other sensor behaves the same in principle.

## 1. A world without steps

### Is this digital? (Frame 4)

A split-flap board in a railway station from before the age of chips clatters letter by letter into place. There is no computer anywhere near it, and the thing is nonetheless perfectly digital: every flap knows exactly two positions, up or down, and while it turns there is no valid state in between. That is exactly why you can read the board from twenty metres away.

### Digital is not the same as electronic (Frame 5)

The scoreboard from the sports hall that you flip by hand is digital, and so are the light switch, the abacus and the die. The slide rule, the dial thermometer, the dimmer and the hourglass are analog. Not one of these things contains a chip, so digital cannot mean electronic. Electronics is only today's usual carrier, and the reverse holds as well: an amplifier is electronic and still stepless.

### The word for it (Frame 6)

**Digital means finitely many states, and nothing in between counts.** The second half is the important one: a reading that lies somewhere between the states is simply assigned to the nearest state, so a small disturbance has no effect.

### The same disturbance, twice (Frames 7 and 8)

The same disturbance hits two signals. Each world has two upright scales from 0 to 400, the sender's on the left and the receiver's on the right, so that the way from sender to receiver runs across and the value runs up. The sender sends 300, the white dot, and 23 are added on the way, so 323 arrives, the yellow dot; a dashed line marks where 300 would have been. In an analog signal every value counts, so the received value is simply a different value, and the disturbance has become part of the signal. In a digital signal only the region counts: a boundary at 200 cuts both scales into dark and bright, 323 lies in the bright region just like 300, and so it still means the same state. A small disturbance changes the value, but not the state.

### The part no program controls (Frame 9)

The sender turns numbers into light, for example `(255, 0, 0)` for pure red, and the sensor turns light back into numbers such as `r = 203`, `g = 41`, `b = 57`: digital, analog, digital. The middle is physics. It is stepless, and many things disturb it: ambient light from the windows and the ceiling lamps, reflections from the table and from clothes, the distance and the angle between LED and sensor, and the noise of the sensor itself, which never measures exactly the same value twice. No program controls any of this. Whoever forgets this analog middle will later be surprised by every disturbance, and whoever takes it seriously knows why you have to measure.

### Light has no steps, but your program needs them (Frames 10 and 11)

Light is analog: between any two brightnesses lies another, and there is no smallest step. A program needs the opposite, namely a few states that are clearly apart, for example four grey levels numbered 0 to 3. Digitising turns the stepless light into such a few states.

### The same scatter, cut into more regions (Frames 12 to 14)

The vertical axis is what the sensor reports, for example the reading of the clear channel: low readings at the bottom, high ones at the top. Each of the three columns is the same range of readings, cut into two, four and eight regions, so into two, four and eight colours or brightness levels of an alphabet.

Each dot is one reading while the sender keeps sending the same colour. The readings never agree exactly, because of the disturbances from the middle part, and the grey band shows how far they scatter. The scatter is the same in every column, because the light link is the same. With two regions the band sits comfortably inside its own region. On the next frame the range is cut into four, and it gets tight, but every reading stays inside. On the last frame it is cut into eight, the same band now reaches across the boundaries, and three readings land in a neighbouring region (red), so the receiver reads the wrong symbol.

The readings scatter as much as before, but with more regions some land in the wrong one. The distance between the boundaries is the safety reserve, and more regions spread the same reserve over more boundaries. This is the question of Challenge 1 in the LiFi project: how many states a link tells apart over 20 attempts without a single error.

### What the thrown-away precision buys (Frames 15 to 18)

Two copy chains grow by one generation per frame. Above, a tape: each copy records the wave of the previous copy, together with all the noise already in it, and adds its own. The noise therefore piles up, and the wave in the boxes gets rougher from copy to copy. Below, a file: at every copy the bits are read, `0110` is recognised, and the copy is set again from these clean bits, so `0110` stays `0110`.

Every disturbance smaller than the distance between the states disappears completely in the process. Every digital copy is reborn from clean states, so it never inherits the noise, and that is why the thousandth copy of a file is still the original. Digital technology is reliable not although it throws information away but because it does.

## 2. Two cuts and a price

### Digitising throws information away (Frame 20)

Digitising throws information away, and it does so on purpose. Which of the infinitely many values inside a region it really was cannot be determined after the assignment. Digitising is a one-way street, and that is not an accident but the price for copies without loss.

### Digitising takes two cuts (Frames 21 and 22)

A photo shows both cuts. The **first cut goes through the area**: the stepless picture becomes measuring points, sixteen by sixteen on the slide. That is **sampling**, and how fine it is, is the **resolution**.

The **second cut goes through the value**: the brightness of every point is rounded to one of the agreed levels, four grey levels on the slide. That is **quantization**, and the number of levels is the **colour depth**. Those levels are exactly the regions from the first part, now applied to a picture.

### Which cut was too coarse? (Frame 23)

Both cuts throw detail away, but they leave different traces, and that is how you tell which knob to turn. **Blocks** mean too few points, so sampling was too coarse. **Hard patches instead of soft shading** mean too few levels, so quantization was too coarse.

### What a picture costs (Frame 24)

One piece of arithmetic carries every file size: **points × bits per point.** A picture of 64 by 64 points in 24-bit colour is 98,304 bits, so 12 KB. The same picture with one bit per point is 4,096 bits, so 512 bytes.

Over a light link this turns into time straight away. At 30 bit/s the first picture takes about 55 minutes, the second about two. Resolution and colour depth are therefore not fine details but the two levers the transmission time depends on: what you keep, you pay for in minutes.

### How far can you go? (Frames 25 to 28)

The same photo gets coarser with every frame: 128, 32, 8 and finally 2 points per edge, from 49,152 bytes down to 12. Somewhere in between, the picture stops being recognisable, and people disagree about where exactly. That disagreement is the point: there is no correct amount, only a trade-off against the transmission time. Whoever wants to send a picture over a light link faces exactly this question.

### The same two cuts for sound (Frames 29 to 31)

The two cuts are not a picture topic but the method, and for sound they can be seen on a single curve. The first frame shows the sound wave, stepless. On the second, the first cut measures it at twelve points in time: that is sampling, and for sound it slices time instead of area. On the third, the second cut rounds every reading to one of four amplitude levels: that is quantization, and for sound it slices the amplitude instead of brightness. Every panel has its axes, time to the right and amplitude upwards; the amplitude is how far the air is pushed out of place at that moment, which a microphone turns into a voltage. A CD stores 44,100 samples per second with 16 bits each. Turn the sampling rate of a recording down, and a voice soon sounds tinny.

## 3. Drawing your own lines

### Where your alphabet is born (Frame 33)

```python
from lifi_hardware import sensor
r, g, b, c = sensor.read()

if c > 250:
    symbol = "bright"
else:
    symbol = "dark"
```

The line `if c > 250:` is the place where thousands of possible readings of the clear channel turn into two symbols. The threshold is not a constant of nature but a decision, and from here on it is the threshold that holds, not the physics. The value 250 is only an example; where the threshold belongs does not come from your gut but from your own measurement series: calibrate first, then compare.

### How many colours are safe? (Frames 34 and 35)

Two colours are safe, and eight are fast. Somewhere in between sits your alphabet, and only your own measurements know where: the width of a region has to match the scatter of the readings, or individual readings slip into the neighbouring region. And how far they scatter is known only to whoever has measured it.

### To close (Frames 36 and 37)

You decide where the lines go, and from there on your decision is the truth, not the physics. Physics delivers a stepless range of values and not a single line with it. Every line in your system is there because someone wrote it there, and that is also why it is your problem when it is in the wrong place.
