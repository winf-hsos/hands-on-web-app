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

**Digital means finitely many states, and nothing in between counts.** Both halves carry weight, but the second one carries the work: because nothing between the states counts, every disturbance that stays between them disappears as well.

### The part no program controls (Frame 7)

The sender turns numbers into light, for example `(255, 0, 0)` for pure red, and the sensor turns light back into numbers such as `r = 203`, `g = 41`, `b = 57`: digital, analog, digital. The middle is physics. It is stepless and disturbed by ambient light, distance and noise, and no program controls it. Whoever forgets this analog middle will later be surprised by every disturbance, and whoever takes it seriously knows why you have to measure.

### Stepless versus states (Frames 8 and 9)

Light is analog: between any two brightnesses lies another, and there is no smallest step. A program needs the opposite, namely finitely many states that are clearly apart. Digitising a signal therefore means representing it by a finite sequence of numbers.

### Same wobble, more regions (Frames 10 to 12)

Each of the three columns is the same range of readings, cut into two, four and eight regions. In every column the same seven readings scatter with the same wobble around the centre of one region; the grey band marks how far they spread. With two regions the band sits comfortably inside its own region. On the next frame the range is cut into four, and it gets tight, but every reading stays inside. On the last frame it is cut into eight, the same band now reaches across the boundaries, and three readings land in a neighbouring region (red).

The wobble stays the same, but more regions leave each one a smaller margin. The distance between the boundaries is the safety reserve, and more regions spread the same reserve over more boundaries. This is the question of Challenge 1 in the LiFi project: how many states a link tells apart over 50 attempts without a single error.

### What the thrown-away precision buys (Frames 13 to 16)

Two copy chains grow by one generation per frame. Above, the tape copies its stepless wave along with the noise of the previous copy and adds its own, so the wave gets rougher with every generation. Below, the file is read at every copy and set again from clean states, so `0110` stays `0110`.

Every disturbance smaller than the distance between the states disappears completely in the process. Every digital copy is reborn from clean states, so it never inherits the noise, and that is why the thousandth copy of a file is still the original. Digital technology is reliable not although it throws information away but because it does.

## 2. Two cuts and a price

### Digitising throws information away (Frame 18)

Digitising throws information away, and it does so on purpose. Which of the infinitely many values inside a region it really was cannot be determined after the assignment. Digitising is a one-way street, and that is not an accident but the price for copies without loss.

### Digitising takes two cuts (Frames 19 and 20)

A photo shows both cuts. The **first cut goes through the area**: the stepless picture becomes measuring points, sixteen by sixteen on the slide. That is **sampling**, and how fine it is, is the **resolution**.

The **second cut goes through the value**: the brightness of every point is rounded to one of the agreed levels, four grey levels on the slide. That is **quantization**, and the number of levels is the **colour depth**. Those levels are exactly the regions from the first part, now applied to a picture.

### Which cut was too coarse? (Frame 21)

Both cuts throw detail away, but they leave different traces, and that is how you tell which knob to turn. **Blocks** mean too few points, so sampling was too coarse. **Hard patches instead of soft shading** mean too few levels, so quantization was too coarse.

### What a picture costs (Frame 22)

One piece of arithmetic carries every file size: **points × bits per point.** A picture of 64 by 64 points in 24-bit colour is 98,304 bits, so 12 KB. The same picture with one bit per point is 4,096 bits, so 512 bytes.

Over a light link this turns into time straight away. At 30 bit/s the first picture takes about 55 minutes, the second about two. Resolution and colour depth are therefore not fine details but the two levers the transmission time depends on: what you keep, you pay for in minutes.

### How far can you go? (Frames 23 to 26)

The same photo gets coarser with every frame: 128, 32, 8 and finally 2 points per edge, from 49,152 bytes down to 12. Somewhere in between, the picture stops being recognisable, and people disagree about where exactly. That disagreement is the point: there is no correct amount, only a trade-off against the transmission time. Whoever wants to send a picture over a light link faces exactly this question.

### The same two cuts for sound (Frame 27)

The two cuts are not a picture topic but the method. For sound, sampling slices time instead of area, and quantization slices loudness instead of brightness. A CD stores 44,100 samples per second with 16 bits each. Turn the sampling rate of a recording down, and a voice soon sounds tinny.

## 3. Drawing your own lines

### Where your alphabet is born (Frame 29)

```python
from lifi_hardware import sensor
r, g, b, c = sensor.read()

if c > 250:
    symbol = "bright"
else:
    symbol = "dark"
print(symbol)
```

The line `if c > 250:` is the place where thousands of possible readings of the clear channel turn into two symbols. The threshold is not a constant of nature but a decision, and from here on it is the threshold that holds, not the physics. The value 250 is only an example; where the threshold belongs does not come from your gut but from your own measurement series: calibrate first, then compare.

### How many colours are safe? (Frames 30 and 31)

Two colours are safe, and eight are fast. Somewhere in between sits your alphabet, and only your own measurements know where: the width of a region has to match the wobble, or individual readings slip into the neighbouring region. And the wobble is known only to whoever has measured it.

### To close (Frames 32 and 33)

You decide where the lines go, and from there on your decision is the truth, not the physics. Physics delivers a stepless range of values and not a single line with it. Every line in your system is there because someone wrote it there, and that is also why it is your problem when it is in the wrong place.
